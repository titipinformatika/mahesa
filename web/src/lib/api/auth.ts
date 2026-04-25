import { fetchPublic, fetchWithToken } from "./client";
import { ApiResponse, LoginResponseData } from "@/types/api";

interface LoginPayload {
  email: string;
  password: string;
}

export async function loginAPI(payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> {
  return fetchPublic<ApiResponse<LoginResponseData>>('/v1/otentikasi/masuk', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getProfile() {
  return fetchWithToken<ApiResponse<any>>('/v1/otentikasi/profil-saya');
}
