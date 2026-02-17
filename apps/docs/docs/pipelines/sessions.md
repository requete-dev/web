---
sidebar_position: 3
title: "Sessions"
---

# Sessions

Sessions define the compute engine that powers your pipeline. A session is a configured instance of a processing engine -- such as Apache Spark or DuckDB -- that Requete injects into your source nodes for reading data.

## The `@sessions.session` Decorator

```python
@sessions.session(tag="spark_dev_session", pipeline="simple", engine="spark", env=["dev", "ci"])
def dev_session() -> SparkSession:
    ...
```

### Parameters

| Parameter   | Type         | Description                                                        |
|-------------|--------------|--------------------------------------------------------------------|
| `tag`       | `str`        | Unique identifier for this session within the pipeline.            |
| `pipeline`  | `str`        | The pipeline this session belongs to. Must match `requete.yaml`.   |
| `engine`    | `str`        | The compute engine type: `"spark"`, `"duckdb"`, or `"snowflake"`. |
| `env`       | `list[str]`  | Environments where this session is active.                         |

### Return Value

A session function must return a `SparkSession` object. For DuckDB, this is a DuckDB-flavored `SparkSession` provided by `duckdb.experimental.spark`.

## Spark Sessions

Spark sessions use the standard PySpark `SparkSession.builder` API:

```python
from pyspark.sql import SparkSession
from requete import sessions

@sessions.session(tag="spark_dev_session", pipeline="simple", engine="spark", env=["dev", "ci"])
def dev_session() -> SparkSession:
    return (
        SparkSession.builder
        .master("local[*]")
        .appName("RequeteDevSession")
        .config("spark.sql.warehouse.dir", "/tmp/requete/spark-warehouse")
        .getOrCreate()
    )
```

For production environments, you typically connect to a cluster:

```python
@sessions.session(tag="spark_prod_session", pipeline="simple", engine="spark", env=["staging", "prod"])
def prod_session() -> SparkSession:
    return (
        SparkSession.builder
        .appName("RequeteProdSession")
        .enableHiveSupport()
        .getOrCreate()
    )
```

## DuckDB Sessions

DuckDB sessions use the `duckdb.experimental.spark` compatibility layer, which provides a Spark-compatible API backed by DuckDB:

```python
from duckdb.experimental.spark.sql import SparkSession
from requete import sessions

@sessions.session(tag="duckdb_dev_session", pipeline="simple", engine="duckdb", env=["dev"])
def dev_session() -> SparkSession:
    return SparkSession.builder.remote("local").getOrCreate()
```

Because DuckDB's Spark compatibility layer uses the same `SparkSession` interface, your source and transform code can remain engine-agnostic.

## Multi-Environment Sessions

A single pipeline can define different sessions for different environments. Requete selects the correct session based on the active environment at execution time.

```python
# Development: local Spark, no cluster needed
@sessions.session(tag="spark_dev_session", pipeline="analytics", engine="spark", env=["dev", "ci"])
def dev_session() -> SparkSession:
    return (
        SparkSession.builder
        .master("local[*]")
        .appName("AnalyticsDev")
        .getOrCreate()
    )

# Production: connect to existing cluster
@sessions.session(tag="spark_prod_session", pipeline="analytics", engine="spark", env=["staging", "prod"])
def prod_session() -> SparkSession:
    return (
        SparkSession.builder
        .appName("AnalyticsProd")
        .enableHiveSupport()
        .getOrCreate()
    )
```

You can also switch engines entirely across environments. For example, use DuckDB for fast local development and Spark for production:

```python
@sessions.session(tag="duckdb_dev_session", pipeline="analytics", engine="duckdb", env=["dev"])
def dev_session() -> SparkSession:
    return SparkSession.builder.remote("local").getOrCreate()

@sessions.session(tag="spark_prod_session", pipeline="analytics", engine="spark", env=["prod"])
def prod_session() -> SparkSession:
    return SparkSession.builder.appName("AnalyticsProd").getOrCreate()
```

## How Sessions Are Injected

Sessions are injected into source nodes through the `sparkSession` parameter. When a source function declares a `sparkSession` parameter, Requete resolves the active session for the current environment and engine, then passes it in automatically.

```python
@nodes.source(tag="read_orders", pipeline="analytics", env=["dev"])
def read_orders_dev(sparkSession: SparkSession) -> DataFrame:
    # sparkSession is the session defined for env=["dev"]
    return sparkSession.createDataFrame([("order1", 100)], ["id", "amount"])
```

You do not need to reference the session tag in your source code. Requete handles the resolution based on the environment and engine configuration.

## Guidelines

- **One session per engine per environment.** Define exactly one session for each combination of engine type and environment set.
- **Keep session creation simple.** Sessions should only configure and return the `SparkSession`. Avoid putting business logic in session functions.
- **Pin Spark configuration in production.** Use explicit Spark configs for production sessions to ensure predictable behavior across runs.
