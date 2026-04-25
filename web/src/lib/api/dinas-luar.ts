import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface TitikSkema {
  urutan: number;
  jenis: string;
  label: string;
  aturan_lokasi: 'kantor' | 'tujuan_dl' | 'dimana_saja';
}

export interface SkemaDL {
  id: string;
  id_unit_kerja: string;
  kode_skema: 'dl_penuh' | 'kantor_dl_pulang' | 'dl_kantor';
  label: string;
  titik_titik: TitikSkema[];
  aktif: boolean;
  dibuat_pada: string;
  diperbarui_pada: string;
}

export interface DinasLuarRecord {
  id: string;
  id_pegawai: string;
  nama_lengkap?: string;
  nip?: string;
  tanggal: string;
  skema: string;
  nama_tujuan: string;
  latitude_tujuan: string;
  longitude_tujuan: string;
  radius_tujuan_meter: number;
  keperluan: string;
  status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan' | 'sedang_berjalan' | 'selesai';
  alasan_penolakan?: string;
}

export interface LogLokasi {
  id: string;
  id_pegawai: string;
  latitude: string;
  longitude: string;
  akurasi?: string;
  dicatat_pada: string;
}

export interface MonitoringPeta {
  id: string;
  nama_lengkap: string;
  id_unit_kerja: string;
  tujuan: string;
  latitude: string;
  longitude: string;
  waktu_log: string;
}

export async function getSkemaDL(idUnitKerja?: string) {
  const query = idUnitKerja ? `?id_unit_kerja=${idUnitKerja}` : '';
  return fetchWithToken<ApiResponse<SkemaDL[]>>(`/v1/dinas-luar/skema${query}`);
}

export async function createSkemaDL(body: {
  id_unit_kerja_list: string[];
  kode_skema: string;
  label?: string;
}) {
  return fetchWithToken<ApiResponse<SkemaDL>>('/v1/dinas-luar/skema', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function toggleSkemaDL(id: string) {
  return fetchWithToken<ApiResponse<SkemaDL>>(`/v1/dinas-luar/skema/${id}/toggle`, {
    method: 'PATCH'
  });
}

export async function getDinasLuarList(params: {
  page?: number;
  limit?: number;
  status?: string;
  all?: boolean;
}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.status) query.append('status', params.status);
  if (params.all) query.append('all', 'true');

  return fetchWithToken<ApiResponse<DinasLuarRecord[]>>(`/v1/dinas-luar?${query.toString()}`);
}

export async function getLokasiDL(id: string) {
  return fetchWithToken<ApiResponse<LogLokasi[]>>(`/v1/dinas-luar/${id}/lokasi`);
}

export async function getPetaLangsung() {
  return fetchWithToken<ApiResponse<MonitoringPeta[]>>('/v1/dinas-luar/peta-langsung');
}

export async function setPersetujuanDL(id: string, body: { status: 'disetujui' | 'ditolak'; alasan_penolakan?: string }) {
  return fetchWithToken<ApiResponse<DinasLuarRecord>>(`/v1/dinas-luar/${id}/persetujuan`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}
