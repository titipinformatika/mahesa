"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Users, 
  LayoutDashboard, 
  Building, 
  Calendar, 
  Settings, 
  MapPin, 
  Map, 
  Coffee, 
  FileCheck, 
  UserCheck, 
  Megaphone, 
  Database, 
  FileBarChart,
  Layers,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { getRole, isAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [peran, setPeran] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.replace("/masuk");
      return;
    }
    setPeran(getRole());
  }, [router]);

  if (!mounted) return null;

  // Menu dinamis berdasarkan peran
  const menu = [
    { name: "Dasbor", path: "/dasbor", icon: LayoutDashboard, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Pemantauan", path: "/pemantauan", icon: MapPin, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan"] },
    { name: "Pegawai", path: "/pegawai", icon: Users, roles: ["admin_dinas", "admin_upt", "admin_unit"] },
    { name: "Unit Kerja", path: "/unit-kerja", icon: Building, roles: ["admin_dinas"] },
    { name: "Absensi", path: "/absensi", icon: Calendar, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Dinas Luar", path: "/dinas-luar", icon: Map, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Cuti", path: "/cuti", icon: Coffee, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Kinerja", path: "/laporan-harian", icon: FileCheck, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Biodata", path: "/biodata", icon: UserCheck, roles: ["admin_dinas", "admin_upt", "admin_unit"] },
    { name: "Pengumuman", path: "/pengumuman", icon: Megaphone, roles: ["admin_dinas", "admin_upt", "admin_unit"] },
    { name: "Dapodik", path: "/dapodik", icon: Database, roles: ["admin_dinas"] },
    { name: "Laporan", path: "/laporan", icon: FileBarChart, roles: ["admin_dinas", "admin_upt", "admin_unit"] },
    { name: "Level Unit", path: "/master-data/level-unit", icon: Layers, roles: ["admin_dinas", "admin_upt"] },
    { name: "Skema Jam Kerja", path: "/master-data/skema-jam-kerja", icon: Clock, roles: ["admin_dinas", "admin_upt"] },
    { name: "Skema DL", path: "/master-data/skema-dl", icon: MapPin, roles: ["admin_dinas", "admin_upt"] },
    { name: "Pengaturan", path: "/pengaturan", icon: Settings, roles: ["admin_dinas"] },
  ];

  const filteredMenu = menu.filter(m => m.roles.includes(peran || ""));

  return (
    <aside className={cn(
      "w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-full",
      !isMobile && "hidden md:flex"
    )}>
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="font-bold text-xl text-white tracking-wider">🏛️ MAHESA</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname ? (pathname === item.path || pathname.startsWith(item.path + "/")) : false;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
