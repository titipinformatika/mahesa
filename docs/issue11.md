# 📋 Eksekusi Issue: [Web] Inisialisasi Proyek Next.js & Halaman Masuk

Panduan **langkah-demi-langkah** untuk menginisialisasi frontend web MAHESA dan membangun halaman login.

---

## 📚 Konteks

### Apa yang akan dibuat?
Halaman login untuk Web Dashboard MAHESA. Admin Dinas/Unit akan menggunakan halaman ini untuk masuk ke sistem melalui browser. Setelah berhasil login, pengguna akan diarahkan (*redirect*) ke halaman dasbor utama.

### Akun Test (dari Seeder)
| Email | Password | Peran |
|-------|----------|-------|
| `admin@disdik.go.id` | `password123` | admin_dinas |
| `kepala.sdn01@disdik.go.id` | `password123` | pimpinan |

### Kontrak API Login
```
POST http://localhost:3000/v1/otentikasi/masuk

Request Body (JSON):
{
  "email": "admin@disdik.go.id",
  "password": "password123"
}

Response Berhasil (200):
{
  "status": "success",
  "message": "Berhasil login",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "peran": "admin_dinas"
  }
}

Response Gagal (401):
{
  "status": "error",
  "message": "Kata sandi salah"
}
```

### 📁 Struktur Folder Target (dari `planningall.md` Bab 10.1)

Ini adalah blueprint lengkap. Issue ini hanya mengerjakan bagian `(otentikasi)/` dan placeholder `(dasbor)/`.

```
web/
├── src/
│   ├── app/
│   │   ├── (otentikasi)/               ← ✅ Dikerjakan di issue ini
│   │   │   ├── masuk/page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dasbor)/                   ← ✅ Placeholder di issue ini
│   │   │   ├── layout.tsx              # Sidebar + Header
│   │   │   ├── page.tsx                # Halaman utama dasbor
│   │   │   ├── pegawai/               # 🔜 Issue berikutnya
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── impor/page.tsx
│   │   │   ├── absensi/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── terlambat/page.tsx
│   │   │   │   └── ekspor/page.tsx
│   │   │   ├── dinas-luar/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── pelacakan/page.tsx  # Peta Leaflet + OpenStreetMap
│   │   │   │   └── skema/page.tsx
│   │   │   ├── cuti/page.tsx
│   │   │   ├── laporan-harian/page.tsx
│   │   │   ├── biodata/page.tsx
│   │   │   ├── pengumuman/
│   │   │   │   ├── page.tsx
│   │   │   │   └── baru/page.tsx
│   │   │   ├── pemantauan/page.tsx
│   │   │   ├── laporan/page.tsx
│   │   │   ├── unit-kerja/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── dapodik/page.tsx
│   │   │   └── pengaturan/page.tsx
│   │   │
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── komponen/
│   │   ├── ui/                         # shadcn/ui components
│   │   ├── tata-letak/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── navigasi-mobile.tsx
│   │   ├── peta/                       # Leaflet + OpenStreetMap
│   │   │   ├── peta-pelacakan.tsx
│   │   │   └── penanda-lokasi.tsx
│   │   ├── pegawai/
│   │   ├── absensi/
│   │   └── dasbor/
│   │
│   ├── hooks/                          # Custom React hooks
│   ├── lib/                            # api.ts, auth.ts, utils.ts
│   ├── stores/                         # Zustand state management
│   └── tipe/                           # TypeScript interfaces
│
├── next.config.ts
├── tailwind.config.ts
├── components.json                     # shadcn/ui config
└── package.json
```

---

## 🛠️ Langkah 1: Inisialisasi Proyek Next.js

Jalankan dari **root folder** proyek `MAHESA/`:

```bash
npx -y create-next-app@latest ./web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Penjelasan flag:
- `--typescript`: Gunakan TypeScript
- `--tailwind`: Aktifkan Tailwind CSS secara otomatis
- `--eslint`: Aktifkan ESLint
- `--app`: Gunakan App Router (bukan Pages Router)
- `--src-dir`: Buat folder `src/`
- `--import-alias "@/*"`: Alias import `@/` → `src/`

### Verifikasi
```bash
cd web
npm run dev
```
Buka `http://localhost:3001` → harus muncul halaman default Next.js.

---

## 🛠️ Langkah 2: Install shadcn/ui

```bash
cd web
npx -y shadcn@latest init -d
```

Pilih opsi:
- Style: **New York**
- Base color: **Slate**
- CSS variables: **Yes**

### Install Komponen yang Dibutuhkan
```bash
npx -y shadcn@latest add button input label card
```

### Install Dependensi Tambahan
```bash
npm install js-cookie
npm install -D @types/js-cookie
```

