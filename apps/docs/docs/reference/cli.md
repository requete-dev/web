---
sidebar_position: 2
title: "CLI Reference"
---

# CLI Reference

The Requete CLI (`requete`) is the primary interface for running, validating, and inspecting pipelines outside of the VSCode extension. It manages the Rust orchestrator and Python engine lifecycle.

## Commands

### server

Starts the Requete orchestrator server, which manages pipeline parsing, execution, and communication.

```bash
requete server [OPTIONS]
```

This is the primary command used by the VSCode extension and for long-running deployments. The server exposes HTTP, WebSocket, LSP, and MCP endpoints.

### parse

Parses pipeline files and outputs the resulting DAG structure without executing anything.

```bash
requete parse --pipeline <PIPELINE>
```

Useful for validating that your pipeline files are syntactically correct and that all decorators are properly formed.

### validate

Validates pipeline structure, including dependency resolution, tag uniqueness, and environment coverage.

```bash
requete validate --pipeline <PIPELINE>
```

Performs deeper analysis than `parse`, checking that all `depends_on` references resolve, that tags are unique within their scope, and that environment coverage is complete.

### validate-ci

Runs the full CI validation suite: parsing, validation, execution, and all tests.

```bash
requete validate-ci [--pipeline <PIPELINE>]
```

Designed for CI pipelines. Discovers all pipelines (or a specific one), starts the engine, executes the pipeline in the `ci` environment, runs all tests, and exits with a non-zero code on failure.

### generate

Generates execution scripts from the pipeline DAG without running them.

```bash
requete generate --pipeline <PIPELINE> --env <ENV>
```

Outputs the generated Python scripts that would be sent to the engine for execution. Useful for debugging code generation issues or reviewing what the engine will actually execute.

### extract-schemas

Executes nodes and extracts their output DataFrame schemas.

```bash
requete extract-schemas --pipeline <PIPELINE> [--node <TAG>]
```

Runs the specified nodes (or all nodes) and captures the schema (column names and types) of each output DataFrame.

### which-pipeline

Identifies which pipeline a given Python file belongs to.

```bash
requete which-pipeline --file <PATH>
```

Returns the pipeline name associated with the file based on `requete.yaml` discovery and file location.

### info

Displays information about the Requete installation, including version, discovered pipelines, and engine configuration.

```bash
requete info
```

## Global Options

| Option | Description |
|--------|-------------|
| `--pipeline <NAME>` | Target a specific pipeline by name |
| `--env <ENV>` | Set the execution environment |
| `--config <PATH>` | Path to a specific `requete.yaml` file |
| `--verbose` | Enable verbose logging output |
| `--quiet` | Suppress non-error output |

---

*Detailed option reference for each command, environment variable configuration, and exit code documentation are coming soon.*
