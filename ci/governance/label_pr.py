#!/usr/bin/env python3
"""
ci/governance/label_pr.py
────────────────────────────────────────────────────────────────────────────
Applies / removes labels on a PR based on findings severity.

Label mapping:
  HIGH findings present              → failed-quality-check  (red)
  Security HIGH findings             → security-critical       (dark-red)
  All quality gates passed           → quality-approved        (green)
  QA suite failed                    → qa-failed               (orange)
  QC suite failed                    → qc-failed               (orange)
  Findings only in changed files     → needs-owner-review      (yellow)

Labels are created in the repo automatically if they do not exist.

Usage:
  python ci/governance/label_pr.py \\
      --findings findings.json \\
      --pr-number 42 \\
      --repo owner/repo

Environment:
  GITHUB_TOKEN  – required
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error


# Label definitions: name → (color, description)
LABEL_DEFS: dict[str, tuple[str, str]] = {
    "failed-quality-check":  ("b60205", "Pipeline failed one or more quality gates"),
    "security-critical":     ("6b0505", "HIGH-severity security finding detected"),
    "quality-approved":      ("0e8a16", "All quality gates passed"),
    "qa-failed":             ("e4e669", "QA process gate failed"),
    "qc-failed":             ("e4e669", "QC validation gate failed"),
    "needs-owner-review":    ("fbca04", "Requires code-owner review before merge"),
}


def gh_api(method: str, url: str, body: dict | None = None) -> dict | list:
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
        if e.code == 404:
            return {}
        body_text = e.read().decode()
        print(f"  GitHub API {method} {url} error {e.code}: {body_text[:200]}", file=sys.stderr)
        return {}


def ensure_label_exists(repo: str, name: str) -> None:
    color, description = LABEL_DEFS.get(name, ("cccccc", ""))
    url = f"https://api.github.com/repos/{repo}/labels/{urllib.parse.quote(name)}"
    existing = gh_api("GET", url)
    if not existing.get("name"):
        # Create it
        gh_api("POST", f"https://api.github.com/repos/{repo}/labels", {
            "name": name,
            "color": color,
            "description": description,
        })


def get_current_labels(repo: str, pr_number: str) -> set[str]:
    url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/labels"
    labels = gh_api("GET", url)
    if isinstance(labels, list):
        return {lbl["name"] for lbl in labels}
    return set()


def set_labels(repo: str, pr_number: str, labels: set[str]) -> None:
    if not labels:
        return
    for lbl in labels:
        ensure_label_exists(repo, lbl)
    url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/labels"
    gh_api("POST", url, {"labels": sorted(labels)})


def remove_labels(repo: str, pr_number: str, labels: set[str]) -> None:
    for lbl in labels:
        url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/labels/{urllib.parse.quote(lbl)}"
        gh_api("DELETE", url)


# urllib.parse needed for quote
import urllib.parse


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--findings",   required=True)
    parser.add_argument("--pr-number",  required=True)
    parser.add_argument("--repo",       required=True)
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN", "")
    if not token:
        print("  ⚠️  GITHUB_TOKEN not set – skipping label management.", file=sys.stderr)
        sys.exit(0)

    with open(args.findings) as f:
        findings_data = json.load(f)

    summary  = findings_data.get("summary", {})
    findings = findings_data.get("findings", [])
    suites   = summary.get("suites", {})

    labels_to_add: set[str] = set()
    labels_to_remove: set[str] = set()

    high_count = summary.get("high", 0)
    sec_high   = sum(1 for f in findings if f.get("severity") == "HIGH" and f.get("suite") == "security")
    qa_failed  = any(suites.get(s) == "failed" for s in ["lint"])
    qc_failed  = any(suites.get(s) == "failed" for s in ["static", "unit", "integration", "contract", "performance"])

    if high_count > 0:
        labels_to_add.add("failed-quality-check")
        labels_to_remove.discard("quality-approved")
    else:
        labels_to_remove.add("failed-quality-check")
        labels_to_remove.add("security-critical")
        labels_to_add.add("quality-approved")

    if sec_high > 0:
        labels_to_add.add("security-critical")

    if qa_failed:
        labels_to_add.add("qa-failed")
    else:
        labels_to_remove.add("qa-failed")

    if qc_failed:
        labels_to_add.add("qc-failed")
    else:
        labels_to_remove.add("qc-failed")

    # needs-owner-review if any HIGH finding touches changed files
    high_in_changed = any(
        f.get("severity") == "HIGH" and f.get("in_changed_files")
        for f in findings
    )
    if high_in_changed:
        labels_to_add.add("needs-owner-review")

    current = get_current_labels(args.repo, args.pr_number)
    effective_add    = labels_to_add - current
    effective_remove = labels_to_remove & current

    if effective_add:
        print(f"  Adding labels:   {', '.join(sorted(effective_add))}")
        set_labels(args.repo, args.pr_number, effective_add)

    if effective_remove:
        print(f"  Removing labels: {', '.join(sorted(effective_remove))}")
        remove_labels(args.repo, args.pr_number, effective_remove)

    if not effective_add and not effective_remove:
        print("  Labels already up-to-date.")


if __name__ == "__main__":
    main()
