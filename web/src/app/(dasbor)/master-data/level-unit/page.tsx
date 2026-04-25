"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getLevelUnitKerja, 
  createLevelUnitKerja, 
  updateLevelUnitKerja, 
  deleteLevelUnitKerja,
  LevelUnitKerja 
} from "@/lib/api/organisasi";
import { showError, showSuccess } from "@/lib/toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Layers,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function LevelUnitKerjaPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<LevelUnitKerja | null>(null);
  const [isDeleting, setIsDeleting] = useState<LevelUnitKerja | null>(null);

  const [form, setForm] = useState({
    level: "",
    nama: "",
    keterangan: "",
  });

  const { data: levelRes, isLoading } = useQuery({
    queryKey: ["level-unit"],
    queryFn: getLevelUnitKerja,
  });

  const createMutation = useMutation({
    mutationFn: createLevelUnitKerja,
    onSuccess: () => {
      showSuccess("Level unit kerja berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["level-unit"] });
      handleClose();
    },
    onError: (error: any) => {
      showError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateLevelUnitKerja(id, data),
    onSuccess: () => {
      showSuccess("Level unit kerja berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["level-unit"] });
      handleClose();
    },
    onError: (error: any) => {
      showError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLevelUnitKerja,
    onSuccess: () => {
      showSuccess("Level unit kerja berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["level-unit"] });
      setIsDeleting(null);
    },
    onError: (error: any) => {
      showError(error.message);
    },
  });

  const handleOpen = (level?: LevelUnitKerja) => {
    if (level) {
      setEditing(level);
      setForm({
        level: level.level.toString(),
        nama: level.nama,
        keterangan: level.keterangan || "",
      });
    } else {
      setEditing(null);
      setForm({ level: "", nama: "", keterangan: "" });
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditing(null);
    setForm({ level: "", nama: "", keterangan: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      level: parseInt(form.level),
      nama: form.nama,
      keterangan: form.keterangan || undefined,
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Level Unit Kerja</h1>
            <p className="text-slate-500 text-sm">Kelola hierarki dan tingkatan struktur organisasi.</p>
          </div>
        </div>
        <Button 
          onClick={() => handleOpen()} 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Level
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-24">Level</TableHead>
              <TableHead>Nama Level</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : levelRes?.data && levelRes.data.length > 0 ? (
              levelRes.data.map((l) => (
                <TableRow key={l.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-bold text-blue-600">Level {l.level}</TableCell>
                  <TableCell className="font-medium text-slate-800">{l.nama}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{l.keterangan || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleOpen(l)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setIsDeleting(l)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-400 italic">
                  Belum ada data level unit kerja.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              {editing ? 'Edit Level Unit' : 'Tambah Level Unit'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkatan Level <span className="text-red-500">*</span></label>
                <Input
                  required
                  type="number"
                  className="bg-slate-50 border-slate-200"
                  placeholder="Contoh: 1"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                />
                <p className="text-[10px] text-slate-400">Level 1 biasanya untuk Dinas Pendidikan, Level 2 untuk UPT, dst.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Level <span className="text-red-500">*</span></label>
                <Input
                  required
                  className="bg-slate-50 border-slate-200"
                  placeholder="Contoh: Kantor Dinas"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</label>
                <Textarea
                  className="bg-slate-50 border-slate-200 resize-none"
                  placeholder="Deskripsi singkat mengenai level ini..."
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
              <Button type="button" variant="ghost" onClick={handleClose}>Batal</Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  editing ? 'Simpan Perubahan' : 'Tambah Level'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <AlertDialogContent className="border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800">Hapus Level Unit Kerja?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Level <span className="font-bold text-slate-900">{isDeleting?.nama}</span> akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-200 text-slate-600">Batal</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => isDeleting && deleteMutation.mutate(isDeleting.id)}
            >
              Ya, Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
