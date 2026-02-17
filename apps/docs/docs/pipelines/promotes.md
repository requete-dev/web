---
sidebar_position: 7
title: "Promotes"
---

# Promotes

Promotes are quality-gated write operations. Like sinks, they write data to external systems. Unlike sinks, a promote only executes after its associated promotion tests pass. If any promotion test fails, the promote is skipped, preventing bad data from reaching critical destinations.

## The `@nodes.promote` Decorator

```python
@nodes.promote(tag="promote", pipeline="simple", depends_on=["group_by"], env=["dev"])
def promote_dev(group_by_df: DataFrame) -> None:
    ...
```

### Parameters

| Parameter     | Type         | Description                                                        |
|---------------|--------------|--------------------------------------------------------------------|
| `tag`         | `str`        | Unique identifier for this promote within the pipeline.            |
| `pipeline`    | `str`        | The pipeline this promote belongs to. Must match `requete.yaml`.   |
| `depends_on`  | `list[str]`  | Tags of upstream nodes whose DataFrames this promote receives.     |
| `env`         | `list[str]`  | Environments where this implementation is active.                  |

### No Return Value

Like sinks, promote functions do not return a value. They exist to produce a side effect: writing data to an external destination, contingent on quality checks passing.

## How Promotes Work

The execution flow for a promote node is:

1. **Upstream nodes execute.** The DataFrames declared in `depends_on` are computed.
2. **Promotion tests run.** Any `@tests.promotion` test associated with the promote's tag executes against the data.
3. **If all tests pass**, the promote function runs and writes the data.
4. **If any test fails**, the promote is skipped. The data is not written.

This ensures that only data meeting your quality criteria reaches the promoted destination.

## Defining Promotion Tests

Promotion tests are defined with the `@tests.promotion` decorator. They validate the data before the promote node writes it:

```python
from requete import tests

@tests.promotion(tag="promote", env=["dev"])
def test_no_nulls(group_by_df: DataFrame) -> None:
    null_count = group_by_df.filter(col("count_c").isNull()).count()
    assert null_count == 0, f"Found {null_count} null values in count_c"

@tests.promotion(tag="promote", env=["dev"])
def test_positive_counts(group_by_df: DataFrame) -> None:
    negative_count = group_by_df.filter(col("count_c") < 0).count()
    assert negative_count == 0, f"Found {negative_count} negative counts"
```

The `tag` in the promotion test must match the `tag` of the promote node it gates. Multiple promotion tests can be associated with the same promote tag -- all must pass for the promote to execute.

## Complete Example

Here is a full example showing a source, transform, promotion test, and promote working together:

```python
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.functions import count, col
from requete import nodes, tests

# Source
@nodes.source(tag="read_table_1", pipeline="simple", env=["dev", "ci"])
def read_table_1_dev(sparkSession: SparkSession) -> DataFrame:
    data = [("foo", "1"), ("bar", "2")]
    return sparkSession.createDataFrame(data, ["a", "b"])

# Transform
@nodes.transform(tag="group_by", pipeline="simple", depends_on=["read_table_1"])
def group_by(read_table_1_df: DataFrame) -> DataFrame:
    return read_table_1_df.groupBy("a").agg(count("b").alias("count_b"))

# Promotion test: gates the promote
@tests.promotion(tag="promote", env=["dev"])
def test_data_quality(group_by_df: DataFrame) -> None:
    row_count = group_by_df.count()
    assert row_count > 0, "DataFrame is empty"

# Promote: only runs if the test above passes
@nodes.promote(tag="promote", pipeline="simple", depends_on=["group_by"], env=["dev"])
def promote_dev(group_by_df: DataFrame) -> None:
    group_by_df.write.option("path", "/tmp/requete/dev_promoted_table").mode("overwrite").saveAsTable("dev_promoted_table")
```

## Environment-Specific Promotes

Like sinks, promotes are environment-specific. You define different implementations for different environments:

```python
@nodes.promote(tag="promote", pipeline="simple", depends_on=["group_by"], env=["dev"])
def promote_dev(group_by_df: DataFrame) -> None:
    group_by_df.write.option("path", "/tmp/requete/dev_promoted_table").mode("overwrite").saveAsTable("dev_promoted_table")

@nodes.promote(tag="promote", pipeline="simple", depends_on=["group_by"], env=["prod"])
def promote_prod(group_by_df: DataFrame) -> None:
    group_by_df.write.mode("overwrite").insertInto("warehouse.promoted_table")
```

## When to Use Promote vs. Sink

| Scenario                                          | Use           |
|---------------------------------------------------|---------------|
| Writing to a production-critical table             | **Promote**   |
| Writing to a downstream-consumed dataset           | **Promote**   |
| Writing intermediate results for debugging         | **Sink**      |
| Writing to a staging area for manual review        | **Sink**      |
| Writing where data quality is non-negotiable       | **Promote**   |
| Writing logs or audit trails                       | **Sink**      |

The general rule: if bad data in the destination would cause downstream failures or incorrect business decisions, use a promote with thorough promotion tests. If the write is informational or can tolerate imperfect data, a sink is sufficient.

## Guidelines

- **Write meaningful promotion tests.** Test for null values, row counts, value ranges, schema conformance, and any invariants your downstream consumers depend on.
- **Keep promotes focused on writing.** Like sinks, promotes should not contain transformation logic. Shape the data in upstream transforms.
- **Use multiple promotion tests.** Define separate test functions for each quality check. This makes failures easier to diagnose.
- **Match promotion test envs to promote envs.** If a promote is defined for `env=["prod"]`, ensure there is a corresponding promotion test for `env=["prod"]`.
