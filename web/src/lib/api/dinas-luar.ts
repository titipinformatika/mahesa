import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface DinasLuarRecord {
  id: string;
  id_pegawai: string;
  pegawai?: {
    nama_lengkap: string;
  };
  tanggal: string;
  skema: string;
  tujuan: string;
  keperluan: string;
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'sedang_berjalan' | 'selesai';
  catatan_pimpinan?: string;
}

export async function getDinasLuarList(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);

  return fetchWithToken<ApiResponse<DinasLuarRecord[]>>(`/v1/dinas-luar?${query.toString()}`);
}

export async function getPetaLangsung() {
  return fetchWithToken<ApiResponse<unknown[]>>('/v1/dinas-luar/peta-langsung');
}

export async function getSkemaDL() {
  return fetchWithToken<ApiResponse<unknown[]>>('/v1/dinas-luar/skema');
}

export async function toggleSkemaDL(id: string, aktif: boolean) {
  return fetchWithToken<ApiResponse<unknown>>(`/v1/dinas-luar/skema/${id}/toggle`, {
    method: 'PUT',
    body: JSON.stringify({ aktif })
  });
}
