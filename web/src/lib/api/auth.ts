import { fetchPublic } from "./client";
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
