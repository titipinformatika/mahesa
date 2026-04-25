"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getUnitKerjaDetail, getUnitKerjaPegawai } from "@/lib/api/organisasi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users, Info, ArrowLeft, Phone, Mail, Radio } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function UnitKerjaDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: unitRes, isLoading: isLoadingUnit } = useQuery({
    queryKey: ['unit-kerja-detail', id],
    queryFn: () => getUnitKerjaDetail(id as string),
    enabled: !!id,
  });

  const { data: pegawaiRes, isLoading: isLoadingPegawai } = useQuery({
    queryKey: ['unit-kerja-pegawai', id],
    queryFn: () => getUnitKerjaPegawai(id as string),
    enabled: !!id,
  });

  if (isLoadingUnit) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 md:col-span-2 rounded-xl" />
        </div>
      </div>
    );
  }

  const unit = unitRes?.data;

  if (!unit) {
    return (
      <div className="text-center py-12 text-slate-500">
        Unit kerja tidak ditemukan.{" "}
        <Button variant="link" onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="p-3 bg-blue-600 rounded-xl">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{unit.nama}</h1>
          <p className="text-slate-500 text-sm uppercase">{unit.jenis.replace(/_/g, ' ')} • {unit.kode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200">
            <CardTitle className="text-sm font-semibold flex items-center">
              <Info className="w-4 h-4 mr-2 text-slate-400" /> Informasi Umum
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat</p>
              <p className="text-sm text-slate-700">{unit.alamat || 'Alamat belum diatur'}</p>
            </div>
            
            {unit.telepon && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telepon</p>
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-400" /> {unit.telepon}
                </p>
              </div>
            )}

            {unit.email && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                <p className="text-sm text-slate-700 flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-400" /> {unit.email}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Koordinat GPS</p>
              <p className="text-sm text-slate-700 flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                {unit.latitude ? `${unit.latitude}, ${unit.longitude}` : 'Belum diatur'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radius Absensi</p>
              <p className="text-sm text-slate-700 font-semibold flex items-center gap-2">
                <Radio className="w-3 h-3 text-blue-500" />
                {unit.radius_absensi_meter || 100} Meter
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200">
            <CardTitle className="text-sm font-semibold flex items-center">
              <Users className="w-4 h-4 mr-2 text-slate-400" /> Daftar Pegawai Unit ({pegawaiRes?.data?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>NIP/NIK</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPegawai ? (
                  Array(3).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : pegawaiRes?.data && pegawaiRes.data.length > 0 ? (
                  pegawaiRes.data.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-slate-800">{p.nama_lengkap}</TableCell>
                      <TableCell className="text-slate-500 text-xs font-mono">{p.nip || p.nik}</TableCell>
                      <TableCell className="text-slate-600">{p.jabatan || 'Staf'}</TableCell>
                      <TableCell>
                        <Badge className={p.aktif ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>
                          {p.aktif ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-400 italic">
                      Belum ada pegawai terdaftar di unit ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
