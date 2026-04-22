# 📋 Eksekusi Issue #7: API CRUD Modul Pegawai & Fitur Pencarian

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #7]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu.

---

## 📚 Konteks Penting (Baca Dulu!)

### Endpoint yang Harus Dibuat (Referensi: `planningall.md` Bab 8.2)

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|-------|
| `GET` | `/v1/pegawai` | Daftar pegawai (paginasi, filter) | Admin+ |
| `GET` | `/v1/pegawai/:id` | Detail pegawai | Admin+ / Sendiri |
| `POST` | `/v1/pegawai` | Tambah pegawai | Admin Unit+ |
| `PUT` | `/v1/pegawai/:id` | Update pegawai | Admin Unit+ |
| `DELETE` | `/v1/pegawai/:id` | Nonaktifkan pegawai (soft delete) | Admin Dinas |
| `GET` | `/v1/pegawai/unit-saya` | Daftar pegawai se-unit kerja | Pegawai+ |

### File yang Sudah Ada (JANGAN diubah kecuali disebut)

- `backend/src/db/schema/pegawai.ts` — Berisi skema tabel `pengguna`, `pegawai`, `skemaJamKerja`, `masterJenisKepegawaian`.
- `backend/src/middleware/authGuard.ts` — Plugin otentikasi JWT. Menyediakan objek `user` di context (berisi `id`, `email`, `peran`, `id_pegawai`, `id_unit_kerja`).
- `backend/src/middleware/roleGuard.ts` — Factory function `roleGuard(allowedRoles: string[])` untuk RBAC.
- `backend/src/index.ts` — Titik masuk aplikasi. Anda perlu menambahkan import dan `.use()` di sini.

### Kolom Tabel `pegawai` (Untuk Referensi Body Request)

Kolom utama yang bisa di-CRUD: `id_unit_kerja`, `id_skema_jam_kerja`, `nip`, `nuptk`, `nik`, `nama_lengkap`, `jenis_kelamin`, `tempat_lahir`, `tanggal_lahir`, `agama`, `status_perkawinan`, `telepon`, `alamat`, `tanggal_masuk`, `nama_bank`, `nomor_rekening`, `nama_pemilik_rekening`, `npwp`, `nama_kontak_darurat`, `telepon_kontak_darurat`, `catatan`.

---

## 🛠️ Langkah 1: Buat File Route Pegawai

Buat file baru di `backend/src/routes/v1/pegawai.ts` dan masukkan kode berikut:

