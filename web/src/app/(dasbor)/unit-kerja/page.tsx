"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnitKerjaList } from "@/lib/api";
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
import { Plus, Building2, MapPin, Eye, Edit } from "lucide-react";
import Link from "next/link";

export default function UnitKerjaPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['unit-kerja'],
    queryFn: getUnitKerjaList,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Unit Kerja</h1>
          <p className="text-slate-500 text-sm">Kelola daftar instansi, sekolah, dan kantor di bawah naungan Dinas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Unit Kerja
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
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Memuat data unit kerja...
                </TableCell>
              </TableRow>
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((unit) => (
                <TableRow key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{unit.nama}</p>
                        <p className="text-xs text-slate-400">Kode: {unit.kode_unit || '-'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 capitalize">
                        {unit.jenis_unit.replace(/_/g, ' ')}
                      </Badge>
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
                    <div className="flex justify-end gap-2">
                      <Link href={`/unit-kerja/${unit.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4 mr-2" /> Detail
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Tidak ada data unit kerja.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
