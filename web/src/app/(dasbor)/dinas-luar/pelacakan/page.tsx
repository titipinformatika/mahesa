"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Plane, Map as MapIcon, Loader2 } from "lucide-react";

// Import PetaPelacakan secara dinamis karena Leaflet membutuhkan objek 'window'
const PetaPelacakan = dynamic(() => import("@/components/peta/peta-pelacakan"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-muted animate-pulse rounded-xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat peta interaktif...</p>
      </div>
    </div>
  )
});

export default function PelacakanDinasLuarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MapIcon className="size-6 text-primary" />
            Peta Pelacakan Dinas Luar
          </h1>
          <p className="text-muted-foreground text-sm">Monitoring posisi pegawai yang sedang bertugas secara real-time</p>
        </div>
      </div>

      <Card className="p-1 overflow-hidden border-border/60 shadow-lg">
        <PetaPelacakan />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Plane className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Update Berkala</p>
              <p className="text-sm font-medium">Data diperbarui tiap 30 detik</p>
            </div>
          </div>
        </Card>
        {/* Widget tambahan bisa ditaruh di sini nanti */}
      </div>
    </div>
  );
}
