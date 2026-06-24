---
name: "unit-test-generator"
description: "Generates unit tests for code using Jest, Vitest, or other test frameworks. Invoke when user asks to add tests or improve test coverage."
---

# Unit Test Generator

This skill generates comprehensive unit tests for your codebase.

## When to Use

- When user asks to add tests for new features
- When test coverage is low
- When refactoring code to ensure regression safety
- When user mentions "test", "Jest", "Vitest", or "coverage"

## Supported Frameworks

- **Jest**: React, Vue, Node.js
- **Vitest**: Vite-based projects
- **Jasmine**: Angular projects
- **pytest**: Python projects

## Execution Steps

1. Analyze the code to identify testable functions/components
2. Identify edge cases and expected behaviors
3. Generate test files with appropriate naming conventions:
   - `<filename>.test.ts` / `<filename>.spec.ts`
   - `__tests__/<filename>.test.ts`

4. Write comprehensive test cases covering:
   - Normal usage scenarios
   - Edge cases (null, undefined, empty inputs)
   - Error handling
   - Async operations
   - Component rendering

5. Run tests to verify they pass

## Test Structure

```typescript
describe('Component/Function Name', () => {
  test('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
  
  test('should handle edge case', () => {
    // Test edge case
  });
  
  test('should throw error when', () => {
    // Test error handling
  });
});
```

## Output Format

- List of generated test files
- Test coverage report
- Any failing tests with error messages

## Best Practices

- Follow AAA (Arrange-Act-Assert) pattern
- Keep tests focused and isolated
- Use descriptive test names
- Mock external dependencies
