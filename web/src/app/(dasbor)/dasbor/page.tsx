"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, removeAuth, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Building2, TrendingUp, LogOut } from "lucide-react";

const statistik = [
  { label: "Total Pegawai", nilai: "128", ikon: Users, gradien: "from-blue-500 to-cyan-500" },
  { label: "Aktif", nilai: "119", ikon: UserCheck, gradien: "from-emerald-500 to-teal-500" },
  { label: "Unit Kerja", nilai: "12", ikon: Building2, gradien: "from-violet-500 to-fuchsia-500" },
  { label: "Pertumbuhan", nilai: "+6.2%", ikon: TrendingUp, gradien: "from-orange-500 to-rose-500" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [peran, setPeran] = useState<string | undefined>("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/masuk");
      return;
    }
    setPeran(getRole());
  }, [router]);

  const handleLogout = () => {
    removeAuth();
    router.replace("/masuk");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Anda login sebagai <span className="font-semibold text-primary">{peran || "—"}</span>
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="gap-2 hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-300">
          <LogOut className="size-4" /> Keluar
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {statistik.map((s) => {
          const Ikon = s.ikon;
          return (
            <Card key={s.label} className="group relative overflow-hidden border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${s.gradien} transition-opacity duration-500`} />
              <CardContent className="pt-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-3xl font-bold mt-1">{s.nilai}</p>
                  </div>
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${s.gradien} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Ikon className="size-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 animate-masuk-fade">
          <CardHeader>
            <CardTitle>Ringkasan Aktivitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ini adalah placeholder dasbor. Data aktivitas terbaru akan dimunculkan di sini pada iterasi berikutnya.
            </p>
            <div className="mt-6 h-40 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground">
              Grafik akan ditampilkan di sini
            </div>
          </CardContent>
        </Card>

        <Card className="animate-masuk-fade">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start hover:translate-x-1 transition-transform">👥 Kelola Pegawai</Button>
            <Button variant="outline" className="w-full justify-start hover:translate-x-1 transition-transform">🏢 Kelola Unit Kerja</Button>
            <Button variant="outline" className="w-full justify-start hover:translate-x-1 transition-transform">📊 Lihat Laporan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
