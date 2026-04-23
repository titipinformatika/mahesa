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
