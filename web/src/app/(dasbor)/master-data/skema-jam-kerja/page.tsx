"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSkemaJamKerjaList, 
  createSkemaJamKerja, 
  updateSkemaJamKerja, 
  deleteSkemaJamKerja,
  SkemaJamKerja 
} from "@/lib/api/pegawai";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Clock,
  Loader2,
  Calendar,
  AlertCircle,
  Info
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

export default function SkemaJamKerjaPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SkemaJamKerja | null>(null);
  const [isDeleting, setIsDeleting] = useState<SkemaJamKerja | null>(null);

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    hari_kerja_seminggu: "5",
    jam_masuk: "08:00",
    jam_pulang: "16:00",
    toleransi_terlambat_menit: "15",
    aktif: true,
  });

  const { data: skemaRes, isLoading } = useQuery({
    queryKey: ["skema-jam-kerja"],
    queryFn: getSkemaJamKerjaList,
  });

  const createMutation = useMutation({
    mutationFn: createSkemaJamKerja,
    onSuccess: () => {
      showSuccess("Skema jam kerja berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["skema-jam-kerja"] });
      handleClose();
    },
    onError: (error: any) => {
      showError(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSkemaJamKerja(id, data),
    onSuccess: () => {
      showSuccess("Skema jam kerja berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["skema-jam-kerja"] });
      handleClose();
    },
    onError: (error: any) => {
      showError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkemaJamKerja,
    onSuccess: () => {
      showSuccess("Skema jam kerja berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["skema-jam-kerja"] });
      setIsDeleting(null);
    },
    onError: (error: any) => {
      showError(error.message);
    },
  });

  const handleOpen = (skema?: SkemaJamKerja) => {
    if (skema) {
      setEditing(skema);
      setForm({
        nama: skema.nama,
        deskripsi: skema.deskripsi || "",
        hari_kerja_seminggu: skema.hari_kerja_seminggu.toString(),
        jam_masuk: skema.jam_masuk.substring(0, 5),
        jam_pulang: skema.jam_pulang.substring(0, 5),
        toleransi_terlambat_menit: skema.toleransi_terlambat_menit.toString(),
        aktif: skema.aktif,
      });
    } else {
      setEditing(null);
      setForm({
        nama: "",
        deskripsi: "",
        hari_kerja_seminggu: "5",
        jam_masuk: "08:00",
        jam_pulang: "16:00",
        toleransi_terlambat_menit: "15",
        aktif: true,
      });
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nama: form.nama,
      deskripsi: form.deskripsi || undefined,
      hari_kerja_seminggu: parseInt(form.hari_kerja_seminggu),
      jam_masuk: form.jam_masuk,
      jam_pulang: form.jam_pulang,
      toleransi_terlambat_menit: parseInt(form.toleransi_terlambat_menit),
      aktif: form.aktif,
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
          <div className="p-3 bg-indigo-600 rounded-xl">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Skema Jam Kerja</h1>
            <p className="text-slate-500 text-sm">Atur jam masuk, pulang, dan hari kerja pegawai.</p>
          </div>
        </div>
        <Button 
          onClick={() => handleOpen()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Skema
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nama Skema</TableHead>
              <TableHead>Hari Kerja</TableHead>
              <TableHead>Jam Kerja</TableHead>
              <TableHead>Toleransi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : skemaRes?.data && skemaRes.data.length > 0 ? (
              skemaRes.data.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-medium text-slate-800">{s.nama}</div>
                    {s.deskripsi && <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{s.deskripsi}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {s.hari_kerja_seminggu} Hari
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-mono">
                        {s.jam_masuk.substring(0, 5)}
                      </Badge>
                      <span className="text-slate-300">-</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-mono">
                        {s.jam_pulang.substring(0, 5)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600">{s.toleransi_terlambat_menit} Menit</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={s.aktif ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>
                      {s.aktif ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        onClick={() => handleOpen(s)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setIsDeleting(s)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-400 italic">
                  Belum ada data skema jam kerja.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              {editing ? 'Edit Skema Jam Kerja' : 'Tambah Skema Jam Kerja'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Skema <span className="text-red-500">*</span></label>
                <Input
                  required
                  className="bg-slate-50 border-slate-200"
                  placeholder="Contoh: Jam Kerja Reguler"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
                <Textarea
                  className="bg-slate-50 border-slate-200 resize-none"
                  placeholder="Keterangan mengenai skema ini..."
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hari Kerja <span className="text-red-500">*</span></label>
                <Select 
                  value={form.hari_kerja_seminggu} 
                  onValueChange={(v) => setForm({ ...form, hari_kerja_seminggu: v ?? "5" })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Pilih hari kerja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Hari Kerja</SelectItem>
                    <SelectItem value="6">6 Hari Kerja</SelectItem>
                    <SelectItem value="7">7 Hari Kerja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toleransi (Menit)</label>
                <Input
                  type="number"
                  className="bg-slate-50 border-slate-200"
                  placeholder="15"
                  value={form.toleransi_terlambat_menit}
                  onChange={(e) => setForm({ ...form, toleransi_terlambat_menit: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Masuk <span className="text-red-500">*</span></label>
                <Input
                  required
                  type="time"
                  className="bg-slate-50 border-slate-200"
                  value={form.jam_masuk}
                  onChange={(e) => setForm({ ...form, jam_masuk: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Pulang <span className="text-red-500">*</span></label>
                <Input
                  required
                  type="time"
                  className="bg-slate-50 border-slate-200"
                  value={form.jam_pulang}
                  onChange={(e) => setForm({ ...form, jam_pulang: e.target.value })}
                />
              </div>

              <div className="col-span-2 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Status Aktif Skema</span>
                </div>
                <Switch 
                  checked={form.aktif} 
                  onCheckedChange={(checked) => setForm({ ...form, aktif: checked })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex gap-2">
              <Button type="button" variant="ghost" onClick={handleClose}>Batal</Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  editing ? 'Simpan Perubahan' : 'Tambah Skema'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <AlertDialogContent className="border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800">Hapus Skema Jam Kerja?</AlertDialogTitle>
            <AlertDialogDescription className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-800 mt-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>
                Menghapus skema <span className="font-bold text-slate-900">{isDeleting?.nama}</span> dapat mempengaruhi data absensi pegawai yang menggunakan skema ini. Pastikan tidak ada pegawai yang aktif menggunakan skema ini.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
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
