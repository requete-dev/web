---
sidebar_position: 4
title: "API Reference"
---

# API Reference

The Requete orchestrator exposes HTTP, WebSocket, and MCP endpoints for programmatic interaction with pipelines. These APIs are used by the VSCode extension, the DAG visualization, and external tooling.

## HTTP Endpoints

The orchestrator runs an HTTP server that provides RESTful endpoints for pipeline management and execution.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pipelines` | List all discovered pipelines |
| `GET` | `/api/pipelines/:name` | Get pipeline details and DAG structure |
| `GET` | `/api/pipelines/:name/nodes` | List all nodes in a pipeline |
| `GET` | `/api/pipelines/:name/nodes/:tag` | Get details for a specific node |
| `POST` | `/api/pipelines/:name/execute` | Execute a pipeline or specific nodes |
| `POST` | `/api/pipelines/:name/test` | Run tests for a pipeline or specific nodes |
| `POST` | `/api/pipelines/:name/extract-schema` | Extract schemas from node outputs |
| `GET` | `/api/pipelines/:name/status` | Get current execution status |
| `GET` | `/api/health` | Health check endpoint |

### Request and Response Format

All endpoints accept and return JSON. Execution endpoints return immediately with a run ID; results are delivered asynchronously via WebSocket or SSE.

## WebSocket Protocol

The orchestrator provides a WebSocket endpoint for real-time event streaming.

```
ws://localhost:<port>/ws
```

### Event Types

Events are sent as JSON messages with a `type` field:

| Event Type | Description |
|------------|-------------|
| `node_started` | A node has begun execution |
| `node_completed` | A node has finished execution successfully |
| `node_failed` | A node has failed with an error |
| `test_passed` | A test has passed |
| `test_failed` | A test has failed |
| `pipeline_completed` | Full pipeline execution is complete |
| `dag_updated` | The DAG structure has changed (e.g., after a code edit) |
| `schema_extracted` | A node's output schema has been captured |

### Server-Sent Events (SSE)

An SSE endpoint is also available for clients that prefer a unidirectional event stream:

```
GET /api/events
```

The same event types are delivered via SSE as via WebSocket.

## MCP Endpoints

The Model Context Protocol server exposes pipeline tools for AI assistants. See the [AI / MCP Integration](/docs/ide/mcp-ai-integration) page for details on available MCP tools.

## Port Discovery

The orchestrator selects an available port on startup and writes it to a discovery file. The VSCode extension and other clients read this file to locate the running orchestrator. This enables multiple orchestrator instances (one per workspace) to coexist without port conflicts.

---

*Detailed request/response schemas, authentication options, error codes, and rate limiting documentation are coming soon.*
