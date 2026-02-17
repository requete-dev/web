---
sidebar_position: 1
title: "Multi-Environment Overview"
---

# Multi-Environment Overview

Requete pipelines are designed to run across multiple environments without changing your core business logic. The same pipeline tag can have different implementations depending on the environment, allowing you to swap data sources, sinks, and behaviors while keeping transforms and tests consistent.

## Supported Environments

Requete recognizes five standard environments:

| Environment | Purpose | Typical Usage |
|-------------|---------|---------------|
| **dev** | Local development | In-memory test data, fast iteration, hot reload |
| **ci** | Continuous integration | Automated test execution, validation, structured output |
| **staging** | Pre-production validation | Real data sources, production-like configuration |
| **prod** | Production execution | Full data volumes, monitored execution |
| **backfill** | Historical data processing | Date-range parameterized runs, idempotent reprocessing |

## How Environment Filtering Works

Each decorator that supports environment-specific behavior accepts an `env` parameter:

- **Empty `env` (default):** The node runs in all environments. This is the standard behavior for transforms and most tests.
- **Specific `env` list:** The node runs only in the listed environments. This is how you provide different source implementations for dev vs. prod.

```python
# This source only runs in the dev environment
@nodes.source(tag="orders", pipeline="sales", env=["dev"])
def orders_dev(sparkSession):
    return sparkSession.createDataFrame([...])

# This source only runs in prod and staging
@nodes.source(tag="orders", pipeline="sales", env=["prod", "staging"])
def orders_prod(sparkSession):
    return sparkSession.read.table("catalog.sales.orders")
```

Both functions share the same tag `"orders"`. When the pipeline runs in `dev`, the first implementation is used. When it runs in `prod` or `staging`, the second is selected. Transforms downstream of `"orders"` remain identical regardless of environment.

## Environment Selection

The active environment is determined at execution time, either through the CLI, the VSCode extension, or the HTTP API. Only nodes matching the current environment (or nodes with no environment restriction) are included in the execution DAG.

## Key Principles

- **Tag identity:** The same tag in different environments represents the same logical data. Downstream nodes do not need to know which environment-specific implementation produced the data.
- **Transform neutrality:** Transforms typically have no `env` parameter. They operate on DataFrames regardless of where the data originated.
- **Test scoping:** Tests can be scoped to specific environments, allowing you to run heavier validation only in CI or skip certain checks in dev.

---

*Detailed configuration examples and advanced multi-environment patterns are coming soon.*
