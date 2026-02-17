---
sidebar_position: 4
title: "AI / MCP Integration"
---

# AI / MCP Integration

Requete supports the Model Context Protocol (MCP), enabling AI assistants to interact with your pipelines programmatically. Through MCP, an AI agent can discover pipeline structure, trigger executions, extract schemas, and inspect results.

## What is MCP?

The Model Context Protocol is a standard for connecting AI assistants to external tools and data sources. Requete implements an MCP server that exposes pipeline operations as tools, allowing AI assistants (such as Claude, GitHub Copilot, or other MCP-compatible agents) to work with your data pipelines.

## Available MCP Tools

The Requete MCP server exposes operations including:

- **Pipeline discovery:** List available pipelines and their nodes.
- **DAG inspection:** Retrieve the dependency graph, node types, and metadata.
- **Execution:** Run individual nodes or full pipelines.
- **Schema extraction:** Extract output schemas from nodes.
- **Test execution:** Run tests and retrieve results.
- **Status queries:** Check the current state of the orchestrator and running executions.

## Automatic Registration

When the Requete VSCode extension is active, it automatically registers an MCP server for each orchestrator instance. AI assistants running in the same VSCode window can discover and use Requete tools without manual configuration.

Each VSCode window gets its own MCP server instance, scoped to the pipelines in that workspace.

## Use Cases

- **AI-assisted pipeline development:** An AI assistant can inspect your pipeline structure, suggest improvements, and validate changes by running tests.
- **Natural language execution:** Ask an AI assistant to "run the sales pipeline in dev mode" and it translates that to the appropriate MCP tool call.
- **Schema-aware code generation:** AI assistants can extract schemas from existing nodes and use them to generate downstream transforms with correct column references.
- **Automated debugging:** When a node fails, an AI assistant can inspect the error, examine upstream outputs, and suggest fixes.

## Protocol Details

The MCP server communicates via the standard MCP transport protocol. It is started alongside the HTTP and LSP servers in the Rust orchestrator, sharing the same event bus for real-time updates.

---

*Detailed MCP tool reference, custom tool registration, and integration examples with specific AI assistants are coming soon.*
