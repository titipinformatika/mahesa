# 📋 Eksekusi Issue #4: Setup Keamanan (JWT) & Endpoint Login

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #4]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu.

---

## 🛠️ Langkah 1: Install Dependensi Keamanan

1. Buka terminal, pastikan berada di folder `backend/`.
2. Jalankan perintah instalasi berikut:
   ```bash
   bun add @elysiajs/jwt bcryptjs
   bun add -d @types/bcryptjs
   ```

---

## 📝 Langkah 2: Pembuatan Middleware (Auth & Role Guard)

1. Buat folder baru `src/middleware/` (jika belum ada).
2. Buat file `authGuard.ts` di dalam `src/middleware/`.
3. Salin dan tempel kode berikut ke `src/middleware/authGuard.ts`:

**File: `backend/src/middleware/authGuard.ts`**
```typescript
import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

// Secret key untuk JWT (Idealnya ditaruh di .env)
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_mahesa_123';

export const authPlugin = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
    })
  )
  .derive(async ({ jwt, headers, set }) => {
    const authorization = headers['authorization'];
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Token otentikasi tidak ditemukan atau tidak valid');
    }

    const token = authorization.slice(7);
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      throw new Error('Sesi telah berakhir atau token tidak valid');
    }

    return {
      user: payload as {
        id: string;
        email: string;
        peran: string;
        id_pegawai?: string;
        id_unit_kerja?: string;
      },
    };
  });
```

4. Buat file `roleGuard.ts` di folder `src/middleware/`. Salin kode berikut:

**File: `backend/src/middleware/roleGuard.ts`**
```typescript
import { Elysia } from 'elysia';
import { authPlugin } from './authGuard';

// Fungsi pabrik untuk menghasilkan guard berdasarkan peran yang diizinkan
export const roleGuard = (allowedRoles: string[]) => {
  return new Elysia()
    .use(authPlugin)
    .onBeforeHandle(({ user, set }) => {
      if (!allowedRoles.includes(user.peran)) {
        set.status = 403;
        throw new Error('Anda tidak memiliki akses untuk melakukan tindakan ini');
      }
    });
};
```

---

## 📝 Langkah 3: Pembuatan Endpoint Login

1. Buat folder baru `src/routes/v1/` (jika belum ada).
2. Buat file `otentikasi.ts` di dalam `src/routes/v1/`.
3. Salin dan tempel kode berikut ke `src/routes/v1/otentikasi.ts`:

**File: `backend/src/routes/v1/otentikasi.ts`**
```typescript
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pengguna, pegawai } from '../../db/schema/pegawai';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { jwt } from '@elysiajs/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_mahesa_123';

export const otentikasiRoutes = new Elysia({ prefix: '/v1/otentikasi' })
  .use(
    jwt({
      name: 'jwt',
      secret: JWT_SECRET,
      exp: '1d', // Token berlaku 1 hari
    })
  )
  .post(
    '/masuk',
    async ({ body, jwt, set }) => {
      try {
        const { email, password } = body;

        // 1. Cari pengguna berdasarkan email
        const userList = await db
          .select()
          .from(pengguna)
          .where(eq(pengguna.email, email))
          .limit(1);

        const user = userList[0];

        if (!user || !user.aktif) {
          set.status = 401;
          return { status: 'error', message: 'Email tidak ditemukan atau akun tidak aktif' };
        }

        // 2. Verifikasi Password
        const isPasswordValid = await bcrypt.compare(password, user.hash_kata_sandi);
        if (!isPasswordValid) {
          set.status = 401;
          return { status: 'error', message: 'Kata sandi salah' };
        }

        // 3. Ambil data pegawai (jika ada) untuk mendapatkan id_unit_kerja
        const pegawaiList = await db
          .select({
            id: pegawai.id,
            id_unit_kerja: pegawai.id_unit_kerja,
          })
          .from(pegawai)
          .where(eq(pegawai.id_pengguna, user.id))
          .limit(1);

        const dataPegawai = pegawaiList[0];

        // 4. Update waktu terakhir login
        await db
          .update(pengguna)
          .set({ terakhir_login: new Date() })
          .where(eq(pengguna.id, user.id));

        // 5. Generate JWT Token
        const token = await jwt.sign({
          id: user.id,
          email: user.email,
          peran: user.peran,
          id_pegawai: dataPegawai?.id,
          id_unit_kerja: dataPegawai?.id_unit_kerja,
        });

        return {
          status: 'success',
          message: 'Berhasil login',
          data: {
            token,
            peran: user.peran,
          },
        };
      } catch (error) {
        set.status = 500;
        return { status: 'error', message: 'Terjadi kesalahan pada server' };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  );
```

---

## 📝 Langkah 4: Daftarkan Route ke Entry Point

1. Buka file utama server Anda: `backend/src/index.ts`.
2. Hapus isinya lalu ganti dengan kode berikut agar mendaftarkan rute yang baru saja dibuat:

**File: `backend/src/index.ts`**
```typescript
import { Elysia } from "elysia";
import { otentikasiRoutes } from "./routes/v1/otentikasi";

const app = new Elysia()
  // Mendaftarkan grup rute otentikasi
  .use(otentikasiRoutes)
  
  // Endpoint root untuk cek kesehatan server
  .get("/", () => "Hello MAHESA Backend is Running!")
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

---

## 🧪 Langkah 5: Pengujian (Testing)

1. Pastikan server backend Anda sedang berjalan. Jika belum, jalankan:
   ```bash
   bun run dev
   ```
2. Buka **Postman** atau **ThunderClient** di VSCode.
3. Buat request baru:
   - Method: `POST`
   - URL: `http://localhost:3000/v1/otentikasi/masuk`
   - Body: Raw (JSON)
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
4. Tekan **Send**. Anda seharusnya mendapatkan respons `401 Unauthorized` dengan pesan "Email tidak ditemukan atau akun tidak aktif" (Karena kita memang belum menginput data user asli ke dalam database). Ini menandakan endpoint dan validasi sudah berjalan dengan baik.

Jika hasilnya sudah sesuai, maka **Issue #4 telah resmi SELESAI**.
