import admin from 'firebase-admin';
import { db } from '../db';
import { pegawai, pengguna } from '../db/schema/pegawai';
import { eq } from 'drizzle-orm';

// Inisialisasi Firebase Admin jika ada environment variables yang cukup
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('✅ Firebase Admin SDK berhasil di-inisialisasi.');
  } catch (error) {
    console.error('❌ Gagal menginisialisasi Firebase Admin SDK:', error);
  }
} else {
  console.warn('⚠️ Firebase environment variables tidak lengkap. FCM akan berjalan dalam mode MOCK.');
}

/**
 * Mengirim notifikasi FCM (Firebase Cloud Messaging)
 */
export async function sendFCMNotification(idPegawai: string, judul: string, pesan: string): Promise<void> {
  try {
    // Ambil token FCM dari tabel pengguna melalui join dengan pegawai
    const [user] = await db.select({ token_fcm: pengguna.token_fcm })
      .from(pegawai)
      .innerJoin(pengguna, eq(pegawai.id_pengguna, pengguna.id))
      .where(eq(pegawai.id, idPegawai))
      .limit(1);

    if (!user || !user.token_fcm) {
      console.log(`[FCM] Skip: Pegawai ID ${idPegawai} tidak memiliki token FCM.`);
      return;
    }

    // Jika Firebase belum diinisialisasi, jalankan mode MOCK
    if (admin.apps.length === 0) {
      console.log(`[FCM MOCK] Mengirim ke Token: ${user.token_fcm}`);
      console.log(`[FCM MOCK] Judul: ${judul} | Pesan: ${pesan}`);
      return;
    }

    await admin.messaging().send({
      notification: {
        title: judul,
        body: pesan,
      },
      token: user.token_fcm,
    });

    console.log(`[FCM] Notifikasi berhasil dikirim ke Pegawai ID ${idPegawai}`);
  } catch (error) {
    console.error(`[FCM] Gagal mengirim notifikasi ke Pegawai ID ${idPegawai}:`, error);
  }
}
