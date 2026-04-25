import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { otentikasiRoutes } from "./otentikasi";

const app = new Elysia().use(otentikasiRoutes);

describe("Otentikasi Module", () => {
  it("Login: Email tidak ditemukan", async () => {
    const res = await app.handle(new Request("http://localhost/v1/otentikasi/masuk", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@example.com', password: 'any' })
    }));
    const data: any = await res.json();
    expect(res.status).toBe(401);
    expect(data.message).toBe("Email tidak ditemukan atau akun tidak aktif");
  });

  it("Login: Validasi format email", async () => {
    const res = await app.handle(new Request("http://localhost/v1/otentikasi/masuk", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: 'any' })
    }));
    // Elysia returns 422 for validation error
    expect(res.status).toBe(422);
  });

  it("Keluar: Berhasil", async () => {
    const res = await app.handle(new Request("http://localhost/v1/otentikasi/keluar", {
      method: 'POST'
    }));
    const data: any = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("success");
  });

  it("Profil Saya: Unauthorized", async () => {
    const res = await app.handle(new Request("http://localhost/v1/otentikasi/profil-saya"));
    expect(res.status).toBe(401);
  });
});
