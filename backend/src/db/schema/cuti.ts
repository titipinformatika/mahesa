import { pgTable, text, timestamp, uuid, integer, date, boolean, pgEnum, index } from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';

export const statusCutiEnum = pgEnum('status_cuti', ['menunggu', 'disetujui', 'ditolak', 'dibatalkan']);

export const jenisCuti = pgTable('jenis_cuti', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: text('nama').notNull(), // e.g., Cuti Tahunan, Cuti Sakit
  keterangan: text('keterangan'),
  wajibLampiran: boolean('wajib_lampiran').default(false).notNull(),
  jatahTahunan: integer('jatah_tahunan').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const saldoCuti = pgTable('saldo_cuti', {
  id: uuid('id').defaultRandom().primaryKey(),
  idPegawai: uuid('id_pegawai').references(() => pegawai.id).notNull(),
  idJenisCuti: uuid('id_jenis_cuti').references(() => jenisCuti.id).notNull(),
  tahun: integer('tahun').notNull(),
  saldo: integer('saldo').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const pengajuanCuti = pgTable('pengajuan_cuti', {
  id: uuid('id').defaultRandom().primaryKey(),
  idPegawai: uuid('id_pegawai').references(() => pegawai.id).notNull(),
  idJenisCuti: uuid('id_jenis_cuti').references(() => jenisCuti.id).notNull(),
  tanggalMulai: date('tanggal_mulai').notNull(),
  tanggalSelesai: date('tanggal_selesai').notNull(),
  alasan: text('alasan').notNull(),
  status: statusCutiEnum('status').default('menunggu').notNull(),
  catatanPimpinan: text('catatan_pimpinan'),
  waktuPersetujuan: timestamp('waktu_persetujuan'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxPegawai: index('idx_cuti_pegawai').on(table.idPegawai),
  idxStatus: index('idx_cuti_status').on(table.status),
  idxTanggalMulai: index('idx_cuti_tanggal_mulai').on(table.tanggalMulai),
}));

export const dokumenCuti = pgTable('dokumen_cuti', {
  id: uuid('id').defaultRandom().primaryKey(),
  idPengajuanCuti: uuid('id_pengajuan_cuti').references(() => pengajuanCuti.id).notNull(),
  namaFile: text('nama_file').notNull(),
  pathFile: text('path_file').notNull(),
  mimeType: text('mime_type').notNull(),
  ukuran: integer('ukuran').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
