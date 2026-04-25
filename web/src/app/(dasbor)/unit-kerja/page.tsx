"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUnitKerjaList,
  createUnitKerja,
  updateUnitKerja,
  deleteUnitKerja,
  getLevelUnitKerja,
  getDinasInfo,
  UnitKerja,
  UnitKerjaFormData,
} from "@/lib/api/organisasi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Building2,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  Info,
  Power
} from "lucide-react";
import Link from "next/link";
import { showError, showSuccess } from "@/lib/toast";

const JENIS_UNIT_OPTIONS = [
  { value: "upt", label: "UPT (Unit Pelaksana Teknis)" },
  { value: "sd", label: "SD (Sekolah Dasar)" },
  { value: "smp", label: "SMP" },
  { value: "sma", label: "SMA" },
  { value: "smk", label: "SMK" },
];

interface FormState {
  nama: string;
  kode: string;
  jenis: string;
  alamat: string;
  telepon: string;
  email: string;
  latitude: string;
  longitude: string;
  radius_absensi_meter: string;
  id_level_unit: string;
  id_induk_unit: string;
}

const emptyForm: FormState = {
  nama: "",
  kode: "",
  jenis: "",
  alamat: "",
  telepon: "",
  email: "",
  latitude: "",
  longitude: "",
  radius_absensi_meter: "100",
  id_level_unit: "",
  id_induk_unit: "",
};

