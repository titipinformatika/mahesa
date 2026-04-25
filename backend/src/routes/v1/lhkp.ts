import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { jenisKegiatanLhkp, penugasanKegiatanLhkp, laporanHarian, detailLaporanHarian } from '../../db/schema/lhkp';
import { pegawai } from '../../db/schema/pegawai';
import { eq, and, desc, sql } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const lhkpRoutes = new Elysia({ prefix: '/v1/lhkp' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 📋 GET /v1/lhkp/jenis-kegiatan
  // Daftar semua jenis kegiatan LHKP
  // -----------------------------------------------------------
  .get('/jenis-kegiatan', async () => {
    const data = await db.select().from(jenisKegiatanLhkp).orderBy(jenisKegiatanLhkp.nama);
    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // ➕ POST /v1/lhkp/jenis-kegiatan
  // Tambah jenis kegiatan baru (Admin/Pimpinan)
  // -----------------------------------------------------------
  .post('/jenis-kegiatan', async ({ body, user, set }: any) => {
    if (!['admin_dinas', 'pimpinan'].includes(user.peran)) {
      set.status = 403;
      return { status: 'error', message: 'Anda tidak memiliki akses' };
    }
    const [newJenis] = await db.insert(jenisKegiatanLhkp).values(body).returning();
    return { status: 'success', data: newJenis };
  }, {
    body: t.Object({
      nama: t.String(),
      keterangan: t.Optional(t.String()),
      isActive: t.Optional(t.Boolean())
    })
  })

  // -----------------------------------------------------------
  // 🤝 POST /v1/lhkp/penugasan
  // Penugasan kegiatan ke pegawai (Bulk)
  // -----------------------------------------------------------
  .post('/penugasan', async ({ body, user, set }: any) => {
    if (user.peran !== 'pimpinan') {
      set.status = 403;
      return { status: 'error', message: 'Hanya pimpinan yang dapat memberikan penugasan' };
    }

    const { idPegawaiList, idJenisKegiatanList } = body;
    
    const values: any[] = [];
    for (const idPegawai of idPegawaiList) {
      for (const idJenis of idJenisKegiatanList) {
        values.push({ idPegawai, idJenisKegiatan: idJenis });
      }
    }

    if (values.length > 0) {
      await db.insert(penugasanKegiatanLhkp).values(values);
    }

    return { status: 'success', message: 'Penugasan berhasil disimpan' };
  }, {
    body: t.Object({
      idPegawaiList: t.Array(t.String()),
      idJenisKegiatanList: t.Array(t.String())
    })
  })

  // -----------------------------------------------------------
  // 📌 GET /v1/lhkp/penugasan
  // Lihat kegiatan yang ditugaskan ke saya
  // -----------------------------------------------------------
  .get('/penugasan', async ({ user, set }: any) => {
    if (!user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
    }

    const data = await db.select({
      id: jenisKegiatanLhkp.id,
      nama: jenisKegiatanLhkp.nama,
      keterangan: jenisKegiatanLhkp.keterangan
    })
    .from(penugasanKegiatanLhkp)
    .innerJoin(jenisKegiatanLhkp, eq(penugasanKegiatanLhkp.idJenisKegiatan, jenisKegiatanLhkp.id))
    .where(and(
      eq(penugasanKegiatanLhkp.idPegawai, user.id_pegawai),
      eq(jenisKegiatanLhkp.isActive, true)
    ));

    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // 📝 POST /v1/lhkp/laporan-harian
  // Submit laporan harian (Header + Details)
  // -----------------------------------------------------------
  .post('/laporan-harian', async ({ body, user, set }: any) => {
    if (!user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
    }

    const { tanggal, details } = body;

    return await db.transaction(async (tx) => {
      // 1. Insert Header
      const [header] = await tx.insert(laporanHarian).values({
        idPegawai: user.id_pegawai,
        tanggal,
        status: 'menunggu'
      }).returning();

      // 2. Insert Details
      const detailValues = details.map((d: any) => ({
        idLaporanHarian: header.id,
        idJenisKegiatan: d.idJenisKegiatan,
        jamMulai: d.jamMulai,
        jamSelesai: d.jamSelesai,
        uraian: d.uraian
      }));

      await tx.insert(detailLaporanHarian).values(detailValues);

      return { status: 'success', data: header };
    });
  }, {
    body: t.Object({
      tanggal: t.String(),
      details: t.Array(t.Object({
        idJenisKegiatan: t.String(),
        jamMulai: t.String(),
        jamSelesai: t.String(),
        uraian: t.String()
      }))
    })
  })

  // -----------------------------------------------------------
  // 📜 GET /v1/lhkp/laporan-harian
  // Riwayat laporan harian saya
  // -----------------------------------------------------------
  .get('/laporan-harian', async ({ user, set }: any) => {
    if (!user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
    }

    const data = await db.select({
      id: laporanHarian.id,
      tanggal: laporanHarian.tanggal,
      status: laporanHarian.status,
      catatanPimpinan: laporanHarian.catatanPimpinan,
      waktuPersetujuan: laporanHarian.waktuPersetujuan
    })
    .from(laporanHarian)
    .where(eq(laporanHarian.idPegawai, user.id_pegawai))
    .orderBy(desc(laporanHarian.tanggal));

    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // 👁️ GET /v1/lhkp/laporan-harian/:id
  // Detail laporan harian (termasuk isi kegiatannya)
  // -----------------------------------------------------------
  .get('/laporan-harian/:id', async ({ params, set }: any) => {
    const { id } = params;
    
    const [header] = await db.select().from(laporanHarian).where(eq(laporanHarian.id, id)).limit(1);
    if (!header) {
      set.status = 404;
      return { status: 'error', message: 'Laporan tidak ditemukan' };
    }

    const details = await db.select({
      id: detailLaporanHarian.id,
      namaKegiatan: jenisKegiatanLhkp.nama,
      jamMulai: detailLaporanHarian.jamMulai,
      jamSelesai: detailLaporanHarian.jamSelesai,
      uraian: detailLaporanHarian.uraian
    })
    .from(detailLaporanHarian)
    .innerJoin(jenisKegiatanLhkp, eq(detailLaporanHarian.idJenisKegiatan, jenisKegiatanLhkp.id))
    .where(eq(detailLaporanHarian.idLaporanHarian, id));

    return { status: 'success', data: { ...header, details } };
  })

  // -----------------------------------------------------------
  // ✅ PUT /v1/lhkp/laporan-harian/:id/persetujuan
  // Persetujuan LHKP (Pimpinan)
  // -----------------------------------------------------------
  .put('/laporan-harian/:id/persetujuan', async ({ params, body, user, set }: any) => {
    if (user.peran !== 'pimpinan') {
      set.status = 403;
      return { status: 'error', message: 'Hanya pimpinan yang dapat menyetujui laporan' };
    }

    const { id } = params;
    const { status, catatanPimpinan } = body;

    const [updated] = await db.update(laporanHarian)
      .set({ 
        status, 
        catatanPimpinan, 
        waktuPersetujuan: new Date(),
        updatedAt: new Date()
      })
      .where(eq(laporanHarian.id, id))
      .returning();

    // Trigger FCM logic would go here (simulated)
    if (['revisi', 'ditolak'].includes(status)) {
      console.log(`[FCM] Notifikasi ke Pegawai: Laporan harian Anda statusnya ${status}`);
    }

    return { status: 'success', data: updated };
  }, {
    body: t.Object({
      status: t.String(),
      catatanPimpinan: t.Optional(t.String())
    })
  });
