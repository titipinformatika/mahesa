import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  jenis: 'info' | 'peringatan' | 'mendesak' | 'kenaikan_gaji';
  target: 'semua' | 'dinas' | 'unit';
  disematkan: boolean;
  dibuat_pada: string;
}

export async function getPengumumanList() {
  return fetchWithToken<ApiResponse<Pengumuman[]>>('/v1/pengumuman');
}

export async function createPengumuman(data: any) {
  return fetchWithToken<ApiResponse<Pengumuman>>('/v1/pengumuman', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deletePengumuman(id: string) {
  return fetchWithToken<ApiResponse<any>>(`/v1/pengumuman/${id}`, {
    method: 'DELETE'
  });
}
