import { 
  pgTable, uuid, varchar, text, timestamp, date, boolean
} from 'drizzle-orm/pg-core';
import { unitKerja } from './organisasi';

export const pengumuman = pgTable('pengumuman', {
  id: uuid('id').defaultRandom().primaryKey(),
  judul: varchar('judul', { length: 255 }).notNull(),
  konten: text('konten').notNull(),
  tanggalBerlaku: date('tanggal_berlaku').notNull(),
  tanggalBerakhir: date('tanggal_berakhir').notNull(),
  idUnit: uuid('id_unit').references(() => unitKerja.id), // Opsional, jika null berarti untuk semua unit
  peranTarget: varchar('peran_target', { length: 50 }), // Opsional, e.g., 'pimpinan', 'pegawai'
  aktif: boolean('aktif').notNull().default(true),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});
