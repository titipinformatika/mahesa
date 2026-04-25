"use client";

import { useQuery } from "@tanstack/react-query";
import { getTerlambatHariIni } from "@/lib/api/absensi";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AlertTriangle, Clock, MapPin } from "lucide-react";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function PegawaiTerlambatPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["absensi", "terlambat"],
    queryFn: getTerlambatHariIni,
    refetchInterval: 60000, // Refresh tiap menit untuk monitoring
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="size-6 text-amber-500" />
            Monitoring Terlambat Hari Ini
          </h1>
          <p className="text-muted-foreground text-sm">Daftar pegawai yang belum melakukan absen tepat waktu hari ini</p>
        </div>
        <div className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-medium border border-amber-500/20">
          Total: {data?.data?.length || 0} Pegawai
        </div>
      </div>

      <Card className="border-amber-200/50 dark:border-amber-500/20 overflow-hidden">
        <div className="p-4 bg-amber-500/5 border-b border-amber-200/50 dark:border-amber-500/20">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="size-3" /> Real-time monitoring: {format(new Date(), "HH:mm", { locale: id })} WIB
          </p>
        </div>
        
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Pegawai</TableHead>
              <TableHead>Unit Kerja</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={4} rows={5} />
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-none">Luar Biasa!</Badge>
                    <p>Semua pegawai hadir tepat waktu atau belum ada data keterlambatan.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-amber-50/50 dark:hover:bg-amber-500/5 transition-colors">
                  <TableCell className="font-medium">
                    <div>{item.nama_lengkap}</div>
                    <div className="text-xs text-muted-foreground font-mono">{item.nip || "-"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {item.nama_unit || "Unit Kerja Tidak Diketahui"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                      Terlambat
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.catatan || "Terdeteksi sistem"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
