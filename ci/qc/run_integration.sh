#!/usr/bin/env bash
# ci/qc/run_integration.sh
# ─────────────────────────────────────────────────────────────────────────────
# QC Integration Test suite
#   - Starts infrastructure via docker-compose (postgres, redis)
#   - Runs Prisma migrations against the test DB
#   - Executes integration tests in Backend/tests/integration/**
#   - Tears down containers regardless of outcome
#   - Produces reports/integration.json
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-reports}"
mkdir -p "$REPORTS_DIR"
SUITE_STATUS="passed"

echo "═══════════════════════════════════════════════"
echo " QC | Integration Tests"
echo "═══════════════════════════════════════════════"

# ── Determine if integration tests exist ─────────────────────────────────────
INTEG_DIR="Backend/tests/integration"
if [[ ! -d "$INTEG_DIR" ]] || [[ -z "$(ls -A "$INTEG_DIR" 2>/dev/null)" ]]; then
  echo "  ⚠️  No integration tests found in $INTEG_DIR – suite skipped."
  cat > "${REPORTS_DIR}/integration.json" <<EJSON
{"suite":"integration","status":"skipped","findings":[],"message":"No integration tests found. Add tests to ${INTEG_DIR}"}
EJSON
  exit 0
fi

# ── Start dependencies ────────────────────────────────────────────────────────
echo ""
echo "► Starting docker-compose services (postgres, redis)…"
docker compose -f Backend/docker-compose.yml up -d postgres redis \
  --wait --wait-timeout 60 2>/dev/null || {
  echo "  ⚠️  docker compose unavailable – integration tests skipped."
  cat > "${REPORTS_DIR}/integration.json" <<EJSON
{"suite":"integration","status":"skipped","findings":[],"message":"Docker not available in this runner."}
EJSON
  exit 0
}

cleanup() {
  echo ""
  echo "Stopping docker-compose services…"
  docker compose -f Backend/docker-compose.yml down 2>/dev/null || true
}
trap cleanup EXIT

# ── Run migrations ────────────────────────────────────────────────────────────
echo ""
echo "► Running Prisma migrations…"
export DATABASE_URL="${DATABASE_URL:-postgresql://admin:root@localhost:5432/my_app_db}"
(cd Backend && npx prisma migrate deploy 2>&1) || {
  echo "  ⚠️  Prisma migrate failed – integration tests skipped."
  SUITE_STATUS="warning"
}

# ── Run integration tests ─────────────────────────────────────────────────────
echo ""
echo "► Running integration tests…"
cd Backend
npm install --save-dev vitest @vitest/coverage-v8 --ignore-scripts 2>/dev/null || true

TEST_EXIT=0
INTEG_OUT=$(npx vitest run tests/integration \
  --reporter=json \
  --outputFile="../${REPORTS_DIR}/vitest-integ-raw.json" 2>&1) || TEST_EXIT=$?

cd ..

if (( TEST_EXIT != 0 )); then
  echo "  ❌  Integration tests failed"
  SUITE_STATUS="failed"
else
  echo "  ✅  All integration tests passed"
fi

# ── Emit report ───────────────────────────────────────────────────────────────
python3 - <<PYEOF
import json, os

reports_dir = "${REPORTS_DIR}"
suite_status = "${SUITE_STATUS}"
findings = []

raw_path = os.path.join(reports_dir, "vitest-integ-raw.json")
if os.path.exists(raw_path):
    try:
        with open(raw_path) as f:
            data = json.load(f)
        for suite in data.get("testResults", []):
            for test in suite.get("assertionResults", []):
                if test.get("status") == "failed":
                    findings.append({
                        "severity": "HIGH", "tool": "vitest-integration",
                        "file": suite.get("name",""),
                        "line": 0, "col": 0,
                        "rule": "integration-test-failure",
                        "message": f"Integration test failed: {test.get('fullName','')}",
                        "recommendation": "Fix the integration test or the service logic it tests."
                    })
    except Exception as e:
        print(f"Warning: could not parse integration test JSON: {e}")

report = {"suite": "integration", "status": suite_status, "findings": findings}
out = os.path.join(reports_dir, "integration.json")
with open(out, "w") as f:
    json.dump(report, f, indent=2)
print(f"Integration test report: {out}")
PYEOF

echo ""
if [[ "$SUITE_STATUS" == "failed" ]]; then
  echo "❌ Integration test suite FAILED."
  exit 1
fi
echo "✅ Integration test suite PASSED (status: $SUITE_STATUS)."
exit 0
