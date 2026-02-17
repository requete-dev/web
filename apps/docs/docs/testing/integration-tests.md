---
sidebar_position: 3
title: "Integration Tests"
---

# Integration Tests

Integration tests validate node outputs using the actual data produced by the pipeline. Unlike unit tests, they run after node execution and receive the real output DataFrame, allowing you to verify end-to-end correctness.

## Decorator

```python
@tests.integration(tag="<node_tag>", env=[...])
```

- **tag:** The tag of the node whose output this test validates.
- **env:** Optional list of environments in which this test runs. If omitted, the test runs in all environments.

## How Integration Tests Work

After a node executes, its output DataFrame is passed to any associated integration tests. The test function receives this DataFrame as a parameter named `<tag>_df`:

```python
@tests.integration(tag="daily_summary", env=["ci", "staging"])
def test_daily_summary(daily_summary_df):
    # Validate the actual pipeline output
    assert daily_summary_df.count() > 0, "Summary must contain rows"
    assert "total_revenue" in daily_summary_df.columns
    assert "report_date" in daily_summary_df.columns
```

The parameter name follows the convention `<tag>_df`, where `<tag>` is the node tag specified in the decorator.

## Execution Timing

Integration tests run after node execution completes in the pipeline. They are among the last tests to execute:

1. Promotion tests (before execution)
2. Node execution
3. Source tests (after sources load)
4. **Integration tests (after nodes complete)**

This ordering ensures that integration tests always operate on fully computed results.

## Example

```python
@nodes.transform(tag="top_customers", pipeline="sales", depends_on=["revenue_per_customer"])
def top_customers(revenue_per_customer_df):
    return revenue_per_customer_df.orderBy("total_revenue", ascending=False).limit(100)

@tests.integration(tag="top_customers", env=["ci"])
def test_top_customers_limit(top_customers_df):
    count = top_customers_df.count()
    assert count <= 100, f"Expected at most 100 rows, got {count}"
    assert count > 0, "Expected at least one top customer"
```

## Key Points

- **Real data:** Integration tests operate on the actual output of the pipeline, not synthetic data. This catches issues that unit tests cannot, such as schema mismatches from upstream sources.
- **Environment scoping:** Use the `env` parameter to run expensive integration tests only in CI or staging, keeping dev iteration fast.
- **Post-execution:** The test receives the DataFrame after the node has completed execution. If the node fails, its integration tests are skipped.
- **Multiple tests per node:** A node can have multiple integration tests, each validating different aspects of the output.

---

*Advanced integration test patterns, cross-node validation, and snapshot testing are coming soon.*
