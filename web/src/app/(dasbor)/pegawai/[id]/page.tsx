"use client";

import { useEffect, useState, use } from "react";
import { getPegawaiDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import Image from "next/image";

interface PegawaiDetail {
  id: string;
  nama_lengkap: string;
  nip?: string;
  nik: string;
  jenis_kelamin: string;
  aktif: boolean;
  url_foto?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  agama?: string;
  telepon?: string;
  alamat?: string;
  nama_kontak_darurat?: string;
  telepon_kontak_darurat?: string;
}

export default function DetailPegawaiPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [data, setData] = useState<PegawaiDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPegawaiDetail(id)
      .then(res => {
        if (res.status === "success") setData(res.data as unknown as PegawaiDetail);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat detail...</div>;
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
            <Image 
              src={data.url_foto} 
              alt="Foto" 
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-slate-100" 
            />
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
