---
sidebar_position: 4
title: "Category 3: Environment Coverage"
---

# Category 3: Environment Coverage

### Rule 3.1: I/O Node Environment Coverage

**Rule:** All I/O nodes (source, sink, promote) must cover all environments defined in session nodes.

**Valid:**

```python
# Sessions define: dev, staging, prod
@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev", "staging", "prod"])

# Source covers all envs
@nodes.source(tag="data", pipeline="main", env=["dev", "staging", "prod"])

# Sink covers all envs
@nodes.sink(tag="write", pipeline="main", env=["dev", "staging", "prod"], depends_on=["data"])
```

**Invalid:**

```python
# Sessions define: dev, staging, prod
@nodes.session(tag="node", pipeline="main", engine="spark", env=["dev", "staging", "prod"])

# Source missing staging
@nodes.source(tag="data", pipeline="main", env=["dev", "prod"])
```

**Error Message:**

```
Incomplete environment coverage for source 'data':
  Session envs: [dev, staging, prod]
  Source envs:  [dev, prod]
  Missing:      [staging]

Add implementation for env 'staging'
```

---

### Rule 3.2: Environment Name Validation

**Rule:** Environment names must be valid identifiers (alphanumeric + underscore).

**Valid:**

```python
env=["dev", "staging", "prod", "backfill", "qa_testing"]
```

**Invalid:**

```python
env=["dev-test"]      # Hyphen not allowed
env=["prod.backup"]   # Dot not allowed
env=["staging env"]   # Space not allowed
```

**Error Message:**

```
Invalid environment name 'dev-test'
Environment names must be alphanumeric with underscores only
Suggestion: use 'dev_test' instead
```
