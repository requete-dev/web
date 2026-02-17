"use client";

import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const features = [
  {
    title: "DAG Visualization",
    description:
      "Interactive pipeline graph rendered in the editor. See dependencies, execution order, and node status at a glance.",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM7 14a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    title: "CodeLens Actions",
    description:
      "Run or test individual nodes directly from the editor. Click the inline action above any decorated function.",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Real-time Diagnostics",
    description:
      "Errors, warnings, and DAG validation issues surface instantly as you type. No separate build step required.",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "AI-Powered via MCP",
    description:
      "Connect AI assistants directly to your pipeline context. Get intelligent suggestions, debugging help, and documentation.",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
  },
];

export function IDEShowcase() {
  return (
    <section className="py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              First-class IDE experience
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The VSCode extension brings your pipeline to life with
              visualization, inline actions, and AI-powered assistance.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Placeholder screenshot */}
          <ScrollReveal className="lg:col-span-3">
            <div className="rounded-xl border border-gray-700/40 bg-surface-800/30 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/40 bg-surface-800/50">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-gray-500 font-mono ml-2">
                  Requete: Pipeline View
                </span>
              </div>
              <div className="aspect-16/10 flex items-center justify-center bg-surface-900/50 p-8">
                {/* Mock DAG visualization */}
                <div className="w-full max-w-md space-y-4">
                  {[
                    {
                      label: "orders",
                      type: "source",
                      color: "bg-blue-500/20 border-blue-500/30 text-blue-300",
                    },
                    {
                      label: "clean_orders",
                      type: "transform",
                      color:
                        "bg-primary-500/20 border-primary-500/30 text-primary-300",
                    },
                    {
                      label: "enrich_orders",
                      type: "transform",
                      color:
                        "bg-primary-500/20 border-primary-500/30 text-primary-300",
                    },
                    {
                      label: "write_orders",
                      type: "sink",
                      color:
                        "bg-green-500/20 border-green-500/30 text-green-300",
                    },
                  ].map((node, i) => (
                    <div key={node.label} className="flex items-center gap-3">
                      {i > 0 && (
                        <div className="w-8 flex justify-center">
                          <div className="w-px h-4 bg-gray-700 -mt-4 absolute" />
                        </div>
                      )}
                      <div className="w-8 text-center text-xs text-gray-600 font-mono">
                        {i + 1}
                      </div>
                      <div
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-mono ${node.color}`}
                      >
                        <span className="text-xs text-gray-500 mr-2">
                          {node.type}:
                        </span>
                        {node.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Feature cards */}
          <div className="lg:col-span-2 space-y-4">
            {features.map((feat, i) => (
              <ScrollReveal key={feat.title} delay={i * 100}>
                <div className="rounded-xl border border-gray-700/30 bg-surface-800/30 p-5 hover:border-primary-500/20 hover:bg-surface-800/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                      {feat.icon}
                    </div>
                    <h3 className="font-semibold text-white text-sm">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed pl-12">
                    {feat.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
