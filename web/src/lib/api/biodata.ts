import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface PengajuanBiodata {
  id: string;
  id_pegawai: string;
  pegawai?: {
    nama_lengkap: string;
  };
  perubahan: any; // JSONB
  status: 'menunggu' | 'disetujui' | 'ditolak';
  catatan_admin?: string;
  dibuat_pada: string;
}

export async function getPengajuanBiodata(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);

  return fetchWithToken<ApiResponse<PengajuanBiodata[]>>(`/v1/biodata/pengajuan?${query.toString()}`);
}

export async function setujuiBiodata(id: string) {
  return fetchWithToken<ApiResponse<any>>(`/v1/biodata/pengajuan/${id}/setujui`, {
    method: 'PUT',
  });
}

export async function tolakBiodata(id: string, catatan: string) {
  return fetchWithToken<ApiResponse<any>>(`/v1/biodata/pengajuan/${id}/tolak`, {
    method: 'PUT',
    body: JSON.stringify({ catatan_admin: catatan })
  });
}
