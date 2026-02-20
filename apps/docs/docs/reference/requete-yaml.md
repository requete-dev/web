---
sidebar_position: 3
title: "requete.yaml Reference"
---

# requete.yaml Reference

The `requete.yaml` file defines a pipeline and its configuration. It is the entry point for pipeline discovery -- the Requete orchestrator scans your workspace for these files to identify and configure pipelines.

## File Location

Place `requete.yaml` in the root directory of each pipeline. The file's location determines the pipeline's scope: all Python files in the same directory and its subdirectories are considered part of that pipeline.

```
project/
  sales/
    requete.yaml        # Defines the "sales" pipeline
    sources.py
    transforms.py
    tests.py
  analytics/
    requete.yaml        # Defines the "analytics" pipeline
    pipeline.py
```

## Schema

```yaml
# Required: The pipeline name. Must be unique across the workspace.
pipeline: sales

# Optional: Python version for the engine virtual environment.
# Default: "3.11"
python_version: "3.12"

# Optional: List of pip package dependencies for this pipeline.
dependencies:
  - pyspark==3.5.1
  - pandas>=2.0
  - requests

# Optional: Environment variables passed to engine runtimes.
# common: set for all engines; engine-specific keys merge on top.
env:
  common:
    TMPDIR: "/tmp/requete/python-workdir"
  spark:
    JAVA_HOME: "/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home"
```

## Fields

### pipeline

**Required.** A string that uniquely identifies this pipeline within the workspace. This name is used in decorator parameters, CLI commands, and the VSCode extension.

```yaml
pipeline: sales
```

The pipeline name must match the `pipeline` parameter in your decorators:

```python
@nodes.source(tag="orders", pipeline="sales", env=["dev"])
```

### python_version

**Optional.** Specifies the Python version for the engine's virtual environment. Defaults to `"3.11"` if not specified.

```yaml
python_version: "3.12"
```

The engine is spawned using `uv`, which manages the virtual environment with the specified Python version.

### dependencies

**Optional.** A list of pip package specifiers that the pipeline requires. These are installed in the engine's virtual environment when the pipeline is started.

```yaml
dependencies:
  - pyspark==3.5.1
  - pandas>=2.0
  - numpy
  - requests~=2.31
```

Standard pip version specifiers are supported: `==`, `>=`, `<=`, `~=`, `!=`, etc.

### env

**Optional.** Environment variables passed to engine runtimes. This is a nested mapping with two levels:

- **`common`** — Variables set for every engine in this pipeline.
- **Engine-specific keys** (`spark`, `duckdb`, etc.) — Variables that apply only when that engine is spawned. These merge on top of `common`; if a key appears in both, the engine-specific value wins.

```yaml
env:
  common:
    TMPDIR: "/tmp/requete/python-workdir"

  spark:
    JAVA_HOME: "/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home"
    SPARK_LOCAL_DIRS: "/tmp/requete/spark"

  duckdb:
    DUCKDB_TMPDIR: "/tmp/requete/duckdb"
```

The most important use case is **`JAVA_HOME`** — Spark requires a JDK, and this tells the engine which installation to use. Without it, the Spark engine may fail to start or pick up an unexpected Java version.

## Complete Example

```yaml
pipeline: customer_analytics
python_version: "3.12"
dependencies:
  - pyspark==3.5.1
  - pandas>=2.1
  - scikit-learn>=1.3
  - pyarrow>=14.0

env:
  common:
    TMPDIR: "/tmp/requete/python-workdir"
  spark:
    JAVA_HOME: "/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home"
    SPARK_LOCAL_DIRS: "/tmp/requete/spark"
```

## Discovery

The Requete orchestrator discovers `requete.yaml` files by walking the workspace directory tree. Each file found defines a separate pipeline with its own engine instance, virtual environment, and dependency set.

---

*Advanced configuration options, environment-specific overrides, and multi-file pipeline layouts are coming soon.*
