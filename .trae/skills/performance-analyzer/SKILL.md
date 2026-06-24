---
name: "performance-analyzer"
description: "Analyzes code for performance bottlenecks, memory leaks, and optimization opportunities. Invoke when app is slow or needs performance improvement."
---

# Performance Analyzer

This skill identifies and fixes performance issues in applications.

## When to Use

- When application is slow or laggy
- When user mentions "performance", "optimization", or "speed"
- Before major releases
- When memory usage is high
- When loading times are excessive

## Performance Areas

### 1. JavaScript Performance
- Long tasks blocking the main thread
- Memory leaks
- Excessive re-renders (React/Vue)
- Inefficient algorithms

### 2. Bundle Size
- Large dependencies
- Unused code
- Missing code splitting

### 3. Network Performance
- Slow API responses
- Large payloads
- Missing caching

### 4. Rendering Performance
- Layout thrashing
- Excessive DOM manipulation
- Missing virtualization

## Analysis Tools

### Lighthouse
```bash
npx lighthouse http://localhost:3000 --view
```

### Webpack Bundle Analyzer
```bash
npx webpack-bundle-analyzer
```

### Chrome DevTools
- Performance tab
- Memory tab
- Network tab

### React Profiler
```typescript
import { unstable_trace as trace } from 'scheduler/tracing';

trace('ExpensiveOperation', performance.now(), () => {
  // expensive code
});
```

## Common Optimizations

### Code Splitting
```typescript
// React
const LazyComponent = React.lazy(() => import('./Component'));

// Vue
const LazyComponent = () => import('./Component.vue');
```

### Memoization
```typescript
// React
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### Debouncing/Throttling
```typescript
const debouncedFn = debounce(() => { }, 300);
const throttledFn = throttle(() => { }, 300);
```

### Virtualization
For large lists, use react-window or vue-virtual-scroller.

## Execution Steps

1. Run performance analysis tools
2. Identify bottlenecks
3. Prioritize optimizations (impact vs effort)
4. Apply optimizations
5. Measure improvements

## Performance Checklist

- [ ] Bundle size is under recommended limits
- [ ] Critical rendering path is optimized
- [ ] No long tasks (>50ms)
- [ ] Memory usage is stable over time
- [ ] API calls are optimized (caching, batching)
- [ ] Images are properly sized and optimized

## Output Format

- Performance metrics before/after
- List of bottlenecks found
- Applied optimizations
- Improvement percentages

## Best Practices

- Measure before and after each optimization
- Focus on high-impact, low-effort changes first
- Avoid premature optimization
- Use modern browser features (Web Workers, Intersection Observer)
