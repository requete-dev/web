---
sidebar_position: 3
title: "Diagnostics & CodeLens"
---

# Diagnostics & CodeLens

Requete's VSCode extension provides real-time diagnostics and inline CodeLens actions that give you immediate feedback on pipeline correctness and one-click access to common operations.

## Diagnostics

The extension continuously analyzes your pipeline code and surfaces issues as standard VSCode diagnostics (errors, warnings, and information messages in the Problems panel and inline squiggles).

### What is Validated

- **Decorator parameters:** Invalid or missing parameters on `@nodes.*`, `@tests.*`, and `@sessions.*` decorators are flagged immediately.
- **Dependency resolution:** References in `depends_on` are checked against known node tags. Missing or misspelled dependencies produce errors.
- **Tag uniqueness:** Duplicate tags within the same pipeline and environment are flagged.
- **Type constraints:** Engine-specific constraints (e.g., a Spark session parameter where DuckDB is configured) are validated.
- **Environment consistency:** Warnings are raised when a source tag has no implementation for certain environments, leaving gaps in coverage.

### Real-Time Updates

Diagnostics update as you type. The Rust orchestrator re-parses your pipeline on every file save (and on debounced keystrokes for supported operations), so issues are surfaced within moments of introducing them.

## CodeLens

CodeLens actions appear as clickable text above each decorated function in your editor. They provide shortcuts for the most common pipeline operations.

### Available Actions

| CodeLens | Appears On | Action |
|----------|-----------|--------|
| **Run** | Source, transform, sink, promote nodes | Executes the node and its upstream dependencies |
| **Test** | Nodes with associated tests | Runs the tests for this node |
| **Extract Schema** | Source and transform nodes | Executes the node and extracts its output schema |

### Example

Above a transform function, you might see:

```
Run | Test | Extract Schema
@nodes.transform(tag="revenue_summary", pipeline="sales", depends_on=["orders"])
def revenue_summary(orders_df):
    ...
```

Clicking "Run" triggers execution of `revenue_summary` and all of its upstream dependencies. Clicking "Test" runs any unit or integration tests associated with the `revenue_summary` tag.

### Execution Feedback

When a CodeLens action is triggered, the DAG panel updates to show execution progress, and results (including test outcomes) are displayed in the VSCode output panel and as diagnostics.

---

*Detailed configuration for diagnostic severity levels, custom CodeLens actions, and keyboard shortcut mappings are coming soon.*
