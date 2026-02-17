---
sidebar_position: 2
title: "Development"
---

# Development Environment

The `dev` environment is optimized for fast, local iteration. It allows you to build and test pipelines using in-memory data without connecting to external data sources, enabling a tight feedback loop during development.

## Key Characteristics

- **In-memory test data:** Sources use `createDataFrame` to generate synthetic DataFrames, eliminating external dependencies.
- **Local engine execution:** Pipelines run against a local Spark or DuckDB instance, with no cluster or warehouse configuration required.
- **Hot reload:** Code changes are detected automatically. When you save a file, the orchestrator re-parses your pipeline and updates the DAG without restarting the engine.
- **DataFrame caching:** Intermediate DataFrames are cached in memory between executions, so re-running a downstream transform does not re-execute all upstream nodes.

## Writing Dev Sources

A typical dev source provides a small, representative dataset:

```python
@nodes.source(tag="customers", pipeline="analytics", env=["dev"])
def customers_dev(sparkSession):
    data = [
        ("C001", "Acme Corp", "enterprise"),
        ("C002", "StartupCo", "startup"),
        ("C003", "MidRange Ltd", "mid-market"),
    ]
    return sparkSession.createDataFrame(data, ["id", "name", "segment"])
```

This source is only selected when the pipeline runs in the `dev` environment. Production and staging environments will use their own implementation of the `"customers"` tag.

## Fast Iteration Workflow

1. Define your sources with `env=["dev"]` using small, hand-crafted datasets.
2. Write transforms that operate on those DataFrames.
3. Run individual nodes or the full pipeline from the VSCode extension or CLI.
4. Modify your transform logic and re-run -- hot reload picks up changes automatically.
5. Use unit tests to validate transform logic in isolation.

## DataFrame Caching

When you execute a node in dev mode, its output DataFrame is cached. If you then run a downstream node, the cached result is reused rather than re-executing the upstream chain. This is particularly useful when iterating on a transform deep in the DAG, as you avoid repeatedly recomputing upstream nodes.

Caching is automatically invalidated when a node's code changes or when you explicitly request a full re-execution.

---

*Detailed configuration options for the dev environment, including custom Spark configurations and DuckDB settings, are coming soon.*
