#!/usr/bin/env python3
"""
ci/qc/_parse_eslint.py  – helper: converts ESLint JSON output to normalised findings.
Reads from stdin, writes JSON array to stdout.
"""
import json, sys

try:
    data = json.load(sys.stdin)
except Exception:
    print("[]")
    sys.exit(0)

findings = []
for file_result in data:
    fp = file_result.get("filePath", "")
    for msg in file_result.get("messages", []):
        sev = "HIGH" if msg.get("severity", 0) == 2 else "MEDIUM"
        rule = msg.get("ruleId", "unknown")
        findings.append({
            "severity": sev,
            "tool": "eslint",
            "file": fp,
            "line": msg.get("line", 0),
            "col": msg.get("column", 0),
            "rule": rule,
            "message": msg.get("message", ""),
            "recommendation": f"Fix ESLint rule '{rule}'. Run: cd Backend && npx eslint src --fix",
        })
print(json.dumps(findings))
