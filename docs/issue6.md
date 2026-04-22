# 📋 Eksekusi Issue #6: API CRUD Modul Organisasi (Dinas & Unit Kerja)

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #6]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu.

---

## 🛠️ Langkah 1: Buat File Route Organisasi

Kita akan membuat antarmuka API baru untuk mengelola hierarki dan entitas organisasi (Dinas dan Unit Kerja).

1. Buat file baru di `backend/src/routes/v1/organisasi.ts`.
2. Masukkan kode di bawah ini ke dalam file tersebut:

**File: `backend/src/routes/v1/organisasi.ts`**
```typescript
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { dinas, unitKerja, levelUnitKerja } from '../../db/schema/organisasi';
import { pegawai } from '../../db/schema/pegawai';
import { eq } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';

export const organisasiRoutes = new Elysia({ prefix: '/v1/organisasi' })
  .use(authPlugin) // Semua endpoint organisasi dilindungi token

  // -----------------------------------------------------------
  // 🏢 MODUL DINAS (Hanya ada 1 record master Dinas)
  // -----------------------------------------------------------
  .get('/dinas', async ({ set }: any) => {
    try {
      const result = await db.select().from(dinas).limit(1);
      if (result.length === 0) {
        return { status: 'success', data: null, message: 'Data dinas belum disiapkan.' };
      }
      return { status: 'success', data: result[0] };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Terjadi kesalahan saat mengambil data dinas' };
    }
  })

  .put(
    '/dinas',
    async ({ body, set }: any) => {
      try {
        const dinasList = await db.select().from(dinas).limit(1);
        
        if (dinasList.length === 0) {
          // Insert jika belum ada
          const inserted = await db.insert(dinas).values({
            nama: body.nama,
            kode: body.kode,
            alamat: body.alamat,
            telepon: body.telepon,
            email: body.email,
            latitude: body.latitude?.toString(),
            longitude: body.longitude?.toString(),
          }).returning();
          return { status: 'success', message: 'Dinas berhasil dibuat', data: inserted[0] };
        } else {
          // Update jika sudah ada
          const masterDinas = dinasList[0];
          const updated = await db.update(dinas).set({
            nama: body.nama,
            kode: body.kode,
            alamat: body.alamat,
            telepon: body.telepon,
            email: body.email,
            latitude: body.latitude?.toString(),
            longitude: body.longitude?.toString(),
            diperbarui_pada: new Date(),
          }).where(eq(dinas.id, masterDinas.id)).returning();
          return { status: 'success', message: 'Data dinas berhasil diperbarui', data: updated[0] };
        }
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        nama: t.String(),
        kode: t.String(),
        alamat: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        email: t.Optional(t.String()),
        latitude: t.Optional(t.Number()),
        longitude: t.Optional(t.Number()),
      })
    }
  )

  // -----------------------------------------------------------
  // 🏫 MODUL UNIT KERJA
  // -----------------------------------------------------------
  .get('/unit-kerja', async ({ set }: any) => {
    try {
      const data = await db.select().from(unitKerja);
      return { status: 'success', data };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Terjadi kesalahan internal' };
    }
  })

  .post(
    '/unit-kerja',
    async ({ body, set }: any) => {
      try {
        const inserted = await db.insert(unitKerja).values({
          id_dinas: body.id_dinas,
          id_level_unit: body.id_level_unit,
          id_induk_unit: body.id_induk_unit,
          nama: body.nama,
          kode: body.kode,
          jenis: body.jenis,
          alamat: body.alamat,
          telepon: body.telepon,
          email: body.email,
          latitude: body.latitude.toString(),
          longitude: body.longitude.toString(),
          radius_absensi_meter: body.radius_absensi_meter,
        }).returning();
        return { status: 'success', message: 'Unit Kerja berhasil ditambahkan', data: inserted[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        id_dinas: t.String(),
        id_level_unit: t.String(),
        id_induk_unit: t.Optional(t.String()),
        nama: t.String(),
        kode: t.String(),
        jenis: t.String(),
        alamat: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        email: t.Optional(t.String()),
        latitude: t.Number(),
        longitude: t.Number(),
        radius_absensi_meter: t.Optional(t.Number()),
      })
    }
  )

  .put(
    '/unit-kerja/:id',
    async ({ params: { id }, body, set }: any) => {
      try {
        const updated = await db.update(unitKerja).set({
          ...body,
          latitude: body.latitude?.toString(),
          longitude: body.longitude?.toString(),
          diperbarui_pada: new Date(),
        }).where(eq(unitKerja.id, id)).returning();
        
        if (updated.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Unit kerja tidak ditemukan' };
        }
        return { status: 'success', message: 'Unit Kerja diperbarui', data: updated[0] };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        nama: t.Optional(t.String()),
        kode: t.Optional(t.String()),
        jenis: t.Optional(t.String()),
        alamat: t.Optional(t.String()),
        telepon: t.Optional(t.String()),
        email: t.Optional(t.String()),
        latitude: t.Optional(t.Number()),
        longitude: t.Optional(t.Number()),
        radius_absensi_meter: t.Optional(t.Number()),
        aktif: t.Optional(t.Boolean()),
      })
    }
  )

  .delete('/unit-kerja/:id', async ({ params: { id }, set }: any) => {
    try {
      // Soft delete: kita hanya menonaktifkan unit kerjanya
      const updated = await db.update(unitKerja).set({ aktif: false, diperbarui_pada: new Date() }).where(eq(unitKerja.id, id)).returning();
      if (updated.length === 0) {
        set.status = 404;
        return { status: 'error', message: 'Unit kerja tidak ditemukan' };
      }
      return { status: 'success', message: 'Unit kerja berhasil dinonaktifkan' };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 👥 MODUL PEGAWAI UNIT
  // -----------------------------------------------------------
  .get('/unit-kerja/:id/pegawai', async ({ params: { id }, set }: any) => {
    try {
      const daftarPegawai = await db.select().from(pegawai).where(eq(pegawai.id_unit_kerja, id));
      return { status: 'success', data: daftarPegawai };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Gagal mengambil data pegawai unit' };
    }
  })

  // -----------------------------------------------------------
  // 🌳 MODUL POHON ORGANISASI
  // -----------------------------------------------------------
  .get('/pohon-organisasi', async ({ set }: any) => {
    try {
      // 1. Ambil data master dinas
      const dataDinas = await db.select().from(dinas).limit(1);
      if (dataDinas.length === 0) {
        return { status: 'success', data: [] };
      }

      // 2. Ambil semua unit kerja aktif
      const semuaUnit = await db.select().from(unitKerja).where(eq(unitKerja.aktif, true));

      // 3. Bangun hierarki (Level 2 = UPT, Level 3 = Sekolah di bawah UPT, dsb)
      const buildTree = (parentId: string | null): any[] => {
        return semuaUnit
          .filter(u => u.id_induk_unit === parentId)
          .map(u => ({
            ...u,
            anak_unit: buildTree(u.id),
          }));
      };

      // Unit yang tidak punya id_induk_unit berarti langsung di bawah dinas
      const pohon = {
        ...dataDinas[0],
        anak_unit: buildTree(null),
      };

      return { status: 'success', data: pohon };
    } catch (error) {
      set.status = 500;
      return { status: 'error', message: 'Gagal membangun pohon organisasi' };
    }
  });
```

