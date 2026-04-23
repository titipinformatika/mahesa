"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTerlambatList } from "@/lib/api";
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
import { AlertTriangle, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PegawaiTerlambatPage() {
  const [bulan, setBulan] = useState<number>(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());

  const { data, isLoading } = useQuery({
    queryKey: ['absensi-terlambat', bulan, tahun],
    queryFn: () => getTerlambatList(bulan, tahun),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pegawai Terlambat</h1>
          <p className="text-slate-500 text-sm">Monitoring pegawai dengan frekuensi keterlambatan tinggi</p>
        </div>
        <Button variant="outline" className="border-slate-200">
          <Download className="w-4 h-4 mr-2" /> Ekspor Laporan
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Periode:</span>
            <Select value={bulan.toString()} onValueChange={(v) => v && setBulan(parseInt(v))}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2000, i, 1))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tahun.toString()} onValueChange={(v) => v && setTahun(parseInt(v))}>
              <SelectTrigger className="w-[100px] bg-white">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                {[tahun - 1, tahun, tahun + 1].map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Nama Pegawai</TableHead>
              <TableHead className="font-semibold text-slate-700">Unit Kerja</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Jumlah Terlambat</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Jumlah Tidak Hadir</TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">Total Hari Bermasalah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Memuat data keterlambatan...
                </TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((item: any, idx: number) => {
                const total = (item.jumlah_terlambat || 0) + (item.jumlah_tidak_hadir || 0);
                return (
                  <TableRow key={idx} className={cn("hover:bg-slate-50/50", total > 5 && "bg-red-50/30")}>
                    <TableCell className="font-medium text-slate-800">
                      {item.nama_lengkap}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {item.nama_unit}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50">
                        {item.jumlah_terlambat} Kali
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
                        {item.jumlah_tidak_hadir} Kali
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      <span className={cn(total > 5 ? "text-red-600" : "text-slate-700")}>
                        {total} Hari
                        {total > 5 && <AlertTriangle className="w-4 h-4 inline ml-1 text-red-500" />}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Tidak ada data keterlambatan pada periode ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
