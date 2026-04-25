import cron from 'node-cron';
import { db } from '../db';
import { saldoCuti, jenisCuti } from '../db/schema/cuti';
import { pegawai } from '../db/schema/pegawai';
import { absensi } from '../db/schema/absensi';
import { eq, and, sql } from 'drizzle-orm';
import { sendFCMNotification } from './notifikasi';

/**
 * Inisialisasi tugas terjadwal (Cron Jobs)
 */
export function initCronJobs() {
  // 🕒 Reset Saldo Cuti Tahunan (Setiap 1 Januari jam 00:00)
  cron.schedule('0 0 1 1 *', async () => {
    console.log('⏳ Menjalankan tugas tahunan: Reset Saldo Cuti...');
    
    try {
      const currentYear = new Date().getFullYear();
      const allJenis = await db.select().from(jenisCuti).where(sql`${jenisCuti.jatahTahunan} > 0`);
      const allPegawai = await db.select({ id: pegawai.id }).from(pegawai);
      
      for (const p of allPegawai) {
        for (const j of allJenis) {
          const [existing] = await db.select().from(saldoCuti).where(and(
            eq(saldoCuti.idPegawai, p.id),
            eq(saldoCuti.idJenisCuti, j.id),
            eq(saldoCuti.tahun, currentYear)
          )).limit(1);
          
          if (!existing) {
            await db.insert(saldoCuti).values({
              idPegawai: p.id,
              idJenisCuti: j.id,
              tahun: currentYear,
              saldo: j.jatahTahunan
            });
          }
        }
      }
      console.log('✅ Berhasil mereset saldo cuti untuk tahun', currentYear);
    } catch (error) {
      console.error('❌ Gagal mereset saldo cuti:', error);
    }
  });

  // 🕒 Notifikasi Absensi (Senin-Jumat jam 08:30 dan 16:30)
  cron.schedule('30 8,16 * * 1-5', async () => {
    const now = new Date();
    const isMorning = now.getHours() === 8;
    const type = isMorning ? 'Masuk' : 'Pulang';
    const today = now.toISOString().split('T')[0];

    console.log(`⏳ [CRON] Menjalankan Pengingat Absensi ${type}...`);

    try {
      const allPegawai = await db.select({ id: pegawai.id, nama: pegawai.nama_lengkap }).from(pegawai);
      let count = 0;

      for (const p of allPegawai) {
        // Cek apakah sudah ada record absensi untuk hari ini
        const [todayAbsensi] = await db.select().from(absensi).where(and(
          eq(absensi.id_pegawai, p.id),
          eq(absensi.tanggal, today)
        )).limit(1);

        // Jika pagi dan belum ada record (belum clock-in)
        // ATAU Jika sore dan belum ada clock-out (masih perlu di-check lebih detail kalau sistemnya pakai 1 record per hari)
        // Di sistem MAHESA, absensi per hari adalah 1 record di tabel 'absensi' dan n record di 'titik_absensi'
        // Jika belum ada record 'absensi', berarti belum clock-in sama sekali.
        
        if (!todayAbsensi) {
          await sendFCMNotification(
            p.id, 
            `Pengingat Absensi ${type}`, 
            `Halo ${p.nama}, jangan lupa untuk melakukan absensi ${type.toLowerCase()} hari ini!`
          );
          count++;
        }
      }

      console.log(`✅ [CRON] Pengingat Absensi ${type} selesai. Dikirim ke ${count} pegawai.`);
    } catch (error) {
      console.error(`❌ [CRON] Gagal menjalankan pengingat absensi:`, error);
    }
  });

  console.log('🕒 Cron jobs di-inisialisasi.');
}
