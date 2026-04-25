import { describe, it, expect, beforeAll } from "bun:test";
import { Elysia } from "elysia";
import { dinasLuarRoutes } from "./dinasLuar";

// Mocking some parts if needed, but let's try to test the routes directly
const app = new Elysia().use(dinasLuarRoutes);

describe("Dinas Luar Module", () => {
  it("should have a GET /skema endpoint", async () => {
    // Note: This needs a real DB or mock. Since I pushed to DB, it might work if DB is up.
    // But testing routes in isolation usually requires mocking the DB.
    // For now, I'll just check if the route is registered.
    const response = await app.handle(new Request("http://localhost/v1/dinas-luar/skema"));
    // Since it has authPlugin, it should return 401 if not authorized
    expect(response.status).toBe(401); 
  });

  it("should fail POST / without token", async () => {
    const response = await app.handle(new Request("http://localhost/v1/dinas-luar/", {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' }
    }));
    // Elysia might return 422 (Unprocessable Entity) if body validation fails before auth
    // or 401 if auth fails. Both are acceptable failures for "no token".
    expect([401, 422]).toContain(response.status);
  });
});
