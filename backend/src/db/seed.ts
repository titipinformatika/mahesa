import { db } from './index';
import { sql } from 'drizzle-orm';
import { dinas, unitKerja, levelUnitKerja, pejabatUnitKerja } from './schema/organisasi';
import { pengguna, pegawai, skemaJamKerja, masterJenisKepegawaian } from './schema/pegawai';
import * as bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Memulai seeding database...');

  // Bersihkan data lama (urutan terbalik dari dependensi)
  console.log('🧹 Membersihkan data lama...');
  await db.execute(sql`TRUNCATE
    pengajuan_biodata,
    pejabat_unit_kerja,
    akses_admin_unit,
    pegawai,
    pengguna,
    unit_kerja,
    dinas,
    level_unit_kerja,
    skema_jam_kerja,
    master_jenis_kepegawaian
    CASCADE`);

  // =====================================================
  // 1. LEVEL UNIT KERJA
  // =====================================================
  console.log('📊 Memasukkan level unit kerja...');
  const levels = await db.insert(levelUnitKerja).values([
    { level: 1, nama: 'Dinas', keterangan: 'Tingkat Dinas / Kantor Pusat' },
    { level: 2, nama: 'UPT', keterangan: 'Unit Pelaksana Teknis' },
    { level: 3, nama: 'Sekolah', keterangan: 'Satuan Pendidikan' },
  ]).returning();

  const levelDinas = levels.find(l => l.level === 1)!;
  const levelUpt = levels.find(l => l.level === 2)!;
  const levelSekolah = levels.find(l => l.level === 3)!;

  // =====================================================
  // 2. DINAS
  // =====================================================
  console.log('🏛️ Memasukkan data dinas...');
  const dataDinas = await db.insert(dinas).values({
    nama: 'Dinas Pendidikan Kabupaten Bandung',
    kode: 'DISDIK-KBB',
    alamat: 'Jl. Raya Soreang No. 141, Soreang, Kab. Bandung',
    telepon: '022-5893636',
    email: 'disdik@bandungkab.go.id',
    latitude: '-6.9175',
    longitude: '107.5169',
  }).returning();

  const dinasId = dataDinas[0].id;

  // =====================================================
  // 3. UNIT KERJA (Hierarki: Dinas -> UPT -> Sekolah)
  // =====================================================
  console.log('🏢 Memasukkan unit kerja...');

  // 3a. Kantor Dinas (level 1)
  const kantorDinas = await db.insert(unitKerja).values({
    id_dinas: dinasId,
    id_level_unit: levelDinas.id,
    nama: 'Kantor Dinas Pendidikan',
    kode: 'KTR-DISDIK',
    jenis: 'kantor',
    alamat: 'Jl. Raya Soreang No. 141',
    latitude: '-6.9175',
    longitude: '107.5169',
    radius_absensi_meter: 200,
  }).returning();

  // 3b. UPT Kecamatan (level 2)
  const uptSoreang = await db.insert(unitKerja).values({
    id_dinas: dinasId,
    id_level_unit: levelUpt.id,
    id_induk_unit: kantorDinas[0].id,
    nama: 'UPT Pendidikan Kec. Soreang',
    kode: 'UPT-SOREANG',
    jenis: 'upt',
    alamat: 'Jl. Al-Maruf No. 5, Soreang',
    latitude: '-6.9200',
    longitude: '107.5200',
    radius_absensi_meter: 150,
  }).returning();

  // 3c. Sekolah (level 3)
  const sdn01 = await db.insert(unitKerja).values({
    id_dinas: dinasId,
    id_level_unit: levelSekolah.id,
    id_induk_unit: uptSoreang[0].id,
    nama: 'SD Negeri 01 Soreang',
    kode: 'SDN01-SOREANG',
    jenis: 'sd',
    npsn: '20200001',
    bentuk_pendidikan: 'SD',
    status_sekolah: 'Negeri',
    alamat: 'Jl. Alun-alun Soreang No. 10',
    latitude: '-6.9210',
    longitude: '107.5190',
    radius_absensi_meter: 100,
  }).returning();

  const smpn01 = await db.insert(unitKerja).values({
    id_dinas: dinasId,
    id_level_unit: levelSekolah.id,
    id_induk_unit: uptSoreang[0].id,
    nama: 'SMP Negeri 01 Soreang',
    kode: 'SMPN01-SOREANG',
    jenis: 'smp',
    npsn: '20200002',
    bentuk_pendidikan: 'SMP',
    status_sekolah: 'Negeri',
    alamat: 'Jl. Pemuda No. 15, Soreang',
    latitude: '-6.9190',
    longitude: '107.5220',
    radius_absensi_meter: 100,
  }).returning();

  // =====================================================
  // 4. SKEMA JAM KERJA
  // =====================================================
  console.log('⏰ Memasukkan skema jam kerja...');
  const jamKerja = await db.insert(skemaJamKerja).values([
    {
      nama: 'Jam Kerja ASN Standar',
      deskripsi: 'Senin-Jumat, 07:30-16:00 WIB',
      hari_kerja_seminggu: 5,
      jam_masuk: '07:30:00',
      jam_pulang: '16:00:00',
      toleransi_terlambat_menit: 15,
    },
    {
      nama: 'Jam Kerja Guru',
      deskripsi: 'Senin-Sabtu, 06:30-14:00 WIB',
      hari_kerja_seminggu: 6,
      jam_masuk: '06:30:00',
      jam_pulang: '14:00:00',
      toleransi_terlambat_menit: 10,
    },
  ]).returning();

  // =====================================================
  // 5. MASTER JENIS KEPEGAWAIAN
  // =====================================================
  console.log('📋 Memasukkan jenis kepegawaian...');
  await db.insert(masterJenisKepegawaian).values([
    { nama: 'PNS', wajib_absen: true, hak_cuti: true, hak_dinas_luar: true, hak_lhkp: true },
    { nama: 'PPPK', wajib_absen: true, hak_cuti: true, hak_dinas_luar: true, hak_lhkp: false },
    { nama: 'Honorer', wajib_absen: true, hak_cuti: false, hak_dinas_luar: false, hak_lhkp: false },
    { nama: 'Kontrak', wajib_absen: true, hak_cuti: false, hak_dinas_luar: false, hak_lhkp: false },
  ]);

  // =====================================================
  // 6. AKUN PENGGUNA
  // =====================================================
  console.log('👤 Memasukkan akun pengguna...');
  const hashPassword = await bcrypt.hash('password123', 10);

  const users = await db.insert(pengguna).values([
    { email: 'admin@disdik.go.id', hash_kata_sandi: hashPassword, peran: 'admin_dinas' },
    { email: 'kepala.sdn01@disdik.go.id', hash_kata_sandi: hashPassword, peran: 'pimpinan' },
    { email: 'guru.ani@disdik.go.id', hash_kata_sandi: hashPassword, peran: 'pegawai' },
    { email: 'guru.budi@disdik.go.id', hash_kata_sandi: hashPassword, peran: 'pegawai' },
    { email: 'kepala.smpn01@disdik.go.id', hash_kata_sandi: hashPassword, peran: 'pimpinan' },
  ]).returning();

  // =====================================================
  // 7. DATA PEGAWAI
  // =====================================================
  console.log('🧑‍💼 Memasukkan data pegawai...');
  const pegawaiList = await db.insert(pegawai).values([
    {
      id_pengguna: users[0].id,
      id_unit_kerja: kantorDinas[0].id,
      id_skema_jam_kerja: jamKerja[0].id,
      nip: '199001012020011001',
      nik: '3204010101900001',
      nama_lengkap: 'Ir. Ahmad Supardi, M.Pd.',
      jenis_kelamin: 'Laki-laki',
      tempat_lahir: 'Bandung',
      tanggal_lahir: '1990-01-01',
      agama: 'Islam',
      telepon: '081200000001',
      alamat: 'Jl. Merdeka No. 1, Soreang',
      tanggal_masuk: '2020-01-01',
      status_biodata: 'lengkap',
    },
    {
      id_pengguna: users[1].id,
      id_unit_kerja: sdn01[0].id,
      id_skema_jam_kerja: jamKerja[1].id,
      nip: '198505152010012001',
      nik: '3204011505850001',
      nama_lengkap: 'Hj. Siti Aminah, S.Pd.',
      jenis_kelamin: 'Perempuan',
      tempat_lahir: 'Garut',
      tanggal_lahir: '1985-05-15',
      agama: 'Islam',
      telepon: '081200000002',
      alamat: 'Jl. Cihampelas No. 22, Soreang',
      tanggal_masuk: '2010-01-15',
      status_biodata: 'lengkap',
    },
    {
      id_pengguna: users[2].id,
      id_unit_kerja: sdn01[0].id,
      id_skema_jam_kerja: jamKerja[1].id,
      nik: '3204012001950001',
      nama_lengkap: 'Ani Suryani, S.Pd.',
      jenis_kelamin: 'Perempuan',
      tempat_lahir: 'Bandung',
      tanggal_lahir: '1995-01-20',
      agama: 'Islam',
      telepon: '081200000003',
      alamat: 'Jl. Asia Afrika No. 5, Soreang',
      tanggal_masuk: '2022-03-01',
      status_biodata: 'lengkap',
    },
    {
      id_pengguna: users[3].id,
      id_unit_kerja: sdn01[0].id,
      id_skema_jam_kerja: jamKerja[1].id,
      nik: '3204011007880001',
      nama_lengkap: 'Budi Santoso, S.Pd.',
      jenis_kelamin: 'Laki-laki',
      tempat_lahir: 'Sumedang',
      tanggal_lahir: '1988-07-10',
      agama: 'Islam',
      telepon: '081200000004',
      alamat: 'Jl. Sudirman No. 8, Soreang',
      tanggal_masuk: '2018-07-01',
      status_biodata: 'lengkap',
    },
    {
      id_pengguna: users[4].id,
      id_unit_kerja: smpn01[0].id,
      id_skema_jam_kerja: jamKerja[1].id,
      nip: '197803202005011001',
      nik: '3204012003780001',
      nama_lengkap: 'Drs. Cecep Hermawan, M.M.',
      jenis_kelamin: 'Laki-laki',
      tempat_lahir: 'Cianjur',
      tanggal_lahir: '1978-03-20',
      agama: 'Islam',
      telepon: '081200000005',
      alamat: 'Jl. Braga No. 3, Soreang',
      tanggal_masuk: '2005-01-10',
      status_biodata: 'lengkap',
    },
  ]).returning();

  // =====================================================
  // 8. PEJABAT UNIT KERJA (Kepala Sekolah)
  // =====================================================
  console.log('👑 Memasukkan pejabat unit kerja...');
  await db.insert(pejabatUnitKerja).values([
    {
      id_unit_kerja: sdn01[0].id,
      id_pegawai: pegawaiList[1].id, // Siti Aminah = Kepala SDN01
      jabatan: 'kepala_definitif',
      tanggal_mulai: '2020-01-01',
    },
    {
      id_unit_kerja: smpn01[0].id,
      id_pegawai: pegawaiList[4].id, // Cecep Hermawan = Kepala SMPN01
      jabatan: 'kepala_definitif',
      tanggal_mulai: '2018-01-01',
    },
  ]);

  // =====================================================
  // RANGKUMAN
  // =====================================================
  console.log('\n========================================');
  console.log('✅ SEEDING SELESAI!');
  console.log('========================================');
  console.log('\n📋 Akun yang tersedia (password semua: password123):');
  console.log('─────────────────────────────────────────');
  console.log('| Email                          | Peran        |');
  console.log('|--------------------------------|--------------|');
  console.log('| admin@disdik.go.id             | admin_dinas  |');
  console.log('| kepala.sdn01@disdik.go.id      | pimpinan     |');
  console.log('| guru.ani@disdik.go.id          | pegawai      |');
  console.log('| guru.budi@disdik.go.id         | pegawai      |');
  console.log('| kepala.smpn01@disdik.go.id     | pimpinan     |');
  console.log('─────────────────────────────────────────');
  console.log('\n🏢 Hierarki Organisasi:');
  console.log('  Dinas Pendidikan Kab. Bandung');
  console.log('    ├── Kantor Dinas Pendidikan (kantor)');
  console.log('    └── UPT Pendidikan Kec. Soreang (upt)');
  console.log('         ├── SD Negeri 01 Soreang (sd)');
  console.log('         └── SMP Negeri 01 Soreang (smp)');
  console.log('');

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding gagal:', error);
  process.exit(1);
});
