import { describe, expect, it, mock } from "bun:test";
import { createPengumuman, getPengumumanList } from "./pengumuman";

// Mock fetch
(global as any).fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ 
    status: 'success', 
    data: [{ id: '1', judul: 'Test' }] 
}))));

describe("Pengumuman API Client", () => {
  it("should fetch announcements list", async () => {
    const res = await getPengumumanList();
    expect(res.status).toBe('success');
    expect(res.data).toHaveLength(1);
    expect(res.data?.[0]?.judul).toBe('Test');
  });

  it("should create new announcement", async () => {
    (global as any).fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ 
        status: 'success', 
        data: { id: '2', judul: 'New' } 
    }))));
    
    const res = await createPengumuman({ judul: 'New', konten: 'Content' });
    expect(res.status).toBe('success');
    expect(res.data?.judul).toBe('New');
  });
});
