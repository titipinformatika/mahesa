"use client";

import { useEffect, useState, use } from "react";
import { getPegawaiDetail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, UserCircle, Pencil } from "lucide-react";
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
      .then((res) => {
        if (res.status === "success") setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card className="p-8 space-y-6">
          <div className="flex gap-6">
            <Skeleton className="size-24 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <UserCircle className="size-16 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground">Data tidak ditemukan.</p>
        <Link href="/pegawai" className="mt-4">
          <Button variant="outline" className="gap-2"><ArrowLeft className="size-4" /> Kembali</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-masuk-fade">
      <div className="flex items-center gap-4">
        <Link href="/pegawai">
          <Button variant="outline" size="icon" className="hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detail Pegawai</h1>
          <p className="text-muted-foreground text-sm">Informasi lengkap profil pegawai</p>
        </div>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="p-6 sm:p-8 -mt-16 flex flex-col sm:flex-row gap-6 items-start sm:items-end">
          <div className="shrink-0">
            {data.url_foto ? (
              <Image
                src={data.url_foto}
                alt="Foto"
                width={112}
                height={112}
                className="size-28 rounded-full object-cover border-4 border-background shadow-xl"
              />
            ) : (
              <div className="size-28 rounded-full bg-muted border-4 border-background shadow-xl flex items-center justify-center">
                <UserCircle className="size-16 text-muted-foreground/50" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1 pt-2">
            <h2 className="text-2xl font-bold">{data.nama_lengkap}</h2>
            <p className="text-muted-foreground font-mono text-sm">{data.nip || "NIP Belum Diisi"}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {data.aktif ? (
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">Aktif</Badge>
              ) : (
                <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">Nonaktif</Badge>
              )}
              <Badge variant="outline">{data.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</Badge>
            </div>
          </div>
          <Button variant="outline" className="gap-2 hover:-translate-y-0.5 transition-transform"><Pencil className="size-4" /> Edit</Button>
        </div>

        <div className="border-t border-border p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Biodata Diri</h3>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">NIK</dt>
                <dd className="col-span-2 font-medium">{data.nik}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Tempat, Tgl Lahir</dt>
                <dd className="col-span-2 font-medium">
                  {data.tempat_lahir || "-"}, {data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString("id-ID") : "-"}
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Agama</dt>
                <dd className="col-span-2 font-medium capitalize">{data.agama || "-"}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Kontak &amp; Alamat</h3>
            <dl className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-2 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Telepon</dt>
                <dd className="col-span-2 font-medium">{data.telepon || "-"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Alamat</dt>
                <dd className="col-span-2 font-medium leading-relaxed">{data.alamat || "-"}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Darurat</dt>
                <dd className="col-span-2 font-medium">
                  {data.nama_kontak_darurat || "-"} / {data.telepon_kontak_darurat || "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Card>
    </div>
  );
}
