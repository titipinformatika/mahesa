import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { pengumumanRoutes } from "./pengumuman";

const app = new Elysia().use(pengumumanRoutes);

describe("Pengumuman Module", () => {
  it("GET /: Unauthorized", async () => {
    const res = await app.handle(new Request("http://localhost/pengumuman"));
    expect(res.status).toBe(401);
  });

  it("POST /: Forbidden for regular pegawai", async () => {
    const res = await app.handle(new Request("http://localhost/pengumuman", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        judul: 'Test',
        konten: 'Content',
        tanggalBerlaku: '2024-01-01',
        tanggalBerakhir: '2024-12-31'
      })
    }));
    expect(res.status).toBe(401);
  });
});
