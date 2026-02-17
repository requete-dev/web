---
sidebar_position: 2
title: "Category 1: Tag Identity"
---

# Category 1: Tag Identity

### Rule 1.1: Tag Uniqueness Per Node Type + Environment

**Rule:** Within a single node type, each `(tag, env)` combination must be unique.

**Valid:**

```python
# Different tags
@nodes.source(tag="users", pipeline="main", env=["dev"])
@nodes.source(tag="orders", pipeline="main", env=["dev"])

# Same tag, different envs
@nodes.source(tag="users", pipeline="main", env=["dev"])
@nodes.source(tag="users", pipeline="main", env=["prod"])
```

**Invalid:**

```python
# Duplicate (tag="users", env=["dev"])
@nodes.source(tag="users", pipeline="main", env=["dev"])
def users_v1(spark: SparkSession) -> DataFrame: ...

@nodes.source(tag="users", pipeline="main", env=["dev"])  # ERROR!
def users_v2(spark: SparkSession) -> DataFrame: ...
```

**Error Message:**

```
Duplicate source node: tag 'users' in env 'dev' already defined in users_v1 (line 5)
```

**Fix Suggestion:**

- Use different tag names, or
- Use different environments, or
- Remove one of the duplicate definitions

---

### Rule 1.2: Tag Naming Conventions

**Rule:** Tags should be descriptive identifiers (lowercase, underscores allowed).

**Severity:** Warning

**Valid:**

```python
tag="users_cleaned"
tag="revenue_2024"
tag="join_users_orders"
```

**Warning:**

```python
tag="node1"          # Too generic
tag="temp"           # Too generic
tag="final_final_v2" # Poor naming
```

**Warning Message:**

```
Warning: Tag 'node1' is not descriptive. Consider using a more meaningful name.
```

---

### Rule 1.3: Session Tag Uniqueness Per Pipeline

**Rule:** Within a pipeline, session node tags must be globally unique. No two session nodes can share the same tag, regardless of engine or environment.

**Rationale:** Each session in a pipeline should have a unique identifier to prevent ambiguity and confusion when referencing sessions.

**Valid:**

```python
# spark.py
@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def spark_session() -> SparkSession: ...

# duckdb.py
@nodes.session(tag="duckdb_dev", pipeline="analytics", engine="duckdb", env=["dev"])
def duckdb_session() -> SparkSession: ...
# Different tags
```

**Invalid:**

```python
# spark.py
@nodes.session(tag="dev_session", pipeline="analytics", engine="spark", env=["dev"])
def spark_session() -> SparkSession: ...

# duckdb.py
@nodes.session(tag="dev_session", pipeline="analytics", engine="duckdb", env=["staging"])
def duckdb_session() -> SparkSession: ...
# Same tag in same pipeline, even though different engine and env
```

**Error Message:**

```
Duplicate session tag 'dev_session' in pipeline 'analytics'
Session tag already defined in spark.py for engine 'spark', env '["dev"]'
Session tags must be unique within a pipeline regardless of engine or environment

Use a different tag like: 'duckdb_dev_session' or 'duckdb_staging_session'
```

---

### Rule 1.4: Single Tag Per File (Non-Session Nodes)

**Rule:** A Python file should contain at most one tag for non-session nodes (source, transform, sink, promote, backfill_source). Session nodes are exempt from this rule.

**Rationale:** Organizing pipelines with one tag per file (except sessions) improves code clarity, makes it easier to locate individual nodes, and maintains a clean project structure. Session nodes are allowed to have multiple tags per file since they often define environment-specific session configurations.

**Valid:**

```python
# users.py - Single non-session tag
@nodes.source(tag="users", pipeline="main", env=["dev"])
def load_users(spark: SparkSession) -> DataFrame:
    return spark.read.parquet("users.parquet")
```

```python
# orders.py - Single non-session tag
@nodes.source(tag="orders", pipeline="main", env=["dev"])
def load_orders(spark: SparkSession) -> DataFrame:
    return spark.read.parquet("orders.parquet")
```

```python
# session.py - Multiple session tags allowed
@nodes.session(tag="spark_dev", pipeline="main", engine="spark", env=["dev"])
def create_dev_session() -> SparkSession: ...

@nodes.session(tag="spark_prod", pipeline="main", engine="spark", env=["prod"])
def create_prod_session() -> SparkSession: ...
```

**Invalid:**

```python
# data_sources.py - Multiple non-session tags
@nodes.source(tag="users", pipeline="main", env=["dev"])
def load_users(spark: SparkSession) -> DataFrame:
    return spark.read.parquet("users.parquet")

@nodes.source(tag="orders", pipeline="main", env=["dev"])
def load_orders(spark: SparkSession) -> DataFrame:
    return spark.read.parquet("orders.parquet")
```

**Error Message:**

```
Multiple tags found in same file:
Tag 'orders' (line 8)
Tag 'users' (line 2)

Move nodes with different tags into separate files for better organization
Note: Session nodes are exempt from this rule
```

**Fix Suggestion:**

- Split nodes with different tags into separate files
- Keep one tag per file for sources, transforms, sinks, promotes, and backfill_sources
- Session nodes can continue to have multiple tags per file

---

### Rule 1.5: Global Tag Uniqueness Per Pipeline (Non-Session Nodes)

**Rule:** Non-session node tags must be globally unique within a pipeline. If two different files in the same pipeline define a non-session node with the same tag, this is an error.

**Rationale:** Each tag must map to exactly one node definition within a pipeline to ensure unambiguous node resolution during DAG construction and execution. Session nodes are excluded because they are already covered by Rule 1.3.

**Valid:**

```python
# file1.py
@nodes.transform(tag="join_tables", pipeline="analytics", depends_on=["users"])
def join_tables(users_df: DataFrame) -> DataFrame: ...

# file2.py - Different tag
@nodes.transform(tag="aggregate_sales", pipeline="analytics", depends_on=["orders"])
def aggregate_sales(orders_df: DataFrame) -> DataFrame: ...
```

```python
# file1.py
@nodes.transform(tag="join_tables", pipeline="pipeline_a", depends_on=["users"])
def join_tables(users_df: DataFrame) -> DataFrame: ...

# file2.py - Same tag but different pipeline
@nodes.transform(tag="join_tables", pipeline="pipeline_b", depends_on=["orders"])
def join_tables(orders_df: DataFrame) -> DataFrame: ...
```

**Invalid:**

```python
# file1.py
@nodes.transform(tag="join_tables", pipeline="analytics", depends_on=["users"])
def join_tables_v1(users_df: DataFrame) -> DataFrame: ...

# file2.py - Same tag, same pipeline
@nodes.transform(tag="join_tables", pipeline="analytics", depends_on=["orders"])
def join_tables_v2(orders_df: DataFrame) -> DataFrame: ...
```

**Error Message:**

```
Duplicate tag 'join_tables' in pipeline 'analytics': already defined in file1.py
Each tag must be unique within a pipeline. Rename this tag or remove the duplicate.
```

**Fix Suggestion:**

- Rename one of the tags to be unique within the pipeline
- If the nodes serve different purposes, use descriptive names (e.g., `join_user_tables`, `join_order_tables`)
- If they are meant to be the same node, remove the duplicate definition
