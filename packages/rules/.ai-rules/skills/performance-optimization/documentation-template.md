# Performance Optimization Documentation Template

Use this template to document performance optimization work.

```markdown
# Performance Optimization: [Component Name]

## Problem Statement
[What was slow? How was it measured?]

## Profiling Results
- Tool used: [profiler name]
- Hot path: [function/query] - [X]% of time
- Secondary: [function] - [Y]% of time

## Baseline Benchmark
- Environment: [specs]
- Methodology: [warm-up] + [measured runs]
- Results:
  - Mean: [X]ms (std: [Y]ms)
  - p95: [Z]ms

## Optimization Applied
[What changed and why]

## Results
- Mean: [X]ms (std: [Y]ms) - [Z]% improvement
- p95: [X]ms - [Z]% improvement
- Bottleneck: [X]% -> [Y]% of total time

## Regression Prevention
- [ ] Benchmark test added
- [ ] CI performance gate configured
- [ ] Production monitoring enabled
```

## Example: Database Query Optimization

```markdown
# Performance Optimization: User Dashboard API

## Problem Statement
Dashboard API endpoint taking 2.1s mean response time (p95: 3.2s) under 100 concurrent users.

## Profiling Results
- Tool used: Datadog APM with distributed tracing
- Hot path: `getUserMetrics()` database query - 68% of time
- Secondary: JSON serialization - 12% of time

## Baseline Benchmark
- Environment: AWS t3.medium, PostgreSQL RDS db.t3.medium
- Methodology: 5 warm-up + 10 measured runs, 100 concurrent users
- Results:
  - Mean: 2100ms (std: 340ms)
  - p95: 3200ms

## Optimization Applied
Added composite index on (user_id, created_at) for metrics table.
Query plan changed from Seq Scan to Index Scan.

## Results
- Mean: 450ms (std: 65ms) - 78% improvement
- p95: 680ms - 79% improvement
- Bottleneck: 68% -> 22% of total time

## Regression Prevention
- [x] Benchmark test added: `api.bench.ts`
- [x] CI performance gate: fail if > 800ms p95
- [x] Production monitoring: Datadog dashboard with p95 alert > 1s
```
