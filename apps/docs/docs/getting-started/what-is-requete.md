---
sidebar_position: 1
title: "What is Requete?"
---

# What is Requete?

Requete is a framework for building, testing, and deploying data pipelines using Python decorators. You define your pipeline logic as decorated Python functions, and Requete handles the rest: parsing your code into a DAG, generating execution scripts, managing compute engines, and providing a rich IDE experience.

```python
from requete import nodes

@nodes.source(tag="raw_orders", depends_on=[])
def read_orders(sparkSession):
    return sparkSession.read.table("bronze.orders")

@nodes.transform(tag="clean_orders", depends_on=["raw_orders"])
def clean_orders(raw_orders_df):
    return raw_orders_df.filter("status IS NOT NULL").dropDuplicates(["order_id"])

@nodes.sink(tag="write_orders", depends_on=["clean_orders"])
def write_orders(clean_orders_df):
    clean_orders_df.write.mode("overwrite").saveAsTable("silver.orders")
```

That is a complete pipeline. No boilerplate orchestration code, no YAML-defined task graphs, no imperative scheduling logic.

## Key Value Propositions

### Decorator-Driven DAGs

Your pipeline structure is defined by decorators and `depends_on` lists. Requete's Rust parser reads your Python source files, extracts the decorated functions, and assembles them into a validated directed acyclic graph. You never write DAG definitions separately from your code.

### Multi-Engine

Write your pipeline logic once and run it on Spark, DuckDB, or Snowflake. Sessions define which engine to use, and your node functions receive the appropriate session object. Switch engines by changing a session decorator, not by rewriting your pipeline.

### Multi-Environment

The same pipeline runs in dev, CI, staging, production, and backfill environments. Nodes and sessions declare which environments they participate in. A source might read from a local file in dev and from S3 in production, both using the same tag.

### Built-In Testing

Four test types are built into the framework: unit tests for isolated function logic, integration tests for end-to-end pipeline runs, source validation tests for data quality gates, and promotion tests for pre-deployment checks. All defined with decorators, all part of the DAG.

### IDE Integration

The Requete VSCode extension provides DAG visualization, CodeLens actions for running individual nodes, real-time diagnostics, and MCP/AI integration. You see your pipeline structure as you write it.

### Zero-Config Python

Requete uses [uv](https://docs.astral.sh/uv/) to manage Python environments automatically. Declare your Python version and dependencies in `requete.yaml`, and Requete handles the rest. No virtual environments to create or activate.

## How It Works

Requete has a layered architecture: a Rust core that handles parsing, DAG construction, and code generation, and a Python engine that executes the generated scripts on your chosen compute engine.

```mermaid
graph LR
    A[VSCode / IDE] -->|LSP| B[Rust Core]
    B -->|Parse & Validate| C[DAG Builder]
    C -->|Generate Scripts| D[Code Generator]
    D -->|gRPC| E[Python Engine]
    E -->|Execute| F[Spark / DuckDB / Snowflake]

    style A fill:#4a90d9,color:#fff
    style B fill:#e8744f,color:#fff
    style E fill:#3776ab,color:#fff
    style F fill:#2d6a4f,color:#fff
```

1. **Parse**: The Rust core reads your Python files and extracts decorated functions, their tags, dependencies, engine types, and environment lists.
2. **Build DAG**: Dependencies are resolved into a directed acyclic graph. Cycles, missing dependencies, and type constraint violations are caught at this stage.
3. **Generate Scripts**: For each node in topological order, Requete generates a Python script that imports your function, injects the correct upstream DataFrames, and calls it.
4. **Execute**: The generated scripts are sent via gRPC to the Python engine, which runs them against your configured compute engine (Spark, DuckDB, or Snowflake).
5. **Report**: Results flow back through gRPC to the Rust core and into the IDE for display.

## Who Is It For?

**Data Engineers** building production DataFrame pipelines. If you work with Spark, DuckDB, or Snowflake and want a framework that keeps your pipeline logic in Python while providing compile-time validation, multi-engine portability, and built-in testing, Requete is for you.

**Data Scientists** who need to productionize their data transformations. Define your logic in familiar Python functions, let Requete handle orchestration and deployment concerns.

**Platform Teams** building internal data platforms. Requete provides a standardized pipeline structure with built-in environment management, testing gates, and IDE tooling that makes it easier to enforce best practices across teams.

## How Requete Compares

Requete occupies a distinct position in the data tooling ecosystem:

| Aspect | Requete | dbt | Dagster / Prefect |
|--------|---------|-----|-------------------|
| **Primary paradigm** | Python decorators on DataFrame functions | SQL models with Jinja templating | Python tasks with general-purpose orchestration |
| **Pipeline definition** | Decorators + `depends_on` | SQL file references | Python API / decorator-based task graphs |
| **Compute engines** | Spark, DuckDB, Snowflake via sessions | Database adapters | Bring your own compute |
| **Environment handling** | Built-in multi-env via decorator params | Target profiles | Environment config / resources |
| **Testing** | Built-in decorator-based test types | Built-in SQL tests | External test frameworks |
| **IDE experience** | Deep VSCode integration with DAG viz | VSCode extension for SQL | General Python IDE support |

Requete is not a general-purpose workflow orchestrator. It is purpose-built for DataFrame pipelines where your logic is Python functions that transform DataFrames. If your workload is SQL-first, dbt is likely a better fit. If you need to orchestrate arbitrary tasks (API calls, file transfers, ML training), a general orchestrator like Dagster or Prefect is more appropriate.

Where Requete excels is the intersection of Python-native DataFrame pipelines with multi-engine portability, compile-time validation, and a first-class IDE experience.
