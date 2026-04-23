import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function runSchema() {
  try {
    await db.execute(sql`
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
    `);

    try {
      await db.execute(sql`
        ALTER TABLE "pengajuan_biodata" 
        ADD CONSTRAINT "pengajuan_biodata_id_pegawai_pegawai_id_fk" 
        FOREIGN KEY ("id_pegawai") REFERENCES "public"."pegawai"("id") 
        ON DELETE no action ON UPDATE no action;
      `);
    } catch (e) {
      console.log("Constraint id_pegawai mungkin sudah ada.");
    }

    try {
      await db.execute(sql`
        ALTER TABLE "pengajuan_biodata" 
        ADD CONSTRAINT "pengajuan_biodata_diproses_oleh_pegawai_id_fk" 
        FOREIGN KEY ("diproses_oleh") REFERENCES "public"."pegawai"("id") 
        ON DELETE no action ON UPDATE no action;
      `);
    } catch (e) {
      console.log("Constraint diproses_oleh mungkin sudah ada.");
    }

    console.log("✅ Tabel pengajuan_biodata berhasil dibuat.");
  } catch (error) {
    console.error("❌ Gagal membuat tabel:", error);
  }
}

runSchema();
