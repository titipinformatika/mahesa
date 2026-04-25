import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log("Memulai migrasi tabel skema_dinas_luar...");

  try {
    // 1. Hapus isi tabel karena strukturnya akan berubah drastis dan tidak kompatibel
    console.log("Menghapus data lama (jika ada)...");
    await db.execute(sql`TRUNCATE TABLE skema_dinas_luar CASCADE`);

    // 2. Hapus kolom lama
    console.log("Menghapus kolom lama...");
    await db.execute(sql`
      ALTER TABLE skema_dinas_luar 
      DROP COLUMN IF EXISTS nama,
      DROP COLUMN IF EXISTS perlu_pelacakan_lokasi,
      DROP COLUMN IF EXISTS radius_lokasi_tujuan_meter
    `);

    // 3. Tambah kolom baru
    console.log("Menambahkan kolom baru...");
    await db.execute(sql`
      ALTER TABLE skema_dinas_luar 
      ADD COLUMN IF NOT EXISTS id_unit_kerja UUID NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
      ADD COLUMN IF NOT EXISTS kode_skema VARCHAR(30) NOT NULL,
      ADD COLUMN IF NOT EXISTS label VARCHAR(100),
      ADD COLUMN IF NOT EXISTS titik_titik JSONB NOT NULL
    `);

    // 4. Tambah constraint unik
    console.log("Menambahkan unique constraint...");
    await db.execute(sql`
      ALTER TABLE skema_dinas_luar 
      DROP CONSTRAINT IF EXISTS skema_dinas_luar_id_unit_kerja_kode_skema_unique
    `);
    
    await db.execute(sql`
      ALTER TABLE skema_dinas_luar 
      ADD CONSTRAINT skema_dinas_luar_id_unit_kerja_kode_skema_unique UNIQUE (id_unit_kerja, kode_skema)
    `);

    console.log("✅ Migrasi skema_dinas_luar berhasil diselesaikan.");
  } catch (error: any) {
    console.error("❌ Gagal melakukan migrasi:", error.message);
  } finally {
    process.exit(0);
  }
}

main();
