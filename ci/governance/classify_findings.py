#!/usr/bin/env python3
"""
ci/governance/classify_findings.py
────────────────────────────────────────────────────────────────────────────
Aggregates suite JSON reports, normalises findings, deduplicates, and
applies the two-signal rule before emitting a unified findings.json used
by comment_pr.py, label_pr.py, safe_remediate.py, and fail_on_high.py.

Two-signal rule for HIGH severity promotion:
  A finding is confirmed HIGH only when the same file:line:rule is flagged
  by at least two independent tools, OR when any single tool with inherent
  HIGH confidence (gitleaks, tsc, test-failure) reports it.

Usage:
  python ci/governance/classify_findings.py \\
      --reports-dir reports \\
      --out findings.json \\
      [--changed-files-base <sha>] \\
      [--changed-files-head <sha>]
"""

import argparse
import json
import os
import subprocess
import sys
from collections import defaultdict
from pathlib import Path


# Tools whose single signal is sufficient for HIGH severity (high confidence)
HIGH_CONFIDENCE_TOOLS = {
    "gitleaks",
    "tsc",
    "vitest",
    "vitest-integration",
    "trivy-secret",
    "npm-audit",       # CVEs are verifiable facts
}

# Suites in priority order for summary display
SUITE_ORDER = ["static", "unit", "integration", "contract", "security", "performance", "lint"]


def get_changed_files(base: str, head: str) -> set[str]:
    """Return the set of files changed between base and head commits."""
    if not base or not head:
        return set()
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-only", base, head],
            stderr=subprocess.DEVNULL,
            text=True,
        )
        return {f.strip() for f in out.splitlines() if f.strip()}
    except Exception:
        return set()


def load_report(path: Path) -> dict:
    try:
        with open(path) as f:
            return json.load(f)
    except Exception as e:
        print(f"  Warning: could not load {path}: {e}", file=sys.stderr)
        return {}


def normalise_finding(f: dict, suite: str) -> dict:
    """Ensure every finding has all required keys."""
    return {
        "severity":       f.get("severity", "LOW").upper(),
        "tool":           f.get("tool", suite),
        "suite":          suite,
        "file":           f.get("file", ""),
        "line":           int(f.get("line") or 0),
        "col":            int(f.get("col") or 0),
        "rule":           f.get("rule", "unknown"),
        "message":        f.get("message", ""),
        "recommendation": f.get("recommendation", ""),
    }


def dedup_and_two_signal(findings: list[dict]) -> list[dict]:
    """
    Deduplicate findings and apply two-signal rule.
    Group by (file, line, rule).  If a key appears in ≥2 tools → confirm HIGH.
    Single-signal HIGH is kept only for high-confidence tools.
    """
    groups: dict[tuple, list[dict]] = defaultdict(list)
    for f in findings:
        key = (f["file"], f["line"], f["rule"])
        groups[key].append(f)

    result = []
    for key, items in groups.items():
        tools = {i["tool"] for i in items}
        max_sev = max(
            (i["severity"] for i in items),
            key=lambda s: {"HIGH": 3, "MEDIUM": 2, "LOW": 1, "INFO": 0}.get(s, 0),
        )
        # Two-signal: multiple tools → confirm severity
        if len(tools) >= 2:
            final_sev = max_sev
        elif max_sev == "HIGH" and not (tools & HIGH_CONFIDENCE_TOOLS):
            # Single low-confidence tool reports HIGH → downgrade to MEDIUM
            final_sev = "MEDIUM"
        else:
            final_sev = max_sev

        merged = items[0].copy()
        merged["severity"] = final_sev
        merged["confirmed_by"] = sorted(tools)
        merged["signal_count"] = len(tools)
        result.append(merged)

    # Sort: HIGH first, then by file/line
    result.sort(
        key=lambda f: (
            -{"HIGH": 3, "MEDIUM": 2, "LOW": 1, "INFO": 0}.get(f["severity"], 0),
            f["file"],
            f["line"],
        )
    )
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--reports-dir", default="reports")
    parser.add_argument("--out", default="findings.json")
    parser.add_argument("--changed-files-base", default="")
    parser.add_argument("--changed-files-head", default="")
    args = parser.parse_args()

    reports_dir = Path(args.reports_dir)
    changed_files = get_changed_files(args.changed_files_base, args.changed_files_head)

    all_findings: list[dict] = []
    suite_statuses: dict[str, str] = {}

    # Load all suite reports
    for suite in SUITE_ORDER:
        report_path = reports_dir / f"{suite}.json"
        if not report_path.exists():
            # Try nested layout
            alt = reports_dir / f"report-{suite}" / f"{suite}.json"
            if alt.exists():
                report_path = alt
            else:
                continue

        report = load_report(report_path)
        if not report:
            continue

        status = report.get("status", "unknown")
        suite_statuses[suite] = status
        print(f"  {suite:15s}: {status:8s}  ({len(report.get('findings', []))} findings)")

        for raw_finding in report.get("findings", []):
            finding = normalise_finding(raw_finding, suite)
            # Annotate whether finding is in changed files
            finding["in_changed_files"] = (
                not changed_files or
                any(
                    finding["file"].endswith(cf) or cf.endswith(finding["file"])
                    for cf in changed_files
                )
            )
            all_findings.append(finding)

    # Dedup + two-signal rule
    deduplicated = dedup_and_two_signal(all_findings)

    # Summary counts
    summary = {
        "total":            len(deduplicated),
        "high":             sum(1 for f in deduplicated if f["severity"] == "HIGH"),
        "medium":           sum(1 for f in deduplicated if f["severity"] == "MEDIUM"),
        "low":              sum(1 for f in deduplicated if f["severity"] == "LOW"),
        "in_changed_files": sum(1 for f in deduplicated if f.get("in_changed_files")),
        "suites":           suite_statuses,
        "qa_passed":        all(
            suite_statuses.get(s, "skipped") in ("passed", "warning", "skipped")
            for s in ["lint"]
        ),
        "qc_passed":        all(
            suite_statuses.get(s, "skipped") in ("passed", "warning", "skipped")
            for s in ["static", "unit", "integration", "contract", "performance"]
        ),
        "security_passed":  suite_statuses.get("security", "skipped") in (
            "passed", "warning", "skipped"
        ),
    }

    output = {"summary": summary, "findings": deduplicated}
    with open(args.out, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nFindings written to {args.out}")
    print(f"  Total: {summary['total']}  |  HIGH: {summary['high']}  |  MEDIUM: {summary['medium']}  |  LOW: {summary['low']}")
    print(f"  In changed files: {summary['in_changed_files']}")


if __name__ == "__main__":
    main()
