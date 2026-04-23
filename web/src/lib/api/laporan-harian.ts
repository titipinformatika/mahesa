import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface LaporanHarianRecord {
  id: string;
  id_pegawai: string;
  pegawai?: {
    nama_lengkap: string;
  };
  tanggal: string;
  jumlah_kegiatan: number;
  status: 'menunggu' | 'disetujui' | 'direvisi' | 'ditolak';
  peninjau?: {
    nama_lengkap: string;
  };
}

export async function getLaporanHarianList(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);

  return fetchWithToken<ApiResponse<LaporanHarianRecord[]>>(`/v1/laporan-harian?${query.toString()}`);
}

export async function getLaporanHarianDetail(id: string) {
  return fetchWithToken<ApiResponse<any>>(`/v1/laporan-harian/${id}`);
}
