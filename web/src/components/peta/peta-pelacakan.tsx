"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getPetaLangsung } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

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

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-600 shadow-sm border border-slate-200">
          Memperbarui lokasi...
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
        
        {data?.data?.map((item: any) => (
          <Marker 
            key={item.id} 
            position={[parseFloat(item.latitude), parseFloat(item.longitude)]}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-slate-800 m-0">{item.nama_lengkap}</p>
                <p className="text-xs text-slate-500 m-0">{item.id_unit_kerja}</p>
                <hr className="my-2" />
                <p className="text-xs m-0 text-blue-600"><b>Tujuan:</b> {item.tujuan}</p>
                <p className="text-[10px] text-slate-400 mt-1">Update terakhir: {new Date(item.waktu_log).toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
