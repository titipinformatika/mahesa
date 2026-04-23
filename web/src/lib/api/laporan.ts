import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export async function getLaporanKeDinas() {
  return fetchWithToken<ApiResponse<any[]>>('/v1/laporan-ke-dinas');
}

export async function createLaporanKeDinas(data: any) {
  return fetchWithToken<ApiResponse<any>>('/v1/laporan-ke-dinas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
