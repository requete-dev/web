---
sidebar_position: 6
title: "Sinks"
---

# Sinks

Sinks are the terminal nodes of your pipeline that write processed data to external systems. A sink receives a DataFrame from an upstream node and persists it -- to a table, a file, an API, or any other destination.

## The `@nodes.sink` Decorator

```python
@nodes.sink(tag="write", pipeline="simple", depends_on=["group_by"], env=["dev"])
def write_dev(group_by_df: DataFrame) -> None:
    ...
```

### Parameters

| Parameter     | Type         | Description                                                     |
|---------------|--------------|-----------------------------------------------------------------|
| `tag`         | `str`        | Unique identifier for this sink within the pipeline.            |
| `pipeline`    | `str`        | The pipeline this sink belongs to. Must match `requete.yaml`.   |
| `depends_on`  | `list[str]`  | Tags of upstream nodes whose DataFrames this sink receives.     |
| `env`         | `list[str]`  | Environments where this implementation is active.               |

### No Return Value

Sink functions must not return a value. Their purpose is to produce side effects: writing data to an external destination.

```python
def write_dev(group_by_df: DataFrame) -> None:
    group_by_df.write.mode("overwrite").saveAsTable("dev_table")
```

## Dependency Injection

Like transforms, sinks receive upstream DataFrames through the `<tag>_df` naming convention:

```python
@nodes.sink(tag="write", pipeline="simple", depends_on=["group_by"], env=["dev"])
def write_dev(group_by_df: DataFrame) -> None:
    group_by_df.write.option("path", "/tmp/requete/dev_table").mode("overwrite").saveAsTable("dev_table")
```

The `depends_on=["group_by"]` declaration means this sink receives the output of the `group_by` transform as the `group_by_df` parameter.

## Environment-Specific Writes

Sinks require the `env` parameter because write destinations typically differ across environments. You define separate implementations for each environment using the same tag:

```python
# Development: write to local storage
@nodes.sink(tag="write", pipeline="simple", depends_on=["group_by"], env=["dev"])
def write_dev(group_by_df: DataFrame) -> None:
    group_by_df.write.option("path", "/tmp/requete/dev_table").mode("overwrite").saveAsTable("dev_table")

# Production: write to the data warehouse
@nodes.sink(tag="write", pipeline="simple", depends_on=["group_by"], env=["prod"])
def write_prod(group_by_df: DataFrame) -> None:
    group_by_df.write.mode("overwrite").insertInto("warehouse.aggregated_table")
```

## Write Modes

The DataFrame `write` API supports several modes that control behavior when the target already exists:

| Mode          | Behavior                                             |
|---------------|------------------------------------------------------|
| `overwrite`   | Replace existing data entirely.                      |
| `append`      | Add new rows to existing data.                       |
| `ignore`      | Skip the write if the target already exists.         |
| `error`       | Raise an error if the target already exists (default).|

```python
# Overwrite the table each run
group_by_df.write.mode("overwrite").saveAsTable("results")

# Append new data
group_by_df.write.mode("append").insertInto("results")
```

## Common Sink Patterns

### Writing to a Managed Table

```python
@nodes.sink(tag="write_results", pipeline="analytics", depends_on=["daily_totals"], env=["prod"])
def write_results_prod(daily_totals_df: DataFrame) -> None:
    daily_totals_df.write.mode("overwrite").saveAsTable("warehouse.daily_totals")
```

### Writing to Partitioned Storage

```python
@nodes.sink(tag="write_events", pipeline="analytics", depends_on=["processed_events"], env=["prod"])
def write_events_prod(processed_events_df: DataFrame) -> None:
    (
        processed_events_df.write
        .partitionBy("event_date")
        .mode("overwrite")
        .parquet("s3://data-lake/processed/events/")
    )
```

### Writing to Multiple Destinations

If you need to write the same data to multiple destinations, define separate sinks that depend on the same upstream node:

```python
@nodes.sink(tag="write_to_warehouse", pipeline="analytics", depends_on=["results"], env=["prod"])
def write_to_warehouse(results_df: DataFrame) -> None:
    results_df.write.mode("overwrite").saveAsTable("warehouse.results")

@nodes.sink(tag="write_to_lake", pipeline="analytics", depends_on=["results"], env=["prod"])
def write_to_lake(results_df: DataFrame) -> None:
    results_df.write.mode("overwrite").parquet("s3://data-lake/results/")
```

## Sinks vs. Promotes

Both sinks and promotes write data, but they serve different purposes:

| Aspect             | Sink                              | Promote                                  |
|--------------------|-----------------------------------|------------------------------------------|
| Quality gate       | None                              | Runs `@tests.promotion` before writing   |
| Use case           | Intermediate or non-critical writes | Production-critical, quality-gated writes |
| Execution          | Always runs                       | Skipped if promotion tests fail          |

Use sinks for writes where you want the data persisted regardless of test outcomes. Use [promotes](./promotes.md) when the write should only happen after quality checks pass.

## Guidelines

- **Keep sinks simple.** A sink should write data, not transform it. Any data shaping belongs in an upstream transform.
- **Use environment-specific sinks.** Write to local paths or temporary tables in dev, and to production storage in prod.
- **Be explicit about write modes.** Always specify `.mode("overwrite")` or `.mode("append")` rather than relying on defaults.
- **Handle idempotency.** Design sinks so that re-running the pipeline produces the same result. `overwrite` mode naturally provides this.
