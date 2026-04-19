#!/usr/bin/env python3
"""
ci/metrics/publish.py
────────────────────────────────────────────────────────────────────────────
Post-merge observability: collects quality metrics from suite reports and
publishes them to a metrics endpoint (Prometheus Pushgateway or a webhook).

Metrics published (as Prometheus-style labels + values):
  - quality_gate_status{suite, branch, sha}          1=passed, 0=failed
  - quality_findings_total{severity, suite, branch}   count
  - quality_coverage_pct{branch, sha}                 float
  - quality_p95_latency_ms{branch, sha}               float

If METRICS_ENDPOINT is not set, metrics are printed to stdout in
Prometheus text exposition format (useful for local debugging).

Usage:
  python ci/metrics/publish.py \\
      --source reports \\
      --sha <commit-sha> \\
      --ref refs/heads/main \\
      --repo owner/repo

Environment:
  METRICS_ENDPOINT  – Prometheus Pushgateway URL or custom webhook
                       (optional; prints to stdout if not set)
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path


def load_json(path: Path) -> dict:
    if path.exists():
        try:
            with open(path) as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def sanitise_label(v: str) -> str:
    """Sanitise a string for use as a Prometheus label value."""
    return v.replace('"', '\\"').replace("\n", " ")


def build_prometheus_text(metrics: list[tuple[str, dict[str, str], float | int]]) -> str:
    lines = []
    for name, labels, value in metrics:
        lbl_str = ",".join(f'{k}="{sanitise_label(v)}"' for k, v in labels.items())
        lines.append(f"{name}{{{lbl_str}}} {value}")
    return "\n".join(lines) + "\n"


def push_to_gateway(endpoint: str, job: str, text: str) -> None:
    url = endpoint.rstrip("/") + f"/metrics/job/{job}"
    req = urllib.request.Request(
        url,
        data=text.encode(),
        headers={"Content-Type": "text/plain"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  ✅  Metrics pushed to {url} (HTTP {resp.status})")
    except urllib.error.HTTPError as e:
        print(f"  ⚠️  Pushgateway error {e.code}: {e.read().decode()[:200]}", file=sys.stderr)
    except Exception as e:
        print(f"  ⚠️  Could not push metrics: {e}", file=sys.stderr)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default="reports")
    parser.add_argument("--sha",    default="unknown")
    parser.add_argument("--ref",    default="unknown")
    parser.add_argument("--repo",   default="unknown")
    args = parser.parse_args()

    source_dir = Path(args.source)
    sha        = args.sha[:12]
    branch     = args.ref.replace("refs/heads/", "").replace("refs/tags/", "tag/")
    repo       = args.repo

    print("═══════════════════════════════════════════════")
    print(" Observability | Publishing Quality Metrics")
    print("═══════════════════════════════════════════════")
    print(f"  Branch : {branch}")
    print(f"  SHA    : {sha}")
    print(f"  Repo   : {repo}")

    metrics: list[tuple[str, dict[str, str], float | int]] = []
    timestamp = int(time.time())

    # ── Suite-level gate status ───────────────────────────────────────────────
    suites = ["static", "unit", "integration", "contract", "security", "performance", "lint"]
    for suite in suites:
        report = load_json(source_dir / f"{suite}.json")
        # Also try nested path
        if not report:
            report = load_json(source_dir / f"report-{suite}" / f"{suite}.json")
        if not report:
            continue

        status = report.get("status", "unknown")
        value  = 1 if status in ("passed", "warning") else 0
        metrics.append((
            "quality_gate_status",
            {"suite": suite, "branch": branch, "sha": sha, "repo": repo},
            value,
        ))

        # Per-severity finding counts
        for sev in ("HIGH", "MEDIUM", "LOW"):
            count = sum(
                1 for f in report.get("findings", [])
                if f.get("severity", "").upper() == sev
            )
            metrics.append((
                "quality_findings_total",
                {"severity": sev.lower(), "suite": suite, "branch": branch, "sha": sha},
                count,
            ))

        # Coverage (unit suite)
        if suite == "unit" and "coverage_pct" in report:
            metrics.append((
                "quality_coverage_pct",
                {"branch": branch, "sha": sha, "repo": repo},
                float(report["coverage_pct"]),
            ))

    # ── Classified findings summary (if available) ────────────────────────────
    findings_path = source_dir / "findings.json"
    if not findings_path.exists():
        findings_path = Path("findings.json")  # root fallback

    classified = load_json(findings_path)
    if classified:
        summary = classified.get("summary", {})
        for sev in ("high", "medium", "low"):
            metrics.append((
                "quality_classified_total",
                {"severity": sev, "branch": branch, "sha": sha},
                summary.get(sev, 0),
            ))

    # ── k6 performance summary ────────────────────────────────────────────────
    k6_summary = load_json(source_dir / "k6-summary.json")
    if not k6_summary:
        k6_summary = load_json(source_dir / "report-performance" / "k6-summary.json")
    if k6_summary:
        p95 = k6_summary.get("metrics", {}).get("http_req_duration", {}).get("values", {}).get("p(95)", 0)
        err = k6_summary.get("metrics", {}).get("http_req_failed", {}).get("values", {}).get("rate", 0)
        if p95:
            metrics.append(("quality_p95_latency_ms", {"branch": branch, "sha": sha}, p95))
        if err:
            metrics.append(("quality_error_rate", {"branch": branch, "sha": sha}, round(err, 6)))

    # ── Output ────────────────────────────────────────────────────────────────
    text = build_prometheus_text(metrics)

    endpoint = os.environ.get("METRICS_ENDPOINT", "")
    if endpoint:
        job = f"dokkan-quality/{repo.replace('/', '-')}"
        push_to_gateway(endpoint, job, text)
    else:
        print()
        print("  ℹ️  METRICS_ENDPOINT not set – printing metrics to stdout:")
        print()
        print(text)

    # Save a local copy as an artifact
    out = source_dir / "quality-metrics.prom"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(text)
    print(f"  Metrics saved to {out}  ({len(metrics)} series)")


if __name__ == "__main__":
    main()
