#!/usr/bin/env bash
# ci/qc/run_static.sh
# ─────────────────────────────────────────────────────────────────────────────
# QC Static Analysis suite
#   1. ESLint (errors = HIGH, warnings = MEDIUM)
#   2. TypeScript strict type-check
#   3. Dependency audit (npm audit)
# Output: reports/static.json (normalised findings schema)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-reports}"
mkdir -p "$REPORTS_DIR"
SUITE_STATUS="passed"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "═══════════════════════════════════════════════"
echo " QC | Static Analysis"
echo "═══════════════════════════════════════════════"

cd Backend
npm ci --prefer-offline --ignore-scripts 2>/dev/null || npm install --ignore-scripts
npm install --save-dev eslint@^9 @eslint/js typescript-eslint typescript \
  --ignore-scripts 2>/dev/null || true
cd ..

ESLINT_FINDINGS_FILE="$REPORTS_DIR/_eslint_findings.json"
TSC_FINDINGS_FILE="$REPORTS_DIR/_tsc_findings.json"
AUDIT_FINDINGS_FILE="$REPORTS_DIR/_audit_findings.json"

# ── 1. ESLint ─────────────────────────────────────────────────────────────────
echo ""
echo "► ESLint…"
ESLINT_RAW="$REPORTS_DIR/eslint-raw.json"
npx --prefix Backend eslint Backend/src \
  --ext .ts,.js --format json \
  --output-file "$ESLINT_RAW" 2>/dev/null || true

if [[ -f "$ESLINT_RAW" ]]; then
  python3 "$SCRIPT_DIR/_parse_eslint.py" < "$ESLINT_RAW" > "$ESLINT_FINDINGS_FILE"
else
  echo "[]" > "$ESLINT_FINDINGS_FILE"
fi
ESLINT_COUNT=$(python3 -c "import json,sys; print(len(json.load(open('$ESLINT_FINDINGS_FILE'))))")
echo "  Found $ESLINT_COUNT ESLint issues"
[[ "$ESLINT_COUNT" -gt 0 ]] && SUITE_STATUS="failed"

# ── 2. TypeScript ─────────────────────────────────────────────────────────────
echo ""
echo "► TypeScript tsc --noEmit…"
TSC_EXIT=0
npx --prefix Backend tsc --noEmit --project Backend/tsconfig.json \
  2>"$REPORTS_DIR/_tsc_stderr.txt" || TSC_EXIT=$?

if [[ "$TSC_EXIT" != "0" ]]; then
  python3 "$SCRIPT_DIR/_parse_tsc.py" < "$REPORTS_DIR/_tsc_stderr.txt" > "$TSC_FINDINGS_FILE"
  TSC_COUNT=$(python3 -c "import json,sys; print(len(json.load(open('$TSC_FINDINGS_FILE'))))")
  echo "  ❌ TypeScript: $TSC_COUNT error(s)"
  SUITE_STATUS="failed"
else
  echo "[]" > "$TSC_FINDINGS_FILE"
  echo "  ✅ No TypeScript errors"
fi

# ── 3. npm audit ──────────────────────────────────────────────────────────────
echo ""
echo "► npm audit…"
AUDIT_RAW="$REPORTS_DIR/_audit_raw.json"
(cd Backend && npm audit --json > "../$AUDIT_RAW" 2>/dev/null) || true

python3 - <<PYEOF
import json, sys, os
audit_raw = "$AUDIT_RAW"
out_file  = "$AUDIT_FINDINGS_FILE"
findings  = []
if os.path.exists(audit_raw):
    try:
        with open(audit_raw) as f:
            data = json.load(f)
        sev_map = {"critical":"HIGH","high":"HIGH","moderate":"MEDIUM","low":"LOW","info":"LOW"}
        for pkg, info in data.get("vulnerabilities",{}).items():
            sev = sev_map.get(info.get("severity","low"),"LOW")
            findings.append({
                "severity": sev, "tool": "npm-audit",
                "file": "Backend/package.json", "line": 0, "col": 0,
                "rule": f"npm-vulnerability/{pkg}",
                "message": f"Package '{pkg}' has a {info.get('severity')} vulnerability",
                "recommendation": f"Run: cd Backend && npm audit fix"
            })
    except Exception as e:
        print(f"Warning: npm audit parse error: {e}", file=sys.stderr)
with open(out_file,"w") as f:
    json.dump(findings, f)
high = sum(1 for x in findings if x["severity"]=="HIGH")
print(f"  Found {high} HIGH-severity npm audit issues ({len(findings)} total)")
PYEOF
AUDIT_HIGH=$(python3 -c "
import json
d = json.load(open('$AUDIT_FINDINGS_FILE'))
print(sum(1 for x in d if x.get('severity')=='HIGH'))
")
[[ "$AUDIT_HIGH" -gt 0 ]] && SUITE_STATUS="failed"

# ── Merge & write final report ────────────────────────────────────────────────
python3 "$SCRIPT_DIR/_merge_static.py" \
  "$REPORTS_DIR" \
  "$ESLINT_FINDINGS_FILE" \
  "$TSC_FINDINGS_FILE" \
  "$AUDIT_FINDINGS_FILE" \
  "$SUITE_STATUS"

echo ""
if [[ "$SUITE_STATUS" == "failed" ]]; then
  echo "❌ Static analysis FAILED."
  exit 1
fi
echo "✅ Static analysis PASSED."
exit 0
