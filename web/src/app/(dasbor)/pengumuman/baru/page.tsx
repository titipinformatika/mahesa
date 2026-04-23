"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { createPengumuman } from "@/lib/api";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, ArrowLeft } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter"),
  isi: z.string().min(10, "Isi pengumuman minimal 10 karakter"),
  jenis: z.enum(['info', 'peringatan', 'mendesak', 'kenaikan_gaji']),
  target: z.enum(['semua', 'dinas', 'unit']),
  disematkan: z.boolean(),
});

export default function BaruPengumumanPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: "",
      isi: "",
      jenis: "info",
      target: "semua",
      disematkan: false,
    },
  });

  const mutation = useMutation({
    mutationFn: createPengumuman,
    onSuccess: () => {
      showSuccess("Pengumuman berhasil dipublikasikan");
      router.push("/pengumuman");
    },
    onError: (err: any) => showError(err.message)
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <Link href="/pengumuman" className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
      </Link>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Buat Pengumuman</h1>
          <p className="text-slate-500 text-sm">Publikasikan informasi baru kepada pegawai</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-widest">Formulir Pengumuman</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Pengumuman</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan judul yang singkat dan jelas..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Pengumuman</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tuliskan isi pengumuman secara detail di sini..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jenis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="info">Informasi Umum</SelectItem>
                          <SelectItem value="peringatan">Peringatan</SelectItem>
                          <SelectItem value="mendesak">Mendesak</SelectItem>
                          <SelectItem value="kenaikan_gaji">Finance / Gaji</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audiens</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Target" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="semua">Seluruh Pegawai</SelectItem>
                          <SelectItem value="dinas">Hanya Dinas</SelectItem>
                          <SelectItem value="unit">Hanya Unit Kerja</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="disematkan"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-slate-50/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold">Sematkan Pengumuman</FormLabel>
                      <FormDescription>
                        Tampilkan di bagian paling atas dashboard pegawai.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700" 
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Mempublikasikan..." : "Publikasikan Sekarang"}
                </Button>
                <Link href="/pengumuman" className="flex-1">
                  <Button variant="outline" className="w-full">Batal</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
