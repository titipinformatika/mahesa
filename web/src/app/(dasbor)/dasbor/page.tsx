"use client";

import { useQuery } from "@tanstack/react-query";
import { getStatistikDasbor, getStatusPegawai } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  CalendarCheck, 
  MapPin, 
  Clock, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dasbor-statistik'],
    queryFn: getStatistikDasbor,
    refetchInterval: 60000,
  });

  const { data: statusPegawai, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['dasbor-status-pegawai'],
    queryFn: () => getStatusPegawai(),
    refetchInterval: 30000,
  });

  const chartData = stats?.data?.grafik_kehadiran || [
    { name: 'Sen', hadir: 85, terlambat: 5, absen: 10 },
    { name: 'Sel', hadir: 88, terlambat: 3, absen: 9 },
    { name: 'Rab', hadir: 82, terlambat: 8, absen: 10 },
    { name: 'Kam', hadir: 90, terlambat: 2, absen: 8 },
    { name: 'Jum', hadir: 87, terlambat: 4, absen: 9 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Dasbor</h1>
        <p className="text-slate-500 text-sm">Informasi terkini mengenai kehadiran dan status pegawai hari ini</p>
      </div>

      {/* Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pegawai" 
          value={stats?.data?.total_pegawai || 0} 
          icon={<Users className="w-5 h-5 text-blue-600" />}
          bgColor="bg-blue-50"
          isLoading={isLoadingStats}
        />
        <StatCard 
          title="Hadir Hari Ini" 
          value={stats?.data?.hadir_hari_ini || 0} 
          icon={<CalendarCheck className="w-5 h-5 text-green-600" />}
          bgColor="bg-green-50"
          isLoading={isLoadingStats}
        />
        <StatCard 
          title="Sedang Cuti" 
          value={stats?.data?.sedang_cuti || 0} 
          icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
          bgColor="bg-yellow-50"
          isLoading={isLoadingStats}
        />
        <StatCard 
          title="Dinas Luar" 
          value={stats?.data?.sedang_dl || 0} 
          icon={<MapPin className="w-5 h-5 text-purple-600" />}
          bgColor="bg-purple-50"
          isLoading={isLoadingStats}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Kehadiran */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-slate-400" />
              Trend Kehadiran (7 Hari Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconType="circle" />
                <Bar dataKey="hadir" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={32} />
                <Bar dataKey="terlambat" stackId="a" fill="#f59e0b" barSize={32} />
                <Bar dataKey="absen" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Pegawai Real-time */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-bold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-400" />
              Status Real-time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {isLoadingStatus ? (
                <div className="p-8 text-center text-slate-400">Memuat status...</div>
              ) : statusPegawai?.data?.slice(0, 6).map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                      {item.nama_lengkap.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.nama_lengkap}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{item.unit}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] font-bold px-2 py-0 border-none",
                    item.status === 'Bekerja' ? 'text-green-600 bg-green-50' :
                    item.status === 'Dinas Luar' ? 'text-purple-600 bg-purple-50' :
                    item.status === 'Cuti' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50'
                  )}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
              <Link href="/pemantauan" className="text-xs font-bold text-blue-600 hover:underline">Lihat Selengkapnya</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor, isLoading }: any) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            )}
          </div>
          <div className={`p-3 ${bgColor} rounded-xl`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";
