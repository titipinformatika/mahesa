# 🗺️ MAHESA Web Frontend — Detail Execution Plan

> **Target**: Programmer Junior / AI Agent yang lebih murah
> **Prinsip**: Setiap issue berdiri sendiri, spesifik, dan bisa dikerjakan tanpa konteks mendalam.

---

## 📊 Status Saat Ini (Sudah Selesai)

| Komponen | Status |
|----------|--------|
| Next.js 16 + Tailwind 4 + shadcn/ui | ✅ |
| Halaman Login (`/masuk`) | ✅ |
| Layout Dasbor (Sidebar + Header) | ✅ |
| Sidebar dinamis per peran | ✅ |
| Daftar Pegawai (DataTable + pagination) | ✅ |
| Detail Pegawai (`/pegawai/[id]`) | ✅ |
| Auth helper (Cookie-based JWT) | ✅ |
| API helper (`fetchWithToken`) | ✅ |
| shadcn/ui: Button, Card, Input, Label, Table, Badge, Avatar, Dropdown, Skeleton | ✅ |

### Komponen shadcn yang BELUM ada (perlu install per issue)
```
Dialog, Sheet, Select, Tabs, Textarea, Calendar, Popover, 
Checkbox, RadioGroup, Switch, Toast/Sonner, Form,
Pagination, Tooltip, AlertDialog, Separator, ScrollArea
```

---

## 🏗️ FASE 2 — Infrastruktur & Fondasi Web (4 Issue)

### Issue #W01: `[Web] Setup TanStack Query & Provider Global`
**Prioritas**: 🔴 Kritis (dependensi semua halaman data)

**Langkah**:
1. `cd web && npm install @tanstack/react-query`
2. Buat `src/lib/query-client.ts` (export QueryClient dengan staleTime 30 detik)
3. Buat `src/providers/query-provider.tsx` ("use client", bungkus QueryClientProvider)
4. Bungkus `{children}` di `src/app/layout.tsx` dengan `<QueryProvider>`

**Kriteria Selesai**: `npm run build` berhasil.

---

### Issue #W02: `[Web] Setup Sonner (Toast Notification)`
**Prioritas**: 🔴 Kritis

**Langkah**:
1. `npx shadcn@latest add sonner`
2. Tambahkan `<Toaster />` di `src/app/layout.tsx`
3. Buat `src/lib/toast.ts` → export `showSuccess(msg)` dan `showError(msg)`

---

### Issue #W03: `[Web] Setup React Hook Form + Zod`
**Prioritas**: 🔴 Kritis (dependensi semua form)

**Langkah**:
1. `npm install react-hook-form zod @hookform/resolvers`
2. `npx shadcn@latest add form`

---

### Issue #W04: `[Web] Refactor API Helper + Tipe Response`
**Prioritas**: 🟡 Penting

**Langkah**:
1. Buat `src/types/api.ts` (interface ApiResponse generik)
2. Buat `src/lib/api/client.ts` (fetchWithToken)
3. Buat `src/lib/api/pegawai.ts`, `src/lib/api/auth.ts` (pisahkan dari api.ts)
4. Pastikan semua import lama tetap bekerja

---

## 🏗️ FASE 3 — Absensi & Dinas Luar (5 Issue)

### Issue #W05: `[Web] Halaman Rekap Absensi`
**File**: `src/app/(dasbor)/absensi/page.tsx`
**API**: `GET /v1/absensi?page=&limit=&tanggal=&status=`
**Install**: `npx shadcn@latest add select calendar popover`

**Fitur**:
1. DataTable: Nama, Tanggal, Tipe, Status, Jam Kerja, Aksi
2. Filter tanggal (Calendar) + filter status (Select)
3. Pagination server-side
4. Badge warna per status (hadir=hijau, terlambat=kuning, tidak_hadir=merah)
5. Tombol "Ekspor" placeholder

---

### Issue #W06: `[Web] Halaman Pegawai Terlambat`
**File**: `src/app/(dasbor)/absensi/terlambat/page.tsx`
**API**: `GET /v1/absensi/terlambat-absen`

**Fitur**: DataTable sortable (Nama, Unit, Jumlah Terlambat, Jumlah Tidak Hadir). Highlight merah jika > 5 hari.

---

### Issue #W07: `[Web] Halaman Rekap Dinas Luar`
**File**: `src/app/(dasbor)/dinas-luar/page.tsx`
**API**: `GET /v1/dinas-luar`
**Install**: `npx shadcn@latest add dialog`

**Fitur**: DataTable + filter status + klik baris → Dialog detail.

---

### Issue #W08: `[Web] Peta Pelacakan Dinas Luar (Leaflet)`
**File**: `src/app/(dasbor)/dinas-luar/pelacakan/page.tsx`, `src/components/peta/peta-pelacakan.tsx`
**API**: `GET /v1/dinas-luar/peta-langsung`
**Install**: `npm install leaflet react-leaflet @types/leaflet`

