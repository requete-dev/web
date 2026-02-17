import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GITHUB_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pt-16 pb-24">
      <Container>
        <div className="max-w-3xl mx-auto pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            About Requete
          </h1>

          <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
            <p>
              We built Requete because defining data pipelines shouldn&apos;t
              require a PhD in YAML. Data engineers spend too much time
              wrestling with orchestration configs, environment management, and
              testing infrastructure instead of building the transformations
              that matter.
            </p>
            <p>
              Requete is a framework that lets you define your entire pipeline —
              sources, transforms, sinks, tests, and environments — with Python
              decorators. A Rust orchestrator handles the heavy lifting: parsing
              your code, building the DAG, generating execution scripts, and
              communicating with the Python engine over gRPC.
            </p>
            <p>
              The result is a developer experience where you write Python, and
              everything else — dependency resolution, environment switching,
              test execution, IDE integration — just works.
            </p>
          </div>

          <div className="mt-12 p-8 rounded-xl border border-gray-700/30 bg-surface-800/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              Our principles
            </h2>
            <ul className="space-y-4">
              {[
                {
                  title: "Python-first",
                  desc: "Your pipeline logic lives in Python. No separate config language to learn.",
                },
                {
                  title: "Convention over configuration",
                  desc: "Sensible defaults that work out of the box. Override when you need to.",
                },
                {
                  title: "Testing is not optional",
                  desc: "Quality gates are first-class pipeline citizens, not afterthoughts.",
                },
                {
                  title: "Fast feedback loops",
                  desc: "Hot reload, instant diagnostics, and sub-second DAG rebuilds.",
                },
              ].map((principle) => (
                <li key={principle.title}>
                  <strong className="text-white">{principle.title}:</strong>{" "}
                  <span className="text-gray-400">{principle.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Requete is open source and community-driven.
            </p>
            <Button href={GITHUB_URL} variant="outline" size="lg" external>
              View on GitHub
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
