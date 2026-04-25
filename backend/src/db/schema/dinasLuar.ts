import { 
  pgTable, uuid, varchar, text, boolean, timestamp, decimal, date, index, jsonb, unique, integer
} from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';
import { unitKerja } from './organisasi';

// ------------------------------------------------------
// 1. Tabel skema_dinas_luar
// ------------------------------------------------------
export const skemaDinasLuar = pgTable('skema_dinas_luar', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_unit_kerja: uuid('id_unit_kerja').notNull().references(() => unitKerja.id),
  kode_skema: varchar('kode_skema', { length: 30 }).notNull(),
  // Nilai: dl_penuh, kantor_dl_pulang, dl_kantor
  label: varchar('label', { length: 100 }),
  // Nama tampilan kustom, misal: "DL Penuh (Dalam Kota)"
  titik_titik: jsonb('titik_titik').notNull(),
  aktif: boolean('aktif').notNull().default(true),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uniqUnitSkema: unique().on(t.id_unit_kerja, t.kode_skema),
}));

// ------------------------------------------------------
// 2. Tabel pengajuan_dinas_luar
// ------------------------------------------------------
export const pengajuanDinasLuar = pgTable('pengajuan_dinas_luar', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_pegawai: uuid('id_pegawai').notNull().references(() => pegawai.id),
  tanggal: date('tanggal').notNull(),
  skema: varchar('skema', { length: 30 }).notNull(),
  // Nilai: dl_penuh | kantor_dl_pulang | dl_kantor
  nama_tujuan: varchar('nama_tujuan', { length: 255 }).notNull(),
  latitude_tujuan: decimal('latitude_tujuan', { precision: 10, scale: 7 }).notNull(),
  longitude_tujuan: decimal('longitude_tujuan', { precision: 10, scale: 7 }).notNull(),
  radius_tujuan_meter: integer('radius_tujuan_meter').notNull().default(200),
  keperluan: text('keperluan').notNull(),
  url_surat_tugas: varchar('url_surat_tugas', { length: 500 }),
  status: varchar('status', { length: 20 }).notNull().default('menunggu'),
  // menunggu | disetujui | ditolak | dibatalkan | sedang_berjalan | selesai
  id_penyetuju: uuid('id_penyetuju').references(() => pegawai.id),
  waktu_persetujuan: timestamp('waktu_persetujuan', { withTimezone: true }),
  alasan_penolakan: text('alasan_penolakan'),
  pelacakan_aktif: boolean('pelacakan_aktif').notNull().default(false),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  idxPegawai: index('idx_dl_pegawai').on(table.id_pegawai),
  idxStatus: index('idx_dl_status').on(table.status),
  idxTanggal: index('idx_dl_tanggal').on(table.tanggal),
}));

// ------------------------------------------------------
// 3. Tabel log_lokasi_pegawai
// ------------------------------------------------------
export const logLokasiPegawai = pgTable('log_lokasi_pegawai', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_pegawai: uuid('id_pegawai').notNull().references(() => pegawai.id),
  id_pengajuan_dl: uuid('id_pengajuan_dl').references(() => pengajuanDinasLuar.id, { onDelete: 'cascade' }),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  akurasi: decimal('akurasi', { precision: 6, scale: 2 }),
  dicatat_pada: timestamp('dicatat_pada', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  idxLogPegawai: index('idx_log_lokasi_pegawai').on(table.id_pegawai),
  idxLogDL: index('idx_log_lokasi_dl').on(table.id_pengajuan_dl),
  idxLogWaktu: index('idx_log_lokasi_waktu').on(table.dicatat_pada),
}));
