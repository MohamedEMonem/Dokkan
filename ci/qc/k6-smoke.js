/**
 * ci/qc/k6-smoke.js
 * k6 smoke test – Dokkan Backend
 *
 * Thresholds (enforced – pipeline fails if breached):
 *   http_req_duration p(95) < 300ms
 *   http_req_failed   rate  < 1%
 *
 * Usage:
 *   k6 run --env BASE_URL=http://localhost:3000 ci/qc/k6-smoke.js
 */
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// ── Custom metrics ────────────────────────────────────────────────────────────
const errorRate = new Rate("custom_error_rate");
const healthDuration = new Trend("health_check_duration");

// ── Options ───────────────────────────────────────────────────────────────────
export const options = {
  // Smoke: a short, low-VU run to confirm no critical regressions
  stages: [
    { duration: "10s", target: 5 },   // ramp up
    { duration: "30s", target: 5 },   // steady state
    { duration: "10s", target: 0 },   // ramp down
  ],
  thresholds: {
    // Pipeline-blocking thresholds
    "http_req_duration": ["p(95)<300"],  // 95th percentile < 300ms
    "http_req_failed":   ["rate<0.01"],  // error rate < 1%
    // Advisory (non-blocking) thresholds
    "http_req_duration{endpoint:health}": ["p(99)<500"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

// ── Test payload helpers ──────────────────────────────────────────────────────
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// ── Default function (VU scenario) ───────────────────────────────────────────
export default function () {
  // 1. Health check
  const healthRes = http.get(`${BASE_URL}/api/health`, {
    tags: { endpoint: "health" },
  });
  healthDuration.add(healthRes.timings.duration);
  const healthOk = check(healthRes, {
    "health: status 200":   (r) => r.status === 200,
    "health: body ok":      (r) => r.json("status") === "OK",
    "health: has timestamp":(r) => typeof r.json("data.timestamp") === "string",
  });
  errorRate.add(!healthOk);

  sleep(0.5);

  // 2. Products list (read-heavy, representative of normal traffic)
  const productsRes = http.get(`${BASE_URL}/api/products`, {
    tags: { endpoint: "products" },
  });
  check(productsRes, {
    "products: status 200 or 401": (r) => [200, 401, 403].includes(r.status),
    "products: responds fast":     (r) => r.timings.duration < 500,
  });
  errorRate.add(![200, 401, 403].includes(productsRes.status));

  sleep(0.5);

  // 3. Stores list
  const storesRes = http.get(`${BASE_URL}/api/stores`, {
    tags: { endpoint: "stores" },
  });
  check(storesRes, {
    "stores: status 200 or 401": (r) => [200, 401, 403].includes(r.status),
  });
  errorRate.add(![200, 401, 403].includes(storesRes.status));

  sleep(1);
}

// ── Setup (runs once before VUs start) ───────────────────────────────────────
export function setup() {
  const res = http.get(`${BASE_URL}/api/health`);
  if (res.status !== 200) {
    throw new Error(
      `Backend health check failed before smoke test. Status: ${res.status}`
    );
  }
  console.log(`[k6-smoke] Backend reachable at ${BASE_URL}`);
  return { baseUrl: BASE_URL };
}
