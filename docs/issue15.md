# 📋 Eksekusi Issue #15: Modul Absensi (GPS & Selfie Verification)

Panduan **Copy-Paste** untuk menyelesaikan modul absensi. Ikuti langkah per langkah.

---

## 📚 Konteks

### Apa yang akan dibuat?
Sistem absensi pegawai berbasis GPS + Selfie. Pegawai membuka app → klik "Masuk Kerja" → sistem validasi GPS (dalam radius kantor?) → simpan foto selfie → catat waktu masuk. Sore hari, proses serupa untuk "Pulang Kerja".

### Endpoint (Referensi: `planningall.md` Bab 8.2)

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|-------|
| `POST` | `/v1/absensi/titik` | Submit titik absensi + GPS + selfie | Pegawai / Pimpinan |
| `POST` | `/v1/absensi/manual` | Input absensi bawahan manual (tanpa GPS) | Pimpinan / Admin Unit |
| `GET` | `/v1/absensi/hari-ini` | Status absensi hari ini | Pegawai / Pimpinan |
| `GET` | `/v1/absensi/saya` | Riwayat absensi sendiri (paginasi) | Pegawai / Pimpinan |
| `GET` | `/v1/absensi` | Daftar absensi semua (filter) | Admin+ / Pimpinan |
| `PUT` | `/v1/absensi/:id/koreksi` | Koreksi absensi | Admin Unit+ |

### Skema Database (dari `planningall.md` Bab 5.2)

**Tabel `absensi`** — Header per hari per pegawai:
```sql
CREATE TABLE absensi (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    tanggal             DATE NOT NULL,
    tipe                VARCHAR(20) NOT NULL DEFAULT 'kantor', -- kantor, dinas_luar
    status              VARCHAR(20) NOT NULL DEFAULT 'hadir',  -- hadir, terlambat, tidak_hadir, izin, sakit, cuti, dinas_luar
    jam_kerja           DECIMAL(4,2),        -- Total jam kerja (auto-calc)
    diabsenkan_oleh     UUID REFERENCES pegawai(id), -- Jika pimpinan absenkan bawahan
    catatan             TEXT,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(id_pegawai, tanggal)
);
```

**Tabel `titik_absensi`** — Setiap titik (jam_masuk, jam_pulang):
```sql
CREATE TABLE titik_absensi (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_absensi          UUID NOT NULL REFERENCES absensi(id) ON DELETE CASCADE,
    jenis_titik         VARCHAR(30) NOT NULL, -- jam_masuk, jam_pulang
    waktu               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude            DECIMAL(10,7),
    longitude           DECIMAL(10,7),
    url_foto            VARCHAR(500),         -- URL selfie di MinIO
    dalam_radius        BOOLEAN,
    diabsenkan_manual   BOOLEAN NOT NULL DEFAULT false,
    nama_lokasi         VARCHAR(255),
    catatan             TEXT,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 🛠️ Langkah 1: Buat Skema Database

**File: `backend/src/db/schema/absensi.ts`**
```typescript
import {
  pgTable, uuid, varchar, text, boolean, timestamp, date, decimal, unique
} from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';

// Tabel absensi — Header kehadiran per hari per pegawai
export const absensi = pgTable('absensi', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_pegawai: uuid('id_pegawai').notNull().references(() => pegawai.id),
  tanggal: date('tanggal').notNull(),
  tipe: varchar('tipe', { length: 20 }).notNull().default('kantor'),
  status: varchar('status', { length: 20 }).notNull().default('hadir'),
  jam_kerja: decimal('jam_kerja', { precision: 4, scale: 2 }),
  diabsenkan_oleh: uuid('diabsenkan_oleh').references(() => pegawai.id),
  catatan: text('catatan'),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniquePegawaiTanggal: unique().on(table.id_pegawai, table.tanggal),
}));

// Tabel titik_absensi — Setiap titik waktu (masuk/pulang)
export const titikAbsensi = pgTable('titik_absensi', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_absensi: uuid('id_absensi').notNull().references(() => absensi.id, { onDelete: 'cascade' }),
  jenis_titik: varchar('jenis_titik', { length: 30 }).notNull(),
  waktu: timestamp('waktu', { withTimezone: true }).notNull().defaultNow(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  url_foto: varchar('url_foto', { length: 500 }),
  dalam_radius: boolean('dalam_radius'),
  diabsenkan_manual: boolean('diabsenkan_manual').notNull().default(false),
  nama_lokasi: varchar('nama_lokasi', { length: 255 }),
  catatan: text('catatan'),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
});
```

### Push ke Database
Buat script manual atau gunakan `bunx drizzle-kit push --force`.

---

## 🛠️ Langkah 2: Buat Helper GPS

**File: `backend/src/lib/geo.ts`**
```typescript
function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Hitung jarak antara dua koordinat (dalam meter)
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
    * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Cek apakah posisi pegawai dalam radius yang diizinkan
