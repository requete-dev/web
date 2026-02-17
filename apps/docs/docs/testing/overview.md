---
sidebar_position: 1
title: "Testing Overview"
---

# Testing Overview

Requete provides a built-in testing framework with four distinct test types, each serving a specific role in pipeline validation. All tests use standard Python assertions -- no special test runner or assertion library is required.

## Test Types

| Test Type | Decorator | Purpose | Runs Against |
|-----------|-----------|---------|--------------|
| **Unit** | `@tests.unit` | Validate transform logic in isolation | Synthetic data you create |
| **Integration** | `@tests.integration` | Verify node output correctness | Real pipeline output DataFrame |
| **Source** | `@tests.source` | Check source data quality | Source output after loading |
| **Promotion** | `@tests.promotion` | Quality gate before promotes | Upstream DataFrame |

## Execution Order

Tests execute in a defined order during pipeline runs to catch failures as early as possible and minimize unnecessary computation:

```
1. Promotion Tests
   -- Quality gate: if a promotion test fails, its promote node is skipped

2. Node Execution
   -- Sources, transforms, sinks, and promotes run in topological order

3. Source Tests
   -- Validate data quality after sources load (strict, monitor, or skip mode)

4. Integration Tests
   -- Verify node outputs after execution completes

5. Unit Tests
   -- Run independently, validating transform logic with synthetic data
```

Promotion tests run before their associated promote nodes, acting as gatekeepers. Source tests and integration tests run after execution, validating outputs. Unit tests are independent of the pipeline execution and can run at any time.

## Environment Scoping

All test types except unit tests support the `env` parameter, allowing you to control which environments a test runs in:

```python
# This test only runs in CI
@tests.integration(tag="daily_report", env=["ci"])
def test_report_schema(daily_report_df):
    assert "revenue" in daily_report_df.columns

# This test runs in all environments (no env filter)
@tests.source(tag="raw_events")
def test_events_not_empty(raw_events_df):
    assert raw_events_df.count() > 0
```

## Assertions

Tests use plain Python `assert` statements. When an assertion fails, Requete captures the error message and reports it through the active interface (VSCode diagnostics, CLI output, or API response).

```python
assert row_count > 0, f"Expected rows but got {row_count}"
assert set(df.columns) == {"id", "name", "value"}, f"Unexpected columns: {df.columns}"
```

---

*Detailed coverage of each test type, advanced assertion patterns, and test configuration options are available in the dedicated pages that follow. Additional best practices and recipes are coming soon.*
