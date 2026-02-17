import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const logos = [
  {
    name: "Apache Spark",
    svg: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path d="M11.39.19a.62.62 0 0 1 1.22 0l1.72 6.48a.62.62 0 0 0 .46.44l6.6 1.34a.62.62 0 0 1 .22 1.1l-5.34 4a.62.62 0 0 0-.21.62l1.52 6.52a.62.62 0 0 1-.93.68l-5.74-3.54a.62.62 0 0 0-.62 0L4.55 21.37a.62.62 0 0 1-.93-.68l1.52-6.52a.62.62 0 0 0-.21-.62l-5.34-4a.62.62 0 0 1 .22-1.1l6.6-1.34a.62.62 0 0 0 .46-.44z" />
      </svg>
    ),
  },
  {
    name: "DuckDB",
    svg: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="9" cy="10" r="1.5" />
        <circle cx="15" cy="10" r="1.5" />
        <path
          d="M8 15c1.5 2 6.5 2 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Snowflake",
    svg: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path
          d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    name: "Python",
    svg: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path d="M12 2C6.48 2 6 4.02 6 5.5V8h6v1H5.5C3.02 9 1 11 1 13.5S3 18 5.5 18H8v-2.5C8 13.02 10 11 12.5 11H17c1.1 0 2-.9 2-2V5.5C19 3.02 17 2 12 2zm-1.5 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        <path d="M12 22c5.52 0 6-2.02 6-3.5V16h-6v-1h6.5c2.48 0 4.5-2 4.5-4.5S20.98 6 18.5 6H16v2.5c0 2.48-2 4.5-4.5 4.5H7c-1.1 0-2 .9-2 2v3.5C5 20.98 7 22 12 22zm1.5-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
      </svg>
    ),
  },
  {
    name: "Rust",
    svg: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16z" />
        <path d="M9 9h2v6H9zm4 0h2v4h-2zm-2.5 0L12 7l1.5 2z" />
      </svg>
    ),
  },
  {
    name: "VS Code",
    svg: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
      >
        <path d="M17.28 2L7.88 10.16 3.72 7.2 2 8v8l1.72.8 4.16-2.96L17.28 22 22 20V4zM6.6 14.18l-2.82-2 2.82-2.02zM17.28 18.56L9.44 12l7.84-6.56z" />
      </svg>
    ),
  },
];

export function TechLogosBar() {
  return (
    <section className="py-16 border-t border-gray-800/30">
      <Container>
        <ScrollReveal>
          <p className="text-center text-sm text-gray-500 uppercase tracking-wider font-medium mb-10">
            Built for the modern data stack
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2.5 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {logo.svg}
                <span className="text-sm font-medium">{logo.name}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
