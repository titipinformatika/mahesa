# 📋 Eksekusi Issue #12: [Web] Tata Letak Dasbor & Manajemen Pegawai Dasar

Panduan **langkah-demi-langkah** untuk membuat layout dasbor dan halaman manajemen pegawai di web frontend MAHESA.

---

## 📚 Konteks

### Apa yang akan dibuat?
1. Layout utama dasbor (Sidebar + Header) dengan menu navigasi yang dinamis sesuai peran (*role*).
2. Halaman daftar pegawai lengkap dengan Data Table (pencarian, paginasi).
3. Halaman detail pegawai.

### Struktur Folder Target
```
web/src/
├── app/
│   ├── (dasbor)/
│   │   ├── layout.tsx         <- Layout Sidebar & Header
│   │   ├── dasbor/page.tsx    <- Dasbor utama
│   │   └── pegawai/
│   │       ├── page.tsx       <- Daftar Pegawai
│   │       └── [id]/page.tsx  <- Detail Pegawai
├── components/
│   ├── ui/                    <- (Button, Table, Input, dll via shadcn)
│   └── tata-letak/
│       ├── sidebar.tsx
│       └── header.tsx
├── lib/
│   ├── api.ts                 <- Tambahan pemanggilan endpoint API
│   └── auth.ts
```

---

## 🛠️ Langkah 1: Install Library Tambahan

Buka terminal di folder `web/`:
```bash
cd web
npm install lucide-react @tanstack/react-table
npx -y shadcn@latest add table badge skeleton dropdown-menu avatar
```

---

## 🛠️ Langkah 2: Buat Komponen Tata Letak (Sidebar & Header)

### 2a. Komponen Sidebar: `web/src/components/tata-letak/sidebar.tsx`
```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, Building, Calendar, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [peran, setPeran] = useState<string | undefined>("");

  useEffect(() => {
    setPeran(getRole());
  }, []);

  // Menu dinamis berdasarkan peran
  const menu = [
    { name: "Dasbor", path: "/dasbor", icon: LayoutDashboard, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Pegawai", path: "/pegawai", icon: Users, roles: ["admin_dinas", "admin_upt", "admin_unit"] },
    { name: "Unit Kerja", path: "/unit-kerja", icon: Building, roles: ["admin_dinas"] },
    { name: "Absensi", path: "/absensi", icon: Calendar, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Pengaturan", path: "/pengaturan", icon: Settings, roles: ["admin_dinas"] },
  ];

  const filteredMenu = menu.filter(m => m.roles.includes(peran || ""));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 hidden md:flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="font-bold text-xl text-white tracking-wider">🏛️ MAHESA</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

### 2b. Komponen Header: `web/src/components/tata-letak/header.tsx`
```tsx
"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    removeAuth();
    router.replace("/masuk");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">Panel Kontrol</h2>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 bg-slate-200">
                <AvatarFallback className="text-slate-600 font-bold"><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Pengguna Aktif</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

### 2c. Update Layout Dasbor: `web/src/app/(dasbor)/layout.tsx`
Buat file ini (atau timpa jika sudah ada):
```tsx
import { Header } from "@/components/tata-letak/header";
import { Sidebar } from "@/components/tata-letak/sidebar";

export default function DasborLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 🛠️ Langkah 3: Update Helper API Pegawai

Tambahkan pemanggilan API pegawai di `web/src/lib/api.ts`.
Buka `web/src/lib/api.ts` dan tambahkan kode berikut di baris terbawah:

```typescript
import { getToken } from "./auth";

// --- Tambahan Helper Fetch Dengan Token ---
async function fetchWithToken(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      // Token tidak valid/expired
      if (typeof window !== "undefined") {
         window.location.href = "/masuk";
      }
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Terjadi kesalahan pada server');
  }
  return res.json();
}

