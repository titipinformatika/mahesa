import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { organisasiRoutes } from '../src/routes/v1/organisasi';
import { pegawaiRoutes } from '../src/routes/v1/pegawai';

describe('Master Data Endpoints Existence', () => {
  const orgApp = new Elysia().use(organisasiRoutes);
  const pegApp = new Elysia().use(pegawaiRoutes);

  it('should have level-unit endpoints protected', async () => {
    const res = await orgApp.handle(new Request('http://localhost/v1/organisasi/level-unit', {
      method: 'POST',
      body: JSON.stringify({ level: 99, nama: 'Test' }),
      headers: { 'Content-Type': 'application/json' }
    }));
    // Should be 401 because no token
    expect(res.status).toBe(401);
  });

  it('should have skema-jam-kerja endpoints protected', async () => {
    const res = await pegApp.handle(new Request('http://localhost/v1/pegawai/skema-jam-kerja', {
      method: 'POST',
      body: JSON.stringify({ nama: 'Test', hari_kerja_seminggu: 5, jam_masuk: '08:00', jam_pulang: '16:00' }),
      headers: { 'Content-Type': 'application/json' }
    }));
    expect(res.status).toBe(401);
  });
});
