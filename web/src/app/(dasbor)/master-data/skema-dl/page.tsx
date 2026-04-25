"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSkemaDL, 
  createSkemaDL, 
  toggleSkemaDL
} from "@/lib/api/dinas-luar";
import { getUnitKerjaUPT, getUnitKerjaByInduk, getUnitKerjaList } from "@/lib/api/organisasi";
import { getProfile } from "@/lib/api/auth";
import { getRole } from "@/lib/auth";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  MapPin,
  Loader2,
  Info,
  CheckCircle2,
  ArrowRight,
  Building2,
  Map
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = {
  dl_penuh: [
    { label: 'Jam Masuk (Berangkat DL)', aturan: 'Bebas' },
    { label: 'Sampai Lokasi DL', aturan: 'Radius DL' },
    { label: 'Jam Pulang', aturan: 'Bebas' },
  ],
  kantor_dl_pulang: [
    { label: 'Masuk Kerja (di Kantor)', aturan: 'Radius Kantor' },
    { label: 'Sampai Lokasi DL', aturan: 'Radius DL' },
    { label: 'Jam Pulang', aturan: 'Bebas' },
  ],
  dl_kantor: [
    { label: 'Jam Masuk (Sebelum DL)', aturan: 'Bebas' },
    { label: 'Sampai Lokasi DL', aturan: 'Radius DL' },
    { label: 'Sampai Kantor', aturan: 'Radius Kantor' },
    { label: 'Pulang Kantor', aturan: 'Radius Kantor' },
  ],
};

