"use client";

import { useQuery } from "@tanstack/react-query";
import { getStatusPegawai } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Briefcase, CalendarOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PemantauanPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dasbor-status-pegawai-full'],
    queryFn: () => getStatusPegawai(),
    refetchInterval: 30000,
  });

  const statuses = [
    { label: "Bekerja", icon: <Briefcase className="w-4 h-4" />, color: "bg-green-500", lightColor: "bg-green-50", textColor: "text-green-700" },
    { label: "Dinas Luar", icon: <MapPin className="w-4 h-4" />, color: "bg-purple-500", lightColor: "bg-purple-50", textColor: "text-purple-700" },
    { label: "Cuti", icon: <CalendarOff className="w-4 h-4" />, color: "bg-blue-500", lightColor: "bg-blue-50", textColor: "text-blue-700" },
    { label: "Sakit", icon: <AlertCircle className="w-4 h-4" />, color: "bg-yellow-500", lightColor: "bg-yellow-50", textColor: "text-yellow-700" },
    { label: "Tidak Hadir", icon: <AlertCircle className="w-4 h-4" />, color: "bg-red-500", lightColor: "bg-red-50", textColor: "text-red-700" },
  ];

  const grouped = data?.data?.reduce((acc: any, curr: any) => {
    if (!acc[curr.status]) acc[curr.status] = [];
    acc[curr.status].push(curr);
    return acc;
  }, {}) || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pemantauan Pegawai</h1>
        <p className="text-slate-500 text-sm">Status kehadiran dan kegiatan seluruh pegawai secara real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statuses.map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm flex flex-col h-[500px]">
            <CardHeader className={cn("border-b py-3 flex flex-row items-center justify-between", s.lightColor)}>
              <div className="flex items-center gap-2">
                <div className={cn("p-1.5 rounded-lg text-white", s.color)}>
                  {s.icon}
                </div>
                <CardTitle className={cn("text-sm font-bold", s.textColor)}>{s.label}</CardTitle>
              </div>
              <Badge variant="outline" className={cn("bg-white font-bold", s.textColor)}>
                {grouped[s.label]?.length || 0}
              </Badge>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
              ) : grouped[s.label] && grouped[s.label].length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {grouped[s.label].map((p: any, idx: number) => (
                    <div key={idx} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                          {p.nama_lengkap.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-tight">{p.nama_lengkap}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{p.unit}</p>
                          {p.lokasi && (
                            <p className="text-[10px] text-slate-500 flex items-center mt-1">
                              <MapPin className="w-2.5 h-2.5 mr-1" /> {p.lokasi}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-50 space-y-2">
                  <Users className="w-8 h-8" />
                  <p className="text-xs font-medium">Tidak ada pegawai</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
