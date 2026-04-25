"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAbsensiList, koreksiAbsensi } from "@/lib/api/absensi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Search, Filter, Edit2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function RekapAbsensiPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tanggalFilter, setTanggalFilter] = useState(format(new Date(), "yyyy-MM-dd"));

  // Dialog Koreksi State
  const [selectedAbsensi, setSelectedAbsensi] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [catatanKoreksi, setCatatanKoreksi] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["absensi", page, search, statusFilter, tanggalFilter],
    queryFn: () => getAbsensiList({ 
      page, 
      limit: 10, 
      tanggal: tanggalFilter,
      status: statusFilter === "all" ? undefined : statusFilter
    }),
  });

  const mutation = useMutation({
    mutationFn: (vars: { id: string, status: string, catatan: string }) => 
      koreksiAbsensi(vars.id, { status: vars.status, catatan: vars.catatan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["absensi"] });
      toast.success("Absensi berhasil dikoreksi");
      setSelectedAbsensi(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Gagal mengoreksi absensi");
    }
  });

  const handleKoreksi = () => {
    if (!newStatus) return toast.error("Pilih status baru");
    mutation.mutate({ id: selectedAbsensi.id, status: newStatus, catatan: catatanKoreksi });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hadir': return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Hadir</Badge>;
      case 'terlambat': return <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30">Terlambat</Badge>;
      case 'tidak_hadir': return <Badge variant="destructive">Alpa</Badge>;
      case 'izin': return <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30">Izin</Badge>;
      case 'sakit': return <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/30">Sakit</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rekap Absensi Pegawai</h1>
          <p className="text-muted-foreground text-sm">Pantau kehadiran seluruh pegawai secara real-time</p>
        </div>
      </div>

      <Card className="border-border/60">
        <div className="p-4 border-b border-border bg-muted/30 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Cari nama pegawai..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-[150px]">
            <Input 
              type="date" 
              value={tanggalFilter}
              onChange={(e) => setTanggalFilter(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="hadir">Hadir</SelectItem>
              <SelectItem value="terlambat">Terlambat</SelectItem>
              <SelectItem value="izin">Izin</SelectItem>
              <SelectItem value="sakit">Sakit</SelectItem>
              <SelectItem value="tidak_hadir">Alpa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Pegawai</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jam Kerja</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton columns={6} rows={5} />
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <td colSpan={6} className="h-32 text-center text-muted-foreground">
                    Tidak ada data absensi ditemukan.
                  </td>
                </TableRow>
              ) : (
                data?.data?.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div>{item.nama_lengkap || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground font-mono">{item.nip || "-"}</div>
                    </TableCell>
                    <TableCell>{format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.jam_kerja ? `${item.jam_kerja} jam` : "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                      {item.catatan || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 gap-1 text-primary"
                        onClick={() => {
                          setSelectedAbsensi(item);
                          setNewStatus(item.status);
                          setCatatanKoreksi(item.catatan || "");
                        }}
                      >
                        <Edit2 className="size-3.5" /> Koreksi
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog Koreksi */}
      <Dialog open={!!selectedAbsensi} onOpenChange={() => setSelectedAbsensi(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-amber-500" />
              Koreksi Absensi
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Pegawai</p>
              <p className="text-sm text-muted-foreground">{selectedAbsensi?.nama_lengkap}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Status Baru</p>
              <Select value={newStatus} onValueChange={(val) => setNewStatus(val || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hadir">Hadir</SelectItem>
                  <SelectItem value="terlambat">Terlambat</SelectItem>
                  <SelectItem value="izin">Izin</SelectItem>
                  <SelectItem value="sakit">Sakit</SelectItem>
                  <SelectItem value="tidak_hadir">Alpa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Catatan Koreksi</p>
              <Input 
                placeholder="Alasan koreksi..." 
                value={catatanKoreksi}
                onChange={(e) => setCatatanKoreksi(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAbsensi(null)}>Batal</Button>
            <Button onClick={handleKoreksi} disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