Struktur folder setelah langkah ini:
```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/          ← Komponen shadcn di sini
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── card.tsx
│   └── lib/
│       └── utils.ts     ← Helper shadcn (cn function)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 🛠️ Langkah 3: Konfigurasi Environment Variable

Buat file `web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🛠️ Langkah 4: Buat Helper API & Auth

### 4a. File: `web/src/lib/api.ts`
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  data?: {
    token: string;
    peran: string;
  };
}

export async function loginAPI(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/v1/otentikasi/masuk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

### 4b. File: `web/src/lib/auth.ts`
```typescript
import Cookies from 'js-cookie';

const TOKEN_KEY = 'mahesa_token';
const ROLE_KEY = 'mahesa_peran';

export function saveAuth(token: string, peran: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 hari
  Cookies.set(ROLE_KEY, peran, { expires: 1 });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getRole(): string | undefined {
  return Cookies.get(ROLE_KEY);
}

export function removeAuth() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
```

---

## 🛠️ Langkah 5: Buat Halaman Login

### 5a. Buat Layout Otentikasi: `web/src/app/(otentikasi)/layout.tsx`
```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {children}
    </div>
  );
}
```

### 5b. Buat Halaman Login: `web/src/app/(otentikasi)/masuk/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAPI } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAPI({ email, password });

      if (result.status === "success" && result.data) {
        // Simpan token & peran ke Cookies
        saveAuth(result.data.token, result.data.peran);
        // Redirect ke dasbor
        router.push("/dasbor");
      } else {
        setError(result.message || "Login gagal");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-4 shadow-2xl border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-white">
          🏛️ MAHESA
        </CardTitle>
        <CardDescription className="text-slate-300">
          Manajemen Human-resource & Employee System
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-300 bg-red-900/30 border border-red-700/50 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@disdik.go.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Kata Sandi
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## 🛠️ Langkah 6: Buat Halaman Dasbor Placeholder

### File: `web/src/app/(dasbor)/dasbor/page.tsx`
```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getRole, removeAuth, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [peran, setPeran] = useState<string | undefined>("");

  useEffect(() => {
    // Cek autentikasi: jika belum login, redirect ke halaman masuk
    if (!isAuthenticated()) {
      router.replace("/masuk");
      return;
    }
    setPeran(getRole());
  }, [router]);

  const handleLogout = () => {
    removeAuth();
    router.replace("/masuk");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🏛️ Dasbor MAHESA</h1>
          <Button variant="outline" onClick={handleLogout}>
            Keluar
          </Button>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <p className="text-lg">
            Selamat datang! Anda login sebagai:{" "}
            <span className="font-bold text-blue-400">{peran}</span>
          </p>
          <p className="text-slate-400 mt-2">
            Halaman ini adalah placeholder. Fitur dasbor akan dikembangkan di
            Issue berikutnya.
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 🛠️ Langkah 7: Update Root Page (Redirect ke Login)

### File: `web/src/app/page.tsx` (Replace isinya)
```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/masuk");
}
```

---

## 🛠️ Langkah 8: Konfigurasi CORS di Backend

Pastikan backend mengizinkan request dari `localhost:3001` (port Next.js dev). Cek file `backend/src/index.ts` dan pastikan CORS sudah diaktifkan. Jika belum:
```bash
cd ../backend
bun add @elysiajs/cors
```
Kemudian tambahkan di `index.ts`:
```typescript
import { cors } from '@elysiajs/cors';

const app = new Elysia()
  .use(cors()) // <-- Tambahkan ini sebelum route
  // ... route lainnya
```

---

## 🧪 Langkah 9: Pengujian

### Prasyarat
1. Backend berjalan di `http://localhost:3000` → `cd backend && bun run dev`
2. Database sudah di-seed → `cd backend && bun run db:seed`

### Jalankan Frontend
```bash
cd web
npm run dev
```

### Skenario Test

| # | Skenario | Aksi | Expected |
|---|----------|------|----------|
| 1 | Buka root | Akses `http://localhost:3001` | Redirect otomatis ke `/masuk` |
| 2 | Login berhasil | Email: `admin@disdik.go.id`, Pass: `password123` → klik Masuk | Redirect ke `/dasbor`, tampil peran `admin_dinas` |
| 3 | Login gagal (password salah) | Email benar, Pass: `salah` → klik Masuk | Tampil pesan error merah |
| 4 | Login gagal (email salah) | Email: `xyz@test.com`, Pass: apapun | Tampil pesan error merah |
| 5 | Akses dasbor tanpa login | Hapus cookies → akses `/dasbor` langsung | Redirect ke `/masuk` |
| 6 | Logout | Klik tombol "Keluar" di dasbor | Cookies dihapus, redirect ke `/masuk` |
| 7 | Cek cookies | Setelah login berhasil, buka DevTools → Application → Cookies | Ada `mahesa_token` dan `mahesa_peran` |

Jika semua skenario **passed** → Issue ini **SELESAI**.
