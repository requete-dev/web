---
sidebar_position: 10
title: "Category 9: Test Validation"
---

# Category 9: Test Validation

### Rule 9.1: Promotion Test Required for Promote Nodes

**Rule:** Every `@nodes.promote()` must have a matching `@tests.promotion()` with the same tag.

**Valid:**

```python
@nodes.promote(tag="promote_data", pipeline="main", env=["prod"], depends_on=["clean"])
def promote(clean_df: DataFrame) -> None: ...

@tests.promotion(tag="promote_data", env=["prod"])
def test_promote(clean_df: DataFrame) -> None: ...
```

**Invalid:**

```python
@nodes.promote(tag="promote_data", pipeline="main", env=["prod"], depends_on=["clean"])
def promote(clean_df: DataFrame) -> None: ...

# Missing promotion test!
```

**Error Message:**

```
Promote node 'promote_data' is missing required promotion_test
Add: @tests.promotion_test(tag="promote_data", env=["prod"])
```

---

### Rule 9.2: Promotion Test Environment Coverage

**Rule:** Promotion tests must cover all environments where the promote node exists.

**Valid:**

```python
@nodes.promote(tag="promote", pipeline="main", env=["dev", "prod"], depends_on=["clean"])

@tests.promotion(tag="promote", env=["dev", "prod"])  # All envs covered
```

**Invalid:**

```python
@nodes.promote(tag="promote", pipeline="main", env=["dev", "prod"], depends_on=["clean"])

@tests.promotion(tag="promote", env=["dev"])  # Missing prod
```

**Error Message:**

```
Incomplete promotion_test coverage for 'promote':
  Promote envs: [dev, prod]
  Test envs:    [dev]
  Missing:      [prod]

Add env 'prod' to promotion_test or create separate test for prod
```

---

### Rule 9.3: Test Tag References Valid Node

**Rule:** Test decorators must reference existing node tags.

**Valid:**

```python
@nodes.transform(tag="calculate", pipeline="main", depends_on=["input"])
def calculate(input_df: DataFrame) -> DataFrame: ...

@tests.unit(tag="calculate")  # References existing node
def test_calculate(spark: SparkSession) -> None: ...
```

**Invalid:**

```python
@tests.unit(tag="nonexistent")  # Node doesn't exist
def test_something(spark: SparkSession) -> None: ...
```

**Error Message:**

```
Test references unknown node 'nonexistent'
Available nodes: calculate, transform_data, join_tables
```

---

### Rule 9.4: Unit Test Signature

**Rule:** Unit tests must have exactly one parameter: `spark: SparkSession`.

**Valid:**

```python
@tests.unit(tag="transform")
def test_transform(spark: SparkSession) -> None:
    ...
```

**Invalid:**

```python
@tests.unit(tag="transform")
def test_transform(spark: SparkSession, extra_param: int) -> None:
    ...
```

**Error Message:**

```
Unit test must have exactly one parameter: sparkSession: SparkSession
Found: (sparkSession: SparkSession, extra_param: int)
```

---

### Rule 9.5: Integration Test Signature

**Rule:** Integration tests must have exactly one parameter: the node's output DataFrame.

**Rationale:** Integration tests validate a transform/sink/promote node's output after it has been executed in the actual environment. The test receives the DataFrame produced by the node and performs assertions on it.

**Valid:**

```python
@tests.integration(tag="group_by", env=["dev"])
def test_integration(group_by_df: DataFrame):
    assert group_by_df.count() > 0
    assert "expected_column" in group_by_df.columns

@tests.integration(tag="daily_metrics", env=["staging"])
def test_positive_values(daily_metrics_df: DataFrame) -> None:
    negative_revenue = daily_metrics_df.filter(col("revenue") < 0).count()
    assert negative_revenue == 0
```

**Invalid:**

```python
@tests.integration(tag="transform", env=["dev"])
def test_integration():  # Missing DataFrame parameter
    ...

@tests.integration(tag="transform", env=["dev"])
def test_integration(df1: DataFrame, df2: DataFrame):  # Too many parameters
    ...

@tests.integration(tag="transform", env=["dev"])
def test_integration(session: SparkSession):  # Wrong parameter type
    ...
```

**Error Message:**

```
Integration test must have exactly one DataFrame parameter
Found: test_integration()
Expected: test_integration(output_df: DataFrame)
```

**Related:**

- See Rule 9.8 for parameter naming requirements (tag + `_df` suffix)
- See Rule 9.11 for source test signatures
- See Rule 9.10 for promotion test signatures

---

### Rule 9.6: Test Return Type

**Rule:** All test functions (unit, integration, promotion, source) must return `None` or have no return type annotation.

