import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Container } from "@/components/ui/Container";
import { GITHUB_URL, QUICKSTART_URL } from "@/lib/constants";

const HERO_CODE = `from requete import nodes, sessions

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
    return orders_df.filter(col("status") != "cancelled")

@nodes.sink(tag="write_orders", pipeline="analytics",
            depends_on=["clean_orders"], env=["dev"])
def write(clean_orders_df: DataFrame) -> None:
    clean_orders_df.write.mode("overwrite").saveAsTable("clean.orders")`;

export async function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-primary-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-primary-800/5 rounded-full blur-3xl" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-600/30 bg-primary-600/10 text-primary-300 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              Now in public beta
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Data pipelines,{" "}
              <span className="bg-linear-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                declared
              </span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
              Build, test, and deploy data pipelines using Python decorators.
              Define your DAG with{" "}
              <code className="px-1.5 py-0.5 rounded bg-primary-600/10 text-primary-300 text-[0.9em] font-mono">
                @nodes
              </code>{" "}
              and{" "}
              <code className="px-1.5 py-0.5 rounded bg-primary-600/10 text-primary-300 text-[0.9em] font-mono">
                @sessions
              </code>
              , test with{" "}
              <code className="px-1.5 py-0.5 rounded bg-primary-600/10 text-primary-300 text-[0.9em] font-mono">
                @tests
              </code>
              , and run on Spark, DuckDB, or Snowflake.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button href={QUICKSTART_URL} size="lg" external>
                Get Started
              </Button>
              <Button href={GITHUB_URL} variant="outline" size="lg" external>
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-primary-600/10 to-primary-800/10 rounded-2xl blur-xl" />
            <div className="relative">
              <CodeBlock code={HERO_CODE} title="analytics/pipeline.py" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
