---
sidebar_position: 2
title: "Pipeline Configuration"
---

# Pipeline Configuration

Every Requete pipeline is configured through a `requete.yaml` file placed at the root of the pipeline directory. This file tells Requete how to set up the execution environment for your pipeline.

## The `requete.yaml` File

Here is a complete example:

```yaml
pipeline: simple
python_version: "3.11"
dependencies:
  - pyspark==3.5.0
  - duckdb>=1.1.0
  - requete>=0.1.0

env:
  common:
    TMPDIR: "/tmp/requete/python-workdir"

  spark:
    JAVA_HOME: "/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home"
    SPARK_LOCAL_DIRS: "/tmp/requete/spark"

  duckdb:
    DUCKDB_TMPDIR: "/tmp/requete/duckdb"
```

## Configuration Fields

### `pipeline`

**Required.** The unique name of the pipeline. This must match the `pipeline` parameter used in all decorators within this pipeline.

```yaml
pipeline: ecommerce_analytics
```

The pipeline name is used to:
- Associate decorated functions with this pipeline during discovery.
- Identify the pipeline in CLI commands and the web UI.
- Namespace execution state and logs.

### `python_version`

**Required.** The Python version to use when spawning the engine process.

```yaml
python_version: "3.11"
```

Requete uses this value to ensure the engine runs with the correct Python interpreter. The version string should match a Python version available on your system.

### `dependencies`

**Required.** A list of Python package dependencies needed by this pipeline.

```yaml
dependencies:
  - pyspark==3.5.0
  - duckdb>=1.1.0
  - pandas>=2.0
  - requests==2.31.0
```

Dependencies follow standard pip version specifier syntax:
- Exact pins: `pyspark==3.5.0`
- Minimum versions: `duckdb>=1.1.0`
- Compatible releases: `pandas~=2.0`
- No constraint: `requests`

### `env`

**Optional.** Environment variables passed to engine runtimes. The `env` block has a layered structure: variables under `common` are set for all engines, and engine-specific keys merge on top.

```yaml
env:
  common:
    TMPDIR: "/tmp/requete/python-workdir"

  spark:
    JAVA_HOME: "/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home"
    SPARK_LOCAL_DIRS: "/tmp/requete/spark"
    PYSPARK_SUBMIT_ARGS: >-
      --conf spark.local.dir=/tmp/requete/spark
      --conf spark.sql.warehouse.dir=/tmp/requete/spark/warehouse
      pyspark-shell

  duckdb:
    DUCKDB_TMPDIR: "/tmp/requete/duckdb"
```

The most important use case is **`JAVA_HOME`** — Spark requires a JDK, and this is how you point the engine at the correct installation on your machine. Without it, the Spark engine may fail to start or pick up an unexpected Java version.

Other common uses include configuring temp/scratch directories for engines and passing Spark submit arguments via `PYSPARK_SUBMIT_ARGS`.

When the engine process is spawned, Requete merges `common` with the engine-specific section. For example, a Spark engine would see both `TMPDIR` (from `common`) and `JAVA_HOME` (from `spark`). Engine-specific values take precedence if a key appears in both `common` and the engine section.

## How Configuration Drives Engine Spawning

When Requete executes a pipeline, it spawns an isolated Python engine process using [uv](https://github.com/astral-sh/uv). The `requete.yaml` fields map directly to the spawning command:

```
uv tool run --from <engine-package> --with <dependencies> --python <python_version> requete-engine
```

For example, given this configuration:

```yaml
pipeline: simple
python_version: "3.11"
dependencies:
  - pyspark==3.5.0
  - duckdb>=1.1.0
```

Requete constructs a command equivalent to:

```
uv tool run --from requete-engine --with pyspark==3.5.0 --with duckdb>=1.1.0 --python 3.11 requete-engine
```

Environment variables from the `env` section are also passed to the spawned process. Requete merges the `common` block with the engine-specific block (e.g., `spark`) so the engine receives the full set of variables.

This means:
- **Each pipeline gets its own isolated environment.** Dependencies for one pipeline never conflict with another.
- **No manual virtual environment management.** `uv` handles environment creation and caching automatically.
- **Reproducible execution.** Pinning dependency versions in `requete.yaml` ensures consistent behavior across runs and environments.

## Relationship to `pyproject.toml`

Your project may also have a `pyproject.toml` at the repository root for local development tooling (linters, type checkers, IDE support). This file serves a different purpose from `requete.yaml`:

| Concern               | `requete.yaml`                        | `pyproject.toml`                     |
|-----------------------|---------------------------------------|--------------------------------------|
| Scope                 | Single pipeline                       | Entire project                       |
| Used by               | Requete engine spawner                | Development tools (pyright, ruff, etc.) |
| Dependencies          | Runtime pipeline dependencies         | Development dependencies             |
| Python version        | Engine execution version              | Type checker / linter target version |

During development, you typically install your pipeline dependencies in a local virtual environment referenced by `pyproject.toml` so that your IDE provides autocompletion and type checking. At execution time, Requete reads `requete.yaml` to create the actual runtime environment.

## Multiple Pipelines

Each pipeline directory has its own `requete.yaml`, allowing different pipelines to use different Python versions and dependency sets:

```
requete_pipelines/
  spark_pipeline/
    requete.yaml        # python_version: "3.11", dependencies: [pyspark==3.5.0]
  duckdb_pipeline/
    requete.yaml        # python_version: "3.12", dependencies: [duckdb>=1.1.0]
  snowflake_pipeline/
    requete.yaml        # python_version: "3.11", dependencies: [snowflake-connector-python]
```

This per-pipeline isolation is a core design principle: each pipeline declares exactly what it needs, and Requete provisions the environment accordingly.

## Configuration Changes and Engine Restarts

When you modify `requete.yaml`, Requete detects the configuration change and restarts the engine process with the updated settings. This applies to changes in:

- Python version
- Added, removed, or updated dependencies
- Pipeline name changes
- Environment variable changes

You do not need to manually restart the engine after editing `requete.yaml`.
