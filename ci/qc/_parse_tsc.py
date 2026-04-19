#!/usr/bin/env python3
"""
ci/qc/_parse_tsc.py  – helper: converts tsc stderr output to normalised findings.
Reads from stdin, writes JSON array to stdout.
"""
import json, sys, re

lines = sys.stdin.read().splitlines()
findings = []
for line in lines:
    m = re.match(r'^(.+?)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$', line)
    if m:
        findings.append({
            "severity": "HIGH",
            "tool": "tsc",
            "file": m.group(1),
            "line": int(m.group(2)),
            "col": int(m.group(3)),
            "rule": m.group(4),
            "message": m.group(5),
            "recommendation": f"Fix TypeScript error {m.group(4)}. "
                              "See: https://www.typescriptlang.org/tsconfig",
        })
print(json.dumps(findings))
