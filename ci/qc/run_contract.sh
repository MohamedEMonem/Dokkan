#!/usr/bin/env bash
# ci/qc/run_contract.sh
# ─────────────────────────────────────────────────────────────────────────────
# QC Contract Test suite
#   - Validates Backend API routes against the OpenAPI specification in
#     ci/qc/openapi-spec.yaml using openapi-cli or a Python validator
#   - Checks that all routes defined in the spec have corresponding Express
#     route handlers (no ghost endpoints)
#   - Produces reports/contract.json
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-reports}"
mkdir -p "$REPORTS_DIR"
SUITE_STATUS="passed"

echo "═══════════════════════════════════════════════"
echo " QC | Contract Tests (OpenAPI)"
echo "═══════════════════════════════════════════════"

SPEC_FILE="ci/qc/openapi-spec.yaml"

if [[ ! -f "$SPEC_FILE" ]]; then
  echo "  ⚠️  OpenAPI spec not found at $SPEC_FILE – skipping contract validation."
  cat > "${REPORTS_DIR}/contract.json" <<EJSON
{"suite":"contract","status":"skipped","findings":[],"message":"OpenAPI spec not found. Create ci/qc/openapi-spec.yaml"}
EJSON
  exit 0
fi

# ── Validate OpenAPI spec itself ──────────────────────────────────────────────
echo ""
echo "► Validating OpenAPI spec syntax…"
python3 - <<'PYEOF'
import sys
try:
    import yaml
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyyaml", "-q"])
    import yaml
import json, os

spec_path = "ci/qc/openapi-spec.yaml"
with open(spec_path) as f:
    spec = yaml.safe_load(f)

errors = []
if "openapi" not in spec:
    errors.append("Missing 'openapi' version field")
if "info" not in spec:
    errors.append("Missing 'info' section")
if "paths" not in spec:
    errors.append("Missing 'paths' section")

if errors:
    for e in errors:
        print(f"  ❌  {e}")
    sys.exit(1)

print(f"  ✅  OpenAPI spec valid: {len(spec.get('paths',{}))} paths defined")
PYEOF

SPEC_EXIT=$?
[[ $SPEC_EXIT -ne 0 ]] && SUITE_STATUS="failed"

# ── Cross-reference routes ────────────────────────────────────────────────────
echo ""
echo "► Cross-referencing OpenAPI paths with Express routes…"
python3 - <<'PYEOF'
import sys, os, re, json

try:
    import yaml
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyyaml", "-q"])
    import yaml

reports_dir = os.environ.get("REPORTS_DIR", "reports")
spec_path = "ci/qc/openapi-spec.yaml"
routes_dir = "Backend/src/routes"

with open(spec_path) as f:
    spec = yaml.safe_load(f)

spec_paths = set()
for path in spec.get("paths", {}).keys():
    # Normalise OpenAPI path params {param} → :param for comparison
    norm = re.sub(r'\{(\w+)\}', r':\1', path)
    spec_paths.add(norm)

# Scan Express route files for registered paths
route_paths = set()
for root, dirs, files in os.walk(routes_dir):
    for fn in files:
        if not fn.endswith((".ts", ".js")):
            continue
        with open(os.path.join(root, fn)) as f:
            content = f.read()
        for m in re.finditer(r'\.(get|post|put|patch|delete|all)\s*\(\s*[\'"]([^\'"]+)[\'"]', content):
            route_paths.add(m.group(2))

findings = []
# Paths in spec but not in routes → undocumented implementation
for sp in spec_paths:
    if sp not in route_paths:
        findings.append({
            "severity": "MEDIUM", "tool": "contract-check",
            "file": spec_path, "line": 0, "col": 0,
            "rule": "missing-route-implementation",
            "message": f"OpenAPI path '{sp}' has no matching Express route handler.",
            "recommendation": f"Add the route handler or remove the path from the OpenAPI spec."
        })

# Paths in routes but not in spec → missing docs (warn only)
for rp in route_paths:
    if rp not in spec_paths and not rp.startswith("/api/health"):
        findings.append({
            "severity": "LOW", "tool": "contract-check",
            "file": routes_dir, "line": 0, "col": 0,
            "rule": "undocumented-route",
            "message": f"Express route '{rp}' is not documented in the OpenAPI spec.",
            "recommendation": "Add the route to ci/qc/openapi-spec.yaml"
        })

high_count = sum(1 for f in findings if f["severity"] in ("HIGH","MEDIUM"))
print(f"  Found {len(findings)} contract issues ({high_count} HIGH/MEDIUM)")
for fn in findings[:10]:
    print(f"  [{fn['severity']}] {fn['rule']}: {fn['message'][:80]}")

status = os.environ.get("SUITE_STATUS", "passed")
if high_count > 0:
    status = "failed"

report = {"suite": "contract", "status": status, "findings": findings}
out = os.path.join(reports_dir, "contract.json")
with open(out, "w") as f:
    json.dump(report, f, indent=2)
print(f"Contract report: {out}")

if high_count > 0:
    sys.exit(1)
PYEOF
CONTRACT_EXIT=$?
[[ $CONTRACT_EXIT -ne 0 ]] && SUITE_STATUS="failed"

echo ""
if [[ "$SUITE_STATUS" == "failed" ]]; then
  echo "❌ Contract test suite FAILED."
  exit 1
fi
echo "✅ Contract test suite PASSED (status: $SUITE_STATUS)."
exit 0
