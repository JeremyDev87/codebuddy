# ADR-004: v2.0.0 Deprecation Removals

## Status
Proposed

## Date
2026-01-11

## Context

As the codebase evolves, certain APIs and patterns become deprecated in favor of better alternatives. These deprecations need to be tracked and removed in a coordinated manner during major version releases to maintain a clean API surface.

This ADR documents the deprecations scheduled for removal in v2.0.0 to ensure:
1. Users have advance notice of breaking changes
2. Migration paths are documented
3. The development team has a clear roadmap for cleanup

## Decision

The following deprecated items will be removed in v2.0.0:

### ConfigService

| Deprecated | Replacement | File | Reason |
|------------|-------------|------|--------|
| `setProjectRoot()` | `setProjectRootAndReload()` | `src/config/config.service.ts:107` | Bypasses security validations and config reload. The secure method validates paths and reloads configuration automatically. |

### Keyword Types

| Deprecated | Replacement | File | Reason |
|------------|-------------|------|--------|
| `KOREAN_KEYWORD_MAP` | `LOCALIZED_KEYWORD_MAP` | `src/keyword/keyword.types.ts:230` | The new map supports 5 languages (EN, KO, JA, ZH, ES) instead of just Korean. |

### Model Constants

| Deprecated | Replacement | File | Reason |
|------------|-------------|------|--------|
| `SYSTEM_DEFAULT_MODEL` | `DEFAULT_MODEL` from `model.constants.ts` | `src/model/model.resolver.ts:12` | Consolidation of model constants into a single source file. |
| `CLAUDE_HAIKU_35` | N/A (remove usage) | `src/model/model.constants.ts:22` | Not recommended for coding tasks due to limited capability. Use Sonnet or Opus instead. |

### MCP Handlers

| Deprecated | Replacement | File | Reason |
|------------|-------------|------|--------|
| `SessionHandler` | `ContextDocumentHandler` | `src/mcp/handlers/index.ts:85` | Context Document System (ADR-003) provides better context persistence across compaction. |
| `ToolResult` type | `ToolResponse` from `response.utils` | `src/mcp/handlers/base.handler.ts:184` | Naming consolidation for consistency. |

## Migration Guide

### setProjectRoot() → setProjectRootAndReload()

**Before (v1.x):**
```typescript
configService.setProjectRoot('/path/to/project');
await configService.loadProjectConfig(); // Manual reload required
```

**After (v2.0):**
```typescript
await configService.setProjectRootAndReload('/path/to/project');
// Automatically validates path and reloads config
```

### KOREAN_KEYWORD_MAP → LOCALIZED_KEYWORD_MAP

**Before (v1.x):**
```typescript
import { KOREAN_KEYWORD_MAP } from './keyword.types';
const koreanKeywords = KOREAN_KEYWORD_MAP.PLAN;
```

**After (v2.0):**
```typescript
import { LOCALIZED_KEYWORD_MAP } from './keyword.types';
const koreanKeywords = LOCALIZED_KEYWORD_MAP.PLAN.ko;
// Also available: .en, .ja, .zh, .es
```

### SessionHandler → ContextDocumentHandler

**Before (v1.x):**
```typescript
import { SessionHandler } from './handlers';
// Used session documents that didn't survive context compaction
```

**After (v2.0):**
```typescript
import { ContextDocumentHandler } from './handlers';
// Context persists across compaction via fixed file path
```

## Consequences

### Positive
- Cleaner API surface with secure-by-default patterns
- Better i18n support with multi-language keyword maps
- Improved context persistence across AI conversation compaction
- Consistent naming conventions across the codebase

### Negative
- Breaking changes require users to update their code
- Existing tests using deprecated APIs need updates

### Neutral
- Major version bump (v2.0.0) signals breaking changes clearly
- Deprecation warnings in v1.x provide migration time

## Timeline

1. **v1.x (Current)**: Deprecation warnings are present in code
2. **v1.x → v2.0**: Document migration in CHANGELOG
3. **v2.0.0**: Remove deprecated code and update all usages

## Related

- [ADR-003: Context Document System](./ADR-003-context-document-system.md)
- `src/config/config.service.ts` - ConfigService implementation
- `src/keyword/keyword.types.ts` - Keyword type definitions
