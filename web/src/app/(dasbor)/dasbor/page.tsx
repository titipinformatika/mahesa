"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, removeAuth, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp, LogOut, Clock, Calendar, MapPin, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStatistikDasbor } from "@/lib/api/dasbor";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const mockTrendData = [
  { name: 'Sen', hadir: 110, cuti: 5, dl: 10 },
  { name: 'Sel', hadir: 115, cuti: 3, dl: 12 },
  { name: 'Rab', hadir: 108, cuti: 8, dl: 8 },
  { name: 'Kam', hadir: 119, cuti: 2, dl: 7 },
  { name: 'Jum', hadir: 112, cuti: 6, dl: 9 },
];

const mockUnitData = [
  { unit: 'Kantor Dinas', hadir: '98%', status: 'Normal' },
  { unit: 'UPT Soreang', hadir: '95%', status: 'Normal' },
  { unit: 'SDN 01 Soreang', hadir: '88%', status: 'Perhatian' },
  { unit: 'SMPN 01 Soreang', hadir: '92%', status: 'Normal' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [peran, setPeran] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/masuk");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPeran(getRole());
  }, [router]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['statistik-dasbor'],
    queryFn: async () => {
        const res = await getStatistikDasbor();
        return res.data;
    },
  });

  const handleLogout = () => {
    removeAuth();
    router.replace("/masuk");
  };

  const dashboardItems = [
    { label: "Total Pegawai", nilai: stats?.total_pegawai ?? 0, ikon: Users, gradien: "from-blue-500 to-cyan-500" },
    { label: "Hadir Hari Ini", nilai: stats?.hadir_hari_ini ?? 0, ikon: UserCheck, gradien: "from-emerald-500 to-teal-500" },
    { label: "Pegawai Cuti", nilai: stats?.cuti_hari_ini ?? 0, ikon: Calendar, gradien: "from-orange-500 to-amber-500" },
    { label: "Dinas Luar", nilai: stats?.dl_hari_ini ?? 0, ikon: MapPin, gradien: "from-violet-500 to-purple-500" },
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dasbor Analitik
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau kesehatan organisasi dan kehadiran pegawai secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                {peran || "Memuat..."}
            </span>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="size-4 mr-2" /> Keluar
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
            Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
            ))
        ) : (
            dashboardItems.map((item) => {
                const Ikon = item.ikon;
                return (
                    <Card key={item.label} className="group overflow-hidden border-border/40 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-bold mt-1 tracking-tight">{item.nilai}</p>
                                        {item.label === "Hadir Hari Ini" && stats && (
                                            <span className="text-xs font-medium text-emerald-500">
                                                {stats.persentase_kehadiran}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`size-12 rounded-2xl bg-gradient-to-br ${item.gradien} flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                    <Ikon className="size-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/40 overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="size-5 text-primary" /> Tren Kehadiran Mingguan
                </CardTitle>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Hadir</div>
                    <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-amber-500" /> Cuti</div>
                    <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-500" /> DL</div>
                </div>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] p-0 pr-4 pb-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={mockTrendData}>
                        <defs>
                            <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                            itemStyle={{ fontSize: 12 }}
                        />
                        <Area type="monotone" dataKey="hadir" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorHadir)" />
                        <Area type="monotone" dataKey="cuti" stroke="#f59e0b" strokeWidth={2} fill="transparent" />
                        <Area type="monotone" dataKey="dl" stroke="#8b5cf6" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="size-5 text-primary" /> Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/20 hover:bg-muted/30 transition-colors">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {i}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">Pegawai {i} melakukan presensi</p>
                        <p className="text-xs text-muted-foreground">08:{i*5} WIB • Unit Kerja {String.fromCharCode(64 + i)}</p>
                    </div>
                </div>
            ))}
            <Button variant="link" className="w-full text-xs text-primary" onClick={() => router.push('/pemantauan')}>
                Lihat Semua Aktivitas
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40">
          <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="size-5 text-primary" /> Perbandingan Performa Unit Kerja
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="relative overflow-x-auto rounded-lg border border-border/40">
                  <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                          <tr>
                              <th className="px-6 py-3 font-semibold">Nama Unit</th>
                              <th className="px-6 py-3 font-semibold text-center">Tingkat Kehadiran</th>
                              <th className="px-6 py-3 font-semibold text-center">Status</th>
                              <th className="px-6 py-3 font-semibold text-right">Aksi</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                          {mockUnitData.map((u, i) => (
                              <tr key={i} className="bg-background hover:bg-muted/20 transition-colors">
                                  <td className="px-6 py-4 font-medium">{u.unit}</td>
                                  <td className="px-6 py-4 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                              <div 
                                                className={`h-full ${u.status === 'Perhatian' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                style={{ width: u.hadir }}
                                              />
                                          </div>
                                          <span className="text-xs font-bold">{u.hadir}</span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                          u.status === 'Perhatian' 
                                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                      }`}>
                                          {u.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                      <Button variant="ghost" size="sm" className="h-7 text-xs">Detail</Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
