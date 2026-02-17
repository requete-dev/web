import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "Requete",
  tagline: "Build, test, and deploy data pipelines with Python decorators",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://docs.requete.dev",
  baseUrl: "/",

  onBrokenLinks: "throw",

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  themes: ["@docusaurus/theme-mermaid"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/requete/requete-docs/tree/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/requete-social-card.png",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Requete",
      logo: {
        alt: "Requete Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/requete",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Getting Started",
              to: "/docs/getting-started/what-is-requete",
            },
            { label: "Pipelines", to: "/docs/pipelines/project-structure" },
            { label: "Testing", to: "/docs/testing/overview" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "GitHub", href: "https://github.com/requete" },
            { label: "Discord", href: "https://discord.gg/requete" },
          ],
        },
        {
          title: "More",
          items: [{ label: "CLI Reference", to: "/docs/reference/cli" }],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} Requete. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "yaml", "toml", "rust", "protobuf"],
    },
    mermaid: {
      theme: { light: "neutral", dark: "dark" },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
