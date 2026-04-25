import { describe, expect, it, mock } from "bun:test";
import { getStatistikDasbor, getStatusPegawai } from "./dasbor";

// Mock fetch
(global as any).fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ 
    status: 'success', 
    data: { total_pegawai: 100 } 
}))));

describe("Dasbor API Client", () => {
  it("should fetch dashboard statistics", async () => {
    const res = await getStatistikDasbor();
    expect(res.status).toBe('success');
    expect(res.data?.total_pegawai).toBe(100);
  });

  it("should fetch employee status", async () => {
    (global as any).fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ 
        status: 'success', 
        data: [{ id: '1', nama: 'Test' }] 
    }))));
    
    const res = await getStatusPegawai();
    expect(res.status).toBe('success');
    expect(res.data).toHaveLength(1);
    expect(res.data?.[0]?.nama).toBe('Test');
  });
});
