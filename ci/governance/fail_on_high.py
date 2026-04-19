#!/usr/bin/env python3
"""
ci/governance/fail_on_high.py
────────────────────────────────────────────────────────────────────────────
Final pipeline gate: exits non-zero if any HIGH-severity findings remain
after the two-signal classification step.

This script is intentionally simple and transparent:
  - Reads findings.json
  - Counts confirmed HIGH findings
  - Prints a concise summary with file:line references
  - Exits 1 if high_count > 0  →  GitHub Actions marks the job as FAILED
                                   →  branch protection blocks the merge

Usage:
  python ci/governance/fail_on_high.py --findings findings.json
"""

import argparse
import json
import sys


SEV_ORDER = {"HIGH": 0, "MEDIUM": 1, "LOW": 2, "INFO": 3}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--findings", required=True)
    args = parser.parse_args()

    with open(args.findings) as f:
        findings_data = json.load(f)

    summary  = findings_data.get("summary", {})
    findings = findings_data.get("findings", [])
    suites   = summary.get("suites", {})

    high_findings  = [f for f in findings if f.get("severity") == "HIGH"]
    total          = summary.get("total", 0)
    high_count     = len(high_findings)
    medium_count   = summary.get("medium", 0)
    low_count      = summary.get("low", 0)

    print("═══════════════════════════════════════════════")
    print(" Governance | Final Quality Gate")
    print("═══════════════════════════════════════════════")
    print()

    # Suite status table
    print(f"  {'Suite':<18} {'Status':<10}")
    print(f"  {'─'*18} {'─'*10}")
    for suite, status in sorted(suites.items()):
        icon = {"passed": "✅", "failed": "❌", "warning": "⚠️", "skipped": "⏭️"}.get(status, "❓")
        print(f"  {suite:<18} {icon} {status}")

    print()
    print(f"  Total findings  : {total}")
    print(f"  🔴 HIGH         : {high_count}")
    print(f"  🟡 MEDIUM       : {medium_count}")
    print(f"  🔵 LOW          : {low_count}")

    if high_count == 0:
        print()
        print("✅ Quality gate PASSED – no HIGH-severity findings.")
        sys.exit(0)

    # Print HIGH findings with file:line references
    print()
    print(f"❌ Quality gate FAILED – {high_count} HIGH-severity finding(s):")
    print()
    print(f"  {'#':<4} {'Tool':<20} {'File:Line':<50} {'Rule':<35} Message")
    print(f"  {'─'*4} {'─'*20} {'─'*50} {'─'*35} {'─'*40}")

    for i, f in enumerate(high_findings, 1):
        file_ref = f"{f.get('file', '?')}:{f.get('line', 0)}"
        tool     = f.get("tool", "?")[:20]
        rule     = f.get("rule", "?")[:35]
        msg      = f.get("message", "")[:60]
        print(f"  {i:<4} {tool:<20} {file_ref:<50} {rule:<35} {msg}")

    print()
    print("  To fix:")
    print("  1. Address each finding above (see PR comment for details).")
    print("  2. Push a new commit – the pipeline will re-run automatically.")
    print("  3. Merge is blocked until all HIGH-severity findings are resolved.")
    print()

    sys.exit(1)


if __name__ == "__main__":
    main()
