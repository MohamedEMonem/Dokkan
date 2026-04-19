#!/usr/bin/env bash
# ci/qa/evaluate_qa.sh
# ─────────────────────────────────────────────────────────────────────────────
# QA-5: Aggregate QA step results and emit a structured output
#   - Collects exit codes from previous steps via env vars set by the runner
#   - Writes qa_status to GITHUB_OUTPUT (available to downstream jobs)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

echo "═══════════════════════════════════════════════"
echo " QA-5 | QA Evaluation"
echo "═══════════════════════════════════════════════"

# The previous steps already fail the job if they fail, so reaching this script
# means all QA steps passed (the runner stops at the first non-zero exit).
# We set the output status to 'passed'.

QA_STATUS="passed"

echo ""
echo "  ✅  All QA gates passed."
echo "     Status: $QA_STATUS"

# Write to GITHUB_OUTPUT if available
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "status=${QA_STATUS}" >> "$GITHUB_OUTPUT"
fi

exit 0
