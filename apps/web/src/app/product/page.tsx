import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { QUICKSTART_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Product",
};

const capabilities = [
  {
    title: "Decorator-Driven DAGs",
    description:
      "Define your pipeline graph with @nodes decorators. No separate config files, no YAML.",
  },
  {
    title: "Multi-Engine Runtime",
    description:
      "Swap between Spark, DuckDB, and Snowflake per environment without changing pipeline code.",
  },
  {
    title: "Built-in Testing",
    description:
      "Unit tests, integration tests, source validation, and promotion gates as first-class concepts.",
  },
  {
    title: "Multi-Environment",
    description:
      "Dev, staging, production, CI, and backfill environments coexist in a single codebase.",
  },
  {
    title: "Rust Orchestrator",
    description:
      "Fast parsing, DAG building, and code generation powered by a native Rust binary.",
  },
  {
    title: "IDE Integration",
    description:
      "VSCode extension with DAG visualization, CodeLens, diagnostics, and MCP AI support.",
  },
  {
    title: "Zero-Config Python",
    description:
      "Dependencies resolved on-the-fly via uv from your requete.yaml. No venv management.",
  },
  {
    title: "gRPC Communication",
    description:
      "Rust orchestrator and Python engine communicate over a type-safe gRPC protocol.",
  },
];

export default function ProductPage() {
  return (
    <div className="pt-16 pb-24">
      <Container>
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            The complete platform for data pipelines
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything data engineers need to build, test, and deploy
            production-grade data pipelines.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="rounded-xl border border-gray-700/30 bg-surface-800/30 p-6 hover:border-primary-500/20 hover:bg-surface-800/50 transition-all duration-300"
            >
              <h3 className="font-semibold text-white mb-2">{cap.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button href={QUICKSTART_URL} size="lg" external>
            Get Started
          </Button>
        </div>
      </Container>
    </div>
  );
}
