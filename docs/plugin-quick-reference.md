<p align="center">
  <a href="plugin-quick-reference.md">English</a> |
  <a href="ko/plugin-quick-reference.md">한국어</a> |
  <a href="zh-CN/plugin-quick-reference.md">中文</a> |
  <a href="ja/plugin-quick-reference.md">日本語</a> |
  <a href="es/plugin-quick-reference.md">Español</a> |
  <a href="pt-BR/plugin-quick-reference.md">Português</a>
</p>

# CodingBuddy Quick Reference Card

A quick reference for commands, modes, and common workflows.

## Workflow Modes

| Mode | Trigger | Purpose |
|------|---------|---------|
| **PLAN** | `PLAN <task>` | Design implementation approach with TDD |
| **ACT** | `ACT` | Execute the plan, make changes |
| **EVAL** | `EVAL` | Evaluate quality, suggest improvements |
| **AUTO** | `AUTO <task>` | Autonomous cycle until quality achieved |

### Mode Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Default Flow                            │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──(user: ACT)──> ACT ──(auto)──> PLAN                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Evaluation Flow                           │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──> ACT ──> PLAN ──(user: EVAL)──> EVAL ──> PLAN      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Autonomous Flow                           │
├─────────────────────────────────────────────────────────────┤
│  AUTO ──> [PLAN ──> ACT ──> EVAL] ──(repeat)──> Done        │
│           └── until Critical=0 AND High=0 ──┘               │
└─────────────────────────────────────────────────────────────┘
```

## Commands

| Command | Description |
|---------|-------------|
| `/plan` | Enter PLAN mode |
| `/act` | Enter ACT mode |
| `/eval` | Enter EVAL mode |
| `/auto` | Enter AUTO mode |
| `/checklist` | Generate contextual checklist |

### Localized Keywords

| English | Korean | Japanese | Chinese | Spanish |
|---------|--------|----------|---------|---------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMÁTICO |

## Specialist Agents

### Planning Specialists
| Agent | Focus |
|-------|-------|
| 🏛️ architecture-specialist | System design, layer placement |
| 🧪 test-strategy-specialist | TDD approach, coverage goals |
| 📨 event-architecture-specialist | Message queues, sagas, real-time |
| 🔗 integration-specialist | API integration, external services |
| 📊 observability-specialist | Logging, monitoring, tracing |
| 🔄 migration-specialist | Data migration, versioning |

### Implementation Specialists
| Agent | Focus |
|-------|-------|
| 📏 code-quality-specialist | SOLID, DRY, complexity |
| ⚡ performance-specialist | Bundle size, optimization |
| 🔒 security-specialist | Auth, input validation, XSS |
| ♿ accessibility-specialist | WCAG 2.1, ARIA, keyboard |
| 🔍 seo-specialist | Metadata, structured data |
| 🎨 ui-ux-designer | Visual hierarchy, UX patterns |

### Developer Agents
| Agent | Focus |
|-------|-------|
| 🖥️ frontend-developer | UI components, state management |
| ⚙️ backend-developer | APIs, database, auth |
| 🔧 devops-engineer | CI/CD, infrastructure |
| 📱 mobile-developer | Mobile app development |

## Common Workflows

### 1. Implement a New Feature

```
You: PLAN implement user authentication with JWT

Claude: [Creates structured plan with TDD approach]

You: ACT

Claude: [Implements following Red-Green-Refactor]

You: EVAL  (optional)

Claude: [Reviews code quality, security, suggests improvements]
```

### 2. Fix a Bug

```
You: PLAN fix the login timeout issue in auth module

Claude: [Analyzes issue, creates debugging plan]

You: ACT

Claude: [Implements fix with tests]
```

### 3. Autonomous Development

```
You: AUTO implement a complete REST API for user management

Claude: [Cycles PLAN→ACT→EVAL until Critical=0, High=0]
```

### 4. Generate Checklist

```
You: /checklist security performance

Claude: [Generates security and performance checklists]
```

## Quality Standards

### Coverage Goals
- **Core Logic**: 90%+ test coverage
- **UI Components**: Key interactions tested

### TDD Cycle
```
RED ──> GREEN ──> REFACTOR
 │         │          │
 │         │          └── Improve structure
 │         └── Minimal code to pass
 └── Write failing test
```

### Code Quality
- No `any` types (TypeScript strict)
- Pure/impure function separation
- SOLID principles
- DRY (Don't Repeat Yourself)

## Context Management

### Session Persistence
Context is stored in `docs/codingbuddy/context.md`:
- Survives conversation compaction
- Tracks decisions across modes
- Preserves recommended agents

### Context Commands
| Action | How |
|--------|-----|
| View context | Read `docs/codingbuddy/context.md` |
| Reset context | Start new PLAN mode |
| Update context | Automatic on mode completion |

## MCP Tools

| Tool | Purpose |
|------|---------|
| `parse_mode` | Parse workflow mode from prompt |
| `get_agent_details` | Get specialist agent info |
| `generate_checklist` | Generate domain-specific checklists |
| `read_context` | Read current context document |
| `update_context` | Update context with progress |
| `get_project_config` | Get project configuration |

## Quick Tips

1. **Start with PLAN** - Always plan before implementing
2. **Use AUTO for complex features** - Let the cycle run until quality is achieved
3. **Request EVAL after ACT** - Get quality assessment before merging
4. **Check context** - Read `context.md` to see previous decisions
5. **Use specialists** - They catch issues specific to their domain

## See Also

- [Installation Guide](./plugin-guide.md) - Setup and configuration
- [Architecture](./plugin-architecture.md) - How it works
- [Examples](./plugin-examples.md) - Real-world workflows
- [Troubleshooting](./plugin-troubleshooting.md) - Common issues
- [FAQ](./plugin-faq.md) - Frequently asked questions
