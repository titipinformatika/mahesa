"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, LayoutDashboard, Building, Calendar, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getRole, isAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [peran, setPeran] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Cek autentikasi: jika belum login, redirect ke halaman masuk
    if (!isAuthenticated()) {
      router.replace("/masuk");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPeran(getRole());
  }, [router]);

  // Menu dinamis berdasarkan peran
  const menu = [
    { name: "Dasbor", path: "/dasbor", icon: LayoutDashboard, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Pegawai", path: "/pegawai", icon: Users, roles: ["admin_dinas", "admin_upt", "admin_unit"] },
    { name: "Unit Kerja", path: "/unit-kerja", icon: Building, roles: ["admin_dinas"] },
    { name: "Absensi", path: "/absensi", icon: Calendar, roles: ["admin_dinas", "admin_upt", "admin_unit", "pimpinan", "pegawai"] },
    { name: "Pengaturan", path: "/pengaturan", icon: Settings, roles: ["admin_dinas"] },
  ];

  const filteredMenu = menu.filter(m => m.roles.includes(peran || ""));

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 hidden md:flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="font-bold text-xl text-white tracking-wider">🏛️ MAHESA</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
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
