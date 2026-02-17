---
sidebar_position: 3
title: "Category 2: Dependency Graph"
---

# Category 2: Dependency Graph

### Rule 2.1: Dependency Existence

**Rule:** All tags referenced in `depends_on` lists must exist as nodes.

**Valid:**

```python
@nodes.source(tag="users", pipeline="main", env=["dev"])
def load_users(...): ...

@nodes.transform(tag="cleaned", pipeline="main", depends_on=["users"])  # 'users' exists
def clean(...): ...
```

**Invalid:**

```python
@nodes.transform(tag="cleaned", pipeline="main", depends_on=["users"])  # 'users' not found
def clean(...): ...
```

**Error Message:**

```
Dependency 'users' not found in depends_on list for node 'cleaned'
Available nodes: orders, products, sessions
```

**Fix Suggestion:**

- Create a node with tag 'users', or
- Check for typos in the tag name, or
- Verify the dependency is defined in the correct environment

---

### Rule 2.2: No Circular Dependencies

**Rule:** The DAG must be acyclic (no node can depend on itself transitively).

**Invalid:**

```python
@nodes.transform(tag="a", pipeline="main", depends_on=["b"])
def transform_a(...): ...

@nodes.transform(tag="b", pipeline="main", depends_on=["c"])
def transform_b(...): ...

@nodes.transform(tag="c", pipeline="main", depends_on=["a"])  # Circular!
def transform_c(...): ...
```

**Error Message:**

```
Circular dependency detected: a -> b -> c -> a
Remove one of these dependencies to break the cycle
```

---

### Rule 2.3: Dependency Parameter Naming Convention

**Rule:** Function parameter names must be the dependency tag name with a `_df` suffix, in the same order as the `depends_on` list.

**Valid:**

```python
@nodes.transform(tag="joined", pipeline="main", depends_on=["users", "orders"])
def join(users_df: DataFrame, orders_df: DataFrame) -> DataFrame:
    #      ^^^^^^^^          ^^^^^^^^^
    #      "users" + "_df"   "orders" + "_df"
    #      First param       Second param
    #      matches           matches
    #      first dep         second dep
    ...
```

**Invalid:**

```python
# Missing _df suffix
@nodes.transform(tag="joined", pipeline="main", depends_on=["users", "orders"])
def join(users: DataFrame, orders: DataFrame) -> DataFrame:
    ...

# Wrong order (even with _df suffix)
@nodes.transform(tag="joined", pipeline="main", depends_on=["users", "orders"])
def join(orders_df: DataFrame, users_df: DataFrame) -> DataFrame:
    ...
```

**Error Message:**

```
Parameter naming mismatch in 'joined':
  depends_on: ["users", "orders"]
  parameters: (users, orders)

Expected parameter names: (users_df, orders_df)
Parameter names must be: <dependency_tag>_df
```

---

### Rule 2.4: Dependency Parameter Count

**Rule:** Number of function parameters must match number of dependencies.

**Valid:**

```python
@nodes.transform(tag="joined", pipeline="main", depends_on=["users", "orders"])
def join(users_df: DataFrame, orders_df: DataFrame) -> DataFrame: ...
#        ^^^^^^^^ param 1     ^^^^^^^^^^ param 2
#        2 params = 2 dependencies
```

**Invalid:**

```python
@nodes.transform(tag="joined", pipeline="main", depends_on=["users", "orders"])
def join(users_df: DataFrame) -> DataFrame: ...  # Only 1 param!
```

**Error Message:**

```
Parameter count mismatch in 'joined':
  depends_on has 2 dependencies: ["users", "orders"]
  function has 1 parameter: (users)

Add parameter: orders: DataFrame
```
