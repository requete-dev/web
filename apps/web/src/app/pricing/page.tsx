import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { QUICKSTART_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
};

const tiers = [
  {
    name: "Open Source",
    price: "Free",
    description: "Everything you need to build and deploy data pipelines.",
    cta: { label: "Get Started", href: QUICKSTART_URL, external: true },
    features: [
      "Unlimited pipelines",
      "Spark, DuckDB, Snowflake engines",
      "Built-in testing framework",
      "Multi-environment support",
      "VSCode extension",
      "CLI & HTTP API",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "For teams that need advanced security, compliance, and dedicated support.",
    cta: { label: "Contact Us", href: "mailto:hello@requete.dev" },
    features: [
      "Everything in Open Source",
      "SSO / SAML authentication",
      "Role-based access control",
      "Audit logging",
      "SLA & priority support",
      "Custom integrations",
      "Dedicated success engineer",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="pt-16 pb-24">
      <Container>
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Start free with the full-featured open source framework. Enterprise
            features for teams that need them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-primary-500/40 bg-primary-600/5 shadow-lg shadow-primary-600/5"
                  : "border-gray-700/30 bg-surface-800/30"
              }`}
            >
              <h2 className="text-xl font-semibold text-white mb-1">
                {tier.name}
              </h2>
              <div className="text-3xl font-bold text-white mb-3">
                {tier.price}
              </div>
              <p className="text-sm text-gray-400 mb-6">{tier.description}</p>

              <Button
                href={tier.cta.href}
                variant={tier.highlighted ? "primary" : "outline"}
                className="w-full mb-8"
                external={"external" in tier.cta}
              >
                {tier.cta.label}
              </Button>

              <ul className="space-y-3">
                {tier.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-start gap-2.5 text-sm text-gray-300"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 mt-0.5 text-primary-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
