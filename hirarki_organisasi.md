# 🏢 Penjelasan Hierarki Organisasi MAHESA

Sistem MAHESA (Manajemen HR & Pegawai) dirancang secara spesifik untuk mengakomodasi struktur organisasi yang ada pada sebuah **Dinas Pendidikan**, baik di tingkat Kabupaten maupun Kota.

Dokumen ini ditulis secara mendetail untuk memandu *programmer* junior atau *AI Assistant* dalam memahami bagaimana rancangan struktur organisasi ini berjalan dari sisi kode dan fitur.

---

## 🏛️ Struktur Pohon Organisasi (Tree Structure)

Secara garis besar, ekosistem pegawai di Dinas Pendidikan dibagi menjadi **Root (Induk)** dan **Cabang (Unit Kerja)**.

```mermaid
graph TD;
    Dinas[Dinas Pendidikan Kabupaten/Kota <br/> LEVEL 1] --> UPT1[UPT Wilayah 1 <br/> LEVEL 2];
    Dinas --> SMK2[SMK Negeri 2 <br/> LEVEL 3 - Langsung di bawah Dinas];
    
    UPT1 --> SDN1[SD Negeri 1 <br/> LEVEL 3];
    UPT1 --> SMPN1[SMP Negeri 1 <br/> LEVEL 3];

    SDN1 --> Pimpinan1(Kepala Sekolah);
    SDN1 --> Pegawai1(Guru / Staf TU);
    
    SMK2 --> Pimpinan2(Kepala Sekolah);
    SMK2 --> Pegawai2(Guru / Staf TU);
```

### 1. Dinas Pendidikan (Level 1)
Ini adalah tingkat teratas pengelola (`Admin Dinas`).
Secara database, entitas ini bertindak sebagai **Induk Utama**. Semua unit di bawahnya (baik UPT maupun Sekolah) wajib mencantumkan `id_dinas` ini.

### 2. UPT / Unit Kerja Pelaksana Teknis (Level 2)
Merupakan kepanjangan tangan dari Dinas Pendidikan untuk cakupan wilayah/kecamatan.
Secara arsitektur:
* Level 2 **selalu bernaung di bawah Level 1** (Dinas).
* Level 2 dapat mengelola/menaungi banyak Level 3 (Sekolah). Administrator pada UPT (`Admin Unit Kerja`) dapat diberi hak tambahan untuk memantau sekolah-sekolah di bawah gugus tugasnya.

### 3. Sekolah (Level 3)
Merupakan tingkatan terendah dalam struktur namun paling padat pegawainya (guru/staf).
Penting terkait relasi database (field `id_induk_unit`):
* Jika sebuah sekolah berada di bawah naungan UPT, maka **saat penambahan (add)** tabel sekolah (Level 3) ini akan menunjuk (*refer/assign*) ke UPT (Level 2) tersebut.
* Jika sebuah sekolah tidak berada di bawah UPT (misal: SMAN unggulan yang langsung dikoordinasi provinsi/pusat), maka bagian ini dibiarkan kosong (`id_induk_unit = NULL`), artinya ia berkoordinasi langsung dengan Level 1 (Dinas Pnedidikan).

---

## 👥 Sistem Peran (Role-Based Access Control)

Dalam sistem, ada **5 Peran Utama (Role)**. Masing-masing peran menentukan *platform* mana yang mereka gunakan dan seberapa luas otoritas mereka.

### 1. 🦸‍♂️ Admin Dinas (Akses Tertinggi)
* **Platform:** 🖥️ Web Dashboard
* **Siapa mereka:** Staf/Pegawai di Kantor Dinas Pendidikan Pusat.
* **Otoritas:** 
  * Memiliki akses tak terbatas ke data **seluruh Unit Kerja (semua sekolah)**.
  * Menambahkan/mengedit Master Data (Dinas, Unit Kerja).
  * Meninjau persetujuan akhir perubahan biodata pegawai.
  * Membuat pengumuman global ke seluruh unit kerja.
  * Pemantauan lokasi *Dinas Luar* (Pelacakan DL) secara real-time untuk **semua pegawai di seluruh kota**.

### 2. 🏢 Admin UPT (Operator Wilayah)
* **Platform:** 🖥️ Web Dashboard
* **Siapa mereka:** Operator pada Kantor UPT / Lingkup Wilayah Teknis.
* **Otoritas:**
  * Memantau dan merangkum rekapitulasi data **Sekolah (Level 3)** yang menunjuk (bernaung) pada UPT-nya.
  * Membantu memonitoring laporan Dinas Luar (DL) skala kawasan/wilayah mereka.

### 3. Solusi Status Ganda (id_admin_unit)

Dalam kasus dunia nyata, ada kalanya **Budi** terdaftar secara fisik sebagai Guru (Level 3 / Sekolah), namun ia ditunjuk juga menjadi operator/admin bagi **UPT (Level 2)** yang menaungi wilayahnya.

Untuk menjaga struktur "Budi masuk/absen di SDN 1 Cibinong" tetap relevan (sehingga rekam jejak GPS Budi ke sekolah tidak terpotong) namun memberikan hak "Web Dashboard UPT" kepadanya, rancangan tabel `unit_kerja` memiliki kolom spesifik:
* `id_kepala_unit` (Pucuk pimpinan/Kepala)
* `id_admin_unit` (Daftar ID Pegawai/Operator yang dipercaya atas unit tersebut)

