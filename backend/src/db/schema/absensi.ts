import {
  pgTable, uuid, varchar, text, boolean, timestamp, date, decimal, unique, index
} from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';
import { pengajuanDinasLuar } from './dinasLuar';

// Tabel absensi — Header kehadiran per hari per pegawai
export const absensi = pgTable('absensi', {
  id: uuid('id').defaultRandom().primaryKey(),
  id_pegawai: uuid('id_pegawai').notNull().references(() => pegawai.id),
  tanggal: date('tanggal').notNull(),
  tipe: varchar('tipe', { length: 20 }).notNull().default('kantor'),
  status: varchar('status', { length: 20 }).notNull().default('hadir'),
  id_pengajuan_dl: uuid('id_pengajuan_dl').references(() => pengajuanDinasLuar.id),
  jam_kerja: decimal('jam_kerja', { precision: 4, scale: 2 }),
  jam_lembur: decimal('jam_lembur', { precision: 4, scale: 2 }).default('0'),
  diabsenkan_oleh: uuid('diabsenkan_oleh').references(() => pegawai.id),
  catatan: text('catatan'),
  dibuat_pada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbarui_pada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  uniquePegawaiTanggal: unique().on(table.id_pegawai, table.tanggal),
  idxIdPegawai: index('idx_absensi_pegawai').on(table.id_pegawai),
  idxTanggal: index('idx_absensi_tanggal').on(table.tanggal),
  idxPegawaiTanggal: index('idx_absensi_pegawai_tanggal').on(table.id_pegawai, table.tanggal),
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
