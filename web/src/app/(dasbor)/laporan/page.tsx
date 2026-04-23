"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLaporanKeDinas, createLaporanKeDinas } from "@/lib/api";
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
import { FileBarChart, Plus, Download, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function LaporanKeDinasPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['laporan-ke-dinas'],
    queryFn: getLaporanKeDinas,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan ke Dinas</h1>
          <p className="text-slate-500 text-sm">Arsip laporan bulanan dan rekapitulasi yang dikirimkan ke Dinas Pendidikan</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Buat Laporan Baru
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Judul Laporan</TableHead>
              <TableHead>Jenis / Periode</TableHead>
              <TableHead>Tanggal Kirim</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">Memuat arsip laporan...</TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((h, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <FileText className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="font-semibold text-slate-800">{h.judul}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 uppercase text-[10px] font-bold">
                        {h.jenis_laporan}
                      </Badge>
                      <p className="text-[10px] text-slate-400 font-bold">{h.periode}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium">
                    {format(new Date(h.dibuat_pada), 'dd MMMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 border-none hover:bg-green-100 font-bold">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Terkirim
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" /> Unduh PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-400">Belum ada laporan yang dikirimkan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
