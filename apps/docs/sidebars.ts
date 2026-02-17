import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/what-is-requete",
        "getting-started/installation",
        "getting-started/quickstart",
        "getting-started/core-concepts",
      ],
    },
    {
      type: "category",
      label: "Pipelines",
      items: [
        "pipelines/project-structure",
        "pipelines/configuration",
        "pipelines/sessions",
        "pipelines/sources",
        "pipelines/transforms",
        "pipelines/sinks",
        "pipelines/promotes",
        "pipelines/backfill-sources",
      ],
    },
    {
      type: "category",
      label: "Environments",
      items: [
        "environments/overview",
        "environments/development",
        "environments/ci-cd",
        "environments/staging-production",
        "environments/backfill",
      ],
    },
    {
      type: "category",
      label: "Testing",
      items: [
        "testing/overview",
        "testing/unit-tests",
        "testing/integration-tests",
        "testing/source-tests",
        "testing/promotion-tests",
      ],
    },
    {
      type: "category",
      label: "IDE & Tooling",
      items: [
        "ide/vscode-extension",
        "ide/dag-visualization",
        "ide/diagnostics-codelens",
        "ide/mcp-ai-integration",
      ],
    },
    {
      type: "category",
      label: "LSP Validation Rules",
      items: [
        "lsp-rules/index",
        "lsp-rules/tag-identity",
        "lsp-rules/dependency-graph",
        "lsp-rules/environment-coverage",
        "lsp-rules/node-type-constraints",
        "lsp-rules/cross-engine-consistency",
        "lsp-rules/engine-configuration",
        "lsp-rules/decorator-arguments",
        "lsp-rules/function-signatures",
        "lsp-rules/test-validation",
        "lsp-rules/pipeline-configuration",
      ],
    },
    {
      type: "category",
      label: "Reference",
      items: [
        "reference/decorators",
        "reference/cli",
        "reference/requete-yaml",
        "reference/api",
      ],
    },
  ],
};

export default sidebars;
