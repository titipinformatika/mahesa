import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export async function checkDapodikDiff() {
  return fetchWithToken<ApiResponse<any>>('/v1/dapodik/perbedaan');
}

export async function runDapodikSync() {
  return fetchWithToken<ApiResponse<any>>('/v1/dapodik/sinkronisasi', {
    method: 'POST'
  });
}

export async function getDapodikSyncHistory() {
  return fetchWithToken<ApiResponse<any[]>>('/v1/dapodik/riwayat-sinkronisasi');
}
