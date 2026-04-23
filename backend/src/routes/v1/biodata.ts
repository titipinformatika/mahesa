import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pengajuanBiodata } from '../../db/schema/biodata';
import { pegawai } from '../../db/schema/pegawai';
import { eq, and, desc } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const biodataRoutes = new Elysia({ prefix: '/v1/biodata' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 📤 POST /v1/biodata/kirim
  // Pegawai mengirim draf perubahan biodata.
  // Body berisi data_perubahan (JSONB) dan catatan opsional.
  // -----------------------------------------------------------
  .post(
    '/kirim',
    async ({ body, user, set }: any) => {
      try {
        if (!user || !user.id_pegawai) {
          set.status = 400;
          return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
        }

        const inserted = await db.insert(pengajuanBiodata).values({
          id_pegawai: user.id_pegawai,
          data_perubahan: body.data_perubahan,
          catatan_pegawai: body.catatan_pegawai,
        }).returning();

        return {
          status: 'success',
          message: 'Pengajuan perubahan biodata berhasil dikirim',
          data: inserted[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        data_perubahan: t.Any(), // JSONB: { telepon: "...", alamat: "..." }
        catatan_pegawai: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // 📋 GET /v1/biodata/pengajuan
  // Daftar pengajuan biodata untuk Admin/Pimpinan.
  // Bisa difilter berdasarkan status (query param: ?status=menunggu).
  // -----------------------------------------------------------
  .get('/pengajuan', async ({ query, user, set }: any) => {
    try {
      const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
      if (!allowedRoles.includes(user?.peran)) {
        set.status = 403;
        return { status: 'error', message: 'Anda tidak memiliki akses' };
      }

      const filterStatus = query.status || '';
      const conditions: any[] = [];
      if (filterStatus) {
        conditions.push(eq(pengajuanBiodata.status, filterStatus));
      }

      const data = await db
        .select()
        .from(pengajuanBiodata)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(pengajuanBiodata.dibuat_pada));

      return { status: 'success', data };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 🔍 GET /v1/biodata/pengajuan/:id
  // Detail satu pengajuan biodata.
  // -----------------------------------------------------------
  .get('/pengajuan/:id', async ({ params: { id }, user, set }: any) => {
    try {
      const result = await db.select().from(pengajuanBiodata).where(eq(pengajuanBiodata.id, id)).limit(1);

      if (result.length === 0) {
        set.status = 404;
        return { status: 'error', message: 'Pengajuan tidak ditemukan' };
      }

      const pengajuan = result[0];

      // Pegawai biasa hanya boleh lihat pengajuan miliknya
      if (user.peran === 'pegawai' && pengajuan.id_pegawai !== user.id_pegawai) {
        set.status = 403;
        return { status: 'error', message: 'Anda tidak memiliki akses ke pengajuan ini' };
      }

      return { status: 'success', data: pengajuan };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // ✅ PUT /v1/biodata/pengajuan/:id/setujui
  // Menyetujui pengajuan biodata.
  // Menyalin isi `data_perubahan` ke tabel `pegawai`.
  // -----------------------------------------------------------
  .put(
    '/pengajuan/:id/setujui',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Anda tidak memiliki akses untuk menyetujui' };
        }

        // Ambil data pengajuan
        const result = await db.select().from(pengajuanBiodata).where(eq(pengajuanBiodata.id, id)).limit(1);
        if (result.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Pengajuan tidak ditemukan' };
        }
        const pengajuan = result[0];

        if (pengajuan.status !== 'menunggu') {
          set.status = 400;
          return { status: 'error', message: `Pengajuan ini sudah ${pengajuan.status}` };
        }

        // Salin data_perubahan ke tabel pegawai
        const dataPerubahan = pengajuan.data_perubahan as Record<string, any>;
        await db.update(pegawai).set({
          ...dataPerubahan,
          status_biodata: 'lengkap',
          diperbarui_pada: new Date(),
        }).where(eq(pegawai.id, pengajuan.id_pegawai));

        // Update status pengajuan
        const updated = await db.update(pengajuanBiodata).set({
          status: 'disetujui',
          diproses_oleh: user.id_pegawai,
          catatan_proses: body.catatan || null,
          diproses_pada: new Date(),
          diperbarui_pada: new Date(),
        }).where(eq(pengajuanBiodata.id, id)).returning();

        return {
          status: 'success',
          message: 'Pengajuan biodata disetujui dan data pegawai telah diperbarui',
          data: updated[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        catatan: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // ❌ PUT /v1/biodata/pengajuan/:id/tolak
  // Menolak pengajuan biodata dengan alasan.
  // -----------------------------------------------------------
  .put(
    '/pengajuan/:id/tolak',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Anda tidak memiliki akses untuk menolak' };
        }

        // Cek pengajuan
        const result = await db.select().from(pengajuanBiodata).where(eq(pengajuanBiodata.id, id)).limit(1);
        if (result.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Pengajuan tidak ditemukan' };
        }
        const pengajuan = result[0];

        if (pengajuan.status !== 'menunggu') {
          set.status = 400;
          return { status: 'error', message: `Pengajuan ini sudah ${pengajuan.status}` };
        }

        // Update status pengajuan menjadi ditolak
        const updated = await db.update(pengajuanBiodata).set({
          status: 'ditolak',
          diproses_oleh: user.id_pegawai,
          catatan_proses: body.alasan,
          diproses_pada: new Date(),
          diperbarui_pada: new Date(),
        }).where(eq(pengajuanBiodata.id, id)).returning();

        return {
          status: 'success',
          message: 'Pengajuan biodata ditolak',
          data: updated[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        alasan: t.String(), // Alasan penolakan (WAJIB)
      })
    }
  );
