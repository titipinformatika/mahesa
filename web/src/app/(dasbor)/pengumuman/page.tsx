"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPengumumanList, deletePengumuman } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Megaphone, Pin, Clock } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function PengumumanPage() {
  const queryClient = useQueryClient();
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['pengumuman'],
    queryFn: getPengumumanList,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePengumuman,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
      showSuccess("Pengumuman berhasil dihapus");
      setItemToDelete(null);
    },
    onError: (err: any) => showError(err.message)
  });

  const getJenisBadge = (jenis: string) => {
    switch (jenis) {
      case 'peringatan':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none font-bold">Peringatan</Badge>;
      case 'mendesak':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold">Mendesak</Badge>;
      case 'kenaikan_gaji':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none font-bold">Finance</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">Informasi</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengumuman</h1>
          <p className="text-slate-500 text-sm">Kelola informasi dan pengumuman untuk seluruh pegawai</p>
        </div>
        <Link href="/pengumuman/baru">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Buat Pengumuman
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl border border-slate-200" />
          ))
        ) : data?.data && data.data.length > 0 ? (
          data.data.map((item) => (
            <Card key={item.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              {item.disematkan && (
                <div className="absolute top-0 right-0">
                  <div className="bg-blue-600 text-white p-1 rounded-bl-lg">
                    <Pin className="w-3 h-3" />
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  {getJenisBadge(item.jenis)}
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(item.dibuat_pada), 'dd MMM yyyy', { locale: id })}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-slate-800">{item.judul}</CardTitle>
                <CardDescription className="line-clamp-2 text-slate-600">
                  {item.isi}
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-3 flex justify-between">
                <Badge variant="outline" className="text-[10px] uppercase text-slate-500 border-slate-300">
                  Target: {item.target}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-white"><Edit className="w-4 h-4"/></Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => setItemToDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4"/>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Megaphone className="w-12 h-12 opacity-20" />
            <p>Belum ada pengumuman yang dibuat.</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengumuman?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pengumuman akan dihapus secara permanen dari semua dashboard pegawai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => itemToDelete && deleteMutation.mutate(itemToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
