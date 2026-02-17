import Link from "@docusaurus/Link";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./index.module.css";

const EXAMPLE_CODE = `from requete import nodes, sessions

@sessions.session(tag="spark_session", pipeline="analytics",
                  engine="spark", env=["dev"])
def dev_session() -> SparkSession:
    return SparkSession.builder.master("local[*]").getOrCreate()

@nodes.source(tag="orders", pipeline="analytics", env=["dev"])
def load_orders(sparkSession: SparkSession) -> DataFrame:
    return sparkSession.table("raw.orders")

@nodes.transform(tag="clean_orders", pipeline="analytics",
                 depends_on=["orders"])
def clean(orders_df: DataFrame) -> DataFrame:
    return orders_df.filter(col("status") != "cancelled")

@nodes.sink(tag="write_orders", pipeline="analytics",
            depends_on=["clean_orders"], env=["dev"])
def write(clean_orders_df: DataFrame) -> None:
    clean_orders_df.write.mode("overwrite").saveAsTable("clean.orders")`;

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

const features: FeatureItem[] = [
  {
    title: "Decorator-Driven DAGs",
    description:
      "Define pipeline structure with Python decorators. Sources, transforms, sinks, and tests are discovered automatically and assembled into a validated DAG.",
    icon: "\u{1F3AF}",
  },
  {
    title: "Multi-Engine Support",
    description:
      "Write once, run on Spark, DuckDB, or Snowflake. Engine-agnostic API with environment-specific sessions lets you develop locally and deploy anywhere.",
    icon: "\u26A1",
  },
  {
    title: "Built-in Testing",
    description:
      "Unit tests, integration tests, source validation, and promotion gates are first-class concepts. Quality checks run automatically as part of the pipeline.",
    icon: "\u{1F9EA}",
  },
  {
    title: "Multi-Environment",
    description:
      "Same pipeline tag, different implementations per environment. Dev uses test data, prod reads real tables, CI runs assertions \u2014 all coexist cleanly.",
    icon: "\u{1F30D}",
  },
  {
    title: "IDE Integration",
    description:
      "VSCode extension with DAG visualization, inline diagnostics, CodeLens run/test buttons, and AI-powered assistance via MCP.",
    icon: "\u{1F4BB}",
  },
  {
    title: "Zero-Config Python",
    description:
      "No virtual environments to manage. Requete uses uv to resolve dependencies on-the-fly from your requete.yaml. Hot start in milliseconds.",
    icon: "\u{1F4E6}",
  },
];

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className={styles.heroTitle}>
              Data pipelines,{" "}
              <span className={styles.heroTitleAccent}>declared</span>
            </Heading>
            <p className={styles.heroSubtitle}>
              Requete is a framework for building, testing, and deploying data
              pipelines using Python decorators. Define your DAG with{" "}
              <code>@nodes</code> and <code>@sessions</code>, test with{" "}
              <code>@tests</code>, and run on Spark, DuckDB, or Snowflake.
            </p>
            <div className={styles.heroButtons}>
              <Link
                className={clsx(
                  "button button--primary button--lg",
                  styles.heroButton,
                )}
                to="/docs/getting-started/quickstart"
              >
                Get Started
              </Link>
              <Link
                className={clsx(
                  "button button--outline button--lg",
                  styles.heroButtonOutline,
                )}
                to="/docs/getting-started/what-is-requete"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className={styles.heroCode}>
            <CodeBlock language="python" title="analytics/sources/orders.py">
              {EXAMPLE_CODE}
            </CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ title, description, icon }: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <Heading as="h3" className={styles.featureTitle}>
        {title}
      </Heading>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything you need for production data pipelines
          </Heading>
          <p className={styles.sectionSubtitle}>
            From local development to production deployment, Requete handles the
            full pipeline lifecycle.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className={styles.architecture}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            How it works
          </Heading>
          <p className={styles.sectionSubtitle}>
            A Rust orchestrator parses your Python, builds the DAG, generates
            execution scripts, and sends them to a Python engine via gRPC.
          </p>
        </div>
        <div className={styles.architectureDiagram}>
          <div className={styles.archLayer}>
            <div className={styles.archBox}>
              <div className={styles.archLabel}>VSCode / IDE</div>
              <div className={styles.archDesc}>
                Extension, CodeLens, diagnostics
              </div>
            </div>
          </div>
          <div className={styles.archArrow}>\u2193 LSP</div>
          <div className={styles.archLayer}>
            <div className={clsx(styles.archBox, styles.archBoxPrimary)}>
              <div className={styles.archLabel}>Rust Core</div>
              <div className={styles.archDesc}>
                Parser \u00B7 DAG Builder \u00B7 Code Gen \u00B7 HTTP/MCP Server
              </div>
            </div>
            <div className={styles.archBox}>
              <div className={styles.archLabel}>Browser UI</div>
              <div className={styles.archDesc}>DAG visualization</div>
            </div>
          </div>
          <div className={styles.archArrow}>\u2193 gRPC</div>
          <div className={styles.archLayer}>
            <div className={styles.archBox}>
              <div className={styles.archLabel}>Python Engine</div>
              <div className={styles.archDesc}>
                Executor \u00B7 Sessions \u00B7 Spark / DuckDB / Snowflake
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <Heading as="h2" className={styles.ctaTitle}>
          Ready to build your first pipeline?
        </Heading>
        <p className={styles.ctaSubtitle}>
          Go from zero to a running pipeline in under 5 minutes.
        </p>
        <Link
          className={clsx(
            "button button--primary button--lg",
            styles.heroButton,
          )}
          to="/docs/getting-started/quickstart"
        >
          Start the Quickstart
        </Link>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Build, test, and deploy data pipelines"
      description="Requete is a framework for building, testing, and deploying data pipelines using Python decorators. Define DAGs with @nodes, test with @tests, run on Spark, DuckDB, or Snowflake."
    >
      <HeroSection />
      <main>
        <FeaturesSection />
        <ArchitectureSection />
        <CTASection />
      </main>
    </Layout>
  );
}
