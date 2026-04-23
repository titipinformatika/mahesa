"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDinasLuarList } from "@/lib/api";
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
import { Search, Eye, Filter } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RekapDinasLuarPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [selectedDL, setSelectedDL] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['dinas-luar', page, status],
    queryFn: () => getDinasLuarList({ 
      page, 
      limit: 10, 
      status: status === "all" ? undefined : status 
    }),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal">Disetujui</Badge>;
      case 'menunggu':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal">Menunggu</Badge>;
      case 'sedang_berjalan':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal">Berjalan</Badge>;
      case 'selesai':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 font-normal">Selesai</Badge>;
      case 'ditolak':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-normal">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rekap Dinas Luar</h1>
          <p className="text-slate-500 text-sm">Monitoring penugasan dinas luar pegawai</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Status:</span>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="sedang_berjalan">Sedang Berjalan</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Nama Pegawai</TableHead>
              <TableHead className="font-semibold text-slate-700">Tanggal</TableHead>
              <TableHead className="font-semibold text-slate-700">Skema</TableHead>
              <TableHead className="font-semibold text-slate-700">Tujuan</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Memuat data dinas luar...
                </TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-800">
                    {record.pegawai?.nama_lengkap || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {format(new Date(record.tanggal), 'dd MMMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell className="text-slate-600 uppercase text-xs font-semibold">
                    {record.skema.replace(/_/g, ' ')}
                  </TableCell>
                  <TableCell className="text-slate-600 truncate max-w-[200px]">
                    {record.tujuan}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setSelectedDL(record)}
                    >
                      <Eye className="w-4 h-4 mr-2" /> Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Tidak ada data dinas luar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
          <span className="text-sm text-slate-500">
            Halaman {page} dari {data?.meta?.total_halaman || 1}
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
              disabled={page >= (data?.meta?.total_halaman || 1)}
              onClick={() => setPage(p => p + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedDL} onOpenChange={() => setSelectedDL(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Dinas Luar</DialogTitle>
            <DialogDescription>
              Informasi lengkap penugasan dinas luar
            </DialogDescription>
          </DialogHeader>
          
          {selectedDL && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Pegawai</label>
                  <p className="text-slate-800 font-medium">{selectedDL.pegawai?.nama_lengkap}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Tanggal</label>
                  <p className="text-slate-800">{format(new Date(selectedDL.tanggal), 'PPPP', { locale: id })}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Skema</label>
                  <p className="text-slate-800 uppercase font-semibold text-xs">{selectedDL.skema}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDL.status)}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Tujuan</label>
                  <p className="text-slate-800">{selectedDL.tujuan}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Keperluan</label>
                  <p className="text-slate-800 text-sm">{selectedDL.keperluan}</p>
                </div>
              </div>
              {selectedDL.catatan_pimpinan && (
                <div className="md:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <label className="text-xs font-bold text-slate-400 uppercase">Catatan Pimpinan</label>
                  <p className="text-slate-700 text-sm mt-1 italic">"{selectedDL.catatan_pimpinan}"</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
