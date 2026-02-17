export const NAV_LINKS: { label: string; href: string; external?: boolean }[] =
  [
    { label: "Product", href: "/product" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "https://docs.requete.dev", external: true },
  ];

export const GITHUB_URL = "https://github.com/requete";
export const DOCS_URL = "https://docs.requete.dev";
export const QUICKSTART_URL =
  "https://docs.requete.dev/docs/getting-started/quickstart";

export const FEATURES = [
  {
    title: "Decorator-Driven DAGs",
    subtitle: "Define pipelines with Python, not YAML",
    description:
      "Use @nodes.source, @nodes.transform, and @nodes.sink decorators to define your pipeline. Requete discovers them automatically, validates the DAG, and generates execution scripts.",
    code: `from requete import nodes, sessions

@sessions.session(tag="spark", pipeline="analytics",
                  engine="spark", env=["dev"])
def dev_session() -> SparkSession:
    return SparkSession.builder.master("local[*]").getOrCreate()

@nodes.source(tag="orders", pipeline="analytics", env=["dev"])
def load_orders(spark: SparkSession) -> DataFrame:
    return spark.table("raw.orders")

@nodes.transform(tag="clean_orders", pipeline="analytics",
                 depends_on=["orders"])
def clean(orders_df: DataFrame) -> DataFrame:
    return orders_df.filter(col("status") != "cancelled")`,
  },
  {
    title: "Multi-Engine Support",
    subtitle: "Write once, run on Spark, DuckDB, or Snowflake",
    description:
      "Swap the engine per environment without changing pipeline logic. Develop locally on DuckDB, test in CI with Spark, deploy to Snowflake in production.",
    code: `# Dev: fast local iteration with DuckDB
@sessions.session(tag="db", pipeline="analytics",
                  engine="duckdb", env=["dev"])
def dev_db() -> DuckDBPyConnection:
    return duckdb.connect(":memory:")

# Prod: same pipeline, Snowflake engine
@sessions.session(tag="db", pipeline="analytics",
                  engine="snowflake", env=["prod"])
def prod_db() -> SnowflakeConnection:
    return snowflake.connector.connect(**prod_config)`,
  },
  {
    title: "Built-in Testing",
    subtitle: "Quality gates as first-class pipeline citizens",
    description:
      "Unit tests, integration tests, source validation, and promotion gates run automatically. Catch bad data before it reaches production.",
    code: `from requete import tests

@tests.unit_test(tag="orders_not_empty",
                 pipeline="analytics",
                 depends_on=["orders"])
def test_not_empty(orders_df: DataFrame) -> bool:
    return orders_df.count() > 0

@tests.source_test(tag="orders_schema",
                   pipeline="analytics",
                   depends_on=["orders"])
def test_schema(orders_df: DataFrame) -> bool:
    required = {"id", "status", "amount", "created_at"}
    return required.issubset(set(orders_df.columns))`,
  },
] as const;

export const TECH_LOGOS = [
  { name: "Apache Spark", icon: "spark" },
  { name: "DuckDB", icon: "duckdb" },
  { name: "Snowflake", icon: "snowflake" },
  { name: "Python", icon: "python" },
  { name: "Rust", icon: "rust" },
  { name: "VS Code", icon: "vscode" },
] as const;

export const ARCHITECTURE_LAYERS = [
  {
    label: "IDE Layer",
    items: ["VSCode Extension", "DAG Visualization", "CodeLens", "MCP AI"],
    protocol: "LSP + HTTP",
  },
  {
    label: "Rust Orchestrator",
    items: [
      "Python Parser",
      "DAG Builder",
      "Code Generator",
      "HTTP / MCP Server",
    ],
    primary: true,
    protocol: "gRPC",
  },
  {
    label: "Python Engine",
    items: ["Script Executor", "Session Manager", "Spark / DuckDB / Snowflake"],
  },
] as const;

export const BLOG_POSTS = [
  {
    title: "Introducing Requete: Data Pipelines, Declared",
    date: "2026-02-10",
    excerpt:
      "We built Requete because defining data pipelines shouldn't require a PhD in YAML. Here's our vision for decorator-driven data engineering.",
    slug: "introducing-requete",
  },
  {
    title: "Why We Chose Rust for Our Orchestrator",
    date: "2026-01-28",
    excerpt:
      "A deep dive into the architecture decisions behind Requete's two-process model: a Rust orchestrator paired with a Python engine.",
    slug: "why-rust-orchestrator",
  },
  {
    title: "Multi-Engine Pipelines: Write Once, Run Anywhere",
    date: "2026-01-15",
    excerpt:
      "How Requete's environment system lets you develop on DuckDB, test on Spark, and deploy to Snowflake — all from the same codebase.",
    slug: "multi-engine-pipelines",
  },
] as const;
