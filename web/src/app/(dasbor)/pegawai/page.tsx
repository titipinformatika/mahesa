"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPegawaiList } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        setPegawai(res.data);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
