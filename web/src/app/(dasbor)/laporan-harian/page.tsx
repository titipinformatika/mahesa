"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLaporanHarianList, getLaporanHarianDetail } from "@/lib/api";
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
import { Eye, FileText, CheckCircle, RotateCcw, XCircle } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LaporanHarianPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['laporan-harian', page, status],
    queryFn: () => getLaporanHarianList({ 
      page, 
      limit: 10, 
      status: status === "all" ? undefined : status 
    }),
  });

  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['laporan-harian-detail', selectedId],
    queryFn: () => selectedId ? getLaporanHarianDetail(selectedId) : null,
    enabled: !!selectedId
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal"><CheckCircle className="w-3 h-3 mr-1"/> Disetujui</Badge>;
      case 'menunggu':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal"><FileText className="w-3 h-3 mr-1"/> Menunggu</Badge>;
      case 'direvisi':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal"><RotateCcw className="w-3 h-3 mr-1"/> Direvisi</Badge>;
      case 'ditolak':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-normal"><XCircle className="w-3 h-3 mr-1"/> Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Kinerja Harian</h1>
          <p className="text-slate-500 text-sm">Monitoring laporan kegiatan harian (LHKP) pegawai</p>
        </div>
      </div>

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
              <SelectItem value="direvisi">Direvisi</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nama Pegawai</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-center">Jumlah Kegiatan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Peninjau</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Memuat...</TableCell>
              </TableRow>
            ) : data?.data?.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium text-slate-800">
                  {record.pegawai?.nama_lengkap}
                </TableCell>
                <TableCell className="text-slate-600">
                  {format(new Date(record.tanggal), 'dd MMMM yyyy', { locale: id })}
                </TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                    {record.jumlah_kegiatan} Kegiatan
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(record.status)}
                </TableCell>
                <TableCell className="text-slate-500 text-xs italic">
                  {record.peninjau?.nama_lengkap || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => setSelectedId(record.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
          <span className="text-sm text-slate-500">
            Halaman {page} dari {data?.meta?.total_halaman || 1}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled={page >= (data?.meta?.total_halaman || 1)} onClick={() => setPage(p => p + 1)}>
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedId} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Kegiatan Harian</DialogTitle>
          </DialogHeader>
          
          {isLoadingDetail ? (
            <div className="py-20 text-center">Memuat detail kegiatan...</div>
          ) : detailData?.data && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pegawai</p>
                  <p className="text-sm font-semibold text-slate-800">{detailData.data.pegawai?.nama_lengkap}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</p>
                  <p className="text-sm text-slate-800">{format(new Date(detailData.data.tanggal), 'PPPP', { locale: id })}</p>
                </div>
              </div>

              <div className="space-y-4">
                {detailData.data.detail_kegiatan?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 border border-slate-100 rounded-lg bg-white shadow-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                        {item.master_jenis_kegiatan_lhkp?.nama || 'Kegiatan Lain'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.jam_mulai} - {item.jam_selesai}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed">{item.uraian_kegiatan}</p>
                    {item.hasil_kegiatan && (
                      <p className="text-xs text-slate-500 border-t pt-2 mt-2">
                        <span className="font-bold">Hasil:</span> {item.hasil_kegiatan}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