**Rationale:** Tests are assertion-based and should not return values. They either pass (no exception) or fail (assertion error).

**Valid:**

```python
@tests.unit(tag="transform")
def test_transform(spark: SparkSession) -> None:
    assert result.count() > 0

@tests.integration(tag="transform", env=["dev"])
def test_integration(transform_df: DataFrame) -> None:
    assert transform_df.count() > 0

@tests.promotion(tag="promote", env=["prod"])
def test_promotion(data_df: DataFrame) -> None:
    assert data_df.count() > 100
```

**Invalid:**

```python
@tests.unit(tag="transform")
def test_transform(spark: SparkSession) -> bool:  # Wrong return type
    return True

@tests.integration(tag="transform", env=["dev"])
def test_integration(transform_df: DataFrame) -> DataFrame:  # Should not return DataFrame
    return transform_df

@tests.promotion(tag="promote", env=["prod"])
def test_promotion(data_df: DataFrame) -> int:  # Wrong return type
    return data_df.count()
```

**Error Message:**

```
Test function must return None (or have no return annotation)
Found return type: bool
```

---

### Rule 9.7: Test Decorator Arguments

**Rule:** Test decorators must have correct arguments. No unknown arguments allowed.

**Required Arguments:**

- `@tests.unit(tag: str)` -- tag only
- `@tests.integration(tag: str, env: List[str])` -- tag and env required
- `@tests.promotion(tag: str, env: List[str])` -- tag and env required
- `@tests.source(tag: str, env: List[str])` -- tag and env required

**Valid:**

```python
@tests.unit(tag="enrich_orders")
def test_null_handling(...): ...

@tests.integration(tag="daily_metrics", env=["dev", "staging"])
def test_positive_values(...): ...

@tests.promotion(tag="promote_analytics", env=["prod"])
def test_revenue(...): ...
```

**Invalid:**

```python
# Unknown argument 'pipeline'
@tests.integration(tag="daily_metrics", pipeline="ecommerce", env=["dev"])
def test_values(...): ...

# Missing required 'env' for integration test
@tests.integration(tag="daily_metrics")
def test_values(...): ...
```

**Error Messages:**

```
Unknown argument 'pipeline' in @tests.integration
Valid arguments: tag, env

Integration tests require 'env' parameter
Example: @tests.integration(tag="daily_metrics", env=["dev"])
```

---

### Rule 9.8: Integration/Source Test Parameter Naming

**Rule:** Integration and source test functions must have their single DataFrame parameter named `{node_tag}_df`.

**Applies to:** `@tests.integration()` and `@tests.source()`

**Rationale:**

- Integration/source tests validate the **output** of the node they are testing
- Parameter name should match the node's tag (which identifies the output data)
- Consistent with Rule 2.3's `_df` suffix convention

**Valid:**

```python
@tests.integration(tag="daily_metrics", env=["dev"])
def test_positive_values(daily_metrics_df: DataFrame) -> None:
    #                     ^^^^^^^^^^^^^^^^
    #                     tag + "_df"
    assert daily_metrics_df.count() > 0

@tests.source(tag="users", env=["dev"])
def test_schema(users_df: DataFrame) -> None:
    #              ^^^^^^^^
    #              tag + "_df"
    assert "user_id" in users_df.columns
```

**Invalid:**

```python
# Missing _df suffix
@tests.integration(tag="daily_metrics", env=["dev"])
def test_positive_values(daily_metrics: DataFrame) -> None:
    ...

# Wrong name entirely
@tests.integration(tag="daily_metrics", env=["dev"])
def test_positive_values(data: DataFrame) -> None:
    ...
```

**Error Message:**

```
Integration/Source test parameter name must match node tag with '_df' suffix.
Expected: daily_metrics_df
Found: data
```

---

### Rule 9.9: Promotion Test Parameter Naming

**Rule:** Promotion test function parameters must match the promote node's dependencies with `_df` suffix, in the same order as the promote node's `depends_on` list.

**Applies to:** `@tests.promotion()`

**Rationale:**

- Promotion tests validate data **before** it is promoted
- They receive the **input** to the promote node (i.e., the dependencies)
- Parameter naming should match the promote node's function signature (Rule 2.3 pattern)
- Ensures consistency between promote nodes and their validation tests

**Valid:**

