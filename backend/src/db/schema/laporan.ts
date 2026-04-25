import { 
  pgTable, uuid, varchar, text, timestamp, integer, pgEnum
} from 'drizzle-orm/pg-core';
import { unitKerja } from './organisasi';
import { pegawai } from './pegawai';

export const statusLaporanEnum = pgEnum('status_laporan', ['draft', 'dikirim', 'diterima', 'ditolak']);

export const laporanDinas = pgTable('laporan_dinas', {
  id: uuid('id').defaultRandom().primaryKey(),
  idUnitKerja: uuid('id_unit_kerja').notNull().references(() => unitKerja.id),
  idPimpinan: uuid('id_pimpinan').notNull().references(() => pegawai.id),
  bulan: integer('bulan').notNull(),
  tahun: integer('tahun').notNull(),
  totalPegawai: integer('total_pegawai').notNull(),
  totalHadir: integer('total_hadir').notNull(),
  totalCuti: integer('total_cuti').notNull(),
  totalDl: integer('total_dl').notNull(),
  catatanPimpinan: text('catatan_pimpinan'),
  status: statusLaporanEnum('status').notNull().default('draft'),
  dibuatPada: timestamp('dibuat_pada', { withTimezone: true }).notNull().defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada', { withTimezone: true }).notNull().defaultNow(),
});
