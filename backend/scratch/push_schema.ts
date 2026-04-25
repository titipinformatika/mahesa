import postgres from 'postgres';

const sql = postgres('postgres://postgres:root@localhost:5432/mahesa_db');

async function run() {
  try {
    await sql`CREATE TYPE "public"."status_dl" AS ENUM('menunggu', 'disetujui', 'ditolak', 'dibatalkan');`;
    console.log("Enum created");
  } catch (e) {}

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "skema_dinas_luar" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "nama" varchar(100) NOT NULL,
        "perlu_pelacakan_lokasi" boolean DEFAULT true NOT NULL,
        "radius_lokasi_tujuan_meter" numeric(10, 2) DEFAULT '100.00',
        "aktif" boolean DEFAULT true NOT NULL,
        "dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
        "diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    console.log("skema_dinas_luar created");
  } catch (e) { console.error(e); }

  try {
    await sql`
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
    `;
    console.log("pengajuan_dinas_luar created");
  } catch (e) { console.error(e); }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "log_lokasi_pegawai" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "id_pengajuan_dl" uuid NOT NULL,
        "latitude" numeric(10, 7) NOT NULL,
        "longitude" numeric(10, 7) NOT NULL,
        "waktu" timestamp with time zone DEFAULT now() NOT NULL
      );
    `;
    console.log("log_lokasi_pegawai created");
  } catch (e) { console.error(e); }

  // Foreign keys
  try {
    await sql`ALTER TABLE "log_lokasi_pegawai" ADD CONSTRAINT "log_lokasi_pegawai_id_pengajuan_dl_pengajuan_dinas_luar_id_fk" FOREIGN KEY ("id_pengajuan_dl") REFERENCES "public"."pengajuan_dinas_luar"("id") ON DELETE cascade ON UPDATE no action;`;
    await sql`ALTER TABLE "pengajuan_dinas_luar" ADD CONSTRAINT "pengajuan_dinas_luar_id_pegawai_pegawai_id_fk" FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;`;
    await sql`ALTER TABLE "pengajuan_dinas_luar" ADD CONSTRAINT "pengajuan_dinas_luar_id_skema_dinas_luar_skema_dinas_luar_id_fk" FOREIGN KEY ("id_skema_dinas_luar") REFERENCES "public"."skema_dinas_luar"("id") ON DELETE no action ON UPDATE no action;`;
    await sql`ALTER TABLE "pengajuan_dinas_luar" ADD CONSTRAINT "pengajuan_dinas_luar_id_penyetuju_pegawai_id_fk" FOREIGN KEY ("id_penyetuju") REFERENCES "public"."pegawai"("id") ON DELETE no action ON UPDATE no action;`;
    console.log("Constraints added");
  } catch (e) {}

  process.exit(0);
}

run();
