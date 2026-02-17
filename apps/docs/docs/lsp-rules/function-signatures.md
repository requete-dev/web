---
sidebar_position: 9
title: "Category 8: Function Signatures"
---

# Category 8: Function Signatures

### Rule 8.1: Session Function Signature

**Rule:** Session nodes must have no parameters.

**Valid:**

```python
@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev"])
def create_session() -> SparkSession:
    ...
```

**Invalid:**

```python
@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev"])
def create_session(param: str) -> SparkSession:  # Should have no params
    ...
```

**Error Message:**

```
Session function must have no parameters: `def create_session() -> SparkSession`
Found: 1 parameter
```

---

### Rule 8.2: Source Function Signature

**Rule:** Source nodes must have exactly one parameter with type `SparkSession` (or engine-specific session type).

**Valid:**

```python
@nodes.source(tag="orders", pipeline="analytics", env=["dev", "prod"])
def load_orders(spark: SparkSession) -> DataFrame:
    return spark.table("orders")
```

**Invalid:**

```python
@nodes.source(tag="orders", pipeline="analytics", env=["dev"])
def load_orders(spark: SparkSession, extra_param: str) -> DataFrame:  # Too many params
    ...

@nodes.source(tag="orders", pipeline="analytics", env=["dev"])
def load_orders() -> DataFrame:  # Missing session param
    ...

@nodes.source(tag="orders", pipeline="analytics", env=["dev"])
def load_orders(spark: DataFrame) -> DataFrame:  # Wrong parameter type
    ...

@nodes.source(tag="orders", pipeline="analytics", env=["dev"])
def load_orders(spark) -> DataFrame:  # Missing type annotation
    ...
```

**Error Messages:**

```
Source function must have exactly 1 parameter (spark: SparkSession)
Found: 2 parameters

Source function must have exactly 1 parameter (spark: SparkSession)
Found: 0 parameters

Source function parameter must be typed as SparkSession
Found: spark: DataFrame
Expected: spark: SparkSession

Source function parameter missing type annotation
Expected: spark: SparkSession
```

---

### Rule 8.3: BackfillSource Function Signature

**Rule:** BackfillSource nodes must have exactly two parameters with correct types: `spark: SparkSession` and `context: dict`.

**Valid:**

```python
@nodes.backfill_source(tag="orders", pipeline="analytics", env=["backfill"])
def load_orders_backfill(spark: SparkSession, context: dict) -> DataFrame:
    from_date = context.get("from_date")
    to_date = context.get("to_date")
    return spark.table("orders").filter(...)
```

**Invalid:**

```python
@nodes.backfill_source(tag="orders", pipeline="analytics", env=["backfill"])
def load_orders_backfill(spark: SparkSession) -> DataFrame:  # Missing context
    ...

@nodes.backfill_source(tag="orders", pipeline="analytics", env=["backfill"])
def load_orders_backfill(spark: SparkSession, context: str) -> DataFrame:  # Wrong type for context
    ...

@nodes.backfill_source(tag="orders", pipeline="analytics", env=["backfill"])
def load_orders_backfill(spark: DataFrame, context: dict) -> DataFrame:  # Wrong type for spark
    ...

@nodes.backfill_source(tag="orders", pipeline="analytics", env=["backfill"])
def load_orders_backfill(spark, context) -> DataFrame:  # Missing type annotations
    ...
```

**Error Messages:**

```
BackfillSource function must have signature (spark: SparkSession, context: dict)
Found: (spark: SparkSession)
Missing parameter: context: dict

BackfillSource function parameter 'context' must be typed as dict
Found: context: str
Expected: context: dict

BackfillSource function parameter 'spark' must be typed as SparkSession
Found: spark: DataFrame
Expected: spark: SparkSession

BackfillSource function parameters missing type annotations
Expected: (spark: SparkSession, context: dict)
```

---

### Rule 8.4: Transform/Sink/Promote Function Parameter Types

**Rule:** Transform, Sink, and Promote node parameters must all be typed as `DataFrame` and match the `depends_on` list.

**Valid:**

```python
@nodes.transform(tag="join_data", pipeline="analytics", depends_on=["users", "orders"])
def join_tables(users_df: DataFrame, orders_df: DataFrame) -> DataFrame:
    return users_df.join(orders_df, "user_id")

@nodes.sink(tag="write_users", pipeline="analytics", env=["prod"], depends_on=["users"])
def write_users(users_df: DataFrame) -> None:
    users_df.write.mode("overwrite").saveAsTable("users")
```

**Invalid:**

```python
# Missing type annotations
@nodes.transform(tag="join_data", pipeline="analytics", depends_on=["users", "orders"])
def join_tables(users_df, orders_df) -> DataFrame:
    ...

# Wrong type for parameter
@nodes.transform(tag="join_data", pipeline="analytics", depends_on=["users", "orders"])
def join_tables(users_df: DataFrame, orders_df: str) -> DataFrame:
    ...
```

