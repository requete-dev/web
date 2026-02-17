---
sidebar_position: 5
title: "Backfill"
---

# Backfill Environment

The `backfill` environment supports historical data reprocessing. It provides a dedicated decorator and parameterization model for running pipelines over specific date ranges or other contextual dimensions.

## Key Characteristics

- **Dedicated decorator:** Backfill sources use `@nodes.backfill_source` instead of `@nodes.source`, receiving a context dictionary with parameters for the current backfill window.
- **Date range parameters:** Backfill runs are parameterized with start and end dates (or other dimensions), passed to the source via the context dict.
- **CLI-driven:** Backfill runs are initiated from the CLI with `--backfill-source` flags that specify the parameters.
- **Idempotent design:** Backfill sources should be written to produce deterministic results for a given parameter set, enabling safe re-runs.

## Writing a Backfill Source

The `@nodes.backfill_source` decorator marks a function as the backfill-specific implementation of a source tag. The function receives a context dictionary containing the backfill parameters:

```python
@nodes.backfill_source(tag="orders", pipeline="sales", env=["backfill"])
def orders_backfill(sparkSession, context):
    start_date = context["start_date"]
    end_date = context["end_date"]
    return (
        sparkSession.read.table("catalog.sales.orders")
        .filter(f"order_date >= '{start_date}' AND order_date < '{end_date}'")
    )
```

When the pipeline runs in the `backfill` environment, this function is selected for the `"orders"` tag instead of the dev or prod implementations.

## Running a Backfill

Backfill parameters are passed via CLI flags:

```bash
requete run --pipeline sales --env backfill \
    --backfill-source orders \
    --param start_date=2024-01-01 \
    --param end_date=2024-02-01
```

The parameters are assembled into the context dictionary that the backfill source function receives.

## Design Considerations

- **Partition alignment:** Design backfill sources to align with your data partitioning scheme so that each backfill run processes complete partitions.
- **Sink idempotency:** Ensure that sinks in backfill mode overwrite or upsert rather than append, preventing duplicate data on re-runs.
- **Downstream consistency:** Transforms downstream of a backfill source operate on the filtered data automatically. No changes to transform logic are needed.

---

*Detailed backfill orchestration patterns, multi-source backfills, and incremental backfill strategies are coming soon.*
