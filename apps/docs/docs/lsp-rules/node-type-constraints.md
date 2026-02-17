---
sidebar_position: 5
title: "Category 4: Node Type Constraints"
---

# Category 4: Node Type Constraints

### Rule 4.1: Transform Nodes Have No Environment Parameter

**Rule:** `@nodes.transform()` must not have an `env` parameter.

**Valid:**

```python
@nodes.transform(tag="clean", pipeline="main", depends_on=["raw"])
def clean(raw_df: DataFrame) -> DataFrame: ...
```

**Invalid:**

```python
@nodes.transform(tag="clean", pipeline="main", env=["dev"], depends_on=["raw"])
def clean(raw_df: DataFrame) -> DataFrame: ...
```

**Error Message:**

```
Transform nodes cannot have 'env' parameter
Transforms are environment-agnostic and run wherever their dependencies run
Remove 'env' parameter from transform 'clean'
```
