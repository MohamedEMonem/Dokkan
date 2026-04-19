<!--
  PR TEMPLATE – Dokkan Backend
  ─────────────────────────────────────────────────────────────────────
  Fill in EVERY section before requesting review.
  The QA-1 policy_check.sh script validates that required headings are
  present and non-empty.  Incomplete PRs will FAIL the pipeline.
-->

## 📋 Summary
<!-- One-paragraph description of what this PR does and why. -->


## 🔗 Linked Issue / Ticket
<!-- Required – paste the GitHub issue or Jira/Linear ticket URL.
     Example:  Closes #42  |  Fixes #42  |  Resolves #42          -->

Closes #

## 🔁 Type of Change
<!-- Check the boxes that apply. -->
- [ ] 🐛 Bug fix (non-breaking, fixes an issue)
- [ ] ✨ New feature (non-breaking, adds functionality)
- [ ] 💥 Breaking change (alters existing API or DB schema)
- [ ] ♻️  Refactor (no functional change)
- [ ] 🔒 Security fix
- [ ] 🗄️  Database migration
- [ ] 🔧 CI/CD / infrastructure
- [ ] 📝 Documentation only

## 🧪 Test Evidence
<!-- Required – describe or paste test output that proves the change
     works correctly.  Screenshot, CI log link, or command output.    -->

```
# paste relevant test output here
```

## ⚠️ Risk Assessment
<!--
  LOW    – isolated change, no shared dependencies, fully covered by tests
  MEDIUM – touches shared logic, moderate coverage, rollback straightforward
  HIGH   – critical path (auth, payments, DB migrations), limited coverage
-->
**Risk level:** <!-- LOW | MEDIUM | HIGH -->

**Explanation:**


## 🔄 Rollback Plan
<!-- Required for MEDIUM and HIGH risk changes.
     Describe the exact steps to revert if this PR causes an incident. -->


## 🔒 Security Checklist
- [ ] No secrets, credentials, or PII added to source code
- [ ] Input validation added / preserved for new endpoints
- [ ] Authentication / authorisation unchanged or explicitly reviewed
- [ ] No new direct/transitive dependency with known CVEs
- [ ] Sensitive logic changes reviewed by a security owner

## 📦 Dependencies Changed
<!-- List any new / updated / removed packages; explain why. -->
- None

## 🖼️ Screenshots / API diff
<!-- Optional but encouraged for API contract changes. -->
