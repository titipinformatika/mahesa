import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface UnitKerja {
  id: string;
  nama: string;
  kode: string;
  jenis: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  radius_absensi_meter: number;
  aktif: boolean;
  id_induk_unit?: string;
  id_dinas?: string;
  id_level_unit?: string;
}

export interface UnitKerjaFormData {
  nama: string;
  kode: string;
  jenis: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  latitude: number;
  longitude: number;
  radius_absensi_meter?: number;
  aktif?: boolean;
  id_dinas: string;
  id_level_unit: string;
  id_induk_unit?: string;
}

export interface LevelUnitKerja {
  id: string;
  level: number;
  nama: string;
  keterangan?: string;
}

export async function getUnitKerjaList(): Promise<ApiResponse<UnitKerja[]>> {
  return fetchWithToken<ApiResponse<UnitKerja[]>>('/v1/organisasi/unit-kerja');
}

export async function getUnitKerjaUPT(): Promise<ApiResponse<UnitKerja[]>> {
  return fetchWithToken<ApiResponse<UnitKerja[]>>('/v1/organisasi/unit-kerja-upt');
}

export async function getUnitKerjaByInduk(idInduk: string): Promise<ApiResponse<UnitKerja[]>> {
  return fetchWithToken<ApiResponse<UnitKerja[]>>(`/v1/organisasi/unit-kerja-by-induk/${idInduk}`);
}

export async function getUnitKerjaDetail(id: string): Promise<ApiResponse<UnitKerja>> {
  return fetchWithToken<ApiResponse<UnitKerja>>(`/v1/organisasi/unit-kerja/${id}`);
}

export async function createUnitKerja(data: UnitKerjaFormData): Promise<ApiResponse<UnitKerja>> {
  return fetchWithToken<ApiResponse<UnitKerja>>('/v1/organisasi/unit-kerja', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUnitKerja(id: string, data: Partial<UnitKerjaFormData>): Promise<ApiResponse<UnitKerja>> {
  return fetchWithToken<ApiResponse<UnitKerja>>(`/v1/organisasi/unit-kerja/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUnitKerja(id: string): Promise<ApiResponse<void>> {
  return fetchWithToken<ApiResponse<void>>(`/v1/organisasi/unit-kerja/${id}`, {
    method: 'DELETE',
  });
}

export async function getUnitKerjaPegawai(id: string): Promise<ApiResponse<any[]>> {
  return fetchWithToken<ApiResponse<any[]>>(`/v1/organisasi/unit-kerja/${id}/pegawai`);
}

export async function getDinasInfo(): Promise<ApiResponse<any>> {
  return fetchWithToken<ApiResponse<any>>('/v1/organisasi/dinas');
}

export async function getLevelUnitKerja(): Promise<ApiResponse<LevelUnitKerja[]>> {
  return fetchWithToken<ApiResponse<LevelUnitKerja[]>>('/v1/organisasi/level-unit');
}

export async function createLevelUnitKerja(data: Partial<LevelUnitKerja>): Promise<ApiResponse<LevelUnitKerja>> {
  return fetchWithToken<ApiResponse<LevelUnitKerja>>('/v1/organisasi/level-unit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLevelUnitKerja(id: string, data: Partial<LevelUnitKerja>): Promise<ApiResponse<LevelUnitKerja>> {
  return fetchWithToken<ApiResponse<LevelUnitKerja>>(`/v1/organisasi/level-unit/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLevelUnitKerja(id: string): Promise<ApiResponse<void>> {
  return fetchWithToken<ApiResponse<void>>(`/v1/organisasi/level-unit/${id}`, {
    method: 'DELETE',
  });
}
