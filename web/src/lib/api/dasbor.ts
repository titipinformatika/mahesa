import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface StatistikDasbor {
  total_pegawai: number;
  hadir_hari_ini: number;
  cuti_hari_ini: number;
  dl_hari_ini: number;
  persentase_kehadiran: number;
}

export interface StatusPegawai {
  id: string;
  nama: string;
  jabatan: string;
  status: 'Hadir' | 'Cuti' | 'Dinas Luar' | 'Belum Presensi';
}

export async function getStatistikDasbor() {
  return fetchWithToken<ApiResponse<StatistikDasbor>>('/statistik/dasbor');
}

export async function getStatusPegawai() {
  return fetchWithToken<ApiResponse<StatusPegawai[]>>('/statistik/pantau');
}
