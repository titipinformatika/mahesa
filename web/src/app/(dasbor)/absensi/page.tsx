"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAbsensiList } from "@/lib/api";
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
import { Calendar as CalendarIcon, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RekapAbsensiPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['absensi', page, status, date],
    queryFn: () => getAbsensiList({ 
      page, 
      limit: 10, 
      status: status === "all" ? undefined : status,
      tanggal: date ? format(date, 'yyyy-MM-dd') : undefined
    }),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-normal">Hadir</Badge>;
      case 'terlambat':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-normal">Terlambat</Badge>;
      case 'tidak_hadir':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 font-normal">Tidak Hadir</Badge>;
      case 'cuti':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-normal">Cuti</Badge>;
      case 'dinas_luar':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 font-normal">Dinas Luar</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rekap Absensi</h1>
          <p className="text-slate-500 text-sm">Lihat dan pantau kehadiran seluruh pegawai</p>
        </div>
        <Button variant="outline" className="border-slate-200">
          <Download className="w-4 h-4 mr-2" /> Ekspor ke Excel
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Filter:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal bg-white",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="hadir">Hadir</SelectItem>
              <SelectItem value="terlambat">Terlambat</SelectItem>
              <SelectItem value="tidak_hadir">Tidak Hadir</SelectItem>
              <SelectItem value="izin">Izin</SelectItem>
              <SelectItem value="sakit">Sakit</SelectItem>
              <SelectItem value="cuti">Cuti</SelectItem>
              <SelectItem value="dinas_luar">Dinas Luar</SelectItem>
            </SelectContent>
          </Select>

          {(date || status !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setDate(undefined); setStatus("all"); }}
              className="text-slate-500 hover:text-red-600"
            >
              Reset Filter
            </Button>
          )}
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Nama Pegawai</TableHead>
              <TableHead className="font-semibold text-slate-700">Tanggal</TableHead>
              <TableHead className="font-semibold text-slate-700">Tipe</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Jam Kerja</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Memuat data absensi...
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
                  <TableCell className="capitalize text-slate-600">
                    {record.tipe.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record.status)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {record.jam_kerja ? `${record.jam_kerja} Jam` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Tidak ada data absensi yang ditemukan.
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
    </div>
  );
}
