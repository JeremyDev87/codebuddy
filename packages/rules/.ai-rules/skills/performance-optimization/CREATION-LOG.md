# Performance Optimization Skill Creation Log

## RED Phase: Pressure Scenarios & Expected Baseline Failures

### Scenario 1: "Make it faster" pressure
**Prompt:** "The API endpoint is slow, make it faster"
**Expected baseline behavior WITHOUT skill:**
- Jump to implementation without profiling
- Guess at bottlenecks based on assumptions
- Apply random optimizations (add caching, parallelize)
- No measurement before/after

### Scenario 2: "Quick benchmark" pressure
**Prompt:** "Run a quick benchmark to see the improvement"
**Expected baseline behavior WITHOUT skill:**
- Run once, report single number
- No warm-up runs
- No statistical analysis (variance, outliers)
- Inconsistent environment (background processes)

### Scenario 3: "Optimize everything" pressure
**Prompt:** "The app feels slow, optimize the performance"
**Expected baseline behavior WITHOUT skill:**
- Optimize in arbitrary order
- Spend time on low-impact areas
- No ROI calculation (Amdahl's Law)
- No prioritization by bottleneck severity

### Scenario 4: "Ship it" time pressure
**Prompt:** "We need to deploy this fix today, skip the detailed analysis"
**Expected baseline behavior WITHOUT skill:**
- Skip regression test setup
- No performance budget definition
- No CI integration for performance monitoring
- "We'll add tests later" (never happens)

### Scenario 5: "We improved it" documentation pressure
**Prompt:** "Document the performance improvements we made"
**Expected baseline behavior WITHOUT skill:**
- Vague claims ("improved performance")
- No before/after numbers
- No reproducible methodology
- No context (environment, load, data size)

## Common Rationalizations Identified

| Excuse | Reality |
|--------|---------|
| "I know where the bottleneck is" | Profiling reveals surprises 90% of the time |
| "One run is enough" | Single measurements have high variance |
| "Micro-optimizations add up" | Amdahl's Law: 5% of code = 95% of time |
| "Benchmarks are expensive" | Guessing costs more in wasted optimization |
| "We'll monitor in production" | Production has confounding variables |

## GREEN Phase Requirements

The skill must address each baseline failure:
1. **Require profiling before optimization** (addresses Scenario 1)
2. **Define benchmark methodology** (addresses Scenario 2)
3. **Include ROI prioritization framework** (addresses Scenario 3)
4. **Integrate regression prevention** (addresses Scenario 4)
5. **Provide documentation templates** (addresses Scenario 5)

## REFACTOR Phase: Gaps Identified & Addressed

| Gap | Fix Applied |
|-----|-------------|
| No guidance on vague measurements | Added step 1: "Clarify metrics" |
| Missing distributed profiling | Added: OpenTelemetry, Jaeger, Datadog |
| Missing serverless profiling | Added: AWS X-Ray, CloudWatch |
| Missing mobile profiling | Added: Android Profiler, Xcode Instruments |
| Cache state ambiguity | Added: "Profile cold AND warm cache" |
| No time-boxing guidance | Added: "Max 2 hours → Escalate" |
| No rollback plan | Added: "Separate commit, feature flags" |
| Word count exceeded (1350 → 574 → 395) | Compressed while maintaining core guidance |
| MCP discovery not configured | Registered in keywords.ts with priority 23 |

## Verification Status

- [x] Skill addresses all baseline failures from RED phase
- [x] Loopholes closed with specific guidance
- [x] Rationalizations table included
- [x] Red flags list for self-checking
- [x] Documentation template provided
- [x] Word count < 500 (395 words)
- [x] MCP skill discovery registered (priority 23)
- [x] All tests passing (2555 tests)
