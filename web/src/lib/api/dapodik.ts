import { fetchWithToken } from "./client";
import { ApiResponse } from "@/types/api";

export interface DapodikItem {
    nip: string;
    nama: string;
    jabatan: string;
    idUnit: string;
}

export interface DapodikDiffResult {
    new: DapodikItem[];
    updated: { old: { nip: string; nama_lengkap: string; jabatan: string }; new: DapodikItem }[];
    removed: DapodikItem[];
}

export async function checkDapodikDiff(data: DapodikItem[]) {
  return fetchWithToken<ApiResponse<DapodikDiffResult>>('/dapodik/diff', {
    method: 'POST',
    body: JSON.stringify({ data })
  });
}

export async function runDapodikSync(additions: DapodikItem[], updates: DapodikItem[]) {
  return fetchWithToken<ApiResponse<{ message: string }>>('/dapodik/sinkronisasi', {
    method: 'POST',
    body: JSON.stringify({ additions, updates })
  });
}