---

## 🛠️ Langkah 2: Daftarkan Route di `index.ts`

Agar route organisasi dapat diakses, kita perlu mendaftarkannya di file utama.

1. Buka file `backend/src/index.ts`.
2. Impor route yang baru saja dibuat di bagian atas:
   ```typescript
   import { organisasiRoutes } from "./routes/v1/organisasi";
   ```
3. Tambahkan `.use(organisasiRoutes)` ke dalam instance aplikasi Elysia Anda, tepat setelah mendaftarkan `otentikasiRoutes`:
   ```typescript
   const app = new Elysia()
     .use(otentikasiRoutes)
     .use(organisasiRoutes) // Tambahkan baris ini
     // ...
   ```

---

## 🧪 Langkah 3: Pengujian (Testing)

1. Jalankan server: `bun run dev`.
2. Verifikasi terlebih dahulu dengan kompilator: `bunx tsc --noEmit`. Pastikan tidak ada *error* (0 errors).
3. Gunakan Postman/ThunderClient. Jangan lupa sertakan header `Authorization: Bearer <TOKEN>` pada semua request di bawah ini.
4. **Test 1:** Buat GET request ke `http://localhost:3000/v1/organisasi/dinas`. Output diharapkan: Data dinas kosong atau ada (Success).
5. **Test 2:** Buat GET request ke `http://localhost:3000/v1/organisasi/pohon-organisasi`. Output diharapkan: JSON berstruktur hierarki.

Jika semua *test* berhasil, **Issue #6 dinyatakan SELESAI**.
