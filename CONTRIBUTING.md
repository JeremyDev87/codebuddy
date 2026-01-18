# Contributing to Codingbuddy

Thank you for your interest in contributing to Codingbuddy! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Translation Guidelines](#translation-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

Please report unacceptable behavior via [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues). For sensitive matters, you can use [GitHub Security Advisories](https://github.com/JeremyDev87/codingbuddy/security/advisories/new) to report privately.

## Getting Started

### Prerequisites

- Node.js v18+
- Yarn (via Corepack)

### Setup

```bash
# Clone the repository
git clone https://github.com/JeremyDev87/codingbuddy.git
cd codingbuddy

# Install dependencies
yarn install

# Run tests to verify setup
yarn workspace codingbuddy test

# Start development server
yarn workspace codingbuddy start:dev
```

### Project Structure

```
codingbuddy/
├── apps/
│   └── mcp-server/      # NestJS-based MCP server (codingbuddy)
│       └── src/
│           ├── mcp/     # MCP protocol handlers
│           ├── rules/   # Rules service
│           ├── config/  # Configuration loading
│           └── keyword/ # Keyword parsing
├── packages/
│   └── rules/           # AI rules package (codingbuddy-rules)
│       └── .ai-rules/   # Shared AI coding rules
│           ├── rules/   # Core rules (markdown)
│           ├── agents/  # Specialist agent definitions (JSON)
│           └── adapters/# Tool-specific integration guides
└── docs/                # Documentation
```

## Development Workflow

### 1. Find or Create an Issue

- Check [existing issues](https://github.com/JeremyDev87/codingbuddy/issues)
- For new features, create an issue first to discuss the approach
- For bug fixes, you can proceed directly with a PR

### 2. Create a Branch

```bash
# Feature branch
git checkout -b feat/your-feature-name

# Bug fix branch
git checkout -b fix/bug-description

# Documentation
git checkout -b docs/what-you-are-documenting
```

### 3. Make Changes

- Follow the [coding standards](#coding-standards)
- Write tests for new functionality
- Update documentation if needed

### 4. Test Your Changes

```bash
# Run all checks at once
yarn workspace codingbuddy validate

# Or run individual checks
yarn workspace codingbuddy lint          # ESLint
yarn workspace codingbuddy format:check  # Prettier
yarn workspace codingbuddy typecheck     # TypeScript
yarn workspace codingbuddy test          # Unit tests
yarn workspace codingbuddy test:coverage # Coverage (must be 80%+)
yarn workspace codingbuddy circular      # Circular dependency check
yarn workspace codingbuddy build         # Build verification

# If you modified packages/rules/.ai-rules/ files:
yarn workspace codingbuddy validate:rules  # Validate rules structure, schema, and markdown
```

### 5. Submit a Pull Request

- Fill out the PR template completely
- Link related issues
- Request review from maintainers

## Coding Standards

### TypeScript

- **Strict mode**: No `any` types allowed
- **Type safety**: Use proper types for all parameters and return values
- **Naming conventions**:
  - Files: `kebab-case.ts`
  - Classes: `PascalCase`
  - Functions/variables: `camelCase`
  - Constants: `SCREAMING_SNAKE_CASE`

### Code Quality

- Follow SOLID principles
- Keep functions small and focused
- Separate pure and impure functions
- Aim for 80%+ test coverage

### Formatting

We use ESLint and Prettier for code formatting:

```bash
# Check formatting
yarn workspace codingbuddy lint
yarn workspace codingbuddy format:check

# Auto-fix
yarn workspace codingbuddy lint:fix
yarn workspace codingbuddy format
```

### Testing

- Use Vitest for testing
- Follow TDD when possible: Red → Green → Refactor
- Test file naming: `*.spec.ts`

```bash
# Run tests
yarn workspace codingbuddy test

# Run with coverage
yarn workspace codingbuddy test:coverage
```

## Translation Guidelines

We welcome translations to make Codingbuddy accessible to developers worldwide.

### Supported Languages

| Language | Directory | Status |
|----------|-----------|--------|
| English | `docs/` | Source |
| Korean (한국어) | `docs/ko/` | Complete |
| Japanese (日本語) | `docs/ja/` | Complete |
| Chinese (中文) | `docs/zh-CN/` | Complete |
| Spanish (Español) | `docs/es/` | Complete |
| Portuguese (Português) | `docs/pt-BR/` | Complete |

### Translation Standards

#### 1. File Structure

- Follow the existing directory pattern: `docs/{lang}/filename.md`
- Keep the same file names as English source files
- Include language selector at the top of each file

#### 2. Content Rules

- **Technical terms**: Keep in English (PLAN, ACT, EVAL, MCP, API, CLI, etc.)
- **Code blocks**: Do not translate code or commands
- **URLs**: Keep all URLs unchanged
- **Mermaid diagrams**: Do not translate diagram content

#### 3. Language-Specific Requirements

**Portuguese (pt-BR)**:
- Use proper diacritical marks (ã, ç, é, í, ó, ú, ê, â, ô)
- Common patterns:
  - -ção/-ções (Instalação, configurações)
  - você, método, versão, sessão

**Spanish (es)**:
- Use proper accents (á, é, í, ó, ú, ñ)
- Use formal "usted" form for instructions

**Chinese (zh-CN)**:
- Use Simplified Chinese characters
- Keep technical terms in English with Chinese explanation if needed

**Japanese (ja)**:
- Use appropriate mix of hiragana, katakana, and kanji
- Technical terms can be in katakana or English

**Korean (ko)**:
- Use 합니다 (formal) style
- Technical terms can remain in English

#### 4. Required Elements

Each translated file must include:

1. **Language selector** at the top:
```html
<p align="center">
  <a href="../plugin-guide.md">English</a> |
  <a href="../ko/plugin-guide.md">한국어</a> |
  <a href="../zh-CN/plugin-guide.md">中文</a> |
  <a href="../ja/plugin-guide.md">日本語</a> |
  <a href="../es/plugin-guide.md">Español</a> |
  <a href="plugin-guide.md">Português</a>
</p>
```

2. **AI translation disclaimer** at the bottom (for AI-assisted translations):
```markdown
---

<sub>🤖 This document was translated with AI assistance. If you find errors or have suggestions, please report them on [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
```

#### 5. Validation

Before submitting, run the translation validation script:

```bash
./scripts/validate-translations.sh
```

This checks for:
- Missing diacritical marks (Portuguese)
- Language selector consistency
- AI disclaimer presence

#### 5.1 CI Integration

The validation script can be integrated into CI workflows. Example for GitHub Actions:

```yaml
# .github/workflows/docs.yml
name: Documentation Checks

on:
  pull_request:
    paths:
      - 'docs/**'

jobs:
  validate-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate Translations
        run: ./scripts/validate-translations.sh
```

#### 6. Spell-Check Recommendations

For quality assurance, we recommend using:

- **VS Code**: Install language-specific spell-check extensions
  - [Portuguese - Corretor Ortográfico](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-portuguese-brazilian)
  - [Spanish - Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-spanish)
- **CLI**: Use `aspell` or `hunspell` with appropriate dictionaries

```bash
# Example: Check Portuguese file with aspell
aspell --lang=pt_BR check docs/pt-BR/plugin-guide.md
```

#### 7. Native Speaker Review

For best quality, we encourage native speaker review before merging translation PRs. If you are a native speaker and can help review, please comment on translation PRs.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |
| `ci` | CI/CD changes |

### Examples

```bash
feat(mcp): add new search_rules tool
fix(config): handle missing config file gracefully
docs(readme): update installation instructions
refactor(rules): simplify rule parsing logic
test(mcp): add coverage for error cases
chore(deps): update dependencies
```

### Scope

Common scopes:
- `mcp` - MCP server functionality
- `rules` - Rules service
- `config` - Configuration
- `agents` - Agent definitions
- `docs` - Documentation
- `ci` - CI/CD

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`yarn test`)
- [ ] Code is formatted (`yarn format:check`)
- [ ] No linting errors (`yarn lint`)
- [ ] No type errors (`yarn typecheck`)
- [ ] Coverage meets threshold (`yarn test:coverage`)
- [ ] Documentation updated if needed

### PR Title

Follow the same format as commit messages:

```
feat(mcp): add new tool for agent activation
```

### PR Description

Include:
1. **Summary**: What does this PR do?
2. **Related Issues**: Link to related issues
3. **Testing**: How was this tested?
4. **Checklist**: Confirm all checks pass

### Review Process

1. Maintainers will review your PR
2. Address any feedback
3. Once approved, maintainers will merge

## Issue Guidelines

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)
- Error messages or logs

### Feature Requests

Include:
- Problem you're trying to solve
- Proposed solution
- Alternative approaches considered
- Any additional context

## Questions?

- Open a [GitHub Discussion](https://github.com/JeremyDev87/codingbuddy/discussions)
- Check existing issues and documentation

---

Thank you for contributing to Codingbuddy!
