import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface Pengumuman {
  id: string;
  judul: string;
  konten: string;
  tanggalBerlaku: string;
  tanggalBerakhir: string;
  idUnit?: string | null;
  peranTarget?: string | null;
  aktif: boolean;
  dibuatPada: string;
  diperbaruiPada: string;
}

export async function getPengumumanList() {
  return fetchWithToken<ApiResponse<Pengumuman[]>>('/pengumuman');
}

export async function createPengumuman(data: Partial<Pengumuman>) {
  return fetchWithToken<ApiResponse<Pengumuman>>('/pengumuman', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updatePengumuman(id: string, data: Partial<Pengumuman>) {
    return fetchWithToken<ApiResponse<Pengumuman>>(`/pengumuman/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

export async function deletePengumuman(id: string) {
  return fetchWithToken<ApiResponse<Pengumuman>>(`/pengumuman/${id}`, {
    method: 'DELETE'
  });
}
