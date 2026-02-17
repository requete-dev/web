---
sidebar_position: 8
title: "Backfill Sources"
---

# Backfill Sources

Backfill sources are a specialized source type designed for reprocessing historical data over a date range. They work like regular sources but receive an additional `context` dictionary containing date range parameters, allowing you to read a specific slice of historical data.

## The `@nodes.backfill_source` Decorator

```python
@nodes.backfill_source(tag="orders", pipeline="ecommerce_analytics", env=["backfill"])
def orders_backfill(sparkSession: SparkSession, context: dict[str, str]) -> DataFrame:
    ...
```

### Parameters

| Parameter   | Type         | Description                                                              |
|-------------|--------------|--------------------------------------------------------------------------|
| `tag`       | `str`        | Unique identifier for this source within the pipeline.                   |
| `pipeline`  | `str`        | The pipeline this source belongs to. Must match `requete.yaml`.          |
| `env`       | `list[str]`  | Environments where this implementation is active (typically `["backfill"]`). |

### Function Parameters

A backfill source function receives two injected parameters:

| Parameter       | Type               | Description                                          |
|-----------------|--------------------|------------------------------------------------------|
| `sparkSession`  | `SparkSession`     | The active compute session for this environment.     |
| `context`       | `dict[str, str]`   | A dictionary containing date range and other parameters passed from the CLI. |

### Return Value

A backfill source function must return a `DataFrame`, just like a regular source.

## The Context Dictionary

The `context` dictionary is populated from CLI arguments when you trigger a backfill run. It typically contains:

| Key          | Description                              | Example Value   |
|--------------|------------------------------------------|-----------------|
| `from_date`  | Start of the date range (inclusive).     | `"2024-01-01"`  |
| `to_date`    | End of the date range (exclusive).       | `"2024-04-01"`  |

Your backfill source uses these values to filter the data it reads:

```python
@nodes.backfill_source(tag="orders", pipeline="ecommerce_analytics", env=["backfill"])
def orders_backfill(sparkSession: SparkSession, context: dict[str, str]) -> DataFrame:
    start_date = context.get('from_date', '2024-01-01')
    end_date = context.get('to_date', '2024-12-31')
    return (
        sparkSession.table("raw.orders")
        .filter(
            (col("order_date") >= start_date) & (col("order_date") < end_date)
        )
    )
```

Always provide sensible defaults with `context.get()` to handle cases where a key might not be present.

## The Backfill Environment

Backfill sources are typically associated with the `backfill` environment. This keeps backfill logic separate from your regular dev, staging, and production source implementations:

```python
# Regular dev source: synthetic data
@nodes.source(tag="orders", pipeline="ecommerce_analytics", env=["dev"])
def orders_dev(sparkSession: SparkSession) -> DataFrame:
    data = [("order1", "2024-06-01", 100), ("order2", "2024-06-02", 200)]
    return sparkSession.createDataFrame(data, ["order_id", "order_date", "amount"])

# Regular prod source: reads full table
@nodes.source(tag="orders", pipeline="ecommerce_analytics", env=["prod"])
def orders_prod(sparkSession: SparkSession) -> DataFrame:
    return sparkSession.table("raw.orders")

# Backfill source: reads a date-filtered slice
@nodes.backfill_source(tag="orders", pipeline="ecommerce_analytics", env=["backfill"])
def orders_backfill(sparkSession: SparkSession, context: dict[str, str]) -> DataFrame:
    start_date = context.get('from_date', '2024-01-01')
    end_date = context.get('to_date', '2024-12-31')
    return (
        sparkSession.table("raw.orders")
        .filter(
            (col("order_date") >= start_date) & (col("order_date") < end_date)
        )
    )
```

All three implementations share the same `tag="orders"`. Downstream transforms do not need to change -- they receive the `orders_df` DataFrame regardless of whether the pipeline is running in dev, prod, or backfill mode.

## Passing Context from the CLI

When you invoke a backfill run from the command line, the context values are passed as arguments:

```bash
requete run --pipeline ecommerce_analytics --env backfill --context from_date=2024-01-01 --context to_date=2024-04-01
```

These key-value pairs are collected into the `context` dictionary that your backfill source receives.

## Multiple Backfill Sources

A pipeline can have multiple backfill sources, all sharing the same context. This is useful when a pipeline reads from several tables that all need date-range filtering:

```python
@nodes.backfill_source(tag="orders", pipeline="ecommerce_analytics", env=["backfill"])
def orders_backfill(sparkSession: SparkSession, context: dict[str, str]) -> DataFrame:
    start_date = context.get('from_date', '2024-01-01')
    end_date = context.get('to_date', '2024-12-31')
    return (
        sparkSession.table("raw.orders")
        .filter((col("order_date") >= start_date) & (col("order_date") < end_date))
    )

@nodes.backfill_source(tag="payments", pipeline="ecommerce_analytics", env=["backfill"])
def payments_backfill(sparkSession: SparkSession, context: dict[str, str]) -> DataFrame:
    start_date = context.get('from_date', '2024-01-01')
    end_date = context.get('to_date', '2024-12-31')
    return (
        sparkSession.table("raw.payments")
        .filter((col("payment_date") >= start_date) & (col("payment_date") < end_date))
    )
```

Both sources receive the same `context` dictionary, so a single CLI invocation controls the date range for all backfill sources in the pipeline.

## Guidelines

- **Always use `context.get()` with defaults.** This makes your backfill sources resilient to missing context keys.
- **Keep the backfill environment separate.** Use `env=["backfill"]` to avoid mixing backfill logic with regular source implementations.
- **Filter at the source.** Apply date range filters as early as possible to avoid reading unnecessary data.
- **Use the same tag as your regular sources.** This ensures downstream transforms work without modification across all environments, including backfill.
- **Test backfill sources with representative date ranges.** Verify that boundary conditions (empty ranges, single-day ranges, large ranges) produce correct results.
