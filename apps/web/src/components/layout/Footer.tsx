import Link from "next/link";
import { DOCS_URL, GITHUB_URL } from "@/lib/constants";

const footerLinks: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/product" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/blog" },
    ],
  },
  {
    title: "Documentation",
    links: [
      {
        label: "Getting Started",
        href: `${DOCS_URL}/docs/getting-started/quickstart`,
        external: true,
      },
      {
        label: "Pipelines",
        href: `${DOCS_URL}/docs/pipelines/project-structure`,
        external: true,
      },
      {
        label: "Architecture",
        href: `${DOCS_URL}/docs/architecture/overview`,
        external: true,
      },
      {
        label: "CLI Reference",
        href: `${DOCS_URL}/docs/reference/cli`,
        external: true,
      },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: GITHUB_URL, external: true },
      { label: "Discord", href: "https://discord.gg/requete", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-surface-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
              R
            </div>
            <span className="text-sm text-gray-400">Requete</span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Requete. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
