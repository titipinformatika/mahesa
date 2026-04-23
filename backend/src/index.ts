import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { otentikasiRoutes } from "./routes/v1/otentikasi";
import { organisasiRoutes } from "./routes/v1/organisasi";
import { pegawaiRoutes } from "./routes/v1/pegawai";
import { biodataRoutes } from "./routes/v1/biodata";
import { absensiRoutes } from "./routes/v1/absensi";

const app = new Elysia()
  .use(cors()) // Mengizinkan akses dari domain luar (CORS)
  // Mendaftarkan grup rute otentikasi
  .use(otentikasiRoutes)
  .use(organisasiRoutes)
  .use(pegawaiRoutes)
  .use(biodataRoutes)
  .use(absensiRoutes)
  
  // Endpoint root untuk cek kesehatan server
  .get("/", () => "Hello MAHESA Backend is Running!")
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
