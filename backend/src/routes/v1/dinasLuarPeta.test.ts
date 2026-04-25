import { describe, it, expect } from "bun:test";
import { Elysia } from "elysia";
import { dinasLuarRoutes } from "./dinasLuar";

const app = new Elysia().use(dinasLuarRoutes);

describe("Dinas Luar - Peta Monitoring", () => {
  it("should have a GET /peta-langsung endpoint and require auth", async () => {
    const response = await app.handle(new Request("http://localhost/v1/dinas-luar/peta-langsung"));
    // Since it has authPlugin, it should return 401 if not authorized
    expect(response.status).toBe(401); 
  });
});
