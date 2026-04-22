# 📋 Eksekusi Issue #1: Inisialisasi Proyek Bun + Elysia & Setup Drizzle ORM

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #1]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu dan lakukan *copy-paste* pada kode yang disediakan.

---

## 🛠️ Langkah 1: Persiapan Folder & Inisialisasi Proyek

1. Buka Terminal/Command Prompt.
2. Pastikan Anda berada di *root* direktori proyek (`d:\MYDATA\Project\MAHESA\`).
3. Jalankan perintah berikut baris demi baris:

```bash
mkdir backend
cd backend
bun init -y
```

*Penjelasan: Perintah ini membuat folder baru bernama `backend`, memasukinya, dan melakukan inisialisasi proyek Bun secara otomatis (menghasilkan file `package.json` dan `tsconfig.json`).*

---

## 📦 Langkah 2: Instalasi Dependensi (Library)

Masih di dalam terminal (dan pastikan Anda berada di folder `backend`), jalankan instalasi *framework* dan *database tools*:

```bash
# 1. Install Framework Elysia
bun add elysia

# 2. Install Drizzle ORM dan PostgreSQL Driver
bun add drizzle-orm postgres

# 3. Install tipe TypeScript (sebagai dev dependency)
bun add -D @types/node typescript

# 4. Install Drizzle Kit (alat untuk migrasi database, sebagai dev dependency)
bun add -D drizzle-kit
```

---

## 📝 Langkah 3: Konfigurasi `package.json`

Buka file `backend/package.json` yang baru saja terbuat. Modifikasi bagian `"scripts"` agar kita bisa menjalankan server dengan mudah. Ganti isinya sehingga terlihat persis seperti ini:

**File: `backend/package.json`**
```json
{
  "name": "backend",
  "version": "1.0.0",
  "module": "src/index.ts",
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "drizzle-orm": "^0.36.0",
    "elysia": "^1.1.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "drizzle-kit": "^0.28.0",
    "typescript": "^5.0.0"
  }
}
```
*(Catatan: Versi dependensi mungkin sedikit berbeda tergantung versi terbaru saat `bun add` dieksekusi, abaikan perbedaan versi, fokus pada penambahan `"scripts"`).*

---

## 💻 Langkah 4: Pembuatan Server API (Elysia.js)

Buat folder `src` di dalam folder `backend` jika belum ada. Lalu buat/edit file `index.ts`.

**File: `backend/src/index.ts`**
```typescript
import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello MAHESA API is running!")
  .get("/v1/health", () => ({ status: "OK", timestamp: new Date() }))
  .listen(3000);

console.log(
  `🦊 MAHESA API is running at ${app.server?.hostname}:${app.server?.port}`
);
```

---

## 🗄️ Langkah 5: Setup Koneksi Database PostgreSQL

Buat folder bernama `db` di dalam folder `backend/src/`. Lalu buat file `index.ts` di dalamnya. File ini bertugas membuka gerbang komunikasi antara aplikasi Bun kita dengan server PostgreSQL.

**File: `backend/src/db/index.ts`**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Koneksi akan membaca dari environment variable DATABASE_URL
// Jika tidak ada, gunakan string default ini (sesuaikan password & db name)
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password_disini@localhost:5432/mahesa_db';

// Konfigurasi client postgres
const client = postgres(connectionString);

// Inisialisasi Drizzle ORM
export const db = drizzle(client);

console.log("🟢 Koneksi Drizzle ORM ke PostgreSQL berhasil di-inisialisasi.");
```

---

## ⚙️ Langkah 6: Setup Konfigurasi Drizzle Kit

Buat file bernama `drizzle.config.ts` tepat di folder `backend/` (sejajar dengan `package.json`). File ini mengajari Drizzle Kit di mana letak file skema tabel kita (yang akan dikerjakan di Issue #2 nanti).

**File: `backend/drizzle.config.ts`**
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*', // Lokasi file-file schema tabel (nanti dibuat)
  out: './drizzle',            // Lokasi folder output hasil migrasi (SQL file)
  dialect: 'postgresql',       // Tipe database yang digunakan
  dbCredentials: {
    // Sesuaikan url ini dengan koneksi database lokal Anda
    url: process.env.DATABASE_URL || 'postgres://postgres:password_disini@localhost:5432/mahesa_db',
  },
  verbose: true,
  strict: true,
});
```

---

## 🧪 Langkah 7: Pengujian (Testing)

Untuk memastikan semua langkah di atas sukses:
1. Buka terminal (pastikan berada di direktori `backend/`).
2. Jalankan perintah:
   ```bash
   bun run dev
   ```
3. Jika berhasil, terminal Anda akan memunculkan teks: 
   `🦊 MAHESA API is running at localhost:3000`
4. Buka browser web Anda, dan kunjungi: `http://localhost:3000/v1/health`
5. Anda harusnya melihat teks JSON: `{"status":"OK", "timestamp":"..."}`

Jika nomor 5 sudah berhasil, maka **Issue #1 telah resmi SELESAI**. Anda bisa lanjut ke Issue #2.
