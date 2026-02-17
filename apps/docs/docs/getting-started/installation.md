---
sidebar_position: 2
title: "Installation"
---

# Installation

This guide walks you through installing Requete and its dependencies.

## Prerequisites

Before installing Requete, ensure you have the following:

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.11+ | Managed automatically by uv |
| uv | Latest | Python package and environment manager |
| Rust toolchain | Latest stable | Required for building from source |
| VSCode | Latest | Recommended for the best development experience |

## Step 1: Install uv

[uv](https://docs.astral.sh/uv/) is a fast Python package and project manager that Requete uses to handle Python environments and dependencies automatically. You do not need to create or manage virtual environments yourself.

**macOS / Linux:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Verify the installation:

```bash
uv --version
```

## Step 2: Install Requete from Source

Requete's core is written in Rust. Clone the repository and build it:

```bash
git clone https://github.com/requete-inc/requete.git
cd requete
cargo build --release
```

The compiled binary will be at `target/release/requete`. Add it to your PATH:

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export PATH="$PATH:/path/to/requete/target/release"
```

Alternatively, install it directly with Cargo:

```bash
cargo install --path requete-core/core
```

## Step 3: Install the VSCode Extension

The Requete VSCode extension provides DAG visualization, CodeLens run actions, real-time diagnostics, and MCP/AI integration.

1. Open VSCode.
2. Go to the Extensions view (`Cmd+Shift+X` on macOS, `Ctrl+Shift+X` on Windows/Linux).
3. Search for **Requete**.
4. Click **Install**.

Alternatively, install from the command line:

```bash
code --install-extension requete.requete-vscode
```

Once installed, the extension activates automatically when it detects a `requete.yaml` file in your workspace.

## Step 4: Verify Installation

Run the following command to confirm everything is set up correctly:

```bash
requete info
```

You should see output similar to:

```
Requete v0.1.0
Rust core: OK
uv: /Users/you/.cargo/bin/uv (0.5.x)
Python: managed by uv
VSCode extension: installed
```

If any component shows an error, check the following:

- **uv not found**: Ensure the uv installation directory is on your PATH. The installer typically adds it to `~/.cargo/bin/`.
- **Rust build failures**: Ensure you have the latest stable Rust toolchain (`rustup update stable`).
- **VSCode extension not detected**: Reload the VSCode window (`Cmd+Shift+P` > "Developer: Reload Window").

## Next Steps

With Requete installed, head to the [Quickstart](./quickstart.md) to build your first pipeline.
