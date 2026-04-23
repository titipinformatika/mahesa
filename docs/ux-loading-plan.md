# Rencana Implementasi Animasi Loading & UX (MAHESA)

Dokumen ini berisi rencana detail untuk mengimplementasikan animasi loading yang estetis pada saat transisi halaman dan interaksi API (request, process, response) menggunakan ekosistem Next.js App Router dan TanStack Query.

## 🎯 Tujuan
1. **Transisi Halaman:** Menampilkan indikator loading yang mulus dan animasi pergantian halaman agar aplikasi terasa ringan dan modern.
2. **Interaksi API:** Memberikan *feedback* visual yang jelas kepada pengguna di setiap tahap (sedang memproses, berhasil, atau gagal) tanpa memblokir UI secara kasar.

---

## 🛠️ Fase 1: Animasi Transisi Halaman (Page Transition)

Karena Next.js App Router memiliki cara kerja navigasi yang berbeda, kita akan mengombinasikan dua pendekatan untuk hasil maksimal:

### 1. Top Progress Bar (`nextjs-toploader`)
Menampilkan garis loading berjalan di bagian paling atas layar setiap kali user mengklik link navigasi (mirip GitHub/YouTube).
*   **Dependency:** `npm install nextjs-toploader`
*   **Implementasi:** Ditambahkan di `src/app/layout.tsx`.
*   **Efek:** Memberi tahu user bahwa permintaan pindah halaman sedang diproses oleh server.

### 2. Animasi Masuk/Keluar Halaman (`framer-motion`)
Memberikan efek *fade-in* atau *slide-up* yang elegan saat halaman baru selesai dimuat dan dirender.
*   **Dependency:** `npm install framer-motion`
*   **Implementasi:** Membuat file `src/app/(dasbor)/template.tsx`. Next.js `template.tsx` akan me-remount komponen setiap kali rute berubah, sehingga sangat cocok untuk memicu animasi masuk (*enter animation*) dengan Framer Motion.

---

## ⏳ Fase 2: Animasi State API (Request, Process, Response)

Kita sudah menggunakan **TanStack Query** dan **Sonner**. Kita akan memaksimalkan alat ini untuk membuat animasi yang detail.

### 1. Feedback Mutasi Data (Create, Update, Delete)
Saat user menekan tombol "Simpan" atau "Hapus", kita ingin animasi 3 tahap:
*   *Tahap 1 (Request/Process):* Muncul popup loading melingkar "Sedang memproses...".
*   *Tahap 2 (Response Sukses/Gagal):* Animasi loading berubah menjadi centang hijau (Sukses) atau silang merah (Gagal).
*   **Implementasi:** Kita akan menggunakan fitur `toast.promise` dari Sonner. Kita akan membuat helper baru di `src/lib/toast.ts` khusus untuk promise.

### 2. Global Fetching Indicator (Read Data)
Saat data tabel sedang di-*refresh* di background (karena user pindah tab atau polling real-time), kita tidak ingin menutupi seluruh layar.
*   **Implementasi:** Membuat komponen `GlobalFetchingIndicator` di Header.
*   **Teknis:** Menggunakan hook `useIsFetching()` dari TanStack Query. Jika nilainya `> 0`, tampilkan ikon sinkronisasi kecil berputar (spinner) di sudut kanan atas header.

### 3. Skeleton Loaders (Initial Load)
Saat pertama kali membuka halaman (sebelum data turun dari server), kita hindari tulisan "Memuat..." yang kaku.
*   **Implementasi:** Membuat komponen skeleton UI dengan animasi `animate-pulse`. Misalnya, `TableSkeleton`, `CardSkeleton`.
*   **Teknis:** Menerapkan komponen skeleton ini pada kondisi `isLoading` di `useQuery`.

---

## 📝 Langkah Eksekusi (Action Plan)

### Step 1: Install Dependencies
```bash
npm install nextjs-toploader framer-motion
```

### Step 2: Setup Top Loader & Global Fetching
1. Update `src/app/layout.tsx` untuk memasukkan `<NextTopLoader />`.
2. Buat komponen `src/components/ui/global-loader.tsx` yang menggunakan `useIsFetching` dan letakkan di `Header.tsx`.

### Step 3: Setup Page Transition Template
1. Buat file `src/app/(dasbor)/template.tsx`.
2. Bungkus `children` dengan `<motion.div>` dengan animasi transisi (contoh: *opacity 0 ke 1, y-axis 20 ke 0*).

### Step 4: Refactor Helper Toast
1. Update `src/lib/toast.ts` dengan fungsi baru: `showPromise`.
```typescript
export const showPromise = (
  promise: Promise<any>, 
  messages: { loading: string; success: string; error: string }
) => {
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};
```

### Step 5: Terapkan pada Fitur yang Sudah Ada
1. **Mutasi:** Refactor tombol "Setujui" di halaman Biodata atau "Tambah Pegawai" agar menggunakan `showPromise` alih-alih `onSuccess` biasa. Tombol tersebut juga akan diberi spinner (mengganti ikon dengan loading spin saat `isPending`).
2. **Query:** Ubah teks "Memuat..." di tabel (seperti di halaman Pegawai) dengan komponen Skeleton UI yang memiliki efek *shimmer/pulse*.

---

## 🎨 Contoh Visual UX yang Diharapkan
- Klik Menu "Pegawai" -> Garis biru tipis melesat di atas layar -> Halaman bergeser lembut ke atas (slide-up) -> Tabel tampil.
- Klik "Simpan Pegawai" -> Tombol berubah menjadi spinner -> Toast muncul di pojok kanan bawah: 🔄 *Sedang menyimpan data...* -> Selesai -> Toast animasi berubah jadi ✅ *Pegawai berhasil ditambahkan*.
- Auto-refresh Peta -> Ikon awan kecil berputar di sudut header menandakan koneksi ke server sedang berjalan tanpa mengganggu interaksi peta.
