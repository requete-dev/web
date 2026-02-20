---
sidebar_position: 11
title: "Category 10: Pipeline Configuration"
---

# Category 10: Pipeline Configuration

These rules validate `requete.yaml` pipeline configuration against Python pipeline code. Diagnostics appear in **both** Python files (on decorator lines) and `requete.yaml` files (on line 1).

---

### Rule 10.1: Missing Pipeline Config

**Rule:** Every pipeline referenced in Python node decorators must have a corresponding `requete.yaml` file.

**Severity:** Error

**Squiggly Location:** Python decorator line

**Valid:**

```
pipelines/
  analytics/
    requete.yaml          # Config exists for pipeline "analytics"
    source.py             # @nodes.source(tag="users", pipeline="analytics", ...)
```

**Invalid:**

```
pipelines/
  analytics/
    source.py             # No requete.yaml for pipeline "analytics"
```

**Error Message:**

```
No requete.yaml found for pipeline 'analytics'
```

---

### Rule 10.2: Duplicate Pipeline Config

**Rule:** A pipeline name must not be defined in multiple `requete.yaml` files.

**Severity:** Error

**Squiggly Location:** Python decorator line + YAML file line 1

**Valid:**

```
pipelines/
  analytics/
    requete.yaml          # pipeline: analytics -- Only one config
```

**Invalid:**

```
pipelines/
  analytics/
    requete.yaml          # pipeline: analytics
  analytics_v2/
    requete.yaml          # pipeline: analytics -- Duplicate!
```

**Error Message:**

```
Multiple requete.yaml files define pipeline 'analytics': /path/a/requete.yaml, /path/b/requete.yaml
```

---

### Rule 10.3: Invalid Python Version

**Rule:** The `python_version` field in `requete.yaml` must be a supported version. Supported versions: `3.10`, `3.11`, `3.12`, `3.13`. Omitting `python_version` (using the default) is valid and does not trigger this rule.

**Severity:** Error

**Squiggly Location:** Python decorator line + YAML file line 1

**Valid:**

```yaml
# requete.yaml
pipeline: analytics
python_version: "3.12" # Supported version
dependencies:
  - pyspark==3.5.0
```

```yaml
# requete.yaml
pipeline: analytics # No python_version -- uses default
dependencies:
  - pyspark==3.5.0
```

**Invalid:**

```yaml
# requete.yaml
pipeline: analytics
python_version: "3.8" # Not supported
dependencies:
  - pyspark==3.5.0
```

**Error Message:**

```
Invalid python_version '3.8' in requete.yaml for pipeline 'analytics'
Supported versions: 3.10, 3.11, 3.12, 3.13
```

---

### Rule 10.4: Missing Engine Dependency

**Rule:** If a session node uses a specific engine, the pipeline's `requete.yaml` must include the corresponding dependency. Engine-to-dependency mapping:

| Engine      | Required Dependency  |
| ----------- | -------------------- |
| `spark`     | `pyspark`            |
| `duckdb`    | `duckdb`             |
| `snowflake` | `snowflake-snowpark` |

Uses package name matching (e.g., `pyspark==3.5.0` satisfies the `pyspark` requirement).

**Severity:** Error

**Squiggly Location:** Python session decorator line + YAML file line 1

**Valid:**

```yaml
# requete.yaml
pipeline: analytics
dependencies:
  - pyspark==3.5.0 # Satisfies spark engine requirement
```

```python
@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def create_session() -> SparkSession: ...
```

**Invalid:**

```yaml
# requete.yaml
pipeline: analytics
dependencies:
  - pandas>=2.0 # Missing pyspark for spark engine
```

```python
@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def create_session() -> SparkSession: ...
```

**Error Message:**

```
Session uses engine 'spark' but requete.yaml for pipeline 'analytics' is missing dependency 'pyspark'
```

---

### Rule 10.5: Missing JAVA_HOME for Spark

**Rule:** If a session node uses `engine="spark"`, the pipeline's `requete.yaml` must set `JAVA_HOME` in the `env` section — either under `env.spark` or `env.common`. Without it, the JVM cannot be located and the spark engine will fail to start. See [requete.yaml env configuration](/docs/reference/requete-yaml#env) for how env vars are resolved.

**Severity:** Error

**Squiggly Location:** Python session decorator line + YAML file line 1

**Valid:**

```yaml
# requete.yaml
pipeline: analytics
dependencies:
  - pyspark==3.5.0
env:
  spark:
    JAVA_HOME: "/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home"
```

```python
@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def create_session() -> SparkSession: ...
```

**Invalid:**

```yaml
# requete.yaml
pipeline: analytics
dependencies:
  - pyspark==3.5.0
# No env section, or env section without JAVA_HOME
```

```python
@nodes.session(tag="spark_dev", pipeline="analytics", engine="spark", env=["dev"])
def create_session() -> SparkSession: ...
```

**Error Message:**

```
JAVA_HOME not set in requete.yaml env section for pipeline 'analytics'. Spark engine requires JAVA_HOME to locate the JVM.
```

Other env vars (`SPARK_LOCAL_DIRS`, `PYSPARK_SUBMIT_ARGS`, `DUCKDB_TMPDIR`, `TMPDIR`) have built-in defaults and are not validated.

---

## Appendix: Complete Validation Checklist

When the LSP validates a file, it checks:

**Per Node:**

- [ ] Tag is not empty
- [ ] Tag is unique within (node_type, env)
- [ ] Environment names are valid
- [ ] Engine name is valid (for sessions)
- [ ] Dependencies exist
- [ ] No circular dependencies
- [ ] Parameter count matches dependencies
- [ ] Parameter order matches dependencies
- [ ] Return type is correct for node type
- [ ] Type hints present
- [ ] Imports match declared engine (session nodes)
- [ ] Only PySpark imports used (non-session nodes)
- [ ] Source has exactly 1 parameter (session)
- [ ] BackfillSource has exactly 2 parameters (session, context: dict)

**Per File:**

- [ ] Required imports present
- [ ] No syntax errors
- [ ] Decorators used correctly

**Cross-File:**

- [ ] Same tag across engines is consistent
- [ ] All envs covered by I/O nodes
- [ ] Promote nodes have promotion tests
- [ ] DAG is acyclic
- [ ] No orphaned nodes
- [ ] Pipeline has `requete.yaml` config
- [ ] No duplicate `requete.yaml` for same pipeline
- [ ] `python_version` is supported (if set)
- [ ] Engine dependencies present in `requete.yaml`
- [ ] `JAVA_HOME` set in `env` section when spark engine is used

**At Build Time:**

- [ ] All validations pass
- [ ] Topological sort succeeds
- [ ] Artifact can be generated
