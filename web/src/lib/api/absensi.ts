import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface AbsensiRecord {
  id: string;
  id_pegawai: string;
  nama_lengkap?: string; // Dari join di backend
  nip?: string;
  nama_unit?: string;
  tanggal: string;
  tipe: 'kantor' | 'dinas_luar';
  status: 'hadir' | 'terlambat' | 'tidak_hadir' | 'izin' | 'sakit' | 'cuti' | 'dinas_luar';
  jam_kerja?: string;
  catatan?: string;
  detail_titik?: any[]; // Dari json_agg
}

export async function getAbsensiList(params: {
  page?: number;
  limit?: number;
  tanggal?: string;
  status?: string;
  id_pegawai?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.tanggal) query.append('tanggal', params.tanggal);
  if (params.status) query.append('status', params.status);
  if (params.id_pegawai) query.append('id_pegawai', params.id_pegawai);

  return fetchWithToken<ApiResponse<AbsensiRecord[]>>(`/v1/absensi?${query.toString()}`);
}

export async function getTerlambatHariIni() {
  return fetchWithToken<ApiResponse<AbsensiRecord[]>>('/v1/absensi/terlambat');
}

export async function koreksiAbsensi(id: string, body: { status: string; catatan?: string }) {
  return fetchWithToken<ApiResponse<AbsensiRecord>>(`/v1/absensi/${id}/koreksi`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

export async function getRekapAbsensi(bulan: string, tahun: string, id_pegawai?: string) {
  const query = new URLSearchParams({ bulan, tahun });
  if (id_pegawai) query.append('id_pegawai', id_pegawai);
  return fetchWithToken<ApiResponse<AbsensiRecord[]>>(`/v1/absensi/rekap?${query.toString()}`);
}
