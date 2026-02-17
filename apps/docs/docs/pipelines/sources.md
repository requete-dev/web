---
sidebar_position: 4
title: "Sources"
---

# Sources

Sources are the data entry points of your pipeline. A source node reads data from an external system -- a database table, a file, an API -- and returns a DataFrame that downstream transforms and sinks can consume.

## The `@nodes.source` Decorator

```python
@nodes.source(tag="read_table_1", pipeline="simple", env=["dev", "ci"])
def read_table_1_dev(sparkSession: SparkSession) -> DataFrame:
    ...
```

### Parameters

| Parameter   | Type         | Description                                                       |
|-------------|--------------|-------------------------------------------------------------------|
| `tag`       | `str`        | Unique identifier for this source within the pipeline.            |
| `pipeline`  | `str`        | The pipeline this source belongs to. Must match `requete.yaml`.   |
| `env`       | `list[str]`  | Environments where this implementation is active.                 |

### Session Injection

Source functions receive the active compute session through a parameter named `sparkSession`. Requete resolves which session to inject based on the current environment and engine configuration.

```python
def read_table_1_dev(sparkSession: SparkSession) -> DataFrame:
    # sparkSession is automatically provided by Requete
    ...
```

### Return Value

A source function must return a `DataFrame`.

## Environment-Specific Implementations

Sources are where environment-specific behavior is most important. The same `tag` can have different implementations for different environments. Requete selects the correct implementation at runtime based on the active environment.

### Development Sources

In development, sources typically create synthetic data inline. This allows pipelines to run without access to production databases:

```python
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import StructType, StructField, StringType
from requete import nodes

@nodes.source(tag="read_table_1", pipeline="simple", env=["dev", "ci"])
def read_table_1_dev(sparkSession: SparkSession) -> DataFrame:
    schema = StructType([
        StructField("a", StringType()),
        StructField("b", StringType()),
    ])
    data = [("foo", "1"), ("bar", "2")]
    return sparkSession.createDataFrame(data, schema)
```

### Production Sources

In production, sources read from real data stores:

```python
@nodes.source(tag="read_table_1", pipeline="simple", env=["staging", "prod"])
def read_table_1_prod(sparkSession: SparkSession) -> DataFrame:
    return sparkSession.table("raw.table_1")
```

### Same Tag, Different Implementations

The key pattern here is that both functions use the same `tag="read_table_1"`. Downstream transforms reference this tag in their `depends_on` list and receive the appropriate DataFrame regardless of which environment is active:

```python
# Dev environment: returns synthetic data
@nodes.source(tag="read_table_1", pipeline="simple", env=["dev", "ci"])
def read_table_1_dev(sparkSession: SparkSession) -> DataFrame:
    schema = StructType([StructField("a", StringType()), StructField("b", StringType())])
    data = [("foo", "1"), ("bar", "2")]
    return sparkSession.createDataFrame(data, schema)

# Production environment: reads from catalog
@nodes.source(tag="read_table_1", pipeline="simple", env=["staging", "prod"])
def read_table_1_prod(sparkSession: SparkSession) -> DataFrame:
    return sparkSession.table("raw.table_1")
```

## Multiple Sources

A pipeline typically has several sources feeding into its transforms:

```python
@nodes.source(tag="read_table_1", pipeline="simple", env=["dev", "ci"])
def read_table_1_dev(sparkSession: SparkSession) -> DataFrame:
    schema = StructType([StructField("a", StringType()), StructField("b", StringType())])
    data = [("foo", "1"), ("bar", "2")]
    return sparkSession.createDataFrame(data, schema)

@nodes.source(tag="read_table_2", pipeline="simple", env=["dev", "ci"])
def read_table_2_dev(sparkSession: SparkSession) -> DataFrame:
    schema = StructType([StructField("b", StringType()), StructField("c", IntegerType())])
    data = [("1", 10), ("2", 20)]
    return sparkSession.createDataFrame(data, schema)
```

These sources can then be consumed together in a transform:

```python
@nodes.transform(tag="join_tables", pipeline="simple", depends_on=["read_table_1", "read_table_2"])
def join(read_table_1_df: DataFrame, read_table_2_df: DataFrame) -> DataFrame:
    return read_table_1_df.join(read_table_2_df, on="b", how="inner")
```

## Common Source Patterns

### Reading from a Database Table

```python
@nodes.source(tag="customers", pipeline="analytics", env=["prod"])
def customers_prod(sparkSession: SparkSession) -> DataFrame:
    return sparkSession.table("warehouse.customers")
```

### Reading from Files

```python
@nodes.source(tag="events", pipeline="analytics", env=["prod"])
def events_prod(sparkSession: SparkSession) -> DataFrame:
    return sparkSession.read.parquet("s3://data-lake/events/")
```

### Reading with Filters

```python
@nodes.source(tag="recent_orders", pipeline="analytics", env=["prod"])
def recent_orders_prod(sparkSession: SparkSession) -> DataFrame:
    return (
        sparkSession.table("raw.orders")
        .filter(col("order_date") >= "2024-01-01")
    )
```

## Guidelines

- **Keep sources thin.** Sources should read data and apply minimal filtering. Heavy transformation logic belongs in transform nodes.
- **Match schemas across environments.** Dev and prod implementations of the same tag should return DataFrames with the same schema so that downstream transforms behave consistently.
- **Use explicit schemas in dev.** When creating synthetic data with `createDataFrame`, always provide a `StructType` schema to avoid type inference issues.

## See Also

- [Backfill Sources](./backfill-sources.md) for date-range-aware source nodes.
- [Transforms](./transforms.md) for consuming source DataFrames.
