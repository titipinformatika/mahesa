import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface AbsensiRecord {
  id: string;
  id_pegawai: string;
  pegawai?: {
    nama_lengkap: string;
  };
  tanggal: string;
  tipe: 'kantor' | 'dinas_luar';
  status: 'hadir' | 'terlambat' | 'tidak_hadir' | 'izin' | 'sakit' | 'cuti' | 'dinas_luar';
  jam_kerja?: string;
  catatan?: string;
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

export async function getTerlambatList(bulan?: number, tahun?: number) {
  const query = new URLSearchParams();
  if (bulan) query.append('bulan', bulan.toString());
  if (tahun) query.append('tahun', tahun.toString());
  return fetchWithToken<ApiResponse<unknown[]>>(`/v1/absensi/terlambat-absen?${query.toString()}`);
}
