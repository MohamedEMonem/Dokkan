// commitlint.config.js
// Conventional Commits enforcement for the Dokkan monorepo
// Reference: https://commitlint.js.org/

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allowed commit types
    "type-enum": [
      2,
      "always",
      [
        "feat",       // new feature
        "fix",        // bug fix
        "chore",      // maintenance / tooling
        "docs",       // documentation only
        "style",      // formatting, no logic change
        "refactor",   // code change that is neither fix nor feat
        "perf",       // performance improvement
        "test",       // adding/updating tests
        "build",      // build system changes
        "ci",         // CI/CD changes
        "revert",     // revert a previous commit
        "security",   // security fix
        "hotfix",     // urgent production fix
        "release",    // version bump / release prep
      ],
    ],
    // Subject must not start with an uppercase letter
    "subject-case": [2, "always", "lower-case"],
    // Subject must not end with a period
    "subject-full-stop": [2, "never", "."],
    // Subject minimum length
    "subject-min-length": [2, "always", 5],
    // Subject maximum length
    "subject-max-length": [2, "always", 72],
    // Header maximum length (type + scope + subject)
    "header-max-length": [2, "always", 100],
    // Body lines maximum length
    "body-max-line-length": [1, "always", 120],
    // Scope is optional but must be lowercase if provided
    "scope-case": [2, "always", "lower-case"],
  },
  // Allow dependabot / github-actions bot commits without strict enforcement
  ignores: [
    (commit) =>
      commit.includes("Merge pull request") ||
      commit.includes("Merge branch") ||
      commit.includes("Initial commit") ||
      /^Revert "/.test(commit),
  ],
};
