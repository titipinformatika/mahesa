const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  message: string;
  data?: {
    token: string;
    peran: string;
  };
}

export async function loginAPI(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/v1/otentikasi/masuk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

import { getToken } from "./auth";

// --- Tambahan Helper Fetch Dengan Token ---
async function fetchWithToken(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      // Token tidak valid/expired
      if (typeof window !== "undefined") {
         window.location.href = "/masuk";
      }
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Terjadi kesalahan pada server');
  }
  return res.json();
}

// --- API Pegawai ---
export async function getPegawaiList(page: number = 1, limit: number = 10, search: string = "") {
  const url = `/v1/pegawai?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  return fetchWithToken(url);
}

export async function getPegawaiDetail(id: string) {
  return fetchWithToken(`/v1/pegawai/${id}`);
}
