import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { absensi, titikAbsensi } from '../../db/schema/absensi';
import { pegawai } from '../../db/schema/pegawai';
import { unitKerja } from '../../db/schema/organisasi';
import { eq, and, desc } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';
import { isWithinRadius } from '../../lib/geo';
import { uploadFile } from '../../lib/penyimpanan';
import sharp from 'sharp';

export const absensiRoutes = new Elysia({ prefix: '/v1/absensi' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 📍 POST /v1/absensi/titik
  // Submit titik absensi (jam_masuk / jam_pulang) + GPS + Selfie
  // -----------------------------------------------------------
  .post(
    '/titik',
    async ({ body, user, set }: any) => {
      try {
        if (!user || !user.id_pegawai) {
          set.status = 400;
          return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
        }

        const { jenis_titik, latitude, longitude, foto, catatan } = body;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Ambil data pegawai + unit kerja untuk validasi radius
        const pegawaiData = await db.select().from(pegawai)
          .where(eq(pegawai.id, user.id_pegawai)).limit(1);
        if (pegawaiData.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Data pegawai tidak ditemukan' };
        }

        const unitData = await db.select().from(unitKerja)
          .where(eq(unitKerja.id, pegawaiData[0].id_unit_kerja)).limit(1);
        if (unitData.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Unit kerja tidak ditemukan' };
        }

        // Validasi radius GPS
        const unit = unitData[0];
        const dalamRadius = isWithinRadius(
          latitude, longitude,
          parseFloat(unit.latitude as string),
          parseFloat(unit.longitude as string),
          unit.radius_absensi_meter
        );

        if (!dalamRadius) {
          set.status = 400;
          return {
            status: 'error',
            message: 'Anda berada di luar jangkauan radius absensi unit kerja',
            data: { radius_meter: unit.radius_absensi_meter }
          };
        }

        // Upload foto selfie ke MinIO (kompres dulu)
        let urlFoto: string | null = null;
        if (foto) {
          const buffer = Buffer.from(await foto.arrayBuffer());
          const compressed = await sharp(buffer).resize(640, 640, { fit: 'inside' }).webp({ quality: 75 }).toBuffer();
          const key = `absensi/${user.id_pegawai}/${today}_${jenis_titik}_${Date.now()}.webp`;
          urlFoto = await uploadFile(key, compressed, 'image/webp');
        }

        // Cari/buat record absensi hari ini
        let absensiHariIni = await db.select().from(absensi)
          .where(and(eq(absensi.id_pegawai, user.id_pegawai), eq(absensi.tanggal, today)))
          .limit(1);

        let absensiId: string;

        if (absensiHariIni.length === 0) {
          // Belum ada → buat baru (hanya saat jam_masuk)
          if (jenis_titik !== 'jam_masuk') {
            set.status = 400;
            return { status: 'error', message: 'Anda belum melakukan absen masuk hari ini' };
          }

          const inserted = await db.insert(absensi).values({
            id_pegawai: user.id_pegawai,
            tanggal: today,
            tipe: 'kantor',
            status: 'hadir',
          }).returning();
          absensiId = inserted[0].id;
        } else {
          absensiId = absensiHariIni[0].id;

          // Cek duplikat titik
          const existingTitik = await db.select().from(titikAbsensi)
            .where(and(eq(titikAbsensi.id_absensi, absensiId), eq(titikAbsensi.jenis_titik, jenis_titik)));
          if (existingTitik.length > 0) {
            set.status = 400;
            return { status: 'error', message: `Anda sudah melakukan absen ${jenis_titik} hari ini` };
          }
        }

        // Simpan titik absensi
        const titik = await db.insert(titikAbsensi).values({
          id_absensi: absensiId,
          jenis_titik,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          url_foto: urlFoto,
          dalam_radius: dalamRadius,
          catatan,
        }).returning();

        // Jika jam_pulang → hitung jam kerja
        if (jenis_titik === 'jam_pulang') {
          const semuaTitik = await db.select().from(titikAbsensi)
            .where(eq(titikAbsensi.id_absensi, absensiId));
          const titikMasuk = semuaTitik.find(t => t.jenis_titik === 'jam_masuk');
          if (titikMasuk) {
            const masuk = new Date(titikMasuk.waktu).getTime();
            const pulang = new Date(titik[0].waktu).getTime();
            const jamKerja = ((pulang - masuk) / 3600000).toFixed(2);
            await db.update(absensi).set({
              jam_kerja: jamKerja,
              diperbarui_pada: new Date(),
            }).where(eq(absensi.id, absensiId));
          }
        }

        return {
          status: 'success',
          message: `Absen ${jenis_titik} berhasil dicatat`,
          data: titik[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        jenis_titik: t.String(), // 'jam_masuk' atau 'jam_pulang'
        latitude: t.Number(),
        longitude: t.Number(),
        foto: t.Optional(t.File()), // Selfie
        catatan: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // 📋 POST /v1/absensi/manual
  // Pimpinan mengabsenkan bawahan secara manual
  // -----------------------------------------------------------
  .post(
    '/manual',
    async ({ body, user, set }: any) => {
      try {
        const allowedRoles = ['pimpinan', 'admin_unit', 'admin_upt', 'admin_dinas'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Hanya pimpinan/admin yang bisa mengabsenkan manual' };
        }

        const { id_pegawai, jenis_titik, catatan } = body;
        const today = new Date().toISOString().split('T')[0];

        // Cari/buat record absensi hari ini
        let absensiHariIni = await db.select().from(absensi)
          .where(and(eq(absensi.id_pegawai, id_pegawai), eq(absensi.tanggal, today)))
          .limit(1);

        let absensiId: string;
        if (absensiHariIni.length === 0) {
          const inserted = await db.insert(absensi).values({
            id_pegawai: id_pegawai,
            tanggal: today,
            tipe: 'kantor',
            status: 'hadir',
            diabsenkan_oleh: user.id_pegawai,
          }).returning();
          absensiId = inserted[0].id;
        } else {
          absensiId = absensiHariIni[0].id;
        }

        const titik = await db.insert(titikAbsensi).values({
          id_absensi: absensiId,
          jenis_titik,
          diabsenkan_manual: true,
          catatan: catatan || `Diabsenkan manual oleh pimpinan`,
        }).returning();

        return {
          status: 'success',
          message: `Absen manual ${jenis_titik} berhasil dicatat`,
          data: titik[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        id_pegawai: t.String(),
        jenis_titik: t.String(),
        catatan: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // 📅 GET /v1/absensi/hari-ini
  // Status absensi hari ini untuk pegawai yang login
  // -----------------------------------------------------------
  .get('/hari-ini', async ({ user, set }: any) => {
    try {
      if (!user?.id_pegawai) {
        set.status = 400;
        return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
      }
      const today = new Date().toISOString().split('T')[0];
      const result = await db.select().from(absensi)
        .where(and(eq(absensi.id_pegawai, user.id_pegawai), eq(absensi.tanggal, today)))
        .limit(1);

      if (result.length === 0) {
        return { status: 'success', data: null, message: 'Belum absen hari ini' };
      }

      const titikList = await db.select().from(titikAbsensi)
        .where(eq(titikAbsensi.id_absensi, result[0].id))
        .orderBy(titikAbsensi.waktu);

      return { status: 'success', data: { ...result[0], titik: titikList } };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 📜 GET /v1/absensi/saya
  // Riwayat absensi pegawai sendiri (paginasi)
  // -----------------------------------------------------------
  .get('/saya', async ({ query, user, set }: any) => {
    try {
      if (!user?.id_pegawai) {
        set.status = 400;
        return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
      }
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '20');
      const offset = (page - 1) * limit;

      const data = await db.select().from(absensi)
        .where(eq(absensi.id_pegawai, user.id_pegawai))
        .orderBy(desc(absensi.tanggal))
        .limit(limit).offset(offset);

      return { status: 'success', data, meta: { page, limit } };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 📊 GET /v1/absensi
  // Daftar absensi semua pegawai (Admin/Pimpinan, filter)
  // -----------------------------------------------------------
  .get('/', async ({ query, user, set }: any) => {
    try {
      const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
      if (!allowedRoles.includes(user?.peran)) {
        set.status = 403;
        return { status: 'error', message: 'Anda tidak memiliki akses' };
      }

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '20');
      const offset = (page - 1) * limit;

      const conditions: any[] = [];
      if (query.tanggal) conditions.push(eq(absensi.tanggal, query.tanggal));
      if (query.id_pegawai) conditions.push(eq(absensi.id_pegawai, query.id_pegawai));
      if (query.status) conditions.push(eq(absensi.status, query.status));

      const data = await db.select().from(absensi)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(absensi.tanggal))
        .limit(limit).offset(offset);

      return { status: 'success', data, meta: { page, limit } };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // ✏️ PUT /v1/absensi/:id/koreksi
  // Koreksi status absensi (Admin Unit+)
  // -----------------------------------------------------------
  .put(
    '/:id/koreksi',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Anda tidak memiliki akses untuk koreksi' };
        }

        const updated = await db.update(absensi).set({
          status: body.status,
          catatan: body.catatan || null,
          diperbarui_pada: new Date(),
        }).where(eq(absensi.id, id)).returning();

        if (updated.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Data absensi tidak ditemukan' };
        }

        return {
          status: 'success',
          message: 'Absensi berhasil dikoreksi',
          data: updated[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        status: t.String(), // hadir, terlambat, izin, sakit, dll
        catatan: t.Optional(t.String()),
      })
    }
  );