**Fitur**: Peta fullscreen OpenStreetMap, marker per pegawai DL, polling 30 detik.

---

### Issue #W09: `[Web] Konfigurasi Skema Dinas Luar`
**File**: `src/app/(dasbor)/dinas-luar/skema/page.tsx`
**API**: `GET /v1/skema-dl`, `PUT /v1/skema-dl/:id/toggle`
**Install**: `npx shadcn@latest add switch`

**Fitur**: Card per skema + toggle aktif/nonaktif. Role: `admin_unit`, `pimpinan`.

---

## 🏗️ FASE 4 — Cuti, Kinerja & CRUD Lanjutan (5 Issue)

### Issue #W10: `[Web] Halaman Rekap Cuti`
**File**: `src/app/(dasbor)/cuti/page.tsx`
**API**: `GET /v1/cuti`, `GET /v1/cuti/saldo`
**Install**: `npx shadcn@latest add tabs`

**Fitur**: Tab Pengajuan (DataTable + filter) + Tab Saldo Cuti (DataTable).

---

### Issue #W11: `[Web] Halaman Rekap Laporan Harian`
**File**: `src/app/(dasbor)/laporan-harian/page.tsx`
**API**: `GET /v1/laporan-harian`

**Fitur**: DataTable + filter status + Dialog detail kegiatan.

---

### Issue #W12: `[Web] Halaman Persetujuan Biodata`
**File**: `src/app/(dasbor)/biodata/page.tsx`
**API**: `GET/PUT /v1/biodata/pengajuan`
**Install**: `npx shadcn@latest add sheet textarea alert-dialog`

**Fitur**: DataTable → klik Tinjau → Sheet diff (data lama vs baru) → Setujui/Tolak.

---

### Issue #W13: `[Web] Halaman Manajemen Unit Kerja`
**File**: `src/app/(dasbor)/unit-kerja/page.tsx`, `src/app/(dasbor)/unit-kerja/[id]/page.tsx`
**API**: CRUD `/v1/unit-kerja`

**Fitur**: DataTable + Dialog form tambah/edit + halaman detail unit. Role: `admin_dinas`.

---

### Issue #W14: `[Web] CRUD Pegawai (Tambah/Edit/Nonaktifkan)`
**File diubah**: `src/app/(dasbor)/pegawai/page.tsx`
**API**: `POST/PUT/DELETE /v1/pegawai`

**Fitur**: Tombol Tambah → Sheet form, Edit per baris → Sheet, Nonaktifkan → AlertDialog.

---

## 🏗️ FASE 5 — Dasbor, Monitoring & Laporan (8 Issue)

### Issue #W15: `[Web] Dasbor Utama (Statistik + Grafik)`
**File diubah**: `src/app/(dasbor)/dasbor/page.tsx`
**API**: `GET /v1/dasbor/statistik`, `GET /v1/dasbor/status-pegawai`
**Install**: `npm install recharts`

**Fitur**: 4 kartu statistik + BarChart kehadiran 7 hari + daftar status real-time.

---

### Issue #W16: `[Web] Halaman Pemantauan Real-time`
**File**: `src/app/(dasbor)/pemantauan/page.tsx`
**API**: `GET /v1/dasbor/status-pegawai`

**Fitur**: Grid Card per status (Bekerja/Cuti/DL/Sakit/Tidak Hadir) + auto-refresh 30 detik.

---

### Issue #W17: `[Web] Halaman Pengumuman (CRUD)`
**File**: `src/app/(dasbor)/pengumuman/page.tsx`, `src/app/(dasbor)/pengumuman/baru/page.tsx`
**API**: CRUD `/v1/pengumuman`

**Fitur**: Daftar Card + form buat/edit + hapus (AlertDialog). Role: `admin_dinas`.

---

### Issue #W18: `[Web] Halaman Sinkronisasi Dapodik`
**File**: `src/app/(dasbor)/dapodik/page.tsx`
**API**: `/v1/dapodik/*`

**Fitur**: Form kredensial + pratinjau diff + tombol sinkronisasi + riwayat. Role: `admin_unit`.

---

### Issue #W19: `[Web] Halaman Laporan ke Dinas`
**File**: `src/app/(dasbor)/laporan/page.tsx`
**API**: `GET/POST /v1/laporan-ke-dinas`

**Fitur**: Daftar laporan + form buat + unduh lampiran. Role: `admin_unit`, `pimpinan`.

---

### Issue #W20: `[Web] Halaman Pengaturan Sistem`
**File**: `src/app/(dasbor)/pengaturan/page.tsx`
**API**: `/v1/skema-jam-kerja`, `/v1/pengaturan`

**Fitur**: Tab Skema Jam Kerja (CRUD) + Tab Jenis Kepegawaian (CRUD) + Tab Umum. Role: `admin_dinas`.

---

### Issue #W21: `[Web] Navigasi Mobile (Responsif)`
**File**: `src/components/tata-letak/navigasi-mobile.tsx`

