# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Codebuddy** - Multi-AI Rules MCP Server for consistent coding practices across AI assistants (Cursor, Claude Code, Codex, Antigravity, Q, Kiro).

## Repository Structure

```
codebuddy/
├── .ai-rules/           # Shared AI coding rules (single source of truth)
│   ├── rules/           # Core rules (workflow, project, augmented-coding)
│   ├── agents/          # 12 specialist agent definitions (JSON)
│   └── adapters/        # Tool-specific integration guides
├── mcp-server/          # NestJS-based MCP server
│   └── src/
│       ├── main.ts      # Entry point (stdio/SSE transport)
│       ├── mcp/         # MCP protocol handlers
│       └── rules/       # Rules service (file reading, search)
├── .cursor/             # Cursor AI config
├── .claude/             # Claude Code config
├── .antigravity/        # Antigravity (Gemini) config
├── .codex/              # GitHub Copilot config
├── .q/                  # Amazon Q config
└── .kiro/               # Kiro config
```

## Commands

### MCP Server (mcp-server/)

```bash
cd mcp-server

# Development
yarn start:dev          # Run with ts-node

# Build & Run
yarn build              # Compile TypeScript
yarn start              # Run compiled version

# Publishing
yarn prepublishOnly     # Prepare for npm publish (copies .ai-rules, builds)
```

### Environment Variables

- `MCP_TRANSPORT`: `stdio` (default) or `sse`
- `PORT`: HTTP port when using SSE mode (default: 3000)

## Architecture

### MCP Server Design

The server implements the Model Context Protocol with three capabilities:

1. **Resources**: Exposes rule files and agent definitions via `rules://` URI scheme
2. **Tools**: `search_rules` (query rules) and `get_agent_details` (agent info)
3. **Prompts**: `activate_agent` (generate activation prompt for specialist)

### Transport Modes

- **Stdio Mode**: Runs as standalone CLI app, communicates via stdin/stdout
- **SSE Mode**: Runs as HTTP server with Server-Sent Events

### NestJS Modules

- `AppModule`: Root module with config
- `McpModule`: MCP server and handlers
- `RulesModule`: File system operations for .ai-rules

## Workflow Modes (from .ai-rules)

When working in this codebase, use these modes:

- **PLAN**: Design implementation approach (default start mode)
- **ACT**: Execute changes following TDD
- **EVAL**: Review and improve (when explicitly requested)

## Code Quality Standards

- TypeScript strict mode (no `any`)
- TDD cycle: Red -> Green -> Refactor
- Pure/impure function separation (different files)
- 90%+ test coverage goal

## Communication

Always respond in Korean as specified in project rules.
