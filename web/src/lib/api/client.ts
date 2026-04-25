import { getToken } from "../auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (typeof window !== "undefined") {
  console.log('[API_CLIENT] API_URL:', API_URL);
}

export async function fetchWithToken<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== "undefined") {
         window.location.href = "/masuk";
      }
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Terjadi kesalahan pada server');
  }
  
  return res.json();
}

export async function fetchPublic<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Terjadi kesalahan pada server');
  }
  
  return res.json();
}
