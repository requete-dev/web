---
sidebar_position: 6
title: "Category 5: Cross-Engine Consistency"
---

# Category 5: Cross-Engine Consistency

### Rule 5.1: Cross-Engine Tag Coverage for I/O Nodes

**Rule:** For I/O nodes (source, sink, promote) with a specific tag, if that tag is implemented for one engine in a pipeline, it must be implemented for ALL engines in that pipeline with the same environment coverage.

**Rationale:** Users should be able to switch engines for a pipeline without missing node implementations. If `promote_analytics` exists for `(spark, dev)` and `(spark, prod)`, it should also exist for `(duckdb, dev)` and `(duckdb, prod)` if duckdb is a valid engine for the pipeline.

**Valid:**

```python
# spark.py - Pipeline "analytics", engine "spark"
@nodes.session(tag="spark_session", pipeline="analytics", engine="spark", env=["dev", "prod"])

@nodes.promote(tag="promote_analytics", pipeline="analytics", env=["dev", "prod"], depends_on=[...])
def promote_spark(...): ...

# duckdb.py - Pipeline "analytics", engine "duckdb"
@nodes.session(tag="duckdb_session", pipeline="analytics", engine="duckdb", env=["dev", "prod"])

@nodes.promote(tag="promote_analytics", pipeline="analytics", env=["dev", "prod"], depends_on=[...])
def promote_duckdb(...): ...
# Same tag exists for both engines with same env coverage
```

**Invalid:**

```python
# spark.py - Has promote_analytics for dev, prod
@nodes.session(tag="spark_session", pipeline="analytics", engine="spark", env=["dev", "prod"])

@nodes.promote(tag="promote_analytics", pipeline="analytics", env=["dev", "prod"], depends_on=[...])
def promote_spark(...): ...

# duckdb.py - Missing promote_analytics entirely OR missing some envs
@nodes.session(tag="duckdb_session", pipeline="analytics", engine="duckdb", env=["dev", "prod"])

# promote_analytics is missing for duckdb engine!
```

**Error Message:**

```
Cross-engine tag coverage incomplete for 'promote_analytics' in pipeline 'analytics'

Found in engines: spark [dev, prod]
Missing in engines: duckdb

All I/O nodes with the same tag must be implemented across all engines in a pipeline.
Add promote node 'promote_analytics' for engine 'duckdb' with env coverage: [dev, prod]
```

**Note:** This rule only applies to I/O nodes (source, sink, promote). Transform nodes are engine-agnostic.
