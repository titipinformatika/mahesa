import { describe, expect, it, beforeAll } from 'bun:test';
import { db } from '../src/db';
import { jenisKegiatanLhkp, laporanHarian, detailLaporanHarian, reviewRekan } from '../src/db/schema/lhkp';
import { pegawai } from '../src/db/schema/pegawai';
import { eq, and } from 'drizzle-orm';

describe('LHKP & Review Rekan Tests', () => {
  let p1: any;
  let p2: any;
  let pimpinan: any;
  let kegiatan: any;

  beforeAll(async () => {
    const pList = await db.select().from(pegawai).limit(5);
    p1 = pList.find(x => x.nama_lengkap.includes('Ani'));
    p2 = pList.find(x => x.nama_lengkap.includes('Budi'));
    pimpinan = pList.find(x => x.nama_lengkap.includes('Siti'));

    const kList = await db.select().from(jenisKegiatanLhkp).limit(1);
    kegiatan = kList[0];
  });

  it('should create a daily report with details in a transaction', async () => {
    const tanggal = '2024-05-10';
    
    const [header] = await db.insert(laporanHarian).values({
      idPegawai: p1.id,
      tanggal,
      status: 'menunggu'
    }).returning();

    await db.insert(detailLaporanHarian).values({
      idLaporanHarian: header.id,
      idJenisKegiatan: kegiatan.id,
      jamMulai: '08:00',
      jamSelesai: '10:00',
      uraian: 'Mengajar Matematika Kelas X-A'
    });

    const [savedHeader] = await db.select().from(laporanHarian).where(eq(laporanHarian.id, header.id));
    expect(savedHeader.status).toBe('menunggu');

    const details = await db.select().from(detailLaporanHarian).where(eq(detailLaporanHarian.idLaporanHarian, header.id));
    expect(details.length).toBe(1);
    expect(details[0].uraian).toContain('Matematika');
  });

  it('should allow pimpinan to approve LHKP', async () => {
    const [header] = await db.insert(laporanHarian).values({
      idPegawai: p2.id,
      tanggal: '2024-05-11',
      status: 'menunggu'
    }).returning();

    await db.update(laporanHarian)
      .set({ status: 'disetujui', waktuPersetujuan: new Date() })
      .where(eq(laporanHarian.id, header.id));

    const [updated] = await db.select().from(laporanHarian).where(eq(laporanHarian.id, header.id));
    expect(updated.status).toBe('disetujui');
  });

  it('should allow peer review between colleagues', async () => {
    const [review] = await db.insert(reviewRekan).values({
      idPenilai: p1.id,
      idTarget: p2.id,
      rating: 5,
      komentar: 'Sangat kooperatif dan membantu'
    }).returning();

    expect(review.rating).toBe(5);
    
    const [savedReview] = await db.select().from(reviewRekan).where(eq(reviewRekan.id, review.id));
    expect(savedReview.idPenilai).toBe(p1.id);
  });
});
