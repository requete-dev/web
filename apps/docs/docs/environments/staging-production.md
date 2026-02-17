---
sidebar_position: 4
title: "Staging & Production"
---

# Staging & Production Environments

The `staging` and `prod` environments are where pipelines operate against real data sources and write to actual destinations. These environments prioritize reliability, observability, and minimal overhead.

## Key Characteristics

- **Real data sources:** Sources connect to production databases, data lakes, warehouses, and streaming systems.
- **No hot reload:** Code is executed as deployed. There is no file watching or automatic re-parsing, ensuring deterministic behavior.
- **Source tests in monitor mode:** Source tests run after data is loaded but default to monitor mode -- they log warnings rather than failing the pipeline, preventing transient data quality issues from blocking execution.
- **Minimal overhead:** The orchestrator operates with reduced logging and diagnostics compared to dev mode, focusing on execution throughput.

## Staging vs. Production

While both environments connect to real data, they serve different purposes:

| Aspect | Staging | Production |
|--------|---------|------------|
| **Data sources** | Production replicas or snapshots | Live production data |
| **Sinks** | Staging tables/locations | Production tables/locations |
| **Purpose** | Validate before promotion | Serve business workloads |
| **Test strictness** | Source tests can run in strict mode | Source tests typically in monitor mode |

You can share implementations between staging and prod by listing both in the `env` parameter:

```python
@nodes.source(tag="transactions", pipeline="finance", env=["prod", "staging"])
def transactions_real(sparkSession):
    return sparkSession.read.table("catalog.finance.transactions")
```

Or provide separate implementations when staging needs different connection details:

```python
@nodes.source(tag="transactions", pipeline="finance", env=["staging"])
def transactions_staging(sparkSession):
    return sparkSession.read.table("staging_catalog.finance.transactions")

@nodes.source(tag="transactions", pipeline="finance", env=["prod"])
def transactions_prod(sparkSession):
    return sparkSession.read.table("catalog.finance.transactions")
```

## Production Deployment

In production, pipelines are typically executed via the CLI or an orchestration system (Airflow, Dagster, etc.) rather than the VSCode extension. The Rust orchestrator handles engine lifecycle, execution ordering, and result reporting.

## Monitoring

Source tests in monitor mode provide ongoing data quality signals without blocking execution. Test results are emitted as events that can be consumed by monitoring systems via the SSE or WebSocket interfaces.

---

*Detailed production deployment patterns, monitoring integration, and staging promotion workflows are coming soon.*
