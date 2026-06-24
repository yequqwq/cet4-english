---
name: "dependency-checker"
description: "Checks for outdated dependencies, security vulnerabilities, and unused packages. Invoke when maintaining dependencies or before deployment."
---

# Dependency Checker

This skill analyzes project dependencies for security, updates, and efficiency.

## When to Use

- Before deploying to production
- Periodically to check for updates
- When user mentions "npm audit", "security", or "dependencies"
- When project has outdated packages
- After security alerts are received

## Checks Performed

### 1. Security Vulnerabilities
```bash
npm audit
npm audit --production
```

### 2. Outdated Packages
```bash
npm outdated
npx npm-check-updates
```

### 3. Unused Dependencies
```bash
npx depcheck
```

### 4. License Compliance
Check for restrictive licenses in dependencies.

### 5. Peer Dependency Issues
Verify peer dependencies are satisfied.

## Execution Steps

1. Run security audit
2. Check for outdated packages
3. Identify unused dependencies
4. Generate report with:
   - Critical security issues (priority)
   - Recommended updates
   - Unused packages to remove
   - License concerns

5. Provide recommendations for each finding

## Report Format

### Security Issues
| Severity | Package | Vulnerability | Fix |
|----------|---------|---------------|-----|
| Critical | lodash | CVE-2023-XXX | Upgrade to 4.17.21 |

### Outdated Packages
| Package | Current | Latest | Action |
|---------|---------|--------|--------|
| react | 18.0.0 | 18.2.0 | Update |

### Unused Packages
- package-a
- package-b

## Best Practices

- Run security audit regularly
- Keep dependencies up-to-date
- Remove unused packages
- Use lock files for reproducible builds
- Monitor security advisories for key packages

## Remediation

### Update a package
```bash
npm install package@latest
```

### Fix security issues
```bash
npm audit fix
```

### Remove unused package
```bash
npm uninstall unused-package
```

## Output Format

- Security audit results
- Outdated packages list
- Unused dependencies report
- Actionable recommendations

## Note

Always test after updating dependencies to ensure compatibility.
