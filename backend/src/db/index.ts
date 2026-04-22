import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Koneksi akan membaca dari environment variable DATABASE_URL
// Jika tidak ada, gunakan string default ini (sesuaikan password & db name)
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/mahesa_db';

// Konfigurasi client postgres
const client = postgres(connectionString);

// Inisialisasi Drizzle ORM
export const db = drizzle(client);

console.log("🟢 Koneksi Drizzle ORM ke PostgreSQL berhasil di-inisialisasi.");
