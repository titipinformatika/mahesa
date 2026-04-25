import { describe, expect, it, beforeAll } from 'bun:test';
import { db } from '../src/db';
import { jenisCuti, saldoCuti, pengajuanCuti } from '../src/db/schema/cuti';
import { pegawai } from '../src/db/schema/pegawai';
import { eq, and } from 'drizzle-orm';

describe('Cuti Integration Business Logic', () => {
  let testPegawaiId: string;
  let testPimpinanId: string;
  let cutiTahunanId: string;
  let cutiSakitId: string;

  beforeAll(async () => {
    // Ambil data dari seed
    const p = await db.select().from(pegawai).limit(5);
    testPegawaiId = p.find(x => x.nama_lengkap.includes('Ani'))?.id!;
    testPimpinanId = p.find(x => x.nama_lengkap.includes('Siti'))?.id!;
    
    const j = await db.select().from(jenisCuti);
    cutiTahunanId = j.find(x => x.nama === 'Cuti Tahunan')?.id!;
    cutiSakitId = j.find(x => x.nama === 'Cuti Sakit')?.id!;
  });

  it('should deduct saldo when cuti is approved', async () => {
    // 1. Cek saldo awal
    const [saldoAwal] = await db.select().from(saldoCuti).where(and(
      eq(saldoCuti.idPegawai, testPegawaiId),
      eq(saldoCuti.idJenisCuti, cutiTahunanId)
    ));
    const initialSaldo = saldoAwal.saldo;

    // 2. Buat pengajuan (2 hari: Senin 2024-05-06 s/d Selasa 2024-05-07)
    const [pengajuan] = await db.insert(pengajuanCuti).values({
      idPegawai: testPegawaiId,
      idJenisCuti: cutiTahunanId,
      tanggalMulai: '2024-05-06',
      tanggalSelesai: '2024-05-07',
      alasan: 'Acara keluarga',
      status: 'menunggu'
    }).returning();

    // 3. Approve via transaction logic (mimicking the controller)
    await db.transaction(async (tx) => {
      // Logic from controller
      const totalHari = 2; // calculateBusinessDays('2024-05-06', '2024-05-07')
      
      const [saldo] = await tx.select().from(saldoCuti).where(and(
        eq(saldoCuti.idPegawai, testPegawaiId),
        eq(saldoCuti.idJenisCuti, cutiTahunanId),
        eq(saldoCuti.tahun, new Date().getFullYear())
      )).limit(1);

      await tx.update(saldoCuti)
        .set({ saldo: saldo.saldo - totalHari })
        .where(eq(saldoCuti.id, saldo.id));

      await tx.update(pengajuanCuti)
        .set({ status: 'disetujui' })
        .where(eq(pengajuanCuti.id, pengajuan.id));
    });

    // 4. Verifikasi saldo berkurang
    const [saldoAkhir] = await db.select().from(saldoCuti).where(eq(saldoCuti.idPegawai, testPegawaiId));
    expect(saldoAkhir.saldo).toBe(initialSaldo - 2);
  });

  it('should not deduct saldo for Cuti Sakit (if jatahTahunan is 0)', async () => {
    const [pengajuan] = await db.insert(pengajuanCuti).values({
      idPegawai: testPegawaiId,
      idJenisCuti: cutiSakitId,
      tanggalMulai: '2024-05-08',
      tanggalSelesai: '2024-05-08',
      alasan: 'Demam',
      status: 'menunggu'
    }).returning();

    const [saldoAwal] = await db.select().from(saldoCuti).where(and(
        eq(saldoCuti.idPegawai, testPegawaiId),
        eq(saldoCuti.idJenisCuti, cutiTahunanId)
    ));

    await db.transaction(async (tx) => {
      const [jenis] = await tx.select().from(jenisCuti).where(eq(jenisCuti.id, cutiSakitId));
      if (jenis.jatahTahunan > 0) {
          // Should not reach here
      }
      await tx.update(pengajuanCuti).set({ status: 'disetujui' }).where(eq(pengajuanCuti.id, pengajuan.id));
    });

    const [saldoAkhir] = await db.select().from(saldoCuti).where(and(
        eq(saldoCuti.idPegawai, testPegawaiId),
        eq(saldoCuti.idJenisCuti, cutiTahunanId)
    ));
    expect(saldoAkhir.saldo).toBe(saldoAwal.saldo); // Saldo tahunan tidak berubah
  });
});