**Cara Kerja Mesin:**
* Admin Dinas mengganti Role pengguna Budi menjadi `admin_upt`.
* Admin Dinas mengatur tabel `unit_kerja` UPT Cibinong (Level 2), mengisi field `id_admin_unit` dengan ID Pegawai milik Budi. 
* Saat Budi absen pagi hari via *Mobile App*, sistem menganggap ia adalah **Guru biasa** yang harus absen di kordinat SDN 1 Cibinong (karena pada tabel `pegawai`-nya ia tetap terdaftar di SDN 1).
* Di sisi lain, saat Budi membuka komputer dan melakukan login *Web Dashboard*, karena rolenya adalah `admin_upt`, keamanan (Middleware API) mengizinkan ia masuk. Dan ia disajikan kumpulan data yang diseleksi spesifik dari **UPT di mana namanya tercatat pada field id_admin_unit**!

### Kesimpulan
Admin Dinas sama sekali tidak perlu membuat relasi rumit/tabel *mapping* ganda. 
1. Cukup mutasikan/tempatkan seorang pegawai mendaftar di Unit Kerja mana (tempat dia berkantor fisik & wajib absen GPS).
2. Jika ia ditugaskan menjadi operator administratif untuk menaungi sebuah unit spesifik (misal admin unit untuk sekolah/UPT nya), sematkan ID Pegawainya ke dalam field `id_admin_unit` milik sekolah/UPT tersebut.
3. Tetapkan peran di tabel `pengguna`-nya menjadi `admin_unit` atau `admin_upt`!

### 4. 👑 Pimpinan Unit Kerja (Kepala Sekolah / Kepala UPT)
* **Platform:** 📱 Mobile App
* **Siapa mereka:** Pucuk pimpinan di suatu unit kerja yang membawahi para pegawai/guru.
* **Otoritas:**
  * Fokus utamanya adalah **Persetujuan (Approval)** dan **Memantau Kehadiran**.
  * Berhak melakukan **Input Absensi Manual** (mengabsenkan bawahan) jika bawahannya terkendala (tanpa kewajiban validasi GPS/Selfie).
  * Mereka yang berhak menekan tombol "Setuju" atau "Tolak" saat bawahannya mengajukan: **Cuti, Dinas Luar (DL), dan Laporan Kinerja Harian**.
  * Lewat HP mereka, pimpinan ini bisa memantau "Hari ini siapa yang belum datang?" atau "Guru A posisinya sedang Dinas Luar dimana sekarang?".
  * Mengatur master *Jenis Kegiatan LHKP* untuk unit-nya, lalu **menugaskannya** ke masing-masing guru sesuai tanggung jawab mereka.

### 5. 👨‍🏫 Pegawai (Guru / Staf Administratif)
* **Platform:** 📱 Mobile App
* **Siapa mereka:** Guru pengajar, staf TU, dsb.
* **Otoritas (Akses Paling Terbatas):**
  * Hanya mengelola data **miliknya sendiri**.
  * Wajib absen *Clock-in* & *Clock-out* setiap hari dengan deteksi kordinat GPS dan Kamera Selfie.
  * Membuat Laporan Kinerja Harian secara mandiri dari *smartphone*.
  * Mengajukan Cuti atau izin Dinas Luar (*menunggu approval pimpinan*).
  * Sesekali mereka dapat memberikan "Peer Review" (Ulasan Penilaian) secara anonim kepada guru sejawat (teman se-sekolah).

---

## 🔄 Alur Persetujuan (Approval Flow)

Agar *AI Developer* atau *Junior Programmer* mudah memahami aturan *business logic*:

* **Cuti, Dinas Luar, & Kinerja:** 
  Hanya berputar di dalam sekolah itu sendiri.
  `Pegawai` mengajukan ➡️ diverifikasi dan dinilai oleh `Pimpinan Unit Kerja`.
* **Perubahan Biodata Pegawai (Sistem Berjenjang):** 
  Karena data ini krusial (seperti NIP, Rekening, dll), flow-nya wajib eskalasi bertingkat ke atas:
  - **Skenario A (Sekolah Level 3 di bawah UPT):**
    `Pegawai` ➡️ Setuju `Pimpinan Unit Kerja` ➡️ Setuju `Admin UPT` ➡️ Finalisasi `Admin Dinas`.
  - **Skenario B (Sekolah Level 3 langsung di bawah Dinas):**
    `Pegawai` ➡️ Setuju `Pimpinan Unit Kerja` ➡️ Finalisasi `Admin Dinas`.
  - **Skenario C (Pegawai/Admin di UPT Level 2):**
    `Pegawai UPT` ➡️ Setuju `Admin UPT / Pimpinan UPT` ➡️ Finalisasi `Admin Dinas`.
* **Laporan Kinerja Harian (LHKP):**
  Ini dinamis. `Pimpinan` membuat "Master Daftar Pekerjaan" dulu. ➡️ Lalu `Pimpinan` menempelkan tugas A, B, C ke `Guru A`. ➡️ Barulah `Guru A` di HP-nya bisa absen dan membuat laporan bahwa hari ini ia sudah mengerjakan pekerjaan A, B, C.

## 💾 Representasi Database Secara Singkat

```sql
dinas (Tabel 1 / Level 1, data tunggal per kab/kota)
  | 
  |--- unit_kerja (Tabel 2, banyak cabang)
         (Jika Level 2/UPT: `id_induk_unit` = NULL)
         (Jika Level 3/Sekolah: `id_induk_unit` = Menunjuk ke Level 2 atau NULL)
         |
         |--- pegawai (Tabel 3, banyak pegawai per unitnya)
              (Jika ia "Kepala Sekolah", role = 'pimpinan_unit_kerja')
              (Jika ia "Guru Biasa", role = 'pegawai')
```

Dengan desain di atas, keamanan (multi-tenant per unit kerja) harus di filter selalu menggunakan relasi `id_unit_kerja` pada Drizzle/PostgreSQL! Jangan sampai *Admin Unit Kerja A* mengget data dari *Unit Kerja B*.
