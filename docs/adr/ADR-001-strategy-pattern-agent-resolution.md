# ADR-001: Strategy Pattern for Agent Resolution

## Status

Accepted

## Date

2026-01-11

## Context

The `primary-agent-resolver.ts` file had grown to 1,404 lines with mixed responsibilities:
- Mode-specific agent resolution logic (PLAN, ACT, EVAL)
- Intent pattern matching
- Context-based inference
- Configuration loading
- Caching

This violated the Single Responsibility Principle and made the code difficult to test and maintain. Each mode had distinct resolution logic that was interleaved with shared code.

## Decision

Implement the **Strategy Pattern** to separate mode-specific resolution logic:

```
PrimaryAgentResolver (173 lines)
    ├── PlanAgentStrategy (158 lines)
    ├── ActAgentStrategy (284 lines)
    └── EvalAgentStrategy (38 lines)
```

Each strategy implements the `ResolutionStrategy` interface:

```typescript
export interface ResolutionStrategy {
  resolve(ctx: StrategyContext): Promise<PrimaryAgentResolutionResult>;
}
```

### Implementation Details

1. **PlanAgentStrategy**: Resolves `solution-architect` or `technical-planner` based on architecture/planning keywords
2. **ActAgentStrategy**: Multi-factor resolution (explicit request → recommended agent → config → intent patterns → context → default)
3. **EvalAgentStrategy**: Always returns `code-reviewer` (stateless, simple)

Intent patterns were also extracted to separate files in `keyword/patterns/`:
- `agent.patterns.ts`
- `backend.patterns.ts`
- `mobile.patterns.ts`
- etc.

## Consequences

### Positive

- **88% code reduction** in main resolver file (1,404 → 173 lines)
- **Improved testability**: Each strategy can be tested in isolation
- **Open/Closed Principle**: New modes can be added without modifying existing code
- **Clearer ownership**: Mode-specific bugs are localized to their strategy
- **96.43% test coverage** maintained after refactoring

### Negative

- More files to navigate (mitigation: clear directory structure and index exports)
- Slight indirection when debugging (mitigation: descriptive logging with mode context)

### Neutral

- No runtime performance impact (strategies are instantiated once in constructor)

## Security Considerations

- **No new attack surface**: This refactoring is purely internal code organization; no new APIs or user-facing interfaces are introduced
- **Existing controls preserved**: All existing input validation and security checks remain in place
- **Pattern files are read-only**: Intent patterns are compile-time constants, not runtime-configurable

## Related

- [Phase 3: Medium Priority - Code Quality](../codingbuddy/plan/2026-01-11-code-quality-phase3-medium.md)
- Files: `src/keyword/strategies/`, `src/keyword/primary-agent-resolver.ts`