// --- API Pegawai ---
export async function getPegawaiList(page: number = 1, limit: number = 10, search: string = "") {
  const url = `/v1/pegawai?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  return fetchWithToken(url);
}

export async function getPegawaiDetail(id: string) {
  return fetchWithToken(`/v1/pegawai/${id}`);
}
```

---

## 🛠️ Langkah 4: Buat Halaman Daftar Pegawai

Buat file `web/src/app/(dasbor)/pegawai/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPegawaiList } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DaftarPegawaiPage() {
  const [pegawai, setPegawai] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total_halaman: 1 });

  const fetchPegawai = async (q = "", p = 1) => {
    try {
      setLoading(true);
      const res = await getPegawaiList(p, 10, q);
      if (res.status === "success") {
        setPegawai(res.data);
        setMeta(res.meta);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai(search, page);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPegawai(search, 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pegawai</h1>
          <p className="text-slate-500 text-sm">Kelola data pegawai pada instansi Anda</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Pegawai
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari nama pegawai..." 
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">Cari</Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Nama Lengkap</th>
                <th className="px-6 py-3 font-medium">NIP / NIK</th>
                <th className="px-6 py-3 font-medium">L/P</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : pegawai.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada data pegawai.
                  </td>
                </tr>
              ) : (
                pegawai.map((p) => (
                  <tr key={p.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{p.nama_lengkap}</td>
                    <td className="px-6 py-4 text-slate-500">{p.nip || p.nik}</td>
                    <td className="px-6 py-4 text-slate-500">{p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                    <td className="px-6 py-4">
                      {p.aktif ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal">Aktif</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-normal">Nonaktif</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/pegawai/${p.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-2" /> Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi Sederhana */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
          <span className="text-sm text-slate-500">
            Halaman {page} dari {meta.total_halaman || 1}
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Sebelumnya
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page >= (meta.total_halaman || 1)}
              onClick={() => setPage(p => p + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🛠️ Langkah 5: Buat Halaman Detail Pegawai

Buat folder `web/src/app/(dasbor)/pegawai/[id]` lalu buat file `page.tsx`:

```tsx
"use client";

import { useEffect, useState, use } from "react";
import { getPegawaiDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DetailPegawaiPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPegawaiDetail(id)
      .then(res => {
        if (res.status === "success") setData(res.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat detail...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/pegawai">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Detail Pegawai</h1>
          <p className="text-slate-500 text-sm">Informasi lengkap profil pegawai</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center border-b border-slate-100">
          {data.url_foto ? (
            <img src={data.url_foto} alt="Foto" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100" />
          ) : (
            <UserCircle className="w-24 h-24 text-slate-300" />
          )}
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">{data.nama_lengkap}</h2>
            <p className="text-slate-500 font-mono">{data.nip || "NIP Belum Diisi"}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={data.aktif ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                {data.aktif ? "Aktif" : "Nonaktif"}
              </Badge>
              <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200">
                {data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
              </Badge>
            </div>
          </div>
          <Button variant="outline">Edit Pegawai</Button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Biodata Diri</h3>
              <dl className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">NIK</dt>
                  <dd className="col-span-2 font-medium text-slate-900">{data.nik}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Tempat, Tgl Lahir</dt>
                  <dd className="col-span-2 font-medium text-slate-900">
                    {data.tempat_lahir || '-'}, {data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID') : '-'}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Agama</dt>
                  <dd className="col-span-2 font-medium text-slate-900 capitalize">{data.agama || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Kontak & Alamat</h3>
              <dl className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Telepon</dt>
                  <dd className="col-span-2 font-medium text-slate-900">{data.telepon || '-'}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Alamat Lengkap</dt>
                  <dd className="col-span-2 font-medium text-slate-900 leading-relaxed">{data.alamat || '-'}</dd>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <dt className="text-slate-500">Darurat (Nama/HP)</dt>
                  <dd className="col-span-2 font-medium text-slate-900">
                    {data.nama_kontak_darurat || '-'} / {data.telepon_kontak_darurat || '-'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Langkah 6: Pengujian

### Prasyarat
1. Backend berjalan di `http://localhost:3000` (`bun run dev`).
2. Web berjalan di `http://localhost:3001` (`npm run dev`).

### Skenario Test

| # | Skenario | Aksi | Expected |
|---|----------|------|----------|
| 1 | Cek Login Admin | Login dengan `admin@disdik.go.id` (`password123`) | Diarahkan ke dasbor, Sidebar muncul lengkap dengan menu "Pegawai" dan "Unit Kerja" |
| 2 | Buka Halaman Pegawai | Klik menu "Pegawai" di sidebar | Tampil DataTable dengan daftar pegawai. |
| 3 | Pencarian Pegawai | Ketik nama pegawai di kotak pencarian, tekan enter | Tabel hanya menampilkan hasil yang relevan. |
| 4 | Cek Paginasi | Jika data lebih dari 10, klik tombol "Selanjutnya" | Tabel menampilkan halaman berikutnya. |
| 5 | Buka Detail Pegawai | Klik tombol "Detail" pada salah satu baris | Pindah ke halaman profil pegawai dan menampilkan biodata lengkap. |

Jika semua skenario **passed** → Issue ini **SELESAI**.
