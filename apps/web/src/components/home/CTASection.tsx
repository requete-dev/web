import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { QUICKSTART_URL } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="py-24 border-t border-gray-800/30">
      <Container>
        <ScrollReveal>
          <div className="relative rounded-2xl border border-gray-700/30 bg-surface-800/30 p-12 md:p-16 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-primary-600/8 rounded-full blur-3xl" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to build your first pipeline?
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
              Go from zero to a running pipeline in under 5 minutes. No complex
              setup, no YAML sprawl — just Python decorators.
            </p>
            <Button href={QUICKSTART_URL} size="lg" external>
              Start the Quickstart
            </Button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
