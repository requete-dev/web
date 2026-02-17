---
sidebar_position: 4
title: "Source Tests"
---

# Source Tests

Source tests validate the quality and integrity of data loaded by source nodes. They run after a source executes and provide configurable behavior on failure: halt the pipeline, log a warning, or skip entirely.

## Decorator

```python
@tests.source(tag="<source_tag>", env=[...])
```

- **tag:** The tag of the source node whose output this test validates.
- **env:** Optional list of environments in which this test runs. If omitted, the test runs in all environments.

## How Source Tests Work

After a source node loads data, its output DataFrame is passed to any associated source tests. The test function receives the DataFrame and performs data quality assertions:

```python
@tests.source(tag="raw_transactions", env=["prod", "staging"])
def test_transactions_quality(raw_transactions_df):
    count = raw_transactions_df.count()
    assert count > 0, "Transaction source must not be empty"

    null_ids = raw_transactions_df.filter("transaction_id IS NULL").count()
    assert null_ids == 0, f"Found {null_ids} transactions with null IDs"
```

## Three Execution Modes

Source tests support three modes that control pipeline behavior on failure:

| Mode | Behavior on Failure | Use Case |
|------|---------------------|----------|
| **Strict** | Pipeline execution halts | CI, staging validation |
| **Monitor** | Warning is logged, pipeline continues | Production monitoring |
| **Skip** | Test is not executed | Environments where the test is irrelevant |

The mode is typically determined by the environment configuration. In production, source tests commonly run in monitor mode to avoid blocking pipelines due to transient data quality issues while still surfacing anomalies for investigation.

## Example

```python
@tests.source(tag="customer_events")
def test_event_schema(customer_events_df):
    required_columns = {"event_id", "customer_id", "event_type", "timestamp"}
    actual_columns = set(customer_events_df.columns)
    missing = required_columns - actual_columns
    assert not missing, f"Missing required columns: {missing}"

@tests.source(tag="customer_events", env=["ci"])
def test_event_freshness(customer_events_df):
    from pyspark.sql.functions import max as spark_max, current_timestamp, datediff
    max_ts = customer_events_df.select(spark_max("timestamp")).collect()[0][0]
    assert max_ts is not None, "No events found"
```

## Key Points

- **Data quality focus:** Source tests are specifically designed for validating incoming data before it flows into transforms.
- **Post-source execution:** They run after the source node completes, giving access to the actual loaded data.
- **Mode flexibility:** The strict/monitor/skip modes let you tune behavior per environment without changing test code.
- **Early detection:** Source tests catch upstream data issues (missing columns, empty loads, schema drift) before they propagate through the pipeline.

---

*Detailed mode configuration, custom quality metrics, and alerting integration for source test failures are coming soon.*
