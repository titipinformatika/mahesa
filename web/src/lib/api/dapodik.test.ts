import { describe, expect, it, mock } from "bun:test";
import { checkDapodikDiff, runDapodikSync } from "./dapodik";

// Mock fetch
(global as any).fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ 
    status: 'success', 
    data: { new: [{ nip: '123', nama: 'Test', jabatan: 'Staf', idUnit: 'U1' }], updated: [], removed: [] } 
}))));

describe("Dapodik API Client", () => {
  it("should check differences", async () => {
    const res = await checkDapodikDiff([{ nip: '123', nama: 'Test', jabatan: 'Staf', idUnit: 'U1' }]);
    expect(res.status).toBe('success');
    expect(res.data?.new).toHaveLength(1);
  });

  it("should run sync", async () => {
    (global as any).fetch = mock(() => Promise.resolve(new Response(JSON.stringify({ 
        status: 'success', 
        message: 'Sync OK' 
    }))));
    
    const res = await runDapodikSync([{ nip: '123', nama: 'Test', jabatan: 'Staf', idUnit: 'U1' }], []);
    expect(res.status).toBe('success');
  });
});
