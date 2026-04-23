# 📋 Eksekusi Issue #9: Sistem Pengajuan Biodata (Workflow Persetujuan)

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #9]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu.

---

## 📚 Konteks Penting (Baca Dulu!)

### Apa yang akan dibuat?
Sistem pengajuan perubahan biodata pegawai. Alur kerjanya:
1. **Pegawai** mengirimkan draf perubahan data dirinya (misal: nama, telepon, alamat) dalam format JSONB.
2. **Pimpinan/Admin** melihat daftar pengajuan yang masuk.
3. **Pimpinan/Admin** bisa menyetujui (data disalin ke tabel `pegawai`) atau menolak (dengan memberikan alasan).

### Endpoint yang Harus Dibuat (Referensi: `planningall.md` Bab 8.2)

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|-------|
| `POST` | `/v1/biodata/kirim` | Kirim perubahan biodata | Pegawai / Pimpinan |
| `GET` | `/v1/biodata/pengajuan` | Daftar pengajuan biodata | Admin+ / Pimpinan |
| `GET` | `/v1/biodata/pengajuan/:id` | Detail pengajuan | Semua Terkait |
| `PUT` | `/v1/biodata/pengajuan/:id/setujui` | Setujui biodata (berjenjang) | Pimpinan / Admin UPT / Admin Dinas |
| `PUT` | `/v1/biodata/pengajuan/:id/tolak` | Tolak biodata | Pimpinan / Admin UPT / Admin Dinas |

### File yang Sudah Ada (JANGAN diubah kecuali disebut)

- `backend/src/db/schema/pegawai.ts` — Skema tabel `pegawai` (tempat data final disimpan setelah disetujui).
- `backend/src/middleware/authGuard.ts` — Plugin otentikasi JWT. Menyediakan objek `user` (berisi `id`, `email`, `peran`, `id_pegawai`, `id_unit_kerja`).
- `backend/src/index.ts` — Titik masuk aplikasi. Anda perlu menambahkan import dan `.use()` di sini.

---

## 🛠️ Langkah 1: Buat Skema Tabel `pengajuan_biodata`

Buat file baru di `backend/src/db/schema/biodata.ts` dan masukkan kode berikut:

**File: `backend/src/db/schema/biodata.ts`**
```typescript
import {
  pgTable, uuid, varchar, text, boolean, timestamp, jsonb
} from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';

// ------------------------------------------------------
// Tabel pengajuan_biodata
// Menyimpan draf perubahan data pegawai sebelum disetujui.
// ------------------------------------------------------
export const pengajuanBiodata = pgTable('pengajuan_biodata', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Pegawai yang mengajukan perubahan
  id_pegawai: uuid('id_pegawai').notNull().references(() => pegawai.id),

  // Data perubahan dalam format JSONB
  // Contoh isi: { "telepon": "081234567890", "alamat": "Jl. Baru No. 5" }
  data_perubahan: jsonb('data_perubahan').notNull(),

  // Status alur kerja: 'menunggu', 'disetujui', 'ditolak'
  status: varchar('status', { length: 20 }).notNull().default('menunggu'),

  // Catatan dari pegawai (opsional)
  catatan_pegawai: text('catatan_pegawai'),

  // Informasi persetujuan/penolakan
  diproses_oleh: uuid('diproses_oleh').references(() => pegawai.id),
  catatan_proses: text('catatan_proses'), // Alasan tolak / catatan setujui
  diproses_pada: timestamp('diproses_pada', { withTimezone: true }),

  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});
```

### Sinkronisasi ke Database (Push Skema)
Setelah file dibuat, jalankan perintah berikut untuk membuat tabel di database:
```bash
bunx drizzle-kit push
```
Pilih `Yes` jika ada konfirmasi.

---

## 🛠️ Langkah 2: Buat File Route Biodata

Buat file baru di `backend/src/routes/v1/biodata.ts` dan masukkan kode berikut:

**File: `backend/src/routes/v1/biodata.ts`**
```typescript
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
```

---

## 🛠️ Langkah 3: Daftarkan Route di `index.ts`

1. Buka file `backend/src/index.ts`.
2. Tambahkan import di bagian atas:
   ```typescript
   import { biodataRoutes } from "./routes/v1/biodata";
   ```
3. Tambahkan `.use(biodataRoutes)` setelah `.use(pegawaiRoutes)`:
   ```typescript
   const app = new Elysia()
     .use(otentikasiRoutes)
     .use(organisasiRoutes)
     .use(pegawaiRoutes)
     .use(biodataRoutes) // Tambahkan baris ini
     .get("/", () => "Hello MAHESA Backend is Running!")
     .listen(3000);
   ```

---

## 🧪 Langkah 4: Pengujian (Testing)

### Verifikasi Kompilasi
```bash
bunx tsc --noEmit
```
Pastikan output: **0 Error**.

### Push Skema ke Database
```bash
bunx drizzle-kit push
```

### Jalankan Server
```bash
bun run dev
```

### Skenario Pengujian (Gunakan Postman/ThunderClient)

**Skenario 1: Akses tanpa token (harus 401)**
- `POST http://localhost:3000/v1/biodata/kirim` → Expect `401`
- `GET http://localhost:3000/v1/biodata/pengajuan` → Expect `401`

**Skenario 2: Kirim pengajuan biodata (sebagai pegawai/admin)**
- Login terlebih dahulu via `POST /v1/otentikasi/masuk`.
- `POST /v1/biodata/kirim` dengan body:
  ```json
  {
    "data_perubahan": {
      "telepon": "081234567890",
      "alamat": "Jl. Baru No. 5, Jakarta"
    },
    "catatan_pegawai": "Perubahan nomor telepon baru"
  }
  ```
  → Expect `200` dan data pengajuan dikembalikan.

**Skenario 3: Lihat daftar pengajuan (sebagai admin)**
- `GET /v1/biodata/pengajuan` → Expect `200` dengan daftar pengajuan.
- `GET /v1/biodata/pengajuan?status=menunggu` → Expect hanya pengajuan berstatus "menunggu".

**Skenario 4: Setujui pengajuan**
- `PUT /v1/biodata/pengajuan/{id}/setujui` dengan body:
  ```json
  { "catatan": "Data sudah diverifikasi" }
  ```
  → Expect `200` dan data pegawai di tabel utama berubah.

**Skenario 5: Tolak pengajuan**
- (Buat pengajuan baru dulu via Skenario 2)
- `PUT /v1/biodata/pengajuan/{id}/tolak` dengan body:
  ```json
  { "alasan": "Nomor telepon tidak valid" }
  ```
  → Expect `200` dengan status "ditolak".

**Skenario 6: Coba setujui/tolak pengajuan yang sudah diproses**
- `PUT /v1/biodata/pengajuan/{id}/setujui` (id yang sudah ditolak/disetujui)
  → Expect `400` dengan pesan "Pengajuan ini sudah disetujui/ditolak".

Jika semua skenario berjalan sesuai ekspektasi, **Issue #9 dinyatakan SELESAI**.
