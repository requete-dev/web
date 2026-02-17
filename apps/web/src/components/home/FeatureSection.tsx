import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FEATURES } from "@/lib/constants";

function FeatureDeepDiveLayout({
  subtitle,
  title,
  description,
  codeBlock,
  reversed,
  index,
}: {
  subtitle: string;
  title: string;
  description: string;
  codeBlock: React.ReactNode;
  reversed: boolean;
  index: number;
}) {
  return (
    <ScrollReveal delay={index * 100}>
      <div
        className={`grid lg:grid-cols-2 gap-12 items-center ${reversed ? "lg:direction-rtl" : ""}`}
      >
        <div className={reversed ? "lg:order-2" : ""}>
          <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">
            {subtitle}
          </span>
          <h3 className="text-3xl font-bold text-white mt-2 mb-4 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed text-lg">{description}</p>
        </div>
        <div className={reversed ? "lg:order-1" : ""}>{codeBlock}</div>
      </div>
    </ScrollReveal>
  );
}

export async function FeatureSection() {
  return (
    <section className="py-24">
      <Container>
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Everything you need for production data pipelines
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From local development to production deployment, Requete handles
              the full pipeline lifecycle.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-24">
          {FEATURES.map((feature, i) => (
            <FeatureDeepDiveLayout
              key={feature.title}
              subtitle={feature.subtitle}
              title={feature.title}
              description={feature.description}
              codeBlock={
                <CodeBlock
                  code={feature.code}
                  title={`${feature.title.toLowerCase().replace(/\s+/g, "_")}.py`}
                />
              }
              reversed={i % 2 !== 0}
              index={i}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
