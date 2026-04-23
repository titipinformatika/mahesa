# 📋 MAHESA — Master Plan Aplikasi Manajemen Pegawai Dinas Pendidikan

> **MAHESA** — Manajemen Human-resource & Employee System Application
>
> Dokumen perencanaan menyeluruh untuk membangun aplikasi manajemen pegawai
> di lingkungan **Dinas Pendidikan**, berbasis multi-platform
> (Backend API, Web Dashboard, Mobile App).

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Tech Stack & Rekomendasi](#2-tech-stack--rekomendasi)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Hierarki Organisasi & Role System](#4-hierarki-organisasi--role-system)
5. [Desain Database (PostgreSQL)](#5-desain-database-postgresql)
6. [Fitur Detail per Platform & Role](#6-fitur-detail-per-platform--role)
7. [Alur Bisnis (Business Flow)](#7-alur-bisnis-business-flow)
8. [Desain API (RESTful)](#8-desain-api-restful)
9. [Backend — Detail Implementasi](#9-backend--detail-implementasi)
10. [Frontend Web — Detail Implementasi](#10-frontend-web--detail-implementasi)
11. [Mobile App — Detail Implementasi](#11-mobile-app--detail-implementasi)
12. [Keamanan & Otorisasi](#12-keamanan--otorisasi)
13. [Fase Pengembangan](#13-fase-pengembangan)
14. [Struktur Folder Proyek](#14-struktur-folder-proyek)
15. [Deployment & DevOps](#15-deployment--devops)
16. [Checklist Kesiapan Produksi](#16-checklist-kesiapan-produksi)

---

## 1. Ringkasan Proyek

### 1.1 Tujuan

Membangun **Aplikasi Manajemen Pegawai** yang komprehensif untuk lingkungan **Dinas Pendidikan**, mengelola:

- **Absensi** dengan GPS & selfie (Kantor dan Dinas Luar)
- **Dinas Luar (DL)** dengan multi-skema dan live tracking
- **Cuti** dengan berbagai jenis dan alur persetujuan
- **Laporan Kinerja Harian** dengan approval workflow
- **Biodata Pegawai** dengan approval admin
- **Peer Review** kinerja teman satu unit kerja
- **Sinkronisasi Dapodik** untuk data pegawai
- **Notifikasi** (pengumuman, kenaikan gaji berkala, peringatan)
- **Pelaporan** ke Dinas Pendidikan

### 1.2 Hierarki Organisasi

```
Dinas Pendidikan (Level 1 - Induk)
    │
    ├── UPT Wilayah A (Level 2 - Unit Kerja)
    │   ├── Sekolah SDN 1 (Level 3 - Unit Kerja)
    │   │   ├── Pimpinan (Kepala Sekolah)
    │   │   └── Pegawai (Guru/Staf)
    │   │
    │   └── Sekolah SDN 2 (Level 3 - Unit Kerja)
    │       └── ...
    │
    └── SMPN 1 Contoh (Level 3 - Unit Kerja)
        └── Langsung di bawah naungan Dinas (tanpa UPT)
```

### 1.3 Target Pengguna & Platform

| Role | Platform | Deskripsi |
|------|----------|-----------|
| **Pegawai** | 📱 Mobile App | Absensi, cuti, laporan kinerja harian, biodata, peer review |
| **Pimpinan Unit Kerja** (Kepala Sekolah/UPT) | 📱 Mobile App | Approval cuti/DL/kinerja, monitoring bawahan, live tracking DL |
| **Admin Unit Kerja** | 🖥️ Web Dashboard + 🔧 MAHESA Sync Tool | Kelola pegawai unit, rekap, laporan ke Dinas. Sync Dapodik via tool khusus lokal. |
| **Admin UPT** | 🖥️ Web Dashboard | Kepanjangan tangan Dinas, rekap sekolah di wilayahnya (Level 3), pantau kehadiran/DL satu UPT |
| **Admin Dinas** | 🖥️ Web Dashboard | Monitoring seluruh unit, approval biodata, pengumuman, rekap |

---

## 2. Tech Stack & Rekomendasi

> [!IMPORTANT]
> **💰 Total Biaya Teknologi: Rp 0 (GRATIS)**
> Seluruh teknologi yang digunakan dalam proyek MAHESA adalah **gratis dan open-source**.
> Tidak ada biaya lisensi, langganan, atau API key berbayar.

| Kategori | Teknologi | Biaya |
|----------|-----------|-------|
| **Runtime & Framework** | Bun, Elysia.js, Next.js, Flutter | 🆓 Gratis |
| **Database** | PostgreSQL + PostGIS (self-host) | 🆓 Gratis |
| **Cache & Queue** | Redis + BullMQ (self-host) | 🆓 Gratis |
| **Penyimpanan File** | MinIO (self-host, S3-compatible) | 🆓 Gratis |
| **Peta & Lokasi** | Leaflet.js + OpenStreetMap / flutter_map | 🆓 Gratis (tanpa API key) |
| **Notifikasi Push** | Firebase Cloud Messaging (FCM) | 🆓 Gratis (tanpa batas) |
| **Email** | Nodemailer + Gmail SMTP | 🆓 Gratis (500 email/hari) |
| **Server Produksi** | Oracle Cloud Free Tier (4 OCPU, 24GB RAM) | 🆓 Gratis selamanya |
| **SSL/Reverse Proxy** | Caddy + Let's Encrypt | 🆓 Gratis |
| **Pemantauan & Logging** | GlitchTip + Grafana + Loki (self-host) | 🆓 Gratis |
| **CI/CD** | GitHub Actions / Gitea + Woodpecker CI | 🆓 Gratis |
| **Distribusi Mobile** | APK langsung / F-Droid | 🆓 Gratis |
| **MAHESA Sync Tool** | Bun (single binary) + `node-fetch` | 🆓 Gratis — Tool CLI/Tray ringan (~5-10MB), hanya untuk sync Dapodik |

### 2.1 Backend

| Komponen | Teknologi | Versi | Catatan |
|----------|-----------|-------|---------|
| **Runtime** | Bun | ^1.1+ | Runtime JavaScript tercepat, native TypeScript |
| **Framework** | Elysia.js | ^1.4+ | End-to-end type safety, plugin ecosystem, method chaining |
| **ORM** | Drizzle ORM | ^0.36+ | SQL-like syntax, type-safe, auto-generated types |
| **Database** | PostgreSQL | 16+ | RDBMS terpercaya, JSONB support, PostGIS ready |
| **DB Driver** | postgres.js | latest | Lightweight, fast, Bun-compatible |
| **ID Generation** | UUID v7 | — | Time-ordered, sortable, lebih baik dari v4 biasa |
| **Auth Token** | JWT (`jose`) | — | Standard library, stateless auth |
| **Hashing** | bcrypt | — | Password hashing (Argon2id sebagai alternatif lebih aman) |
| **Validation** | TypeBox (built-in Elysia) | — | Runtime + compile-time validation |

#### 🟢 Rekomendasi Teknologi Tambahan (Backend) — Semua Gratis/Open Source

| Teknologi | Kegunaan | Alasan |
|-----------|----------|--------|
| **Redis** (`ioredis`) | Caching, rate limiting, live location store | Menyimpan lokasi real-time pegawai DL, token blacklist. 🆓 Open source. |
| **MinIO** | Object storage (foto selfie, dokumen cuti) | S3-compatible, self-hosted, 🆓 100% gratis. |
| **`@elysiajs/cors`** | CORS handling | Cross-origin untuk Web + Mobile |
| **`@elysiajs/swagger`** | Auto API documentation | Swagger/OpenAPI dari schema |
| **`@elysiajs/bearer`** | Bearer token extraction | JWT extraction helper |
| **`@elysiajs/static`** | Static file serving | Jika tidak pakai CDN terpisah |
| **BullMQ** + Redis | Job queue / background tasks | Generate rekap bulanan, kirim notifikasi batch. 🆓 Open source. |
| **Firebase Admin SDK** | Push notification (FCM) | Kirim notifikasi ke mobile app. 🆓 FCM gratis tanpa batas. |
| **Nodemailer** + SMTP | Email transaksional | 🆓 Gunakan Gmail SMTP (gratis 500 email/hari) atau Mailtrap free tier |
| **`pino`** | Structured logging | Logging cepat & terstruktur |
| **`sharp`** | Image processing | Compress foto selfie sebelum simpan |
| **PostGIS** (extension) | Geospatial queries | Validasi radius lokasi absensi. 🆓 Extension PostgreSQL gratis. |
| **`node-cron`** | Scheduled tasks | Auto-reset saldo cuti tahunan, reminder absensi |
| **`exceljs`** | Excel export/import | Export rekap, import data Dapodik |

### 2.2 Frontend Web (Dashboard Admin)

| Komponen | Teknologi | Versi | Catatan |
|----------|-----------|-------|---------|
| **Framework** | Next.js | 15+ | App Router, RSC, Server Actions |
| **UI Library** | shadcn/ui | latest | Radix UI + Tailwind CSS, full code ownership |
| **Styling** | Tailwind CSS | 4+ | Utility-first CSS |
| **Language** | TypeScript | 5.x | Type safety end-to-end |

#### 🟢 Rekomendasi Teknologi Tambahan (Web) — Semua Gratis/Open Source

| Teknologi | Kegunaan | Alasan |
|-----------|----------|--------|
| **TanStack Table** | Advanced data table | Sorting, filtering, pagination di rekap pegawai |
| **TanStack Query** | Data fetching & caching | Auto cache, refetch, optimistic updates |
| **Recharts** | Charts & data visualization | Grafik kehadiran, statistik unit kerja |
| **React Hook Form + Zod** | Form handling + validation | Forms yang performa tinggi |
| **Zustand** | Client-side state management | Sidebar state, UI state |
| **`nuqs`** | URL search params state | Sync filter ke URL (shareable) |
| **`sonner`** | Toast notifications | Notifikasi aksi sukses/gagal |
| **`lucide-react`** | Icons | Sudah terintegrasi shadcn/ui |
| **Leaflet.js** + **OpenStreetMap** | Peta pelacakan real-time | 🆓 Peta gratis tanpa API key, tidak ada biaya per request |
| **`date-fns`** | Date manipulation | Kalkulasi hari cuti, selisih tanggal |
| **Playwright** | E2E testing | Automated browser testing |
| **Vitest** | Unit testing | Fast unit test runner |

### 2.3 Mobile App (Flutter)

| Komponen | Teknologi | Versi | Catatan |
|----------|-----------|-------|---------|
| **Framework** | Flutter | 3.x+ | Cross-platform (Android + iOS) |
| **Language** | Dart | 3.x+ | Null safety by default |
| **State Management** | Riverpod | ^2.5+ | Compile-time safe, async-friendly |
| **Architecture** | Clean Architecture | — | Feature-first, separation of concerns |

#### 🟢 Rekomendasi Teknologi Tambahan (Mobile) — Semua Gratis/Open Source

| Teknologi | Kegunaan | Alasan |
|-----------|----------|--------|
| **`dio`** | HTTP client | Interceptors, auto-refresh token, upload progress |
| **`go_router`** | Routing & navigation | Declarative routing, deep linking dari notifikasi |
| **`flutter_secure_storage`** | Secure token storage | Simpan JWT aman di device |
| **`hive`** / **`isar`** | Local database/cache | Offline cache profil, absensi terakhir |
| **`geolocator`** | GPS location | Koordinat absensi & DL |
| **`flutter_map`** + **OpenStreetMap** | Map widget | 🆓 Peta gratis tanpa API key, preview lokasi & pelacakan DL |
| **`camera`** | Camera selfie | Foto selfie absensi |
| **`image_picker`** + **`image_cropper`** | Upload foto/dokumen | Upload surat cuti, dokumen |
| **`local_auth`** | Biometric login | Fingerprint/Face ID quick login |
| **`firebase_messaging`** | Push notification | Real-time notif dari server. 🆓 FCM gratis tanpa batas. |
| **`flutter_local_notifications`** | Local notification | Reminder absensi pagi |
| **`pdf`** + **`printing`** | Generate/view PDF | Surat tugas DL, laporan |
| **`freezed`** + **`json_serializable`** | Data class generation | Immutable models, auto serialization |
| **`get_it`** | Dependency injection | Service locator |
| **`intl`** | Localization & formatting | Format tanggal/mata uang Indonesia |
| **`permission_handler`** | Permission management | Camera, GPS, storage permissions |
| **`connectivity_plus`** | Network detection | Deteksi online/offline |
| **`mockito`** | Test mocking | Unit test & widget test |

### 2.4 MAHESA Sync Tool (Dapodik Agent — Khusus Admin Unit Kerja)

> [!IMPORTANT]
> **Keputusan Arsitektur (Rencana A):** Admin Unit Kerja tetap menggunakan **Web Dashboard** untuk seluruh fitur manajemen. Namun untuk kebutuhan **Sinkronisasi Dapodik** yang memerlukan akses ke aplikasi Dapodik Desktop lokal (`localhost:5774`), disediakan **MAHESA Sync Tool** — sebuah aplikasi CLI/System Tray kecil dan ringan yang diinstal sekali di komputer sekolah.

#### Alasan Pemilihan Rencana A (Web + Sync Tool)

| Aspek | Web Dashboard + Sync Tool (Rencana A) | Flutter Desktop Penuh (Rencana B) |
|-------|--------------------------------------|-----------------------------------|
| **Distribusi & Update** | Web: otomatis. Tool: self-update ringan | Harus install ulang di setiap komputer |
| **Ukuran instalasi** | Tool kecil ~5-10 MB | ~50-100 MB per installer |
| **Akses dari mana saja** | Bisa dari browser manapun | Hanya di komputer terinstall |
| **Beban development** | Satu codebase web untuk semua admin | Dua codebase: web + desktop |
| **Fitur Dapodik Sync** | ✅ Via tool lokal | ✅ Native |
| **Rekomendasi** | ✅ **Dipilih** | ❌ Terlalu berat untuk manfaatnya |

#### Spesifikasi MAHESA Sync Tool

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| **Runtime** | Bun | Compile menjadi single `.exe` / binary (tidak butuh install Node/Bun di komputer sekolah) |
| **HTTP Client** | `node-fetch` / Bun native `fetch` | Akses `localhost:5774` langsung (bebas CORS, bukan browser) |
| **Cookie Management** | Manual cookie store (seperti `syncService.js` lama) | Login 3 tahap ke Dapodik Desktop |
| **UI** | CLI (Terminal) / System Tray opsional | Minimalis, ringan, tidak butuh GUI kompleks |
| **Enkripsi Kredensial** | AES-256 via `crypto` (built-in Bun) | Username + password Dapodik tidak disimpan plaintext |
| **Distribusi** | `.exe` (Windows) / `.sh` (Linux) | Download dari halaman Web Dashboard MAHESA |
| **Auto-update** | Cek versi dari MAHESA API saat startup | Self-update tanpa intervensi IT |

#### Alur Kerja Sync Tool

```
Admin Unit buka Web Dashboard → Tab "Dapodik"
    ↓
Jika belum ada Sync Tool → Tampilkan instruksi download
Admin download MAHESA_Sync_Tool.exe dari dashboard
Instal & jalankan (sekali saja, bisa dijadikan startup)
    ↓
Sync Tool berjalan di background (system tray / service)
    ↓
Admin klik "Sinkronisasi Sekarang" di Web Dashboard
    → Web Dashboard POST ke MAHESA Cloud API:
      { action: 'trigger_sync', unit_id: '...' }
    → Cloud API buat "sync job" dengan status: menunggu_agen
    ↓
Sync Tool (polling MAHESA API setiap 30 detik):
    → GET /v1/dapodik/job-sinkronisasi?unit_id=xxx
    → Ada job? → Jalankan proses sync lokal:
        [1] Login 3 tahap ke localhost:5774
        [2] Tarik data PTK (response.data.rows)
        [3] POST hasil ke MAHESA Cloud API
    → Update status job: selesai / gagal
    ↓
Web Dashboard menampilkan hasil sync (polling status)
```

#### Struktur Folder MAHESA Sync Tool

```
mahesa-sync-tool/
├── src/
│   ├── index.ts              # Entry point, polling loop
│   ├── dapodik/
│   │   ├── login.ts          # Login 3 tahap (adaptasi syncService.js)
│   │   ├── fetcher.ts        # Tarik data PTK via cookie session
│   │   └── mapper.ts         # Transformasi data Dapodik → format MAHESA
│   ├── mahesa/
│   │   └── api.ts            # Komunikasi dengan MAHESA Cloud API
│   ├── config/
│   │   └── credentials.ts    # Enkripsi/dekripsi kredensial lokal
│   └── utils/
│       └── logger.ts
├── build.ts                  # Bun compile script → single binary
├── package.json
└── README.md
```

### 2.5 Alternatif Berbayar (Enterprise / Premium)

Sebagai perbandingan, berikut adalah daftar teknologi versi berbayar beserta kelebihan dan kekurangannya jika dibandingkan dengan versi gratis yang direkomendasikan di atas. Instansi dapat mempertimbangkan opsi ini jika memiliki anggaran khusus (APBD/APBN) dan membutuhkan skalabilitas atau SLA (Service Level Agreement) terjamin.

| Kategori | Teknologi Berbayar | Kelebihan (vs Gratis) | Kekurangan (vs Gratis) |
|----------|--------------------|-----------------------|------------------------|
| **Database & BaaS** | **Supabase Pro / Firebase Blaze / AWS RDS** | Dikelola penuh (Managed), auto-scaling, backup otomatis, uptime SLA terjamin, setup lebih instan tanpa perlu config server sendiri. | Terkena *vendor lock-in*, biaya akan membengkak (*pay-as-you-go*) seiring dengan pertumbuhan data dan traffic pengguna. |
| **Server & Deployment** | **Vercel Pro / Railway / GCP (VM Berbayar)** | CI/CD instan, edge CDN, infrastruktur lebih stabil (jika traffic sangat tinggi), terhindar dari keterbatasan tier gratis. | Biaya bulanan (mulai dari ~$20+/bulan) ditambah biaya pemakaian trafik & komputasi. |
| **Peta & Pelacakan Lokasi** | **Google Maps API / Mapbox Enterprise** | Peta jauh lebih tajam, akurasi *geocoding* tiada tanding, integrasi dan render di perangkat *mobile* sangat mulus. | Berbayar per *API request*. Jika ada ribuan absensi & update lokasi tiap hari, tagihan API bisa sangat besar. |
| **Push Notification & SMS** | **OneSignal Premium / Twilio (WhatsApp/SMS)** | Memiliki analitik mendalam, *delivery rate* tinggi, opsi *fallback* (kirim WA/SMS jika Push gagal). | Langganan mahal berdasarkan jumlah pengguna aktif bulanan atau biaya per pesan (*pay-per-message*). |
| **UI Components (Web)** | **Tailwind UI / MUI X Premium** | Desain premium, komponen enterprise siap pakai (layaknya Data Grid pro dengan *advanced filter/export* bawaan). | Biaya lisensi per developer (*one-time* atau *subscription*) yang relatif mahal (bisa rata-rata > $300-$1000). |
| **Penyimpanan Berkas** | **AWS S3 / Google Cloud Storage** | Skalabilitas tinggi kapasitas petabyte, *multi-region redundancy*, durabilitas file 99.999% (*eleven nines*). | Tagihan variabel per bulan dihitung dari kapasitas yang dipakai, jumlah *request* (GET/PUT), dan *bandwidth* data keluar (egress). |

**Kesimpulan Pemilihan:**
- Pertahankan penggunaan **opsi GRATIS (seperti stack saat ini)** untuk menekan budget infrastruktur secara maksimal. Kombinasi *self-hosted* pada *virtual machine* atau aset *on-premise* yang sudah dimiliki instansi sudah jauh lebih dari cukup dan kuat untuk skala satu wilayah.
- Gunakan **opsi BERBAYAR** **hanya jika** instansi tidak memiliki staf TI (DevOps/SysAdmin) internal yang mumpuni untuk *maintenance* server mandiri, atau ada dana sisa operasional untuk membiayai kemudahan *manage services* (terima bersih dengan jaminan ketersediaan).

---

## 3. Arsitektur Sistem

### 3.1 Arsitektur High-Level

```
┌───────────────────────────────────────────────────────────────────────┐
│                           CLIENTS                                     │
│                                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────────┐  │
│  │  📱 Mobile App  │  │  📱 Mobile App  │  │  🖥️ Web Dashboard       │  │
│  │  (Pegawai)     │  │  (Pimpinan)   │  │  (Admin Dinas/Unit)     │  │
│  │  Flutter       │  │  Flutter       │  │  Next.js + shadcn/ui    │  │
│  └───────┬────────┘  └───────┬────────┘  └────────────┬────────────┘  │
│          │                   │                        │               │
└──────────┼───────────────────┼────────────────────────┼───────────────┘
           │                   │                        │
           └───────────────────┼────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                  REVERSE PROXY (Caddy / Nginx)                        │
│                  + SSL/TLS + Rate Limiting                             │
└──────────────────────────────┬────────────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Bun + Elysia.js)                      │
│                                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │   Auth   │ │ Pegawai  │ │ Absensi  │ │  Dinas   │ │   Cuti    │  │
│  │ Module   │ │ /Biodata │ │ Module   │ │  Luar    │ │  Module   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Kinerja  │ │Notifikasi│ │Pengumuman│ │  Rekap/  │ │  Dapodik  │  │
│  │ Harian   │ │ Module   │ │ Module   │ │ Laporan  │ │   Sync    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│  ┌──────────┐ ┌──────────┐                                           │
│  │  Peer    │ │ Organisasi│                                          │
│  │ Review   │ │ Module   │                                           │
│  └──────────┘ └──────────┘                                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Middleware: Auth Guard │ RBAC │ Rate Limit │ Logger │ Error    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Service Layer (Business Logic + Validation)                    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  Repository Layer (Drizzle ORM)                                 │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────┬──────────────┬──────────────┬──────────────┬────────────────┘
          │              │              │              │
          ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │    Redis     │ │    MinIO     │ │   Firebase   │
│  (Primary DB)│ │ (Cache+Live  │ │ (Files/Foto) │ │   (FCM Push  │
│  🆓 Gratis   │ │  Location)   │ │ 🆓 Gratis   │ │ Notification)│
│              │ │ 🆓 Gratis   │ │              │ │ 🆓 Gratis   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 3.2 Backend Layer Pattern

```
HTTP Request
    │
    ▼
┌─────────────────────────────┐
│  Middleware Chain            │
│  ├── Logger (pino)          │
│  ├── Rate Limiter           │
│  ├── CORS                   │
│  ├── Auth Guard (JWT verify)│
│  └── RBAC (role check)      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Controller (Elysia Route)  │  ← Menerima & mengirim response saja
│  + TypeBox Schema Validation│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Service Layer              │  ← Business logic, validasi bisnis
│  ├── Orchestration          │
│  ├── Business Rules         │
│  └── Event/Notification     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Repository Layer           │  ← Drizzle ORM queries, reusable
│  └── Database / Redis / S3  │
└─────────────────────────────┘
```

---

## 4. Hierarki Organisasi & Sistem Peran

### 4.1 Definisi Peran

```
┌─────────────────────────────────────────────────────────────────┐
│                      HIERARKI PERAN                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ADMIN_DINAS (Admin Dinas Pendidikan)                   │   │
│  │  → Web Dashboard: Monitoring semua unit, pengumuman,    │   │
│  │    approval biodata, rekap keseluruhan, pengaturan       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ADMIN_UPT (Admin Unit Pelaksana Teknis)                │   │
│  │  → Web Dashboard: Rekap absensi/cuti/DL sekolah         │   │
│  │    se-wilayah UPT-nya, pemantauan performa Level 3       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ADMIN_UNIT (Admin Unit Kerja / Operator Sekolah)       │   │
│  │  → Web Dashboard: Kelola pegawai unit, sync Dapodik,    │   │
│  │    monitoring unit, laporan ke wilayah / Dinas           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PIMPINAN_UNIT_KERJA (Kepala Sekolah / Kepala UPT)      │   │
│  │  → Mobile App: Approval cuti/DL/kinerja,                │   │
│  │    monitoring bawahan, live tracking DL                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PEGAWAI (Guru / Staf / TU)                             │   │
│  │  → Mobile App: Absensi, cuti, kinerja harian,           │   │
│  │    biodata, peer review                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Matriks Hak Akses

| Hak Akses | Admin Dinas | Admin UPT | Admin Unit | Pimpinan Unit Kerja | Pegawai |
|-----------|:-----------:|:---------:|:----------:|:-------------------:|:-------:|
| **Pengaturan Sistem (Master Data)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Kelola Skema Jam Kerja**| ✅ | ❌ | ❌ | ❌ | ❌ |
| **Kelola Master Jenis Kepegawaian**| ✅ | ❌ | ❌ | ❌ | ❌ |
| **Kelola Semua Peran Akun** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Lihat Semua Unit Kerja (Global)**| ✅ | ❌ | ❌ | ❌ | ❌ |
| **Lihat Unit Kerja Bawahan (Wilayah UPT)**| ✅ | ✅ | ❌ | ❌ | ❌ |
| **Setujui Biodata Tingkat 1 (Pimpinan Unit)** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Setujui Biodata Tingkat 2 (Admin UPT)**| ❌ | ✅ | ❌ | ❌ | ❌ |
| **Setujui Biodata Tingkat Akhir (Dinas)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Buat Pengumuman** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Sinkronisasi Dapodik** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Lihat Rekap Semua Unit (Global)** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Lihat Rekap Unit Terkait & Bawahan** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Setujui Cuti & Dinas Luar** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Kelola & Tugaskan Kegiatan LHKP** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Setujui Kinerja Harian (LHKP)** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Pantau Lokasi DL (Berjalan)** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Input Absensi Bawahan (Manual)** | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Submit Absensi & Kinerja & Cuti**| ❌ | ✅ | ✅ | ✅ | ✅ |
| **Submit Review Rekan** | ❌ | ✅ | ✅ | ❌ | ✅ |
| **Lihat Data & Edit Biodata Sendiri**| ✅ | ✅ | ✅ | ✅ | ✅ |
| **Buat Laporan ke Atasan** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Lihat Pegawai Terlambat** | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 5. Desain Database (PostgreSQL)

### 5.1 Entity Relationship Diagram (Ringkasan)

```mermaid
erDiagram
    pengguna ||--o| pegawai : memiliki
    pegawai }o--|| unit_kerja : bertugas_di
    unit_kerja }o--|| dinas : dibawah
    master_jenis_kepegawaian ||--o{ jabatan_pegawai : mengkategorikan
    pegawai ||--o{ absensi : mencatat
    pegawai ||--o{ titik_absensi : memiliki
    pegawai ||--o{ pengajuan_dinas_luar : mengajukan
    pengajuan_dinas_luar ||--o{ titik_dinas_luar : memiliki
    pegawai ||--o{ pengajuan_cuti : mengajukan
    jenis_cuti ||--o{ pengajuan_cuti : mengkategorikan
    pegawai ||--o{ saldo_cuti : memiliki
    pegawai ||--o{ laporan_harian : menulis
    laporan_harian ||--o{ detail_laporan_harian : berisi
    jenis_kegiatan_lhkp ||--o{ detail_laporan_harian : mengkategorikan
    jenis_kegiatan_lhkp ||--o{ penugasan_kegiatan_lhkp : ditugaskan
    pegawai ||--o{ penugasan_kegiatan_lhkp : menerima
    unit_kerja ||--o{ jenis_kegiatan_lhkp : memiliki
    pegawai ||--o{ review_rekan : memberi
    pegawai ||--o{ review_rekan : menerima
    pegawai ||--o{ pengajuan_biodata : mengajukan
    pegawai ||--o{ dokumen_pegawai : memiliki
    pengumuman }o--|| pengguna : dibuat_oleh
    notifikasi }o--|| pengguna : dikirim_ke
    pegawai ||--o{ log_lokasi_pegawai : dilacak
```

### 5.1.1 Pendekatan Inisiasi Data Sistem (*Database Seeding*)

> **Catatan Penting:** MAHESA didesain sebagai sistem tunggal (Satu Instalasi untuk Satu Instansi Dinas). Hal ini menyelesaikan _Chicken and Egg Problem_ terkait siapa yang berwenang pertama kali membuat admin.
>
> **Skenario *Genesis***: Data `dinas` pertama kali (*instance* instansi tunggal) beserta **satu** akun `pegawai` + `pengguna` yang menjabat sebagai `super_admin` (*Genesis Admin*) **TIDAK DIBUAT melalui *Web Dashboard***. Melainkan disuntikkan secara aman secara *hardcode* (*Database Seeder* atau CLI Sistem) saat proses _deployment_ aplikasi ke server untuk pertama kalinya oleh Tim IT Developer. Setelah *Genesis Admin* berhasil masuk, dia akan memiliki *Full Access* Web UI untuk menambahkan cabang, sekolah, dan staf lainnya secara terstruktur.

---

### 5.2 Skema Tabel Detail

---

#### 📌 `dinas` — Dinas Pendidikan (Tingkat Kabupaten/Kota)

```sql
CREATE TABLE dinas (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama                VARCHAR(255) NOT NULL,           -- "Dinas Pendidikan Kab. XYZ"
    kode                VARCHAR(20) UNIQUE NOT NULL,     -- "DISDIK-XYZ"
    alamat              TEXT,
    telepon             VARCHAR(20),
    email               VARCHAR(255),
    url_logo            VARCHAR(500),
    latitude            DECIMAL(10,7),
    longitude           DECIMAL(10,7),
    aktif               BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `akses_admin_dinas` — Multi Admin/Super Admin Dinas (Relasi Tingkat 1)

> Dibuat untuk memecah akses *Super Admin*. Memungkinkan kita memiliki lebih dari satu pengelola tingkat Kabupaten/Kota dengan peran spesifik.

```sql
CREATE TABLE akses_admin_dinas (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_dinas            UUID NOT NULL REFERENCES dinas(id) ON DELETE CASCADE,
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    peran               ENUM('super_admin', 'auditor', 'operator_biodata') NOT NULL DEFAULT 'super_admin',
    diberikan_oleh      UUID REFERENCES pegawai(id),
    aktif               BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `skema_jam_kerja` — Master Skema Jam Kerja Pegaawai

> Dikelola oleh Admin Dinas untuk menentukan jadwal operasional kerja, misal "5 Hari Kerja" atau "6 Hari Kerja".
> Kemudian disematkan langsung pada masing-masing tabel pegawai dan bukan per unit.

```sql
CREATE TABLE skema_jam_kerja (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama                    VARCHAR(100) NOT NULL,           -- "5 Hari Kerja", "6 Hari Kerja"
    deskripsi               TEXT,                            -- "Senin-Jumat 07:30-16:00"
    hari_kerja_seminggu     INTEGER NOT NULL,                -- 5 atau 6
    jam_masuk               TIME NOT NULL,                   -- "07:30"
    jam_pulang              TIME NOT NULL,                   -- "16:00" atau "15:00"
    toleransi_terlambat_menit INTEGER NOT NULL DEFAULT 15,
    aktif                   BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `level_unit_kerja` — Master Level Unit Kerja

```sql
CREATE TABLE level_unit_kerja (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level               INTEGER UNIQUE NOT NULL,         -- 1 = Dinas, 2 = UPT, 3 = Sekolah
    nama                VARCHAR(100) NOT NULL,           -- "Dinas", "UPT", "Sekolah", "Kantor Cabang"
    keterangan          TEXT,                            -- Deskripsi mengenai level ini
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `unit_kerja` — Unit Kerja (Sekolah / UPT / Kantor)

```sql
CREATE TABLE unit_kerja (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Field Khusus Sekolah (Bisa NULL jika bentuknya Kantor/UPT)
    sekolah_id_dapodik      UUID UNIQUE,                     -- NULLABLE. Hanya terisi jika Unit Level 3 (Sinkronisasi Dapodik)
    bentuk_pendidikan       VARCHAR(50),                     -- NULLABLE. SD, SMP, SMA, dsb (Dari Dapodik)
    status_sekolah          VARCHAR(50),                     -- NULLABLE. Negeri / Swasta (Dari Dapodik)
    npsn                    VARCHAR(20) UNIQUE,              -- NULLABLE. Nomor Pokok Sekolah Nasional (Dari Dapodik)
    
    -- Field Umum (Untuk Semua Unit Kerja)
    id_dinas                UUID NOT NULL REFERENCES dinas(id),
    id_induk_unit           UUID REFERENCES unit_kerja(id),  -- FK ke UPT (Level 2) jika unit ini adalah Level 3
    id_level_unit           UUID NOT NULL REFERENCES level_unit_kerja(id),  -- Referensi ke master level
    nama                    VARCHAR(255) NOT NULL,           -- "SDN 1 Contoh"
    kode                    VARCHAR(30) UNIQUE NOT NULL,
    jenis                   VARCHAR(50) NOT NULL,            -- sd, smp, sma, smk, upt, kantor
    alamat                  TEXT,
    telepon                 VARCHAR(20),
    email                   VARCHAR(255),
    -- id_kepala_unit: dihapus, diganti tabel relasi pejabat_unit_kerja
    -- id_admin_unit: dihapus, diganti tabel relasi akses_admin_unit
    latitude                DECIMAL(10,7) NOT NULL,          -- Koordinat pusat untuk validasi absensi
    longitude               DECIMAL(10,7) NOT NULL,
    radius_absensi_meter    INTEGER NOT NULL DEFAULT 100,    -- Radius absensi kantor (meter)
    aktif                   BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `pejabat_unit_kerja` — Multi Pimpinan/Wakil (Relasi)

```sql
CREATE TABLE pejabat_unit_kerja (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_unit_kerja       UUID NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    jabatan             ENUM('kepala_definitif', 'plt', 'wakil_kepala') NOT NULL,
    tanggal_mulai       DATE NOT NULL,
    tanggal_selesai     DATE,                            -- Jika null berarti masih menjabat
    aktif               BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `akses_admin_unit` — Multi Admin/Operator (Relasi)

```sql
CREATE TABLE akses_admin_unit (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_unit_kerja       UUID NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    peran               ENUM('admin_unit', 'operator_absensi') NOT NULL DEFAULT 'admin_unit',
    diberikan_oleh      UUID REFERENCES pegawai(id),
    aktif               BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `pengguna` — Akun Login

```sql
CREATE TABLE pengguna (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) UNIQUE NOT NULL,
    hash_kata_sandi     VARCHAR(255) NOT NULL,
    peran               VARCHAR(30) NOT NULL DEFAULT 'pegawai',
    -- Nilai: admin_dinas, admin_upt, admin_unit, pimpinan_unit_kerja, pegawai
    aktif               BOOLEAN NOT NULL DEFAULT true,
    
    -- Lapisan Keamanan Tambahan
    mfa_aktif           BOOLEAN NOT NULL DEFAULT false,  -- Multi-Factor Authentication (Wajib bagi Admin Dinas)
    mfa_secret          VARCHAR(255),                    -- Kunci Rahasia untuk Google Authenticator / Authy
    
    terakhir_login      TIMESTAMPTZ,
    token_fcm           VARCHAR(500),                    -- Firebase Cloud Messaging token
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `pegawai` — Data Pegawai

```sql
CREATE TABLE pegawai (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengguna             UUID UNIQUE REFERENCES pengguna(id) ON DELETE SET NULL,
    id_unit_kerja           UUID NOT NULL REFERENCES unit_kerja(id),
    id_skema_jam_kerja      UUID REFERENCES skema_jam_kerja(id), -- Jam absen melekat ke pegawai

    -- Identitas
    nip                     VARCHAR(30) UNIQUE,              -- Nomor Induk Pegawai (bisa null untuk honorer)
    nuptk                   VARCHAR(20) UNIQUE,              -- NUPTK (untuk guru)
    nik                     VARCHAR(16) UNIQUE NOT NULL,      -- NIK KTP
    nama_lengkap            VARCHAR(255) NOT NULL,
    jenis_kelamin           VARCHAR(20) NOT NULL,             -- laki_laki, perempuan
    tempat_lahir            VARCHAR(100),
    tanggal_lahir           DATE,
    agama                   VARCHAR(20),
    status_perkawinan       VARCHAR(20),                      -- belum_kawin, kawin, cerai_hidup, cerai_mati
    telepon                 VARCHAR(20),
    alamat                  TEXT,
    url_foto                VARCHAR(500),

    -- ID Rekam Jejak Sync & Multi-Source (MDM)
    id_siasn                VARCHAR(100) UNIQUE,              -- Jika tersinkronisasi dari SIASN (BKN)
    id_simpeg               VARCHAR(100) UNIQUE,              -- Jika tersinkronisasi dari SIMPEG Lokal
    ptk_id                  UUID UNIQUE,                      -- Jika tersinkronisasi dari Dapodik
    sumber_awal             VARCHAR(20) NOT NULL DEFAULT 'manual', -- 'siasn', 'simpeg', 'dapodik', 'manual'

    -- Raw Data (JSONB) untuk Audit & Rollback (Staging Area)
    raw_data_siasn          JSONB,
    raw_data_simpeg         JSONB,
    raw_data_dapodik        JSONB,
    
    -- Tanggal mulai bergabung
    tanggal_masuk           DATE NOT NULL,

    -- Keuangan
    nama_bank               VARCHAR(100),
    nomor_rekening          VARCHAR(50),
    nama_pemilik_rekening   VARCHAR(255),
    npwp                    VARCHAR(30),

    -- Kontak darurat
    nama_kontak_darurat     VARCHAR(255),
    telepon_kontak_darurat  VARCHAR(20),

    -- Status biodata
    status_biodata          VARCHAR(20) NOT NULL DEFAULT 'belum_lengkap',
    -- Nilai: belum_lengkap, menunggu_review, disetujui, perlu_revisi

    aktif                   BOOLEAN NOT NULL DEFAULT true,
    catatan                 TEXT,
    dibuat_pada             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

```

```

---

#### 📌 `master_jenis_kepegawaian` — Master Jenis & Hak Akses Pegawai

> Dikelola oleh Admin Dinas. Menentukan apakah jenis pegawai tertentu (misal: "Honorer") wajib melakukan absen, boleh cuti, dsb.

```sql
CREATE TABLE master_jenis_kepegawaian (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama                VARCHAR(100) UNIQUE NOT NULL,    -- "PNS", "PPPK", "Honorer Daerah", "Magang"
    wajib_absen         BOOLEAN NOT NULL DEFAULT true,   -- Apakah diwajibkan melakukan absen harian
    hak_cuti            BOOLEAN NOT NULL DEFAULT true,   -- Apakah berhak mengajukan cuti
    hak_dinas_luar      BOOLEAN NOT NULL DEFAULT true,   -- Apakah berhak diajukan/mengajukan Dinas Luar
    hak_lhkp            BOOLEAN NOT NULL DEFAULT true,   -- Apakah diwajibkan mengisi Laporan Kinerja Harian
    aktif               BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `jabatan_pegawai` — Riwayat Karir & Pangkat (Histori Kepegawaian)

> Termasuk data yang ditarik dari SIMPEG dan Dapodik (TMT, SK, Golongan) terakumulasi di sini.

```sql
CREATE TABLE jabatan_pegawai (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai              UUID NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    id_unit_kerja           UUID NOT NULL REFERENCES unit_kerja(id),
    
    id_jenis_kepegawaian    UUID NOT NULL REFERENCES master_jenis_kepegawaian(id), -- Menggantikan teks statis pns/pppk
    nama_jabatan            VARCHAR(100) NOT NULL,            -- "Guru Madya", "Staf TU Daerah"
    pangkat_golongan        VARCHAR(20),                      -- "III/a", "IV/b"
    eselon                  VARCHAR(10),                      -- "Eselon III.a"
    
    -- Data Legal formal (Ditarik otomatis jika sinkron SIMPEG/Dapodik)
    nomor_sk                VARCHAR(100),
    tanggal_sk              DATE,
    tmt_jabatan             DATE NOT NULL,                    -- Terhitung Mulai Tanggal
    lembaga_pengangkat      VARCHAR(100),
    
    is_aktif                BOOLEAN NOT NULL DEFAULT true,    -- Jabatan yang sedang berjalan sekarang
    sumber_data             VARCHAR(30) NOT NULL DEFAULT 'manual', -- manual, dapodik, simpeg
    dibuat_pada             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `pendidikan_pegawai` — Riwayat Pendidikan

```sql
CREATE TABLE pendidikan_pegawai (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai              UUID NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    jenjang                 VARCHAR(20) NOT NULL,             -- SD, SMP, SMA, D3, S1, S2, S3
    nama_institusi          VARCHAR(255) NOT NULL,            -- "Universitas Pendidikan Indonesia"
    fakultas                VARCHAR(100),
    jurusan                 VARCHAR(100),
    tahun_lulus             INTEGER NOT NULL,
    gelar                   VARCHAR(20),                      -- "S.Pd.", "M.M."
    
    sumber_data             VARCHAR(30) NOT NULL DEFAULT 'manual', -- manual, dapodik, simpeg
    dibuat_pada             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `keluarga_pegawai` — Data Tanggungan Keluarga

```sql
CREATE TABLE keluarga_pegawai (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai              UUID NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    nama_lengkap            VARCHAR(255) NOT NULL,
    nik                     VARCHAR(16) UNIQUE,
    hubungan                VARCHAR(30) NOT NULL,             -- suami, istri, anak_kandung, anak_angkat
    tempat_lahir            VARCHAR(100),
    tanggal_lahir           DATE,
    jenis_kelamin           VARCHAR(20),
    pekerjaan               VARCHAR(100),
    status_tunjangan        BOOLEAN NOT NULL DEFAULT false,   -- Apakah masuk dalam tunjangan gaji
    
    sumber_data             VARCHAR(30) NOT NULL DEFAULT 'manual', -- manual, dapodik, simpeg
    dibuat_pada             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `absensi` — Absensi/Kehadiran (Header per hari)

```sql
CREATE TABLE absensi (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    tanggal             DATE NOT NULL,
    tipe                VARCHAR(20) NOT NULL DEFAULT 'kantor',
    -- Nilai: kantor, dinas_luar
    id_pengajuan_dl     UUID REFERENCES pengajuan_dinas_luar(id), -- Jika tipe = dinas_luar
    status              VARCHAR(20) NOT NULL DEFAULT 'hadir',
    -- Nilai: hadir, terlambat, tidak_hadir, izin, sakit, cuti, dinas_luar
    jam_kerja           DECIMAL(4,2),                              -- Total jam kerja (auto-calc)
    jam_lembur          DECIMAL(4,2) DEFAULT 0,
    diabsenkan_oleh     UUID REFERENCES pegawai(id),               -- FK Jika pimpinan mengabsenkan bawahan
    catatan             TEXT,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(id_pegawai, tanggal)
);
```

---

#### 📌 `titik_absensi` — Titik-titik Absensi (Jam Masuk/Pulang/DL)

```sql
CREATE TABLE titik_absensi (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_absensi          UUID NOT NULL REFERENCES absensi(id) ON DELETE CASCADE,
    jenis_titik         VARCHAR(30) NOT NULL,
    -- Nilai:
    --   kantor: jam_masuk, jam_pulang
    --   dinas_luar: berangkat_dl, sampai_dl, pulang_dl, sampai_kantor, pulang_kantor
    waktu               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    latitude            DECIMAL(10,7),                   -- Nullable jika diabsenkan manual pimpinan
    longitude           DECIMAL(10,7),                   -- Nullable jika diabsenkan manual pimpinan
    url_foto            VARCHAR(500),                    -- Nullable jika diabsenkan manual pimpinan
    dalam_radius        BOOLEAN,                         -- Apakah dalam radius yang ditentukan
    diabsenkan_manual   BOOLEAN NOT NULL DEFAULT false,  -- TRUE = Diinput manual oleh Pimpinan tanpa GPS/Selfie
    nama_lokasi         VARCHAR(255),                    -- Nama lokasi (reverse-geocoded, opsional)
    catatan             TEXT,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `pengajuan_dinas_luar` — Pengajuan Dinas Luar

```sql
CREATE TABLE pengajuan_dinas_luar (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai              UUID NOT NULL REFERENCES pegawai(id),
    tanggal                 DATE NOT NULL,
    skema                   VARCHAR(30) NOT NULL,
    -- Nilai: dl_penuh, kantor_dl_pulang, dl_kantor
    -- Keterangan Skema:
    --   dl_penuh          = Dinas Luar Full (berangkat dari mana saja → lokasi DL → pulang)
    --   kantor_dl_pulang  = Masuk Kerja → Dinas Luar → Pulang
    --   dl_kantor         = Dinas Luar → Masuk Kerja
    nama_tujuan             VARCHAR(255) NOT NULL,        -- Nama lokasi tujuan DL
    latitude_tujuan         DECIMAL(10,7) NOT NULL,
    longitude_tujuan        DECIMAL(10,7) NOT NULL,
    radius_tujuan_meter     INTEGER NOT NULL DEFAULT 200, -- Radius validasi di lokasi tujuan
    keperluan               TEXT NOT NULL,                -- Tujuan/alasan DL
    url_surat_tugas         VARCHAR(500),                 -- Upload surat tugas (opsional)

    status                  VARCHAR(20) NOT NULL DEFAULT 'menunggu',
    -- Nilai: menunggu, disetujui, ditolak, dibatalkan, sedang_berjalan, selesai
    id_penyetuju            UUID REFERENCES pegawai(id),
    waktu_persetujuan       TIMESTAMPTZ,
    alasan_penolakan        TEXT,

    -- Pelacakan lokasi
    pelacakan_aktif         BOOLEAN NOT NULL DEFAULT false,

    dibuat_pada             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `log_lokasi_pegawai` — Log Lokasi Real-time (Pelacakan Dinas Luar)

```sql
CREATE TABLE log_lokasi_pegawai (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    id_pengajuan_dl     UUID REFERENCES pengajuan_dinas_luar(id),
    latitude            DECIMAL(10,7) NOT NULL,
    longitude           DECIMAL(10,7) NOT NULL,
    akurasi             DECIMAL(6,2),                    -- Akurasi GPS dalam meter
    dicatat_pada        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disarankan: Partisi per bulan atau pembersihan berkala (TTL cleanup)
```

---

#### 📌 `jenis_cuti` — Jenis Cuti

```sql
CREATE TABLE jenis_cuti (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama                VARCHAR(100) NOT NULL,
    kode                VARCHAR(30) UNIQUE NOT NULL,
    -- Kode: cuti_tahunan, cuti_melahirkan, cuti_sakit_ringan, cuti_sakit_sedang, cuti_sakit_berat
    maks_hari           INTEGER,                          -- NULL = tidak terbatas (sakit berat)
    min_hari            INTEGER NOT NULL DEFAULT 1,
    wajib_dokumen       BOOLEAN NOT NULL DEFAULT false,
    jenis_dokumen       JSONB DEFAULT '[]',               -- ["surat_dokter","surat_permohonan"]
    hari_sakit_min      INTEGER,                          -- Min hari sakit untuk kategori ini
    hari_sakit_maks     INTEGER,                          -- Maks hari sakit untuk kategori ini
    dibayar             BOOLEAN NOT NULL DEFAULT true,
    deskripsi           TEXT,
    aktif               BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Data awal (seed):
-- ('Cuti Tahunan', 'cuti_tahunan', 12, 1, false, '[]', NULL, NULL, true)
-- ('Cuti Melahirkan', 'cuti_melahirkan', 90, 1, true, '["surat_permohonan","surat_dokter"]', NULL, NULL, true)
-- ('Cuti Sakit (1-2 hari)', 'cuti_sakit_ringan', 2, 1, false, '[]', 1, 2, true)
-- ('Cuti Sakit (2-7 hari)', 'cuti_sakit_sedang', 7, 2, true, '["surat_dokter"]', 2, 7, true)
-- ('Cuti Sakit (>7 hari)', 'cuti_sakit_berat', NULL, 7, true, '["surat_dokter"]', 7, NULL, true)
```

---

#### 📌 `saldo_cuti` — Saldo Cuti per Pegawai per Tahun

```sql
CREATE TABLE saldo_cuti (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    id_jenis_cuti       UUID NOT NULL REFERENCES jenis_cuti(id),
    tahun               INTEGER NOT NULL,
    total_hari          INTEGER NOT NULL DEFAULT 0,
    hari_terpakai       INTEGER NOT NULL DEFAULT 0,
    sisa_hari           INTEGER GENERATED ALWAYS AS (total_hari - hari_terpakai) STORED,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(id_pegawai, id_jenis_cuti, tahun)
);
```

---

#### 📌 `pengajuan_cuti` — Pengajuan Cuti

```sql
CREATE TABLE pengajuan_cuti (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    id_jenis_cuti       UUID NOT NULL REFERENCES jenis_cuti(id),
    tanggal_mulai       DATE NOT NULL,
    tanggal_selesai     DATE NOT NULL,
    total_hari          INTEGER NOT NULL,
    alasan              TEXT NOT NULL,

    status              VARCHAR(20) NOT NULL DEFAULT 'menunggu',
    -- Nilai: menunggu, disetujui, ditolak, dibatalkan
    id_penyetuju        UUID REFERENCES pegawai(id),
    waktu_persetujuan   TIMESTAMPTZ,
    alasan_penolakan    TEXT,

    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `dokumen_cuti` — Dokumen Pendukung Cuti

```sql
CREATE TABLE dokumen_cuti (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengajuan_cuti   UUID NOT NULL REFERENCES pengajuan_cuti(id) ON DELETE CASCADE,
    jenis_dokumen       VARCHAR(50) NOT NULL,            -- surat_permohonan, surat_dokter, surat_rs
    url_file            VARCHAR(500) NOT NULL,
    nama_file           VARCHAR(255) NOT NULL,
    ukuran_file         INTEGER,                         -- dalam byte
    tipe_mime           VARCHAR(100),
    diunggah_pada       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `jenis_kegiatan_lhkp` — Master Jenis Kegiatan LHKP

> Diinput oleh **Pimpinan Unit Kerja** sebagai daftar jenis kegiatan yang tersedia di unitnya.
> Kemudian pimpinan **menugaskan** jenis kegiatan tertentu ke pegawai tertentu via tabel `penugasan_kegiatan_lhkp`.

```sql
CREATE TABLE jenis_kegiatan_lhkp (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_unit_kerja       UUID NOT NULL REFERENCES unit_kerja(id),
    nama_kegiatan       VARCHAR(200) NOT NULL,            -- Misal: "Mengajar", "Piket", "Rapat Dinas"
    keterangan          TEXT,                              -- Deskripsi opsional
    aktif               BOOLEAN NOT NULL DEFAULT TRUE,    -- Bisa dinonaktifkan tanpa dihapus
    dibuat_oleh         UUID NOT NULL REFERENCES pegawai(id), -- Pimpinan yang membuat
    urutan              INTEGER DEFAULT 0,                 -- Urutan tampil

    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(id_unit_kerja, nama_kegiatan)
);
```

---

#### 📌 `penugasan_kegiatan_lhkp` — Penugasan Jenis Kegiatan ke Pegawai

> Pimpinan **menentukan** jenis kegiatan mana yang ditugaskan ke pegawai mana.
> Satu pegawai bisa punya banyak jenis kegiatan, dan satu jenis kegiatan bisa ditugaskan ke banyak pegawai.

```sql
CREATE TABLE penugasan_kegiatan_lhkp (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_jenis_kegiatan     UUID NOT NULL REFERENCES jenis_kegiatan_lhkp(id) ON DELETE CASCADE,
    id_pegawai            UUID NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    ditugaskan_oleh       UUID NOT NULL REFERENCES pegawai(id), -- Pimpinan yang menugaskan
    aktif                 BOOLEAN NOT NULL DEFAULT TRUE,

    dibuat_pada           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(id_jenis_kegiatan, id_pegawai)                 -- Tidak boleh duplikat
);
```

#### 📌 `laporan_harian` — Laporan Kinerja Harian (Header)

> Satu laporan per pegawai per hari. Berisi **banyak detail kegiatan** di tabel `detail_laporan_harian`.

```sql
CREATE TABLE laporan_harian (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    tanggal_laporan     DATE NOT NULL,

    status              VARCHAR(20) NOT NULL DEFAULT 'menunggu',
    -- Nilai: menunggu, disetujui, direvisi, ditolak
    id_peninjau         UUID REFERENCES pegawai(id),      -- Pimpinan yang mereview
    waktu_review        TIMESTAMPTZ,
    catatan_review      TEXT,                              -- Catatan pimpinan saat setujui/revisi/tolak

    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(id_pegawai, tanggal_laporan)
);
```

---

#### 📌 `detail_laporan_harian` — Detail Kegiatan per Laporan Harian

> Satu laporan harian bisa berisi **banyak kegiatan**.
> Setiap kegiatan merujuk ke `jenis_kegiatan_lhkp` yang sudah ditentukan pimpinan.

```sql
CREATE TABLE detail_laporan_harian (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_laporan_harian     UUID NOT NULL REFERENCES laporan_harian(id) ON DELETE CASCADE,
    id_jenis_kegiatan     UUID NOT NULL REFERENCES jenis_kegiatan_lhkp(id),

    jam_mulai             TIME NOT NULL,                   -- Jam mulai kegiatan (misal: 07:30)
    jam_selesai           TIME NOT NULL,                   -- Jam selesai kegiatan (misal: 09:30)
    uraian                TEXT NOT NULL,                    -- Deskripsi detail kegiatan yang dilakukan
    hasil                 TEXT,                              -- Hasil/output kegiatan (opsional)
    urutan                INTEGER DEFAULT 0,                -- Urutan kegiatan dalam sehari

    dibuat_pada           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK(jam_selesai > jam_mulai)                         -- Jam selesai harus setelah jam mulai
);
```

---

#### 📌 `review_rekan` — Review Kinerja Teman Se-Unit Kerja

```sql
CREATE TABLE review_rekan (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_penilai          UUID NOT NULL REFERENCES pegawai(id),   -- Yang mereview
    id_dinilai          UUID NOT NULL REFERENCES pegawai(id),   -- Yang direview
    bulan_periode       INTEGER NOT NULL,                        -- 1-12
    tahun_periode       INTEGER NOT NULL,
    nilai               INTEGER NOT NULL CHECK (nilai BETWEEN 1 AND 5),
    kelebihan           TEXT,
    saran_perbaikan     TEXT,
    komentar            TEXT,

    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(id_penilai, id_dinilai, bulan_periode, tahun_periode),
    CHECK(id_penilai != id_dinilai)                             -- Tidak bisa review diri sendiri
);
```

---

#### 📌 `pengajuan_biodata` — Pengajuan Perubahan Biodata

```sql
CREATE TABLE pengajuan_biodata (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    perubahan           JSONB NOT NULL,                   -- {"nama_lengkap": "...","telepon": "..."}
    status              VARCHAR(30) NOT NULL DEFAULT 'menunggu_pimpinan',
    -- Nilai: menunggu_pimpinan, menunggu_upt, menunggu_dinas, disetujui, ditolak

    -- Jejak Persetujuan Berjenjang
    id_pimpinan_penyetuju UUID REFERENCES pengguna(id),   -- Pimpinan tingkat sekolah
    waktu_review_pimpinan TIMESTAMPTZ,
    id_upt_penyetuju      UUID REFERENCES pengguna(id),   -- Jika sekolah ini di bawah UPT
    waktu_review_upt      TIMESTAMPTZ,
    id_dinas_penyetuju    UUID REFERENCES pengguna(id),   -- Persetujuan mutlak/terakhir
    waktu_review_dinas    TIMESTAMPTZ,

    catatan_penolakan   TEXT,                             -- Diisi jika ada yang menolak
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `dokumen_pegawai` — Dokumen Pegawai (KTP, Ijazah, dst)

```sql
CREATE TABLE dokumen_pegawai (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pegawai          UUID NOT NULL REFERENCES pegawai(id),
    nama                VARCHAR(255) NOT NULL,
    jenis               VARCHAR(50) NOT NULL,             -- ktp, kk, ijazah, sk, sertifikat, lainnya
    url_file            VARCHAR(500) NOT NULL,
    ukuran_file         INTEGER,                         -- dalam byte
    tipe_mime           VARCHAR(100),
    tanggal_kedaluwarsa DATE,
    diunggah_oleh       UUID REFERENCES pengguna(id),
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `pengumuman` — Pengumuman

```sql
CREATE TABLE pengumuman (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul               VARCHAR(255) NOT NULL,
    isi                 TEXT NOT NULL,
    jenis               VARCHAR(20) NOT NULL DEFAULT 'info',
    -- Nilai: info, peringatan, mendesak, kenaikan_gaji, teguran
    lingkup_target      VARCHAR(20) NOT NULL DEFAULT 'semua',
    -- Nilai: semua, dinas, unit
    id_unit_target      JSONB DEFAULT '[]',               -- Jika lingkup = unit → [id_unit_1, id_unit_2]
    disematkan          BOOLEAN NOT NULL DEFAULT false,
    url_lampiran        VARCHAR(500),
    diterbitkan_pada    TIMESTAMPTZ,
    kedaluwarsa_pada    TIMESTAMPTZ,
    dibuat_oleh         UUID NOT NULL REFERENCES pengguna(id),
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `notifikasi` — Notifikasi In-App + Push

```sql
CREATE TABLE notifikasi (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengguna         UUID NOT NULL REFERENCES pengguna(id),
    judul               VARCHAR(255) NOT NULL,
    pesan               TEXT NOT NULL,
    jenis               VARCHAR(30) NOT NULL,
    -- Nilai: cuti_disetujui, cuti_ditolak, cuti_dibatalkan,
    --        dl_disetujui, dl_ditolak, dl_dibatalkan,
    --        kinerja_disetujui, kinerja_direvisi, kinerja_ditolak,
    --        biodata_disetujui, pengumuman, kenaikan_gaji, peringatan,
    --        review_rekan_diterima
    id_referensi        UUID,
    jenis_referensi     VARCHAR(50),                      -- pengajuan_cuti, pengajuan_dinas_luar, laporan_harian, dll
    sudah_dibaca        BOOLEAN NOT NULL DEFAULT false,
    dibaca_pada         TIMESTAMPTZ,
    push_terkirim       BOOLEAN NOT NULL DEFAULT false,   -- Sudah dikirim via FCM?
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `skema_dinas_luar` — Konfigurasi Skema Dinas Luar per Unit Kerja

```sql
CREATE TABLE skema_dinas_luar (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_unit_kerja       UUID NOT NULL REFERENCES unit_kerja(id),
    kode_skema          VARCHAR(30) NOT NULL,
    -- Nilai: dl_penuh, kantor_dl_pulang, dl_kantor
    aktif               BOOLEAN NOT NULL DEFAULT true,
    label               VARCHAR(100),                     -- Nama tampilan kustom
    titik_titik         JSONB NOT NULL,
    -- Contoh: [
    --   {"urutan":1,"jenis":"berangkat_dl","label":"Berangkat","aturan_lokasi":"dimana_saja"},
    --   {"urutan":2,"jenis":"sampai_dl","label":"Sampai Lokasi DL","aturan_lokasi":"tujuan_dl"},
    --   {"urutan":3,"jenis":"pulang_dl","label":"Pulang","aturan_lokasi":"dimana_saja"}
    -- ]
    -- Nilai aturan_lokasi: "kantor" (harus di kantor), "tujuan_dl" (harus di tujuan DL), "dimana_saja"
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(id_unit_kerja, kode_skema)
);
```

---

#### 📌 `laporan_ke_dinas` — Laporan ke Dinas Pendidikan

```sql
CREATE TABLE laporan_ke_dinas (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_unit_kerja       UUID NOT NULL REFERENCES unit_kerja(id),
    jenis_laporan       VARCHAR(50) NOT NULL,             -- absensi_bulanan, kinerja, disiplin, kustom
    bulan_periode       INTEGER,
    tahun_periode       INTEGER,
    judul               VARCHAR(255) NOT NULL,
    isi                 TEXT,
    url_file            VARCHAR(500),                     -- PDF/Excel yang dihasilkan
    dikirim_oleh        UUID NOT NULL REFERENCES pengguna(id),
    dikirim_pada        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `pengaturan` — Konfigurasi Sistem

```sql
CREATE TABLE pengaturan (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lingkup             VARCHAR(20) NOT NULL DEFAULT 'global',
    -- Nilai: global, dinas, unit
    id_lingkup          UUID,                             -- NULL untuk global, id_dinas atau id_unit_kerja
    kunci               VARCHAR(100) NOT NULL,
    nilai               JSONB NOT NULL,
    deskripsi           TEXT,
    diperbarui_oleh     UUID REFERENCES pengguna(id),
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(lingkup, id_lingkup, kunci)
);
```

---

#### 📌 `log_audit` — Log Audit

```sql
CREATE TABLE log_audit (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pengguna         UUID REFERENCES pengguna(id),
    aksi                VARCHAR(50) NOT NULL,             -- buat, ubah, hapus, login, logout
    jenis_entitas       VARCHAR(50) NOT NULL,             -- pegawai, pengajuan_cuti, laporan_harian, dll
    id_entitas          UUID,
    data_lama           JSONB,
    data_baru           JSONB,
    alamat_ip           VARCHAR(45),
    user_agent          TEXT,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### 📌 `riwayat_sinkronisasi_dapodik` — Log Riwayat Sinkronisasi Dapodik

> Mencatat setiap sesi sinkronisasi yang dilakukan oleh Admin Unit. Digunakan untuk audit, debug, dan pratinjau perbedaan sebelum data diterapkan.

```sql
CREATE TABLE riwayat_sinkronisasi_dapodik (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_unit_kerja           UUID NOT NULL REFERENCES unit_kerja(id),
    id_admin                UUID NOT NULL REFERENCES pengguna(id),      -- Admin yang menjalankan sync

    -- Status Proses
    status                  VARCHAR(30) NOT NULL DEFAULT 'berjalan',
    -- Nilai: berjalan, selesai, gagal, dibatalkan
    metode                  VARCHAR(20) NOT NULL DEFAULT 'otomatis',
    -- Nilai: otomatis (SSO scraper), manual (upload file)

    -- Kredensial SSO (Terenkripsi di level aplikasi, BUKAN plaintext)
    username_dapodik        VARCHAR(255),                               -- Disimpan terenkripsi (AES-256)
    -- (password tidak disimpan, hanya digunakan saat sesi berlangsung)

    -- Statistik Hasil
    total_ptk_dapodik       INTEGER DEFAULT 0,                          -- Total PTK yang ditarik dari Dapodik
    total_baru              INTEGER DEFAULT 0,                          -- Pegawai baru yang ditambahkan
    total_diperbarui        INTEGER DEFAULT 0,                          -- Pegawai yang datanya diperbarui
    total_konflik           INTEGER DEFAULT 0,                          -- Data yang di-skip karena konflik
    total_gagal             INTEGER DEFAULT 0,                          -- Data yang gagal diproses

    -- Detail Hasil (JSON)
    ringkasan               JSONB,
    -- Contoh: {"baru":[{ptk_id,nama}], "diperbarui":[...], "konflik":[{ptk_id,alasan}]}
    pesan_error             TEXT,                                       -- Diisi jika status = gagal

    dimulai_pada            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    selesai_pada            TIMESTAMPTZ
);
```

---

#### 📌 `kredensial_dapodik` — Kredensial SSO Dapodik per Unit Kerja

> Menyimpan kredensial akun Dapodik Unit Kerja yang digunakan oleh scraper SSO. Diinput satu kali oleh Admin Unit, dan dienkripsi sebelum disimpan ke database.

```sql
CREATE TABLE kredensial_dapodik (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_unit_kerja       UUID UNIQUE NOT NULL REFERENCES unit_kerja(id) ON DELETE CASCADE,
    username            VARCHAR(255) NOT NULL,                          -- Username akun Dapodik
    password_terenkripsi VARCHAR(500) NOT NULL,                         -- Password dienkripsi AES-256
    terakhir_diverifikasi TIMESTAMPTZ,                                  -- Kapan terakhir login berhasil
    aktif               BOOLEAN NOT NULL DEFAULT true,
    dibuat_pada         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diperbarui_pada     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 5.3 Strategi Indexing

```sql
-- Pegawai & Skema
CREATE INDEX idx_pegawai_unit_kerja ON pegawai(id_unit_kerja);
CREATE INDEX idx_pegawai_skema ON pegawai(id_skema_jam_kerja);
CREATE INDEX idx_skema_aktif ON skema_jam_kerja(aktif);
CREATE INDEX idx_pegawai_nip ON pegawai(nip);
CREATE INDEX idx_pegawai_nik ON pegawai(nik);
CREATE INDEX idx_pegawai_aktif ON pegawai(aktif);
CREATE INDEX idx_pegawai_status_biodata ON pegawai(status_biodata);

-- Absensi
CREATE INDEX idx_absensi_pegawai_tanggal ON absensi(id_pegawai, tanggal);
CREATE INDEX idx_absensi_tanggal ON absensi(tanggal);
CREATE INDEX idx_absensi_status ON absensi(status);
CREATE INDEX idx_titik_absensi_absensi ON titik_absensi(id_absensi);

-- Dinas Luar
CREATE INDEX idx_pengajuan_dl_pegawai ON pengajuan_dinas_luar(id_pegawai);
CREATE INDEX idx_pengajuan_dl_tanggal ON pengajuan_dinas_luar(tanggal);
CREATE INDEX idx_pengajuan_dl_status ON pengajuan_dinas_luar(status);
CREATE INDEX idx_log_lokasi_pegawai ON log_lokasi_pegawai(id_pegawai);
CREATE INDEX idx_log_lokasi_dl ON log_lokasi_pegawai(id_pengajuan_dl);
CREATE INDEX idx_log_lokasi_waktu ON log_lokasi_pegawai(dicatat_pada);

-- Cuti
CREATE INDEX idx_pengajuan_cuti_pegawai ON pengajuan_cuti(id_pegawai);
CREATE INDEX idx_pengajuan_cuti_status ON pengajuan_cuti(status);
CREATE INDEX idx_pengajuan_cuti_tanggal ON pengajuan_cuti(tanggal_mulai, tanggal_selesai);
CREATE INDEX idx_saldo_cuti_pegawai_tahun ON saldo_cuti(id_pegawai, tahun);

-- Laporan Harian & LHKP
CREATE INDEX idx_laporan_harian_pegawai_tanggal ON laporan_harian(id_pegawai, tanggal_laporan);
CREATE INDEX idx_laporan_harian_status ON laporan_harian(status);
CREATE INDEX idx_detail_laporan_harian ON detail_laporan_harian(id_laporan_harian);
CREATE INDEX idx_detail_laporan_kegiatan ON detail_laporan_harian(id_jenis_kegiatan);
CREATE INDEX idx_jenis_kegiatan_unit ON jenis_kegiatan_lhkp(id_unit_kerja, aktif);
CREATE INDEX idx_penugasan_kegiatan_pegawai ON penugasan_kegiatan_lhkp(id_pegawai, aktif);
CREATE INDEX idx_penugasan_kegiatan_jenis ON penugasan_kegiatan_lhkp(id_jenis_kegiatan);

-- Review Rekan
CREATE INDEX idx_review_rekan_dinilai ON review_rekan(id_dinilai);
CREATE INDEX idx_review_rekan_periode ON review_rekan(bulan_periode, tahun_periode);

-- Notifikasi
CREATE INDEX idx_notifikasi_pengguna_baca ON notifikasi(id_pengguna, sudah_dibaca);
CREATE INDEX idx_notifikasi_dibuat ON notifikasi(dibuat_pada);

-- Log Audit
CREATE INDEX idx_log_audit_entitas ON log_audit(jenis_entitas, id_entitas);
CREATE INDEX idx_log_audit_dibuat ON log_audit(dibuat_pada);

-- Unit Kerja
CREATE INDEX idx_unit_kerja_dinas ON unit_kerja(id_dinas);
```

---

### 5.3 Strategi Sinkronisasi Multi-Sumber (MDM) - Hybrid JSONB + Crosswalk Mapping

Untuk mengatasi tantangan Master Data Management (MDM) di mana data pegawai berasal dari 3 sumber berbeda (SIASN, SIMPEG, Dapodik), MAHESA menggunakan arsitektur **Hybrid Staging + Crosswalk Mapping**. Pendekatan ini menjaga kecepatan query operasional sekaligus mempertahankan integritas data (High Fidelity) dari tiap sumber eksternal.

#### 5.3.1 Prinsip *Single Source of Truth* (SSOT) per Domain
Setiap sistem eksternal diperlakukan sebagai "Master" untuk domain data tertentu:
* **SIASN / SIMPEG:** Master untuk Data Identitas Hukum & Karir ASN (NIP, Pangkat/Golongan, SK, Jabatan Struktural).
* **DAPODIK:** Master untuk Konteks Pendidikan & Honorer (NUPTK, Jenis Guru, Tugas Tambahan, Tempat Tugas).
* **MAHESA:** Master untuk Transaksional (Absensi, Titik Kordinat GPS, Cuti, Laporan Kinerja).

#### 5.3.2 Strategi Pengikatan Data (*Anchor ID*)
Ketika menyinkronkan data antar 3 sistem, pencocokan (matching) dilakukan dengan urutan:
1. **Anchor Utama: NIK (Nomor Induk Kependudukan).** Unik untuk seluruh warga negara (PNS maupun Non-ASN).
2. **Anchor Kedua: NIP (Nomor Induk Pegawai).** Sebagai *fallback* apabila NIK kosong/berbeda (Hanya untuk ASN).

#### 5.3.3 Pemisahan Data *Raw* (Staging) dan Data Matang (Unified)
Alih-alih membuat puluhan tabel referensi khusus untuk masing-masing sumber (seperti `jabatan_dapodik` atau `agama_siasn`) yang akan menyebabkan *Schema Bloat* dan melambatkan sistem, kita menggunakan pendekatan:

1. **Staging JSONB pada Tabel `pegawai`**:
   Data *response payload* mentah dari API SIASN, SIMPEG, atau Dapodik disimpan utuh ke dalam kolom bertipe `JSONB` (`raw_data_siasn`, `raw_data_simpeg`, `raw_data_dapodik`). Ini berguna untuk audit dan menjaga kemurnian data (kalau besok ada atribut baru dari BKN, kita tidak perlu merombak tabel).

2. **Tabel Operasional Terpadu**:
   MAHESA tetap beroperasi menggunakan satu set tabel `master_jabatan`, `master_agama`, dan `pegawai`. Ini memastikan performa query absensi harian tetap super cepat tanpa *spaghetti joins*.

3. **Tabel Crosswalk Mapping Referensi**:
   Tabel jembatan digunakan saat ETL (Extract, Transform, Load) untuk menerjemahkan kode ID dari luar (misal: "ISL" dari SIASN) menjadi ID Referensi internal MAHESA.

```sql
-- Tabel Crosswalk (Penerjemah Kode Referensi Eksternal)
CREATE TABLE mapping_referensi_eksternal (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kategori            VARCHAR(50) NOT NULL,             -- 'agama', 'jabatan', 'pangkat', dsb.
    sumber              VARCHAR(20) NOT NULL,             -- 'siasn', 'simpeg', 'dapodik'
    kode_eksternal      VARCHAR(100) NOT NULL,            -- Contoh: 'ISL', '1'
    id_referensi_mahesa UUID NOT NULL,                    -- FK ke master_agama / master_jabatan
    UNIQUE(kategori, sumber, kode_eksternal)
);
```

#### 5.3.4 Alur Kerja Sinkronisasi (ETL Internal)
1. **Extract**: Malam hari (jam 02:00), *Cron Job* / Worker MAHESA menembak API SIASN/SIMPEG. Sementara itu, Operator Sekolah menembak Dapodik lewat *MAHESA Sync Tool*.
2. **Transform**: Sistem membaca `payload` JSON mentah. Jika menjumpai data referensi (misal kode jabatan), sistem akan melihat tabel `mapping_referensi_eksternal` untuk mencari terjemahan ID-nya di MAHESA.
3. **Load**: Data yang sudah *matang* (terjemahan) kemudian di-*update* (upsert) secara rapi ke *field* terstruktur di tabel `pegawai`. Jika terjadi konflik (pegawai melakukan perubahan mandiri via Aplikasi dan telah di-*approve*), maka data manual pegawai (Manual Override) akan menang mengalahkan *auto-sync*.

---

## 6. Fitur Detail per Platform & Role

### 6.1 📱 Mobile App — Pegawai

| No | Fitur | Deskripsi Detail |
|----|-------|-----------------|
| 1 | **Absensi Kantor** | Clock in (jam masuk) & clock out (jam pulang) dengan GPS validasi radius unit kerja + foto selfie wajib. Otomatis deteksi keterlambatan. |
| 2 | **Absensi Dinas Luar** | Sesuai skema yang di-set admin/pimpinan. Multi-checkpoint (berangkat, sampai tujuan, pulang, dst). Setiap checkpoint: GPS + selfie. |
| 3 | **Ajukan Cuti Tahunan** | Form pengajuan → approval atasan → notifikasi hasil. |
| 4 | **Ajukan Cuti Melahirkan** | Form + upload surat permohonan + surat dokter/RS → approval atasan → notifikasi. |
| 5 | **Ajukan Cuti Sakit** | Auto-detect kategori berdasar durasi: (1-2 hari tanpa dokumen), (2-7 hari + surat dokter), (>7 hari + surat dokter) → approval → notifikasi. |
| 6 | **Laporan Kinerja Harian** | Submit laporan harian (isi kegiatan) → approval atasan → notifikasi hasil (disetujui/direvisi/ditolak). |
| 7 | **Melengkapi Biodata** | Form update profil lengkap → submit ke admin → notifikasi approval. |
| 8 | **Terima Notifikasi** | Push notification: pengumuman, kenaikan gaji berkala, peringatan, hasil approval, **serta pengingat otomatis (auto-reminder) absen pulang dan tiap checkpoint DL agar tidak lupa**. |
| 9 | **Lihat Struktur Organisasi** | View hierarki: Pimpinan → Dinas → Unit Kerja → Pegawai. |
| 10 | **Lihat Rekap Absensi Pribadi** | Calendar + list view absensi bulanan. Statistik hadir/terlambat/absen. |
| 11 | **Lihat Laporan Kinerja** | Tab: Disetujui, Direvisi, Ditolak. |
| 12 | **Lihat Daftar Pegawai Se-Unit** | Daftar pegawai satu unit kerja, lihat profil singkat. |
| 13 | **Ganti Password** | Form change password. |
| 14 | **Peer Review Kinerja** | Review kinerja teman satu unit kerja: rating (1-5) + komentar. |

### 6.2 📱 Mobile App — Pimpinan Unit Kerja

| No | Fitur | Deskripsi Detail |
|----|-------|-----------------|
| 1 | **Lihat Kehadiran Bawahan** | Real-time daftar siapa yang sudah absen hari ini, siapa belum. |
| 2 | **Input Absensi Bawahan (Manual)** | Memasukkan data kehadiran bawahan yang berhalangan menggunakan HP secara manual tanpa GPS/selfie target. |
| 3 | **Approval Cuti** | Setujui / Tolak / Batalkan permohonan cuti bawahan. |
| 4 | **Approval Laporan Kinerja Harian** | Setujui / Revisi / Tolak laporan kinerja harian bawahan. |
| 5 | **Approval Dinas Luar** | Setujui / Tolak / Batalkan pengajuan dinas luar bawahan. |
| 5 | **Rekap Absensi Bawahan** | Summary kehadiran per pegawai, per bulan. Filter & search. |
| 6 | **Rekap Dinas Luar** | Daftar semua DL, status, histori. |
| 7 | **Rekap Cuti Bawahan** | Saldo cuti, histori pengajuan per pegawai. |
| 8 | **Rekap Kinerja Harian** | Statistik laporan: berapa disetujui/direvisi/ditolak per pegawai. |
| 9 | **Pelacakan Dinas Luar** | Peta real-time lokasi pegawai yang sedang DL. Update periodik. |
| 10 | **Buat Laporan ke Dinas** | Generate & submit laporan tentang pegawai ke Dinas Pendidikan. |

### 6.3 🖥️ Web Dashboard — Admin Dinas

| No | Fitur | Deskripsi Detail |
|----|-------|-----------------|
| 1 | **Pelacakan DL** | Peta interaktif semua pegawai seluruh unit yang sedang Dinas Luar. |
| 2 | **Persetujuan Biodata** | Tinjau & setujui/tolak perubahan biodata pegawai. |
| 3 | **Buat Pengumuman** | CRUD pengumuman. Target: semua / per unit kerja. Jenis: info, peringatan, kenaikan gaji, mendesak. |
| 4 | **Pemantauan Pegawai Real-time** | Dasbor: siapa sedang cuti, DL, sakit, bekerja — per unit kerja. |
| 5 | **Rekap Absensi** | DataTable + grafik: rekap kehadiran seluruh unit. Filter per unit/pegawai/bulan. Ekspor Excel. |
| 6 | **Rekap Cuti** | Semua pengajuan cuti, saldo cuti per pegawai, statistik. |
| 7 | **Rekap Kinerja Harian** | Statistik laporan kinerja per unit, per pegawai. |
| 8 | **Rekap Dinas Luar** | Semua data DL, filter per unit/pegawai/bulan. |
| 9 | **Pegawai Bermasalah** | Sorot pegawai yang sering terlambat, jarang masuk. Dapat diurutkan & difilter. |
| 10 | **Pengaturan Audio Notifikasi** | Konfigurasi nada dering/suara kustom secara global untuk push notification (contoh: suara pengingat absen berbeda dengan notifikasi pengumuman biasa). Terekam dalam opsi pengaturan sistem. |

### 6.4 🖥️ Web Dashboard — Admin Unit Kerja

| No | Fitur | Deskripsi Detail |
|----|-------|-----------------|
| 1 | **Sinkronisasi Dapodik** | Impor/sinkronisasi data pegawai dari sistem Dapodik. Pencocokan via NUPTK/NIP. |
| 2 | **Data Pegawai Unit** | CRUD pegawai unit kerja. Lihat detail profil. |
| 3 | **Pelacakan DL** | Peta lokasi pegawai unit yang sedang DL. |
| 4 | **Persetujuan Biodata** | Tinjau & setujui perubahan biodata pegawai unit. |
| 5 | **Pemantauan Real-time** | Dasbor unit: siapa cuti, DL, sakit, bekerja. |
| 6 | **Rekap Absensi** | Rekap kehadiran pegawai unit. Kalender + DataTable. Ekspor. |
| 7 | **Rekap Cuti** | Pengajuan & saldo cuti pegawai unit. |
| 8 | **Rekap Kinerja Harian** | Laporan kinerja per pegawai. |
| 9 | **Rekap Dinas Luar** | Data DL unit kerja. |
| 10 | **Laporan ke Dinas** | Buat & kirim laporan pegawai ke Dinas Pendidikan. |

---

## 7. Alur Bisnis (Business Flow)

### 7.1 Alur Absensi Kantor

```
┌─────────┐     ┌──────────────────┐     ┌───────────────────┐
│ Pegawai  │────▶│ Buka App → Tab   │────▶│ Klik "Masuk Kerja"│
│ tiba di  │     │ Absensi          │     │                   │
│ kantor   │     └──────────────────┘     └────────┬──────────┘
└─────────┘                                        │
                                                   ▼
                                        ┌──────────────────────┐
                                        │ Ambil GPS Location   │
                                        │ + Validasi Radius    │
                                        │ + Ambil Foto Selfie  │
                                        └────────┬─────────────┘
                                                 │
                                    ┌────────────┴────────────┐
                                    │ GPS dalam radius?        │
                                    ├──── Ya ──────────────────┤
                                    │         │                │
                                    │         ▼                │
                                    │  ┌─────────────────┐     │
                                    │  │ Simpan Titik     │     │
                                    │  │ "jam_masuk" +    │     │
                                    │  │ Cek Keterlambatan│     │
                                    │  └─────────────────┘     │
                                    │                          │
                                    ├──── Tidak ───────────────┤
                                    │         │                │
                                    │         ▼                │
                                    │  ┌─────────────────────┐ │
                                    │  │ Tolak, Tampilkan     │ │
                                    │  │ "Di luar jangkauan"  │ │
                                    │  └─────────────────────┘ │
                                    └──────────────────────────┘

--- Sore hari ---

                                                   ┌───────────────────────────────────┐
                                                   │ Push Notif (Auto-Reminder)        │
                                                   │ "Waktunya absen pulang!"          │
                                                   └────────┬──────────────────────────┘
                                                            ▼
┌──────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│ Klik "Pulang"    │────▶│ GPS + Selfie      │────▶│ Simpan Titik      │
│                  │     │ + Validasi Radius  │     │ "jam_pulang"      │
└──────────────────┘     └───────────────────┘     │ + Hitung jam kerja│
                                                   └───────────────────┘
```

### 7.2 Alur Dinas Luar (3 Skema)

#### Skema 1: DL Penuh (Dinas Luar Penuh)
```
[Berangkat dari mana saja]  →  [Sampai Lokasi DL]  →  [Pulang dari mana saja]
     GPS: dimana saja            GPS: radius DL          GPS: dimana saja
     Selfie: ✅                  Selfie: ✅              Selfie: ✅
     ✨ Auto Remind: Berangkat   ✨ Auto Remind: Sampai  ✨ Auto Remind: Pulang
```

#### Skema 2: Masuk Kerja → Dinas Luar → Pulang
```
[Masuk Kerja di Kantor]  →  [Sampai Lokasi DL]  →  [Pulang dari mana saja]
     GPS: radius kantor        GPS: radius DL         GPS: dimana saja
     Selfie: ✅               Selfie: ✅             Selfie: ✅
     ✨ Auto Remind: Masuk       ✨ Auto Remind: Sampai ✨ Auto Remind: Pulang
```

#### Skema 3: Dinas Luar → Masuk Kerja
```
[Berangkat mana saja]  →  [Sampai Lokasi DL]  →  [Sampai Kantor]  →  [Pulang Kantor]
     GPS: dimana saja        GPS: radius DL         GPS: radius kantor   GPS: radius kantor
     Selfie: ✅             Selfie: ✅             Selfie: ✅           Selfie: ✅
     ✨ Remind: Berangkat    ✨ Remind: Sampai      ✨ Remind: Masuk     ✨ Remind: Pulang
```

#### Alur Pengajuan & Persetujuan DL
```
Pegawai ajukan DL              Pimpinan review
    │                              │
    ▼                              ▼
┌────────────┐    notif     ┌──────────────┐
│ Submit     │─────────────▶│ Lihat detail │
│ Form DL    │              │ pengajuan    │
│ (tujuan,   │              └──────┬───────┘
│  tanggal,  │                     │
│  skema,    │           ┌─────────┼─────────┐
│  tujuan)   │           │         │         │
└────────────┘           ▼         ▼         ▼
                     Setujui    Tolak    Batalkan
                        │         │         │
                        ▼         ▼         ▼
                    Notif ke   Notif ke  Notif ke
                    pegawai    pegawai   pegawai
                        │
                        ▼
                    Hari H: Pelacakan aktif
                    Pegawai absen dengan skema DL
```

### 7.3 Alur Cuti

```
┌────────────────────────────────────────────────────────────────────┐
│                     ALUR PENGAJUAN CUTI                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Pegawai                    Pimpinan                               │
│     │                          │                                   │
│     ▼                          │                                   │
│  ┌──────────────────┐          │                                   │
│  │ Pilih jenis cuti │          │                                   │
│  │ - Tahunan        │          │                                   │
│  │ - Melahirkan     │          │                                   │
│  │ - Sakit          │          │                                   │
│  └────────┬─────────┘          │                                   │
│           │                    │                                   │
│           ▼                    │                                   │
│  ┌──────────────────┐          │                                   │
│  │ Isi formulir:    │          │                                   │
│  │ - Tanggal mulai  │          │                                   │
│  │ - Tanggal selesai│          │                                   │
│  │ - Alasan         │          │                                   │
│  │ - Unggah dokumen │◄── Jika jenis cuti memerlukan dokumen       │
│  │   (kondisional)  │    - Melahirkan: surat permohonan + dokter  │
│  └────────┬─────────┘    - Sakit 2-7 hari: surat dokter           │
│           │              - Sakit >7 hari: surat dokter             │
│           ▼                    │                                   │
│  ┌──────────────────┐          │                                   │
│  │ Cek saldo cuti   │          │                                   │
│  │ (jika tahunan)   │          │                                   │
│  └────────┬─────────┘          │                                   │
│           │                    │                                   │
│           ▼                    ▼                                   │
│  ┌──────────────┐    ┌──────────────────┐                          │
│  │ Kirim        │───▶│ Notif masuk      │                          │
│  │ status:      │    │ ke pimpinan      │                          │
│  │ "menunggu"   │    └────────┬─────────┘                          │
│  └──────────────┘             │                                    │
│                      ┌────────┼────────┐                           │
│                      ▼        ▼        ▼                           │
│                  Setujui   Tolak   Batalkan                        │
│                      │        │        │                           │
│                      ▼        ▼        ▼                           │
│              ┌──────────────────────────────┐                      │
│              │  Notifikasi ke pegawai:      │                      │
│              │  - "Cuti Disetujui ✅"       │                      │
│              │  - "Cuti Ditolak ❌"         │                      │
│              │  - "Cuti Dibatalkan ⚠️"      │                      │
│              └──────────┬───────────────────┘                      │
│                         │ (jika disetujui)                         │
│                         ▼                                          │
│              ┌──────────────────────┐                              │
│              │ Perbarui saldo cuti  │                              │
│              │ Perbarui status      │                              │
│              │ absensi              │                              │
│              └──────────────────────┘                              │
└────────────────────────────────────────────────────────────────────┘
```

### 7.4 Alur Laporan Kinerja Harian

```
Pegawai                               Pimpinan
   │                                     │
   ▼                                     │
┌───────────────────────┐              │
│ Isi laporan:          │              │
│ - Tanggal             │              │
│ - Pilih jenis kegiatan│◄── Hanya kegiatan yang ditugaskan
│   (dari LHKP)         │    ke pegawai oleh pimpinan
│ - Jam mulai / selesai │              │
│ - Uraian kegiatan     │              │
│ - (bisa tambah banyak)│              │
└─────────┬─────────────┘              │
          │                              │
          ▼                              ▼
┌───────────────┐    notif     ┌──────────────────┐
│ Kirim         │─────────────▶│ Tinjau laporan   │
│ status:       │              └────────┬─────────┘
│ "menunggu"    │                       │
└───────────────┘             ┌─────────┼─────────┐
                              ▼         ▼         ▼
                          Setujui    Revisi     Tolak
                              │         │         │
                              ▼         ▼         ▼
                     Notif:         Notif:     Notif:
                     "Disetujui ✅"  "Perlu     "Ditolak ❌"
                                    Revisi 📝"
                                       │
                                       ▼
                                  Pegawai ubah
                                  & kirim ulang
```

### 7.5 Alur Biodata

```
Pegawai                                   Admin (Dinas/Unit)
   │                                          │
   ▼                                          │
┌─────────────────┐                           │
│ Isi/update form │                           │
│ biodata lengkap │                           │
└────────┬────────┘                           │
         │                                    │
         ▼                                    ▼
┌────────────────┐     notif      ┌──────────────────┐
│ Submit biodata │───────────────▶│ Review perubahan │
│ status:        │                │ biodata          │
│ "pending"      │                └────────┬─────────┘
└────────────────┘                         │
                                  ┌────────┴────────┐
                                  ▼                 ▼
                              Setujui            Tolak
                                  │                 │
                                  ▼                 ▼
                          ┌─────────────────┐  Notif:
                          │ Perbarui data   │  "Biodata ditolak"
                          │ pegawai + Notif:│  + alasan
                          │ "Biodata        │
                          │  disetujui ✅"  │
                          └─────────────────┘
```

---

## 8. Desain API (RESTful)

### 8.1 URL Dasar & Format Respons Standar

```
Produksi:    https://api.mahesa.id/v1
Pengembangan: http://localhost:3000/v1
```

```typescript
// Respons Berhasil
{
  "berhasil": true,
  "data": { ... },
  "meta": { "halaman": 1, "batas": 20, "total": 100, "totalHalaman": 5 }
}

// Respons Gagal
{
  "berhasil": false,
  "error": {
    "kode": "VALIDASI_GAGAL",
    "pesan": "Data tidak valid",
    "detail": [{ "kolom": "email", "pesan": "Format email salah" }]
  }
}
```

### 8.2 Daftar Endpoint Lengkap

#### 🔐 Otentikasi

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/otentikasi/masuk` | Login | Publik |
| `POST` | `/v1/otentikasi/keluar` | Logout (batalkan token) | Semua |
| `POST` | `/v1/otentikasi/perbarui-token` | Perbarui access token | Semua |
| `POST` | `/v1/otentikasi/lupa-kata-sandi` | Permintaan reset via email | Publik |
| `POST` | `/v1/otentikasi/reset-kata-sandi` | Reset kata sandi | Publik |
| `PUT` | `/v1/otentikasi/ganti-kata-sandi` | Ganti kata sandi | Semua |
| `GET` | `/v1/otentikasi/profil-saya` | Ambil data pengguna + profil pegawai | Semua |
| `PUT` | `/v1/otentikasi/token-fcm` | Update token FCM untuk push notif | Semua |

#### 🏢 Organisasi

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/dinas` | Ambil info dinas | Semua |
| `PUT` | `/v1/dinas` | Update info dinas | Admin Dinas |
| `GET` | `/v1/skema-jam-kerja` | Daftar skema kerja | Semua |
| `POST` | `/v1/skema-jam-kerja` | Buat skema kerja | Admin Dinas |
| `PUT` | `/v1/skema-jam-kerja/:id` | Update skema kerja | Admin Dinas |
| `GET` | `/v1/unit-kerja` | Daftar unit kerja | Semua |
| `GET` | `/v1/unit-kerja/:id` | Detail unit kerja | Semua |
| `POST` | `/v1/unit-kerja` | Tambah unit kerja | Admin Dinas |
| `PUT` | `/v1/unit-kerja/:id` | Update unit kerja | Admin Dinas |
| `DELETE` | `/v1/unit-kerja/:id` | Nonaktifkan unit kerja | Admin Dinas |
| `GET` | `/v1/unit-kerja/:id/pegawai` | Daftar pegawai di unit | Admin Unit+ |
| `GET` | `/v1/pohon-organisasi` | Hierarki Dinas → Unit → Pegawai | Semua |

#### 👤 Pegawai

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/pegawai` | Daftar pegawai (paginasi, filter) | Admin+ |
| `GET` | `/v1/pegawai/:id` | Detail pegawai | Admin+ / Sendiri |
| `POST` | `/v1/pegawai` | Tambah pegawai | Admin Unit+ |
| `PUT` | `/v1/pegawai/:id` | Update pegawai | Admin Unit+ |
| `DELETE` | `/v1/pegawai/:id` | Nonaktifkan pegawai | Admin Dinas |
| `PUT` | `/v1/pegawai/:id/foto` | Upload foto profil | Sendiri |
| `GET` | `/v1/pegawai/unit-saya` | Daftar pegawai se-unit kerja | Pegawai+ |
| `GET` | `/v1/pegawai/ekspor` | Ekspor Excel | Admin+ |
| `POST` | `/v1/pegawai/impor` | Impor Excel | Admin Unit |

#### 📝 Biodata

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/biodata/kirim` | Kirim perubahan biodata | Pegawai / Pimpinan |
| `GET` | `/v1/biodata/pengajuan` | Daftar pengajuan biodata | Admin+ / Pimpinan |
| `GET` | `/v1/biodata/pengajuan/:id` | Detail pengajuan | Semua Terkait |
| `PUT` | `/v1/biodata/pengajuan/:id/setujui` | Setujui biodata (berjenjang) | Pimpinan / Admin UPT / Admin Dinas |
| `PUT` | `/v1/biodata/pengajuan/:id/tolak` | Tolak biodata | Pimpinan / Admin UPT / Admin Dinas |

#### ⏰ Absensi

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/absensi/titik` | Submit titik absensi (jam_masuk, jam_pulang, dll) + GPS + selfie | Pegawai / Pimpinan |
| `POST` | `/v1/absensi/manual` | Input absensi bawahan secara manual (tanpa GPS/selfie) | Pimpinan / Admin Unit |
| `GET` | `/v1/absensi/hari-ini` | Status absensi hari ini | Pegawai / Pimpinan |
| `GET` | `/v1/absensi/saya` | Riwayat absensi sendiri (paginasi) | Pegawai / Pimpinan |
| `GET` | `/v1/absensi/saya/ringkasan` | Rekap absensi pribadi (per bulan) | Pegawai / Pimpinan |
| `GET` | `/v1/absensi` | Daftar absensi (semua, filter) | Admin+ / Pimpinan(unit) |
| `GET` | `/v1/absensi/ringkasan` | Rekap absensi (per unit/pegawai/bulan) | Admin+ / Pimpinan |
| `PUT` | `/v1/absensi/:id/koreksi` | Koreksi absensi | Admin Unit+ |
| `GET` | `/v1/absensi/ekspor` | Ekspor rekap absensi | Admin+ |
| `GET` | `/v1/absensi/terlambat-absen` | Pegawai sering terlambat/absen | Admin+ / Pimpinan |

#### 🚗 Dinas Luar

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/dinas-luar` | Ajukan dinas luar | Pegawai / Pimpinan |
| `GET` | `/v1/dinas-luar` | Daftar semua DL (filter) | Admin+ / Pimpinan |
| `GET` | `/v1/dinas-luar/saya` | DL saya | Pegawai / Pimpinan |
| `GET` | `/v1/dinas-luar/:id` | Detail DL | Pemilik / Pimpinan / Admin+ |
| `PUT` | `/v1/dinas-luar/:id/setujui` | Setujui DL | Pimpinan |
| `PUT` | `/v1/dinas-luar/:id/tolak` | Tolak DL | Pimpinan |
| `PUT` | `/v1/dinas-luar/:id/batalkan` | Batalkan DL | Pimpinan / Pemilik |
| `GET` | `/v1/dinas-luar/ringkasan` | Rekap DL | Admin+ / Pimpinan |
| `GET` | `/v1/dinas-luar/aktif` | DL yang sedang berlangsung (untuk pelacakan) | Admin+ / Pimpinan |
| `POST` | `/v1/dinas-luar/:id/lokasi` | Update lokasi real-time | Pegawai (saat DL) |
| `GET` | `/v1/dinas-luar/:id/pelacakan` | Ambil riwayat pelacakan | Pimpinan / Admin+ |
| `GET` | `/v1/dinas-luar/peta-langsung` | Semua lokasi pegawai DL real-time | Admin+ / Pimpinan |

##### Konfigurasi Skema DL

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/skema-dl` | Daftar skema DL unit kerja | Semua |
| `PUT` | `/v1/skema-dl/:id` | Update skema DL | Pimpinan / Admin Unit |
| `PUT` | `/v1/skema-dl/:id/toggle` | Aktifkan/nonaktifkan skema | Pimpinan / Admin Unit |

#### 🏖️ Cuti

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/jenis-cuti` | Daftar jenis cuti | Semua |
| `POST` | `/v1/cuti` | Ajukan cuti | Pegawai |
| `GET` | `/v1/cuti` | Daftar pengajuan cuti (filter) | Admin+ / Pimpinan |
| `GET` | `/v1/cuti/saya` | Cuti saya | Pegawai |
| `GET` | `/v1/cuti/:id` | Detail pengajuan | Pemilik / Pimpinan / Admin+ |
| `PUT` | `/v1/cuti/:id/setujui` | Setujui cuti | Pimpinan |
| `PUT` | `/v1/cuti/:id/tolak` | Tolak cuti | Pimpinan |
| `PUT` | `/v1/cuti/:id/batalkan` | Batalkan cuti | Pimpinan / Pemilik |
| `GET` | `/v1/cuti/saldo/saya` | Saldo cuti saya | Pegawai |
| `GET` | `/v1/cuti/saldo` | Saldo cuti semua (per unit) | Admin+ / Pimpinan |
| `GET` | `/v1/cuti/ringkasan` | Rekap cuti | Admin+ / Pimpinan |

#### 📊 Laporan Kinerja Harian

##### Master Jenis Kegiatan LHKP

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/jenis-kegiatan-lhkp` | Daftar jenis kegiatan unit kerja | Pimpinan / Admin+ |
| `POST` | `/v1/jenis-kegiatan-lhkp` | Buat jenis kegiatan baru | Pimpinan |
| `PUT` | `/v1/jenis-kegiatan-lhkp/:id` | Update jenis kegiatan | Pimpinan |
| `PUT` | `/v1/jenis-kegiatan-lhkp/:id/toggle` | Aktifkan/nonaktifkan | Pimpinan |
| `GET` | `/v1/jenis-kegiatan-lhkp/saya` | Jenis kegiatan yang ditugaskan ke saya | Pegawai |

##### Penugasan Kegiatan ke Pegawai

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/penugasan-kegiatan` | Daftar penugasan (per unit kerja) | Pimpinan |
| `POST` | `/v1/penugasan-kegiatan` | Tugaskan kegiatan ke pegawai | Pimpinan |
| `POST` | `/v1/penugasan-kegiatan/massal` | Tugaskan kegiatan ke banyak pegawai sekaligus | Pimpinan |
| `DELETE` | `/v1/penugasan-kegiatan/:id` | Hapus penugasan | Pimpinan |
| `GET` | `/v1/penugasan-kegiatan/pegawai/:idPegawai` | Daftar kegiatan pegawai tertentu | Pimpinan |

##### Laporan Harian

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/laporan-harian` | Submit laporan harian (header + detail kegiatan) | Pegawai |
| `GET` | `/v1/laporan-harian/saya` | Laporan saya (filter status) | Pegawai |
| `GET` | `/v1/laporan-harian` | Daftar laporan (filter) | Pimpinan / Admin+ |
| `GET` | `/v1/laporan-harian/:id` | Detail laporan + daftar kegiatan | Pemilik / Pimpinan / Admin+ |
| `PUT` | `/v1/laporan-harian/:id` | Edit laporan + detail kegiatan (jika direvisi) | Pemilik |
| `PUT` | `/v1/laporan-harian/:id/setujui` | Setujui | Pimpinan |
| `PUT` | `/v1/laporan-harian/:id/revisi` | Minta revisi | Pimpinan |
| `PUT` | `/v1/laporan-harian/:id/tolak` | Tolak | Pimpinan |
| `GET` | `/v1/laporan-harian/ringkasan` | Rekap kinerja | Pimpinan / Admin+ |

#### ⭐ Review Rekan

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/review-rekan` | Submit review teman se-unit | Pegawai |
| `GET` | `/v1/review-rekan/diberikan` | Review yang saya berikan | Pegawai |
| `GET` | `/v1/review-rekan/diterima` | Review yang saya terima | Pegawai |
| `GET` | `/v1/review-rekan` | Semua review (tampilan admin) | Pimpinan / Admin+ |
| `GET` | `/v1/review-rekan/ringkasan/:idPegawai` | Ringkasan review seorang pegawai | Pimpinan / Admin+ |

#### 📢 Pengumuman

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/pengumuman` | Daftar pengumuman (sesuai target) | Semua |
| `GET` | `/v1/pengumuman/:id` | Detail | Semua |
| `POST` | `/v1/pengumuman` | Buat pengumuman | Admin Dinas |
| `PUT` | `/v1/pengumuman/:id` | Update | Admin Dinas |
| `DELETE` | `/v1/pengumuman/:id` | Hapus | Admin Dinas |

#### 🔔 Notifikasi

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/notifikasi` | Daftar notifikasi pengguna | Semua |
| `PUT` | `/v1/notifikasi/:id/baca` | Tandai dibaca | Pemilik |
| `PUT` | `/v1/notifikasi/baca-semua` | Tandai semua dibaca | Pemilik |
| `GET` | `/v1/notifikasi/belum-dibaca` | Jumlah belum dibaca | Pemilik |

#### 📈 Dasbor & Pemantauan

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/dasbor/statistik` | Statistik umum (hadir, cuti, DL, sakit hari ini) | Admin+ / Pimpinan |
| `GET` | `/v1/dasbor/status-pegawai` | Status pegawai real-time (cuti/DL/sakit/bekerja) | Admin+ / Pimpinan |
| `GET` | `/v1/dasbor/grafik-absensi` | Data grafik kehadiran | Admin+ |
| `GET` | `/v1/dasbor/perbandingan-unit` | Perbandingan antar unit kerja | Admin Dinas |

#### 📋 Laporan ke Dinas

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/laporan-ke-dinas` | Submit laporan ke Dinas | Admin Unit / Pimpinan |
| `GET` | `/v1/laporan-ke-dinas` | Daftar laporan | Admin Dinas / Admin Unit |
| `GET` | `/v1/laporan-ke-dinas/:id` | Detail laporan | Admin+ |
| `GET` | `/v1/laporan-ke-dinas/:id/unduh` | Unduh file laporan | Admin+ |

#### 🔄 Sinkronisasi Dapodik

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `POST` | `/v1/dapodik/kredensial` | Simpan/update kredensial SSO Dapodik | Admin Unit |
| `POST` | `/v1/dapodik/verifikasi-kredensial` | Coba login ke SSO Dapodik untuk memverifikasi | Admin Unit |
| `GET` | `/v1/dapodik/perbedaan` | Pratinjau perbedaan data sebelum sync diterapkan | Admin Unit |
| `POST` | `/v1/dapodik/sinkronisasi` | Jalankan sinkronisasi otomatis via SSO scraper | Admin Unit |
| `POST` | `/v1/dapodik/impor` | Impor manual file JSON/Excel Dapodik (fallback) | Admin Unit |
| `GET` | `/v1/dapodik/riwayat-sinkronisasi` | Riwayat & statistik sinkronisasi | Admin Unit |
| `GET` | `/v1/dapodik/riwayat-sinkronisasi/:id` | Detail hasil sinkronisasi tertentu | Admin Unit |

---

### 8.3 Detail Mekanisme Sinkronisasi Dapodik (SSO Scraper)

#### Latar Belakang

Dapodik tidak menyediakan API publik resmi yang bisa diakses langsung. Oleh karena itu, MAHESA menggunakan pendekatan **SSO Scraper** — melakukan login ke portal Dapodik menggunakan kredensial resmi milik Admin Unit, kemudian mengekstrak data PTK (Pendidik dan Tenaga Kependidikan) secara terprogram.

> [!IMPORTANT]
> **Persyaratan**: Admin Unit wajib memiliki akun Dapodik aktif yang terdaftar untuk sekolah/unit kerjanya. Kredensial disimpan terenkripsi (AES-256) di tabel `kredensial_dapodik` dan **tidak pernah ditampilkan kembali** di UI setelah disimpan.

#### Alur Teknis SSO Scraper

```
[1] SIMPAN KREDENSIAL (Satu kali setup)
───────────────────────────────────────
Admin Unit input username + password Dapodik
          │
          ▼
Backend enkripsi password (AES-256) lalu simpan ke tabel kredensial_dapodik


[2] VERIFIKASI (Opsional, sebelum sync)
───────────────────────────────────────
Backend kirim POST ke endpoint SSO Dapodik:
  URL: https://sso.datadik.kemdikbud.go.id/auth (atau endpoint aktif)
  Body: { username, password }
          │
          ▼
SSO Dapodik balas dengan JWT / session token
          │  Berhasil → simpan token sementara di Redis (TTL: 30 menit)
          │  Gagal    → kembalikan error "Kredensial tidak valid"


[3] PRATINJAU PERBEDAAN
───────────────────────────────────────
GET /v1/dapodik/perbedaan
          │
          ▼
Scraper gunakan token (dari Redis) untuk hit endpoint data PTK Dapodik
  Contoh: GET /api/ptk?sekolah_id=xxx (endpoint Dapodik internal)
          │
          ▼
dapodik.mapper.ts → Transformasi respons Dapodik → format skema MAHESA
          │
          ▼
Bandingkan dengan data di tabel pegawai (cocokkan via ptk_id / nuptk / nip)
          │
          ▼
Kembalikan JSON diff ke frontend:
  {
    "baru": [{nama, nuptk, ...}],         ← Akan di-INSERT
    "diperbarui": [{nama, perubahan:{}}], ← Akan di-UPDATE
    "konflik": [{nama, alasan}],          ← Akan di-SKIP
    "tidak_berubah": [...]                ← Di-ignore
  }


[4] JALANKAN SINKRONISASI
───────────────────────────────────────
POST /v1/dapodik/sinkronisasi
          │
          ▼
Buat record di riwayat_sinkronisasi_dapodik (status: berjalan)
          │
          ▼
Untuk setiap PTK dari Dapodik:
  ├── ptk_id TIDAK ada di DB? → INSERT pegawai baru
  ├── ptk_id ADA & data berbeda?
  │     ├── Cek apakah ada konflik (lihat strategi konflik di bawah)
  │     ├── Tidak konflik → UPDATE data
  │     └── Konflik → SKIP, catat di ringkasan.konflik
  └── ptk_id ADA & data sama → SKIP (tidak_berubah)
          │
          ▼
Perbarui record riwayat (status: selesai, isi statistik)
```

#### Strategi Penanganan Konflik Data

> **Konflik** terjadi saat data di MAHESA sudah diubah manual oleh Admin/Pegawai (misalnya: no. telepon, alamat) dan data Dapodik memberikan nilai yang berbeda.

| Jenis Kolom | Sumber Pemenang | Alasan |
|-------------|-----------------|--------|
| **Data Identitas Formal** (NIP, NUPTK, pangkat, golongan, TMT, No. SK) | **Dapodik** selalu menang | Data ini bersumber dari dokumen resmi kepegawaian. |
| **Data Tambahan** (telepon, alamat, foto, rekening, NPWP) | **MAHESA menang** (data lokal dipertahankan) | Dapodik tidak selalu memiliki data ini, dan pegawai sudah mengisi sendiri. |
| **Riwayat Jabatan** (`jabatan_pegawai`) | **Dapodik menambahkan**, tidak menimpa | Jika ada entri baru dari Dapodik (TMT baru), akan di-INSERT sebagai riwayat baru. |
| **Riwayat Pendidikan** (`pendidikan_pegawai`) | **Upsert by jenjang** | Jika sudah ada jenjang yang sama, UPDATE. Jika jenjang baru, INSERT. |

```
Contoh strategi konflik:
  Data MAHESA (manual): telepon = "0812-xxx"
  Data Dapodik:         telepon = "" (kosong)
  → Hasil: MAHESA menang, telepon tetap "0812-xxx"

  Data MAHESA: pangkat_golongan = "III/a"
  Data Dapodik: pangkat_golongan = "III/b" (sudah naik pangkat)
  → Hasil: Dapodik menang, diupdate ke "III/b"
```

#### Fallback: Impor Manual

Jika portal Dapodik sedang maintenance atau SSO tidak dapat diakses, Admin Unit dapat:
1. Export data PTK dari Dapodik secara manual ke format **Excel / JSON**
2. Upload file tersebut melalui endpoint `POST /v1/dapodik/impor`
3. Sistem akan memproses dan menerapkan aturan konflik yang sama persis

#### ⚙️ Pengaturan

| Method | Endpoint | Deskripsi | Peran |
|--------|----------|-----------|------|
| `GET` | `/v1/pengaturan` | Ambil pengaturan (per lingkup) | Admin+ |
| `PUT` | `/v1/pengaturan/:kunci` | Update pengaturan | Admin+ |

---

## 9. Backend — Detail Implementasi

### 9.1 Struktur Folder Backend

```
backend/
├── src/
│   ├── index.ts                            # Titik masuk aplikasi
│   ├── konfigurasi/
│   │   ├── env.ts                          # Variabel lingkungan
│   │   ├── database.ts                     # PostgreSQL + Drizzle setup
│   │   ├── redis.ts                        # Koneksi Redis
│   │   └── firebase.ts                     # Firebase Admin SDK (FCM)
│   │
│   ├── db/
│   │   ├── skema/
│   │   │   ├── dinas.ts
│   │   │   ├── unit-kerja.ts
│   │   │   ├── pengguna.ts
│   │   │   ├── pegawai.ts
│   │   │   ├── absensi.ts
│   │   │   ├── titik-absensi.ts
│   │   │   ├── pengajuan-dinas-luar.ts
│   │   │   ├── skema-dinas-luar.ts
│   │   │   ├── log-lokasi-pegawai.ts
│   │   │   ├── jenis-cuti.ts
│   │   │   ├── saldo-cuti.ts
│   │   │   ├── pengajuan-cuti.ts
│   │   │   ├── dokumen-cuti.ts
│   │   │   ├── jenis-kegiatan-lhkp.ts
│   │   │   ├── penugasan-kegiatan-lhkp.ts
│   │   │   ├── laporan-harian.ts
│   │   │   ├── detail-laporan-harian.ts
│   │   │   ├── review-rekan.ts
│   │   │   ├── pengajuan-biodata.ts
│   │   │   ├── dokumen-pegawai.ts
│   │   │   ├── pengumuman.ts
│   │   │   ├── notifikasi.ts
│   │   │   ├── laporan-ke-dinas.ts
│   │   │   ├── pengaturan.ts
│   │   │   ├── log-audit.ts
│   │   │   └── index.ts
│   │   ├── migrasi/
│   │   └── seed.ts
│   │
│   ├── modul/
│   │   ├── otentikasi/
│   │   │   ├── otentikasi.controller.ts
│   │   │   ├── otentikasi.service.ts
│   │   │   ├── otentikasi.schema.ts
│   │   │   └── otentikasi.test.ts
│   │   ├── organisasi/
│   │   │   ├── organisasi.controller.ts
│   │   │   ├── organisasi.service.ts
│   │   │   └── organisasi.repository.ts
│   │   ├── pegawai/
│   │   │   ├── pegawai.controller.ts
│   │   │   ├── pegawai.service.ts
│   │   │   ├── pegawai.repository.ts
│   │   │   └── pegawai.schema.ts
│   │   ├── biodata/
│   │   │   ├── biodata.controller.ts
│   │   │   ├── biodata.service.ts
│   │   │   └── biodata.repository.ts
│   │   ├── absensi/
│   │   │   ├── absensi.controller.ts
│   │   │   ├── absensi.service.ts
│   │   │   ├── absensi.repository.ts
│   │   │   └── absensi.schema.ts
│   │   ├── dinas-luar/
│   │   │   ├── dinas-luar.controller.ts
│   │   │   ├── dinas-luar.service.ts
│   │   │   ├── dinas-luar.repository.ts
│   │   │   ├── pelacakan-dl.service.ts        # Penanganan lokasi real-time
│   │   │   └── dinas-luar.schema.ts
│   │   ├── cuti/
│   │   │   ├── cuti.controller.ts
│   │   │   ├── cuti.service.ts
│   │   │   ├── cuti.repository.ts
│   │   │   └── cuti.schema.ts
│   │   ├── laporan-harian/
│   │   │   ├── laporan-harian.controller.ts
│   │   │   ├── laporan-harian.service.ts
│   │   │   ├── laporan-harian.repository.ts
│   │   │   ├── jenis-kegiatan.controller.ts    # CRUD jenis kegiatan LHKP
│   │   │   ├── jenis-kegiatan.service.ts
│   │   │   ├── jenis-kegiatan.repository.ts
│   │   │   └── penugasan-kegiatan.service.ts   # Penugasan kegiatan → pegawai
│   │   ├── review-rekan/
│   │   │   ├── review-rekan.controller.ts
│   │   │   ├── review-rekan.service.ts
│   │   │   └── review-rekan.repository.ts
│   │   ├── pengumuman/
│   │   │   ├── pengumuman.controller.ts
│   │   │   ├── pengumuman.service.ts
│   │   │   └── pengumuman.repository.ts
│   │   ├── notifikasi/
│   │   │   ├── notifikasi.controller.ts
│   │   │   ├── notifikasi.service.ts
│   │   │   └── fcm.service.ts                  # Firebase push notification
│   │   ├── dasbor/
│   │   │   ├── dasbor.controller.ts
│   │   │   └── dasbor.service.ts
│   │   ├── laporan/
│   │   │   ├── laporan.controller.ts
│   │   │   └── laporan.service.ts
│   │   ├── dapodik/
│   │   │   ├── dapodik.controller.ts
│   │   │   ├── dapodik.service.ts
│   │   │   └── dapodik.mapper.ts               # Map Dapodik → skema Pegawai
│   │   └── pengaturan/
│   │       ├── pengaturan.controller.ts
│   │       └── pengaturan.service.ts
│   │
│   ├── middleware/
│   │   ├── otentikasi.middleware.ts
│   │   ├── otorisasi-peran.middleware.ts
│   │   ├── pembatas-akses.middleware.ts
│   │   ├── pencatat.middleware.ts
│   │   └── penanganan-error.middleware.ts
│   │
│   ├── lib/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── penyimpanan.ts                    # MinIO/S3 upload
│   │   ├── email.ts
│   │   ├── pdf.ts
│   │   ├── excel.ts
│   │   ├── geo.ts                            # Haversine, cek radius
│   │   ├── gambar.ts                         # Kompresi Sharp
│   │   ├── paginasi.ts
│   │   └── respons.ts
│   │
│   └── tipe/
│       └── index.ts
│
├── drizzle/
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── .env / .env.example
├── bunfig.toml
└── Dockerfile
```

### 9.2 GPS Radius Validation Logic

```typescript
// src/lib/geo.ts
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
    * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isWithinRadius(
  employeeLat: number, employeeLng: number,
  targetLat: number, targetLng: number,
  radiusMeters: number
): boolean {
  return haversineDistance(employeeLat, employeeLng, targetLat, targetLng) <= radiusMeters;
}
```

### 9.3 Strategi Token JWT

```
Access Token:    15 menit    │ Payload: {idPengguna, peran, idPegawai, idUnitKerja}
Refresh Token:   7 hari     │ Payload: {idPengguna, versiToken}
Penyimpanan:     Access → Memory (Web) / SecureStorage (Mobile)
                 Refresh → HttpOnly Cookie (Web) / SecureStorage (Mobile)
Daftar Hitam:    Redis SET with TTL
```

---

## 10. Frontend Web — Detail Implementasi

### 10.1 Struktur Folder Web

```
web/
├── src/
│   ├── app/
│   │   ├── (otentikasi)/
│   │   │   ├── masuk/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dasbor)/
│   │   │   ├── layout.tsx                      # Sidebar + Header
│   │   │   ├── page.tsx                        # Halaman utama dasbor
│   │   │   │
│   │   │   ├── pegawai/
│   │   │   │   ├── page.tsx                    # Daftar pegawai
│   │   │   │   ├── [id]/page.tsx               # Detail pegawai
│   │   │   │   └── impor/page.tsx              # Impor Dapodik
│   │   │   │
│   │   │   ├── absensi/
│   │   │   │   ├── page.tsx                    # Rekap absensi
│   │   │   │   ├── terlambat/page.tsx          # Pegawai bermasalah
│   │   │   │   └── ekspor/page.tsx
│   │   │   │
│   │   │   ├── dinas-luar/
│   │   │   │   ├── page.tsx                    # Rekap DL
│   │   │   │   ├── pelacakan/page.tsx          # Peta pelacakan real-time
│   │   │   │   └── skema/page.tsx              # Konfigurasi skema DL
│   │   │   │
│   │   │   ├── cuti/
│   │   │   │   └── page.tsx                    # Rekap cuti
│   │   │   │
│   │   │   ├── laporan-harian/
│   │   │   │   └── page.tsx                    # Rekap kinerja harian
│   │   │   │
│   │   │   ├── biodata/
│   │   │   │   └── page.tsx                    # Pengajuan biodata
│   │   │   │
│   │   │   ├── pengumuman/
│   │   │   │   ├── page.tsx
│   │   │   │   └── baru/page.tsx
│   │   │   │
│   │   │   ├── pemantauan/
│   │   │   │   └── page.tsx                    # Status real-time pegawai
│   │   │   │
│   │   │   ├── laporan/
│   │   │   │   └── page.tsx                    # Generate laporan ke Dinas
│   │   │   │
│   │   │   ├── unit-kerja/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   │
│   │   │   ├── dapodik/
│   │   │   │   └── page.tsx                    # Sinkronisasi Dapodik
│   │   │   │
│   │   │   └── pengaturan/
│   │   │       └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── komponen/
│   │   ├── ui/                                 # shadcn/ui
│   │   ├── tata-letak/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── navigasi-mobile.tsx
│   │   ├── peta/
│   │   │   ├── peta-pelacakan.tsx             # Leaflet + OpenStreetMap
│   │   │   └── penanda-lokasi.tsx
│   │   ├── pegawai/
│   │   ├── absensi/
│   │   ├── dasbor/
│   │   └── ...
│   │
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   └── tipe/
│
├── next.config.ts
├── tailwind.config.ts
├── components.json
└── package.json
```

### 10.2 Halaman per Role

#### Admin Dinas — Halaman Web

| No | Path | Deskripsi |
|----|------|-----------|
| 1 | `/` | Dasbor: ringkasan seluruh unit (grafik, statistik) |
| 2 | `/pemantauan` | Status real-time: siapa cuti/DL/sakit/bekerja |
| 3 | `/dinas-luar/pelacakan` | Peta pelacakan real-time DL seluruh unit |
| 4 | `/pegawai` | Data pegawai seluruh unit (DataTable) |
| 5 | `/absensi` | Rekap absensi seluruh unit |
| 6 | `/absensi/terlambat` | Pegawai sering terlambat/jarang masuk |
| 7 | `/cuti` | Rekap cuti seluruh unit |
| 8 | `/dinas-luar` | Rekap DL seluruh unit |
| 9 | `/laporan-harian` | Rekap kinerja harian seluruh unit |
| 10 | `/biodata` | Persetujuan pengajuan biodata |
| 11 | `/pengumuman` | CRUD pengumuman |
| 12 | `/unit-kerja` | Kelola unit kerja |
| 13 | `/pengaturan` | Konfigurasi sistem |

#### Admin Unit Kerja — Halaman Web

| No | Path | Deskripsi |
|----|------|-----------|
| 1 | `/` | Dasbor unit kerja |
| 2 | `/pemantauan` | Status pegawai unit (cuti/DL/sakit/bekerja) |
| 3 | `/dinas-luar/pelacakan` | Pelacakan DL pegawai unit |
| 4 | `/pegawai` | Data pegawai unit |
| 5 | `/dapodik` | Sinkronisasi & impor data Dapodik |
| 6 | `/absensi` | Rekap absensi unit |
| 7 | `/cuti` | Rekap cuti unit |
| 8 | `/dinas-luar` | Rekap DL unit |
| 9 | `/laporan-harian` | Rekap kinerja unit |
| 10 | `/biodata` | Persetujuan biodata pegawai unit |
| 11 | `/laporan` | Generate laporan ke Dinas |

---

## 11. Mobile App — Detail Implementasi

### 11.1 Arsitektur Flutter

```
mobile/
├── lib/
│   ├── main.dart
│   ├── app.dart                            # MaterialApp + GoRouter
│   │
│   ├── inti/
│   │   ├── konfigurasi/
│   │   │   ├── env.dart
│   │   │   └── tema.dart                   # Tema Terang + Gelap
│   │   ├── konstanta/
│   │   │   ├── endpoint_api.dart
│   │   │   └── konstanta_app.dart
│   │   ├── jaringan/
│   │   │   ├── klien_api.dart              # Dio + interceptors
│   │   │   ├── interceptor_otentikasi.dart # Auto JWT refresh
│   │   │   └── exception_api.dart
│   │   ├── utilitas/
│   │   │   ├── utilitas_tanggal.dart
│   │   │   ├── utilitas_lokasi.dart
│   │   │   └── validator.dart
│   │   └── widget/                         # Widget yang bisa digunakan ulang
│   │       ├── kerangka_app.dart
│   │       ├── widget_memuat.dart
│   │       ├── widget_error.dart
│   │       ├── lencana_status.dart
│   │       └── widget_kamera_selfie.dart
│   │
│   ├── fitur/
│   │   ├── otentikasi/
│   │   │   ├── data/ → model, sumber_data, impl_repositori
│   │   │   ├── domain/ → entitas, antarmuka_repositori, use_case
│   │   │   └── presentasi/
│   │   │       ├── provider/provider_otentikasi.dart
│   │   │       └── layar/
│   │   │           ├── layar_splash.dart
│   │   │           └── layar_masuk.dart
│   │   │
│   │   ├── beranda/
│   │   │   └── presentasi/layar/
│   │   │       ├── layar_beranda.dart        # Kontainer navigasi bawah
│   │   │       └── tab_dasbor.dart           # Statistik cepat, pengumuman
│   │   │
│   │   ├── absensi/
│   │   │   ├── data/...
│   │   │   ├── domain/...
│   │   │   └── presentasi/
│   │   │       ├── layar/
│   │   │       │   ├── layar_absensi.dart           # Jam masuk/pulang kantor
│   │   │       │   ├── layar_absensi_dl.dart        # Absensi Dinas Luar
│   │   │       │   └── layar_riwayat_absensi.dart
│   │   │       └── widget/
│   │   │           ├── tombol_absen.dart             # Geser untuk absen
│   │   │           ├── widget_status_gps.dart
│   │   │           ├── tangkap_selfie.dart
│   │   │           └── pratinjau_peta.dart
│   │   │
│   │   ├── dinas_luar/
│   │   │   ├── data/...
│   │   │   ├── domain/...
│   │   │   └── presentasi/
│   │   │       ├── layar/
│   │   │       │   ├── form_pengajuan_dl.dart
│   │   │       │   ├── layar_daftar_dl.dart
│   │   │       │   ├── layar_detail_dl.dart
│   │   │       │   └── peta_pelacakan_dl.dart       # Peta real-time (pimpinan)
│   │   │       └── widget/
│   │   │           ├── pemilih_skema.dart
│   │   │           └── timeline_checkpoint.dart
│   │   │
│   │   ├── cuti/
│   │   │   └── presentasi/
│   │   │       ├── layar/
│   │   │       │   ├── layar_daftar_cuti.dart
│   │   │       │   ├── layar_form_cuti.dart
│   │   │       │   ├── layar_detail_cuti.dart
│   │   │       │   └── layar_saldo_cuti.dart
│   │   │       └── widget/
│   │   │           ├── pemilih_jenis_cuti.dart
│   │   │           ├── kartu_unggah_dokumen.dart
│   │   │           └── kartu_saldo_cuti.dart
│   │   │
│   │   ├── laporan_harian/
│   │   │   └── presentasi/
│   │   │       ├── layar/
│   │   │       │   ├── layar_form_laporan.dart
│   │   │       │   ├── layar_daftar_laporan.dart
│   │   │       │   └── layar_detail_laporan.dart
│   │   │       └── widget/
│   │   │           ├── pemilih_jenis_kegiatan.dart  # Dropdown kegiatan yang ditugaskan
│   │   │           └── kartu_input_kegiatan.dart    # Input jam_mulai, jam_selesai, uraian
│   │   │
│   │   ├── review_rekan/
│   │   │   └── presentasi/
│   │   │       └── layar/
│   │   │           ├── layar_form_review.dart
│   │   │           ├── layar_daftar_review.dart
│   │   │           └── layar_review_saya.dart
│   │   │
│   │   ├── biodata/
│   │   │   └── presentasi/
│   │   │       └── layar/
│   │   │           └── layar_form_biodata.dart
│   │   │
│   │   ├── organisasi/
│   │   │   └── presentasi/
│   │   │       └── layar/
│   │   │           ├── layar_pohon_organisasi.dart
│   │   │           └── layar_pegawai_unit.dart
│   │   │
│   │   ├── notifikasi/
│   │   │   └── presentasi/
│   │   │       └── layar/
│   │   │           └── layar_notifikasi.dart
│   │   │
│   │   ├── pengumuman/
│   │   │   └── presentasi/
│   │   │       └── layar/
│   │   │           ├── daftar_pengumuman.dart
│   │   │           └── detail_pengumuman.dart
│   │   │
│   │   ├── profil/
│   │   │   └── presentasi/
│   │   │       └── layar/
│   │   │           ├── layar_profil.dart
│   │   │           └── ganti_kata_sandi.dart
│   │   │
│   │   └── pimpinan/                        # Fitur khusus pimpinan unit kerja
│   │       └── presentasi/
│   │           └── layar/
│   │               ├── kehadiran_bawahan.dart
│   │               ├── layar_daftar_persetujuan.dart
│   │               ├── layar_detail_persetujuan.dart
│   │               ├── rekap_bawahan.dart
│   │               └── form_laporan_ke_dinas.dart
│   │
│   └── provider/
│       └── provider_app.dart
│
├── test/
├── android/
├── ios/
├── assets/
├── pubspec.yaml
└── analysis_options.yaml
```

### 11.2 Halaman Mobile — Pegawai (Navigasi Bawah)

| Tab | Layar | Fitur |
|-----|-------|-------|
| **🏠 Beranda** | Dasbor | Status absensi hari ini, saldo cuti, pengumuman terbaru, aksi cepat |
| **⏰ Absensi** | Absensi | Jam masuk/pulang (kantor atau DL), GPS + selfie, riwayat, rekap bulanan |
| **📋 Kinerja** | Laporan Harian | Pilih jenis kegiatan (dari penugasan LHKP), input jam mulai/selesai + uraian, daftar (filter status), detail, review rekan |
| **👤 Profil** | Profil | Biodata, ganti kata sandi, notifikasi, pengumuman, pohon organisasi, pengaturan |

### 11.3 Halaman Mobile — Pimpinan Unit Kerja (Navigasi Bawah)

| Tab | Layar | Fitur |
|-----|-------|-------|
| **🏠 Beranda** | Dasbor | Kehadiran bawahan hari ini, jumlah persetujuan tertunda |
| **✅ Persetujuan** | Pusat Persetujuan | Tab: Cuti, DL, Kinerja. Setujui/Tolak/Batalkan. |
| **📊 Rekap** | Rekapitulasi | Rekap absensi, cuti, DL, kinerja bawahan. |
| **👤 Profil** | Profil | Profil, pengaturan, **kelola jenis kegiatan LHKP**, **penugasan kegiatan ke pegawai**, peta pelacakan DL, buat laporan ke Dinas |

---

## 12. Keamanan & Otorisasi

### 12.1 Langkah-langkah Keamanan

| Kategori | Implementasi |
|----------|-------------|
| **Kata Sandi** | bcrypt (min 8 karakter, aturan kompleksitas). Jalur peningkatan ke Argon2id. |
| **JWT** | Access token 15 menit + rotasi refresh 7 hari |
| **API** | Pembatasan akses 100 req/menit per IP, daftar putih CORS |
| **Input** | Validasi skema TypeBox, pencegahan injeksi SQL via Drizzle |
| **Unggah File** | Validasi MIME, maks 5MB, kompresi `sharp`, pemindaian virus (opsional) |
| **Pemalsuan GPS** | Beberapa penanggulangan: cek EXIF foto, cek konsistensi |
| **Header Keamanan** | Setara Helmet: X-Content-Type-Options, HSTS, X-Frame-Options |
| **Jejak Audit** | Semua operasi CUD dicatat di log_audit |
| **HTTPS** | Wajib di produksi |
| **FCM** | Hanya server-ke-perangkat, kunci server di env |

### 12.2 Strategi Anti-Pemalsuan GPS

```
1. Foto selfie wajib (tidak bisa kirim otomatis)
2. Pemeriksaan data EXIF dari foto (jika tersedia)
3. Pemeriksaan konsistensi: lokasi sebelum & sesudah
4. Pemeriksaan kecepatan: perpindahan tidak mungkin terlalu cepat
5. Detektor lokasi palsu di Flutter (android.provider.Settings)
6. Sistem penanda admin: tandai kecurigaan otomatis
```

---

## 13. Fase Pengembangan

### Fase 1: Fondasi & Persiapan (Minggu 1-2)

```
[x] Persiapan monorepo (backend/, web/, mobile/) - *Dimulai (backend/)*
[x] Backend: Inisialisasi Bun + Elysia, Drizzle + PostgreSQL - **(Issue #1 Selesai)**
[ ] Backend: Buat SEMUA skema database (26+ tabel) - **(Issue #2 & #3 Menunggu)**
[ ] Backend: Jalankan migrasi, seed data (dinas, unit kerja, skema_jam_kerja, jenis_cuti, skema_dinas_luar, jenis_kegiatan_lhkp)
[ ] Backend: Middleware (pencatat, CORS, penanganan error)
[ ] Backend: Pustaka utilitas (jwt, hash, paginasi, respons, geo, penyimpanan)
[ ] Backend: Konfigurasi Redis + MinIO
[ ] Web: Inisialisasi Next.js + Tailwind + shadcn/ui
[ ] Web: Tata letak dasar (sidebar, header, routing)
[ ] Mobile: Inisialisasi proyek Flutter
[ ] Mobile: Struktur Clean Architecture
[ ] Mobile: Inti (Dio, Riverpod, GoRouter, tema)
[ ] Docker-compose (PostgreSQL, Redis, MinIO)
[ ] Repositori Git + strategi branching
```

### Fase 2: Otentikasi & Data Inti (Minggu 3-4)

```
[ ] Backend: Modul otentikasi (masuk, keluar, perbarui token, ganti kata sandi, lupa/reset)
[ ] Backend: Middleware JWT + otorisasi peran
[ ] Backend: Modul organisasi (dinas, unit_kerja, pohon organisasi)
[ ] Backend: Modul pegawai (CRUD, pencarian, filter, paginasi)
[ ] Backend: Modul pengajuan biodata (kirim, setujui, tolak)
[ ] Backend: Registrasi token FCM
[ ] Backend: Unggah file (MinIO) untuk foto profil
[ ] Backend: Seeder database (contoh pegawai, unit)
[ ] Web: Halaman masuk
[ ] Web: Tata letak dasbor + sidebar (menu sesuai peran)
[ ] Web: Daftar pegawai (DataTable) + halaman detail
[ ] Web: Manajemen unit kerja
[ ] Web: Halaman persetujuan biodata
[ ] Mobile: Layar splash + masuk
[ ] Mobile: Layar beranda (navigasi bawah, sesuai peran)
[ ] Mobile: Profil + formulir biodata + ganti kata sandi
[ ] Mobile: Penampil pohon organisasi
[ ] Mobile: Daftar pegawai unit
```

### Fase 3: Absensi & Dinas Luar (Minggu 5-7)

```
[ ] Backend: Modul absensi (sistem titik absensi, validasi GPS)
[ ] Backend: CRUD skema dinas luar
[ ] Backend: Modul dinas luar (pengajuan, setujui, tolak, batalkan)
[ ] Backend: Pelacakan DL real-time (log lokasi, penyimpanan Redis)
[ ] Backend: Endpoint ringkasan/rekap absensi
[ ] Backend: Endpoint deteksi terlambat/tidak hadir
[ ] Backend: Layanan notifikasi + integrasi FCM
[ ] Web: Halaman rekap absensi (DataTable + Kalender)
[ ] Web: Halaman sorot pegawai terlambat/tidak hadir
[ ] Web: Halaman rekap DL
[ ] Web: Peta pelacakan DL real-time (Leaflet + OpenStreetMap)
[ ] Web: Halaman konfigurasi skema DL
[ ] Mobile: Layar absensi (GPS + selfie + jam masuk/pulang)
[ ] Mobile: Formulir pengajuan DL (pemilih skema, tujuan, tanggal)
[ ] Mobile: Layar absensi DL (multi-checkpoint)
[ ] Mobile: Riwayat absensi + rekap bulanan
[ ] Mobile: Penanganan notifikasi (FCM + dalam-app)
[ ] Mobile (Pimpinan): Lihat kehadiran bawahan
[ ] Mobile (Pimpinan): Persetujuan DL (setujui/tolak/batalkan)
[ ] Mobile (Pimpinan): Peta pelacakan DL real-time
[ ] Mobile (Pimpinan): Rekap absensi & DL bawahan
```

### Fase 4: Cuti & Kinerja Harian (Minggu 8-9)

```
[ ] Backend: Modul cuti (pengajuan, setujui, tolak, batalkan)
[ ] Backend: Manajemen saldo cuti (reset otomatis tahunan)
[ ] Backend: Unggah dokumen cuti
[ ] Backend: Modul jenis kegiatan LHKP (CRUD, aktifkan/nonaktifkan)
[ ] Backend: Modul penugasan kegiatan (tugaskan kegiatan ke pegawai, massal)
[ ] Backend: Modul laporan harian (kirim header + detail kegiatan, setujui, revisi, tolak)
[ ] Backend: Modul review rekan
[ ] Backend: Pemicu notifikasi untuk semua perubahan status
[ ] Web: Halaman rekap cuti (DataTable, saldo cuti)
[ ] Web: Halaman rekap laporan harian
[ ] Mobile: Daftar cuti + formulir (pemilih jenis, unggah dokumen, pilih tanggal)
[ ] Mobile: Tampilan saldo cuti
[ ] Mobile: Detail cuti + timeline status
[ ] Mobile: Formulir laporan harian (pemilih jenis kegiatan + input jam mulai/selesai + uraian)
[ ] Mobile: Daftar laporan harian (filter: disetujui/direvisi/ditolak)
[ ] Mobile: Formulir + daftar review rekan
[ ] Mobile (Pimpinan): Halaman kelola jenis kegiatan LHKP
[ ] Mobile (Pimpinan): Halaman penugasan kegiatan ke pegawai
[ ] Mobile (Pimpinan): Persetujuan cuti (setujui/tolak/batalkan)
[ ] Mobile (Pimpinan): Persetujuan laporan harian (setujui/revisi/tolak)
[ ] Mobile (Pimpinan): Rekap cuti & kinerja bawahan
```

### Fase 5: Dasbor, Pemantauan & Laporan (Minggu 10-11)

```
[ ] Backend: Endpoint statistik dasbor (per lingkup peran)
[ ] Backend: Pemantauan status pegawai (cuti/DL/sakit/bekerja)
[ ] Backend: Endpoint pembuatan laporan (ke Dinas)
[ ] Backend: Ekspor Excel (absensi, cuti, DL, laporan harian)
[ ] Backend: Modul sinkronisasi Dapodik (impor/perbedaan/sinkronisasi)
[ ] Backend: Modul pengumuman (CRUD, penargetan)
[ ] Backend: Tugas terjadwal (cron: reset cuti, pengingat)
[ ] Web: Dasbor (kartu statistik, grafik, perbandingan unit)
[ ] Web: Halaman pemantauan real-time (status pegawai)
[ ] Web: Pembuatan laporan (ke Dinas) + unduh
[ ] Web: Halaman sinkronisasi Dapodik (impor, pratinjau perbedaan, sinkronisasi)
[ ] Web: Manajemen pengumuman (CRUD, target)
[ ] Web: Halaman pengaturan
[ ] Mobile: Tab dasbor (statistik, pengumuman terbaru)
[ ] Mobile: Daftar pengumuman + detail
[ ] Mobile: Deep linking notifikasi push
[ ] Mobile (Pimpinan): Formulir laporan ke Dinas
```

### Fase 6: Pengujian, Penyempurnaan & Peluncuran (Minggu 12-14)

```
[ ] Backend: Pengujian unit semua layanan (≥80% cakupan)
[ ] Backend: Pengujian integrasi endpoint API
[ ] Backend: Optimasi performa (profiling kueri, indeks)
[ ] Backend: Kontainerisasi Docker + pemeriksaan kesehatan
[ ] Web: Pengujian E2E (Playwright) alur kritis
[ ] Web: Audit Lighthouse ≥ 90
[ ] Web: Penyempurnaan desain responsif
[ ] Web: Mode gelap
[ ] Web: Pembatas error + status memuat
[ ] Mobile: Pengujian unit + widget
[ ] Mobile: Pengujian integrasi
[ ] Mobile: Profiling performa (60fps)
[ ] Mobile: Login biometrik
[ ] Mobile: Cache offline (Hive)
[ ] Mobile: Deteksi lokasi palsu
[ ] Mobile: Build APK rilis
[ ] Pipeline CI/CD (GitHub Actions)
[ ] Pemantauan + pencatatan (Sentry, Grafana)
[ ] Dokumentasi (docs API via Swagger, panduan setup)
[ ] Audit keamanan
[ ] UAT (Pengujian Penerimaan Pengguna)
```

---

## 14. Struktur Folder Proyek (Monorepo)

```
MAHESA/
├── backend/                        # Bun + Elysia API
│   ├── src/
│   ├── drizzle/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── web/                            # Dasbor Next.js
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── mobile/                         # Aplikasi Flutter
│   ├── lib/
│   ├── android/
│   ├── ios/
│   ├── pubspec.yaml
│   └── ...
│
├── dokumentasi/
│   ├── api/                        # Swagger otomatis
│   ├── arsitektur.md
│   ├── panduan-setup.md
│   ├── peluncuran.md
│   └── panduan-pengguna/
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitignore
├── README.md
├── planningall.md                  # ← Dokumen ini
└── prompt.txt
```

---

## 15. Peluncuran & DevOps

### 15.1 Docker Compose (Pengembangan)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: mahesa
      POSTGRES_USER: mahesa_user
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - miniodata:/data

volumes:
  pgdata:
  miniodata:
```

### 15.2 Stack Produksi (🆓 Semua Gratis)

| Komponen | Rekomendasi | Biaya |
|----------|-------------|-------|
| **Server** | Oracle Cloud Free Tier (4 OCPU ARM, 24GB RAM — selalu gratis) | 🆓 Rp 0 |
| **Reverse Proxy** | Caddy (SSL otomatis via Let's Encrypt) | 🆓 Rp 0 |
| **Backend** | Docker (Bun compiled binary) | 🆓 Rp 0 |
| **Web** | Self-host di Docker (Next.js standalone) | 🆓 Rp 0 |
| **Database** | PostgreSQL self-host (Docker) | 🆓 Rp 0 |
| **Redis** | Redis self-host (Docker) | 🆓 Rp 0 |
| **Penyimpanan** | MinIO self-host (Docker) | 🆓 Rp 0 |
| **Notifikasi Push** | Firebase Cloud Messaging | 🆓 Rp 0 (gratis tanpa batas) |
| **Email** | Nodemailer + Gmail SMTP (500 email/hari) | 🆓 Rp 0 |
| **Peta** | Leaflet.js + OpenStreetMap | 🆓 Rp 0 (tanpa API key) |
| **Mobile** | APK langsung / F-Droid (Android), TestFlight (iOS) | 🆓 Rp 0 |
| **Pemantauan** | GlitchTip (self-hosted, alternatif Sentry gratis) | 🆓 Rp 0 |
| **Logging** | Grafana + Loki (self-hosted) | 🆓 Rp 0 |
| **CI/CD** | GitHub Actions (gratis untuk repo publik) atau Gitea + Woodpecker CI | 🆓 Rp 0 |

> [!TIP]
> **Oracle Cloud Free Tier** menyediakan 4 OCPU ARM Ampere + 24GB RAM + 200GB penyimpanan **selamanya gratis**.
> Ini cukup untuk menjalankan seluruh stack (Backend + Web + PostgreSQL + Redis + MinIO + Caddy) dalam satu server.

### 15.3 Variabel Lingkungan Backend

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://mahesa_user:secret@localhost:5432/mahesa
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=mahesa

FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_CLIENT_EMAIL=your-email

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=mahesa.noreply@gmail.com
SMTP_USER=mahesa.noreply@gmail.com
SMTP_PASS=your-app-password

CORS_ORIGINS=http://localhost:3001
```

> [!NOTE]
> Untuk SMTP Gmail, aktifkan "App Password" di akun Google (bukan password biasa).
> Gratis hingga 500 email/hari — cukup untuk skala Dinas Pendidikan.

---

## 16. Daftar Periksa Kesiapan Produksi

### Backend
- [ ] Semua endpoint terlindungi (Otentikasi + Otorisasi Peran)
- [ ] Pembatasan akses aktif
- [ ] Validasi input di semua endpoint (TypeBox)
- [ ] Validasi radius GPS berfungsi
- [ ] Notifikasi push (FCM) berfungsi
- [ ] Unggah file + kompresi berfungsi
- [ ] Tugas terjadwal berjalan (cron reset cuti, pengingat)
- [ ] Penanganan error tidak membocorkan detail internal
- [ ] Indeks database optimal
- [ ] Dokumentasi Swagger/OpenAPI aktif
- [ ] Endpoint pemeriksaan kesehatan `/health`
- [ ] Cakupan pengujian unit ≥ 80%
- [ ] HTTPS diwajibkan (produksi)

### Dasbor Web
- [ ] Responsif (Desktop + Tablet)
- [ ] Dukungan mode gelap
- [ ] Status memuat + pembatas error
- [ ] Umpan balik validasi formulir jelas
- [ ] Peta pelacakan real-time berfungsi
- [ ] Ekspor data berfungsi (Excel)
- [ ] Impor/sinkronisasi Dapodik berfungsi
- [ ] Lighthouse ≥ 90
- [ ] Menu/akses berdasarkan peran
- [ ] Pengujian E2E alur kritis

### Aplikasi Mobile
- [ ] GPS + selfie absensi berfungsi (kantor & DL)
- [ ] Deteksi lokasi palsu aktif
- [ ] Notifikasi push + deep linking berfungsi
- [ ] Login biometrik
- [ ] Cache offline (profil, absensi terakhir)
- [ ] Unggah foto/dokumen berfungsi
- [ ] Performa mulus (60fps)
- [ ] Penanganan izin sesuai (kamera, GPS, penyimpanan)
- [ ] Antarmuka berdasarkan peran (pegawai vs pimpinan unit kerja)
- [ ] Aset toko aplikasi siap

---

> [!IMPORTANT]
> Dokumen ini adalah **dokumen hidup**. Setiap perubahan arsitektur, fitur, atau cakupan harus
> didokumentasikan di sini sebelum diimplementasikan.

> [!TIP]
> **Prioritas pengembangan:** Otentikasi → Absensi (fitur inti) → Dinas Luar → Cuti → Kinerja Harian
> → Dasbor/Pemantauan → Laporan/Dapodik → Penyempurnaan/Pengujian

---

*Dibuat: 17 April 2026*
*Terakhir diperbarui: 22 April 2026*
*Proyek: MAHESA — Manajemen Human-resource & Employee System Application*
*Domain: Dinas Pendidikan*

---

## 📜 Log Issue & Progress

| ID Issue | Judul | Status | Tanggal Selesai |
|----------|-------|--------|-----------------|
| **#1** | [Backend] Inisialisasi Proyek Bun + Elysia & Setup Drizzle ORM | ✅ Selesai | 22 April 2026 |
| **#2** | [Backend] Pembuatan Skema Database Master Organisasi | ✅ Selesai | 22 April 2026 |
| **#3** | [Backend] Pembuatan Skema Pegawai & Struktur MDM | ✅ Selesai | 22 April 2026 |
| **#4** | [Backend] Setup Keamanan (JWT) & Endpoint Login | ✅ Selesai | 22 April 2026 |
| **#5** | [Backend] Sisa Endpoint Otentikasi & Integrasi Token FCM | ✅ Selesai | 22 April 2026 |
| **#6** | [Backend] API CRUD Modul Organisasi (Dinas & Unit Kerja) | ✅ Selesai | 22 April 2026 |
| **#7** | [Backend] API CRUD Modul Pegawai & Fitur Pencarian | ✅ Selesai | 22 April 2026 |
| **#8** | [Backend] Integrasi MinIO & API Upload Foto Profil | ✅ Selesai | 23 April 2026 |
| **#9** | [Backend] Sistem Pengajuan Biodata (Workflow Persetujuan) | 📋 Didelegasikan (issue9.md) | 23 April 2026 |
