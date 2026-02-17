import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Requete — Data Pipelines, Declared",
    template: "%s | Requete",
  },
  description:
    "Build, test, and deploy data pipelines using Python decorators. Define DAGs with @nodes, test with @tests, run on Spark, DuckDB, or Snowflake.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
