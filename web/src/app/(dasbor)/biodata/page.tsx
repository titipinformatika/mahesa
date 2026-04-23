"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPengajuanBiodata, setujuiBiodata, tolakBiodata } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError, showPromise } from "@/lib/toast";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Check, X, AlertCircle } from "lucide-react";

export default function PersetujuanBiodataPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [catatanTolak, setCatatanTolak] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['pengajuan-biodata', page],
    queryFn: () => getPengajuanBiodata({ page, limit: 10, status: 'menunggu' }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => setujuiBiodata(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengajuan-biodata'] });
      setSelectedItem(null);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, catatan }: { id: string, catatan: string }) => tolakBiodata(id, catatan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengajuan-biodata'] });
      setSelectedItem(null);
      setCatatanTolak("");
      setIsRejecting(false);
    }
  });

  const handleApprove = (id: string) => {
    showPromise(approveMutation.mutateAsync(id), {
      loading: "Sedang menyetujui perubahan...",
      success: "Perubahan biodata berhasil disetujui",
      error: "Gagal menyetujui perubahan"
    });
  };

  const handleReject = (data: { id: string, catatan: string }) => {
    showPromise(rejectMutation.mutateAsync(data), {
      loading: "Sedang menolak pengajuan...",
      success: "Pengajuan biodata ditolak",
      error: "Gagal menolak pengajuan"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Persetujuan Biodata</h1>
        <p className="text-slate-500 text-sm">Validasi pengajuan perubahan data profil dari pegawai</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nama Pegawai</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead>Data yang Diubah</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">Memuat...</TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.pegawai?.nama_lengkap}</TableCell>
                  <TableCell>{format(new Date(item.dibuat_pada), 'PPP p', { locale: id })}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(item.perubahan).map((key) => (
                        <Badge key={key} variant="secondary" className="text-[10px] capitalize">
                          {key.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => setSelectedItem(item)}
                    >
                      Tinjau
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                  Tidak ada pengajuan biodata baru.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Tinjau Perubahan Biodata</SheetTitle>
            <SheetDescription>
              Bandingkan data yang diajukan oleh {selectedItem?.pegawai?.nama_lengkap}
            </SheetDescription>
          </SheetHeader>

          {selectedItem && (
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                {Object.entries(selectedItem.perubahan).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{key.replace(/_/g, ' ')}</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-100 line-through">
                        Data Lama (Placeholder)
                      </div>
                      <Check className="w-4 h-4 text-slate-300" />
                      <div className="flex-1 p-2 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-100">
                        {String(value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isRejecting ? (
                <div className="p-4 bg-red-50 rounded-lg border border-red-100 space-y-3">
                  <label className="text-xs font-bold text-red-600 uppercase">Alasan Penolakan</label>
                  <Textarea 
                    placeholder="Masukkan alasan mengapa pengajuan ini ditolak..." 
                    className="bg-white border-red-200"
                    value={catatanTolak}
                    onChange={(e) => setCatatanTolak(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleReject({ id: selectedItem.id, catatan: catatanTolak })}
                      disabled={!catatanTolak || rejectMutation.isPending}
                    >
                      Konfirmasi Tolak
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsRejecting(false)}>Batal</Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700" 
                    onClick={() => handleApprove(selectedItem.id)}
                    disabled={approveMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" /> Setujui Perubahan
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setIsRejecting(true)}
                  >
                    <X className="w-4 h-4 mr-2" /> Tolak
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