**File: `backend/src/routes/v1/pegawai.ts`**
```typescript
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { pegawai, pengguna } from '../../db/schema/pegawai';
import { eq, and, ilike, sql, count } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';
import * as bcrypt from 'bcryptjs';

export const pegawaiRoutes = new Elysia({ prefix: '/v1/pegawai' })
  .use(authPlugin) // Semua endpoint pegawai butuh otentikasi

  // -----------------------------------------------------------
  // 👥 GET /v1/pegawai/unit-saya
  // Daftar pegawai se-unit kerja pengguna yang login.
  // Endpoint ini harus didaftarkan SEBELUM /:id agar tidak tertimpa.
  // -----------------------------------------------------------
  .get('/unit-saya', async ({ user, set }: any) => {
    try {
      if (!user || !user.id_unit_kerja) {
        set.status = 400;
        return { status: 'error', message: 'Anda tidak terdaftar di unit kerja manapun' };
      }

      const daftar = await db
        .select({
          id: pegawai.id,
          nama_lengkap: pegawai.nama_lengkap,
          nip: pegawai.nip,
          jenis_kelamin: pegawai.jenis_kelamin,
          telepon: pegawai.telepon,
          url_foto: pegawai.url_foto,
          aktif: pegawai.aktif,
        })
        .from(pegawai)
        .where(
          and(
            eq(pegawai.id_unit_kerja, user.id_unit_kerja),
            eq(pegawai.aktif, true)
          )
        );

      return { status: 'success', data: daftar };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Gagal mengambil data pegawai unit' };
    }
  })

  // -----------------------------------------------------------
  // 📋 GET /v1/pegawai
  // Daftar pegawai dengan paginasi, pencarian, dan filter.
  // Query params: page, limit, search, id_unit_kerja
  // -----------------------------------------------------------
  .get('/', async ({ query, user, set }: any) => {
    try {
      // Hanya admin yang bisa melihat semua pegawai
      const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit'];
      if (!allowedRoles.includes(user?.peran)) {
        set.status = 403;
        return { status: 'error', message: 'Anda tidak memiliki akses' };
      }

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      const offset = (page - 1) * limit;
      const search = query.search || '';
      const filterUnitKerja = query.id_unit_kerja || '';

      // Bangun kondisi filter
      const conditions: any[] = [];
      
      if (search) {
        conditions.push(ilike(pegawai.nama_lengkap, `%${search}%`));
      }
      if (filterUnitKerja) {
        conditions.push(eq(pegawai.id_unit_kerja, filterUnitKerja));
      }

      // Hitung total
      const totalResult = await db
        .select({ total: count() })
        .from(pegawai)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      const total = Number(totalResult[0].total);

      // Ambil data dengan paginasi
      const data = await db
        .select()
        .from(pegawai)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(limit)
        .offset(offset);

      return {
        status: 'success',
        data,
        meta: {
          page,
          limit,
          total,
          total_halaman: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Gagal mengambil data pegawai' };
    }
  })

  // -----------------------------------------------------------
  // 🔍 GET /v1/pegawai/:id
  // Detail lengkap satu pegawai.
  // -----------------------------------------------------------
  .get('/:id', async ({ params: { id }, user, set }: any) => {
    try {
      const result = await db.select().from(pegawai).where(eq(pegawai.id, id)).limit(1);

      if (result.length === 0) {
        set.status = 404;
        return { status: 'error', message: 'Pegawai tidak ditemukan' };
      }

      // Pegawai biasa hanya boleh lihat diri sendiri
      if (user.peran === 'pegawai' && user.id_pegawai !== id) {
        set.status = 403;
        return { status: 'error', message: 'Anda hanya bisa melihat data diri sendiri' };
      }

      return { status: 'success', data: result[0] };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Gagal mengambil detail pegawai' };
    }
  })

  // -----------------------------------------------------------
  // ➕ POST /v1/pegawai
  // Tambah pegawai baru + buat akun pengguna otomatis.
  // -----------------------------------------------------------
  .post(
    '/',
    async ({ body, user, set }: any) => {
      try {
        // Hanya Admin yang bisa menambahkan pegawai
        const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Anda tidak memiliki akses untuk menambah pegawai' };
        }

        // 1. Buat akun pengguna dulu (jika email disertakan)
        let idPengguna: string | undefined;
        if (body.email) {
          const hashedPassword = await bcrypt.hash(body.password || 'mahesa123', 10);
          const newUser = await db.insert(pengguna).values({
            email: body.email,
            hash_kata_sandi: hashedPassword,
            peran: body.peran || 'pegawai',
          }).returning();
          idPengguna = newUser[0].id;
        }

        // 2. Insert data pegawai
        const inserted = await db.insert(pegawai).values({
          id_pengguna: idPengguna,
          id_unit_kerja: body.id_unit_kerja,
          id_skema_jam_kerja: body.id_skema_jam_kerja,
          nip: body.nip,
          nuptk: body.nuptk,
          nik: body.nik,
          nama_lengkap: body.nama_lengkap,
          jenis_kelamin: body.jenis_kelamin,
          tempat_lahir: body.tempat_lahir,
          tanggal_lahir: body.tanggal_lahir,
          agama: body.agama,
          status_perkawinan: body.status_perkawinan,
          telepon: body.telepon,
          alamat: body.alamat,
          tanggal_masuk: body.tanggal_masuk,
          nama_bank: body.nama_bank,
          nomor_rekening: body.nomor_rekening,
          nama_pemilik_rekening: body.nama_pemilik_rekening,
          npwp: body.npwp,
          nama_kontak_darurat: body.nama_kontak_darurat,
          telepon_kontak_darurat: body.telepon_kontak_darurat,
          catatan: body.catatan,
          sumber_awal: 'manual',
        }).returning();

        return { status: 'success', message: 'Pegawai berhasil ditambahkan', data: inserted[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        // Akun login (opsional)
        email: t.Optional(t.String()),
        password: t.Optional(t.String()),
        peran: t.Optional(t.String()),
        // Data pegawai (wajib)
        id_unit_kerja: t.String(),
        nik: t.String(),
        nama_lengkap: t.String(),
        jenis_kelamin: t.String(),
        tanggal_masuk: t.String(),
        // Data pegawai (opsional)
        id_skema_jam_kerja: t.Optional(t.String()),
        nip: t.Optional(t.String()),
        nuptk: t.Optional(t.String()),
        tempat_lahir: t.Optional(t.String()),
        tanggal_lahir: t.Optional(t.String()),
        agama: t.Optional(t.String()),
        status_perkawinan: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        alamat: t.Optional(t.String()),
        nama_bank: t.Optional(t.String()),
        nomor_rekening: t.Optional(t.String()),
        nama_pemilik_rekening: t.Optional(t.String()),
        npwp: t.Optional(t.String()),
        nama_kontak_darurat: t.Optional(t.String()),
        telepon_kontak_darurat: t.Optional(t.String()),
        catatan: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // ✏️ PUT /v1/pegawai/:id
  // Update data pegawai yang sudah ada.
  // -----------------------------------------------------------
  .put(
    '/:id',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Anda tidak memiliki akses untuk mengedit pegawai' };
        }

        const updated = await db.update(pegawai).set({
          ...body,
          diperbarui_pada: new Date(),
        }).where(eq(pegawai.id, id)).returning();

        if (updated.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Pegawai tidak ditemukan' };
        }

        return { status: 'success', message: 'Data pegawai berhasil diperbarui', data: updated[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        id_unit_kerja: t.Optional(t.String()),
        id_skema_jam_kerja: t.Optional(t.String()),
        nip: t.Optional(t.String()),
        nuptk: t.Optional(t.String()),
        nik: t.Optional(t.String()),
        nama_lengkap: t.Optional(t.String()),
        jenis_kelamin: t.Optional(t.String()),
        tempat_lahir: t.Optional(t.String()),
        tanggal_lahir: t.Optional(t.String()),
        agama: t.Optional(t.String()),
        status_perkawinan: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        alamat: t.Optional(t.String()),
        nama_bank: t.Optional(t.String()),
        nomor_rekening: t.Optional(t.String()),
        nama_pemilik_rekening: t.Optional(t.String()),
        npwp: t.Optional(t.String()),
        nama_kontak_darurat: t.Optional(t.String()),
        telepon_kontak_darurat: t.Optional(t.String()),
        catatan: t.Optional(t.String()),
        aktif: t.Optional(t.Boolean()),
      })
    }
  )

  // -----------------------------------------------------------
  // 🗑️ DELETE /v1/pegawai/:id
  // Soft delete: menonaktifkan pegawai (aktif = false).
  // Hanya Admin Dinas yang bisa.
  // -----------------------------------------------------------
  .delete('/:id', async ({ params: { id }, user, set }: any) => {
    try {
      if (user?.peran !== 'admin_dinas') {
        set.status = 403;
        return { status: 'error', message: 'Hanya Admin Dinas yang bisa menonaktifkan pegawai' };
      }

      const updated = await db.update(pegawai).set({
        aktif: false,
        diperbarui_pada: new Date(),
      }).where(eq(pegawai.id, id)).returning();

      if (updated.length === 0) {
        set.status = 404;
        return { status: 'error', message: 'Pegawai tidak ditemukan' };
      }

      return { status: 'success', message: 'Pegawai berhasil dinonaktifkan' };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  });
```