**Error Messages:**

```
Transform function parameters must be typed as DataFrame
Parameter 'users' is missing type annotation
Expected: users: DataFrame

Transform function parameter 'orders' must be typed as DataFrame
Found: orders: str
Expected: orders: DataFrame
```

---

### Rule 8.5: Session Return Type

**Rule:** Session nodes must return `SparkSession` (or equivalent session type).

**Valid:**

```python
@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev"])
def create_session() -> SparkSession:
    ...
```

**Invalid:**

```python
@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev"])
def create_session() -> DataFrame:  # Wrong return type
    ...
```

**Error Message:**

```
Session node 'node' must return SparkSession
Found return type: DataFrame
```

---

### Rule 8.6: Source/Transform Return Type

**Rule:** Source and transform nodes must return `DataFrame`.

**Valid:**

```python
@nodes.source(tag="data", pipeline="main", env=["dev"])
def load_data(spark: SparkSession) -> DataFrame:
    ...

@nodes.transform(tag="clean", pipeline="main", depends_on=["data"])
def clean_data(data_df: DataFrame) -> DataFrame:
    ...
```

**Invalid:**

```python
@nodes.transform(tag="clean", pipeline="main", depends_on=["data"])
def clean_data(data_df: DataFrame) -> None:  # Should return DataFrame
    ...
```

**Error Message:**

```
Transform node 'clean' must return DataFrame
Found return type: None
```

---

### Rule 8.7: Sink/Promote Return Type

**Rule:** Sink and promote nodes must return `None`.

**Valid:**

```python
@nodes.sink(tag="write", pipeline="main", env=["prod"], depends_on=["clean"])
def write_data(clean_df: DataFrame) -> None:
    ...
```

**Invalid:**

```python
@nodes.sink(tag="write", pipeline="main", env=["prod"], depends_on=["clean"])
def write_data(clean_df: DataFrame) -> DataFrame:  # Should return None
    ...
```

**Error Message:**

```
Sink node 'write' must return None (no return value)
Found return type: DataFrame
```

---

### Rule 8.8: Function Docstring Presence

**Rule:** All decorated node functions should have docstrings that document their purpose and behavior.

**Severity:** Warning

**Rationale:** Docstrings improve code maintainability, help developers understand node behavior, and serve as inline documentation for the data pipeline. While not strictly required for execution, they are strongly recommended for production code quality.

**Valid:**

```python
@nodes.source(tag="users", pipeline="analytics", env=["dev", "prod"])
def load_users(spark: SparkSession) -> DataFrame:
    """Load user data from the raw data lake.

    Returns:
        DataFrame with columns: user_id, email, created_at, last_login
    """
    return spark.table("raw.users")

@nodes.transform(tag="clean_users", pipeline="analytics", depends_on=["users"])
def clean_users(users_df: DataFrame) -> DataFrame:
    """Clean and validate user data.

    Filters out invalid emails and deduplicates by user_id.

    Args:
        users_df: Raw user data from source

    Returns:
        Cleaned DataFrame with validated email addresses
    """
    return users_df.filter(col("email").isNotNull()).dropDuplicates(["user_id"])

@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def create_session() -> SparkSession:
    """Create a Spark session for the dev environment with optimized settings."""
    return SparkSession.builder.appName("analytics_dev").getOrCreate()
```

**Warning (Missing docstring):**

```python
@nodes.source(tag="users", pipeline="analytics", env=["dev"])
def load_users(spark: SparkSession) -> DataFrame:  # Missing docstring
    return spark.table("raw.users")

@nodes.transform(tag="clean", pipeline="analytics", depends_on=["users"])
def clean(users_df: DataFrame) -> DataFrame:  # Missing docstring
    return users_df.filter(col("active") == True)
```

**Warning Message:**

```
Warning: Missing docstring for node 'load_users'
Add a docstring to document this node's purpose, parameters, and return value

Example:
    """Load user data from the raw data lake.

    Returns:
        DataFrame with columns: user_id, email, created_at
    """
```

**Recommended Docstring Format:**

For **Source/BackfillSource** nodes:

- Brief description of data source
- Schema information (column names and types)
- Any important data characteristics

For **Transform** nodes:

- What transformation is being performed
- Description of input parameters
- Description of output
- Any important business logic or edge cases

For **Sink/Promote** nodes:

- Where data is being written
- Any important write configurations
- Data quality expectations

For **Session** nodes:

- Environment purpose
- Any special configurations
- Resource allocations if applicable

**Note:** While docstrings are strongly recommended, their absence only generates a warning and does not prevent builds from succeeding.
