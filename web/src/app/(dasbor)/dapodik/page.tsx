"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkDapodikDiff, runDapodikSync, DapodikDiffResult, DapodikItem } from "@/lib/api/dapodik";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Database, FileUp, AlertCircle, RefreshCcw, Plus, Download, Trash2 } from "lucide-react";
import { showError, showSuccess } from "@/lib/toast";
import { readExcel, exportToExcel } from "@/lib/excel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function DapodikPage() {
  const [file, setFile] = useState<File | null>(null);
  const [diff, setDiff] = useState<DapodikDiffResult | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const diffMutation = useMutation({
    mutationFn: checkDapodikDiff,
    onSuccess: (res) => {
        if (res.data) setDiff(res.data);
        showSuccess("Pratinjau perbedaan berhasil dimuat");
    },
    onError: (err: Error) => showError(err.message),
  });

  const syncMutation = useMutation({
    mutationFn: ({ additions, updates }: { additions: DapodikItem[], updates: DapodikItem[] }) => runDapodikSync(additions, updates),
    onSuccess: () => {
        showSuccess("Sinkronisasi database berhasil");
        setDiff(null);
        setFile(null);
    },
    onError: (err: Error) => showError(err.message),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setDiff(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    try {
        setIsReading(true);
        const data = await readExcel(file);
        if (data.length === 0) throw new Error("File kosong atau format tidak sesuai");
        diffMutation.mutate(data);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan";
        showError(message);
    } finally {
        setIsReading(false);
    }
  };

  const handleSync = () => {
    if (!diff) return;
    setIsConfirmOpen(true);
  };

  const executeSync = () => {
    if (!diff) return;
    syncMutation.mutate({
        additions: diff.new,
        updates: diff.updated.map(u => u.new)
    });
    setIsConfirmOpen(false);
  };

  const handleDownloadTemplate = () => {
    exportToExcel(
      [], 
      [
        { header: 'NIP', key: 'nip', width: 20 },
        { header: 'Nama', key: 'nama', width: 30 },
        { header: 'Jabatan', key: 'jabatan', width: 25 },
        { header: 'ID Unit Kerja', key: 'idUnit', width: 25 },
      ], 
      'Template_Dapodik_MAHESA'
    );
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sinkronisasi Dapodik</h1>
        <p className="text-muted-foreground mt-1">Integrasikan data kepegawaian dari sistem Dapodik.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <FileUp className="size-5 text-primary" /> Unggah Data
                </CardTitle>
                <CardDescription>Pilih file Excel (.xlsx) dari Dapodik.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center space-y-2 hover:bg-primary/10 transition-colors cursor-pointer relative">
                    <Input 
                        type="file" 
                        accept=".xlsx" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange}
                    />
                    <Database className="size-8 mx-auto text-primary/40" />
                    <p className="text-sm font-medium">{file ? file.name : 'Klik untuk pilih file'}</p>
                </div>
                <Button 
                    className="w-full" 
                    disabled={!file || isReading || diffMutation.isPending}
                    onClick={handleProcess}
                >
                    {isReading || diffMutation.isPending ? 'Memproses...' : 'Cek Perbedaan'}
                </Button>
                <Button 
                    variant="outline" 
                    className="w-full gap-2" 
                    onClick={handleDownloadTemplate}
                >
                    <Download className="size-4" /> Unduh Template
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">Format Kolom: NIP, Nama, Jabatan, ID Unit Kerja</p>
            </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border/40">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg">Pratinjau Sinkronisasi</CardTitle>
                    <CardDescription>Detail perbedaan data sebelum diterapkan ke database.</CardDescription>
                </div>
                {diff && (
                    <Button variant="default" className="gap-2" onClick={handleSync} disabled={syncMutation.isPending}>
                        <RefreshCcw className={`size-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} /> 
                        Jalankan Sync
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {!diff ? (
                    <div className="py-20 text-center text-muted-foreground">
                        <AlertCircle className="size-12 mx-auto mb-4 opacity-10" />
                        <p>Silakan unggah dan proses file untuk melihat pratinjau.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                                {diff.new.length} Baru
                            </Badge>
                            <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                                {diff.updated.length} Diubah
                            </Badge>
                            <Badge variant="destructive">
                                {diff.removed.length} Dihapus
                            </Badge>
                        </div>

                        <Tabs defaultValue="new">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="new" className="gap-2">
                                    <Plus className="size-4" /> Baru ({diff.new.length})
                                </TabsTrigger>
                                <TabsTrigger value="updated" className="gap-2">
                                    <RefreshCcw className="size-4" /> Berubah ({diff.updated.length})
                                </TabsTrigger>
                                <TabsTrigger value="removed" className="gap-2">
                                    <Trash2 className="size-4" /> Dihapus ({diff.removed.length})
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="new" className="pt-4">
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted text-muted-foreground text-xs uppercase">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-bold">NIP</th>
                                                <th className="px-4 py-2 text-left font-bold">Nama</th>
                                                <th className="px-4 py-2 text-left font-bold">Jabatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {diff.new.length === 0 ? (
                                                <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Tidak ada data baru</td></tr>
                                            ) : diff.new.map((n, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 font-mono text-xs">{n.nip}</td>
                                                    <td className="px-4 py-2">{n.nama}</td>
                                                    <td className="px-4 py-2 text-muted-foreground">{n.jabatan}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                            <TabsContent value="updated" className="pt-4">
                                <div className="space-y-4">
                                    {diff.updated.length === 0 ? (
                                        <div className="py-8 text-center text-muted-foreground">Tidak ada perubahan data</div>
                                    ) : diff.updated.map((u, i) => (
                                        <div key={i} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-xs font-bold text-primary">{u.old.nip}</span>
                                                <Badge variant="outline" className="text-[10px]">DIUBAH</Badge>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                                <div className="space-y-1">
                                                    <p className="text-muted-foreground uppercase font-bold text-[9px]">Lama</p>
                                                    <p className="font-medium line-through opacity-50">{u.old.nama_lengkap}</p>
                                                    <p className="text-[10px] italic">{u.old.jabatan}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-primary uppercase font-bold text-[9px]">Baru</p>
                                                    <p className="font-bold">{u.new.nama}</p>
                                                    <p className="text-[10px] text-primary">{u.new.jabatan}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="removed" className="pt-4">
                                <div className="border rounded-lg overflow-hidden border-destructive/20">
                                    <table className="w-full text-sm">
                                        <thead className="bg-destructive/5 text-destructive text-xs uppercase">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-bold">NIP</th>
                                                <th className="px-4 py-2 text-left font-bold">Nama</th>
                                                <th className="px-4 py-2 text-left font-bold">Jabatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-destructive/10">
                                            {diff.removed.length === 0 ? (
                                                <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Tidak ada data yang dihapus</td></tr>
                                            ) : diff.removed.map((n, i) => (
                                                <tr key={i} className="bg-destructive/5 text-destructive">
                                                    <td className="px-4 py-2 font-mono text-xs">{n.nip}</td>
                                                    <td className="px-4 py-2 font-medium">{n.nama}</td>
                                                    <td className="px-4 py-2 opacity-70">{n.jabatan}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Sinkronisasi</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menambah {diff?.new.length} pegawai baru dan memperbarui {diff?.updated.length} data. 
              Data yang tidak ada di file akan ditandai untuk dihapus (proses hapus dilakukan secara manual di menu pegawai jika diperlukan). 
              Apakah Anda yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={executeSync} className="bg-primary">
              Lanjutkan Sync
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
