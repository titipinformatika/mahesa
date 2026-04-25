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
  jabatan: varchar('jabatan', { length: 255 }),
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

  id_perangkat: varchar('id_perangkat', { length: 255 }),
  sisa_cuti: integer('sisa_cuti').notNull().default(12),
  status_biodata: varchar('status_biodata', { length: 20 }).notNull().default('belum_lengkap'),
  aktif: boolean('aktif').notNull().default(true),
  catatan: text('catatan'),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});
