"use client";

import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ARCHITECTURE_LAYERS } from "@/lib/constants";

function ArchLayer({
  layer,
  index,
}: {
  layer: (typeof ARCHITECTURE_LAYERS)[number];
  index: number;
}) {
  const isPrimary = "primary" in layer && layer.primary;

  return (
    <ScrollReveal delay={index * 150}>
      <div
        className={`rounded-xl border p-6 ${
          isPrimary
            ? "border-primary-500/40 bg-primary-600/5 shadow-lg shadow-primary-600/5"
            : "border-gray-700/40 bg-surface-800/50"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
              isPrimary
                ? "bg-primary-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {index + 1}
          </div>
          <h3 className="text-lg font-semibold text-white">{layer.label}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {layer.items.map((item) => (
            <span
              key={item}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                isPrimary
                  ? "bg-primary-600/10 text-primary-300 border border-primary-500/20"
                  : "bg-gray-800/80 text-gray-400 border border-gray-700/30"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

function ProtocolArrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex flex-col items-center gap-1">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        <span className="text-xs text-gray-500 font-mono">{label}</span>
      </div>
    </div>
  );
}

export function ArchitectureSection() {
  return (
    <section className="py-24 border-t border-gray-800/30">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A Rust orchestrator parses your Python, builds the DAG, generates
              execution scripts, and sends them to a Python engine via gRPC.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto space-y-0">
          {ARCHITECTURE_LAYERS.map((layer, i) => (
            <div key={layer.label}>
              <ArchLayer layer={layer} index={i} />
              {"protocol" in layer && layer.protocol && (
                <ProtocolArrow label={layer.protocol} />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
