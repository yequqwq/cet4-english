---
name: "code-formatter"
description: "Formats code according to project standards (Prettier, ESLint, Stylelint). Invoke when code has formatting issues or before commit."
---

# Code Formatter

This skill formats code files according to project standards and best practices.

## When to Use

- When code has formatting issues (indentation, spacing, line length)
- Before committing changes to ensure consistent code style
- When user mentions "format code", "lint", or "prettier"

## Supported Tools

- **Prettier**: JavaScript, TypeScript, HTML, CSS, JSON
- **ESLint**: JavaScript/TypeScript linting
- **Stylelint**: CSS/SCSS linting
- **Black**: Python formatting
- **gofmt**: Go formatting

## Execution Steps

1. Check for existing configuration files:
   - `.prettierrc` / `prettier.config.js`
   - `.eslintrc` / `eslint.config.js`
   - `.stylelintrc`

2. Run the appropriate formatting tool based on file type:
   ```bash
   # JavaScript/TypeScript
   npx prettier --write "src/**/*.{js,ts,tsx,jsx}"
   npx eslint --fix "src/**/*.{js,ts,tsx,jsx}"
   
   # CSS/SCSS
   npx stylelint --fix "src/**/*.{css,scss}"
   
   # JSON
   npx prettier --write "*.json"
   ```

3. Report which files were formatted and any issues found.

## Output Format

- List of formatted files
- Any errors that couldn't be auto-fixed
- Summary of formatting changes

## Best Practices

- Always check for existing config files before formatting
- Run formatting on staged files only if using git
- Preserve original formatting for auto-generated files
