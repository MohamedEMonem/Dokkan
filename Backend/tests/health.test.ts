/**
 * Backend/tests/health.test.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Unit-level smoke test for the health check route.
 * Uses Vitest + supertest-style inline HTTP testing.
 *
 * Run:  npx vitest run tests/health.test.ts
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import type { Express } from "express";
import { sendSuccess } from "../src/utils/response.js";

// ── Minimal app fixture (no DB required) ────────────────────────────────────
function createTestApp(): Express {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    return sendSuccess(res, { status: "OK", timestamp: new Date().toISOString() }, "Server is healthy");
  });

  return app;
}

// ── Tests ────────────────────────────────────────────────────────────────────
describe("GET /api/health", () => {
  let app: Express;
  let server: ReturnType<Express["listen"]>;
  let baseUrl: string;

  beforeAll(async () => {
    app = createTestApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 3099;
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("returns 200 with status OK", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
  });

  it("returns JSON with success:true", async () => {
    const res  = await fetch(`${baseUrl}/api/health`);
    const body = await res.json() as Record<string, unknown>;
    expect(body.success).toBe(true);
  });

  it("returns a timestamp in the data payload", async () => {
    const res  = await fetch(`${baseUrl}/api/health`);
    const body = await res.json() as { data: { timestamp: string } };
    expect(body.data?.timestamp).toBeDefined();
    expect(new Date(body.data.timestamp).getTime()).toBeGreaterThan(0);
  });

  it("response time is under 500ms", async () => {
    const start = Date.now();
    await fetch(`${baseUrl}/api/health`);
    expect(Date.now() - start).toBeLessThan(500);
  });
});
