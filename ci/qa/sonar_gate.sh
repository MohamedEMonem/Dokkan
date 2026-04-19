#!/usr/bin/env bash
# ci/qa/sonar_gate.sh
# ─────────────────────────────────────────────────────────────────────────────
# QA-4: SonarQube quality gate
#   - Skips gracefully when SONAR_TOKEN is not configured (open-source / local)
#   - Uses sonar-scanner CLI to analyse Backend/src
#   - Polls the quality-gate status and fails if "ERROR"
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

echo "═══════════════════════════════════════════════"
echo " QA-4 | SonarQube Quality Gate"
echo "═══════════════════════════════════════════════"

# ── Skip if SonarQube is not configured ──────────────────────────────────────
if [[ -z "${SONAR_TOKEN:-}" || -z "${SONAR_HOST_URL:-}" ]]; then
  echo "  ⚠️  SONAR_TOKEN or SONAR_HOST_URL not set – skipping SonarQube scan."
  echo "     To enable: add repository secrets SONAR_TOKEN and SONAR_HOST_URL."
  echo "     Refer to: https://docs.sonarqube.org/latest/analyzing-source-code/scanners/github-actions-integration/"
  exit 0
fi

# ── Install sonar-scanner ─────────────────────────────────────────────────────
SONAR_VERSION="6.2.1.4610"
SONAR_ZIP="sonar-scanner-cli-${SONAR_VERSION}-linux-x64.zip"
SONAR_DIR="/tmp/sonar-scanner"

if [[ ! -f "${SONAR_DIR}/bin/sonar-scanner" ]]; then
  echo "Downloading sonar-scanner ${SONAR_VERSION}…"
  curl -sSfL \
    "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/${SONAR_ZIP}" \
    -o "/tmp/${SONAR_ZIP}"
  unzip -q "/tmp/${SONAR_ZIP}" -d "/tmp"
  mv "/tmp/sonar-scanner-${SONAR_VERSION}-linux-x64" "$SONAR_DIR"
fi

export PATH="${SONAR_DIR}/bin:$PATH"

# ── Run scanner ───────────────────────────────────────────────────────────────
REPO="${GITHUB_REPOSITORY:-dokkan/backend}"
PROJECT_KEY=$(echo "$REPO" | tr '/' '_')

echo "Running sonar-scanner for project: $PROJECT_KEY"

sonar-scanner \
  -Dsonar.projectKey="$PROJECT_KEY" \
  -Dsonar.sources=Backend/src \
  -Dsonar.host.url="$SONAR_HOST_URL" \
  -Dsonar.login="$SONAR_TOKEN" \
  -Dsonar.scm.provider=git \
  -Dsonar.qualitygate.wait=true \
  -Dsonar.qualitygate.timeout=300

QG_EXIT=$?

if (( QG_EXIT != 0 )); then
  echo ""
  echo "❌ SonarQube quality gate FAILED."
  echo "   View the full report at: ${SONAR_HOST_URL}/dashboard?id=${PROJECT_KEY}"
  exit 1
fi

echo "✅ SonarQube quality gate PASSED."
exit 0
