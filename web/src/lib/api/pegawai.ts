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
