# Plan Perbaikan Bug & Peningkatan UI Mobile (MAHESA)

**Deskripsi Singkat:**
Dokumen ini adalah rencana kerja (blueprint) untuk memperbaiki berbagai bug kritikal dan meningkatkan antarmuka pengguna (UI/UX) pada aplikasi Mobile/Android MAHESA. Instruksi ini disusun secara sangat detail agar dapat langsung dieksekusi oleh *Programmer Junior* atau *AI Assistant Mode Standar*.

---

## 📋 Daftar Tugas (Task List)

### Tugas 1: Memperbaiki Card Profile User yang Menampilkan `Null`
**Masalah:** Pada halaman Beranda (Home), kartu profil pengguna menampilkan teks `null` pada bagian nama, NIP, atau jabatan. Ini terjadi karena data dari API lambat dimuat atau terjadi kegagalan pemetaan (mapping) data pada *state management*.
**Instruksi Pengerjaan:**
1. Buka file UI yang menampilkan profil, kemungkinan di `lib/features/home/presentation/pages/home_page.dart` atau file komponen khusus seperti `profile_card.dart`.
2. Periksa bagaimana data di-fetch dari *Riverpod provider* (misalnya `ref.watch(profileProvider)` atau `ref.watch(authProvider)`).
3. Pastikan Anda menangani status data dengan benar menggunakan metode `.when()` dari Riverpod:
   - **Loading:** Tampilkan efek *Shimmer* (lihat Tugas 5).
   - **Error:** Tampilkan tanda strip (`-`) atau teks "Gagal memuat".
   - **Data:** Gunakan properti *null-aware operator* untuk mencegah teks `null` tercetak. Contoh: `Text(user?.namaLengkap ?? 'Pengguna')`.
4. Pastikan model (Class) pengguna (`user_model.dart`) memetakan (parsing) JSON dengan tipe data yang benar.

---

### Tugas 2: Bug Validasi "Skema Dinas Luar" Tidak Ada
**Masalah:** Pada form pengajuan Dinas Luar, daftar pilihan/dropdown untuk "Skema Dinas Luar" kosong. Akibatnya, pengguna tidak bisa memilih skema dan tombol *Submit* terkunci oleh validasi "Skema Dinas Luar Belum Terisi".
**Instruksi Pengerjaan:**
1. Buka file form pengajuan: `lib/features/dinas_luar/presentation/pages/pengajuan_dinas_luar_page.dart` (atau nama file yang sejenis).
2. Periksa *DropdownButton* atau *DropdownButtonFormField* yang merender Skema Dinas Luar.
3. Pastikan daftar skema di-*fetch* (diambil) dari *backend* saat halaman pertama kali dibuka (misalnya di `initState` atau melalui Provider). Jika saat ini *hardcoded* atau mengambil dari variabel kosong, segera hubungkan ke API yang tepat.
4. Pastikan properti `value` dari Dropdown tersinkronisasi dengan variabel *state* (misal `_selectedSkemaId`).
5. Tes *logic* validasinya: pastikan validasi hanya memblokir jika `_selectedSkemaId == null`.

---

### Tugas 3: Akses Cepat Menu Cuti dan LHKP Belum Bisa Diklik
**Masalah:** Tombol/Icon menu navigasi cepat (Quick Access) untuk "Cuti" dan "LHKP" di halaman utama bersifat mati (tidak ada aksi saat diklik).
**Instruksi Pengerjaan:**
1. Buka `lib/features/home/presentation/pages/home_page.dart` atau letak *widget* `QuickAccessMenu` tersebut berada.
2. Cari *Widget* yang membungkus *Icon/Text* Cuti dan LHKP (Biasanya berupa `Column` atau `Container`).
3. Bungkus *Widget* tersebut dengan `InkWell` atau `GestureDetector`.
4. Tambahkan properti `onTap`.
5. Implementasikan navigasi GoRouter di dalam `onTap`. 
   - Contoh untuk Cuti: `onTap: () => context.push('/cuti')`
   - Contoh untuk LHKP: `onTap: () => context.push('/lhkp')`
6. Pastikan *routes* untuk `/cuti` dan `/lhkp` sudah didefinisikan di `app_router.dart`. Jika belum, buatkan halaman (Page) kosong sementara bertuliskan "Dalam Pengembangan" dan daftarkan di router.

---

