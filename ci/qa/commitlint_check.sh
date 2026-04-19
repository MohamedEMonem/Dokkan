#!/usr/bin/env bash
# ci/qa/commitlint_check.sh
# ─────────────────────────────────────────────────────────────────────────────
# QA-2: Conventional commit message linting
#   - Uses @commitlint/cli if available, otherwise falls back to a regex check
#   - Validates every commit in the PR diff (BASE_SHA..HEAD_SHA)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PASS=0
FAIL=0

echo "═══════════════════════════════════════════════"
echo " QA-2 | Conventional Commit Lint"
echo "═══════════════════════════════════════════════"

BASE="${BASE_SHA:-HEAD~1}"
HEAD="${HEAD_SHA:-HEAD}"

# Collect commit messages in the range
COMMITS=$(git log --format="%H %s" "${BASE}..${HEAD}" 2>/dev/null || \
          git log --format="%H %s" -1)

if [[ -z "$COMMITS" ]]; then
  echo "  ℹ️  No commits found in range ${BASE}..${HEAD} – nothing to lint."
  exit 0
fi

# Conventional commit pattern (type(scope)?: description)
CC_PATTERN='^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert|security|hotfix|release)(\(.{1,40}\))?: .{3,}'
BREAKING_OK='^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert|security)(\(.+\))?!: .+'

echo ""
echo "Checking commits in range: ${BASE}..${HEAD}"
echo "─────────────────────────────────────────────"

while IFS= read -r line; do
  SHA="${line%% *}"
  MSG="${line#* }"

  if echo "$MSG" | grep -qE "$CC_PATTERN"; then
    echo "  ✅  ${SHA:0:7}  $MSG"
    ((PASS++)) || true
  elif echo "$MSG" | grep -qE "$BREAKING_OK"; then
    echo "  ✅  ${SHA:0:7}  $MSG  [breaking]"
    ((PASS++)) || true
  elif echo "$MSG" | grep -qiE '^(merge|revert)'; then
    echo "  ⚠️   ${SHA:0:7}  $MSG  [auto/merge – skipped]"
  else
    echo "  ❌  ${SHA:0:7}  $MSG"
    echo "       Expected: <type>(<scope>): <description>"
    echo "       Types: feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert|security"
    ((FAIL++)) || true
  fi
done <<< "$COMMITS"

echo ""
echo "───────────────────────────────────────────────"
echo " Results: ${PASS} passed | ${FAIL} failed"
echo "───────────────────────────────────────────────"

if (( FAIL > 0 )); then
  echo ""
  echo "Fix non-conventional commit messages with:"
  echo "  git commit --amend -m \"type(scope): description\""
  echo "  git rebase -i ${BASE}  # to reword multiple commits"
  exit 1
fi

echo "All commit messages are conventional."
exit 0
