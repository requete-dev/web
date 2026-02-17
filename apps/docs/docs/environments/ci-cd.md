---
sidebar_position: 3
title: "CI/CD"
---

# CI/CD Environment

The `ci` environment is designed for automated pipeline validation in continuous integration systems. It runs the full test suite, validates pipeline structure, and produces structured output suitable for CI tooling.

## Key Characteristics

- **Full test execution:** All test types (unit, integration, source, promotion) are enabled by default.
- **Structured output:** Results are written to stdout in a structured format that CI systems can parse for reporting.
- **Exit codes:** The process exits with a non-zero code on any test failure, integrating naturally with CI pipelines.
- **CLI-driven:** CI runs are initiated via the `requete validate-ci` command, which handles orchestration, execution, and reporting in a single invocation.

## CI Execution Order

When `validate-ci` runs, tests execute in a specific order:

1. **Promotion tests** run first, acting as quality gates.
2. **Node execution** proceeds for nodes that pass their promotion checks.
3. **Source tests** validate data quality after sources are loaded.
4. **Integration tests** verify end-to-end correctness after nodes complete.
5. **Unit tests** run independently, validating transform logic in isolation.

This ordering ensures that failures are caught as early as possible, minimizing wasted compute in the pipeline.

## Usage

```bash
# Validate a specific pipeline in CI mode
requete validate-ci --pipeline sales

# Validate all discovered pipelines
requete validate-ci
```

## Writing CI-Specific Tests

Tests can be scoped to run only in CI by setting `env=["ci"]`:

```python
@tests.integration(tag="daily_summary", env=["ci"])
def test_daily_summary_completeness(daily_summary_df):
    row_count = daily_summary_df.count()
    assert row_count > 0, "Daily summary must produce at least one row"
```

This test will execute during `validate-ci` but will be skipped during local dev runs, keeping the development feedback loop fast.

## CI Pipeline Integration

The `validate-ci` command is designed to slot into standard CI workflows (GitHub Actions, GitLab CI, Jenkins, etc.). It discovers pipelines from `requete.yaml` files, starts the engine, runs all validation, and exits cleanly with appropriate status codes.

---

*Detailed CI configuration, GitHub Actions examples, and advanced reporting options are coming soon.*
