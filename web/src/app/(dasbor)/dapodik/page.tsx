"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkDapodikDiff, runDapodikSync, getDapodikSyncHistory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2, AlertTriangle, Clock, History } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DapodikSyncPage() {
  const queryClient = useQueryClient();

  const { data: diff, isLoading: isLoadingDiff, refetch: refetchDiff } = useQuery({
    queryKey: ['dapodik-diff'],
    queryFn: checkDapodikDiff,
    enabled: false, // Only manual trigger
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['dapodik-history'],
    queryFn: getDapodikSyncHistory,
  });

  const syncMutation = useMutation({
    mutationFn: runDapodikSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dapodik-history'] });
      queryClient.invalidateQueries({ queryKey: ['pegawai'] });
      showSuccess("Sinkronisasi Dapodik berhasil dilakukan");
    },
    onError: (err: any) => showError(err.message)
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sinkronisasi Dapodik</h1>
          <p className="text-slate-500 text-sm">Sinkronkan data pegawai Anda dengan database Dapodik Kemdikbud</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => refetchDiff()}
          disabled={isLoadingDiff}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoadingDiff && "animate-spin")} />
          Cek Perbedaan Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kontrol Sinkronisasi */}
        <Card className="lg:col-span-1 border-slate-200 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Status Sinkronisasi</CardTitle>
            <CardDescription>Ringkasan perbedaan data yang ditemukan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!diff ? (
              <div className="py-10 text-center space-y-2 opacity-50">
                <RefreshCw className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Klik tombol di atas untuk melihat perbedaan data</p>
              </div>
            ) : (
              <div className="space-y-4">
                <DiffItem label="Data Baru" value={diff.data?.baru || 0} color="text-green-600" bgColor="bg-green-50" />
                <DiffItem label="Perlu Update" value={diff.data?.update || 0} color="text-blue-600" bgColor="bg-blue-50" />
                <DiffItem label="Data Konflik" value={diff.data?.konflik || 0} color="text-yellow-600" bgColor="bg-yellow-50" />
                <DiffItem label="Tidak Berubah" value={diff.data?.tetap || 0} color="text-slate-400" bgColor="bg-slate-50" />
                
                <div className="pt-4 border-t border-slate-100">
                  <Button 
                    className="w-full bg-blue-600" 
                    onClick={() => syncMutation.mutate()}
                    disabled={syncMutation.isPending || (diff.data?.baru === 0 && diff.data?.update === 0)}
                  >
                    {syncMutation.isPending ? "Sedang Menyinkronkan..." : "Jalankan Sinkronisasi Sekarang"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Riwayat Sinkronisasi */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Riwayat Sinkronisasi</CardTitle>
              <CardDescription>Daftar proses sinkronisasi yang telah dijalankan</CardDescription>
            </div>
            <History className="w-5 h-5 text-slate-300" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Waktu Eksekusi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Statistik</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingHistory ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">Memuat riwayat...</TableCell>
                  </TableRow>
                ) : history?.data && history.data.length > 0 ? (
                  history.data.map((h, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs font-medium">
                        {format(new Date(h.dibuat_pada), 'PPP p', { locale: id })}
                      </TableCell>
                      <TableCell>
                        {h.status === 'sukses' ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Sukses
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold">
                            Gagal
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2 text-[10px] font-bold">
                          <span className="text-green-600">+{h.summary?.baru}</span>
                          <span className="text-blue-600">~{h.summary?.update}</span>
                          <span className="text-yellow-600">!{h.summary?.konflik}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-400">Belum ada riwayat sinkronisasi.</TableCell>
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

function DiffItem({ label, value, color, bgColor }: any) {
  return (
    <div className={cn("flex justify-between items-center p-3 rounded-lg border border-slate-100", bgColor)}>
      <span className="text-sm font-semibold text-slate-600">{label}</span>
      <span className={cn("text-lg font-bold", color)}>{value}</span>
    </div>
  );
}

import { cn } from "@/lib/utils";
