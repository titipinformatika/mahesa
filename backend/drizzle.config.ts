import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*', // Lokasi file-file schema tabel (nanti dibuat)
  out: './drizzle',            // Lokasi folder output hasil migrasi (SQL file)
  dialect: 'postgresql',       // Tipe database yang digunakan
  dbCredentials: {
    // Sesuaikan url ini dengan koneksi database lokal Anda
    url: process.env.DATABASE_URL || 'postgres://postgres:password_disini@localhost:5432/mahesa_db',
  },
  verbose: true,
  strict: true,
});