export function isWithinRadius(
  empLat: number, empLng: number,
  targetLat: number, targetLng: number,
  radiusMeters: number
): boolean {
  return haversineDistance(empLat, empLng, targetLat, targetLng) <= radiusMeters;
}
```

---

## 🛠️ Langkah 3: Buat File Route Absensi

**File: `backend/src/routes/v1/absensi.ts`**
```typescript
import { Elysia, t } from 'elysia';
import { db } from '../../db';
import { absensi, titikAbsensi } from '../../db/schema/absensi';
import { pegawai } from '../../db/schema/pegawai';
import { unitKerja } from '../../db/schema/organisasi';
import { eq, and, desc, between, sql } from 'drizzle-orm';
import { authPlugin } from '../../middleware/authGuard';
import { isWithinRadius } from '../../lib/geo';
import { uploadFile } from '../../lib/penyimpanan';
import sharp from 'sharp';

export const absensiRoutes = new Elysia({ prefix: '/v1/absensi' })
  .use(authPlugin)

  // -----------------------------------------------------------
  // 📍 POST /v1/absensi/titik
  // Submit titik absensi (jam_masuk / jam_pulang) + GPS + Selfie
  // -----------------------------------------------------------
  .post(
    '/titik',
    async ({ body, user, set }: any) => {
      try {
        if (!user || !user.id_pegawai) {
          set.status = 400;
          return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
        }

        const { jenis_titik, latitude, longitude, foto, catatan } = body;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Ambil data pegawai + unit kerja untuk validasi radius
        const pegawaiData = await db.select().from(pegawai)
          .where(eq(pegawai.id, user.id_pegawai)).limit(1);
        if (pegawaiData.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Data pegawai tidak ditemukan' };
        }

        const unitData = await db.select().from(unitKerja)
          .where(eq(unitKerja.id, pegawaiData[0].id_unit_kerja)).limit(1);
        if (unitData.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Unit kerja tidak ditemukan' };
        }

        // Validasi radius GPS
        const unit = unitData[0];
        const dalamRadius = isWithinRadius(
          latitude, longitude,
          parseFloat(unit.latitude as string),
          parseFloat(unit.longitude as string),
          unit.radius_absensi_meter
        );

        if (!dalamRadius) {
          set.status = 400;
          return {
            status: 'error',
            message: 'Anda berada di luar jangkauan radius absensi unit kerja',
            data: { radius_meter: unit.radius_absensi_meter }
          };
        }

        // Upload foto selfie ke MinIO (kompres dulu)
        let urlFoto: string | null = null;
        if (foto) {
          const buffer = Buffer.from(await foto.arrayBuffer());
          const compressed = await sharp(buffer).resize(640, 640, { fit: 'inside' }).webp({ quality: 75 }).toBuffer();
          const key = `absensi/${user.id_pegawai}/${today}_${jenis_titik}_${Date.now()}.webp`;
          urlFoto = await uploadFile(key, compressed, 'image/webp');
        }

        // Cari/buat record absensi hari ini
        let absensiHariIni = await db.select().from(absensi)
          .where(and(eq(absensi.id_pegawai, user.id_pegawai), eq(absensi.tanggal, today)))
          .limit(1);

        let absensiId: string;

        if (absensiHariIni.length === 0) {
          // Belum ada → buat baru (hanya saat jam_masuk)
          if (jenis_titik !== 'jam_masuk') {
            set.status = 400;
            return { status: 'error', message: 'Anda belum melakukan absen masuk hari ini' };
          }

          // Cek keterlambatan berdasarkan skema jam kerja
          const now = new Date();
          let statusAbsensi = 'hadir';
          // TODO: Bandingkan now vs skema_jam_kerja.jam_masuk + toleransi untuk tentukan 'terlambat'

          const inserted = await db.insert(absensi).values({
            id_pegawai: user.id_pegawai,
            tanggal: today,
            tipe: 'kantor',
            status: statusAbsensi,
          }).returning();
          absensiId = inserted[0].id;
        } else {
          absensiId = absensiHariIni[0].id;

          // Cek duplikat titik
          const existingTitik = await db.select().from(titikAbsensi)
            .where(and(eq(titikAbsensi.id_absensi, absensiId), eq(titikAbsensi.jenis_titik, jenis_titik)));
          if (existingTitik.length > 0) {
            set.status = 400;
            return { status: 'error', message: `Anda sudah melakukan absen ${jenis_titik} hari ini` };
          }
        }

        // Simpan titik absensi
        const titik = await db.insert(titikAbsensi).values({
          id_absensi: absensiId,
          jenis_titik,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          url_foto: urlFoto,
          dalam_radius: dalamRadius,
          catatan,
        }).returning();

        // Jika jam_pulang → hitung jam kerja
        if (jenis_titik === 'jam_pulang') {
          const semuaTitik = await db.select().from(titikAbsensi)
            .where(eq(titikAbsensi.id_absensi, absensiId));
          const titikMasuk = semuaTitik.find(t => t.jenis_titik === 'jam_masuk');
          if (titikMasuk) {
            const masuk = new Date(titikMasuk.waktu).getTime();
            const pulang = new Date(titik[0].waktu).getTime();
            const jamKerja = ((pulang - masuk) / 3600000).toFixed(2);
            await db.update(absensi).set({
              jam_kerja: jamKerja,
              diperbarui_pada: new Date(),
            }).where(eq(absensi.id, absensiId));
          }
        }

        return {
          status: 'success',
          message: `Absen ${jenis_titik} berhasil dicatat`,
          data: titik[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        jenis_titik: t.String(), // 'jam_masuk' atau 'jam_pulang'
        latitude: t.Number(),
        longitude: t.Number(),
        foto: t.Optional(t.File()), // Selfie (opsional untuk fase awal)
        catatan: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // 📋 POST /v1/absensi/manual
  // Pimpinan mengabsenkan bawahan secara manual
  // -----------------------------------------------------------
  .post(
    '/manual',
    async ({ body, user, set }: any) => {
      try {
        const allowedRoles = ['pimpinan', 'admin_unit', 'admin_upt', 'admin_dinas'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Hanya pimpinan/admin yang bisa mengabsenkan manual' };
        }

        const { id_pegawai, jenis_titik, catatan } = body;
        const today = new Date().toISOString().split('T')[0];

        // Cari/buat record absensi hari ini
        let absensiHariIni = await db.select().from(absensi)
          .where(and(eq(absensi.id_pegawai, id_pegawai), eq(absensi.tanggal, today)))
          .limit(1);

        let absensiId: string;
        if (absensiHariIni.length === 0) {
          const inserted = await db.insert(absensi).values({
            id_pegawai: id_pegawai,
            tanggal: today,
            tipe: 'kantor',
            status: 'hadir',
            diabsenkan_oleh: user.id_pegawai,
          }).returning();
          absensiId = inserted[0].id;
        } else {
          absensiId = absensiHariIni[0].id;
        }

        const titik = await db.insert(titikAbsensi).values({
          id_absensi: absensiId,
          jenis_titik,
          diabsenkan_manual: true,
          catatan: catatan || `Diabsenkan manual oleh pimpinan`,
        }).returning();

        return {
          status: 'success',
          message: `Absen manual ${jenis_titik} berhasil dicatat`,
          data: titik[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        id_pegawai: t.String(),
        jenis_titik: t.String(),
        catatan: t.Optional(t.String()),
      })
    }
  )

  // -----------------------------------------------------------
  // 📅 GET /v1/absensi/hari-ini
  // Status absensi hari ini untuk pegawai yang login
  // -----------------------------------------------------------
  .get('/hari-ini', async ({ user, set }: any) => {
    try {
      if (!user?.id_pegawai) {
        set.status = 400;
        return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
      }
      const today = new Date().toISOString().split('T')[0];
      const result = await db.select().from(absensi)
        .where(and(eq(absensi.id_pegawai, user.id_pegawai), eq(absensi.tanggal, today)))
        .limit(1);

      if (result.length === 0) {
        return { status: 'success', data: null, message: 'Belum absen hari ini' };
      }

      const titikList = await db.select().from(titikAbsensi)
        .where(eq(titikAbsensi.id_absensi, result[0].id))
        .orderBy(titikAbsensi.waktu);

      return { status: 'success', data: { ...result[0], titik: titikList } };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 📜 GET /v1/absensi/saya
  // Riwayat absensi pegawai sendiri (paginasi)
  // -----------------------------------------------------------
  .get('/saya', async ({ query, user, set }: any) => {
    try {
      if (!user?.id_pegawai) {
        set.status = 400;
        return { status: 'error', message: 'Anda tidak terdaftar sebagai pegawai' };
      }
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '20');
      const offset = (page - 1) * limit;

      const data = await db.select().from(absensi)
        .where(eq(absensi.id_pegawai, user.id_pegawai))
        .orderBy(desc(absensi.tanggal))
        .limit(limit).offset(offset);

      return { status: 'success', data, meta: { page, limit } };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // 📊 GET /v1/absensi
  // Daftar absensi semua pegawai (Admin/Pimpinan, filter)
  // -----------------------------------------------------------
  .get('/', async ({ query, user, set }: any) => {
    try {
      const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit', 'pimpinan'];
      if (!allowedRoles.includes(user?.peran)) {
        set.status = 403;
        return { status: 'error', message: 'Anda tidak memiliki akses' };
      }

      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '20');
      const offset = (page - 1) * limit;

      const conditions: any[] = [];
      if (query.tanggal) conditions.push(eq(absensi.tanggal, query.tanggal));
      if (query.id_pegawai) conditions.push(eq(absensi.id_pegawai, query.id_pegawai));
      if (query.status) conditions.push(eq(absensi.status, query.status));

      const data = await db.select().from(absensi)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(absensi.tanggal))
        .limit(limit).offset(offset);

      return { status: 'success', data, meta: { page, limit } };
    } catch (error: any) {
      set.status = 500;
      return { status: 'error', message: error.message };
    }
  })

  // -----------------------------------------------------------
  // ✏️ PUT /v1/absensi/:id/koreksi
  // Koreksi status absensi (Admin Unit+)
  // -----------------------------------------------------------
  .put(
    '/:id/koreksi',
    async ({ params: { id }, body, user, set }: any) => {
      try {
        const allowedRoles = ['admin_dinas', 'admin_upt', 'admin_unit'];
        if (!allowedRoles.includes(user?.peran)) {
          set.status = 403;
          return { status: 'error', message: 'Anda tidak memiliki akses untuk koreksi' };
        }

        const updated = await db.update(absensi).set({
          status: body.status,
          catatan: body.catatan || null,
          diperbarui_pada: new Date(),
        }).where(eq(absensi.id, id)).returning();

        if (updated.length === 0) {
          set.status = 404;
          return { status: 'error', message: 'Data absensi tidak ditemukan' };
        }

        return {
          status: 'success',
          message: 'Absensi berhasil dikoreksi',
          data: updated[0],
        };
      } catch (error: any) {
        set.status = 500;
        return { status: 'error', message: error.message };
      }
    },
    {
      body: t.Object({
        status: t.String(), // hadir, terlambat, izin, sakit, dll
        catatan: t.Optional(t.String()),
      })
    }
  );
```

---

## 🛠️ Langkah 4: Daftarkan Route di `index.ts`

```diff
+import { absensiRoutes } from "./routes/v1/absensi";

 const app = new Elysia()
   .use(otentikasiRoutes)
   .use(organisasiRoutes)
   .use(pegawaiRoutes)
   .use(biodataRoutes)
+  .use(absensiRoutes)
```

---

## 🧪 Langkah 5: Pengujian

### Push Skema & Jalankan Server
```bash
# Push skema ke DB (atau buat script manual CREATE TABLE)
bunx drizzle-kit push --force

# Jalankan server
bun run dev
```

### Skenario 1: Absen Masuk (GPS dalam radius)
```
POST /v1/absensi/titik
Header: Authorization: Bearer <token>
Body (multipart/form-data):
  jenis_titik: "jam_masuk"
  latitude: -6.9175     ← Sesuai koordinat unit kerja dari seeder
  longitude: 107.5169
```
→ Expect `200` "Absen jam_masuk berhasil dicatat"

### Skenario 2: Absen Masuk (GPS di luar radius)
```
POST /v1/absensi/titik
Body:
  jenis_titik: "jam_masuk"
  latitude: -7.0000     ← Koordinat jauh
  longitude: 108.0000
```
→ Expect `400` "di luar jangkauan radius absensi"

### Skenario 3: Cek Status Hari Ini
```
GET /v1/absensi/hari-ini
```
→ Expect `200` dengan data absensi + titik

### Skenario 4: Absen Pulang
```
POST /v1/absensi/titik
Body:
  jenis_titik: "jam_pulang"
  latitude: -6.9175
  longitude: 107.5169
```
→ Expect `200` + jam_kerja otomatis terhitung

### Skenario 5: Absen Manual oleh Pimpinan
```
POST /v1/absensi/manual
Body (JSON):
{
  "id_pegawai": "<id_pegawai_bawahan>",
  "jenis_titik": "jam_masuk",
  "catatan": "Pegawai lupa HP"
}
```
→ Expect `200`

### Skenario 6: Koreksi Absensi
```
PUT /v1/absensi/<id>/koreksi
Body:
{
  "status": "izin",
  "catatan": "Koreksi oleh admin"
}
```
→ Expect `200`

Jika semua skenario passed → **Issue #15 SELESAI**.
