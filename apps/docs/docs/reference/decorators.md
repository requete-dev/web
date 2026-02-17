---
sidebar_position: 1
title: "Decorator Reference"
---

# Decorator Reference

This page provides a complete reference for all Requete decorators, including their parameters, types, and usage patterns.

## Session Decorators

### @sessions.session

Defines an engine session for a pipeline. The session configures the execution engine (Spark, DuckDB, Snowflake) and its settings.

```python
@sessions.session(tag="spark_session", pipeline="sales", engine="spark", env=["dev"])
def dev_session():
    return SparkSession.builder.appName("sales_dev").getOrCreate()
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Unique identifier for this session |
| `pipeline` | `str` | Yes | Pipeline this session belongs to |
| `engine` | `str` | Yes | Engine type: `"spark"`, `"duckdb"`, or `"snowflake"` |
| `env` | `list[str]` | No | Environments where this session is active. All environments if omitted. |

## Node Decorators

### @nodes.source

Defines a data source node that loads data into the pipeline.

```python
@nodes.source(tag="orders", pipeline="sales", env=["dev"])
def orders_dev(sparkSession):
    return sparkSession.createDataFrame([...])
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Unique identifier for this source |
| `pipeline` | `str` | Yes | Pipeline this source belongs to |
| `env` | `list[str]` | No | Environments where this source is active. All environments if omitted. |

### @nodes.backfill_source

Defines a backfill-specific source that receives a context dictionary with backfill parameters.

```python
@nodes.backfill_source(tag="orders", pipeline="sales", env=["backfill"])
def orders_backfill(sparkSession, context):
    start = context["start_date"]
    end = context["end_date"]
    return sparkSession.read.table("orders").filter(...)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Unique identifier (shared with the regular source tag) |
| `pipeline` | `str` | Yes | Pipeline this source belongs to |
| `env` | `list[str]` | No | Environments where this source is active. All environments if omitted. |

### @nodes.transform

Defines a transformation node that processes one or more upstream DataFrames.

```python
@nodes.transform(tag="revenue", pipeline="sales", depends_on=["orders", "customers"])
def revenue(orders_df, customers_df):
    return orders_df.join(customers_df, "customer_id")
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Unique identifier for this transform |
| `pipeline` | `str` | Yes | Pipeline this transform belongs to |
| `depends_on` | `list[str]` | Yes | List of upstream node tags this transform consumes |

Transforms do not have an `env` parameter. They run in all environments.

### @nodes.sink

Defines a sink node that writes data to an external destination.

```python
@nodes.sink(tag="write_orders", pipeline="sales", depends_on=["orders_clean"], env=["prod"])
def write_orders(orders_clean_df):
    orders_clean_df.write.mode("overwrite").saveAsTable("catalog.sales.orders_clean")
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Unique identifier for this sink |
| `pipeline` | `str` | Yes | Pipeline this sink belongs to |
| `depends_on` | `list[str]` | Yes | List of upstream node tags |
| `env` | `list[str]` | No | Environments where this sink is active. All environments if omitted. |

### @nodes.promote

Defines a promote node that publishes or materializes pipeline outputs as a final step.

```python
@nodes.promote(tag="publish_report", pipeline="analytics", depends_on=["final_report"], env=["prod"])
def publish_report(final_report_df):
    final_report_df.write.mode("overwrite").saveAsTable("catalog.analytics.report")
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Unique identifier for this promote |
| `pipeline` | `str` | Yes | Pipeline this promote belongs to |
| `depends_on` | `list[str]` | Yes | List of upstream node tags |
| `env` | `list[str]` | No | Environments where this promote is active. All environments if omitted. |

## Test Decorators

### @tests.unit

Defines a unit test for a transform.

```python
@tests.unit(tag="revenue")
def test_revenue(sparkSession):
    ...
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Tag of the transform being tested |

### @tests.integration

Defines an integration test that validates a node's output after execution.

```python
@tests.integration(tag="daily_summary", env=["ci"])
def test_summary(daily_summary_df):
    ...
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Tag of the node being tested |
| `env` | `list[str]` | No | Environments where this test runs. All environments if omitted. |

### @tests.source

Defines a source test that validates data quality after a source loads.

```python
@tests.source(tag="raw_events", env=["prod"])
def test_events(raw_events_df):
    ...
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Tag of the source being tested |
| `env` | `list[str]` | No | Environments where this test runs. All environments if omitted. |

### @tests.promotion

Defines a promotion test that acts as a quality gate before a promote node.

```python
@tests.promotion(tag="publish_report", env=["prod"])
def test_before_publish(final_report_df):
    ...
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tag` | `str` | Yes | Tag of the promote node being guarded |
| `env` | `list[str]` | No | Environments where this test runs. All environments if omitted. |

---

*Additional decorator options, advanced parameter patterns, and engine-specific decorator behavior are coming soon.*
