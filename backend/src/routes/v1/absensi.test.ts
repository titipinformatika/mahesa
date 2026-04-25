import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { absensiRoutes } from "./absensi";

const app = new Elysia().use(absensiRoutes);

describe("Absensi Module", () => {
  it("GET /hari-ini: Unauthorized", async () => {
    const res = await app.handle(new Request("http://localhost/v1/absensi/hari-ini"));
    expect(res.status).toBe(401);
  });

  it("POST /: Unauthorized", async () => {
    const res = await app.handle(new Request("http://localhost/v1/absensi/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jenis_titik: 'jam_masuk',
        latitude: -6.1754,
        longitude: 106.8272
      })
    }));
    expect(res.status).toBe(401);
  });

  it("GET /rekap: Missing query params", async () => {
    const res = await app.handle(new Request("http://localhost/v1/absensi/rekap"));
    // Validation error for query
    expect(res.status).toBe(422);
  });

  it("POST /manual: Forbidden for regular pegawai", async () => {
    // This is hard to test without a mock token that has 'pegawai' role
    // But we can check if it requires auth
    const res = await app.handle(new Request("http://localhost/v1/absensi/manual", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_pegawai: 'any', jenis_titik: 'jam_masuk' })
    }));
    expect(res.status).toBe(401);
  });
});
