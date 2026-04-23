"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getUnitKerjaDetail, getPegawaiList } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Info } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function UnitKerjaDetailPage() {
  const { id } = useParams();

  const { data: unit, isLoading: isLoadingUnit } = useQuery({
    queryKey: ['unit-kerja-detail', id],
    queryFn: () => getUnitKerjaDetail(id as string),
  });

  const { data: pegawais, isLoading: isLoadingPegawai } = useQuery({
    queryKey: ['unit-kerja-pegawai', id],
    queryFn: () => getPegawaiList(1, 100, ""), // Placeholder: filter by unit logic in API later
  });

  if (isLoadingUnit) return <div className="p-8 text-center">Memuat data unit kerja...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-xl">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{unit?.data?.nama}</h1>
          <p className="text-slate-500 text-sm">{unit?.data?.jenis_unit} • {unit?.data?.kode_unit}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200">
            <CardTitle className="text-sm font-semibold flex items-center">
              <Info className="w-4 h-4 mr-2 text-slate-400" /> Informasi Umum
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat</p>
              <p className="text-sm text-slate-700">{unit?.data?.alamat || 'Alamat belum diatur'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Koordinat</p>
              <p className="text-sm text-slate-700 flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                {unit?.data?.latitude ? `${unit.data.latitude}, ${unit.data.longitude}` : 'Belum diatur'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radius Absensi</p>
              <p className="text-sm text-slate-700 font-semibold">{unit?.data?.radius_absensi_meter || 100} Meter</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-200">
            <CardTitle className="text-sm font-semibold flex items-center">
              <Users className="w-4 h-4 mr-2 text-slate-400" /> Daftar Pegawai Unit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP/NIK</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPegawai ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">Memuat...</TableCell>
                  </TableRow>
                ) : pegawais?.data?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-slate-800">{p.nama_lengkap}</TableCell>
                    <TableCell className="text-slate-500 text-xs">{p.nip || p.nik}</TableCell>
                    <TableCell className="text-slate-600">Staff</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Aktif</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
