import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello MAHESA API is running!")
  .get("/v1/health", () => ({ status: "OK", timestamp: new Date() }))
  .listen(3000);

console.log(
  `🦊 MAHESA API is running at ${app.server?.hostname}:${app.server?.port}`
);
