"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPengumumanList, createPengumuman, updatePengumuman, deletePengumuman, Pengumuman } from "@/lib/api/pengumuman";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Plus, Trash2, Edit2, Calendar, Target, Globe } from "lucide-react";
import { showError, showSuccess } from "@/lib/toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function PengumumanPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Pengumuman | null>(null);

  const { data: list, isLoading } = useQuery({
    queryKey: ['pengumuman'],
    queryFn: async () => {
        const res = await getPengumumanList();
        return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createPengumuman,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
        showSuccess("Pengumuman berhasil dibuat");
        setIsOpen(false);
    },
    onError: (err: Error) => showError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Pengumuman> }) => updatePengumuman(id, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
        showSuccess("Pengumuman berhasil diperbarui");
        setIsOpen(false);
        setEditing(null);
    },
    onError: (err: Error) => showError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePengumuman,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pengumuman'] });
        showSuccess("Pengumuman berhasil dihapus");
    },
    onError: (err: Error) => showError(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
        judul: formData.get('judul') as string,
        konten: formData.get('konten') as string,
        tanggalBerlaku: formData.get('tanggalBerlaku') as string,
        tanggalBerakhir: formData.get('tanggalBerakhir') as string,
        peranTarget: formData.get('peranTarget') === 'semua' ? null : formData.get('peranTarget') as string,
    };

    if (editing) {
        updateMutation.mutate({ id: editing.id, data });
    } else {
        createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengumuman</h1>
          <p className="text-muted-foreground mt-1">Kelola informasi massal untuk seluruh pegawai.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(v) => { setIsOpen(v); if(!v) setEditing(null); }}>
            <DialogTrigger render={<Button className="gap-2"><Plus className="size-4" /> Buat Pengumuman</Button>} />
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Judul</label>
                            <Input name="judul" defaultValue={editing?.judul} required placeholder="Contoh: Pemberitahuan Cuti Bersama" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Konten</label>
                            <Textarea name="konten" defaultValue={editing?.konten} required placeholder="Isi pengumuman..." rows={4} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tanggal Mulai</label>
                                <Input name="tanggalBerlaku" type="date" defaultValue={editing?.tanggalBerlaku} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tanggal Berakhir</label>
                                <Input name="tanggalBerakhir" type="date" defaultValue={editing?.tanggalBerakhir} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Audiens</label>
                            <Select name="peranTarget" defaultValue={editing?.peranTarget || 'semua'}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Target" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Pegawai</SelectItem>
                                    <SelectItem value="pimpinan">Pimpinan Saja</SelectItem>
                                    <SelectItem value="admin_unit">Admin Unit Saja</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                            {editing ? 'Simpan Perubahan' : 'Terbitkan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : list?.length === 0 ? (
            <Card className="border-dashed border-2 py-12">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground">
                    <Megaphone className="size-12 mb-4 opacity-20" />
                    <p>Belum ada pengumuman yang dibuat.</p>
                </CardContent>
            </Card>
        ) : (
            list?.map((p) => (
                <Card key={p.id} className="group border-border/40 hover:border-primary/40 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{p.judul}</h3>
                                    <Badge variant={p.aktif ? "default" : "secondary"} className="text-[10px] uppercase font-bold">
                                        {p.aktif ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                    {p.peranTarget ? (
                                        <Badge variant="outline" className="text-[10px] uppercase gap-1">
                                            <Target className="size-3" /> {p.peranTarget}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] uppercase gap-1">
                                            <Globe className="size-3" /> Global
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{p.konten}</p>
                                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="size-3" />
                                        {format(new Date(p.tanggalBerlaku), 'dd MMMM yyyy', { locale: id })} - {format(new Date(p.tanggalBerakhir), 'dd MMMM yyyy', { locale: id })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setIsOpen(true); }}>
                                    <Edit2 className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {
                                    if(confirm('Hapus pengumuman ini?')) deleteMutation.mutate(p.id);
                                }}>
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  );
}