export default function UnitKerjaPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<UnitKerja | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<UnitKerja | null>(null);

  const { data: unitListRes, isLoading } = useQuery({
    queryKey: ["unit-kerja"],
    queryFn: getUnitKerjaList,
  });

  const { data: levelListRes } = useQuery({
    queryKey: ["level-unit"],
    queryFn: getLevelUnitKerja,
  });

  const { data: dinasRes } = useQuery({
    queryKey: ["dinas-info"],
    queryFn: getDinasInfo,
  });

  const uptList = useMemo(() => {
    if (!unitListRes?.data || !levelListRes?.data) return [];
    const uptLevelId = levelListRes.data.find(l => Number(l.level) === 2)?.id;
    return unitListRes.data.filter(u => u.id_level_unit === uptLevelId);
  }, [unitListRes, levelListRes]);

  const selectedLevel = useMemo(() => {
    return levelListRes?.data?.find(l => l.id === form.id_level_unit);
  }, [levelListRes, form.id_level_unit]);

  const createMutation = useMutation({
    mutationFn: (payload: UnitKerjaFormData) => createUnitKerja(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unit-kerja"] });
      showSuccess("Unit kerja berhasil ditambahkan");
      handleClose();
    },
    onError: (err: any) => showError(err.message || "Gagal menambah unit kerja"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UnitKerjaFormData> }) =>
      updateUnitKerja(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unit-kerja"] });
      showSuccess("Unit kerja berhasil diperbarui");
      handleClose();
    },
    onError: (err: any) => showError(err.message || "Gagal memperbarui unit kerja"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUnitKerja(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unit-kerja"] });
      showSuccess("Unit kerja berhasil dihapus permanen");
      setDeleteConfirm(null);
    },
    onError: (err: any) => showError(err.message || "Gagal menonaktifkan unit kerja"),
  });

  const handleOpen = (unit?: UnitKerja) => {
    if (unit) {
      setEditing(unit);
      setForm({
        nama: unit.nama,
        kode: unit.kode,
        jenis: unit.jenis,
        alamat: unit.alamat ?? "",
        telepon: unit.telepon ?? "",
        email: unit.email ?? "",
        latitude: unit.latitude?.toString() ?? "",
        longitude: unit.longitude?.toString() ?? "",
        radius_absensi_meter: unit.radius_absensi_meter?.toString() ?? "100",
        id_level_unit: unit.id_level_unit ?? "",
        id_induk_unit: unit.id_induk_unit ?? "none",
      });
    } else {
      setEditing(null);
      setForm(emptyForm);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleJenisChange = (v: string | null) => {
    if (!v) return;
    let newIndukId = form.id_induk_unit;
    if (v === "upt") {
      newIndukId = "none";
    }
    setForm({ ...form, jenis: v, id_induk_unit: newIndukId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dinasRes?.data?.id) {
      showError("Data dinas tidak tersedia. Silakan muat ulang halaman.");
      return;
    }

    if (!form.jenis) {
      showError("Jenis unit kerja wajib dipilih.");
      return;
    }

    if (!form.id_level_unit) {
      showError("Level unit kerja wajib dipilih.");
      return;
    }

    const payload: UnitKerjaFormData = {
      id_dinas: dinasRes.data.id,
      id_level_unit: form.id_level_unit,
      id_induk_unit: (form.id_induk_unit && form.id_induk_unit !== "none") ? form.id_induk_unit : undefined,
      nama: form.nama,
      kode: form.kode,
      jenis: form.jenis,
      alamat: form.alamat || undefined,
      telepon: form.telepon || undefined,
      email: form.email || undefined,
      latitude: parseFloat(form.latitude) || 0,
      longitude: parseFloat(form.longitude) || 0,
      radius_absensi_meter: parseInt(form.radius_absensi_meter) || 100,
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Unit Kerja</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola daftar instansi, sekolah, dan kantor di bawah naungan Dinas
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 gap-2"
          onClick={() => handleOpen()}
        >
          <Plus className="w-4 h-4" />
          Tambah Unit Kerja
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nama Unit</TableHead>
              <TableHead>Jenis / Level</TableHead>
              <TableHead>Lokasi / Radius</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : unitListRes?.data && unitListRes.data.length > 0 ? (
              unitListRes.data.map((unit) => (
                <TableRow key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{unit.nama}</p>
                        <p className="text-xs text-slate-400">Kode: {unit.kode || '-'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="w-fit bg-slate-100 text-slate-600 border-slate-200 uppercase text-[10px]">
                        {unit.jenis.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-[10px] text-slate-400 italic">
                        {levelListRes?.data?.find(l => l.id === unit.id_level_unit)?.nama || 'Unknown Level'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-xs text-slate-500">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {unit.latitude ? `${unit.radius_absensi_meter}m Radius` : 'Lokasi belum diset'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {unit.aktif ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/unit-kerja/${unit.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-1" /> Detail
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:bg-slate-100"
                        onClick={() => handleOpen(unit)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${unit.aktif ? 'text-amber-500 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                        onClick={() => updateMutation.mutate({ id: unit.id, data: { aktif: !unit.aktif } })}
                        title={unit.aktif ? "Nonaktifkan Unit" : "Aktifkan Unit"}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => setDeleteConfirm(unit)}
                        title="Hapus Permanen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Belum ada data unit kerja.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Tambah / Edit */}
      <Dialog open={isOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-md">
                    {editing ? <Edit2 className="w-4 h-4 text-blue-400" /> : <Plus className="w-4 h-4 text-blue-400" />}
                  </div>
                  {editing ? "Edit Unit Kerja" : "Tambah Unit Kerja Baru"}
                </DialogTitle>
              </DialogHeader>
            </div>

            <div className="px-6 py-6 space-y-6 max-h-[75vh] overflow-y-auto bg-white">
              {/* Section 1: Identitas Dasar */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Identitas & Klasifikasi Unit
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Unit Kerja <span className="text-red-500">*</span></label>
                    <Input
                      required
                      className="bg-slate-50 border-slate-200 focus:ring-blue-500"
                      placeholder="Contoh: SD Negeri 01 Siliwangi"
                      value={form.nama}
                      onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kode Unit (NPSN) <span className="text-red-500">*</span></label>
                    <Input
                      required
                      className="bg-slate-50 border-slate-200 focus:ring-blue-500 font-mono"
                      placeholder="Contoh: 20212345"
                      value={form.kode}
                      onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis Unit <span className="text-red-500">*</span></label>
                    <Select
                      value={form.jenis}
                      onValueChange={handleJenisChange}
                    >
                      <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Pilih jenis..." />
                      </SelectTrigger>
                      <SelectContent>
                        {JENIS_UNIT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Organisasi <span className="text-red-500">*</span></label>
                    <Select
                      value={form.id_level_unit}
                      onValueChange={(v) => setForm({ ...form, id_level_unit: v ?? "" })}
                    >
                      <SelectTrigger className="bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Pilih level...">
                          {form.id_level_unit ? (levelListRes?.data?.find((l) => l.id === form.id_level_unit)?.nama || form.id_level_unit) : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {levelListRes?.data ? (
                          levelListRes.data
                            .filter((l) => Number(l.level) > 1)
                            .map((level) => (
                              <SelectItem key={level.id} value={level.id}>
                                {level.nama}
                              </SelectItem>
                            ))
                        ) : (
                          <div className="p-2 text-xs text-slate-400">Memuat data...</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Induk <span className="text-red-500">*</span></label>
                    <Select
                      value={form.id_induk_unit || "none"}
                      onValueChange={(v) => setForm({ ...form, id_induk_unit: v ?? "" })}
                      disabled={form.jenis === "upt"}
                    >
                      <SelectTrigger className={`bg-slate-50 border-slate-200 ${form.jenis === "upt" ? "opacity-70 cursor-not-allowed" : ""}`}>
                        <SelectValue placeholder="Pilih unit induk...">
                          {form.id_induk_unit === "none" ? "🏢 Dinas Pendidikan (Langsung)" : (form.id_induk_unit ? (uptList.find((u) => u.id === form.id_induk_unit)?.nama || form.id_induk_unit) : null)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="font-bold text-blue-700">🏢 Dinas Pendidikan (Langsung)</SelectItem>
                        {uptList.map((upt) => (
                          <SelectItem key={upt.id} value={upt.id}>{upt.nama}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.jenis === "upt" && (
                      <p className="text-[10px] text-blue-500 italic mt-1">
                        UPT secara struktural selalu berada langsung di bawah Dinas Pendidikan.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Kontak & Lokasi */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Kontak & Geofencing
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Lengkap</label>
                    <Input
                      className="bg-slate-50 border-slate-200"
                      placeholder="Jl. Raya Siliwangi No. 123..."
                      value={form.alamat}
                      onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Telepon Kantor</label>
                    <Input
                      className="bg-slate-50 border-slate-200"
                      placeholder="022-XXXXXXX"
                      value={form.telepon}
                      onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Unit</label>
                    <Input
                      className="bg-slate-50 border-slate-200"
                      type="email"
                      placeholder="unit@sekolah.id"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="col-span-2 grid grid-cols-3 gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Latitude</label>
                      <Input
                        className="bg-white border-blue-200 text-sm h-9"
                        placeholder="-6.9175"
                        value={form.latitude}
                        onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Longitude</label>
                      <Input
                        className="bg-white border-blue-200 text-sm h-9"
                        placeholder="107.5169"
                        value={form.longitude}
                        onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Radius (m)</label>
                      <Input
                        className="bg-white border-blue-200 text-sm h-9"
                        type="number"
                        placeholder="100"
                        value={form.radius_absensi_meter}
                        onChange={(e) => setForm({ ...form, radius_absensi_meter: e.target.value })}
                      />
                    </div>
                    <p className="col-span-3 text-[10px] text-blue-500 italic flex items-center gap-1 mt-1">
                      <Info className="w-3 h-3" /> Koordinat ini digunakan sebagai pusat titik absensi pegawai.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-200">
              {!editing && (
                <div className="flex items-center gap-2 text-[11px] text-slate-400 italic">
                  <AlertCircle className="w-3 h-3" />
                  Otomatis terhubung ke {dinasRes?.data?.nama || "Dinas"}.
                </div>
              )}
              <div className="flex gap-3 ml-auto">
                <Button type="button" variant="ghost" className="text-slate-500 hover:bg-slate-200" onClick={handleClose}>
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-8 shadow-lg shadow-blue-200" 
                  disabled={isMutating}
                >
                  {isMutating ? "Menyimpan..." : (editing ? "Update Data" : "Simpan Unit")}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" /> Hapus Permanen Unit Kerja?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 py-2">
            Anda akan menghapus <span className="font-semibold">{deleteConfirm?.nama}</span> secara permanen dari database.
            <br/><br/>
            <span className="text-xs text-red-500 italic">Catatan: Jika unit ini sudah memiliki bawahan atau data pegawai, penghapusan akan otomatis dibatalkan oleh sistem. Gunakan tombol Power (Nonaktifkan) sebagai gantinya.</span>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button variant="destructive" disabled={deleteMutation.isPending} onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}>
              {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus Permanen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
