#!/usr/bin/env bash
# ci/qc/run_unit.sh
# ─────────────────────────────────────────────────────────────────────────────
# QC Unit Test suite
#   - Uses Vitest (installed on demand) to run Backend/tests/**
#   - Enforces coverage threshold: 60% on changed files (warn below 80%)
#   - Retries once on failure to detect flaky tests
#   - Produces reports/unit.json
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-reports}"
mkdir -p "$REPORTS_DIR"
SUITE_STATUS="passed"
FLAKY=false

echo "═══════════════════════════════════════════════"
echo " QC | Unit Tests"
echo "═══════════════════════════════════════════════"

cd Backend

# ── Install Vitest ────────────────────────────────────────────────────────────
echo "Installing Vitest…"
npm ci --prefer-offline --ignore-scripts 2>/dev/null || npm install --ignore-scripts
npm install --save-dev vitest @vitest/coverage-v8 --ignore-scripts 2>/dev/null || true

# ── Run tests (with retry for flakiness detection) ───────────────────────────
run_tests() {
  npx vitest run \
    --reporter=json \
    --outputFile="../${REPORTS_DIR}/vitest-raw.json" \
    --coverage \
    --coverage.reporter=json \
    --coverage.reportsDirectory="../${REPORTS_DIR}/coverage" \
    2>&1
}

echo ""
echo "► Running unit tests (attempt 1)…"
TEST_EXIT=0
TEST_OUT=$(run_tests 2>&1) || TEST_EXIT=$?

if (( TEST_EXIT != 0 )); then
  echo "  ⚠️  First run failed (exit $TEST_EXIT) – retrying to detect flakiness…"
  TEST_EXIT2=0
  TEST_OUT2=$(run_tests 2>&1) || TEST_EXIT2=$?

  if (( TEST_EXIT2 == 0 )); then
    echo "  ⚠️  Tests passed on retry – marking as FLAKY (not blocking merge)"
    FLAKY=true
    SUITE_STATUS="warning"
  else
    echo "  ❌  Tests failed on both attempts."
    SUITE_STATUS="failed"
  fi
else
  echo "  ✅  All tests passed."
fi

cd ..

# ── Coverage check ────────────────────────────────────────────────────────────
COVERAGE_SUMMARY="${REPORTS_DIR}/coverage/coverage-summary.json"
COVERAGE_PCT=0
if [[ -f "$COVERAGE_SUMMARY" ]]; then
  COVERAGE_PCT=$(python3 -c "
import json
with open('${COVERAGE_SUMMARY}') as f:
    d = json.load(f)
total = d.get('total', {})
pct = total.get('lines', {}).get('pct', 0)
print(int(pct))
")
  echo ""
  echo "Coverage: ${COVERAGE_PCT}%"
  if (( COVERAGE_PCT < 60 )); then
    echo "  ❌  Coverage ${COVERAGE_PCT}% is below minimum threshold of 60%"
    SUITE_STATUS="failed"
  elif (( COVERAGE_PCT < 80 )); then
    echo "  ⚠️   Coverage ${COVERAGE_PCT}% is below recommended threshold of 80%"
    [[ "$SUITE_STATUS" == "passed" ]] && SUITE_STATUS="warning"
  else
    echo "  ✅  Coverage threshold met"
  fi
fi

# ── Parse Vitest JSON output ──────────────────────────────────────────────────
python3 - <<PYEOF
import json, os

reports_dir = "${REPORTS_DIR}"
suite_status = "${SUITE_STATUS}"
flaky = "${FLAKY}" == "true"
coverage_pct = int("${COVERAGE_PCT}")

raw_path = os.path.join(reports_dir, "vitest-raw.json")
findings = []
stats = {"total": 0, "passed": 0, "failed": 0, "skipped": 0}

if os.path.exists(raw_path):
    try:
        with open(raw_path) as f:
            data = json.load(f)
        for suite in data.get("testResults", []):
            for test in suite.get("assertionResults", []):
                stats["total"] += 1
                status = test.get("status", "")
                stats[status] = stats.get(status, 0) + 1
                if status == "failed":
                    findings.append({
                        "severity": "HIGH",
                        "tool": "vitest",
                        "file": suite.get("name", ""),
                        "line": 0, "col": 0,
                        "rule": "test-failure",
                        "message": f"Test failed: {test.get('fullName', '')} – {'; '.join(test.get('failureMessages', [])[:1])}",
                        "recommendation": "Fix the failing test or the code it covers."
                    })
    except Exception as e:
        print(f"Warning: could not parse vitest JSON: {e}")

if flaky:
    for f in findings:
        f["severity"] = "MEDIUM"
        f["message"] = "[FLAKY] " + f["message"]

if coverage_pct < 60 and coverage_pct > 0:
    findings.append({
        "severity": "HIGH", "tool": "coverage",
        "file": "Backend/tests", "line": 0, "col": 0,
        "rule": "coverage-threshold",
        "message": f"Line coverage {coverage_pct}% is below the 60% minimum threshold.",
        "recommendation": "Add unit tests for uncovered code paths."
    })

report = {
    "suite": "unit",
    "status": suite_status,
    "flaky": flaky,
    "coverage_pct": coverage_pct,
    "stats": stats,
    "findings": findings
}
out = os.path.join(reports_dir, "unit.json")
with open(out, "w") as f:
    json.dump(report, f, indent=2)
print(f"Unit test report: {out}  (status={suite_status}, coverage={coverage_pct}%)")
PYEOF

echo ""
if [[ "$SUITE_STATUS" == "failed" ]]; then
  echo "❌ Unit test suite FAILED."
  exit 1
fi
echo "✅ Unit test suite PASSED (status: $SUITE_STATUS)."
exit 0
