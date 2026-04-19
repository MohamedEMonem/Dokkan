#!/usr/bin/env python3
"""
ci/governance/comment_pr.py
────────────────────────────────────────────────────────────────────────────
Posts (or updates) an actionable PR comment with the full quality governance
report.  Uses GitHub REST API.

Features:
  - Idempotent: searches for an existing bot comment and UPDATES it (no spam)
  - Structured: summary table, findings by severity, reproduction commands,
    artifact links, and required next actions
  - Safe: read-only GitHub API calls when no findings exist

Usage:
  python ci/governance/comment_pr.py \\
      --findings findings.json \\
      --pr-number 42 \\
      --repo owner/repo \\
      --run-url https://github.com/owner/repo/actions/runs/12345

Environment:
  GITHUB_TOKEN  – required for GitHub API calls
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
import urllib.request
import urllib.error


COMMENT_MARKER = "<!-- dokkan-quality-governance-bot -->"


def gh_api(method: str, url: str, body: dict | None = None) -> dict:
    token = os.environ.get("GITHUB_TOKEN", "")
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            "User-Agent": "dokkan-quality-governance-bot/1.0",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body_text = e.read().decode()
        print(f"  GitHub API error {e.code}: {body_text}", file=sys.stderr)
        return {}


def find_existing_comment(repo: str, pr_number: str) -> int | None:
    """Return comment ID if the bot's marker comment already exists."""
    url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/comments?per_page=100"
    comments = gh_api("GET", url)
    if not isinstance(comments, list):
        return None
    for c in comments:
        if COMMENT_MARKER in c.get("body", ""):
            return c["id"]
    return None


def severity_emoji(sev: str) -> str:
    return {"HIGH": "🔴", "MEDIUM": "🟡", "LOW": "🔵", "INFO": "⚪"}.get(sev, "⚪")


def status_emoji(status: str) -> str:
    return {
        "passed":  "✅",
        "failed":  "❌",
        "warning": "⚠️",
        "skipped": "⏭️",
        "unknown": "❓",
    }.get(status, "❓")


def build_comment(findings_data: dict, run_url: str) -> str:
    summary = findings_data.get("summary", {})
    findings = findings_data.get("findings", [])
    suites = summary.get("suites", {})

    high_count   = summary.get("high", 0)
    medium_count = summary.get("medium", 0)
    low_count    = summary.get("low", 0)
    total        = summary.get("total", 0)

    overall = "✅ All quality gates passed" if high_count == 0 else "❌ Quality gate FAILED"
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    lines = [
        COMMENT_MARKER,
        "",
        f"## 🏗️ Quality Governance Report — {overall}",
        f"> **Run:** [{run_url.split('/')[-1]}]({run_url})  |  **Updated:** {timestamp}",
        "",
        "### 📊 Gate Summary",
        "",
        "| Suite | Status | Findings |",
        "|-------|--------|----------|",
    ]

    for suite in ["lint", "static", "unit", "integration", "contract", "security", "performance"]:
        status = suites.get(suite, "—")
        emoji  = status_emoji(status)
        count  = sum(1 for f in findings if f.get("suite") == suite)
        lines.append(f"| `{suite}` | {emoji} {status} | {count} |")

    lines += [
        "",
        f"**Total findings:** {total}  |  "
        f"🔴 HIGH: {high_count}  |  "
        f"🟡 MEDIUM: {medium_count}  |  "
        f"🔵 LOW: {low_count}",
        "",
    ]

    # HIGH findings table
    high_findings = [f for f in findings if f.get("severity") == "HIGH"]
    if high_findings:
        lines += [
            "### 🔴 HIGH-Severity Findings (must fix before merge)",
            "",
            "| # | Tool | File:Line | Rule | Message | Fix |",
            "|---|------|-----------|------|---------|-----|",
        ]
        for i, f in enumerate(high_findings[:20], 1):
            file_ref = f"{f.get('file', '')}:{f.get('line', 0)}"
            msg = f.get("message", "")[:80].replace("|", "\\|")
            fix = f.get("recommendation", "")[:80].replace("|", "\\|")
            rule = f.get("rule", "")[:30]
            tool = f.get("tool", "")
            lines.append(f"| {i} | `{tool}` | `{file_ref}` | `{rule}` | {msg} | {fix} |")
        if len(high_findings) > 20:
            lines.append(f"\n> ⚠️ {len(high_findings) - 20} more HIGH findings not shown. See the [full run artifacts]({run_url}).")
        lines.append("")

    # MEDIUM findings (collapsed)
    medium_findings = [f for f in findings if f.get("severity") == "MEDIUM"]
    if medium_findings:
        lines += [
            "<details>",
            f"<summary>🟡 MEDIUM-Severity Findings ({len(medium_findings)})</summary>",
            "",
            "| Tool | File:Line | Rule | Message |",
            "|------|-----------|------|---------|",
        ]
        for f in medium_findings[:15]:
            file_ref = f"{f.get('file', '')}:{f.get('line', 0)}"
            msg = f.get("message", "")[:80].replace("|", "\\|")
            lines.append(f"| `{f.get('tool','')}` | `{file_ref}` | `{f.get('rule','')}` | {msg} |")
        lines += ["", "</details>", ""]

    # Reproduction commands
    lines += [
        "### 🔧 Reproduce Locally",
        "",
        "```bash",
        "# Clone and install",
        "cd Backend && npm install",
        "",
        "# Static analysis",
        "npx eslint src --ext .ts,.js",
        "npx tsc --noEmit",
        "",
        "# Unit tests",
        "npx vitest run --coverage",
        "",
        "# Security scan",
        "npm audit",
        "```",
        "",
    ]

    # Required next action
    if high_count > 0:
        lines += [
            "### ⛔ Required Action",
            "",
            f"> **{high_count} HIGH-severity issue(s) must be resolved before this PR can be merged.**",
            ">",
            "> 1. Fix each finding listed above.",
            "> 2. Push a new commit — the pipeline will re-run automatically.",
            "> 3. All required checks must turn green before merge is allowed.",
            "",
        ]
    else:
        lines += [
            "### ✅ Next Steps",
            "",
            "> All quality gates passed. Request a code review to proceed with merge.",
            "",
        ]

    lines += [
        "---",
        f"*Powered by Dokkan Quality Governance · [View full run]({run_url})*",
    ]

    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--findings",   required=True)
    parser.add_argument("--pr-number",  required=True)
    parser.add_argument("--repo",       required=True)
    parser.add_argument("--run-url",    default="")
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        print("  ⚠️  GITHUB_TOKEN not set – skipping PR comment.", file=sys.stderr)
        sys.exit(0)

    with open(args.findings) as f:
        findings_data = json.load(f)

    body = build_comment(findings_data, args.run_url)

    # Check for existing comment to update (idempotent)
    existing_id = find_existing_comment(args.repo, args.pr_number)

    if existing_id:
        url = f"https://api.github.com/repos/{args.repo}/issues/comments/{existing_id}"
        result = gh_api("PATCH", url, {"body": body})
        action = "Updated"
    else:
        url = f"https://api.github.com/repos/{args.repo}/issues/{args.pr_number}/comments"
        result = gh_api("POST", url, {"body": body})
        action = "Posted"

    if result.get("id"):
        print(f"  ✅  {action} PR comment (id={result['id']})")
    else:
        print(f"  ⚠️  Could not post PR comment: {result}", file=sys.stderr)


if __name__ == "__main__":
    main()
