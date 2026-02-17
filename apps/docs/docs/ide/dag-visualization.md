---
sidebar_position: 2
title: "DAG Visualization"
---

# DAG Visualization

Requete provides an interactive DAG (Directed Acyclic Graph) visualization that displays your pipeline's structure, node relationships, and execution status. The DAG view is available as a panel within VSCode or as a standalone browser application.

## What the DAG Shows

- **Nodes:** Each node in the pipeline (sources, transforms, sinks, promotes) is rendered as a visual element with its tag, type, and current status.
- **Edges:** Dependencies between nodes are displayed as directed edges, showing the data flow from sources through transforms to sinks and promotes.
- **Execution Status:** Nodes are color-coded to reflect their current state: idle, running, completed, failed, or skipped.
- **Schemas:** When available, node schemas are displayed on hover or selection, showing column names and types.

## Technology

The DAG visualization is built with:

- **Svelte** for the UI framework
- **Svelte Flow** for the node-and-edge graph rendering
- **ELK (Eclipse Layout Kernel)** for automatic graph layout, producing clean, readable layouts even for complex pipelines

## VSCode Integration

In VSCode, the DAG panel opens as a webview alongside your editor. It updates in real time as you:

- Add or remove nodes from your pipeline code
- Execute nodes (status indicators update live)
- Modify dependencies between nodes

The DAG panel communicates with the orchestrator via WebSocket, receiving event updates as they occur.

## Standalone Browser View

The DAG visualization is also accessible in a standalone browser at the orchestrator's HTTP endpoint. This is useful for monitoring pipeline execution on remote machines or sharing pipeline views with team members who are not using VSCode.

## Interaction

- **Click** a node to select it and view its details (schema, test results, execution logs).
- **Pan and zoom** to navigate large pipelines.
- **Layout** is computed automatically but nodes can be repositioned manually.

---

*Detailed DAG interaction patterns, custom node styling, and embedding options are coming soon.*
