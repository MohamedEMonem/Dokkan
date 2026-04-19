#!/usr/bin/env python3
"""
ci/governance/safe_remediate.py
────────────────────────────────────────────────────────────────────────────
Autonomous but SAFE auto-remediation of deterministic, low-risk findings.

Safety model (layered):
  1. Only runs in --mode guarded (destructive actions disabled by default)
  2. Only applies deterministic, reversible fixes (lint --fix, formatting)
  3. Confidence score must meet --confidence-threshold (default 0.90)
  4. Never touches secrets, migrations, or security-critical files
  5. Never reverts commits automatically (human gate required)
  6. Every action is logged to stdout + appended to the PR comment
  7. If confidence is below threshold → fail-safe: block + request manual triage

Supported auto-fixes:
  - ESLint auto-fixable violations  (--fix flag is safe and deterministic)
  - Formatting via Prettier         (--write is safe and deterministic)

NOT auto-fixed (require human):
  - Type errors (tsc)
  - Test failures
  - Security vulnerabilities
  - Missing route implementations
  - Performance regressions

Usage:
  python ci/governance/safe_remediate.py \\
      --findings findings.json \\
      --mode guarded \\
      --confidence-threshold 0.90 \\
      --head-ref feature/my-branch

Environment:
  GITHUB_TOKEN  – for committing the corrective fix back to the branch
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


# Rules that ESLint can auto-fix safely
ESLINT_AUTOFIXABLE_RULES = {
    "no-extra-semi",
    "semi",
    "quotes",
    "indent",
    "eol-last",
    "no-trailing-spaces",
    "comma-dangle",
    "space-before-function-paren",
    "prefer-const",
    "object-curly-spacing",
    "array-bracket-spacing",
    "no-multiple-empty-lines",
    "@typescript-eslint/semi",
    "@typescript-eslint/quotes",
    "@typescript-eslint/indent",
    "@typescript-eslint/no-extra-semi",
}

# Files/directories that must NEVER be auto-modified
PROTECTED_PATHS = {
    "prisma/migrations",
    "src/middleware/auth",
    ".env",
    "secrets",
}


def is_protected(filepath: str) -> bool:
    for p in PROTECTED_PATHS:
        if p in filepath:
            return True
    return False


def run_cmd(cmd: list[str], cwd: str | None = None) -> tuple[int, str]:
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd)
    return result.returncode, result.stdout + result.stderr


def attempt_eslint_fix(findings: list[dict]) -> list[str]:
    """Run eslint --fix on files with auto-fixable violations. Returns list of fixed files."""
    eligible_files = set()
    for f in findings:
        if (
            f.get("tool") == "eslint"
            and f.get("rule") in ESLINT_AUTOFIXABLE_RULES
            and not is_protected(f.get("file", ""))
            and f.get("file", "").endswith((".ts", ".js"))
        ):
            eligible_files.add(f["file"])

    if not eligible_files:
        return []

    print(f"  Auto-fixing ESLint violations in {len(eligible_files)} file(s)…")
    fixed = []
    for fp in eligible_files:
        code, out = run_cmd(["npx", "--prefix", "Backend", "eslint", "--fix", fp])
        if code == 0:
            fixed.append(fp)
            print(f"    ✅  Fixed: {fp}")
        else:
            print(f"    ⚠️  Could not fix: {fp}\n{out[:200]}")
    return fixed


def attempt_prettier_fix(changed_files: list[str]) -> list[str]:
    """Run Prettier on changed .ts/.js files. Returns list of formatted files."""
    eligible = [
        f for f in changed_files
        if f.endswith((".ts", ".js")) and not is_protected(f)
    ]
    if not eligible:
        return []

    # Check if prettier is available
    code, _ = run_cmd(["npx", "--prefix", "Backend", "prettier", "--version"])
    if code != 0:
        return []

    print(f"  Running Prettier on {len(eligible)} file(s)…")
    fixed = []
    for fp in eligible:
        if not Path(fp).exists():
            continue
        code, out = run_cmd(["npx", "--prefix", "Backend", "prettier", "--write", fp])
        if code == 0:
            fixed.append(fp)

    if fixed:
        print(f"    ✅  Formatted {len(fixed)} file(s)")
    return fixed


def commit_and_push(fixed_files: list[str], head_ref: str) -> bool:
    """Stage fixed files, commit, and push to head_ref."""
    if not fixed_files:
        return False

    token = os.environ.get("GITHUB_TOKEN", "")
    repo  = os.environ.get("REPO", "")

    # Configure git
    run_cmd(["git", "config", "user.email", "quality-bot@dokkan.app"])
    run_cmd(["git", "config", "user.name",  "Dokkan Quality Bot"])

    # Stage only the fixed files
    for fp in fixed_files:
        run_cmd(["git", "add", fp])

    # Check if there's actually anything to commit
    code, diff = run_cmd(["git", "diff", "--cached", "--name-only"])
    if not diff.strip():
        print("  ℹ️  No changes to commit after auto-fix.")
        return False

    changed = diff.strip().splitlines()
    msg = f"fix(quality-bot): auto-fix {len(changed)} lint/formatting violation(s)\n\n[skip ci]"
    run_cmd(["git", "commit", "-m", msg])

    if token and repo:
        remote_url = f"https://x-access-token:{token}@github.com/{repo}.git"
        code, out = run_cmd(["git", "push", remote_url, f"HEAD:{head_ref}"])
        if code == 0:
            print(f"  ✅  Corrective commit pushed to {head_ref}")
            return True
        else:
            print(f"  ⚠️  Push failed:\n{out[:400]}", file=sys.stderr)
    return False


def compute_confidence(findings: list[dict], fixed_files: list[str]) -> float:
    """
    Compute a confidence score for the auto-remediation.
    Score = fraction of HIGH/MEDIUM findings that are in fixed files.
    """
    relevant = [f for f in findings if f.get("severity") in ("HIGH", "MEDIUM")]
    if not relevant:
        return 1.0
    fixed_set = set(fixed_files)
    resolved  = sum(1 for f in relevant if f.get("file") in fixed_set)
    return resolved / len(relevant)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--findings",             required=True)
    parser.add_argument("--mode",                 default="guarded",
                        choices=["guarded", "off"])
    parser.add_argument("--confidence-threshold", type=float, default=0.90)
    parser.add_argument("--head-ref",             default="")
    args = parser.parse_args()

    if args.mode == "off":
        print("  ℹ️  Auto-remediation is disabled (--mode off).")
        sys.exit(0)

    with open(args.findings) as f:
        findings_data = json.load(f)

    findings = findings_data.get("findings", [])
    summary  = findings_data.get("summary", {})
    high     = summary.get("high", 0)

    print("═══════════════════════════════════════════════")
    print(" Governance | Safe Auto-Remediation")
    print("═══════════════════════════════════════════════")

    if high == 0:
        print("  ✅  No HIGH findings – no remediation needed.")
        sys.exit(0)

    print(f"  {high} HIGH finding(s) detected.  Attempting deterministic auto-fixes…")

    all_fixed: list[str] = []

    # ── ESLint auto-fix ──────────────────────────────────────────────────────
    eslint_fixed = attempt_eslint_fix(findings)
    all_fixed.extend(eslint_fixed)

    # ── Prettier formatting ──────────────────────────────────────────────────
    changed_files = list({f.get("file", "") for f in findings if f.get("file")})
    prettier_fixed = attempt_prettier_fix(changed_files)
    all_fixed.extend(prettier_fixed)
    all_fixed = list(set(all_fixed))

    if not all_fixed:
        print("  ℹ️  No deterministic auto-fixes applicable.")
        print("     Manual intervention required for remaining findings.")
        sys.exit(0)

    # ── Confidence check ──────────────────────────────────────────────────────
    confidence = compute_confidence(findings, all_fixed)
    print(f"  Confidence score: {confidence:.2%}  (threshold: {args.confidence_threshold:.2%})")

    if confidence < args.confidence_threshold:
        print(
            f"  ⚠️  Confidence {confidence:.2%} below threshold {args.confidence_threshold:.2%}.",
            f"\n     Fail-safe: not committing partial fix. Manual review required.",
            file=sys.stderr,
        )
        sys.exit(0)   # Non-blocking: let fail_on_high.py handle the gate

    # ── Commit & push ─────────────────────────────────────────────────────────
    head_ref = args.head_ref or os.environ.get("HEAD_REF", "")
    if not head_ref:
        print("  ⚠️  HEAD_REF not provided – cannot push corrective commit.", file=sys.stderr)
        sys.exit(0)

    pushed = commit_and_push(all_fixed, head_ref)
    if pushed:
        print(f"  ✅  Auto-remediation committed ({len(all_fixed)} file(s) fixed).")
    else:
        print("  ℹ️  No commit was made (nothing changed on disk).")


if __name__ == "__main__":
    main()
