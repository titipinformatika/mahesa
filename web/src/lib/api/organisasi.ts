import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface UnitKerja {
  id: string;
  nama: string;
  kode_unit?: string;
  jenis_unit: string;
  alamat?: string;
  latitude?: string;
  longitude?: string;
  radius_absensi_meter: number;
  aktif: boolean;
  parent_id?: string;
}

export async function getUnitKerjaList() {
  return fetchWithToken<ApiResponse<UnitKerja[]>>('/v1/unit-kerja');
}

export async function getUnitKerjaDetail(id: string) {
  return fetchWithToken<ApiResponse<UnitKerja>>(`/v1/unit-kerja/${id}`);
}

export async function createUnitKerja(data: Partial<UnitKerja>) {
  return fetchWithToken<ApiResponse<UnitKerja>>('/v1/unit-kerja', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateUnitKerja(id: string, data: Partial<UnitKerja>) {
  return fetchWithToken<ApiResponse<UnitKerja>>(`/v1/unit-kerja/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}
