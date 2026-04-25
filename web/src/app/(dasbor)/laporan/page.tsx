"use client";

import { useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLaporanDinas, exportAbsensi } from "@/lib/api/laporan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Users, Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { showError, showSuccess } from "@/lib/toast";

export default function LaporanPage() {
  const [bulan, setBulan] = useState(new Date().getMonth() + 1 + "");
  const [tahun, setTahun] = useState(new Date().getFullYear() + "");
  const [isExporting, setIsExporting] = useState(false);

  const { data: laporan, isLoading } = useQuery({
    queryKey: ['laporan-dinas', bulan, tahun],
    queryFn: async () => {
        const res = await getLaporanDinas(bulan, tahun);
        return res.data;
    },
  });

  const handleExport = async () => {
    try {
        setIsExporting(true);
        const blob = await exportAbsensi(bulan, tahun);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Rekap_Absensi_${bulan}_${tahun}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess("Laporan berhasil diunduh.");
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mengunduh laporan.";
        showError(message);
    } finally {
        setIsExporting(false);
    }
  };

  const months = [
    { label: "Januari", value: "1" }, { label: "Februari", value: "2" },
    { label: "Maret", value: "3" }, { label: "April", value: "4" },
    { label: "Mei", value: "5" }, { label: "Juni", value: "6" },
    { label: "Juli", value: "7" }, { label: "Agustus", value: "8" },
    { label: "September", value: "9" }, { label: "Oktober", value: "10" },
    { label: "November", value: "11" }, { label: "Desember", value: "12" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan & Rekapitulasi</h1>
          <p className="text-muted-foreground mt-1">
            Agregasi data kehadiran untuk pelaporan ke tingkat Dinas.
          </p>
        </div>
        <Button 
            onClick={handleExport} 
            disabled={isExporting} 
            className="gap-2 shadow-lg shadow-primary/20"
        >
            {isExporting ? <span className="animate-spin mr-2">⏳</span> : <Download className="size-4" />}
            Ekspor ke Excel
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 p-4 bg-muted/20 rounded-xl border border-border/40">
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Pilih Bulan</label>
            <Select value={bulan} onValueChange={(val) => val && setBulan(val)}>
                <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                    {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Pilih Tahun</label>
            <Select value={tahun} onValueChange={(val) => val && setTahun(val)}>
                <SelectTrigger className="w-[120px] bg-background">
                    <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
                title="Total Pegawai" 
                value={laporan?.summary?.total_pegawai || 0} 
                icon={<Users className="size-5" />} 
                color="blue"
            />
            <StatCard 
                title="Total Kehadiran" 
                value={laporan?.summary?.total_hadir || 0} 
                icon={<CheckCircle2 className="size-5" />} 
                color="emerald"
            />
            <StatCard 
                title="Total Cuti" 
                value={laporan?.summary?.total_cuti || 0} 
                icon={<Calendar className="size-5" />} 
                color="amber"
            />
            <StatCard 
                title="Total Dinas Luar" 
                value={laporan?.summary?.total_dl || 0} 
                icon={<MapPin className="size-5" />} 
                color="violet"
            />
        </div>
      )}

      <Card className="border-border/40">
        <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" /> Visualisasi Laporan Bulanan
            </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center bg-muted/5 border-t border-border/10">
            <div className="text-center">
                <FileText className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Pratinjau grafik distribusi kehadiran akan muncul di sini.</p>
                <p className="text-xs text-muted-foreground mt-1 italic">Periode: {months.find(m => m.value === bulan)?.label} {tahun}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    color: 'blue' | 'emerald' | 'amber' | 'violet';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    const colors = {
        blue: 'from-blue-500 to-cyan-500 bg-blue-500/10 text-blue-500 border-blue-500/20',
        emerald: 'from-emerald-500 to-teal-500 bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        amber: 'from-amber-500 to-orange-500 bg-amber-500/10 text-amber-500 border-amber-500/20',
        violet: 'from-violet-500 to-purple-500 bg-violet-500/10 text-violet-500 border-violet-500/20',
    };

    return (
        <Card className="overflow-hidden border-border/30 bg-muted/5">
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-xl flex items-center justify-center ${colors[color].split(' ').slice(2).join(' ')} border`}>
                        {icon}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                        <p className="text-2xl font-bold mt-0.5">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
