# ADR-002: Session Module Decomposition

## Status

Accepted

## Date

2026-01-11

## Context

The `session.service.ts` file had grown to 1,122 lines with multiple responsibilities:
- Session document parsing (markdown to structured data)
- Session document serialization (structured data to markdown)
- In-memory caching with TTL
- File system operations
- I18n support for localized headings

The file contained complex parsing logic with i18n-aware heading detection, making it difficult to:
- Unit test parsing logic in isolation
- Add new session fields without touching multiple concerns
- Reason about cache invalidation

## Decision

Decompose the session module into focused, single-responsibility components:

```
session/
├── session.service.ts     (437 lines) - Orchestration and file I/O
├── session.parser.ts      (441 lines) - Markdown → SessionDocument
├── session.serializer.ts  (141 lines) - SessionDocument → Markdown
├── session.cache.ts       (165 lines) - LRU cache with TTL
└── session.types.ts       (types only)
```

### Component Responsibilities

1. **SessionService**: File operations, directory management, validation
2. **SessionParser**: Markdown parsing with i18n heading detection, section extraction
3. **SessionSerializer**: Consistent markdown output generation with locale support
4. **SessionCache**: Generic LRU cache with TTL, cache statistics

### Key Design Decisions

- **Pure functions for parsing/serialization**: `parseDocument()` and `serializeDocument()` are pure functions that can be tested without mocking
- **Immutable data**: Parser returns frozen objects to prevent accidental mutation
- **Lazy locale detection**: `LANGUAGE_TO_LOCALE` map in serializer for i18n support
- **Cache abstraction**: `SessionCache` is reusable for other caching needs

## Consequences

### Positive

- **61% reduction** in main service file (1,122 → 437 lines)
- **Pure functions** for parser/serializer enable property-based testing
- **Separation of concerns**: File I/O, parsing, serialization, caching are independent
- **Reusable cache**: `SessionCache` can be used by other services
- **Easier debugging**: Issues are localized to specific components

### Negative

- More files to understand the full flow (mitigation: clear naming and barrel exports)
- Import chains slightly longer (mitigation: index.ts re-exports)

### Neutral

- Memory usage unchanged (same data structures)
- Performance unchanged (same algorithms, just reorganized)

## Security Considerations

- **No sensitive data**: Session documents contain workflow context (decisions, notes) but no credentials or PII
- **File system access**: Uses existing `ConfigService` path validation to prevent path traversal
- **Cache isolation**: In-memory cache is instance-scoped; no cross-session data leakage
- **No code execution**: Parser handles markdown strings only; no eval or dynamic code execution

## Related

- [Phase 3: Medium Priority - Code Quality](../codingbuddy/plan/2026-01-11-code-quality-phase3-medium.md)
- Files: `src/session/`
