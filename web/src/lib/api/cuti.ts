import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface CutiRecord {
  id: string;
  id_pegawai: string;
  pegawai?: {
    nama_lengkap: string;
  };
  jenis_cuti: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  total_hari: number;
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';
  keterangan: string;
}

export interface SaldoCuti {
  id_pegawai: string;
  nama_lengkap: string;
  jenis_cuti: string;
  total: number;
  terpakai: number;
  sisa: number;
}

export async function getCutiList(params: {
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

  return fetchWithToken<ApiResponse<CutiRecord[]>>(`/v1/cuti?${query.toString()}`);
}

export async function getSaldoCuti(id_pegawai?: string) {
  const url = id_pegawai ? `/v1/cuti/saldo?id_pegawai=${id_pegawai}` : '/v1/cuti/saldo';
  return fetchWithToken<ApiResponse<SaldoCuti[]>>(url);
}
