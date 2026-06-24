---
name: "api-documenter"
description: "Generates API documentation from code comments (Swagger, OpenAPI, JSDoc). Invoke when user needs API docs or when API changes."
---

# API Documenter

This skill generates comprehensive API documentation from code and comments.

## When to Use

- When user asks for API documentation
- After making API changes
- When building RESTful APIs
- When user mentions "Swagger", "OpenAPI", "JSDoc", or "API docs"

## Supported Formats

- **OpenAPI/Swagger**: REST API documentation
- **JSDoc**: JavaScript/TypeScript code documentation
- **API Blueprint**: API specification format
- **Markdown**: Human-readable documentation

## Execution Steps

1. Analyze the codebase for API routes/endpoints
2. Extract comments and annotations from the code
3. Generate documentation in the appropriate format:

### JSDoc Generation
```bash
npx jsdoc -c jsdoc.config.json
```

### OpenAPI Generation
- Parse route definitions
- Extract request/response schemas
- Generate YAML/JSON spec file

4. Create interactive documentation if possible (Swagger UI, Redoc)

## Documentation Structure

### REST API Documentation

```yaml
openapi: 3.0.0
info:
  title: API Title
  version: 1.0.0
paths:
  /api/endpoint:
    get:
      summary: Description
      parameters: [...]
      responses:
        200:
          description: Success
          content:
            application/json:
              schema: {...}
```

### JSDoc Example

```typescript
/**
 * Fetches user data by ID
 * @param {number} id - User ID
 * @returns {Promise<User>} User data
 * @throws {Error} When user not found
 */
async function getUser(id: number): Promise<User> {
  // implementation
}
```

## Output Format

- Generated documentation files
- Link to interactive documentation (if applicable)
- Summary of endpoints documented

## Best Practices

- Keep API comments up-to-date
- Use standard annotations
- Include examples for request/response
- Document error responses
