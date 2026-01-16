# Major Upgrade Guide

Systematic approach to major version upgrades with breaking changes.

## When Major Upgrades Are Needed

- Current version reaches end-of-life
- Security vulnerability only fixed in major version
- Required feature only in major version
- Dependency chain requires newer version

## Breaking Change Analysis

### Step 1: Read the Changelog

**Completely.** Not skimming.

For each breaking change, document:

| Change | Current Usage | Impact | Migration |
|--------|---------------|--------|-----------|
| API renamed | 5 files | Low | Find/replace |
| Behavior changed | 3 modules | Medium | Logic update |
| Type changed | 15 imports | High | Refactor |

### Step 2: Search Your Codebase

```bash
# Find all usages of changed APIs
grep -r "deprecatedFunction" src/
grep -r "changedType" src/

# For TypeScript, also check type imports
grep -r "import.*{.*ChangedType" src/
```

### Step 3: Check Peer Dependencies

```bash
# List what depends on this package
npm ls <package>

# Check if peers also need updates
npm info <package>@<new-version> peerDependencies
```

## Staged Upgrade Strategy

For major version jumps (e.g., v2 to v5), never jump directly.

### Determine Intermediate Versions

```
Current: 2.4.1
Target: 5.2.0

Path: 2.4.1 → 3.0.0 → 4.0.0 → 5.0.0 → 5.2.0
```

### Benefits of Staged Upgrades

1. **Smaller changesets** - Easier to review and test
2. **Isolated failures** - Know which version broke
3. **Incremental migrations** - Handle deprecations step by step
4. **Rollback points** - Can stop at stable intermediate

### When to Skip Stages

Direct upgrade acceptable when:
- Comprehensive migration guide exists
- Breaking changes are well-documented
- Test coverage is high (>90%)
- Staging environment available

## Compatibility Testing Strategy

### Test Matrix

| Test Type | When | Coverage Target |
|-----------|------|-----------------|
| Unit tests | Every upgrade | 90%+ |
| Integration | Major versions | Critical paths |
| E2E | Before production | Happy paths |
| Performance | If perf-critical | Baseline comparison |

### Regression Checklist

Before each upgrade stage:

- [ ] All existing tests pass
- [ ] No new TypeScript errors
- [ ] No new console warnings
- [ ] Build size within 5% of baseline
- [ ] Critical user flows work manually

### Canary Testing

For high-risk upgrades:

1. Deploy to canary environment
2. Route 5% of traffic
3. Monitor error rates for 24 hours
4. Gradually increase traffic
5. Full rollout if stable

## Common Upgrade Patterns

### Pattern 1: Adapter Layer

Create abstraction to isolate changes:

```typescript
// Before: Direct usage spread across codebase
import { oldApi } from 'library';
oldApi.doThing();

// After: Centralized adapter
// src/adapters/library-adapter.ts
import { newApi } from 'library';

export function doThing() {
  // Translate old interface to new
  return newApi.doNewThing();
}

// Usage unchanged
import { doThing } from '@/adapters/library-adapter';
doThing();
```

### Pattern 2: Feature Flag Migration

Gradual migration with feature flags:

```typescript
const useNewLibraryVersion = featureFlags.get('USE_NEW_LIBRARY');

if (useNewLibraryVersion) {
  // New implementation
  newLibrary.process(data);
} else {
  // Old implementation (fallback)
  oldLibrary.process(data);
}
```

### Pattern 3: Parallel Running

Run both versions, compare results:

```typescript
async function processWithValidation(data: Input) {
  const [oldResult, newResult] = await Promise.all([
    oldLibrary.process(data),
    newLibrary.process(data),
  ]);

  if (!deepEqual(oldResult, newResult)) {
    logger.warn('Mismatch detected', { oldResult, newResult });
    // Use old result while investigating
    return oldResult;
  }

  return newResult;
}
```

## Deprecation Handling

### Types of Deprecations

| Type | Urgency | Action |
|------|---------|--------|
| **Hard removal** | Before upgrade | Must fix |
| **Soft deprecation** | Within 2 releases | Plan migration |
| **Warning only** | Low priority | Track for future |

### Finding Deprecation Warnings

```bash
# Run build and capture warnings
npm run build 2>&1 | grep -i deprecat

# Run tests with verbose output
npm test -- --verbose 2>&1 | grep -i deprecat
```

### Documenting Deprecation Debt

```markdown
## Deprecation Tracking

| Package | Deprecated API | Replacement | Files Affected | Target Version |
|---------|---------------|-------------|----------------|----------------|
| react | componentWillMount | useEffect | 5 | Remove in 18.x |
| lodash | _.pluck | _.map | 12 | Already removed |
```

## Rollback Planning

### Before Every Upgrade

1. **Document current state**
   ```bash
   npm ls > pre-upgrade-deps.txt
   git tag pre-upgrade-<package>-<date>
   ```

2. **Preserve lock file**
   ```bash
   cp package-lock.json package-lock.json.backup
   ```

3. **Test rollback procedure**
   - Can you revert package.json?
   - Does lock file restore work?
   - Are there database migrations?

### Rollback Triggers

Rollback immediately if:
- Error rate increases >5%
- Critical path failures
- Performance degrades >20%
- Security regression detected

### Rollback Procedure

```bash
# Revert package.json and lock file
git checkout HEAD~1 -- package.json package-lock.json

# Clean and reinstall
rm -rf node_modules
npm ci

# Verify rollback
npm test
npm run build
```

## Estimation Guidelines

| Factor | Multiplier |
|--------|------------|
| Well-documented migration guide | 1x |
| No migration guide | 2x |
| Breaking type changes | +0.5x per type |
| Behavior changes | +1x per behavior |
| Low test coverage (<60%) | 2x |
| No staging environment | 1.5x |

**Example estimation:**

```
Base: 2 hours
- No migration guide: 2x = 4 hours
- 3 breaking types: +1.5 hours
- Low test coverage: 2x = 11 hours
- Buffer (20%): 13.2 hours

Estimate: 2 days
```

## Upgrade Checklist Template

```markdown
## Upgrade: [package] v[X] → v[Y]

### Pre-upgrade
- [ ] Changelog reviewed
- [ ] Breaking changes documented
- [ ] Impact assessed (files: X, risk: High/Medium/Low)
- [ ] Tests baseline captured
- [ ] Rollback procedure documented

### Upgrade stages
- [ ] Stage 1: v[X] → v[X+1]
  - [ ] Tests passing
  - [ ] Build successful
  - [ ] Manual verification
- [ ] Stage N: v[Y-1] → v[Y]
  - [ ] Tests passing
  - [ ] Build successful
  - [ ] Manual verification

### Post-upgrade
- [ ] Full test suite passing
- [ ] Performance verified
- [ ] Deprecation warnings addressed
- [ ] Documentation updated
```
