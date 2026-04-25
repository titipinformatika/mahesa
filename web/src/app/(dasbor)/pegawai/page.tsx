"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPegawaiList } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus, Eye, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Pegawai {
  id: string;
  nama_lengkap: string;
  nip?: string;
  nik: string;
  jenis_kelamin: string;
  aktif: boolean;
}

export default function DaftarPegawaiPage() {
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total_halaman: 1 });

  const fetchPegawai = async (q = "", p = 1) => {
    try {
      setLoading(true);
      const res = await getPegawaiList(p, 10, q);
      if (res.status === "success") {
        setPegawai((res.data as any) || []);
        setMeta({ total_halaman: res.meta?.total_halaman || 1 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai(search, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manajemen Pegawai</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola data pegawai pada instansi Anda</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
          <Plus className="size-4" /> Tambah Pegawai
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div className="p-4 border-b border-border bg-muted/30">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama pegawai..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">Cari</Button>
          </form>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
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
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : pegawai.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground">
                    <Users className="size-10 mx-auto mb-3 opacity-40" />
                    Tidak ada data pegawai.
                  </td>
                </tr>
              ) : (
                pegawai.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 hover:bg-muted/40 transition-colors animate-masuk-fade"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <td className="px-6 py-4 font-medium">{p.nama_lengkap}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{p.nip || p.nik}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</td>
                    <td className="px-6 py-4">
                      {p.aktif ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30">Aktif</Badge>
                      ) : (
                        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/30">Nonaktif</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/pegawai/${p.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 gap-1">
                          <Eye className="size-4" /> Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-border">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))
          ) : pegawai.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <Users className="size-10 mx-auto mb-3 opacity-40" />
              Tidak ada data pegawai.
            </div>
          ) : (
            pegawai.map((p, i) => (
              <div
                key={p.id}
                className="p-4 hover:bg-muted/40 transition-colors animate-masuk-fade"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{p.nama_lengkap}</p>
                    <p className="text-xs text-muted-foreground font-mono truncate">{p.nip || p.nik}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{p.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</Badge>
                      {p.aktif ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">Aktif</Badge>
                      ) : (
                        <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">Nonaktif</Badge>
                      )}
                    </div>
                  </div>
                  <Link href={`/pegawai/${p.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary gap-1">
                      <Eye className="size-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 bg-muted/20">
          <span className="text-sm text-muted-foreground">
            Halaman {page} dari {meta.total_halaman || 1}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled={page >= (meta.total_halaman || 1)} onClick={() => setPage((p) => p + 1)}>
              Selanjutnya
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
