# Skills System Implementation Plan

## Overview

Implement a cross-platform skills system for CodingBuddy following TDD methodology.

**Related Ticket**: `docs/skills-ticket.md`

---

## Phase 1: Skills Infrastructure

### 1.1 Create Skills Directory Structure

**Files to create:**
```
packages/rules/.ai-rules/skills/
├── README.md              # Skill catalog
└── .gitkeep               # Ensure directory tracked
```

**Tasks:**
- [ ] Create `skills/` directory
- [ ] Create `README.md` with format specification
- [ ] Document YAML frontmatter requirements

### 1.2 Define Skill Schema (TDD)

**File**: `apps/mcp-server/src/rules/skill.schema.ts`

**Red** - Write failing tests:
```typescript
// skill.schema.spec.ts
describe('parseSkill', () => {
  it('should parse valid SKILL.md with frontmatter');
  it('should reject missing name');
  it('should reject missing description');
  it('should reject invalid name format');
  it('should extract content after frontmatter');
});
```

**Green** - Implement schema:
```typescript
// skill.schema.ts
import * as z from 'zod';

export const SkillFrontmatterSchema = z.object({
  name: z.string().min(1).regex(/^[a-z0-9-]+$/,
    'Skill name must be lowercase with hyphens only'),
  description: z.string().min(1).max(500),
});

export interface Skill {
  name: string;
  description: string;
  content: string;
  path: string;
}

export function parseSkill(content: string, filePath: string): Skill;
```

### 1.3 Add Skill Loading to RulesService

**File**: `apps/mcp-server/src/rules/rules.service.ts`

**Methods to add:**
```typescript
async listSkills(): Promise<SkillSummary[]>;
async getSkill(name: string): Promise<Skill>;
```

**Tests:**
```typescript
describe('listSkills', () => {
  it('should return all skills with name and description');
  it('should return empty array when no skills exist');
});

describe('getSkill', () => {
  it('should return skill content by name');
  it('should throw for non-existent skill');
  it('should validate skill name format');
});
```

### 1.4 Add MCP Tools

**File**: `apps/mcp-server/src/mcp/mcp-serverless.ts`

**Tools to register:**

```typescript
// list_skills tool
this.server.registerTool(
  'list_skills',
  {
    title: 'List Skills',
    description: 'List all available skills with descriptions',
    inputSchema: {},
  },
  async (): Promise<ToolResponse> => {
    return this.handleListSkills();
  },
);

// get_skill tool
this.server.registerTool(
  'get_skill',
  {
    title: 'Get Skill',
    description: 'Get skill content by name',
    inputSchema: {
      skillName: z.string().describe('Name of the skill'),
    },
  },
  async ({ skillName }): Promise<ToolResponse> => {
    return this.handleGetSkill(skillName);
  },
);
```

**Handlers:**
```typescript
private async handleListSkills(): Promise<ToolResponse>;
private async handleGetSkill(skillName: string): Promise<ToolResponse>;
```

---

## Phase 2: Core Skills

### 2.1 TDD Skill

**File**: `packages/rules/.ai-rules/skills/tdd/SKILL.md`

```markdown
---
name: tdd
description: "Use before implementing any feature. Guides Red-Green-Refactor cycle with test-first approach."
---

# Test-Driven Development

## When to Use
- Before writing any new functionality
- When fixing bugs (write failing test first)
- When refactoring (ensure tests exist first)

## The Cycle

### 1. Red - Write Failing Test
- Write the smallest test that fails
- Test should express desired behavior
- Verify test actually fails

### 2. Green - Make It Pass
- Write minimum code to pass test
- Don't optimize yet
- Focus on correctness only

### 3. Refactor - Improve
- Clean up code while tests pass
- Remove duplication
- Improve naming

## Checklist
- [ ] Test written before implementation
- [ ] Test fails for the right reason
- [ ] Implementation is minimal
- [ ] All tests pass after changes
- [ ] Code is refactored and clean
```

### 2.2 Debugging Skill

**File**: `packages/rules/.ai-rules/skills/debugging/SKILL.md`

```markdown
---
name: debugging
description: "Use when encountering bugs or unexpected behavior. Systematic approach to find root cause."
---

# Systematic Debugging

## When to Use
- Test failures
- Unexpected behavior
- Error messages
- Performance issues

## The Process

### 1. Reproduce
- Create minimal reproduction
- Document exact steps
- Note environment details

### 2. Hypothesize
- Form 2-3 hypotheses about cause
- Rank by likelihood
- Plan verification for each

### 3. Verify
- Test most likely hypothesis first
- Use logging/debugging tools
- Gather evidence

### 4. Fix
- Address root cause, not symptoms
- Write regression test
- Verify fix works

## Checklist
- [ ] Bug is reproducible
- [ ] Hypotheses documented
- [ ] Root cause identified
- [ ] Fix addresses root cause
- [ ] Regression test added
```

### 2.3 Code Review Skill

**File**: `packages/rules/.ai-rules/skills/code-review/SKILL.md`

```markdown
---
name: code-review
description: "Use when reviewing code changes. Structured checklist for thorough review."
---

# Code Review

## When to Use
- Before merging PRs
- Self-review before committing
- Evaluating code quality

## Review Checklist

### Correctness
- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] No obvious bugs

### Design
- [ ] Single responsibility
- [ ] Appropriate abstraction
- [ ] No code duplication
- [ ] Dependencies reasonable

### Quality
- [ ] Clear naming
- [ ] Readable code
- [ ] Appropriate comments
- [ ] Consistent style

### Testing
- [ ] Tests exist
- [ ] Tests are meaningful
- [ ] Coverage adequate
- [ ] Edge cases tested

### Security
- [ ] No hardcoded secrets
- [ ] Input validated
- [ ] Output sanitized
- [ ] Auth/authz correct
```

