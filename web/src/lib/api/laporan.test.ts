import { describe, expect, it, mock } from "bun:test";
import { getLaporanDinas } from "./laporan";

// Mock fetch
(global as any).fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ 
    status: 'success', 
    data: { periode: '2026-04', summary: { total_pegawai: 100 } } 
}))));

describe("Laporan API Client", () => {
  it("should fetch dinas report summary", async () => {
    const res = await getLaporanDinas("4", "2026");
    expect(res.status).toBe('success');
    expect(res.data?.periode).toBe('2026-04');
    expect(res.data?.summary?.total_pegawai).toBe(100);
  });
});
