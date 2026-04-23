"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSkemaDL, toggleSkemaDL } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { showSuccess, showError } from "@/lib/toast";
import { MapPin, CheckCircle2 } from "lucide-react";

export default function SkemaDLPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['skema-dl'],
    queryFn: getSkemaDL,
  });

  const mutation = useMutation({
    mutationFn: ({ id, aktif }: { id: string, aktif: boolean }) => toggleSkemaDL(id, aktif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skema-dl'] });
      showSuccess("Pengaturan skema berhasil diperbarui");
    },
    onError: (err: any) => {
      showError(err.message || "Gagal memperbarui skema");
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Skema Dinas Luar</h1>
        <p className="text-slate-500 text-sm">Kelola skema penugasan dinas luar yang tersedia untuk unit kerja Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
          ))
        ) : data?.data?.map((skema: any) => (
          <Card key={skema.id} className={cn("border-slate-200 shadow-sm transition-all", !skema.aktif && "opacity-60 bg-slate-50")}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-800">{skema.nama}</CardTitle>
                <CardDescription className="text-slate-500">{skema.deskripsi}</CardDescription>
              </div>
              <Switch 
                checked={skema.aktif} 
                onCheckedChange={(checked) => mutation.mutate({ id: skema.id, aktif: checked })}
                disabled={mutation.isPending}
              />
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-blue-500" /> Checkpoint Wajib
                </div>
                <div className="flex flex-wrap gap-2">
                  {skema.checkpoints?.map((cp: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                      <MapPin className="w-3 h-3 mr-1" /> {cp}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                <span>Radius Absensi: <b>{skema.radius_meter || 100}m</b></span>
                <span>Selfie Wajib: <b>{skema.wajib_selfie ? 'Ya' : 'Tidak'}</b></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper to avoid build error
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
