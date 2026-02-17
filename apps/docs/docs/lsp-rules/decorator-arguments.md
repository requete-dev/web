---
sidebar_position: 8
title: "Category 7: Decorator Arguments"
---

# Category 7: Decorator Arguments

### Rule 7.1: Required Decorator Arguments

**Rule:** All node decorators must have their required arguments. No required arguments can be missing.

**Required Arguments by Node Type:**

- `@nodes.session(tag: str, pipeline: str, engine: str, env: List[str])` -- all required
- `@nodes.source(tag: str, pipeline: str, env: List[str])` -- all required
- `@nodes.backfill_source(tag: str, pipeline: str, env: List[str])` -- all required
- `@nodes.transform(tag: str, pipeline: str, depends_on: List[str])` -- all required
- `@nodes.sink(tag: str, pipeline: str, env: List[str], depends_on: List[str])` -- all required
- `@nodes.promote(tag: str, pipeline: str, env: List[str], depends_on: List[str])` -- all required

**Valid:**

```python
@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def spark_session() -> SparkSession: ...

@nodes.source(tag="users", pipeline="analytics", env=["dev", "prod"])
def load_users(spark: SparkSession) -> DataFrame: ...

@nodes.transform(tag="clean_users", pipeline="analytics", depends_on=["users"])
def clean(users_df: DataFrame) -> DataFrame: ...
```

**Invalid:**

```python
# Missing 'pipeline' argument
@nodes.session(tag="spark_dev", engine="spark", env=["dev"])
def spark_session() -> SparkSession: ...

# Missing 'env' argument
@nodes.source(tag="users", pipeline="analytics")
def load_users(spark: SparkSession) -> DataFrame: ...

# Missing 'depends_on' argument
@nodes.transform(tag="clean_users", pipeline="analytics")
def clean(users_df: DataFrame) -> DataFrame: ...
```

**Error Messages:**

```
ERROR: Missing required decorator argument 'pipeline'
Session decorator requires: tag, pipeline, engine, env
Found: tag, engine, env

ERROR: Missing required decorator argument 'env'
Source decorator requires: tag, pipeline, env
Found: tag, pipeline

ERROR: Missing required decorator argument 'depends_on'
Transform decorator requires: tag, pipeline, depends_on
Found: tag, pipeline
```

---

### Rule 7.2: Unknown Decorator Arguments

**Rule:** Node decorators must not have unknown or invalid arguments. Only recognized arguments are allowed.

**Valid Arguments by Node Type:**

- `@nodes.session` -- `tag`, `pipeline`, `engine`, `env`
- `@nodes.source` -- `tag`, `pipeline`, `env`
- `@nodes.backfill_source` -- `tag`, `pipeline`, `env`
- `@nodes.transform` -- `tag`, `pipeline`, `depends_on`
- `@nodes.sink` -- `tag`, `pipeline`, `env`, `depends_on`
- `@nodes.promote` -- `tag`, `pipeline`, `env`, `depends_on`

**Valid:**

```python
@nodes.transform(tag="clean", pipeline="analytics", depends_on=["users"])
def clean(users_df: DataFrame) -> DataFrame: ...
```

**Invalid:**

```python
# Unknown argument 'engine' on transform
@nodes.transform(tag="clean", pipeline="analytics", engine="spark", depends_on=["users"])
def clean(users_df: DataFrame) -> DataFrame: ...

# Unknown argument 'author' on source
@nodes.source(tag="users", pipeline="analytics", env=["dev"], author="john")
def load_users(spark: SparkSession) -> DataFrame: ...

# Transform cannot have 'env' argument (also covered by Rule 4.1)
@nodes.transform(tag="clean", pipeline="analytics", env=["dev"], depends_on=["users"])
def clean(users_df: DataFrame) -> DataFrame: ...
```

**Error Messages:**

```
ERROR: Unknown decorator argument 'engine'
Transform decorator only accepts: tag, pipeline, depends_on
Remove argument: engine="spark"

ERROR: Unknown decorator argument 'author'
Source decorator only accepts: tag, pipeline, env
Remove argument: author="john"

ERROR: Unknown decorator argument 'env'
Transform decorator only accepts: tag, pipeline, depends_on
Remove argument: env=["dev"]
```

---

### Rule 7.3: Decorator Argument Types

**Rule:** Decorator arguments must have the correct types.

**Expected Types:**

- `tag` -- string
- `pipeline` -- string
- `engine` -- string
- `env` -- list of strings
- `depends_on` -- list of strings

**Valid:**

```python
@nodes.source(tag="users", pipeline="analytics", env=["dev", "prod"])
def load_users(spark: SparkSession) -> DataFrame: ...

@nodes.transform(tag="clean", pipeline="analytics", depends_on=["users", "orders"])
def clean(users_df: DataFrame, orders_df: DataFrame) -> DataFrame: ...
```

**Invalid:**

```python
# 'tag' should be string, not list
@nodes.source(tag=["users"], pipeline="analytics", env=["dev"])
def load_users(spark: SparkSession) -> DataFrame: ...

# 'env' should be list, not string
@nodes.source(tag="users", pipeline="analytics", env="dev")
def load_users(spark: SparkSession) -> DataFrame: ...

# 'depends_on' should be list, not string
@nodes.transform(tag="clean", pipeline="analytics", depends_on="users")
def clean(users_df: DataFrame) -> DataFrame: ...
```

**Error Messages:**

```
ERROR: Invalid type for decorator argument 'tag'
Expected: string
Found: list

ERROR: Invalid type for decorator argument 'env'
Expected: list of strings
Found: string

ERROR: Invalid type for decorator argument 'depends_on'
Expected: list of strings
Found: string
```
