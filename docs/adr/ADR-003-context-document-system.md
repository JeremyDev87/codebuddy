# ADR-003: Context Document System

## Status

Accepted

## Date

2026-01-11

## Context

AI coding assistants using the MCP server need to maintain context across workflow modes (PLAN → ACT → EVAL). However, context compaction (automatic summarization of long conversations) causes loss of:
- Decisions made in PLAN mode
- Recommended agents for ACT mode
- Implementation notes and progress

This led to inconsistent behavior when conversations exceeded context limits, with the AI "forgetting" earlier decisions and recommendations.

## Decision

Implement a **file-based Context Document System** that persists workflow context to disk:

```
docs/codingbuddy/context.md
```

### Document Structure

```markdown
# Context Document

## Metadata
- Created: 2026-01-11T10:00:00Z
- Last Updated: 2026-01-11T12:30:00Z
- Task: Implement user authentication

## PLAN

### Decisions
- Use JWT for session management
- Store refresh tokens in httpOnly cookies

### Notes
- Consider rate limiting for login endpoint

### Recommended ACT Agent
backend-developer (confidence: 0.95)

---

## ACT

### Progress
- Created auth middleware
- Implemented login endpoint

### Notes
- Need to add password hashing

---

## EVAL

### Findings
- Missing input validation on email field

### Recommendations
- Add Zod schema for request validation
```

### Mode Behavior

| Mode | Behavior |
|------|----------|
| PLAN | **Resets** document (clears all sections, starts fresh) |
| ACT | **Appends** new section to existing document |
| EVAL | **Appends** new section to existing document |
| AUTO | **Resets** on first iteration, **appends** on subsequent |

### API Integration

The `parse_mode` MCP tool automatically:
1. Reads existing context document (if exists)
2. Returns `contextDocument` field with parsed content
3. Provides `mandatoryAction` indicating required update before completion

The `update_context` MCP tool:
1. Validates mode matches expected behavior (reset vs append)
2. Persists decisions, notes, progress, findings to document
3. Maintains version history via timestamps

## Consequences

### Positive

- **Context survives compaction**: Decisions persist in file system
- **Single source of truth**: All modes read from same document
- **Human-readable**: Markdown format allows manual inspection/editing
- **Git-friendly**: Changes can be tracked in version control
- **Automatic recovery**: AI can resume interrupted workflows

### Negative

- **File system dependency**: Requires write access to project directory
- **Potential conflicts**: Multiple simultaneous sessions could conflict (rare in practice)

### Mitigations

- Directory auto-creation if missing
- Clear error messages when file operations fail
- Single fixed path prevents naming conflicts

## Security Considerations

- **Fixed file path**: Context document is always at `docs/codingbuddy/context.md`, preventing arbitrary file access
- **No sensitive content**: Document stores workflow context only; AI is instructed not to store credentials
- **Local file access**: File operations are restricted to project directory (no network access)
- **Overwrite-only**: `update_context` replaces or appends; no arbitrary file deletion capability

## Related

- [Claude Code Custom Instructions](../../.claude/rules/custom-instructions.md)
- Files: `src/context/`, `src/mcp/handlers/context-document.handler.ts`
