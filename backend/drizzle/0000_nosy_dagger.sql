CREATE TYPE "public"."status_cuti" AS ENUM('menunggu', 'disetujui', 'ditolak', 'dibatalkan');--> statement-breakpoint
CREATE TYPE "public"."status_dl" AS ENUM('menunggu', 'disetujui', 'ditolak', 'dibatalkan');--> statement-breakpoint
CREATE TYPE "public"."status_laporan" AS ENUM('menunggu', 'disetujui', 'revisi', 'ditolak');--> statement-breakpoint
CREATE TYPE "public"."jabatan" AS ENUM('kepala_definitif', 'plt', 'wakil_kepala');--> statement-breakpoint
CREATE TYPE "public"."peran_admin_unit" AS ENUM('admin_unit', 'operator_absensi');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "absensi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"tanggal" date NOT NULL,
	"tipe" varchar(20) DEFAULT 'kantor' NOT NULL,
	"status" varchar(20) DEFAULT 'hadir' NOT NULL,
	"jam_kerja" numeric(4, 2),
	"diabsenkan_oleh" uuid,
	"catatan" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "absensi_id_pegawai_tanggal_unique" UNIQUE("id_pegawai","tanggal")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "titik_absensi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_absensi" uuid NOT NULL,
	"jenis_titik" varchar(30) NOT NULL,
	"waktu" timestamp with time zone DEFAULT now() NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"url_foto" varchar(500),
	"dalam_radius" boolean,
	"diabsenkan_manual" boolean DEFAULT false NOT NULL,
	"nama_lokasi" varchar(255),
	"catatan" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pengajuan_biodata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"data_perubahan" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'menunggu' NOT NULL,
	"catatan_pegawai" text,
	"diproses_oleh" uuid,
	"catatan_proses" text,
	"diproses_pada" timestamp with time zone,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dokumen_cuti" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pengajuan_cuti" uuid NOT NULL,
	"nama_file" text NOT NULL,
	"path_file" text NOT NULL,
	"mime_type" text NOT NULL,
	"ukuran" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jenis_cuti" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"keterangan" text,
	"wajib_lampiran" boolean DEFAULT false NOT NULL,
	"jatah_tahunan" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pengajuan_cuti" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"id_jenis_cuti" uuid NOT NULL,
	"tanggal_mulai" date NOT NULL,
	"tanggal_selesai" date NOT NULL,
	"alasan" text NOT NULL,
	"status" "status_cuti" DEFAULT 'menunggu' NOT NULL,
	"catatan_pimpinan" text,
	"waktu_persetujuan" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "saldo_cuti" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"id_jenis_cuti" uuid NOT NULL,
	"tahun" integer NOT NULL,
	"saldo" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_lokasi_pegawai" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pengajuan_dl" uuid NOT NULL,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"waktu" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pengajuan_dinas_luar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"id_skema_dinas_luar" uuid NOT NULL,
	"tujuan" varchar(255) NOT NULL,
	"tanggal_mulai" date NOT NULL,
	"tanggal_selesai" date NOT NULL,
	"keterangan" text,
	"status" "status_dl" DEFAULT 'menunggu' NOT NULL,
	"id_penyetuju" uuid,
	"catatan_penyetuju" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skema_dinas_luar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"perlu_pelacakan_lokasi" boolean DEFAULT true NOT NULL,
	"radius_lokasi_tujuan_meter" numeric(10, 2) DEFAULT '100.00',
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pengumuman" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" varchar(255) NOT NULL,
	"konten" text NOT NULL,
	"tanggal_berlaku" date NOT NULL,
	"tanggal_berakhir" date NOT NULL,
	"id_unit" uuid,
	"peran_target" varchar(50),
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "laporan_dinas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_unit_kerja" uuid NOT NULL,
	"id_pimpinan" uuid NOT NULL,
	"bulan" integer NOT NULL,
	"tahun" integer NOT NULL,
	"total_pegawai" integer NOT NULL,
	"total_hadir" integer NOT NULL,
	"total_cuti" integer NOT NULL,
	"total_dl" integer NOT NULL,
	"catatan_pimpinan" text,
	"status" "status_laporan" DEFAULT 'draft' NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "detail_laporan_harian" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_laporan_harian" uuid NOT NULL,
	"id_jenis_kegiatan" uuid NOT NULL,
	"jam_mulai" text NOT NULL,
	"jam_selesai" text NOT NULL,
	"uraian" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jenis_kegiatan_lhkp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"keterangan" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "laporan_harian" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"tanggal" date NOT NULL,
	"status" "status_laporan" DEFAULT 'menunggu' NOT NULL,
	"catatan_pimpinan" text,
	"waktu_persetujuan" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "penugasan_kegiatan_lhkp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"id_jenis_kegiatan" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review_rekan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_penilai" uuid NOT NULL,
	"id_target" uuid NOT NULL,
	"rating" integer NOT NULL,
	"komentar" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "akses_admin_unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_unit_kerja" uuid NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"diberikan_oleh" uuid,
	"peran" "peran_admin_unit" DEFAULT 'admin_unit' NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dinas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(255) NOT NULL,
	"kode" varchar(20) NOT NULL,
	"alamat" text,
	"telepon" varchar(20),
	"email" varchar(255),
	"url_logo" varchar(500),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dinas_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "level_unit_kerja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" integer NOT NULL,
	"nama" varchar(100) NOT NULL,
	"keterangan" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "level_unit_kerja_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pejabat_unit_kerja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_unit_kerja" uuid NOT NULL,
	"id_pegawai" uuid NOT NULL,
	"jabatan" "jabatan" NOT NULL,
	"tanggal_mulai" date NOT NULL,
	"tanggal_selesai" date,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "unit_kerja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sekolah_id_dapodik" uuid,
	"bentuk_pendidikan" varchar(50),
	"status_sekolah" varchar(50),
	"npsn" varchar(20),
	"id_dinas" uuid NOT NULL,
	"id_induk_unit" uuid,
	"id_level_unit" uuid NOT NULL,
	"nama" varchar(255) NOT NULL,
	"kode" varchar(30) NOT NULL,
	"jenis" varchar(50) NOT NULL,
	"alamat" text,
	"telepon" varchar(20),
	"email" varchar(255),
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"radius_absensi_meter" integer DEFAULT 100 NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unit_kerja_sekolah_id_dapodik_unique" UNIQUE("sekolah_id_dapodik"),
	CONSTRAINT "unit_kerja_npsn_unique" UNIQUE("npsn"),
	CONSTRAINT "unit_kerja_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "master_jenis_kepegawaian" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"wajib_absen" boolean DEFAULT true NOT NULL,
	"hak_cuti" boolean DEFAULT true NOT NULL,
	"hak_dinas_luar" boolean DEFAULT true NOT NULL,
	"hak_lhkp" boolean DEFAULT true NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "master_jenis_kepegawaian_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pegawai" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id_pengguna" uuid,
	"id_unit_kerja" uuid NOT NULL,
	"id_skema_jam_kerja" uuid,
	"nip" varchar(30),
	"nuptk" varchar(20),
	"nik" varchar(16) NOT NULL,
	"nama_lengkap" varchar(255) NOT NULL,
	"jabatan" varchar(255),
	"jenis_kelamin" varchar(20) NOT NULL,
	"tempat_lahir" varchar(100),
	"tanggal_lahir" date,
	"agama" varchar(20),
	"status_perkawinan" varchar(20),
	"telepon" varchar(20),
	"alamat" text,
	"url_foto" varchar(500),
	"id_siasn" varchar(100),
	"id_simpeg" varchar(100),
	"ptk_id" uuid,
	"sumber_awal" varchar(20) DEFAULT 'manual' NOT NULL,
	"raw_data_siasn" jsonb,
	"raw_data_simpeg" jsonb,
	"raw_data_dapodik" jsonb,
	"tanggal_masuk" date NOT NULL,
	"nama_bank" varchar(100),
	"nomor_rekening" varchar(50),
	"nama_pemilik_rekening" varchar(255),
	"npwp" varchar(30),
	"nama_kontak_darurat" varchar(255),
	"telepon_kontak_darurat" varchar(20),
	"status_biodata" varchar(20) DEFAULT 'belum_lengkap' NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"catatan" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pegawai_id_pengguna_unique" UNIQUE("id_pengguna"),
	CONSTRAINT "pegawai_nip_unique" UNIQUE("nip"),
	CONSTRAINT "pegawai_nuptk_unique" UNIQUE("nuptk"),
	CONSTRAINT "pegawai_nik_unique" UNIQUE("nik"),
	CONSTRAINT "pegawai_id_siasn_unique" UNIQUE("id_siasn"),
	CONSTRAINT "pegawai_id_simpeg_unique" UNIQUE("id_simpeg"),
	CONSTRAINT "pegawai_ptk_id_unique" UNIQUE("ptk_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pengguna" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"hash_kata_sandi" varchar(255) NOT NULL,
	"peran" varchar(30) DEFAULT 'pegawai' NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"mfa_aktif" boolean DEFAULT false NOT NULL,
	"mfa_secret" varchar(255),
	"terakhir_login" timestamp with time zone,
	"token_fcm" varchar(500),
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pengguna_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skema_jam_kerja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"deskripsi" text,
	"hari_kerja_seminggu" integer NOT NULL,
	"jam_masuk" time NOT NULL,
	"jam_pulang" time NOT NULL,
	"toleransi_terlambat_menit" integer DEFAULT 15 NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "absensi" ADD CONSTRAINT "absensi_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "absensi" ADD CONSTRAINT "absensi_diabsenkan_oleh_pegawai_id_fk" FOREIGN KEY ("diabsenkan_oleh") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "titik_absensi" ADD CONSTRAINT "titik_absensi_id_absensi_absensi_id_fk" FOREIGN KEY ("id_absensi") REFERENCES "public"."absensi"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengajuan_biodata" ADD CONSTRAINT "pengajuan_biodata_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengajuan_biodata" ADD CONSTRAINT "pengajuan_biodata_diproses_oleh_pegawai_id_fk" FOREIGN KEY ("diproses_oleh") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dokumen_cuti" ADD CONSTRAINT "dokumen_cuti_id_pengajuan_cuti_pengajuan_cuti_id_fk" FOREIGN KEY ("id_pengajuan_cuti") REFERENCES "public"."pengajuan_cuti"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengajuan_cuti" ADD CONSTRAINT "pengajuan_cuti_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengajuan_cuti" ADD CONSTRAINT "pengajuan_cuti_id_jenis_cuti_jenis_cuti_id_fk" FOREIGN KEY ("id_jenis_cuti") REFERENCES "public"."jenis_cuti"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "saldo_cuti" ADD CONSTRAINT "saldo_cuti_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "saldo_cuti" ADD CONSTRAINT "saldo_cuti_id_jenis_cuti_jenis_cuti_id_fk" FOREIGN KEY ("id_jenis_cuti") REFERENCES "public"."jenis_cuti"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "log_lokasi_pegawai" ADD CONSTRAINT "log_lokasi_pegawai_id_pengajuan_dl_pengajuan_dinas_luar_id_fk" FOREIGN KEY ("id_pengajuan_dl") REFERENCES "public"."pengajuan_dinas_luar"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengajuan_dinas_luar" ADD CONSTRAINT "pengajuan_dinas_luar_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengajuan_dinas_luar" ADD CONSTRAINT "pengajuan_dinas_luar_id_skema_dinas_luar_skema_dinas_luar_id_fk" FOREIGN KEY ("id_skema_dinas_luar") REFERENCES "public"."skema_dinas_luar"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengajuan_dinas_luar" ADD CONSTRAINT "pengajuan_dinas_luar_id_penyetuju_pegawai_id_fk" FOREIGN KEY ("id_penyetuju") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pengumuman" ADD CONSTRAINT "pengumuman_id_unit_unit_kerja_id_fk" FOREIGN KEY ("id_unit") REFERENCES "public"."unit_kerja"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "laporan_dinas" ADD CONSTRAINT "laporan_dinas_id_unit_kerja_unit_kerja_id_fk" FOREIGN KEY ("id_unit_kerja") REFERENCES "public"."unit_kerja"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "laporan_dinas" ADD CONSTRAINT "laporan_dinas_id_pimpinan_pegawai_id_fk" FOREIGN KEY ("id_pimpinan") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "detail_laporan_harian" ADD CONSTRAINT "detail_laporan_harian_id_laporan_harian_laporan_harian_id_fk" FOREIGN KEY ("id_laporan_harian") REFERENCES "public"."laporan_harian"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "detail_laporan_harian" ADD CONSTRAINT "detail_laporan_harian_id_jenis_kegiatan_jenis_kegiatan_lhkp_id_fk" FOREIGN KEY ("id_jenis_kegiatan") REFERENCES "public"."jenis_kegiatan_lhkp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "laporan_harian" ADD CONSTRAINT "laporan_harian_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "penugasan_kegiatan_lhkp" ADD CONSTRAINT "penugasan_kegiatan_lhkp_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "penugasan_kegiatan_lhkp" ADD CONSTRAINT "penugasan_kegiatan_lhkp_id_jenis_kegiatan_jenis_kegiatan_lhkp_id_fk" FOREIGN KEY ("id_jenis_kegiatan") REFERENCES "public"."jenis_kegiatan_lhkp"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_rekan" ADD CONSTRAINT "review_rekan_id_penilai_pegawai_id_fk" FOREIGN KEY ("id_penilai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_rekan" ADD CONSTRAINT "review_rekan_id_target_pegawai_id_fk" FOREIGN KEY ("id_target") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "akses_admin_unit" ADD CONSTRAINT "akses_admin_unit_id_unit_kerja_unit_kerja_id_fk" FOREIGN KEY ("id_unit_kerja") REFERENCES "public"."unit_kerja"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "akses_admin_unit" ADD CONSTRAINT "akses_admin_unit_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "akses_admin_unit" ADD CONSTRAINT "akses_admin_unit_diberikan_oleh_pegawai_id_fk" FOREIGN KEY ("diberikan_oleh") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pejabat_unit_kerja" ADD CONSTRAINT "pejabat_unit_kerja_id_unit_kerja_unit_kerja_id_fk" FOREIGN KEY ("id_unit_kerja") REFERENCES "public"."unit_kerja"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pejabat_unit_kerja" ADD CONSTRAINT "pejabat_unit_kerja_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "unit_kerja" ADD CONSTRAINT "unit_kerja_id_dinas_dinas_id_fk" FOREIGN KEY ("id_dinas") REFERENCES "public"."dinas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "unit_kerja" ADD CONSTRAINT "unit_kerja_id_induk_unit_unit_kerja_id_fk" FOREIGN KEY ("id_induk_unit") REFERENCES "public"."unit_kerja"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "unit_kerja" ADD CONSTRAINT "unit_kerja_id_level_unit_level_unit_kerja_id_fk" FOREIGN KEY ("id_level_unit") REFERENCES "public"."level_unit_kerja"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_id_pengguna_pengguna_id_fk" FOREIGN KEY ("id_pengguna") REFERENCES "public"."pengguna"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_id_unit_kerja_unit_kerja_id_fk" FOREIGN KEY ("id_unit_kerja") REFERENCES "public"."unit_kerja"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_id_skema_jam_kerja_skema_jam_kerja_id_fk" FOREIGN KEY ("id_skema_jam_kerja") REFERENCES "public"."skema_jam_kerja"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_absensi_pegawai" ON "absensi" USING btree ("id_pegawai");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_absensi_tanggal" ON "absensi" USING btree ("tanggal");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_absensi_pegawai_tanggal" ON "absensi" USING btree ("id_pegawai","tanggal");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cuti_pegawai" ON "pengajuan_cuti" USING btree ("id_pegawai");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cuti_status" ON "pengajuan_cuti" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_cuti_tanggal_mulai" ON "pengajuan_cuti" USING btree ("tanggal_mulai");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dl_pegawai" ON "pengajuan_dinas_luar" USING btree ("id_pegawai");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dl_status" ON "pengajuan_dinas_luar" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lhkp_pegawai" ON "laporan_harian" USING btree ("id_pegawai");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lhkp_pegawai_tanggal" ON "laporan_harian" USING btree ("id_pegawai","tanggal");