### 2.4 Planning Skill

**File**: `packages/rules/.ai-rules/skills/planning/SKILL.md`

```markdown
---
name: planning
description: "Use before implementing complex features. Creates structured implementation plan."
---

# Implementation Planning

## When to Use
- Multi-file changes
- New features
- Architectural decisions
- Complex refactoring

## Planning Process

### 1. Understand
- Clarify requirements
- Identify constraints
- Note dependencies

### 2. Explore
- Review existing code
- Identify affected areas
- Consider approaches

### 3. Design
- Choose approach
- Define interfaces
- Plan data flow

### 4. Break Down
- List discrete tasks
- Order by dependency
- Estimate complexity

### 5. Document
- Write plan to file
- Include rationale
- Note risks

## Plan Template

```markdown
# [Feature] Implementation Plan

## Goal
[What we're building and why]

## Approach
[Chosen approach and rationale]

## Tasks
1. [ ] Task 1
2. [ ] Task 2
...

## Risks
- Risk 1: Mitigation
```
```

---

## Phase 3: Adapter Integration

### 3.1 Claude Code Adapter Update

**File**: `packages/rules/.ai-rules/adapters/claude-code.md`

**Add section:**
```markdown
## Skills

CodingBuddy skills are accessible via MCP tools:

### List Available Skills
Use `list_skills` MCP tool to see all available skills.

### Use a Skill
Use `get_skill` MCP tool with skill name:
- `get_skill("tdd")` - Test-Driven Development
- `get_skill("debugging")` - Systematic Debugging
- `get_skill("code-review")` - Code Review Checklist
- `get_skill("planning")` - Implementation Planning

### When to Use Skills
- **tdd**: Before implementing any feature
- **debugging**: When encountering bugs
- **code-review**: Before merging or committing
- **planning**: For complex multi-step tasks
```

### 3.2 Codex Adapter Update

**File**: `packages/rules/.ai-rules/adapters/codex.md`

**Add section:**
```markdown
## Skills

### Using Skills in Codex

Skills are located in `.ai-rules/skills/`. To use a skill:

1. Read the skill file:
   ```bash
   cat .ai-rules/skills/<skill-name>/SKILL.md
   ```

2. Follow the skill's checklist and process.

### Available Skills
- `tdd` - Test-Driven Development workflow
- `debugging` - Systematic debugging process
- `code-review` - Code review checklist
- `planning` - Implementation planning
```

### 3.3 Cursor Adapter Update

**File**: `packages/rules/.ai-rules/adapters/cursor.md`

**Add section:**
```markdown
## Skills

### Using Skills in Cursor

Reference skills in your prompts using file inclusion:

```
@.ai-rules/skills/tdd/SKILL.md
```

Or manually include skill content in `.cursorrules`.

### Available Skills
- `.ai-rules/skills/tdd/SKILL.md`
- `.ai-rules/skills/debugging/SKILL.md`
- `.ai-rules/skills/code-review/SKILL.md`
- `.ai-rules/skills/planning/SKILL.md`
```

---

## Phase 4: Documentation

### 4.1 Skills README

**File**: `packages/rules/.ai-rules/skills/README.md`

```markdown
# CodingBuddy Skills

Reusable workflows for consistent development practices.

## Available Skills

| Skill | Description | When to Use |
|-------|-------------|-------------|
| tdd | Test-Driven Development | Before implementing features |
| debugging | Systematic Debugging | When encountering bugs |
| code-review | Code Review Checklist | Before merging/committing |
| planning | Implementation Planning | For complex tasks |

## Skill Format

Skills use YAML frontmatter + Markdown:

```markdown
---
name: skill-name
description: "Brief description"
---

# Skill Title

## Content...
```

## Usage by Platform

- **Claude Code**: Use `get_skill` MCP tool
- **Codex**: Read skill file directly
- **Cursor**: Include via `@` reference

## Creating Custom Skills

1. Create directory: `skills/<name>/`
2. Create `SKILL.md` with frontmatter
3. Follow existing skill structure
```

---

## Implementation Order

```
Phase 1.1 → Phase 1.2 → Phase 1.3 → Phase 1.4
    ↓
Phase 2.1 → Phase 2.2 → Phase 2.3 → Phase 2.4
    ↓
Phase 3.1 → Phase 3.2 → Phase 3.3
    ↓
Phase 4.1
```

## Test Commands

```bash
# Run all tests
yarn workspace codingbuddy test

# Run specific test file
yarn workspace codingbuddy test src/rules/skill.schema.spec.ts

# Type check
yarn workspace codingbuddy tsc --noEmit

# Build
yarn workspace codingbuddy build
```

---

## Checklist Summary

### Phase 1: Infrastructure
- [ ] 1.1 Create skills directory structure
- [ ] 1.2 Implement skill schema (TDD)
- [ ] 1.3 Add skill loading to RulesService
- [ ] 1.4 Add MCP tools (list_skills, get_skill)

### Phase 2: Core Skills
- [ ] 2.1 Create tdd skill
- [ ] 2.2 Create debugging skill
- [ ] 2.3 Create code-review skill
- [ ] 2.4 Create planning skill

### Phase 3: Adapters
- [ ] 3.1 Update claude-code.md
- [ ] 3.2 Update codex.md
- [ ] 3.3 Update cursor.md

### Phase 4: Documentation
- [ ] 4.1 Create skills/README.md

---

## Notes

- Follow TDD for all code changes
- Run tests after each phase
- Commit after each completed phase
- Update ticket status as work progresses
