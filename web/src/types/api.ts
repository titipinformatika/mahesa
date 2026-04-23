export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total?: number;
    total_halaman?: number;
  };
}

export interface LoginResponseData {
  token: string;
  peran: string;
}

export interface Pegawai {
  id: string;
  nama_lengkap: string;
  nik: string;
  nip?: string;
  email: string;
  peran: string;
  id_unit_kerja: string;
  unit_kerja?: {
    nama: string;
  };
  // Tambahkan field lain sesuai kebutuhan
}
