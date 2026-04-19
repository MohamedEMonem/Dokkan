#!/usr/bin/env bash
# ci/qa/policy_check.sh
# ─────────────────────────────────────────────────────────────────────────────
# QA-1: PR metadata policy check
#   1. Branch naming convention  (feature/*, fix/*, chore/*, release/*, hotfix/*)
#   2. PR title follows Conventional Commits prefix
#   3. PR body contains required sections (Test Evidence, Risk, Rollback)
#   4. PR body links at least one issue  (Closes/Fixes/Resolves #N)
#
# Environment variables (injected by GitHub Actions):
#   PR_TITLE       – pull request title
#   PR_BODY        – pull request body
#   PR_HEAD_REF    – source branch name
#   GH_TOKEN       – GitHub token (for API calls)
#   PR_NUMBER      – pull request number
#   REPO           – owner/repo
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PASS=0
FAIL=0
WARNINGS=()
ERRORS=()

log_pass() { echo "  ✅  $1"; ((PASS++)) || true; }
log_fail() { echo "  ❌  $1"; ERRORS+=("$1"); ((FAIL++)) || true; }
log_warn() { echo "  ⚠️   $1"; WARNINGS+=("$1"); }

echo "═══════════════════════════════════════════════"
echo " QA-1 | PR Policy Check"
echo "═══════════════════════════════════════════════"

# ── 1. Branch naming ─────────────────────────────────────────────────────────
BRANCH="${PR_HEAD_REF:-}"
BRANCH_PATTERN='^(feature|fix|bugfix|chore|refactor|docs|ci|release|hotfix|test|perf|security|copilot)/[a-z0-9._/-]+$'

if [[ -z "$BRANCH" ]]; then
  log_warn "PR_HEAD_REF is empty – skipping branch-name check"
elif echo "$BRANCH" | grep -qE "$BRANCH_PATTERN"; then
  log_pass "Branch name follows convention: $BRANCH"
else
  log_fail "Branch '$BRANCH' does not match pattern: $BRANCH_PATTERN"
  echo "       Rename your branch to e.g. feature/my-feature or fix/issue-42"
fi

# ── 2. PR title conventional-commit prefix ───────────────────────────────────
TITLE="${PR_TITLE:-}"
TITLE_PATTERN='^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert|security)(\(.+\))?: .{5,}'

if [[ -z "$TITLE" ]]; then
  log_warn "PR_TITLE is empty – skipping title check"
elif echo "$TITLE" | grep -qE "$TITLE_PATTERN"; then
  log_pass "PR title follows Conventional Commits: '$TITLE'"
else
  log_fail "PR title '$TITLE' does not match pattern: <type>(<scope>): <description>"
  echo "       Example: feat(auth): add refresh token endpoint"
fi

# ── 3. Required sections in PR body ──────────────────────────────────────────
BODY="${PR_BODY:-}"

check_section() {
  local section="$1"
  local pattern="$2"
  if echo "$BODY" | grep -qiE "$pattern"; then
    log_pass "PR body contains section: $section"
  else
    log_fail "PR body is missing required section: $section"
    echo "       Add a '## $section' heading with non-empty content"
  fi
}

check_section "Test Evidence" "##\s+(🧪\s+)?test evidence"
check_section "Risk Assessment" "##\s+(⚠️\s+)?risk"
check_section "Rollback Plan"   "##\s+(🔄\s+)?rollback"
check_section "Summary"         "##\s+(📋\s+)?summary"

# ── 4. Linked issue ───────────────────────────────────────────────────────────
if echo "$BODY" | grep -qiE '(closes|fixes|resolves)\s+#[0-9]+'; then
  log_pass "PR body contains a linked issue reference"
else
  log_warn "No linked issue found (Closes/Fixes/Resolves #N) – recommended but not blocking"
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "───────────────────────────────────────────────"
echo " Results: ${PASS} passed | ${FAIL} failed | ${#WARNINGS[@]} warnings"
echo "───────────────────────────────────────────────"

if (( FAIL > 0 )); then
  echo ""
  echo "Policy failures:"
  for err in "${ERRORS[@]}"; do
    echo "  • $err"
  done
  echo ""
  echo "Fix the above issues before requesting review."
  exit 1
fi

echo "All policy checks passed."
exit 0