export default function SkemaDLPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const peran = typeof window !== 'undefined' ? getRole() : undefined;

  const [form, setForm] = useState({
    kode_skema: "dl_penuh",
    label: "",
    id_upt: "",
    cakupan: "hanya_upt",
    selected_units: [] as string[],
  });

  const { data: profileRes } = useQuery({
    queryKey: ["profil"],
    queryFn: getProfile,
  });

  const myUnitId = profileRes?.data?.id_unit_kerja ?? "";

  // Set UPT otomatis untuk Admin UPT/Unit
  useEffect(() => {
    if (myUnitId && peran !== 'admin_dinas' && !form.id_upt) {
      setForm(prev => ({ ...prev, id_upt: myUnitId }));
    }
  }, [myUnitId, form.id_upt, peran]);

  // Fetch semua UPT untuk Admin Dinas
  const { data: uptRes, isLoading: loadingUpt } = useQuery({
    queryKey: ["unit-kerja-upt"],
    queryFn: getUnitKerjaUPT,
    enabled: peran === 'admin_dinas' && isOpen,
  });

  // Fetch unit bawahan berdasarkan UPT yang dipilih
  const { data: bawahanRes, isLoading: loadingBawahan } = useQuery({
    queryKey: ["unit-kerja-bawahan", form.id_upt],
    queryFn: () => getUnitKerjaByInduk(form.id_upt),
    enabled: !!form.id_upt && ['admin_dinas', 'admin_upt'].includes(peran || '') && isOpen,
  });

  // Fetch unit untuk nama di tabel
  const { data: allUnitRes } = useQuery({
    queryKey: ["unit-kerja-all"],
    queryFn: getUnitKerjaList,
  });

  const getUnitName = (id: string) => {
    if (!allUnitRes?.data) return id;
    const unit = allUnitRes.data.find(u => u.id === id);
    return unit ? unit.nama : id;
  };

  const { data: skemaRes, isLoading: loadingSkema } = useQuery({
    queryKey: ["skema-dl"],
    queryFn: () => getSkemaDL(),
  });

  const createMutation = useMutation({
    mutationFn: createSkemaDL,
    onSuccess: (res) => {
      showSuccess(res.message || "Skema dinas luar berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["skema-dl"] });
      setIsOpen(false);
      setForm(prev => ({ 
        kode_skema: "dl_penuh", 
        label: "", 
        id_upt: peran === 'admin_dinas' ? "" : prev.id_upt,
        cakupan: "hanya_upt",
        selected_units: []
      }));
    },
    onError: (error: Error) => {
      showError(error.message);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleSkemaDL,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skema-dl"] });
    },
    onError: (error: Error) => {
      showError(error.message);
    },
  });

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleSubmit = () => {
    let id_unit_kerja_list: string[] = [];

    if (peran === 'admin_unit') {
      id_unit_kerja_list = [myUnitId];
    } else {
      if (!form.id_upt) {
        showError("Pilih UPT terlebih dahulu");
        return;
      }
      
      id_unit_kerja_list.push(form.id_upt); // Selalu sertakan UPT

      if (form.cakupan === 'upt_semua' && bawahanRes?.data) {
        id_unit_kerja_list.push(...bawahanRes.data.map(u => u.id));
      } else if (form.cakupan === 'upt_pilih') {
        id_unit_kerja_list.push(...form.selected_units);
      }
    }

    createMutation.mutate({
      id_unit_kerja_list,
      kode_skema: form.kode_skema,
      label: form.label
    });
  };

  const currentTemplate = TEMPLATES[form.kode_skema as keyof typeof TEMPLATES] || [];
  const unitBawahan = bawahanRes?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Skema Dinas Luar</h1>
            <p className="text-slate-500 text-sm">Konfigurasi alur absensi untuk perjalanan dinas luar.</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" /> Konfigurasi Baru
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Unit Kerja</TableHead>
              <TableHead>Kode Skema</TableHead>
              <TableHead>Label Tampilan</TableHead>
              <TableHead>Alur Titik</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingSkema ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                </TableRow>
              ))
            ) : skemaRes?.data && skemaRes.data.length > 0 ? (
              skemaRes.data.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {getUnitName(s.id_unit_kerja)}
                        </span>
                     </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 font-mono">
                      {s.kode_skema}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-800">
                    {s.label}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {s.titik_titik.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                            {t.label}
                          </span>
                          {idx < s.titik_titik.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Switch 
                        checked={s.aktif} 
                        onCheckedChange={() => handleToggle(s.id)}
                        disabled={toggleMutation.isPending}
                      />
                      <span className={`text-xs font-medium ${s.aktif ? 'text-green-600' : 'text-slate-400'}`}>
                        {s.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <MapPin className="w-8 h-8 opacity-20" />
                    <p className="italic">Belum ada skema Dinas Luar yang dikonfigurasi.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader className="bg-slate-50 px-6 py-4 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Konfigurasi Skema Dinas Luar
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              
              {/* Dropdown UPT hanya untuk Admin Dinas */}
              {peran === 'admin_dinas' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih UPT <span className="text-red-500">*</span></label>
                  <Select 
                    value={form.id_upt} 
                    onValueChange={(v) => {
                      setForm({ ...form, id_upt: v ?? "", selected_units: [] });
                    }}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={loadingUpt ? "Memuat UPT..." : "Pilih UPT"} />
                    </SelectTrigger>
                    <SelectContent>
                      {uptRes?.data?.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Radio Cakupan Penerapan untuk Admin Dinas & UPT */}
              {['admin_dinas', 'admin_upt'].includes(peran || '') && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cakupan Penerapan <span className="text-red-500">*</span></label>
                  <RadioGroup 
                    value={form.cakupan} 
                    onValueChange={(v) => setForm({ ...form, cakupan: v, selected_units: [] })}
                    className="gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hanya_upt" id="hanya_upt" />
                      <Label htmlFor="hanya_upt" className="font-normal cursor-pointer">Hanya UPT ini saja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upt_semua" id="upt_semua" />
                      <Label htmlFor="upt_semua" className="font-normal cursor-pointer">UPT + Semua unit bawahan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upt_pilih" id="upt_pilih" />
                      <Label htmlFor="upt_pilih" className="font-normal cursor-pointer">UPT + Pilih unit bawahan</Label>
                    </div>
                  </RadioGroup>

                  {/* Daftar Unit Bawahan (Muncul jika pilih_unit) */}
                  {form.cakupan === 'upt_pilih' && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm font-medium mb-3">Pilih Unit Bawahan:</p>
                      {loadingBawahan ? (
                        <div className="text-sm text-slate-500 flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Memuat unit...</div>
                      ) : unitBawahan.length === 0 ? (
                        <div className="text-sm text-slate-500 italic">Tidak ada unit bawahan.</div>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {unitBawahan.map((unit) => (
                            <div key={unit.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`unit-${unit.id}`}
                                checked={form.selected_units.includes(unit.id)}
                                onCheckedChange={(checked) => {
                                  setForm(prev => {
                                    if (checked) {
                                      return { ...prev, selected_units: [...prev.selected_units, unit.id] };
                                    } else {
                                      return { ...prev, selected_units: prev.selected_units.filter(id => id !== unit.id) };
                                    }
                                  });
                                }}
                              />
                              <Label htmlFor={`unit-${unit.id}`} className="text-sm font-normal leading-none cursor-pointer">
                                {unit.nama}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe Skema Baku <span className="text-red-500">*</span></label>
                <Select 
                  value={form.kode_skema} 
                  onValueChange={(v) => setForm({ ...form, kode_skema: v ?? "" })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih tipe skema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dl_penuh">DL Penuh (Tanpa ke Kantor)</SelectItem>
                    <SelectItem value="kantor_dl_pulang">Kantor → Lokasi DL → Pulang</SelectItem>
                    <SelectItem value="dl_kantor">Lokasi DL → Masuk Kantor → Pulang</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-400">Pilih alur baku yang akan digunakan sebagai dasar skema ini.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Label Tampilan (Opsional)</label>
                <Input
                  className="h-11"
                  placeholder="Misal: Perjalanan Dalam Kota"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase mb-4 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  Visualisasi Alur Titik Absensi
                </h4>
                <div className="relative">
                  <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-slate-200 z-0" />
                  <div className="space-y-6 relative z-10">
                    {currentTemplate.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm font-semibold text-slate-800">{t.label}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[10px] font-medium py-0">
                              GPS: {t.aturan}
                            </Badge>
                            <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[10px] font-medium py-0">
                              Bukti: Selfie
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shrink-0 shadow-md">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-bold text-green-600">Selesai</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 shrink-0 bg-slate-50 px-6 py-4 border-t">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
              onClick={handleSubmit}
              disabled={createMutation.isPending || (peran === 'admin_dinas' && !form.id_upt)}
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Skema'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
