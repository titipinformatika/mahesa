# 📋 Eksekusi Issue #2: Pembuatan Skema Database Master Organisasi

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #2]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu dan lakukan *copy-paste* pada kode yang disediakan.

---

## 🛠️ Langkah 1: Persiapan Folder Schema

1. Buka Terminal/Command Prompt.
2. Pastikan Anda berada di direktori `backend/` proyek Anda (`d:\MYDATA\Project\MAHESA\backend\`).
3. Buat folder `src/db/schema` (jika belum ada). Anda bisa membuatnya secara manual atau melalui terminal:
   ```bash
   mkdir -p src/db/schema
   ```

---

## 📝 Langkah 2: Pembuatan File Skema Organisasi

Buat file baru bernama `organisasi.ts` di dalam folder `src/db/schema/`. File ini akan mendefinisikan tabel-tabel master organisasi (seperti Dinas, Unit Kerja, dsb) menggunakan syntax Drizzle ORM.

Salin dan tempel (copy-paste) **seluruh kode di bawah ini** ke dalam file `backend/src/db/schema/organisasi.ts`:

**File: `backend/src/db/schema/organisasi.ts`**
```typescript
import { 
  pgTable, uuid, varchar, text, boolean, timestamp, decimal, integer, date, pgEnum, AnyPgColumn 
} from 'drizzle-orm/pg-core';

// ------------------------------------------------------
// 1. Tabel level_unit_kerja
// ------------------------------------------------------
export const levelUnitKerja = pgTable('level_unit_kerja', {
  id: uuid('id').defaultRandom().primaryKey(),
  level: integer('level').notNull().unique(), // 1 = Dinas, 2 = UPT, 3 = Sekolah
  nama: varchar('nama', { length: 100 }).notNull(),
  keterangan: text('keterangan'),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------
// 2. Tabel dinas
// ------------------------------------------------------
export const dinas = pgTable('dinas', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull(),
  kode: varchar('kode', { length: 20 }).notNull().unique(),
  alamat: text('alamat'),
  telepon: varchar('telepon', { length: 20 }),
  email: varchar('email', { length: 255 }),
  url_logo: varchar('url_logo', { length: 500 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  aktif: boolean('aktif').notNull().default(true),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------
// 3. Tabel unit_kerja
// ------------------------------------------------------
export const unitKerja = pgTable('unit_kerja', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Field Khusus Sekolah (Bisa NULL)
  sekolah_id_dapodik: uuid('sekolah_id_dapodik').unique(),
  bentuk_pendidikan: varchar('bentuk_pendidikan', { length: 50 }),
  status_sekolah: varchar('status_sekolah', { length: 50 }),
  npsn: varchar('npsn', { length: 20 }).unique(),
  
  // Field Umum (Foreign Keys)
  id_dinas: uuid('id_dinas').notNull().references(() => dinas.id),
  id_induk_unit: uuid('id_induk_unit').references((): AnyPgColumn => unitKerja.id), // Relasi ke UPT (Level 2)
  id_level_unit: uuid('id_level_unit').notNull().references(() => levelUnitKerja.id),
  
  // Field Detail
  nama: varchar('nama', { length: 255 }).notNull(),
  kode: varchar('kode', { length: 30 }).notNull().unique(),
  jenis: varchar('jenis', { length: 50 }).notNull(), // sd, smp, sma, smk, upt, kantor
  alamat: text('alamat'),
  telepon: varchar('telepon', { length: 20 }),
  email: varchar('email', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  radius_absensi_meter: integer('radius_absensi_meter').notNull().default(100),
  aktif: boolean('aktif').notNull().default(true),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------
// 4. Tabel pejabat_unit_kerja (Relasi Multi Pimpinan)
// ------------------------------------------------------
export const jabatanEnum = pgEnum('jabatan', ['kepala_definitif', 'plt', 'wakil_kepala']);

export const pejabatUnitKerja = pgTable('pejabat_unit_kerja', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_unit_kerja: uuid('id_unit_kerja').notNull().references(() => unitKerja.id, { onDelete: 'cascade' }),
  
  // Catatan: id_pegawai belum diberi .references() karena tabel pegawai baru akan dibuat di Issue #3.
  // Kolom ini akan kita update referensinya nanti.
  id_pegawai: uuid('id_pegawai').notNull(), 
  
  jabatan: jabatanEnum('jabatan').notNull(),
  tanggal_mulai: date('tanggal_mulai').notNull(),
  tanggal_selesai: date('tanggal_selesai'),
  aktif: boolean('aktif').notNull().default(true),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------
// 5. Tabel akses_admin_unit (Relasi Multi Admin/Operator)
// ------------------------------------------------------
export const peranAdminUnitEnum = pgEnum('peran_admin_unit', ['admin_unit', 'operator_absensi']);

export const aksesAdminUnit = pgTable('akses_admin_unit', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_unit_kerja: uuid('id_unit_kerja').notNull().references(() => unitKerja.id, { onDelete: 'cascade' }),
  
  // Catatan: id_pegawai & diberikan_oleh belum direferensikan ke tabel pegawai. Akan di-update di Issue #3.
  id_pegawai: uuid('id_pegawai').notNull(), 
  diberikan_oleh: uuid('diberikan_oleh'), 
  
  peran: peranAdminUnitEnum('peran').notNull().default('admin_unit'),
  aktif: boolean('aktif').notNull().default(true),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 📤 Langkah 3: Eksekusi Migrasi Database (Push to PostgreSQL)

Setelah file skema dibuat, saatnya menyuruh Drizzle ORM untuk membaca file tersebut dan mengeksekusi perintah SQL secara otomatis ke dalam database PostgreSQL kita.

1. Buka terminal (pastikan berada di dalam folder `backend/`).
2. Jalankan perintah berikut:
   ```bash
   bun run db:push
   ```
   *(Perintah ini setara dengan menjalankan `drizzle-kit push` karena sudah kita atur di `package.json` pada Issue #1).*

3. Jika Drizzle menanyakan sesuatu (seperti konfirmasi penambahan enum atau tabel), biasanya cukup tekan **`y`** (yes) lalu **`Enter`**.

---

## 🧪 Langkah 4: Pengujian & Verifikasi (Testing)

Untuk memastikan tabel benar-benar telah dibuat di dalam database PostgreSQL:

1. Di terminal yang sama (dalam folder `backend/`), jalankan Drizzle Studio:
   ```bash
   bun run db:studio
   ```
2. Terminal akan menampilkan URL (biasanya `https://local.drizzle.studio`). Buka URL tersebut di browser.
3. Anda akan melihat antarmuka (GUI) database Anda. 
4. Cek di sebelah kiri, apakah tabel `dinas`, `level_unit_kerja`, `unit_kerja`, `pejabat_unit_kerja`, dan `akses_admin_unit` sudah muncul?
   - Jika YA, maka selamat! **Issue #2 telah resmi SELESAI**.
   - Tekan `Ctrl + C` di terminal untuk mematikan Drizzle Studio jika sudah selesai.

Langkah selanjutnya adalah melanjutkan ke **Issue #3** untuk mendefinisikan tabel `pegawai`.
