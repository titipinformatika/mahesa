"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCutiList, getSaldoCuti } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RekapCutiPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");

  const { data: cutiData, isLoading: isLoadingCuti } = useQuery({
    queryKey: ['cuti', page, status],
    queryFn: () => getCutiList({ 
      page, 
      limit: 10, 
      status: status === "all" ? undefined : status 
    }),
  });

  const { data: saldoData, isLoading: isLoadingSaldo } = useQuery({
    queryKey: ['saldo-cuti'],
    queryFn: () => getSaldoCuti(),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal">Disetujui</Badge>;
      case 'menunggu':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal">Menunggu</Badge>;
      case 'ditolak':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-normal">Ditolak</Badge>;
      case 'dibatalkan':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-normal">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Cuti</h1>
        <p className="text-slate-500 text-sm">Kelola pengajuan dan saldo cuti pegawai</p>
      </div>

      <Tabs defaultValue="pengajuan" className="w-full">
        <TabsList className="bg-slate-100 p-1 border border-slate-200">
          <TabsTrigger value="pengajuan" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Daftar Pengajuan
          </TabsTrigger>
          <TabsTrigger value="saldo" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Saldo Cuti
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pengajuan" className="mt-6 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-4">
              <span className="text-sm font-medium text-slate-600">Filter Status:</span>
              <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="menunggu">Menunggu</SelectItem>
                  <SelectItem value="disetujui">Disetujui</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nama Pegawai</TableHead>
                  <TableHead>Jenis Cuti</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCuti ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">Memuat...</TableCell>
                  </TableRow>
                ) : cutiData?.data?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.pegawai?.nama_lengkap}</TableCell>
                    <TableCell className="capitalize">{record.jenis_cuti.replace(/_/g, ' ')}</TableCell>
                    <TableCell className="text-slate-600 text-xs">
                      {format(new Date(record.tanggal_mulai), 'dd MMM')} - {format(new Date(record.tanggal_selesai), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-center">{record.total_hari} Hari</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600">Detail</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
              <span className="text-sm text-slate-500">
                Halaman {page} dari {cutiData?.meta?.total_halaman || 1}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Sebelumnya
                </Button>
                <Button variant="outline" size="sm" disabled={page >= (cutiData?.meta?.total_halaman || 1)} onClick={() => setPage(p => p + 1)}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saldo" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nama Pegawai</TableHead>
                  <TableHead>Jenis Cuti</TableHead>
                  <TableHead className="text-center text-blue-600">Total Jatah</TableHead>
                  <TableHead className="text-center text-red-600">Terpakai</TableHead>
                  <TableHead className="text-center font-bold text-green-600">Sisa Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSaldo ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Memuat...</TableCell>
                  </TableRow>
                ) : saldoData?.data?.map((saldo, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{saldo.nama_lengkap}</TableCell>
                    <TableCell className="capitalize">{saldo.jenis_cuti.replace(/_/g, ' ')}</TableCell>
                    <TableCell className="text-center">{saldo.total} Hari</TableCell>
                    <TableCell className="text-center">{saldo.terpakai} Hari</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{saldo.sisa} Hari</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
