# Add Multi-Agent Philosophy Intro to Plugin Guide Documentation

## Problem Statement

The plugin-guide.md documentation files (across 5 languages) lack the key value proposition messaging that was recently added to README and other documentation files. Users landing on the plugin installation guide do not immediately understand what Codingbuddy offers.

## Background

Recent documentation updates (commits `0744f4c` and `df5570c`) established a consistent multi-agent philosophy message across:
- README files (5 languages)
- philosophy.md (5 languages)
- getting-started.md (5 languages)

However, the plugin-guide.md files were not included in this update, creating messaging inconsistency.

## Why This Matters

1. **First Impression**: Plugin guide is often the first documentation users read when setting up Claude Code integration
2. **Value Communication**: Without the intro, users see technical setup steps without understanding the "why"
3. **Messaging Consistency**: All user-facing documentation should communicate the same core value proposition
4. **29 Specialized Agents**: The key differentiator (multi-agent collaboration) should be visible in all entry points

## Acceptance Criteria

- [ ] All 5 plugin-guide.md files include the 29 agents intro line
- [ ] Intro appears immediately after the title, before the guide description
- [ ] Messaging matches the established pattern from getting-started.md
- [ ] All 5 languages use consistent terminology (agents, PLAN/ACT/EVAL workflow)

## Files to Update

| File | Language |
|------|----------|
| `docs/plugin-guide.md` | English |
| `docs/ko/plugin-guide.md` | Korean |
| `docs/ja/plugin-guide.md` | Japanese |
| `docs/zh-CN/plugin-guide.md` | Chinese |
| `docs/es/plugin-guide.md` | Spanish |

## Priority

Medium - Documentation consistency improvement

## Labels

`documentation`, `multi-agent-philosophy`, `i18n`
