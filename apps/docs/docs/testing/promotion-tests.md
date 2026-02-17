---
sidebar_position: 5
title: "Promotion Tests"
---

# Promotion Tests

Promotion tests act as quality gates that run before a promote node executes. If the test fails, the associated promote is skipped, preventing bad data from being published to downstream consumers.

## Decorator

```python
@tests.promotion(tag="<promote_tag>", env=[...])
```

- **tag:** The tag of the promote node that this test guards.
- **env:** Optional list of environments in which this test runs. If omitted, the test runs in all environments.

## How Promotion Tests Work

Promote nodes are responsible for publishing or materializing pipeline outputs (writing to final tables, publishing datasets, etc.). Promotion tests run before the promote executes, receiving the upstream DataFrame that would be promoted:

```python
@nodes.promote(tag="publish_report", pipeline="analytics", depends_on=["final_report"], env=["prod"])
def publish_report(final_report_df):
    final_report_df.write.mode("overwrite").saveAsTable("catalog.analytics.daily_report")

@tests.promotion(tag="publish_report", env=["prod", "staging"])
def test_report_before_publish(final_report_df):
    count = final_report_df.count()
    assert count > 0, "Cannot promote an empty report"

    null_revenue = final_report_df.filter("revenue IS NULL").count()
    assert null_revenue == 0, f"Found {null_revenue} rows with null revenue"
```

## Execution Timing

Promotion tests are the first tests to execute in the pipeline lifecycle:

1. **Promotion tests** -- quality gate check
2. Node execution (promotes are skipped if their test failed)
3. Source tests
4. Integration tests

This early execution ensures that data quality issues are caught before any writes occur.

## Gating Behavior

- **Test passes:** The promote node executes normally.
- **Test fails:** The promote node is skipped. The failure is reported, but the rest of the pipeline continues executing. Nodes that do not depend on the failed promote are unaffected.

This design prevents partial or corrupted data from being published while allowing unrelated parts of the pipeline to complete.

## Example

```python
@tests.promotion(tag="sync_to_warehouse", env=["prod"])
def test_data_completeness(upstream_df):
    # Verify no critical columns are entirely null
    for col in ["customer_id", "order_date", "amount"]:
        non_null = upstream_df.filter(f"{col} IS NOT NULL").count()
        assert non_null > 0, f"Column '{col}' is entirely null"

    # Verify row count is within expected range
    count = upstream_df.count()
    assert count >= 100, f"Suspiciously low row count: {count}"
```

## Key Points

- **Pre-execution gate:** Unlike other tests, promotion tests run before their associated node, not after.
- **Non-blocking to pipeline:** A failed promotion test skips only its promote node. Other nodes in the DAG continue.
- **Production safety:** Promotion tests are your last line of defense before data reaches consumers. Use them to enforce invariants that must hold before publishing.
- **Upstream data access:** The test receives the DataFrame that the promote node would process, allowing you to inspect the data before it is written.

---

*Advanced gating patterns, multi-condition promotion tests, and rollback strategies are coming soon.*
