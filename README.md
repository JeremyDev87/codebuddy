<p align="center">
  <a href="README.md">English</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.zh-CN.md">中文</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.es.md">Español</a>
</p>

# Codingbuddy

[![CI](https://github.com/JeremyDev87/codingbuddy/actions/workflows/dev.yml/badge.svg)](https://github.com/JeremyDev87/codingbuddy/actions/workflows/dev.yml)
[![npm version](https://img.shields.io/npm/v/codingbuddy.svg)](https://www.npmjs.com/package/codingbuddy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="docs/ai-rules-architecture.svg" alt="Codingbuddy AI Rules Architecture" width="800"/>
</p>

**One source of truth for AI coding rules across all AI assistants.**

Codingbuddy provides a unified rules system that works with Cursor, Claude Code, GitHub Copilot, and more—so your entire team follows the same coding standards, regardless of which AI tool they use.

## Why Codingbuddy?

- **Consistency**: All AI tools follow identical coding standards
- **Single Source of Truth**: Update rules once, all tools benefit
- **No Vendor Lock-in**: AI-agnostic rules work with any assistant
- **Structured Workflow**: PLAN → ACT → EVAL development cycle

## Quick Start

```bash
# Initialize your project (no API key required)
npx codingbuddy init

# Optional: AI-powered initialization for deeper analysis
# npx codingbuddy init --ai  # Requires ANTHROPIC_API_KEY

# Add to your AI tool (example: Claude Desktop)
# See docs/supported-tools.md for other AI tools
```

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "codingbuddy": {
      "command": "npx",
      "args": ["codingbuddy", "mcp"]
    }
  }
}
```

### Claude Code Plugin (Optional)

For enhanced integration with Claude Code:

```bash
# 1. Add the marketplace
claude marketplace add JeremyDev87/codingbuddy

# 2. Install the plugin
claude plugin install codingbuddy@jeremydev87

# 3. Install MCP server for full functionality
npm install -g codingbuddy
```

> **Migration Note**: If you previously used `claude marketplace add https://jeremydev87.github.io/codingbuddy`, please remove it and use the GitHub repository format shown above. The URL format is deprecated.

The plugin provides:
- **Workflow Modes**: PLAN/ACT/EVAL/AUTO structured development
- **Specialist Agents**: 12+ domain experts (security, performance, accessibility)
- **Skills**: Reusable workflows (TDD, debugging, API design)
- **Context Persistence**: Decisions survive conversation compaction

| Documentation | Description |
|---------------|-------------|
| [Plugin Setup Guide](docs/plugin-guide.md) | Installation and configuration |
| [Quick Reference](docs/plugin-quick-reference.md) | Commands and modes at a glance |
| [Architecture](docs/plugin-architecture.md) | How plugin and MCP work together |
| [Usage Examples](docs/plugin-examples.md) | Real-world workflow examples |
| [Troubleshooting](docs/plugin-troubleshooting.md) | Common issues and solutions |
| [FAQ](docs/plugin-faq.md) | Frequently asked questions |

[Full Getting Started Guide →](docs/getting-started.md)

## Supported AI Tools

| Tool | Status |
|------|--------|
| Claude Code | ✅ Full MCP support |
| Cursor | ✅ Supported |
| GitHub Copilot | ✅ Supported |
| Antigravity | ✅ Supported |
| Amazon Q | ✅ Supported |
| Kiro | ✅ Supported |
| OpenCode | ✅ Supported |

[Setup Guides →](docs/supported-tools.md)

## Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/getting-started.md) | Installation and quick setup |
| [Philosophy](docs/philosophy.md) | Vision and design principles |
| [Supported Tools](docs/supported-tools.md) | AI tool integration guides |
| [Configuration](docs/config-schema.md) | Config file options |
| [API Reference](docs/api.md) | MCP server capabilities |
| [Development](docs/development.md) | Contributing and local setup |

## How It Works

See the architecture diagram above for a visual overview of the 3-layer agent system:

- **Layer 1 (Mode Agents)**: PLAN → ACT → EVAL → AUTO workflow cycle
- **Layer 2 (Primary Agents)**: Solution Architect, Technical Planner, Frontend/Backend/Mobile/Data Developer, Platform Engineer, Tooling Engineer, AI/ML Engineer, Agent Architect, Code Reviewer, DevOps
- **Layer 3 (Specialists)**: 14 domain experts (Security, Performance, Accessibility, i18n, Observability, Migration, Event Architecture, Integration, etc.)
- **Skills**: 14 reusable capabilities (TDD, Debugging, Brainstorming, Database Migration, Incident Response, etc.)

All AI tool configurations reference the same `packages/rules/.ai-rules/` directory. Change the rules once, and every tool follows the updated standards.

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT © [Codingbuddy](https://github.com/JeremyDev87/codingbuddy)
