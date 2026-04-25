"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDinasLuarList, setPersetujuanDL } from "@/lib/api/dinas-luar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Plane, Calendar, MapPin, CheckCircle2, XCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Textarea } from "@/components/ui/textarea";

export default function RekapDinasLuarPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  // Approval State
  const [selectedDL, setSelectedDL] = useState<any>(null);
  const [catatanPersetujuan, setCatatanPersetujuan] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["dinas-luar", page, statusFilter],
    queryFn: () => getDinasLuarList({ 
      page, 
      limit: 10, 
      status: statusFilter === "all" ? undefined : statusFilter,
      all: true // Admin/Pimpinan melihat semua
    }),
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string, status: 'disetujui' | 'ditolak', alasan_penolakan?: string }) => 
      setPersetujuanDL(vars.id, { status: vars.status, alasan_penolakan: vars.alasan_penolakan }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dinas-luar"] });
      toast.success(`Pengajuan DL berhasil ${variables.status === 'disetujui' ? 'disetujui' : 'ditolak'}`);
      setSelectedDL(null);
      setCatatanPersetujuan("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal memproses persetujuan");
    }
  });

  const handleApprove = (status: 'disetujui' | 'ditolak') => {
    mutation.mutate({ id: selectedDL.id, status, alasan_penolakan: catatanPersetujuan });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui': return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Disetujui</Badge>;
      case 'ditolak': return <Badge variant="destructive">Ditolak</Badge>;
      case 'menunggu': return <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30">Menunggu</Badge>;
      case 'dibatalkan': return <Badge variant="secondary">Dibatalkan</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Plane className="size-6 text-primary" />
            Pengajuan Dinas Luar
          </h1>
          <p className="text-muted-foreground text-sm">Manajemen izin perjalanan dinas pegawai</p>
        </div>
      </div>

      <Card className="border-border/60">
        <div className="p-4 border-b border-border bg-muted/30 flex gap-2">
          <Button 
            variant={statusFilter === "all" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setStatusFilter("all")}
          >
            Semua
          </Button>
          <Button 
            variant={statusFilter === "menunggu" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setStatusFilter("menunggu")}
          >
            Menunggu
          </Button>
          <Button 
            variant={statusFilter === "disetujui" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setStatusFilter("disetujui")}
          >
            Disetujui
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Pegawai</TableHead>
                <TableHead>Tujuan & Waktu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={5} rows={5} />
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <td colSpan={5} className="h-32 text-center text-muted-foreground">
                    Tidak ada data pengajuan dinas luar.
                  </td>
                </TableRow>
              ) : (
                data?.data?.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div>{item.nama_lengkap || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.nip || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <MapPin className="size-3.5 text-primary" />
                          {item.tujuan}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="size-3.5" />
                          {format(new Date(item.tanggal_mulai), "dd MMM")} - {format(new Date(item.tanggal_selesai), "dd MMM yyyy")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {item.keterangan || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === 'menunggu' ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 gap-1 text-primary"
                          onClick={() => setSelectedDL(item)}
                        >
                          Tinjau
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-8"
                          onClick={() => {
                            toast.info(`Ditinjau oleh penyetuju pada status ${item.status}`);
                          }}
                        >
                          <Info className="size-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog Peninjauan DL */}
      <Dialog open={!!selectedDL} onOpenChange={() => setSelectedDL(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tinjau Pengajuan Dinas Luar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-muted/50 p-3 rounded-lg border border-border/50 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pegawai:</span>
                <span className="font-medium">{selectedDL?.nama_lengkap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tujuan:</span>
                <span className="font-medium">{selectedDL?.tujuan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durasi:</span>
                <span className="font-medium">
                  {selectedDL && format(new Date(selectedDL.tanggal_mulai), "dd MMM")} - {selectedDL && format(new Date(selectedDL.tanggal_selesai), "dd MMM yyyy")}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Catatan Pimpinan (Opsional)</p>
              <Textarea 
                placeholder="Berikan alasan jika ditolak atau instruksi jika disetujui..." 
                value={catatanPersetujuan}
                onChange={(e) => setCatatanPersetujuan(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-between w-full">
            <Button 
              variant="outline" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => handleApprove('ditolak')}
              disabled={mutation.isPending}
            >
              <XCircle className="size-4 mr-2" /> Tolak
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleApprove('disetujui')}
              disabled={mutation.isPending}
            >
              <CheckCircle2 className="size-4 mr-2" /> Setujui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
