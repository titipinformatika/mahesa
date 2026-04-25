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
  unit_id?: string;
  start_date?: string;
  end_date?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);
  if (params.unit_id) query.append('unit_id', params.unit_id);
  if (params.start_date) query.append('start_date', params.start_date);
  if (params.end_date) query.append('end_date', params.end_date);

  return fetchWithToken<ApiResponse<LaporanHarianRecord[]>>(`/v1/lhkp/laporan-harian?${query.toString()}`);
}

export async function getLaporanHarianDetail(id: string) {
  return fetchWithToken<ApiResponse<any>>(`/v1/lhkp/laporan-harian/${id}`);
}
