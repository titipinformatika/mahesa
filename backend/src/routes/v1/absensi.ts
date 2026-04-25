import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { absensi, titikAbsensi } from '../../db/schema/absensi';
import { pegawai, skemaJamKerja } from '../../db/schema/pegawai';
import { unitKerja } from '../../db/schema/organisasi';
import { skemaDinasLuar, pengajuanDinasLuar } from '../../db/schema/dinasLuar';
import { eq, and, desc, sql } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';
import { isWithinRadius } from '../../lib/geo';
import { uploadFile } from '../../lib/penyimpanan';
import sharp from 'sharp';

export const absensiRoutes = new Elysia({ prefix: '/v1/absensi' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 📍 POST /v1/absensi/titik
  // Submit titik absensi (jam_masuk / sampai_dl / dll) + GPS + Selfie
  // -----------------------------------------------------------
  .post(
    '/',
    async ({ body, user, set }: any) => {
      try {
        if (!user || !user.id_pegawai) {
          set.status = 400;
          return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
        }

        const { jenis_titik, latitude, longitude, foto, catatan } = body;
        const now = new Date();
        const jamSekarang = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
        const today = now.toISOString().split('T')[0];

        // 1. Ambil data pegawai, unit, & skema jam kerja
        const result = await db.select({
          id: pegawai.id,
          id_unit_kerja: pegawai.id_unit_kerja,
          u_lat: unitKerja.latitude,
          u_lng: unitKerja.longitude,
          radius_kantor: unitKerja.radius_absensi_meter,
          jam_masuk: skemaJamKerja.jam_masuk,
          jam_pulang: skemaJamKerja.jam_pulang,
          toleransi: skemaJamKerja.toleransi_terlambat_menit
        })
        .from(pegawai)
        .innerJoin(unitKerja, eq(pegawai.id_unit_kerja, unitKerja.id))
        .leftJoin(skemaJamKerja, eq(pegawai.id_skema_jam_kerja, skemaJamKerja.id))
        .where(eq(pegawai.id, user.id_pegawai))
        .limit(1);

        if (result.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Data pegawai tidak ditemukan' };
        }
        const p = result[0];

        // 2. Cek apakah ada Pengajuan DL yang disetujui hari ini
        const dl = await db.select()
          .from(pengajuanDinasLuar)
          .where(and(
            eq(pengajuanDinasLuar.id_pegawai, user.id_pegawai),
            eq(pengajuanDinasLuar.tanggal, today),
            eq(pengajuanDinasLuar.status, 'disetujui')
          ))
          .limit(1);

        const isDL = dl.length > 0;
        let configTitik: any[] = [];
        let id_pengajuan_dl = isDL ? dl[0].id : null;

        // 3. Tentukan Konfigurasi Titik Absensi
        if (isDL) {
          // Ambil skema DL dari database
          const skemaDL = await db.select()
            .from(skemaDinasLuar)
            .where(and(
              eq(skemaDinasLuar.id_unit_kerja, p.id_unit_kerja),
              eq(skemaDinasLuar.kode_skema, dl[0].skema)
            ))
            .limit(1);
          
          if (skemaDL.length > 0) {
            configTitik = skemaDL[0].titik_titik as any[];
          } else {
            set.status = 500;
            return { status: 'error', message: 'Konfigurasi skema DL tidak ditemukan di unit Anda' };
          }
        } else {
          // Skema Kantor Standard
          configTitik = [
            { urutan: 1, jenis: 'jam_masuk', label: 'Jam Masuk', aturan_lokasi: 'kantor' },
            { urutan: 2, jenis: 'jam_pulang', label: 'Jam Pulang', aturan_lokasi: 'kantor' }
          ];
        }

        // 4. Validasi Jenis Titik & Urutan
        const pointConfig = configTitik.find(t => t.jenis === jenis_titik);
        if (!pointConfig) {
          set.status = 400;
          return { status: 'error', message: `Jenis titik '${jenis_titik}' tidak ada dalam skema hari ini` };
        }

        // Cari record absensi header
        let header = await db.select().from(absensi)
          .where(and(eq(absensi.id_pegawai, user.id_pegawai), eq(absensi.tanggal, today)))
          .limit(1);

        const existingTitik = header.length > 0 
          ? await db.select().from(titikAbsensi).where(eq(titikAbsensi.id_absensi, header[0].id)).orderBy(titikAbsensi.waktu)
          : [];

        // Cek apakah sudah pernah absen jenis ini
        if (existingTitik.some(t => t.jenis_titik === jenis_titik)) {
          set.status = 400;
          return { status: 'error', message: `Anda sudah melakukan absen ${pointConfig.label}` };
        }

        // Cek urutan: Titik sebelumnya harus sudah diisi
        if (pointConfig.urutan > 1) {
          const prevConfig = configTitik.find(t => t.urutan === pointConfig.urutan - 1);
          if (!existingTitik.some(t => t.jenis_titik === prevConfig.jenis)) {
            set.status = 400;
            return { status: 'error', message: `Anda harus melakukan absen ${prevConfig.label} terlebih dahulu` };
          }
        }

        // 5. Validasi Jendela Waktu (Time-Window)
        if (jenis_titik === 'jam_masuk' && p.jam_masuk) {
          if (jamSekarang < (p.jam_masuk as string).substring(0, 5)) {
            set.status = 400;
            return { status: 'error', message: `Belum waktunya absen masuk (Mulai jam ${p.jam_masuk})` };
          }
        }
        if (jenis_titik === 'jam_pulang' && p.jam_pulang) {
          if (jamSekarang < (p.jam_pulang as string).substring(0, 5)) {
            set.status = 400;
            return { status: 'error', message: `Belum waktunya absen pulang (Selesai jam ${p.jam_pulang})` };
          }
        }

        // 6. Validasi Radius GPS
        let targetLat: number, targetLng: number, radiusM: number;
        if (pointConfig.aturan_lokasi === 'kantor') {
          targetLat = parseFloat(p.u_lat as string);
          targetLng = parseFloat(p.u_lng as string);
          radiusM = p.radius_kantor as number;
        } else if (pointConfig.aturan_lokasi === 'tujuan_dl') {
          targetLat = parseFloat(dl[0].latitude_tujuan as string);
          targetLng = parseFloat(dl[0].longitude_tujuan as string);
          radiusM = dl[0].radius_tujuan_meter as number;
        } else {
          // dimana_saja
          targetLat = latitude;
          targetLng = longitude;
          radiusM = 9999999;
        }

        const dalamRadius = isWithinRadius(latitude, longitude, targetLat, targetLng, radiusM);
        if (!dalamRadius && pointConfig.aturan_lokasi !== 'dimana_saja') {
          set.status = 400;
          const lokasiName = pointConfig.aturan_lokasi === 'kantor' ? 'Kantor' : 'Lokasi DL';
          return { status: 'error', message: `Anda berada di luar jangkauan radius ${lokasiName}` };
        }

        // 7. Proses Selfie
        let urlFoto: string | null = null;
        if (foto) {
          const buffer = Buffer.from(await foto.arrayBuffer());
          const compressed = await sharp(buffer).resize(800, 800, { fit: 'inside' }).webp({ quality: 80 }).toBuffer();
          const key = `absensi/${user.id_pegawai}/${today}_${jenis_titik}_${Date.now()}.webp`;
          urlFoto = await uploadFile(key, compressed, 'image/webp');
        }

        // 8. Simpan ke Database
        let absensiId: string;
        if (header.length === 0) {
          // Cek keterlambatan untuk jam_masuk
          let statusAbsensi = 'hadir';
          let infoCatatan = '';
          if (jenis_titik === 'jam_masuk' && p.jam_masuk) {
            const [h, m] = (p.jam_masuk as string).split(':').map(Number);
            const limit = new Date(now);
            limit.setHours(h, m + (p.toleransi || 0), 0, 0);
            if (now > limit) {
              statusAbsensi = 'terlambat';
              infoCatatan = 'Terlambat masuk';
            }
          }

          const inserted = await db.insert(absensi).values({
            id_pegawai: user.id_pegawai,
            tanggal: today,
            tipe: isDL ? 'dinas_luar' : 'kantor',
            status: statusAbsensi,
            id_pengajuan_dl,
            catatan: infoCatatan || catatan,
          }).returning();
          absensiId = inserted[0].id;
        } else {
          absensiId = header[0].id;
        }

        const titik = await db.insert(titikAbsensi).values({
          id_absensi: absensiId,
          jenis_titik,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          url_foto: urlFoto,
          dalam_radius: dalamRadius,
          catatan,
        }).returning();

        // 9. Jika jam_pulang → Hitung Jam Kerja & Lembur
        if (jenis_titik === 'jam_pulang') {
          const titikMasuk = existingTitik.find(t => t.jenis_titik === 'jam_masuk') || (jenis_titik === 'jam_masuk' ? titik[0] : null);
          if (titikMasuk) {
            const start = new Date(titikMasuk.waktu).getTime();
            const end = new Date(titik[0].waktu).getTime();
            const jamKerja = ((end - start) / 3600000).toFixed(2);
            
            // Hitung lembur jika pulang lewat dari jam_pulang skema
            let jamLembur = '0.00';
            if (p.jam_pulang) {
              const [ph, pm] = (p.jam_pulang as string).split(':').map(Number);
              const targetPulang = new Date(now);
              targetPulang.setHours(ph, pm, 0, 0);
              if (now > targetPulang) {
                jamLembur = ((now.getTime() - targetPulang.getTime()) / 3600000).toFixed(2);
              }
            }

            await db.update(absensi).set({
              jam_kerja: jamKerja,
              jam_lembur: jamLembur,
              diperbarui_pada: new Date(),
            }).where(eq(absensi.id, absensiId));
          }
        }

        return {
          status: 'success',
          message: `Absen ${pointConfig.label} berhasil dicatat`,
          data: titik[0],
        };

      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        jenis_titik: t.String(),
        latitude: t.Number(),
        longitude: t.Number(),
        foto: t.Optional(t.File()),
        catatan: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // 📋 POST /v1/absensi/manual
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

        let header = await db.select().from(absensi)
          .where(and(eq(absensi.id_pegawai, id_pegawai), eq(absensi.tanggal, today)))
          .limit(1);

        let absensiId: string;
        if (header.length === 0) {
          const inserted = await db.insert(absensi).values({
            id_pegawai: id_pegawai,
            tanggal: today,
            status: 'hadir',
            diabsenkan_oleh: user.id_pegawai,
          }).returning();
          absensiId = inserted[0].id;
        } else {
          absensiId = header[0].id;
        }

        const titik = await db.insert(titikAbsensi).values({
          id_absensi: absensiId,
          jenis_titik,
          diabsenkan_manual: true,
          catatan: catatan || `Diabsenkan manual oleh pimpinan`,
        }).returning();

        return { status: 'success', message: `Absen manual ${jenis_titik} berhasil dicatat`, data: titik[0] };
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

  // (Sisa endpoint lainnya tetap sama seperti sebelumnya, tapi pastikan query field baru jika perlu)
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
  // 📊 GET /v1/absensi/rekap
  // -----------------------------------------------------------
  .get('/rekap', async ({ query, user, set }: any) => {
    try {
      const { bulan, tahun, id_pegawai } = query;
      const targetPegawaiId = id_pegawai || user.id_pegawai;

      if (id_pegawai && id_pegawai !== user.id_pegawai) {
        const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Anda tidak memiliki akses rekap pegawai lain' };
        }
      }

      const startDate = `${tahun}-${bulan.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(tahun), parseInt(bulan), 0).toISOString().split('T')[0];

      const data = await db.execute(sql`
        SELECT a.*, 
               (SELECT json_agg(t.*) FROM titik_absensi t WHERE t.id_absensi = a.id) as detail_titik
        FROM absensi a
        WHERE a.id_pegawai = ${targetPegawaiId}
        AND a.tanggal BETWEEN ${startDate} AND ${endDate}
        ORDER BY a.tanggal DESC
      `);

      return { status: 'success', data };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  }, {
    query: t.Object({
      bulan: t.String(),
      tahun: t.String(),
      id_pegawai: t.Optional(t.String()),
    })
  })

  // -----------------------------------------------------------
  // 📊 GET /v1/absensi/ringkasan-pegawai
  // -----------------------------------------------------------
  .get('/ringkasan-pegawai', async ({ query, user, set }: any) => {
    try {
      const { bulan, tahun } = query;
      const targetPegawaiId = user.id_pegawai;
      
      const startDate = `${tahun}-${bulan.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(tahun), parseInt(bulan), 0).toISOString().split('T')[0];

      // 1. Hitung Kehadiran, Terlambat, Dinas Luar
      const stats = await db.select({
        status: absensi.status,
        tipe: absensi.tipe,
        count: sql<number>`count(*)`
      })
      .from(absensi)
      .where(and(
        eq(absensi.id_pegawai, targetPegawaiId),
        sql`${absensi.tanggal} BETWEEN ${startDate} AND ${endDate}`
      ))
      .groupBy(absensi.status, absensi.tipe);

      let hadir = 0;
      let terlambat = 0;
      let dl = 0;

      stats.forEach(s => {
        if (s.status === 'hadir' || s.status === 'terlambat') hadir++;
        if (s.status === 'terlambat') terlambat = Number(s.count);
        if (s.tipe === 'dinas_luar') dl = Number(s.count);
      });

      // 2. Ambil Sisa Cuti (Dummy logic or join with saldo_cuti if exists)
      // Untuk sementara sisa_cuti kita ambil dari data pegawai jika ada atau default 12
      const p = await db.select({ sisa_cuti: pegawai.sisa_cuti }).from(pegawai).where(eq(pegawai.id, targetPegawaiId)).limit(1);
      const sisaCuti = p.length > 0 ? (p[0].sisa_cuti ?? 12) : 12;

      // 3. Hitung Total Hari Kerja (weekday) di bulan ini
      let totalHariKerja = 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getDay() !== 0 && d.getDay() !== 6) totalHariKerja++;
      }

      return {
        status: 'success',
        data: {
          hadir,
          terlambat,
          dl,
          sisa_cuti: sisaCuti,
          total_hari: totalHariKerja
        }
      };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  }, {
    query: t.Object({
      bulan: t.String(),
      tahun: t.String(),
    })
  })

  // -----------------------------------------------------------
  // ⚠️ GET /v1/absensi/terlambat
  // -----------------------------------------------------------
  .get('/terlambat', async ({ user, set }: any) => {
    try {
      const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
      if (!allowedRoles.includes(user?.peran)) {
        set.status = 403;
        return { status: 'error', message: 'Anda tidak memiliki akses' };
      }

      const today = new Date().toISOString().split('T')[0];

      const data = await db.select({
        id: absensi.id,
        id_pegawai: absensi.id_pegawai,
        tanggal: absensi.tanggal,
        status: absensi.status,
        catatan: absensi.catatan,
        nama_lengkap: pegawai.nama_lengkap,
        nip: pegawai.nip,
        nama_unit: unitKerja.nama
      })
      .from(absensi)
      .innerJoin(pegawai, eq(absensi.id_pegawai, pegawai.id))
      .innerJoin(unitKerja, eq(pegawai.id_unit_kerja, unitKerja.id))
      .where(and(eq(absensi.tanggal, today), eq(absensi.status, 'terlambat')));

      return { status: 'success', data };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 📊 GET /v1/absensi
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

        return { status: 'success', message: 'Absensi berhasil dikoreksi', data: updated[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        status: t.String(),
        catatan: t.Optional(t.String()),
      })
    }
  );

