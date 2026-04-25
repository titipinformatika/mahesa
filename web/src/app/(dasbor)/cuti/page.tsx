"use client";

import { useEffect, useState } from "react";
import { getCutiList, getSaldoCuti, CutiRecord, SaldoCuti } from "@/lib/api/cuti";
import { getUnitKerjaList, UnitKerja } from "@/lib/api/organisasi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coffee, Download, Search, Calendar as CalendarIcon, Wallet } from "lucide-react";
import { exportToExcel } from "@/lib/excel";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function RekapCutiPage() {
  const [data, setData] = useState<CutiRecord[]>([]);
  const [saldoData, setSaldoData] = useState<SaldoCuti[]>([]);
  const [units, setUnits] = useState<UnitKerja[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [cutiRes, unitsRes, saldoRes] = await Promise.all([
        getCutiList({}),
        getUnitKerjaList(),
        getSaldoCuti()
      ]);
      
      if (cutiRes.status === "success") setData(cutiRes.data || []);
      if (unitsRes.status === "success") setUnits(unitsRes.data || []);
      if (saldoRes.status === "success") setSaldoData(saldoRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      const res = await getCutiList({
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

  const handleExport = async () => {
    const columns = [
      { header: "Pegawai", key: "pegawai", width: 30 },
      { header: "Jenis Cuti", key: "jenis", width: 20 },
      { header: "Mulai", key: "mulai", width: 15 },
      { header: "Selesai", key: "selesai", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Keterangan", key: "keterangan", width: 40 },
    ];

    const exportData = data.map(item => ({
      pegawai: item.pegawai?.nama_lengkap || "-",
      jenis: item.jenis_cuti,
      mulai: item.tanggal_mulai,
      selesai: item.tanggal_selesai,
      status: item.status.toUpperCase(),
      keterangan: item.keterangan || "-"
    }));

    await exportToExcel(exportData, columns, `Rekap_Cuti_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const handleExportSaldo = async () => {
    const columns = [
      { header: "Pegawai", key: "pegawai", width: 30 },
      { header: "Jenis Cuti", key: "jenis", width: 20 },
      { header: "Total Kuota", key: "total", width: 15 },
      { header: "Terpakai", key: "terpakai", width: 15 },
      { header: "Sisa Saldo", key: "sisa", width: 15 },
    ];

    const exportData = saldoData.map(item => ({
      pegawai: item.nama_lengkap,
      jenis: item.jenis_cuti,
      total: item.total,
      terpakai: item.terpakai,
      sisa: item.sisa
    }));

    await exportToExcel(exportData, columns, `Saldo_Cuti_${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'disetujui': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Disetujui</Badge>;
      case 'ditolak': return <Badge variant="destructive">Ditolak</Badge>;
      case 'menunggu': return <Badge variant="secondary">Menunggu</Badge>;
      case 'dibatalkan': return <Badge variant="outline">Dibatalkan</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cuti Pegawai</h1>
          <p className="text-muted-foreground text-sm mt-1">Pantau rekapitulasi pengajuan dan saldo cuti seluruh pegawai</p>
        </div>
      </div>

      <Tabs defaultValue="rekap" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="rekap" className="gap-2">
            <Coffee className="size-4" /> Rekap Pengajuan
          </TabsTrigger>
          <TabsTrigger value="saldo" className="gap-2">
            <Wallet className="size-4" /> Saldo Cuti
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rekap" className="space-y-4">
          <Card className="overflow-hidden border-border/60">
            <div className="p-4 border-b border-border bg-muted/30 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center flex-1">
                <div className="relative flex-1 min-w-[240px] max-w-md">
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
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleExport} variant="outline" className="gap-2 shrink-0">
                <Download className="size-4" /> Export Excel
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Pegawai</th>
                    <th className="px-6 py-3 font-medium">Jenis Cuti</th>
                    <th className="px-6 py-3 font-medium">Rentang Tanggal</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></td>
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        <Coffee className="size-12 mx-auto mb-4 opacity-20" />
                        <p>Tidak ada data pengajuan cuti ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    data.filter(d => (d.pegawai?.nama_lengkap || "").toLowerCase().includes(search.toLowerCase())).map((item) => (
                      <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{item.pegawai?.nama_lengkap}</td>
                        <td className="px-6 py-4 text-muted-foreground">{item.jenis_cuti}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <CalendarIcon className="size-3" />
                            {format(new Date(item.tanggal_mulai), 'dd MMM yyyy', { locale: id })} - 
                            {format(new Date(item.tanggal_selesai), 'dd MMM yyyy', { locale: id })}
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                        <td className="px-6 py-4 text-right text-xs text-muted-foreground max-w-xs truncate">
                          {item.keterangan || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="saldo" className="space-y-4">
          <Card className="overflow-hidden border-border/60">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Saldo Cuti Pegawai</h3>
              <Button onClick={handleExportSaldo} variant="outline" className="gap-2">
                <Download className="size-4" /> Export Saldo
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 font-medium">Pegawai</th>
                    <th className="px-6 py-3 font-medium">Jenis Cuti</th>
                    <th className="px-6 py-3 font-medium text-center">Total Kuota</th>
                    <th className="px-6 py-3 font-medium text-center">Terpakai</th>
                    <th className="px-6 py-3 font-medium text-right">Sisa Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                        <td className="px-6 py-4 text-center"><Skeleton className="h-4 w-8 mx-auto" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-8 ml-auto" /></td>
                      </tr>
                    ))
                  ) : saldoData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        <Wallet className="size-12 mx-auto mb-4 opacity-20" />
                        <p>Data saldo cuti tidak tersedia</p>
                      </td>
                    </tr>
                  ) : (
                    saldoData.filter(d => (d.nama_lengkap || "").toLowerCase().includes(search.toLowerCase())).map((item, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{item.nama_lengkap}</td>
                        <td className="px-6 py-4 text-muted-foreground">{item.jenis_cuti}</td>
                        <td className="px-6 py-4 text-center font-mono">{item.total}</td>
                        <td className="px-6 py-4 text-center font-mono text-amber-600">{item.terpakai}</td>
                        <td className="px-6 py-4 text-right">
                          <Badge variant={item.sisa > 0 ? "secondary" : "destructive"} className="font-mono">
                            {item.sisa} Hari
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
