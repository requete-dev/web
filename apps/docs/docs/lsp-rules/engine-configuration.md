---
sidebar_position: 7
title: "Category 6: Engine Configuration"
---

# Category 6: Engine Configuration

### Rule 6.1: Engine Name Validation

**Rule:** Engine parameter must be a recognized engine type.

**Valid:**

```python
engine="spark"
engine="duckdb"
engine="snowflake"
```

**Invalid:**

```python
engine="my_custom_engine"  # Not recognized
```

**Error Message:**

```
Unknown engine 'my_custom_engine'
Supported engines: spark, duckdb, snowflake
```

**Configuration:** Valid engine names are configurable in `requete.yaml` or a similar config file.

---

### Rule 6.2: Required Engine Import Missing

**Rule:** Session files must import the correct session type for their declared engine.

**Severity:** Warning

**Valid:**

```python
# spark.py
from pyspark.sql import SparkSession  # Correct import present

@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev"])
def create_session() -> SparkSession: ...
```

**Invalid:**

```python
# spark.py - Missing expected import
@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev"])
def create_session() -> SparkSession: ...
```

**Warning Message:**

```
WARNING: Required engine import missing
Session 'node' uses engine 'spark' but required import not found
Expected: from pyspark.sql import SparkSession
```

**Expected Imports by Engine:**

- `spark`: `from pyspark.sql import SparkSession`
- `duckdb`: `from duckdb.experimental.spark.sql import SparkSession`
- `snowflake`: `from snowflake.snowpark import Session`

---

### Rule 6.3: Wrong Engine Import Present

**Rule:** Session files must NOT import session types from other engines (engines different from the declared engine).

**Severity:** Error

**Valid:**

```python
# duckdb.py
from duckdb.experimental.spark.sql import SparkSession  # Correct for duckdb

@nodes.session(tag="node", pipeline="main", engine="duckdb", env=["dev"])
def create_session() -> SparkSession: ...
```

**Invalid:**

```python
# duckdb.py
from pyspark.sql import SparkSession  # Wrong engine import!

@nodes.session(tag="node", pipeline="main", engine="duckdb", env=["dev"])
def create_session() -> SparkSession: ...
```

**Error Message:**

```
ERROR: Wrong engine import present
Session 'node' uses engine 'duckdb' but imports from 'pyspark.sql'
Remove: from pyspark.sql import SparkSession
Add: from duckdb.experimental.spark.sql import SparkSession
```

---

### Rule 6.4: Single Engine Per File

**Rule:** A Python file cannot contain session nodes for different engines. Each file should contain session nodes for only one engine.

**Rationale:** Mixing engines in a single file creates confusion and makes it unclear which engine context the file represents. Separate files for different engines (e.g., `spark.py`, `duckdb.py`) improves code organization.

**Valid:**

```python
# spark.py - All sessions use spark engine
@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def spark_dev_session() -> SparkSession: ...

@nodes.session(tag="spark_prod", pipeline="analytics", engine="spark", env=["prod"])
def spark_prod_session() -> SparkSession: ...
```

```python
# duckdb.py - All sessions use duckdb engine
@nodes.session(tag="duckdb_dev", pipeline="analytics", engine="duckdb", env=["dev"])
def duckdb_dev_session() -> SparkSession: ...
```

**Invalid:**

```python
# mixed_engines.py - Multiple engines in same file
@nodes.session(tag="spark_session", pipeline="analytics", engine="spark", env=["dev"])
def spark_session() -> SparkSession: ...

@nodes.session(tag="duckdb_session", pipeline="analytics", engine="duckdb", env=["dev"])
def duckdb_session() -> SparkSession: ...
```

**Error Message:**

```
Multiple engines found in same file:
  'spark_session' uses engine 'spark' (line 4)
  'duckdb_session' uses engine 'duckdb' (line 8)

Move session nodes for different engines into separate files
Example: spark.py, duckdb.py
```

---

### Rule 6.5: PySpark Imports Required for Non-Session Nodes

**Rule:** Transform, Source, BackfillSource, Sink, and Promote nodes must only import from PySpark modules. Imports from other engines' PySpark-compatible APIs (like DuckDB's `experimental.spark` or Snowpark) are forbidden.

**Severity:** Error

**Rationale:**

- Maintains API consistency across pipeline logic
- Leverages PySpark as the canonical reference implementation
- Prevents type ambiguity and ensures duck-typing compatibility
- Engine-specific imports belong only in Session nodes
- Facilitates engine switching at the session layer without modifying business logic

**Valid:**

```python
# transform.py - Transform node with PySpark imports
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, when

@nodes.transform(tag="clean_users", pipeline="analytics", depends_on=["users"])
def clean(users_df: DataFrame) -> DataFrame:
    return users_df.filter(col("age") > 0)
```

```python
# source.py - Source node with PySpark imports
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import StructType, StructField, StringType

@nodes.source(tag="users", pipeline="analytics", env=["dev", "prod"])
def load_users(spark: SparkSession) -> DataFrame:
    schema = StructType([StructField("name", StringType())])
    return spark.read.csv("users.csv", schema=schema)
```

**Invalid:**

```python
# transform.py - Transform with DuckDB import
from duckdb.experimental.spark import DataFrame  # ERROR!
from pyspark.sql.functions import col

@nodes.transform(tag="clean_users", pipeline="analytics", depends_on=["users"])
def clean(users_df: DataFrame) -> DataFrame:
    return users_df.filter(col("age") > 0)
```

```python
# source.py - Source with Snowpark import
from snowflake.snowpark import Session, DataFrame  # ERROR!

@nodes.source(tag="users", pipeline="analytics", env=["dev"])
def load_users(session: Session) -> DataFrame:
    return session.table("users")
```

```python
# sink.py - Sink with DuckDB import in TYPE_CHECKING
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from duckdb.experimental.spark import DataFrame  # ERROR! Still forbidden

from pyspark.sql.functions import col

@nodes.sink(tag="write_output", pipeline="analytics", env=["dev"], depends_on=["clean"])
def write_data(clean_df: DataFrame) -> None:
    clean_df.write.parquet("output.parquet")
```

**Error Message:**

```
ERROR: Non-session nodes must use PySpark imports only
Found import from 'duckdb.experimental.spark' (DuckDB's PySpark compatibility layer)
Remove: from duckdb.experimental.spark import ...
Use: from pyspark.sql import ... (or other pyspark.* modules)

Rationale: Transform, Source, Sink, and Promote nodes should use PySpark as the
canonical API for consistency and duck-typing compatibility.
Engine-specific imports belong only in Session nodes.
```

**Forbidden Import Patterns:**

- `duckdb.experimental.spark.*` -- DuckDB's PySpark compatibility layer
- `snowflake.snowpark.*` -- Snowpark DataFrame API

**Allowed Import Patterns:**

- `pyspark.sql.*` -- Core PySpark SQL types (DataFrame, SparkSession, Column, etc.)
- `pyspark.sql.functions.*` -- PySpark built-in functions
- `pyspark.sql.types.*` -- PySpark data types
- Any other `pyspark.*` modules

**Note:** Session nodes are exempt from this rule and should import from their declared engine (validated by Rules 6.2 and 6.3).
