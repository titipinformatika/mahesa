import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export async function getStatistikDasbor() {
  return fetchWithToken<ApiResponse<any>>('/v1/dasbor/statistik');
}

export async function getStatusPegawai(id_unit_kerja?: string) {
  const url = id_unit_kerja ? `/v1/dasbor/status-pegawai?id_unit_kerja=${id_unit_kerja}` : '/v1/dasbor/status-pegawai';
  return fetchWithToken<ApiResponse<any[]>>(url);
}
