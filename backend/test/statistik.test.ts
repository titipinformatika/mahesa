import { describe, expect, it, beforeAll } from 'bun:test';
import { Elysia } from 'elysia';
import { statistikRoutes } from '../src/routes/v1/statistik';

describe('Statistik Module', () => {
    const app = new Elysia().use(statistikRoutes);
    let token: string;

    beforeAll(async () => {
        // Assume we have a way to get token or mock authentication
    });

    it('GET /statistik/dasbor should require authentication', async () => {
        const response = await app.handle(
            new Request('http://localhost/statistik/dasbor')
        );
        expect(response.status).toBe(401);
    });

    // Mocking auth for further tests would be better but let's test the route exists
    it('GET /statistik/pantau should require authentication', async () => {
        const response = await app.handle(
            new Request('http://localhost/statistik/pantau')
        );
        expect(response.status).toBe(401);
    });
});
