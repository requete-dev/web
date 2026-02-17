---
sidebar_position: 1
title: "VSCode Extension"
---

# VSCode Extension

The Requete VSCode extension provides a fully integrated development experience for building and testing data pipelines. It connects to the Rust orchestrator running in the background, offering real-time feedback, inline controls, and visual pipeline exploration.

## Features

- **LSP Integration:** Real-time diagnostics, hover documentation, autocompletion for decorator parameters, and go-to-definition for pipeline tags and dependencies.
- **CodeLens:** Inline Run, Test, and Extract Schema buttons appear above each decorated node, allowing single-click execution without leaving the editor.
- **DAG Panel:** An interactive visualization of your pipeline's dependency graph, showing node types, execution status, and data flow.
- **Auto-Discovery:** The extension automatically discovers pipelines from `requete.yaml` files in your workspace and starts the orchestrator.

## Installation

The extension is available from the VSCode Marketplace:

1. Open VSCode and navigate to the Extensions panel.
2. Search for "Requete".
3. Click Install.

The extension requires the Requete CLI to be installed and available on your PATH.

## Setup

On activation, the extension:

1. Discovers `requete.yaml` files in the workspace.
2. Starts a Requete orchestrator process for each pipeline (one process per VSCode window).
3. Connects via LSP for editor features and HTTP/WebSocket for execution and events.

The extension manages the orchestrator lifecycle automatically. When you close the VSCode window, the orchestrator process is terminated.

## Workflow

1. Open a workspace containing `requete.yaml` and your pipeline Python files.
2. The extension activates, parses your pipeline, and shows diagnostics inline.
3. Use CodeLens buttons to run individual nodes or the full pipeline.
4. Open the DAG panel to visualize dependencies and execution progress.
5. Edit your code -- hot reload updates the pipeline automatically.

## Configuration

Extension settings are available under `requete.*` in VSCode settings. These include engine configuration, environment selection, and logging verbosity.

---

*Detailed configuration reference, troubleshooting guide, and advanced extension features are coming soon.*
