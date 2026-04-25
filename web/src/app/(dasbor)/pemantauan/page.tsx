"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStatusPegawai } from "@/lib/api/dasbor";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PemantauanPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const { data: pegawai, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['status-pegawai'],
    queryFn: async () => {
        const res = await getStatusPegawai();
        return res.data;
    },
  });

  const filteredPegawai = pegawai?.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(search.toLowerCase()) || 
                          p.jabatan.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "Semua" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hadir': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Cuti': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Dinas Luar': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pemantauan Real-Time</h1>
          <p className="text-muted-foreground mt-1">
            Status kehadiran seluruh pegawai hari ini.
          </p>
        </div>
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="gap-2"
        >
            <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} /> Perbarui
        </Button>
      </div>

      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Cari nama atau jabatan..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {["Semua", "Hadir", "Cuti", "Dinas Luar", "Belum Presensi"].map(status => (
                    <Button 
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                        className="whitespace-nowrap text-xs h-8"
                    >
                        {status}
                    </Button>
                ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
                Array(12).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))
            ) : filteredPegawai?.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">Tidak ada data pegawai yang ditemukan.</p>
                </div>
            ) : (
                filteredPegawai?.map((p) => (
                    <Card key={p.id} className="border-border/30 hover:border-primary/30 transition-colors bg-muted/5">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{p.nama}</p>
                                    <p className="text-xs text-muted-foreground truncate">{p.jabatan}</p>
                                    <div className="mt-2">
                                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 ${getStatusColor(p.status)}`}>
                                            {p.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
