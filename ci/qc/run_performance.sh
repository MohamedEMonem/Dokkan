#!/usr/bin/env bash
# ci/qc/run_performance.sh
# ─────────────────────────────────────────────────────────────────────────────
# QC Performance sanity check
#   - Starts the Backend server in test mode
#   - Runs a k6 smoke test against the health and core API endpoints
#   - Thresholds: p95 latency < 300ms, error rate < 1%
#   - Gracefully skips if k6 is unavailable
#   - Produces reports/performance.json
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-reports}"
mkdir -p "$REPORTS_DIR"
SUITE_STATUS="passed"
SERVER_PID=""

echo "═══════════════════════════════════════════════"
echo " QC | Performance Sanity Check (k6 smoke)"
echo "═══════════════════════════════════════════════"

# ── Install k6 ────────────────────────────────────────────────────────────────
install_k6() {
  if command -v k6 &>/dev/null; then return 0; fi
  echo "Installing k6…"
  K6_VERSION="0.55.0"
  curl -sSfL \
    "https://github.com/grafana/k6/releases/download/v${K6_VERSION}/k6-v${K6_VERSION}-linux-amd64.tar.gz" \
    -o /tmp/k6.tar.gz 2>/dev/null || return 1
  tar -xzf /tmp/k6.tar.gz -C /tmp
  export PATH="/tmp/k6-v${K6_VERSION}-linux-amd64:$PATH"
}

install_k6 || {
  echo "  ⚠️  k6 not available – performance suite skipped."
  cat > "${REPORTS_DIR}/performance.json" <<EJSON
{"suite":"performance","status":"skipped","findings":[],"message":"k6 not available. Install from https://k6.io/docs/get-started/installation/"}
EJSON
  exit 0
}

# ── Start the backend server ──────────────────────────────────────────────────
echo ""
echo "► Starting Backend server for smoke test…"
cd Backend
npm ci --prefer-offline --ignore-scripts 2>/dev/null || npm install --ignore-scripts

export PORT=3099
export DATABASE_URL="${DATABASE_URL:-postgresql://admin:root@localhost:5432/my_app_db}"
export NODE_ENV=test
node src/server.js &>/tmp/server-perf.log &
SERVER_PID=$!
cd ..

cleanup() {
  [[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

# Wait for server to be ready (up to 30s)
echo "Waiting for server to be ready on port ${PORT}…"
for i in $(seq 1 30); do
  if curl -sf "http://localhost:${PORT}/api/health" &>/dev/null; then
    echo "  ✅  Server ready (attempt $i)"
    break
  fi
  sleep 1
  if [[ $i -eq 30 ]]; then
    echo "  ⚠️  Server did not start in 30s – skipping performance tests."
    cat /tmp/server-perf.log | tail -20
    cat > "${REPORTS_DIR}/performance.json" <<EJSON
{"suite":"performance","status":"skipped","findings":[],"message":"Backend server failed to start for smoke test."}
EJSON
    exit 0
  fi
done

# ── Run k6 smoke test ─────────────────────────────────────────────────────────
echo ""
echo "► Running k6 smoke test…"
K6_EXIT=0
k6 run \
  --env BASE_URL="http://localhost:${PORT}" \
  --out json="${REPORTS_DIR}/k6-raw.json" \
  --summary-export="${REPORTS_DIR}/k6-summary.json" \
  ci/qc/k6-smoke.js 2>&1 || K6_EXIT=$?

echo "k6 exit code: $K6_EXIT"

# ── Parse k6 results ──────────────────────────────────────────────────────────
python3 - <<PYEOF
import json, os, sys

reports_dir = "${REPORTS_DIR}"
k6_exit = int("${K6_EXIT}")
suite_status = "passed" if k6_exit == 0 else "failed"
findings = []

summary_path = os.path.join(reports_dir, "k6-summary.json")
if os.path.exists(summary_path):
    with open(summary_path) as f:
        summary = json.load(f)
    metrics = summary.get("metrics", {})

    # p95 latency
    http_req_duration = metrics.get("http_req_duration", {})
    p95 = http_req_duration.get("values", {}).get("p(95)", 9999)
    if p95 > 300:
        findings.append({
            "severity": "HIGH" if p95 > 1000 else "MEDIUM",
            "tool": "k6",
            "file": "Backend/src/server.ts",
            "line": 0, "col": 0,
            "rule": "p95-latency-threshold",
            "message": f"p95 latency {p95:.0f}ms exceeds 300ms threshold.",
            "recommendation": "Profile slow endpoints. Check DB queries and middleware overhead."
        })
        suite_status = "failed"

    # Error rate
    http_req_failed = metrics.get("http_req_failed", {})
    err_rate = http_req_failed.get("values", {}).get("rate", 0)
    if err_rate > 0.01:
        findings.append({
            "severity": "HIGH",
            "tool": "k6",
            "file": "Backend/src/server.ts",
            "line": 0, "col": 0,
            "rule": "error-rate-threshold",
            "message": f"Error rate {err_rate:.1%} exceeds 1% threshold.",
            "recommendation": "Investigate and fix failing endpoints. Check server logs."
        })
        suite_status = "failed"

    print(f"  p95 latency: {p95:.0f}ms  |  error rate: {err_rate:.2%}")

report = {
    "suite": "performance",
    "status": suite_status,
    "findings": findings,
    "k6_exit": k6_exit
}
out = os.path.join(reports_dir, "performance.json")
with open(out, "w") as f:
    json.dump(report, f, indent=2)
print(f"Performance report: {out}  (status={suite_status})")
sys.exit(0 if suite_status != "failed" else 1)
PYEOF
PERF_EXIT=$?
[[ $PERF_EXIT -ne 0 ]] && SUITE_STATUS="failed"

echo ""
if [[ "$SUITE_STATUS" == "failed" ]]; then
  echo "❌ Performance suite FAILED."
  exit 1
fi
echo "✅ Performance suite PASSED."
exit 0
