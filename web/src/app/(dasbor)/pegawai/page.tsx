"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPegawaiList, createPegawai, deletePegawai, getUnitKerjaList } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Eye, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { showSuccess, showError, showPromise } from "@/lib/toast";

const formSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama minimal 3 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  nip: z.string().optional(),
  email: z.string().email("Email tidak valid"),
  jenis_kelamin: z.enum(["L", "P"]),
  id_unit_kerja: z.string().min(1, "Unit kerja wajib dipilih"),
  peran: z.string(),
});

export default function DaftarPegawaiPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['pegawai', page, search],
    queryFn: () => getPegawaiList(page, 10, search),
  });

  const { data: units } = useQuery({
    queryKey: ['unit-kerja-list'],
    queryFn: getUnitKerjaList,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_lengkap: "",
      nik: "",
      email: "",
      jenis_kelamin: "L",
      id_unit_kerja: "",
      peran: "pegawai",
    },
  });

  const createMutation = useMutation({
    mutationFn: createPegawai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pegawai'] });
      setIsAddSheetOpen(false);
      form.reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePegawai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pegawai'] });
      setItemToDelete(null);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    showPromise(createMutation.mutateAsync(values), {
      loading: "Sedang menambahkan pegawai...",
      success: "Pegawai berhasil ditambahkan",
      error: "Gagal menambahkan pegawai"
    });
  }

  const handleDelete = (id: string) => {
    showPromise(deleteMutation.mutateAsync(id), {
      loading: "Sedang menonaktifkan pegawai...",
      success: "Pegawai berhasil dinonaktifkan",
      error: "Gagal menonaktifkan pegawai"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pegawai</h1>
          <p className="text-slate-500 text-sm">Kelola data pegawai pada instansi Anda</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Pegawai
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari nama pegawai..." 
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>NIP / NIK</TableHead>
              <TableHead>Unit Kerja</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[60px] rounded-full" /></TableCell>
                  <TableCell><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                </TableRow>
              ))
            ) : data?.data?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium text-slate-800">{p.nama_lengkap}</TableCell>
                <TableCell className="text-slate-500 text-xs">{p.nip || p.nik}</TableCell>
                <TableCell className="text-slate-600 text-xs">{p.unit_kerja?.nama || '-'}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/pegawai/${p.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600"><Eye className="w-4 h-4"/></Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-slate-600"><Edit className="w-4 h-4"/></Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => setItemToDelete(p.id)}
                    >
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
          <span className="text-sm text-slate-500">
            Halaman {page} dari {data?.meta?.total_halaman || 1}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Sebelumnya
            </Button>
            <Button variant="outline" size="sm" disabled={page >= (data?.meta?.total_halaman || 1)} onClick={() => setPage(p => p + 1)}>
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Tambah Pegawai Baru</SheetTitle>
            <SheetDescription>
              Lengkapi formulir di bawah untuk mendaftarkan pegawai baru ke sistem.
            </SheetDescription>
          </SheetHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
              <FormField
                control={form.control}
                name="nama_lengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Asep Riki" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nik"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIK (16 Digit)</FormLabel>
                      <FormControl>
                        <Input placeholder="320..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="pegawai@mahesa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jenis_kelamin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih L/P" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_unit_kerja"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Kerja</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units?.data?.map(u => (
                            <SelectItem key={u.id} value={u.id}>{u.nama}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter className="pt-6">
                <Button type="submit" className="w-full bg-blue-600" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Menyimpan..." : "Simpan Pegawai"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menonaktifkan akun pegawai tersebut. Data absensi dan kinerja yang sudah ada tetap tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Nonaktifkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
