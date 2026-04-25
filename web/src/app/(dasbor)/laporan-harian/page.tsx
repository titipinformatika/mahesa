"use client";

import { useEffect, useState } from "react";
import { getLaporanHarianList, getLaporanHarianDetail, LaporanHarianRecord } from "@/lib/api/laporan-harian";
import { getUnitKerjaList, UnitKerja } from "@/lib/api/organisasi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileCheck, Download, Search, Calendar as CalendarIcon, Eye, Clock, ListChecks } from "lucide-react";
import { exportToExcel } from "@/lib/excel";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

export default function RekapLHKPPage() {
  const [data, setData] = useState<LaporanHarianRecord[]>([]);
  const [units, setUnits] = useState<UnitKerja[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [lhkpRes, unitsRes] = await Promise.all([
        getLaporanHarianList({}),
        getUnitKerjaList()
      ]);
      
      if (lhkpRes.status === "success") setData(lhkpRes.data || []);
      if (unitsRes.status === "success") setUnits(unitsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      const res = await getLaporanHarianList({
        unit_id: selectedUnit === "all" ? undefined : selectedUnit,
        status: status === "all" ? undefined : status
      });
      if (res.status === "success") {
        setData(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedUnit !== "all" || status !== "all") {
      fetchFilteredData();
    } else {
      fetchInitialData();
    }
  }, [selectedUnit, status]);

  const handleShowDetail = async (reportId: string) => {
    try {
      setDetailLoading(true);
      const res = await getLaporanHarianDetail(reportId);
      if (res.status === "success") {
        setSelectedReport(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleExport = async () => {
    const columns = [
      { header: "Pegawai", key: "pegawai", width: 30 },
      { header: "Tanggal", key: "tanggal", width: 15 },
      { header: "Jumlah Kegiatan", key: "jumlah", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Peninjau", key: "peninjau", width: 30 },
    ];

    const exportData = data.map(item => ({
      pegawai: item.pegawai?.nama_lengkap || "-",
      tanggal: item.tanggal,
      jumlah: item.jumlah_kegiatan,
      status: item.status.toUpperCase(),
      peninjau: item.peninjau?.nama_lengkap || "-"
    }));

    await exportToExcel(exportData, columns, `Rekap_LHKP_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Disetujui</Badge>;
      case 'ditolak': return <Badge variant="destructive">Ditolak</Badge>;
      case 'menunggu': return <Badge variant="secondary">Menunggu</Badge>;
      case 'direvisi': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Direvisi</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Kinerja Harian</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitoring progres laporan hasil kerja seluruh pegawai</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="size-4" /> Export Excel
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60">
        <div className="p-4 border-b border-border bg-muted/30 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama pegawai..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedUnit} onValueChange={(v) => setSelectedUnit(v || "all")}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Semua Unit Kerja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Unit Kerja</SelectItem>
                {units.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={(v) => setStatus(v || "all")}>
              <SelectTrigger className="w-[160px]">
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
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Pegawai</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Kegiatan</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-10 ml-auto" /></td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <FileCheck className="size-12 mx-auto mb-4 opacity-20" />
                    <p>Tidak ada data laporan harian ditemukan</p>
                  </td>
                </tr>
              ) : (
                data.filter(d => (d.pegawai?.nama_lengkap || "").toLowerCase().includes(search.toLowerCase())).map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{item.pegawai?.nama_lengkap}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="size-3" />
                        {format(new Date(item.tanggal), 'eeee, dd MMM yyyy', { locale: id })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-mono">{item.jumlah_kegiatan} Butir</Badge>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Dialog>
                        <DialogTrigger 
                          render={
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleShowDetail(item.id)}
                              className="hover:text-primary hover:bg-primary/10"
                            />
                          }
                        >
                          <Eye className="size-4" />
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <ListChecks className="size-5 text-primary" />
                              Detail Laporan Kinerja
                            </DialogTitle>
                          </DialogHeader>
                          
                          {detailLoading ? (
                            <div className="space-y-4 py-4">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-20 w-full" />
                              <Skeleton className="h-20 w-full" />
                            </div>
                          ) : selectedReport ? (
                            <div className="space-y-4">
                              <div className="flex justify-between items-start bg-muted/30 p-3 rounded-lg border border-border/50">
                                <div>
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pegawai</p>
                                  <p className="font-bold text-lg">{selectedReport.pegawai?.nama_lengkap}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tanggal</p>
                                  <p className="font-medium">{format(new Date(selectedReport.tanggal), 'dd MMMM yyyy', { locale: id })}</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                  <Clock className="size-4 text-muted-foreground" />
                                  Rincian Kegiatan
                                </h4>
                                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                                  {selectedReport.details?.map((det: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-card border border-border/60 rounded-md space-y-1">
                                      <div className="flex justify-between items-center">
                                        <p className="font-semibold text-primary text-sm">{det.namaKegiatan}</p>
                                        <Badge variant="secondary" className="text-[10px] h-5">
                                          {det.jamMulai} - {det.jamSelesai}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{det.uraian}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {selectedReport.catatanPimpinan && (
                                <>
                                  <Separator />
                                  <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-md">
                                    <p className="text-xs font-bold text-amber-600 uppercase mb-1">Catatan Pimpinan:</p>
                                    <p className="text-sm text-amber-700">{selectedReport.catatanPimpinan}</p>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="py-10 text-center text-muted-foreground">
                              Gagal memuat detail laporan
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
