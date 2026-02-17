---
sidebar_position: 2
title: "Unit Tests"
---

# Unit Tests

Unit tests validate transform logic in isolation using synthetic data that you define. They do not depend on pipeline execution or upstream node outputs, making them fast and deterministic.

## Decorator

```python
@tests.unit(tag="<transform_tag>")
```

The `tag` parameter identifies which transform this test covers. A transform can have multiple unit tests.

## How Unit Tests Work

A unit test function receives a `sparkSession` (or equivalent engine session) and is responsible for:

1. Creating synthetic input data that matches the expected schema of the transform's dependencies.
2. Calling the transform function directly with that data.
3. Asserting properties of the result.

Unit tests run independently of the pipeline DAG. They do not trigger upstream sources or other transforms.

## Example

Given a transform that calculates revenue per customer:

```python
@nodes.transform(tag="revenue_per_customer", pipeline="sales", depends_on=["orders"])
def revenue_per_customer(orders_df):
    return orders_df.groupBy("customer_id").agg({"amount": "sum"})
```

A unit test for this transform would look like:

```python
@tests.unit(tag="revenue_per_customer")
def test_revenue_aggregation(sparkSession):
    # Create synthetic input data
    test_orders = sparkSession.createDataFrame([
        ("C001", 100.0),
        ("C001", 250.0),
        ("C002", 75.0),
    ], ["customer_id", "amount"])

    # Call the transform directly
    result = revenue_per_customer(test_orders)

    # Assert expected results
    rows = {row["customer_id"]: row["sum(amount)"] for row in result.collect()}
    assert rows["C001"] == 350.0
    assert rows["C002"] == 75.0
```

## Key Points

- **No environment scoping:** Unit tests do not accept an `env` parameter. They are environment-independent by design.
- **Direct invocation:** You call the transform function directly, passing in the DataFrames it expects. This bypasses the DAG entirely.
- **Synthetic data:** You control the input data completely, allowing you to test edge cases, null handling, empty DataFrames, and schema variations.
- **Fast execution:** Because unit tests do not read from external sources or execute upstream nodes, they complete quickly and are suitable for rapid iteration.

## Best Practices

- Test edge cases: empty DataFrames, null values, duplicate keys, and unexpected types.
- Keep synthetic datasets small and focused on the behavior being tested.
- Write multiple unit tests per transform if it has complex logic or multiple code paths.

---

*Advanced unit testing patterns, parameterized tests, and engine-specific considerations are coming soon.*
