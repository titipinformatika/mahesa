"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, removeAuth, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [peran, setPeran] = useState<string | undefined>("");

  useEffect(() => {
    // Cek autentikasi: jika belum login, redirect ke halaman masuk
    if (!isAuthenticated()) {
      router.replace("/masuk");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPeran(getRole());
  }, [router]);

  const handleLogout = () => {
    removeAuth();
    router.replace("/masuk");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🏛️ Dasbor MAHESA</h1>
          <Button variant="outline" onClick={handleLogout} className="text-black border-white bg-white hover:bg-slate-200">
            Keluar
          </Button>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <p className="text-lg">
            Selamat datang! Anda login sebagai:{" "}
            <span className="font-bold text-blue-400">{peran}</span>
          </p>
          <p className="text-slate-400 mt-2">
            Halaman ini adalah placeholder. Fitur dasbor akan dikembangkan di
            Issue berikutnya.
          </p>
        </div>
      </div>
    </div>
  );
}
