---
sidebar_position: 1
title: "Project Structure"
---

# Project Structure

Requete uses a convention-based project structure where each pipeline lives in its own directory. This page covers the layout conventions, how files are organized, and how Requete discovers your pipeline code.

## Directory Layout

Every Requete project follows a standard structure rooted in a `requete_pipelines/` directory. Each pipeline gets its own subdirectory, and within that directory you organize code by node type.

```
requete_pipelines/
  simple/
    requete.yaml
    sessions/
      spark_session.py
      duckdb_session.py
    sources/
      read_table_1.py
      read_table_2.py
    transforms/
      join_tables.py
      group_by.py
    sinks/
      write.py
    promotes/
      promote.py
    tests/
      test_join.py
      test_sources.py
  ecommerce_analytics/
    requete.yaml
    sessions/
      ...
    sources/
      ...
    transforms/
      ...
    sinks/
      ...
```

## One Pipeline Per Folder

Each subdirectory under `requete_pipelines/` represents a single pipeline. The directory name is for organizational purposes only -- the pipeline identity is determined by the `pipeline` field in `requete.yaml` and the `pipeline` parameter in your decorators.

```
requete_pipelines/
  simple/           # Contains the "simple" pipeline
    requete.yaml    # pipeline: simple
  analytics/        # Contains the "analytics" pipeline
    requete.yaml    # pipeline: analytics
```

## Subdirectories by Node Type

Within each pipeline directory, code is organized into subdirectories based on the type of node:

| Directory     | Purpose                                      | Decorator                    |
|---------------|----------------------------------------------|------------------------------|
| `sessions/`   | Compute session definitions                  | `@sessions.session`          |
| `sources/`    | Data entry points                            | `@nodes.source`, `@nodes.backfill_source` |
| `transforms/` | Business logic and data transformations      | `@nodes.transform`           |
| `sinks/`      | Data write operations                        | `@nodes.sink`                |
| `promotes/`   | Quality-gated write operations               | `@nodes.promote`             |
| `tests/`      | Unit, integration, source, and promotion tests | `@tests.unit`, `@tests.integration`, `@tests.source`, `@tests.promotion` |

This convention keeps pipeline code organized and makes it straightforward for teams to locate specific logic. You can place multiple decorated functions in a single file or split them across multiple files within the same subdirectory.

## The `requete.yaml` File

Every pipeline directory must contain a `requete.yaml` file at its root. This file declares the pipeline name, Python version, and dependencies. See [Pipeline Configuration](./configuration.md) for full details.

```
requete_pipelines/
  simple/
    requete.yaml    # Required
    sessions/
      ...
```

## File Discovery

Requete discovers pipeline code by walking the directory tree under `requete_pipelines/`. The discovery process works as follows:

1. **Walk the directory tree.** Requete recursively traverses each pipeline directory, scanning for Python files containing decorated functions.

2. **Parse decorators.** Each `.py` file is inspected for Requete decorators (`@sessions.session`, `@nodes.source`, `@nodes.transform`, etc.). The decorator metadata -- tag, pipeline, env, depends_on -- is extracted to build the pipeline DAG.

3. **Skip irrelevant directories.** Certain directories are automatically skipped during discovery:
   - `__pycache__/` directories
   - `.venv/` and virtual environment directories
   - Hidden directories (prefixed with `.`)
   - `node_modules/` and other non-Python artifacts

4. **Match pipeline identity.** Discovered nodes are associated with their pipeline based on the `pipeline` parameter in each decorator, which must match the `pipeline` field in the corresponding `requete.yaml`.

## Naming Conventions

While Requete does not enforce strict file naming rules, the following conventions help maintain clarity:

- **File names** should reflect the tag of the node they define. A source with `tag="read_table_1"` lives naturally in `sources/read_table_1.py`.
- **Function names** can be anything, but descriptive names improve readability. For environment-specific implementations, suffixing with the environment (e.g., `read_table_1_dev`, `read_table_1_prod`) is a common pattern.
- **One tag per file** is recommended for clarity, though multiple tags in a single file are supported.

## Example: Complete Pipeline Layout

```
requete_pipelines/
  simple/
    requete.yaml
    sessions/
      spark_session.py       # @sessions.session(tag="spark_dev_session", ...)
      duckdb_session.py      # @sessions.session(tag="duckdb_dev_session", ...)
    sources/
      read_table_1.py        # @nodes.source(tag="read_table_1", env=["dev", "ci"])
                              # @nodes.source(tag="read_table_1", env=["staging", "prod"])
      read_table_2.py        # @nodes.source(tag="read_table_2", ...)
    transforms/
      join_tables.py         # @nodes.transform(tag="join_tables", depends_on=["read_table_1", "read_table_2"])
      group_by.py            # @nodes.transform(tag="group_by", depends_on=["join_tables"])
    sinks/
      write.py               # @nodes.sink(tag="write", env=["dev"])
    promotes/
      promote.py             # @nodes.promote(tag="promote", env=["dev"])
    tests/
      test_join.py           # @tests.unit(tag="join_tables")
      test_sources.py        # @tests.source(tag="read_table_1", env=["dev"])
```

This structure scales cleanly from simple single-engine pipelines to complex multi-engine, multi-environment data platforms.
