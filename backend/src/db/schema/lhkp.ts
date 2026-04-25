import { pgTable, text, timestamp, uuid, integer, pgEnum, boolean, date, index } from 'drizzle-orm/pg-core';
import { pegawai } from './pegawai';

export const statusLaporanEnum = pgEnum('status_laporan', ['menunggu', 'disetujui', 'revisi', 'ditolak']);

export const jenisKegiatanLhkp = pgTable('jenis_kegiatan_lhkp', {
  id: uuid('id').defaultRandom().primaryKey(),
  nama: text('nama').notNull(),
  keterangan: text('keterangan'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const penugasanKegiatanLhkp = pgTable('penugasan_kegiatan_lhkp', {
  id: uuid('id').defaultRandom().primaryKey(),
  idPegawai: uuid('id_pegawai').references(() => pegawai.id).notNull(),
  idJenisKegiatan: uuid('id_jenis_kegiatan').references(() => jenisKegiatanLhkp.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const laporanHarian = pgTable('laporan_harian', {
  id: uuid('id').defaultRandom().primaryKey(),
  idPegawai: uuid('id_pegawai').references(() => pegawai.id).notNull(),
  tanggal: date('tanggal').notNull(),
  status: statusLaporanEnum('status').default('menunggu').notNull(),
  catatanPimpinan: text('catatan_pimpinan'),
  waktuPersetujuan: timestamp('waktu_persetujuan'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  idxPegawai: index('idx_lhkp_pegawai').on(table.idPegawai),
  idxPegawaiTanggal: index('idx_lhkp_pegawai_tanggal').on(table.idPegawai, table.tanggal),
}));

export const detailLaporanHarian = pgTable('detail_laporan_harian', {
  id: uuid('id').defaultRandom().primaryKey(),
  idLaporanHarian: uuid('id_laporan_harian').references(() => laporanHarian.id).notNull(),
  idJenisKegiatan: uuid('id_jenis_kegiatan').references(() => jenisKegiatanLhkp.id).notNull(),
  jamMulai: text('jam_mulai').notNull(), // HH:mm
  jamSelesai: text('jam_selesai').notNull(), // HH:mm
  uraian: text('uraian').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviewRekan = pgTable('review_rekan', {
  id: uuid('id').defaultRandom().primaryKey(),
  idPenilai: uuid('id_penilai').references(() => pegawai.id).notNull(),
  idTarget: uuid('id_target').references(() => pegawai.id).notNull(),
  rating: integer('rating').notNull(), // 1-5
  komentar: text('komentar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
