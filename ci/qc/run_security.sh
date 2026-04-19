#!/usr/bin/env bash
# ci/qc/run_security.sh
# ─────────────────────────────────────────────────────────────────────────────
# QC Security Scanning suite
#   1. Gitleaks  – secret / credential scanning
#   2. Trivy     – filesystem + dependency vulnerability scanning
#   3. CodeQL    – SAST (runs as separate GitHub Actions step; here we run
#                  a lightweight Semgrep SAST scan)
#   4. npm audit – HIGH/CRITICAL dependency CVEs
# Produces reports/security.json
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

REPORTS_DIR="${REPORTS_DIR:-reports}"
mkdir -p "$REPORTS_DIR"
SUITE_STATUS="passed"
ALL_FINDINGS="[]"

echo "═══════════════════════════════════════════════"
echo " QC | Security Scanning"
echo "═══════════════════════════════════════════════"

merge_findings() {
  # Appends $1 (JSON array string) to ALL_FINDINGS
  ALL_FINDINGS=$(python3 -c "
import json, sys
existing = json.loads(sys.argv[1])
new      = json.loads(sys.argv[2])
print(json.dumps(existing + new))
" "$ALL_FINDINGS" "$1")
}

# ── 1. Gitleaks – secret scanning ────────────────────────────────────────────
echo ""
echo "► Gitleaks secret scan…"
GITLEAKS_EXIT=0
if command -v gitleaks &>/dev/null; then
  GITLEAKS_OUT=$(gitleaks detect --source=. --report-format=json \
    --report-path="${REPORTS_DIR}/gitleaks-raw.json" \
    --redact 2>&1) || GITLEAKS_EXIT=$?
else
  # Install gitleaks
  GITLEAKS_VERSION="8.18.3"
  GL_ARCH="linux_x64"
  curl -sSfL \
    "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_${GL_ARCH}.tar.gz" \
    -o /tmp/gitleaks.tar.gz 2>/dev/null || { echo "  ⚠️  Could not download gitleaks – skipping"; GITLEAKS_EXIT=99; }
  if [[ $GITLEAKS_EXIT -ne 99 ]]; then
    tar -xzf /tmp/gitleaks.tar.gz -C /tmp gitleaks
    /tmp/gitleaks detect --source=. --report-format=json \
      --report-path="${REPORTS_DIR}/gitleaks-raw.json" \
      --redact 2>&1 || GITLEAKS_EXIT=$?
  fi
fi

GITLEAKS_FINDINGS="[]"
if [[ -f "${REPORTS_DIR}/gitleaks-raw.json" ]]; then
  GITLEAKS_FINDINGS=$(python3 - <<'PYEOF'
import json, os
rp = os.path.join(os.environ["REPORTS_DIR"], "gitleaks-raw.json")
with open(rp) as f:
    raw = json.load(f)
findings = []
for leak in (raw if isinstance(raw, list) else []):
    findings.append({
        "severity": "HIGH", "tool": "gitleaks",
        "file": leak.get("File",""),
        "line": leak.get("StartLine", 0), "col": 0,
        "rule": leak.get("RuleID","secret-detected"),
        "message": f"Potential secret detected: {leak.get('Description','')} (redacted)",
        "recommendation": "Remove the secret from source code. Rotate any exposed credentials immediately."
    })
print(json.dumps(findings))
PYEOF
)
  GL_COUNT=$(echo "$GITLEAKS_FINDINGS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
  if [[ "$GL_COUNT" -gt 0 ]]; then
    echo "  ❌  $GL_COUNT secret(s) detected by Gitleaks"
    SUITE_STATUS="failed"
  else
    echo "  ✅  No secrets detected"
  fi
fi
merge_findings "$GITLEAKS_FINDINGS"

# ── 2. Trivy – filesystem / dependency CVEs ───────────────────────────────────
echo ""
echo "► Trivy vulnerability scan…"
TRIVY_EXIT=0
if ! command -v trivy &>/dev/null; then
  curl -sSfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh \
    | sh -s -- -b /tmp/trivy-bin 2>/dev/null || { echo "  ⚠️  Could not install Trivy – skipping"; TRIVY_EXIT=99; }
  [[ $TRIVY_EXIT -eq 0 ]] && export PATH="/tmp/trivy-bin:$PATH"
fi

TRIVY_FINDINGS="[]"
if [[ $TRIVY_EXIT -ne 99 ]] && command -v trivy &>/dev/null; then
  trivy fs . \
    --format json \
    --output "${REPORTS_DIR}/trivy-raw.json" \
    --severity HIGH,CRITICAL \
    --exit-code 0 \
    --scanners vuln,secret,misconfig 2>/dev/null || TRIVY_EXIT=$?

  TRIVY_FINDINGS=$(python3 - <<'PYEOF'
import json, os
rp = os.path.join(os.environ["REPORTS_DIR"], "trivy-raw.json")
if not os.path.exists(rp):
    print("[]"); exit()
with open(rp) as f:
    raw = json.load(f)
findings = []
for result in raw.get("Results", []):
    target = result.get("Target","")
    for v in result.get("Vulnerabilities", []):
        sev = "HIGH" if v.get("Severity","") in ("HIGH","CRITICAL") else "MEDIUM"
        findings.append({
            "severity": sev, "tool": "trivy",
            "file": target, "line": 0, "col": 0,
            "rule": v.get("VulnerabilityID",""),
            "message": f"{v.get('PkgName','')} {v.get('InstalledVersion','')} – {v.get('Title','')}",
            "recommendation": f"Upgrade to {v.get('FixedVersion','a patched version')}. See: {v.get('PrimaryURL','')}"
        })
    for s in result.get("Secrets", []):
        findings.append({
            "severity": "HIGH", "tool": "trivy-secret",
            "file": target, "line": s.get("StartLine",0), "col": 0,
            "rule": s.get("RuleID","secret"),
            "message": f"Secret: {s.get('Title','')} (category: {s.get('Category','')})",
            "recommendation": "Remove or rotate exposed credentials."
        })
print(json.dumps(findings))
PYEOF
)
  TV_HIGH=$(echo "$TRIVY_FINDINGS" | python3 -c "import json,sys; d=json.load(sys.stdin); print(sum(1 for x in d if x['severity']=='HIGH'))")
  echo "  Found $TV_HIGH HIGH-severity Trivy issues"
  [[ "$TV_HIGH" -gt 0 ]] && SUITE_STATUS="failed"
fi
merge_findings "$TRIVY_FINDINGS"

# ── 3. Semgrep SAST ───────────────────────────────────────────────────────────
echo ""
echo "► Semgrep SAST…"
SEMGREP_FINDINGS="[]"
if command -v semgrep &>/dev/null || pip show semgrep &>/dev/null 2>&1; then
  SEMGREP_OUT=$(semgrep --config=auto Backend/src \
    --json 2>/dev/null) || true
  SEMGREP_FINDINGS=$(echo "$SEMGREP_OUT" | python3 - <<'PYEOF'
import json, sys
try:
    data = json.load(sys.stdin)
except Exception:
    print("[]"); sys.exit()
findings = []
sev_map = {"ERROR":"HIGH","WARNING":"MEDIUM","INFO":"LOW"}
for r in data.get("results",[]):
    sev = sev_map.get(r.get("severity","WARNING"), "MEDIUM")
    findings.append({
        "severity": sev, "tool": "semgrep",
        "file": r.get("path",""), "line": r.get("start",{}).get("line",0),
        "col": r.get("start",{}).get("col",0),
        "rule": r.get("check_id",""),
        "message": r.get("extra",{}).get("message",""),
        "recommendation": r.get("extra",{}).get("fix","Refer to the Semgrep rule documentation.")
    })
print(json.dumps(findings))
PYEOF
)
  SG_COUNT=$(echo "$SEMGREP_FINDINGS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
  echo "  Found $SG_COUNT Semgrep findings"
else
  echo "  ⚠️  Semgrep not available – skipping (install: pip install semgrep)"
fi
merge_findings "$SEMGREP_FINDINGS"

# ── 4. npm audit HIGH/CRITICAL ────────────────────────────────────────────────
echo ""
echo "► npm audit (HIGH/CRITICAL)…"
AUDIT_FINDINGS="[]"
AUDIT_OUT=$(cd Backend && npm audit --json 2>/dev/null) || true
AUDIT_FINDINGS=$(echo "$AUDIT_OUT" | python3 - <<'PYEOF'
import json, sys
try:
    data = json.load(sys.stdin)
except Exception:
    print("[]"); sys.exit()
findings = []
for pkg, info in data.get("vulnerabilities",{}).items():
    sev = info.get("severity","low")
    if sev in ("critical","high"):
        findings.append({
            "severity": "HIGH", "tool": "npm-audit",
            "file": "Backend/package.json", "line": 0, "col": 0,
            "rule": f"npm-cve/{pkg}",
            "message": f"[{sev.upper()}] {pkg}: {info.get('title',info.get('name',''))}",
            "recommendation": "Run: cd Backend && npm audit fix --force"
        })
print(json.dumps(findings))
PYEOF
)
merge_findings "$AUDIT_FINDINGS"

# ── Write final report ────────────────────────────────────────────────────────
python3 - <<PYEOF
import json, os
findings = json.loads("""${ALL_FINDINGS}""")
status   = "${SUITE_STATUS}"
report   = {"suite":"security","status":status,"findings":findings}
out      = os.path.join("${REPORTS_DIR}","security.json")
with open(out,"w") as f:
    json.dump(report, f, indent=2)
high = sum(1 for x in findings if x["severity"]=="HIGH")
print(f"Security report: {out}  ({high} HIGH findings, status={status})")
PYEOF

echo ""
if [[ "$SUITE_STATUS" == "failed" ]]; then
  echo "❌ Security scanning FAILED."
  exit 1
fi
echo "✅ Security scanning PASSED."
exit 0
