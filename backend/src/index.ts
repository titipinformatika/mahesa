import { Elysia } from "elysia";
import { otentikasiRoutes } from "./routes/v1/otentikasi";

const app = new Elysia()
  // Mendaftarkan grup rute otentikasi
  .use(otentikasiRoutes)
  
  // Endpoint root untuk cek kesehatan server
  .get("/", () => "Hello MAHESA Backend is Running!")
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
