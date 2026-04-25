import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";
import { getToken } from "../auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SummaryLaporan {
  total_pegawai: number;
  total_hadir: number;
  total_cuti: number;
  total_dl: number;
}

export interface LaporanDinas {
  periode: string;
  summary: SummaryLaporan;
}

export async function getLaporanDinas(bulan?: string, tahun?: string) {
  let url = '/laporan/dinas';
  const params = new URLSearchParams();
  if (bulan) params.append('bulan', bulan);
  if (tahun) params.append('tahun', tahun);
  if (params.toString()) url += `?${params.toString()}`;
  
  return fetchWithToken<ApiResponse<LaporanDinas>>(url);
}

export async function exportAbsensi(bulan?: string, tahun?: string) {
  let url = '/export/absensi';
  const params = new URLSearchParams();
  if (bulan) params.append('bulan', bulan);
  if (tahun) params.append('tahun', tahun);
  if (params.toString()) url += `?${params.toString()}`;

  const token = getToken();
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) throw new Error('Gagal mengunduh laporan');
  return response.blob();
}