**Fitur**: Tombol hamburger di Header (md:hidden) → Sheet slide kiri → menu sidebar.

---

### Issue #W22: `[Web] Ekspor Data ke Excel`
**Install**: `npm install xlsx`
**File**: `src/lib/export.ts`

**Fitur**: Helper `exportToExcel()` + tombol ekspor di halaman absensi, cuti, pegawai.

---

## 🏗️ FASE 6 — Polish & Testing (5 Issue)

### Issue #W23: `[Web] Mode Gelap (Dark Mode)`
Komponen ThemeToggle di Header, persist ke localStorage, class `dark` di `<html>`.

### Issue #W24: `[Web] Loading States & Error Boundaries`
Buat `error.tsx`, `loading.tsx`, komponen Skeleton reusable.

### Issue #W25: `[Web] Validasi Form & UX Polish`
Semua form pakai RHF+Zod, error per field, disable saat loading, unsaved changes warning.

### Issue #W26: `[Web] SEO & Metadata`
Metadata tiap halaman, semantic HTML, Lighthouse ≥ 90.

### Issue #W27: `[Web] E2E Testing (Playwright)`
Test: login, navigasi, pegawai CRUD, absensi filter, logout.

---

## 🎨 FASE 7 — UX & Animasi Lanjutan (5 Issue)

*Fase ini ditambahkan berdasarkan kebutuhan feedback visual yang lebih responsif dan modern.*

### Issue #W28: `[UX] Implementasi Top Progress Bar (Page Transition)`
**Install:** `npm install nextjs-toploader`
**Fitur:** Indikator loading bar di atas layar saat pindah halaman (di `layout.tsx`).

### Issue #W29: `[UX] Implementasi Animasi Fade/Slide Halaman (Framer Motion)`
**Install:** `npm install framer-motion`
**Fitur:** Gunakan `template.tsx` untuk animasi transisi *fade-in/slide-up* saat komponen di-*mount*.

### Issue #W30: `[UX] Implementasi Global Fetching Indicator`
**Fitur:** Spinner kecil di Header yang mendengarkan `useIsFetching()` dari TanStack Query.

### Issue #W31: `[UX] Refaktor Mutasi Form dengan toast.promise`
**Fitur:** Ubah UX tombol simpan (CUD) menggunakan fitur `toast.promise` dari Sonner.

### Issue #W32: `[UX] Implementasi Skeleton UI untuk Loading State`
**Fitur:** Skeleton animasi *pulse* yang spesifik (Tabel, Card) untuk menggantikan state "Memuat..." bawaan.

---

## 📋 Urutan Eksekusi

```
FASE 2 (Fondasi):       W01 → W02 → W03 → W04
FASE 3 (Absensi/DL):    W05 → W06 → W07 → W08 → W09
FASE 4 (Cuti/Kinerja):  W10 → W11 → W12 → W13 → W14
FASE 5 (Dasbor/Lap):    W15 → W16 → W17 → W18 → W19 → W20 → W21 → W22
FASE 6 (Polish):        W23 → W24 → W25 → W26 → W27
FASE 7 (UX/Animasi):    W28 → W29 → W30 → W31 → W32
```


> [!IMPORTANT]
> **W01-W03 HARUS dikerjakan pertama** karena menjadi dependensi semua issue lain.

## 🔗 Referensi Cepat

| Hal | Lokasi |
|-----|--------|
| API Base URL | `NEXT_PUBLIC_API_URL` di `.env.local` |
| Daftar endpoint | `planningall.md` Bab 8.2 |
| Halaman per role | `planningall.md` Bab 10.2 |
| Pattern DataTable | `src/app/(dasbor)/pegawai/page.tsx` |
| Pattern auth check | `src/components/tata-letak/sidebar.tsx` |
| Pattern API call | `src/lib/api.ts` → `fetchWithToken()` |

## 📐 Sidebar Menu Update (harus diterapkan di sidebar.tsx)

| Menu | Path | Icon | Roles |
|------|------|------|-------|
| Dasbor | `/dasbor` | LayoutDashboard | semua |
| Pemantauan | `/pemantauan` | Activity | admin_dinas, admin_upt, admin_unit, pimpinan |
| Pegawai | `/pegawai` | Users | admin_dinas, admin_upt, admin_unit |
| Absensi | `/absensi` | Calendar | semua |
| Dinas Luar | `/dinas-luar` | MapPin | semua |
| Cuti | `/cuti` | CalendarOff | semua |
| Laporan Harian | `/laporan-harian` | FileText | semua |
| Biodata | `/biodata` | UserCheck | admin_dinas, admin_upt, pimpinan |
| Pengumuman | `/pengumuman` | Megaphone | admin_dinas, admin_upt |
| Unit Kerja | `/unit-kerja` | Building | admin_dinas |
| Dapodik | `/dapodik` | RefreshCw | admin_unit |
| Laporan | `/laporan` | FileBarChart | admin_upt, admin_unit, pimpinan |
| Pengaturan | `/pengaturan` | Settings | admin_dinas |