```python
# Single dependency
@nodes.promote(tag="promote_analytics", pipeline="main", depends_on=["daily_metrics"], env=["prod"])
def promote_prod(daily_metrics_df: DataFrame) -> None:
    ...

@tests.promotion(tag="promote_analytics", env=["prod"])
def test_revenue(daily_metrics_df: DataFrame) -> None:
    #               ^^^^^^^^^^^^^^^^
    #               dependency + "_df"
    assert daily_metrics_df.count() > 0

# Multiple dependencies
@nodes.promote(tag="promote_combined", pipeline="main", depends_on=["users", "orders"], env=["prod"])
def promote_prod(users_df: DataFrame, orders_df: DataFrame) -> None:
    ...

@tests.promotion(tag="promote_combined", env=["prod"])
def test_combined(users_df: DataFrame, orders_df: DataFrame) -> None:
    #                ^^^^^^^^           ^^^^^^^^^
    #                First dependency   Second dependency
    assert users_df.count() > 0
```

**Invalid:**

```python
# Missing _df suffix
@nodes.promote(tag="promote_analytics", pipeline="main", depends_on=["daily_metrics"], env=["prod"])
@tests.promotion(tag="promote_analytics", env=["prod"])
def test_revenue(daily_metrics: DataFrame) -> None:
    ...

# Wrong name entirely
@tests.promotion(tag="promote_analytics", env=["prod"])
def test_revenue(data: DataFrame) -> None:
    ...

# Wrong order (multiple dependencies case)
@nodes.promote(tag="promote_combined", pipeline="main", depends_on=["users", "orders"], env=["prod"])
@tests.promotion(tag="promote_combined", env=["prod"])
def test_combined(orders_df: DataFrame, users_df: DataFrame) -> None:
    #                Wrong order!
    ...
```

**Error Message:**

```
Promotion test parameter names must match promote node dependencies with '_df' suffix.
Expected: (daily_metrics_df)
Found: (data)

For promote node 'promote_analytics' with depends_on: ["daily_metrics"]
```

---

### Rule 9.10: Promotion Test Signature

**Rule:** Promotion tests must have the same parameter signature as their corresponding promote node's dependencies.

**Rationale:** Promotion tests run BEFORE the promote node executes to validate the input data. They receive the exact same parameters (dependency DataFrames) that the promote node will receive, allowing validation of data quality before promotion.

**How it works:**

- If promote node has `depends_on=["node_a"]`, promotion test receives one parameter for `node_a`'s output
- If promote node has `depends_on=["node_a", "node_b"]`, promotion test receives two parameters for both outputs
- Parameter names must match the dependency names with `_df` suffix (per Rule 9.9)
- Parameter order must match the `depends_on` list order

**Valid:**

```python
# Promote node with one dependency
@nodes.promote(tag="promote", pipeline="main", depends_on=["group_by"], env=["dev"])
def promote_dev(group_by_df: DataFrame) -> None:
    return group_by_df.write.saveAsTable("table_promoted")

# Promotion test - SAME signature as promote_dev
@tests.promotion(tag="promote", env=["dev"])
def test_promote_dev(group_by_df: DataFrame) -> None:
    assert group_by_df.count() > 0
    assert "c_modified" in group_by_df.columns

# Promote node with multiple dependencies
@nodes.promote(tag="analytics", pipeline="main", depends_on=["metrics", "segments"], env=["prod"])
def promote_analytics(metrics_df: DataFrame, segments_df: DataFrame) -> None:
    joined = metrics_df.join(segments_df, "user_id")
    return joined.write.saveAsTable("analytics_promoted")

# Promotion test - SAME signature as promote_analytics
@tests.promotion(tag="analytics", env=["prod"])
def test_promote_analytics(metrics_df: DataFrame, segments_df: DataFrame) -> None:
    assert metrics_df.count() > 0
    assert segments_df.count() > 0
    # Validate before promotion happens
```

**Invalid:**

```python
# Promote node with one dependency
@nodes.promote(tag="promote", pipeline="main", depends_on=["group_by"], env=["dev"])
def promote_dev(group_by_df: DataFrame) -> None:
    return group_by_df.write.saveAsTable("table")

# Missing parameter
@tests.promotion(tag="promote", env=["dev"])
def test_promote_dev() -> None:
    ...

# Wrong number of parameters
@tests.promotion(tag="promote", env=["dev"])
def test_promote_dev(df1: DataFrame, df2: DataFrame) -> None:
    ...

# Parameter name doesn't match dependency (per Rule 9.9)
@tests.promotion(tag="promote", env=["dev"])
def test_promote_dev(output_df: DataFrame) -> None:  # Should be group_by_df
    ...

# Wrong order (multiple dependencies case)
@nodes.promote(tag="combined", pipeline="main", depends_on=["users", "orders"], env=["prod"])
@tests.promotion(tag="combined", env=["prod"])
def test_combined(orders_df: DataFrame, users_df: DataFrame) -> None:  # Wrong order!
    ...
```

**Error Message:**

```
Promotion test signature must match promote node dependencies
Promote node promote_dev has signature: (group_by_df: DataFrame)
Found: test_promote_dev()
Expected: test_promote_dev(group_by_df: DataFrame)
```

