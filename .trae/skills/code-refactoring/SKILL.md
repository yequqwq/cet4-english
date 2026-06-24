---
name: "code-refactoring"
description: "Refactors code for better readability, maintainability, and performance. Invoke when code has duplication, complexity, or smells."
---

# Code Refactoring

This skill improves code quality through systematic refactoring.

## When to Use

- When code has duplication (DRY violations)
- When functions/methods are too long (>100 lines)
- When code is hard to understand
- When user asks to "refactor", "clean up", or "improve" code
- When preparing code for production

## Common Refactoring Patterns

### 1. Extract Function
```typescript
// Before
function processData() {
  // 50 lines of processing logic
}

// After
function processData() {
  const cleaned = cleanData();
  const transformed = transformData(cleaned);
  return validateData(transformed);
}
```

### 2. Extract Class
When a function has too many responsibilities, create a class.

### 3. Replace Magic Numbers
```typescript
// Before
if (score > 90) { }

// After
const PASSING_SCORE = 90;
if (score > PASSING_SCORE) { }
```

### 4. Simplify Conditionals
```typescript
// Before
if (condition) {
  return true;
} else {
  return false;
}

// After
return condition;
```

### 5. Remove Dead Code
Delete unused variables, functions, and imports.

## Execution Steps

1. Analyze code for code smells:
   - Duplicate code
   - Long functions
   - Deep nesting
   - Magic numbers
   - Unused code

2. Create refactoring plan with specific changes

3. Apply refactoring changes incrementally

4. Run tests to ensure no regressions

5. Document the refactoring changes

## Code Quality Checklist

- [ ] Functions are focused (single responsibility)
- [ ] Variable/function names are descriptive
- [ ] No duplicated code
- [ ] Comments explain "why", not "what"
- [ ] Error handling is consistent
- [ ] Code follows project conventions

## Output Format

- List of refactored files
- Summary of changes made
- Before/after comparisons for key changes
- Test results after refactoring

## Best Practices

- Refactor in small increments
- Always run tests after each change
- Keep refactoring separate from feature changes
- Document significant architectural changes
