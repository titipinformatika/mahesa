import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { lhkpRoutes } from "./lhkp";

const app = new Elysia().use(lhkpRoutes);

describe("LHKP Module", () => {
  it("GET /jenis-kegiatan: Unauthorized", async () => {
    const res = await app.handle(new Request("http://localhost/v1/lhkp/jenis-kegiatan"));
    expect(res.status).toBe(401);
  });

  it("POST /penugasan: Forbidden for regular pegawai", async () => {
    const res = await app.handle(new Request("http://localhost/v1/lhkp/penugasan", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idPegawaiList: [], idJenisKegiatanList: [] })
    }));
    expect(res.status).toBe(401);
  });

  it("POST /laporan-harian: Validation failure (missing details)", async () => {
    const res = await app.handle(new Request("http://localhost/v1/lhkp/laporan-harian", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tanggal: '2024-01-01' })
    }));
    expect(res.status).toBe(422);
  });
});
