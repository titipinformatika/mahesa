"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PetaPelacakan = dynamic(() => import("@/components/peta/peta-pelacakan"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-xl" />
});

export default function PelacakanDLPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pelacakan Dinas Luar</h1>
        <p className="text-slate-500 text-sm">Pantau lokasi real-time pegawai yang sedang bertugas di luar kantor</p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold text-slate-600 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Peta Lokasi Real-time
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <PetaPelacakan />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs font-bold text-blue-600 uppercase">Akurasi GPS</p>
          <p className="text-sm text-blue-800 mt-1">Lokasi diperbarui otomatis setiap kali pegawai melakukan checkpoint atau log posisi.</p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
          <p className="text-xs font-bold text-purple-600 uppercase">Privasi</p>
          <p className="text-sm text-purple-800 mt-1">Pelacakan hanya aktif selama periode penugasan dinas luar yang telah disetujui.</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs font-bold text-slate-500 uppercase">Status Perangkat</p>
          <p className="text-sm text-slate-700 mt-1">Pastikan pegawai mengaktifkan GPS dan koneksi internet pada aplikasi mobile.</p>
        </div>
      </div>
    </div>
  );
}