### Tugas 4: Error Permission Location (ACCESS_FINE_LOCATION) Saat Absen Masuk
**Masalah:** Terjadi error `gagal memuat data: no location permissions are ACCESS_FINE_LOCATION or ACCESS_COARSE_LOCATION are defined in the manifest` saat mengklik tombol "ABSEN MASUK". Ini adalah error bawaan OS Android yang mengunci akses GPS karena izin tidak dideklarasikan.
**Instruksi Pengerjaan:**
1. Buka file **`android/app/src/main/AndroidManifest.xml`**.
2. Tepat di bawah tag `<manifest ...>` dan di atas tag `<application ...>`, tambahkan baris kode izin berikut:
   ```xml
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   ```
3. Buka file `lib/features/attendance/presentation/pages/attendance_page.dart` (atau halaman absensi Anda). Pastikan paket `geolocator` atau `location` melakukan pemanggilan `await Geolocator.requestPermission()` sebelum mencoba mengambil koordinat. Tangani *case* jika pengguna menolak memberikan izin (tampilkan *Snackbar* peringatan).
4. *(Wajib)* Anda harus melakukan *Stop Build* sepenuhnya dan me-run ulang (`flutter run`) dari awal agar perubahan Manifest terbaca oleh Android.

---

### Tugas 5: Peningkatan UI/UX (Modernisasi & State Loading)
**Masalah:** Tampilan saat ini masih kaku, kurang menarik, transisi halaman kasar, dan tidak ada *feedback* visual saat aplikasi sedang menunggu balasan dari server (sehingga terlihat seperti *hang/freeze*).
**Instruksi Pengerjaan:**
1. **Tambahkan Paket Shimmer:** Masukkan package `shimmer` ke `pubspec.yaml` untuk membuat efek kerangka *loading* yang elegan ala Facebook/Instagram.
2. **Implementasi Shimmer:** Setiap kali memanggil data API dengan Riverpod (saat state = `AsyncLoading()`), JANGAN gunakan `CircularProgressIndicator` biasa. Ganti dengan *Skeleton UI* (kotak abu-abu berkedip) yang ukurannya disesuaikan dengan kartu/teks aslinya.
3. **Perhalus Tampilan Kartu (Cards):** 
   - Tambahkan efek bayangan halus (`boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4))]`) pada semua Card (Profil, History Absen).
   - Gunakan radius kelengkungan yang konsisten (misalnya `BorderRadius.circular(16)`).
4. **Warna & Tipografi:**
   - Hapus warna statis dasar seperti `Colors.blue`. Gunakan variasi warna modern sesuai dengan *ThemeData* proyek MAHESA.
   - Beri jarak / spasi putih (Whitespace) ekstra antar elemen agar aplikasi tidak terlihat sumpek (`SizedBox(height: 16)`).
5. **Transisi Halaman:** Update `app_router.dart`, gunakan `CustomTransitionPage` dengan efek `FadeTransition` atau `SlideTransition` agar perpindahan antar halaman terasa mewah.

---

### Tugas 6: Tombol Keluar (Logout) Belum Berfungsi
**Masalah:** Saat pengguna menekan tombol "Keluar" atau "Logout" di halaman profil/drawer, tidak terjadi aksi apa-apa dan pengguna tidak dikembalikan ke halaman Login.
**Instruksi Pengerjaan:**
1. Temukan *Widget* tombol Keluar/Logout (kemungkinan ada di `lib/features/home/presentation/widgets/profile_drawer.dart` atau file pengaturan akun).
2. Periksa blok `onTap` atau `onPressed` pada tombol tersebut.
3. Panggil metode `logout()` dari *Provider Autentikasi* (misal: `await ref.read(authProvider.notifier).logout()`).
4. Pastikan metode logout di sisi *Provider* melakukan pembersihan token/cache lokal (contoh: memanggil `CacheService().clearToken()`).
5. Arahkan pengguna kembali ke layar Login dan hancurkan seluruh tumpukan halaman sebelumnya agar mereka tidak bisa menekan tombol *Back* (kembali). Gunakan: `context.go('/login')`.
6. Jangan lupa menambahkan dialog konfirmasi ("Apakah Anda yakin ingin keluar?") sebelum logout benar-benar dieksekusi agar pengguna tidak tidak sengaja menekannya.

---

> **Pesan Untuk Junior / AI:**
> Kerjakan tugas-tugas di atas secara berurutan. Prioritaskan **Tugas 4** dan **Tugas 1** terlebih dahulu karena ini adalah *Blocker* (menghalangi fungsionalitas utama aplikasi). Pastikan setiap langkah ditutup dengan melakukan *Unit Test* kecil atau memastikan tidak ada *red error linter* di *console*. Lakukan *commit* Git untuk setiap poin tugas yang diselesaikan.
