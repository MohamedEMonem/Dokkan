#!/usr/bin/env bash
# ci/qa/lint_check.sh
# ─────────────────────────────────────────────────────────────────────────────
# QA-3: ESLint + TypeScript type-check gate
#   - Installs ESLint + TypeScript tooling if not present
#   - Runs ESLint over Backend/src
#   - Runs tsc --noEmit (type errors are HIGH severity)
#   - Produces reports/lint.json for the classify step
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-reports}"
mkdir -p "$REPORTS_DIR"

echo "═══════════════════════════════════════════════"
echo " QA-3 | Lint & Type-Check"
echo "═══════════════════════════════════════════════"

cd Backend

# ── Install tools if needed ───────────────────────────────────────────────────
echo ""
echo "Installing backend dependencies…"
npm ci --prefer-offline --ignore-scripts 2>/dev/null || npm install --ignore-scripts

# ESLint (flat config requires >=v9; use npx to avoid global install issues)
echo "Installing ESLint + TypeScript ESLint plugin…"
npm install --save-dev \
  eslint@^9 \
  @eslint/js \
  typescript-eslint \
  typescript \
  --ignore-scripts 2>/dev/null || true

cd ..

ESLINT_EXIT=0
TSC_EXIT=0

# ── ESLint ────────────────────────────────────────────────────────────────────
echo ""
echo "Running ESLint…"
ESLINT_OUT=$(npx --prefix Backend eslint Backend/src \
  --ext .ts,.js \
  --format json \
  --max-warnings 0 2>&1) || ESLINT_EXIT=$?

# Save raw ESLint JSON output
echo "$ESLINT_OUT" | grep -E '^\[' > "$REPORTS_DIR/eslint-raw.json" 2>/dev/null || true

if (( ESLINT_EXIT == 0 )); then
  echo "  ✅  ESLint: no violations"
else
  echo "  ❌  ESLint found violations (exit $ESLINT_EXIT)"
  echo "$ESLINT_OUT" | head -80
fi

# ── TypeScript type-check ─────────────────────────────────────────────────────
echo ""
echo "Running tsc --noEmit…"
TSC_OUT=$(npx --prefix Backend tsc --noEmit --project Backend/tsconfig.json 2>&1) || TSC_EXIT=$?

if (( TSC_EXIT == 0 )); then
  echo "  ✅  TypeScript: no type errors"
else
  echo "  ❌  TypeScript found type errors"
  echo "$TSC_OUT"
fi

# ── Emit normalised report ────────────────────────────────────────────────────
python3 - <<'PYEOF'
import json, os, re, sys

reports_dir = os.environ.get("REPORTS_DIR", "reports")
eslint_exit  = int(os.environ.get("ESLINT_EXIT", "0"))
tsc_exit     = int(os.environ.get("TSC_EXIT", "0"))

findings = []

# Parse ESLint JSON
eslint_raw = os.path.join(reports_dir, "eslint-raw.json")
if os.path.exists(eslint_raw):
    try:
        with open(eslint_raw) as f:
            data = json.load(f)
        for file_result in data:
            fp = file_result.get("filePath", "")
            for msg in file_result.get("messages", []):
                sev = "HIGH" if msg.get("severity") == 2 else "MEDIUM"
                findings.append({
                    "severity": sev,
                    "tool": "eslint",
                    "file": fp,
                    "line": msg.get("line", 0),
                    "col": msg.get("column", 0),
                    "rule": msg.get("ruleId", "unknown"),
                    "message": msg.get("message", ""),
                    "recommendation": f"Fix ESLint rule '{msg.get('ruleId')}'. "
                                       "Run: npx eslint Backend/src --fix"
                })
    except Exception as e:
        print(f"Warning: could not parse ESLint JSON: {e}", file=sys.stderr)

status = "passed" if (eslint_exit == 0 and tsc_exit == 0) else "failed"
report = {
    "suite": "lint",
    "status": status,
    "eslint_exit": eslint_exit,
    "tsc_exit": tsc_exit,
    "findings": findings
}
out = os.path.join(reports_dir, "lint.json")
with open(out, "w") as f:
    json.dump(report, f, indent=2)
print(f"Lint report written to {out}")
PYEOF
export ESLINT_EXIT TSC_EXIT

python3 - <<'PYEOF2'
import json, os
reports_dir = os.environ.get("REPORTS_DIR", "reports")
eslint_exit  = int(os.environ.get("ESLINT_EXIT", "0"))
tsc_exit     = int(os.environ.get("TSC_EXIT", "0"))

status = "passed" if (eslint_exit == 0 and tsc_exit == 0) else "failed"
findings = []

eslint_raw = os.path.join(reports_dir, "eslint-raw.json")
if os.path.exists(eslint_raw):
    try:
        with open(eslint_raw) as f:
            data = json.load(f)
        for file_result in data:
            fp = file_result.get("filePath", "")
            for msg in file_result.get("messages", []):
                sev = "HIGH" if msg.get("severity") == 2 else "MEDIUM"
                findings.append({
                    "severity": sev, "tool": "eslint", "file": fp,
                    "line": msg.get("line", 0), "col": msg.get("column", 0),
                    "rule": msg.get("ruleId", "unknown"),
                    "message": msg.get("message", ""),
                    "recommendation": f"Fix ESLint rule '{msg.get('ruleId')}'. Run: npx eslint Backend/src --fix"
                })
    except Exception:
        pass

report = {"suite": "lint", "status": status, "findings": findings}
with open(os.path.join(reports_dir, "lint.json"), "w") as f:
    json.dump(report, f, indent=2)
PYEOF2

echo ""
if (( ESLINT_EXIT != 0 || TSC_EXIT != 0 )); then
  echo "❌ Lint gate FAILED."
  exit 1
fi
echo "✅ Lint gate PASSED."
exit 0
