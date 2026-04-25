"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPetaLangsung } from "@/lib/api/dinas-luar";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function PetaPelacakan() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['peta-langsung'],
    queryFn: getPetaLangsung,
    refetchInterval: 30000, // Polling 30s
  });

  if (!mounted) return <div className="h-[600px] bg-slate-100 animate-pulse rounded-xl" />;

  const locations = data?.data || [];

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden relative">
      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm border border-primary/20 animate-pulse">
          SINKRONISASI LOKASI...
        </div>
      )}
      
      <MapContainer 
        center={[-6.9175, 107.6191]} // Default Bandung
        zoom={11} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((item: any) => (
          <Marker 
            key={item.id} 
            position={[parseFloat(item.latitude), parseFloat(item.longitude)]}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <p className="font-bold text-sm text-slate-800 m-0">{item.nama_lengkap}</p>
                <p className="text-[10px] text-muted-foreground m-0">Unit ID: {item.id_unit_kerja}</p>
                <div className="my-2 border-t border-slate-100" />
                <p className="text-xs m-0">
                  <span className="text-primary font-semibold">Tujuan:</span> {item.tujuan}
                </p>
                <p className="text-[9px] text-slate-400 mt-2 flex justify-between">
                  <span>Update: {format(new Date(item.waktu_log), "HH:mm:ss", { locale: idLocale })}</span>
                  <span className="text-emerald-500 font-bold">ONLINE</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
