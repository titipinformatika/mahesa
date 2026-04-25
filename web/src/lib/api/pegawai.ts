import { fetchWithToken } from "./client";
import { ApiResponse, Pegawai } from "@/types/api";

export async function getPegawaiList(page: number = 1, limit: number = 10, search: string = "") {
  const url = `/v1/pegawai?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  return fetchWithToken<ApiResponse<Pegawai[]>>(url);
}

export async function getPegawaiDetail(id: string) {
  return fetchWithToken<ApiResponse<Pegawai>>(`/v1/pegawai/${id}`);
}

export async function createPegawai(data: any) {
  return fetchWithToken<ApiResponse<Pegawai>>('/v1/pegawai', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updatePegawai(id: string, data: any) {
  return fetchWithToken<ApiResponse<Pegawai>>(`/v1/pegawai/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deletePegawai(id: string) {
  return fetchWithToken<ApiResponse<any>>(`/v1/pegawai/${id}`, {
    method: 'DELETE'
  });
}

export interface SkemaJamKerja {
  id: string;
  nama: string;
  deskripsi?: string;
  hari_kerja_seminggu: number;
  jam_masuk: string;
  jam_pulang: string;
  toleransi_terlambat_menit: number;
  aktif: boolean;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export async function getSkemaJamKerjaList(): Promise<ApiResponse<SkemaJamKerja[]>> {
  return fetchWithToken<ApiResponse<SkemaJamKerja[]>>('/v1/pegawai/skema-jam-kerja');
}

export async function createSkemaJamKerja(data: Partial<SkemaJamKerja>): Promise<ApiResponse<SkemaJamKerja>> {
  return fetchWithToken<ApiResponse<SkemaJamKerja>>('/v1/pegawai/skema-jam-kerja', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSkemaJamKerja(id: string, data: Partial<SkemaJamKerja>): Promise<ApiResponse<SkemaJamKerja>> {
  return fetchWithToken<ApiResponse<SkemaJamKerja>>(`/v1/pegawai/skema-jam-kerja/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSkemaJamKerja(id: string): Promise<ApiResponse<void>> {
  return fetchWithToken<ApiResponse<void>>(`/v1/pegawai/skema-jam-kerja/${id}`, {
    method: 'DELETE',
  });
}
