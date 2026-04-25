import { db } from './src/db';
import { pengguna, pegawai } from './src/db/schema/pegawai';
import { dinas, unitKerja, levelUnitKerja } from './src/db/schema/organisasi';
import * as bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';

async function seed() {
  try {
    // Truncate manually via SQL
    await db.execute(sql`TRUNCATE dinas, unit_kerja, level_unit_kerja, pengguna, pegawai CASCADE`);
    console.log("🧹 Database dibersihkan.");

    // 0. Create Level Unit
    const levels = await db.insert(levelUnitKerja).values([
      { level: 1, nama: 'Dinas' },
      { level: 2, nama: 'UPT' },
      { level: 3, nama: 'Sekolah' },
    ]).returning();
    const idLevelSekolah = levels.find(l => l.level === 3)!.id;

    // 1. Create Dinas
    const newDinas = await db.insert(dinas).values({
      nama: 'Dinas Pendidikan Nasional',
      kode: 'DINDIK-001',
      alamat: 'Jl. Merdeka No. 1',
    }).returning();
    const idDinas = newDinas[0].id;

    // 2. Create Unit Kerja
    const newUnit = await db.insert(unitKerja).values({
      id_dinas: idDinas,
      id_level_unit: idLevelSekolah,
      nama: 'Sekolah Dasar Negeri 01',
      kode: 'SDN01',
      jenis: 'sekolah',
      latitude: '-6.200000',
      longitude: '106.816666',
    }).returning();
    const idUnit = newUnit[0].id;

    // 3. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await db.insert(pengguna).values({
      email: 'admin@mahesa.go.id',
      hash_kata_sandi: hashedPassword,
      peran: 'admin_dinas',
    }).returning();
    const idAdmin = adminUser[0].id;

    // 4. Create Pegawai for that Admin
    const adminPegawai = await db.insert(pegawai).values({
      id_pengguna: idAdmin,
      id_unit_kerja: idUnit,
      nik: '1234567890123456',
      nama_lengkap: 'Super Admin Mahesa',
      jenis_kelamin: 'Laki-laki',
      tanggal_masuk: '2020-01-01',
    }).returning();

    // 5. Create Pegawai User
    const pegawaiUser = await db.insert(pengguna).values({
      email: 'pegawai@mahesa.go.id',
      hash_kata_sandi: hashedPassword, // admin123
      peran: 'pegawai',
    }).returning();
    const idPegawaiUser = pegawaiUser[0].id;

    // 6. Create Pegawai profile for that user
    await db.insert(pegawai).values({
      id_pengguna: idPegawaiUser,
      id_unit_kerja: idUnit,
      nik: '1234567890123457',
      nama_lengkap: 'Budi Pegawai Mahesa',
      jenis_kelamin: 'Laki-laki',
      tanggal_masuk: '2022-01-01',
    });

    console.log("✅ Seeding selesai!");
    console.log("Admin Email: admin@mahesa.go.id");
    console.log("Pegawai Email: pegawai@mahesa.go.id");
    console.log("Password: admin123");

  } catch (error) {
    console.error("Error Seeding:", error);
  }
}

seed();
