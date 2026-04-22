import { Elysia } from "elysia";
import { otentikasiRoutes } from "./routes/v1/otentikasi";
import { organisasiRoutes } from "./routes/v1/organisasi";

const app = new Elysia()
  // Mendaftarkan grup rute otentikasi
  .use(otentikasiRoutes)
  .use(organisasiRoutes)
  
  // Endpoint root untuk cek kesehatan server
  .get("/", () => "Hello MAHESA Backend is Running!")
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