**Related:**

- See Rule 9.5 for integration/source test signatures
- See Rule 9.9 for parameter naming conventions (dependency_name + `_df` suffix)

---

### Rule 9.11: Source Test Signature

**Rule:** Source tests must have exactly one parameter: the source node's output DataFrame.

**Applies to:** `@tests.source()`

**Rationale:** Source tests validate a source node's output after data has been loaded from the source system. The test receives the DataFrame produced by the source node and performs assertions on schema, data quality, and correctness.

**Valid:**

```python
@tests.source(tag="orders", env=["dev", "staging"])
def orders_test(orders_df: DataFrame) -> None:
    assert orders_df.count() > 0
    assert "order_id" in orders_df.columns
    assert "user_id" in orders_df.columns

@tests.source(tag="users", env=["dev"])
def test_schema(users_df: DataFrame) -> None:
    assert "user_id" in users_df.columns
    required_cols = ["user_id", "email", "created_at"]
    for col in required_cols:
        assert col in users_df.columns
```

**Invalid:**

```python
@tests.source(tag="users", env=["dev"])
def test_users():  # Missing DataFrame parameter
    ...

@tests.source(tag="users", env=["dev"])
def test_users(df1: DataFrame, df2: DataFrame):  # Too many parameters
    ...

@tests.source(tag="users", env=["dev"])
def test_users(session: SparkSession):  # Wrong parameter type
    ...
```

**Error Message:**

```
Source test must have exactly one DataFrame parameter
Found: test_users()
Expected: test_users(users_df: DataFrame)
```

**Related:**

- See Rule 9.8 for parameter naming requirements (tag + `_df` suffix)
- See Rule 9.5 for integration test signatures
- See Rule 9.10 for promotion test signatures

---

### Rule 9.12: Test Docstring Presence

**Rule:** All test functions should have docstrings documenting their purpose and validation logic.

**Severity:** Warning

**Applies to:** All test types (unit, integration, promotion, source)

**Rationale:** Test docstrings improve code maintainability and help developers understand what is being validated. While not strictly required for execution, they are strongly recommended for production test quality and serve as living documentation.

**Valid:**

```python
@tests.unit(tag="transform")
def test_transform(spark: SparkSession) -> None:
    """Unit test for transform logic with sample data."""
    data = [(1, 2), (3, 4)]
    df = spark.createDataFrame(data, ["a", "b"])
    result = transform(df)
    assert result.count() == 2

@tests.integration(tag="daily_metrics", env=["dev"])
def test_positive_values(daily_metrics_df: DataFrame) -> None:
    """Validate that all revenue values are positive in dev environment."""
    negative_count = daily_metrics_df.filter(col("revenue") < 0).count()
    assert negative_count == 0

@tests.promotion(tag="promote_analytics", env=["prod"])
def test_revenue_threshold(analytics_df: DataFrame) -> None:
    """Ensure revenue meets minimum threshold before promotion.

    Validates:
        - Total revenue > $1000
        - No null values in revenue column
    """
    assert analytics_df.agg(sum("revenue")).first()[0] > 1000
    assert analytics_df.filter(col("revenue").isNull()).count() == 0

@tests.source(tag="users", env=["dev", "prod"])
def test_users_schema(users_df: DataFrame) -> None:
    """Validate users source schema and required columns.

    Checks for presence of: user_id, email, created_at
    """
    required = ["user_id", "email", "created_at"]
    for col_name in required:
        assert col_name in users_df.columns
```

**Warning (Missing docstring):**

```python
@tests.unit(tag="transform")
def test_transform(spark: SparkSession) -> None:  # Missing docstring
    df = spark.createDataFrame([(1, 2)], ["a", "b"])
    assert transform(df).count() == 1

@tests.integration(tag="metrics", env=["dev"])
def test_metrics(metrics_df: DataFrame) -> None:  # Missing docstring
    assert metrics_df.count() > 0
```

**Warning Message:**

```
Warning: Missing docstring for test 'test_transform'
Add a docstring to document what this test validates

Example:
    """Unit test for transform logic with sample data."""
```

**Recommended Docstring Content:**

For **Unit tests:**

- What transformation/logic is being tested
- Brief description of test data setup
- Key assertions being made

For **Integration tests:**

- What output is being validated
- Environment-specific expectations
- Data quality checks being performed

For **Promotion tests:**

- What criteria must be met before promotion
- Business rules being enforced
- Thresholds or limits being validated

For **Source tests:**

- Schema requirements
- Data quality expectations
- Required columns or constraints

**Note:** While test docstrings are strongly recommended, their absence only generates a warning and does not prevent builds from succeeding.