---

## 🛠️ Langkah 2: Daftarkan Route di `index.ts`

1. Buka file `backend/src/index.ts`.
2. Tambahkan import di bagian atas:
   ```typescript
   import { pegawaiRoutes } from "./routes/v1/pegawai";
   ```
3. Tambahkan `.use(pegawaiRoutes)` setelah `.use(organisasiRoutes)`:
   ```typescript
   const app = new Elysia()
     .use(otentikasiRoutes)
     .use(organisasiRoutes)
     .use(pegawaiRoutes) // Tambahkan baris ini
     .get("/", () => "Hello MAHESA Backend is Running!")
     .listen(3000);
   ```

---

## 🧪 Langkah 3: Pengujian (Testing)

### Verifikasi Kompilasi
```bash
bunx tsc --noEmit
```
Pastikan output: **0 Error**.

### Jalankan Server
```bash
bun run dev
```

### Skenario Pengujian (Gunakan Postman/ThunderClient)

**Skenario 1: Akses tanpa token (harus 401)**
- `GET http://localhost:3000/v1/pegawai` → Expect `401`
- `GET http://localhost:3000/v1/pegawai/unit-saya` → Expect `401`

**Skenario 2: Akses dengan token valid**
- Login terlebih dahulu via `POST /v1/otentikasi/masuk` untuk mendapatkan token.
- Gunakan token di header `Authorization: Bearer <TOKEN>`.
- `GET http://localhost:3000/v1/pegawai/unit-saya` → Expect `200` atau `400` (jika pegawai tidak punya unit kerja).
- `GET http://localhost:3000/v1/pegawai?page=1&limit=10` → Expect `200` (jika peran admin) atau `403`.

Jika semua skenario berjalan sesuai ekspektasi, **Issue #7 dinyatakan SELESAI**.
