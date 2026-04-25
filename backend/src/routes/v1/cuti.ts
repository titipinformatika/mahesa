import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { jenisCuti, saldoCuti, pengajuanCuti, dokumenCuti } from '../../db/schema/cuti';
import { pegawai } from '../../db/schema/pegawai';
import { eq, and, sql, desc } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';
import { uploadFile } from '../../lib/penyimpanan';

// Helper function to calculate business days (Monday to Friday)
function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

export const cutiRoutes = new Elysia({ prefix: '/v1/cuti' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 📋 GET /v1/cuti/jenis
  // Daftar semua jenis cuti
  // -----------------------------------------------------------
  .get('/jenis', async () => {
    const data = await db.select().from(jenisCuti).orderBy(jenisCuti.nama);
    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // ➕ POST /v1/cuti/jenis
  // Tambah jenis cuti baru (Admin)
  // -----------------------------------------------------------
  .post('/jenis', async ({ body, user, set }: any) => {
    if (user.peran !== 'admin_dinas') {
      set.status = 403;
      return { status: 'error', message: 'Hanya Admin Dinas yang dapat menambah jenis cuti' };
    }
    const [newJenis] = await db.insert(jenisCuti).values(body).returning();
    return { status: 'success', data: newJenis };
  }, {
    body: t.Object({
      nama: t.String(),
      keterangan: t.Optional(t.String()),
      wajibLampiran: t.Boolean(),
      jatahTahunan: t.Number()
    })
  })

  // -----------------------------------------------------------
  // 💰 GET /v1/cuti/saldo
  // Cek sisa saldo cuti pegawai
  // -----------------------------------------------------------
  .get('/saldo', async ({ user, set }: any) => {
    if (!user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
    }
    const data = await db.select({
      id_jenis: jenisCuti.id,
      nama_jenis: jenisCuti.nama,
      saldo: saldoCuti.saldo,
      tahun: saldoCuti.tahun
    })
    .from(saldoCuti)
    .innerJoin(jenisCuti, eq(saldoCuti.idJenisCuti, jenisCuti.id))
    .where(and(
      eq(saldoCuti.idPegawai, user.id_pegawai),
      eq(saldoCuti.tahun, new Date().getFullYear())
    ));
    
    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // 📜 GET /v1/cuti
  // Riwayat pengajuan cuti sendiri
  // -----------------------------------------------------------
  .get('/', async ({ user, set }: any) => {
    if (!user.id_pegawai) {
      set.status = 400;
      return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
    }
    const data = await db.select({
      id: pengajuanCuti.id,
      jenis: jenisCuti.nama,
      tanggalMulai: pengajuanCuti.tanggalMulai,
      tanggalSelesai: pengajuanCuti.tanggalSelesai,
      status: pengajuanCuti.status,
      alasan: pengajuanCuti.alasan
    })
    .from(pengajuanCuti)
    .innerJoin(jenisCuti, eq(pengajuanCuti.idJenisCuti, jenisCuti.id))
    .where(eq(pengajuanCuti.idPegawai, user.id_pegawai))
    .orderBy(desc(pengajuanCuti.createdAt));
    
    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // 📝 POST /v1/cuti
  // Mengajukan cuti baru
  // -----------------------------------------------------------
  .post('/', async ({ body, user, set }: any) => {
    try {
      if (!user.id_pegawai) {
        set.status = 400;
        return { status: 'error', message: 'User tidak memiliki ID Pegawai' };
      }

      const { idJenisCuti, tanggalMulai, tanggalSelesai, alasan } = body;
      const start = new Date(tanggalMulai);
      const end = new Date(tanggalSelesai);
      
      if (start > end) {
        set.status = 400;
        return { status: 'error', message: 'Tanggal mulai tidak boleh setelah tanggal selesai' };
      }

      // Hitung hari kerja
      const totalHari = calculateBusinessDays(start, end);
      
      // Cek saldo jika jenis cuti memiliki jatah tahunan > 0
      const [jenis] = await db.select().from(jenisCuti).where(eq(jenisCuti.id, idJenisCuti)).limit(1);
      if (jenis && jenis.jatahTahunan > 0) {
        const [saldo] = await db.select().from(saldoCuti).where(and(
          eq(saldoCuti.idPegawai, user.id_pegawai),
          eq(saldoCuti.idJenisCuti, idJenisCuti),
          eq(saldoCuti.tahun, start.getFullYear())
        )).limit(1);
        
        if (!saldo || saldo.saldo < totalHari) {
          set.status = 400;
          return { status: 'error', message: `Saldo cuti tidak mencukupi (Sisa: ${saldo?.saldo ?? 0}, Dibutuhkan: ${totalHari})` };
        }
      }

      const [newCuti] = await db.insert(pengajuanCuti).values({
        idPegawai: user.id_pegawai,
        idJenisCuti,
        tanggalMulai,
        tanggalSelesai,
        alasan,
        status: 'menunggu'
      }).returning();

      return { status: 'success', data: newCuti };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  }, {
    body: t.Object({
      idJenisCuti: t.String(),
      tanggalMulai: t.String(),
      tanggalSelesai: t.String(),
      alasan: t.String()
    })
  })

  // -----------------------------------------------------------
  // ⏳ GET /v1/cuti/menunggu
  // Daftar pengajuan cuti bawahan (Pimpinan)
  // -----------------------------------------------------------
  .get('/menunggu', async ({ user, set }: any) => {
    if (user.peran !== 'pimpinan') {
      set.status = 403;
      return { status: 'error', message: 'Hanya pimpinan yang dapat melihat daftar persetujuan' };
    }
    
    // Pimpinan melihat pegawai di unit kerja yang sama
    const data = await db.select({
      id: pengajuanCuti.id,
      namaPegawai: pegawai.nama_lengkap,
      jenis: jenisCuti.nama,
      tanggalMulai: pengajuanCuti.tanggalMulai,
      tanggalSelesai: pengajuanCuti.tanggalSelesai,
      alasan: pengajuanCuti.alasan
    })
    .from(pengajuanCuti)
    .innerJoin(pegawai, eq(pengajuanCuti.idPegawai, pegawai.id))
    .innerJoin(jenisCuti, eq(pengajuanCuti.idJenisCuti, jenisCuti.id))
    .where(and(
      eq(pegawai.id_unit_kerja, user.id_unit_kerja),
      eq(pengajuanCuti.status, 'menunggu')
    ));

    return { status: 'success', data };
  })

  // -----------------------------------------------------------
  // 📄 POST /v1/cuti/:id/dokumen
  // Upload lampiran cuti
  // -----------------------------------------------------------
  .post('/:id/dokumen', async ({ params, body, set }: any) => {
    const { id } = params;
    const { file } = body;
    
    if (!file) {
      set.status = 400;
      return { status: 'error', message: 'File tidak ditemukan' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `cuti/${id}-${Date.now()}-${file.name}`;
    const url = await uploadFile(fileName, buffer, file.type);
    
    const [doc] = await db.insert(dokumenCuti).values({
      idPengajuanCuti: id,
      namaFile: file.name,
      pathFile: url,
      mimeType: file.type,
      ukuran: file.size
    }).returning();

    return { status: 'success', data: doc };
  }, {
    body: t.Object({
      file: t.File()
    })
  })

  // -----------------------------------------------------------
  // ✅ PUT /v1/cuti/:id/persetujuan
  // Setujui atau Tolak cuti (Pimpinan)
  // -----------------------------------------------------------
  .put('/:id/persetujuan', async ({ params, body, user, set }: any) => {
    const { id } = params;
    const { status, catatanPimpinan } = body;

    if (user.peran !== 'pimpinan') {
      set.status = 403;
      return { status: 'error', message: 'Hanya pimpinan yang dapat menyetujui pengajuan' };
    }

    return await db.transaction(async (tx) => {
      const [cuti] = await tx.select().from(pengajuanCuti).where(eq(pengajuanCuti.id, id)).limit(1);
      
      if (!cuti) {
        set.status = 404;
        return { status: 'error', message: 'Pengajuan tidak ditemukan' };
      }

      if (cuti.status !== 'menunggu') {
        set.status = 400;
        return { status: 'error', message: 'Pengajuan sudah diproses sebelumnya' };
      }

      // Jika disetujui, potong saldo
      if (status === 'disetujui') {
        const start = new Date(cuti.tanggalMulai);
        const end = new Date(cuti.tanggalSelesai);
        const totalHari = calculateBusinessDays(start, end);
        
        const [jenis] = await tx.select().from(jenisCuti).where(eq(jenisCuti.id, cuti.idJenisCuti)).limit(1);
        if (jenis && jenis.jatahTahunan > 0) {
          const [saldo] = await tx.select().from(saldoCuti).where(and(
            eq(saldoCuti.idPegawai, cuti.idPegawai),
            eq(saldoCuti.idJenisCuti, cuti.idJenisCuti),
            eq(saldoCuti.tahun, start.getFullYear())
          )).limit(1);

          if (!saldo || saldo.saldo < totalHari) {
            tx.rollback();
            set.status = 400;
            return { status: 'error', message: 'Saldo cuti tidak mencukupi untuk disetujui' };
          }

          await tx.update(saldoCuti)
            .set({ saldo: saldo.saldo - totalHari, updatedAt: new Date() })
            .where(eq(saldoCuti.id, saldo.id));
        }
      }

      const [updated] = await tx.update(pengajuanCuti)
        .set({ 
          status, 
          catatanPimpinan, 
          waktuPersetujuan: new Date(),
          updatedAt: new Date()
        })
        .where(eq(pengajuanCuti.id, id))
        .returning();

      return { status: 'success', data: updated };
    });
  }, {
    body: t.Object({
      status: t.String(),
      catatanPimpinan: t.Optional(t.String())
    })
  });
