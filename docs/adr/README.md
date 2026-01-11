# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records documenting significant architectural decisions made in the Codingbuddy project.

## ADR Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](./ADR-001-strategy-pattern-agent-resolution.md) | Strategy Pattern for Agent Resolution | Accepted | 2026-01-11 |
| [ADR-002](./ADR-002-session-module-decomposition.md) | Session Module Decomposition | Accepted | 2026-01-11 |
| [ADR-003](./ADR-003-context-document-system.md) | Context Document System | Accepted | 2026-01-11 |
| [ADR-004](./ADR-004-v2-deprecation-removals.md) | v2.0.0 Deprecation Removals | Proposed | 2026-01-11 |

## ADR Format

Each ADR follows the standard format:

```markdown
# ADR-NNN: Title

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Date
YYYY-MM-DD

## Context
[Problem description and background]

## Decision
[The decision made and implementation details]

## Consequences
### Positive
[Benefits]

### Negative
[Drawbacks and mitigations]

### Neutral
[Trade-offs]

## Related
[Related documents and files]
```

## Creating New ADRs

1. Copy the template above
2. Use sequential numbering: `ADR-NNN-descriptive-title.md`
3. Update this index file with the new entry

## Related Documentation

- [Code Quality Plans](../codingbuddy/plan/)
- [Session Documents](../codingbuddy/sessions/)
