---
sidebar_position: 1
title: "Overview"
---

# LSP Validation Rules

Requete provides real-time validation as you write code, surfacing errors and warnings directly in your IDE. Rules are enforced at three levels: edit time (inline diagnostics as you type), build time ([CLI](/docs/reference/cli) validation before artifact generation), and CI time (automated checks in continuous integration).

**What validation helps you with:**

- Catch errors before runtime
- Ensure DAG consistency across environments
- Prevent common configuration mistakes
- Get helpful error messages with suggested fixes

## Categories

1. [Category 1: Tag Identity](./tag-identity)
2. [Category 2: Dependency Graph](./dependency-graph)
3. [Category 3: Environment Coverage](./environment-coverage)
4. [Category 4: Node Type Constraints](./node-type-constraints)
5. [Category 5: Cross-Engine Consistency](./cross-engine-consistency)
6. [Category 6: Engine Configuration](./engine-configuration)
7. [Category 7: Decorator Arguments](./decorator-arguments)
8. [Category 8: Function Signatures](./function-signatures)
9. [Category 9: Test Validation](./test-validation)
10. [Category 10: Pipeline Configuration](./pipeline-configuration)

## Validation Severity Levels

### Error (Build Fails)

These violations prevent artifact generation:

- Missing dependencies
- Circular dependencies
- Duplicate tags in same env
- Missing promotion tests for promote nodes
- Wrong return types
- Parameter count/order mismatch
- Invalid engine/environment names
- Missing required imports
- Non-PySpark imports in non-session nodes

**In your IDE:** Red underlines; build fails with an error message

---

### Warning (Build Succeeds)

These are code quality issues but do not block builds:

- Non-descriptive tag names
- Missing type hints
- Unused imports
- Engine-specific imports (when cross-engine compatibility is desired)
- Missing docstrings

**In your IDE:** Yellow underlines; build succeeds with warnings

---

### Info (Suggestions)

Helpful suggestions that do not indicate problems:

- "Consider adding integration tests"
- "This transform has no unit tests"
- "Similar tag exists in other file"

**In your IDE:** Blue info indicators; no impact on build

---

## Error Message Format

Requete validation errors are designed to be actionable. Each error clearly states the problem, shows what was found vs. expected, and suggests a specific fix.

**Example:**

```
Error: Missing promotion test for 'promote_results' (promote_table.py:15)

Promote nodes require matching promotion tests.

Expected:
  @tests.promotion_test(tag="promote_results", env=["prod"])
  def test_promote_results(data: DataFrame):
      assert data.count() > 0

Fix: Add promotion test in the same file or a separate test file
```
