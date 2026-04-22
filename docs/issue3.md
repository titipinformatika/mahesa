# 📋 Eksekusi Issue #3: Pembuatan Skema Pegawai & Struktur MDM (Multi-Sumber)

Dokumen ini adalah panduan **Copy-Paste** (Sangat Detail) untuk menyelesaikan [Issue #3]. Jika Anda menggunakan AI, berikan seluruh teks di bawah ini ke AI Anda. Jika Anda *Programmer Junior*, cukup ikuti langkahnya satu per satu dan lakukan *copy-paste* pada kode yang disediakan.

---

## 🛠️ Langkah 1: Pembuatan File Skema Pegawai

1. Buka folder `backend/src/db/schema/` di proyek Anda.
2. Buat file baru bernama `pegawai.ts`.
3. Salin dan tempel **seluruh kode di bawah ini** ke dalam file `backend/src/db/schema/pegawai.ts`:

**File: `backend/src/db/schema/pegawai.ts`**
```typescript
import { 
  pgTable, uuid, varchar, text, boolean, timestamp, date, jsonb, integer, time 
} from 'drizzle-orm/pg-core';
import { unitKerja } from './organisasi';

// ------------------------------------------------------
// 1. Tabel pengguna (Untuk Login & Autentikasi)
// ------------------------------------------------------
export const pengguna = pgTable('pengguna', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hash_kata_sandi: varchar('hash_kata_sandi', { length: 255 }).notNull(),
  peran: varchar('peran', { length: 30 }).notNull().default('pegawai'),
  aktif: boolean('aktif').notNull().default(true),
  
  mfa_aktif: boolean('mfa_aktif').notNull().default(false),
  mfa_secret: varchar('mfa_secret', { length: 255 }),
  
  terakhir_login: timestamp('terakhir_login', { withTimezone: true }),
  token_fcm: varchar('token_fcm', { length: 500 }),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------
// 2. Tabel skema_jam_kerja
// ------------------------------------------------------
export const skemaJamKerja = pgTable('skema_jam_kerja', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull(),
  deskripsi: text('deskripsi'),
  hari_kerja_seminggu: integer('hari_kerja_seminggu').notNull(),
  jam_masuk: time('jam_masuk').notNull(),
  jam_pulang: time('jam_pulang').notNull(),
  toleransi_terlambat_menit: integer('toleransi_terlambat_menit').notNull().default(15),
  aktif: boolean('aktif').notNull().default(true),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------
// 3. Tabel master_jenis_kepegawaian
// ------------------------------------------------------
export const masterJenisKepegawaian = pgTable('master_jenis_kepegawaian', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: varchar('nama', { length: 100 }).notNull().unique(),
  wajib_absen: boolean('wajib_absen').notNull().default(true),
  hak_cuti: boolean('hak_cuti').notNull().default(true),
  hak_dinas_luar: boolean('hak_dinas_luar').notNull().default(true),
  hak_lhkp: boolean('hak_lhkp').notNull().default(true),
  aktif: boolean('aktif').notNull().default(true),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------------------
// 4. Tabel pegawai (Struktur MDM Multi-Sumber)
// ------------------------------------------------------
export const pegawai = pgTable('pegawai', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_pengguna: uuid('id_pengguna').unique().references(() => pengguna.id, { onDelete: 'set null' }),
  id_unit_kerja: uuid('id_unit_kerja').notNull().references(() => unitKerja.id),
  id_skema_jam_kerja: uuid('id_skema_jam_kerja').references(() => skemaJamKerja.id),

  nip: varchar('nip', { length: 30 }).unique(),
  nuptk: varchar('nuptk', { length: 20 }).unique(),
  nik: varchar('nik', { length: 16 }).notNull().unique(),
  nama_lengkap: varchar('nama_lengkap', { length: 255 }).notNull(),
  jenis_kelamin: varchar('jenis_kelamin', { length: 20 }).notNull(),
  tempat_lahir: varchar('tempat_lahir', { length: 100 }),
  tanggal_lahir: date('tanggal_lahir'),
  agama: varchar('agama', { length: 20 }),
  status_perkawinan: varchar('status_perkawinan', { length: 20 }),
  telepon: varchar('telepon', { length: 20 }),
  alamat: text('alamat'),
  url_foto: varchar('url_foto', { length: 500 }),

  // --- MDM Tracking (Master Data Management) ---
  id_siasn: varchar('id_siasn', { length: 100 }).unique(),
  id_simpeg: varchar('id_simpeg', { length: 100 }).unique(),
  ptk_id: uuid('ptk_id').unique(),
  sumber_awal: varchar('sumber_awal', { length: 20 }).notNull().default('manual'),

  // --- MDM Raw Data JSONB ---
  raw_data_siasn: jsonb('raw_data_siasn'),
  raw_data_simpeg: jsonb('raw_data_simpeg'),
  raw_data_dapodik: jsonb('raw_data_dapodik'),

  tanggal_masuk: date('tanggal_masuk').notNull(),

  // Keuangan
  nama_bank: varchar('nama_bank', { length: 100 }),
  nomor_rekening: varchar('nomor_rekening', { length: 50 }),
  nama_pemilik_rekening: varchar('nama_pemilik_rekening', { length: 255 }),
  npwp: varchar('npwp', { length: 30 }),

  // Kontak Darurat
  nama_kontak_darurat: varchar('nama_kontak_darurat', { length: 255 }),
  telepon_kontak_darurat: varchar('telepon_kontak_darurat', { length: 20 }),

  status_biodata: varchar('status_biodata', { length: 20 }).notNull().default('belum_lengkap'),
  aktif: boolean('aktif').notNull().default(true),
  catatan: text('catatan'),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 🔗 Langkah 2: Update Relasi di File Organisasi (PENTING!)

Pada Issue #2 sebelumnya, kita telah menunda penambahan referensi (Foreign Key) ke tabel pegawai karena tabel tersebut belum ada. Kini tabel `pegawai` telah dibuat. Mari kita lengkapi relasinya.

1. Buka file `backend/src/db/schema/organisasi.ts`.
2. Di bagian paling atas (baris import), tambahkan import untuk tabel `pegawai`:
   ```typescript
   import { pegawai } from './pegawai';
   ```
3. Cari definisi `pejabatUnitKerja` (di bagian 4), lalu ubah baris `id_pegawai` menjadi seperti ini:
   ```typescript
   id_pegawai: uuid('id_pegawai').notNull().references(() => pegawai.id),
   ```
4. Cari definisi `aksesAdminUnit` (di bagian 5), lalu ubah baris `id_pegawai` dan `diberikan_oleh` menjadi seperti ini:
   ```typescript
   id_pegawai: uuid('id_pegawai').notNull().references(() => pegawai.id), 
   diberikan_oleh: uuid('diberikan_oleh').references(() => pegawai.id),
   ```

---

## 📤 Langkah 3: Eksekusi Migrasi Database (Push to PostgreSQL)

Sekarang saatnya menerapkan tabel baru ini dan relasi yang sudah diperbarui ke database.

1. Buka terminal (pastikan berada di folder `backend/`).
2. Jalankan perintah berikut:
   ```bash
   bun run db:push
   ```
3. Jika Drizzle menanyakan konfirmasi eksekusi statement (seperti `Yes, I want to execute all statements`), setujui perintah tersebut untuk melanjutkan.

---

## 🧪 Langkah 4: Pengujian & Verifikasi

1. Di terminal yang sama, jalankan:
   ```bash
   bun run db:studio
   ```
2. Buka URL `https://local.drizzle.studio` di browser.
3. Cek di daftar tabel sebelah kiri, pastikan tabel `pengguna`, `skema_jam_kerja`, `master_jenis_kepegawaian`, dan `pegawai` sudah muncul.
4. Jika sudah muncul, klik tabel `pegawai` dan cek kolom-kolomnya (khususnya apakah `raw_data_siasn`, dll bertipe `jsonb`).
   - Jika semuanya sesuai, **Issue #3 telah resmi SELESAI**.
   - Tekan `Ctrl + C` di terminal untuk mematikan Drizzle Studio.
