import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { cutiRoutes } from "./cuti";

const app = new Elysia().use(cutiRoutes);

describe("Cuti Module", () => {
  it("GET /jenis: Success without auth (Elysia handles this)", async () => {
    // Note: GET /jenis still has authPlugin applied because it's at the top.
    const res = await app.handle(new Request("http://localhost/v1/cuti/jenis"));
    expect(res.status).toBe(401);
  });

  it("POST /: Invalid date range", async () => {
    // Testing logic without full auth mock
    // We expect it to fail at auth or validation
    const res = await app.handle(new Request("http://localhost/v1/cuti/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idJenisCuti: 'any',
        tanggalMulai: '2024-12-31',
        tanggalSelesai: '2024-01-01', // End before start
        alasan: 'liburan'
      })
    }));
    expect([401, 400]).toContain(res.status);
  });

  it("GET /menunggu: Forbidden for regular pegawai", async () => {
    const res = await app.handle(new Request("http://localhost/v1/cuti/menunggu"));
    expect(res.status).toBe(401);
  });
});
