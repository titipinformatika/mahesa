import { describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { dapodikRoutes } from '../src/routes/v1/dapodik';
import { pengumumanRoutes } from '../src/routes/v1/pengumuman';

describe('Dapodik & Pengumuman Module', () => {
    const app = new Elysia()
        .use(dapodikRoutes)
        .use(pengumumanRoutes);

    it('GET /pengumuman should require authentication', async () => {
        const response = await app.handle(
            new Request('http://localhost/pengumuman')
        );
        expect(response.status).toBe(401);
    });

    it('POST /dapodik/diff should require authentication', async () => {
        const response = await app.handle(
            new Request('http://localhost/dapodik/diff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: [] })
            })
        );
        expect(response.status).toBe(401);
    });
});
