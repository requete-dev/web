---
sidebar_position: 5
title: "Transforms"
---

# Transforms

Transforms contain your pipeline's business logic. A transform node receives DataFrames from upstream nodes, applies computations, and returns a new DataFrame for downstream consumption.

## The `@nodes.transform` Decorator

```python
@nodes.transform(tag="join_tables", pipeline="simple", depends_on=["read_table_1", "read_table_2"])
def join(read_table_1_df: DataFrame, read_table_2_df: DataFrame) -> DataFrame:
    ...
```

### Parameters

| Parameter     | Type         | Description                                                         |
|---------------|--------------|---------------------------------------------------------------------|
| `tag`         | `str`        | Unique identifier for this transform within the pipeline.           |
| `pipeline`    | `str`        | The pipeline this transform belongs to. Must match `requete.yaml`.  |
| `depends_on`  | `list[str]`  | Tags of upstream nodes whose DataFrames this transform receives.    |

### No `env` Parameter

Transforms do not take an `env` parameter. A transform runs identically in every environment. This is intentional: business logic should not change between dev, staging, and production. Environment-specific behavior is handled by [sources](./sources.md) and [sinks](./sinks.md), not transforms.

### Return Value

A transform function must return a `DataFrame`.

## Dependency Injection

Upstream DataFrames are injected as function parameters using a naming convention: the parameter name must be the upstream node's tag followed by `_df`.

For a transform that depends on `["read_table_1", "read_table_2"]`, the function signature must include `read_table_1_df` and `read_table_2_df`:

```python
@nodes.transform(tag="join_tables", pipeline="simple", depends_on=["read_table_1", "read_table_2"])
def join(read_table_1_df: DataFrame, read_table_2_df: DataFrame) -> DataFrame:
    return read_table_1_df.join(read_table_2_df, on="b", how="inner").select("a", "c")
```

Requete resolves each `depends_on` tag to the DataFrame produced by that node, then passes it to your function using the `<tag>_df` parameter name. The parameter order does not matter.

## Chaining Transforms

Transforms can depend on other transforms, forming a chain of operations:

```python
@nodes.transform(tag="join_tables", pipeline="simple", depends_on=["read_table_1", "read_table_2"])
def join(read_table_1_df: DataFrame, read_table_2_df: DataFrame) -> DataFrame:
    return read_table_1_df.join(read_table_2_df, on="b", how="inner").select("a", "c")

@nodes.transform(tag="group_by", pipeline="simple", depends_on=["join_tables"])
def group_by(join_tables_df: DataFrame) -> DataFrame:
    return join_tables_df.groupBy("a").agg(count("c").alias("count_c"))
```

In this example, `group_by` depends on `join_tables`, which depends on `read_table_1` and `read_table_2`. Requete executes them in the correct order based on the dependency graph.

## Multi-Dependency Joins

A transform can depend on any number of upstream nodes:

```python
@nodes.transform(
    tag="combined_view",
    pipeline="analytics",
    depends_on=["customers", "orders", "products"]
)
def combined_view(
    customers_df: DataFrame,
    orders_df: DataFrame,
    products_df: DataFrame,
) -> DataFrame:
    return (
        orders_df
        .join(customers_df, on="customer_id", how="inner")
        .join(products_df, on="product_id", how="inner")
        .select("customer_name", "product_name", "order_date", "amount")
    )
```

## Pure Functions

Transforms should be pure functions: given the same input DataFrames, they produce the same output DataFrame. They should not:

- Read from external systems (that is what sources are for).
- Write to external systems (that is what sinks and promotes are for).
- Depend on environment-specific configuration.
- Maintain mutable state between executions.

This purity makes transforms easy to test, reason about, and reuse. It also enables Requete to cache and optimize execution.

## Common Transform Patterns

### Filtering

```python
@nodes.transform(tag="active_customers", pipeline="analytics", depends_on=["customers"])
def active_customers(customers_df: DataFrame) -> DataFrame:
    return customers_df.filter(col("status") == "active")
```

### Aggregation

```python
@nodes.transform(tag="daily_totals", pipeline="analytics", depends_on=["orders"])
def daily_totals(orders_df: DataFrame) -> DataFrame:
    return (
        orders_df
        .groupBy("order_date")
        .agg(
            sum("amount").alias("total_amount"),
            count("order_id").alias("order_count"),
        )
    )
```

### Adding Computed Columns

```python
@nodes.transform(tag="enriched_orders", pipeline="analytics", depends_on=["orders"])
def enriched_orders(orders_df: DataFrame) -> DataFrame:
    return (
        orders_df
        .withColumn("order_year", year(col("order_date")))
        .withColumn("is_large_order", col("amount") > 1000)
    )
```

### Window Functions

```python
from pyspark.sql.window import Window

@nodes.transform(tag="ranked_products", pipeline="analytics", depends_on=["product_sales"])
def ranked_products(product_sales_df: DataFrame) -> DataFrame:
    window = Window.partitionBy("category").orderBy(col("revenue").desc())
    return product_sales_df.withColumn("rank", row_number().over(window))
```

## Guidelines

- **Keep transforms focused.** Each transform should do one thing well. Break complex logic into multiple chained transforms rather than building one monolithic function.
- **Use descriptive tags.** The tag serves as both the node identity and the basis for the `_df` parameter name downstream. Clear tags like `join_orders_customers` are easier to work with than `step_3`.
- **Avoid side effects.** Do not read files, call APIs, or write output in transforms. Keep external I/O in sources and sinks.
- **Test with unit tests.** Because transforms are pure functions, they are ideal candidates for `@tests.unit` tests with synthetic input data.
