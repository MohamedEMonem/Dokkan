#!/usr/bin/env python3
"""
ci/qc/_merge_static.py  – helper: merges finding arrays from multiple files
and writes the normalised static.json suite report.
Usage:  python _merge_static.py <reports_dir> <eslint_json> <tsc_json> <audit_json> <status>
"""
import json, sys, os

reports_dir = sys.argv[1]
status      = sys.argv[5]
findings    = []

for path in sys.argv[2:5]:
    if path == "-":
        continue
    if os.path.exists(path):
        try:
            with open(path) as f:
                findings += json.load(f)
        except Exception:
            pass

report = {"suite": "static", "status": status, "findings": findings}
out    = os.path.join(reports_dir, "static.json")
with open(out, "w") as f:
    json.dump(report, f, indent=2)
high = sum(1 for x in findings if x.get("severity") == "HIGH")
print(f"Static analysis report: {out}  ({len(findings)} findings, {high} HIGH, status={status})")
