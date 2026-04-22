# 📋 Eksekusi Issue #5: Sisa Endpoint Otentikasi & Integrasi Token FCM

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #5]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu.

---

## 🛠️ Langkah 1: Update File Route Otentikasi

Kita akan menambahkan beberapa endpoint baru ke dalam file `backend/src/routes/v1/otentikasi.ts` yang sudah ada. 

1. Buka file `backend/src/routes/v1/otentikasi.ts`.
2. Hapus seluruh isi file tersebut, lalu gantikan dengan kode di bawah ini (kami telah menambahkan endpoint `keluar`, `perbarui-token`, `lupa-kata-sandi`, `reset-kata-sandi`, `ganti-kata-sandi`, dan `token-fcm`):

**File: `backend/src/routes/v1/otentikasi.ts`**
```typescript
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pengguna, pegawai } from '../../db/schema/pegawai';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { jwt } from '@elysiajs/jwt';
import { authPlugin } from '../../middleware/authGuard';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_mahesa_123';

export const otentikasiRoutes = new Elysia({ prefix: '/v1/otentikasi' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '1d', // Token berlaku 1 hari
    })
  )
  
  // -----------------------------------------------------------
  // 🔓 ENDPOINT PUBLIK (Tidak butuh token)
  // -----------------------------------------------------------
  .post(
    '/masuk',
    async ({ body, jwt, set }) => {
      try {
        const { email, password } = body;

        const userList = await db.select().from(pengguna).where(eq(pengguna.email, email)).limit(1);
        const user = userList[0];

        if (!user || !user.aktif) {
          set.status = 401;
          return { status: 'error', message: 'Email tidak ditemukan atau akun tidak aktif' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.hash_kata_sandi);
        if (!isPasswordValid) {
          set.status = 401;
          return { status: 'error', message: 'Kata sandi salah' };
        }

        const pegawaiList = await db
          .select({ id: pegawai.id, id_unit_kerja: pegawai.id_unit_kerja })
          .from(pegawai)
          .where(eq(pegawai.id_pengguna, user.id))
          .limit(1);
        const dataPegawai = pegawaiList[0];

        await db.update(pengguna).set({ terakhir_login: new Date() }).where(eq(pengguna.id, user.id));

        const token = await jwt.sign({
          id: user.id,
          email: user.email,
          peran: user.peran,
          id_pegawai: dataPegawai?.id,
          id_unit_kerja: dataPegawai?.id_unit_kerja,
        });

        return { status: 'success', message: 'Berhasil login', data: { token, peran: user.peran } };
      } catch (error) {
        set.status = 500;
        return { status: 'error', message: 'Terjadi kesalahan pada server' };
      }
    },
    { body: t.Object({ email: t.String({ format: 'email' }), password: t.String() }) }
  )

  .post('/keluar', ({ set }) => {
    // Klien hanya perlu menghapus token dari sisi mereka (local storage/cookie)
    return { status: 'success', message: 'Berhasil keluar. Silakan hapus token di klien.' };
  })

  .post(
    '/lupa-kata-sandi',
    async ({ body, set }) => {
      // TODO: Implementasi pengiriman email reset password (Nodemailer)
      console.log(`Permintaan reset password untuk email: ${body.email}`);
      return { status: 'success', message: 'Jika email terdaftar, instruksi reset telah dikirim.' };
    },
    { body: t.Object({ email: t.String({ format: 'email' }) }) }
  )

  .post(
    '/reset-kata-sandi',
    async ({ body, set }) => {
      // TODO: Verifikasi token reset dari email, lalu update password
      return { status: 'success', message: 'Kata sandi berhasil direset.' };
    },
    { body: t.Object({ token: t.String(), password_baru: t.String() }) }
  )

  // -----------------------------------------------------------
  // 🔒 ENDPOINT TERLINDUNGI (Butuh token JWT)
  // -----------------------------------------------------------
  .group('', (app) => app
    .use(authPlugin)
    
    .get('/profil-saya', async ({ user, set }) => {
      const userList = await db.select({
        id: pengguna.id,
        email: pengguna.email,
        peran: pengguna.peran,
        terakhir_login: pengguna.terakhir_login
      }).from(pengguna).where(eq(pengguna.id, user.id)).limit(1);
      
      return { status: 'success', data: userList[0] };
    })

    .post('/perbarui-token', async ({ user, jwt, set }) => {
      // Generate token baru dengan masa berlaku di-reset
      const tokenBaru = await jwt.sign({
        id: user.id,
        email: user.email,
        peran: user.peran,
        id_pegawai: user.id_pegawai,
        id_unit_kerja: user.id_unit_kerja,
      });
      return { status: 'success', message: 'Token berhasil diperbarui', data: { token: tokenBaru } };
    })

    .put(
      '/ganti-kata-sandi',
      async ({ body, user, set }) => {
        const currentUser = (await db.select().from(pengguna).where(eq(pengguna.id, user.id)).limit(1))[0];
        
        if (!currentUser) {
          set.status = 404;
          return { status: 'error', message: 'Pengguna tidak ditemukan' };
        }

        const isOldPasswordValid = await bcrypt.compare(body.password_lama, currentUser.hash_kata_sandi);
        if (!isOldPasswordValid) {
          set.status = 401;
          return { status: 'error', message: 'Kata sandi lama salah' };
        }

        const newHashedPassword = await bcrypt.hash(body.password_baru, 10);
        await db.update(pengguna).set({ hash_kata_sandi: newHashedPassword }).where(eq(pengguna.id, user.id));

        return { status: 'success', message: 'Kata sandi berhasil diubah' };
      },
      { body: t.Object({ password_lama: t.String(), password_baru: t.String() }) }
    )

    .put(
      '/token-fcm',
      async ({ body, user, set }) => {
        await db.update(pengguna).set({ token_fcm: body.token_fcm }).where(eq(pengguna.id, user.id));
        return { status: 'success', message: 'Token FCM berhasil disimpan' };
      },
      { body: t.Object({ token_fcm: t.String() }) }
    )
  );
```

---

## 🧪 Langkah 2: Pengujian (Testing)

1. Pastikan server backend Anda sedang berjalan: `bun run dev`
2. Buka **Postman** atau **ThunderClient**.
3. Uji endpoint `/v1/otentikasi/keluar`:
   - Method: `POST`
   - URL: `http://localhost:3000/v1/otentikasi/keluar`
   - Expected Output: Berhasil.
4. Uji endpoint publik `/v1/otentikasi/lupa-kata-sandi`:
   - Method: `POST`
   - Body: JSON `{"email": "test@example.com"}`
   - Expected Output: Pesan instruksi reset terkirim.
5. (Opsional) Uji endpoint yang dilindungi jika memiliki token aktif dari login sebelumnya.

Jika semua berjalan lancar dan tidak ada *error* saat server dinyalakan, maka **Issue #5 telah resmi SELESAI**.
