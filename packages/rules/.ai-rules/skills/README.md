# CodingBuddy Skills

Reusable workflows for consistent development practices.

## Available Skills

| Skill | Description | When to Use |
|-------|-------------|-------------|
| brainstorming | Explores user intent, requirements and design before implementation | Before any creative work |
| dispatching-parallel-agents | Handle 2+ independent tasks without shared state | Parallel task execution |
| executing-plans | Execute implementation plans with review checkpoints | Following written plans |
| frontend-design | Create distinctive, production-grade frontend interfaces | Building web components/pages |
| pr-review | Systematic, evidence-based PR review with anti-sycophancy principles | Conducting manual PR reviews |
| refactoring | Structured, test-driven refactoring workflow with Tidy First principles | Improving code structure without changing behavior |
| subagent-driven-development | Execute plans with independent tasks in current session | In-session plan execution |
| systematic-debugging | Systematic approach before proposing fixes | Encountering bugs or failures |
| test-driven-development | Write tests first, then minimal code to pass | Before implementing features |
| writing-plans | Create implementation plans before coding | Multi-step tasks with specs |

## Skill Format

Skills use YAML frontmatter + Markdown:

```markdown
---
name: skill-name
description: "Brief description (max 500 chars)"
---

# Skill Title

## When to Use
...

## Process/Checklist
...
```

### Frontmatter Requirements

- `name`: lowercase alphanumeric with hyphens only (`^[a-z0-9-]+$`)
- `description`: 1-500 characters

## Usage by Platform

### Claude Code (MCP)

```
list_skills                        # List all available skills
get_skill("test-driven-development")  # Get specific skill content
```

### Codex / GitHub Copilot

```bash
cat .ai-rules/skills/<skill-name>/SKILL.md
```

### Cursor

```
@.ai-rules/skills/test-driven-development/SKILL.md
```

## Creating Custom Skills

1. Create directory: `skills/<name>/`
2. Create `SKILL.md` with YAML frontmatter
3. Follow the format specification above

### Example

```bash
mkdir -p .ai-rules/skills/my-skill
cat > .ai-rules/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: My custom skill for specific workflow
---

# My Skill

## When to Use
- Specific scenario 1
- Specific scenario 2

## Checklist
- [ ] Step 1
- [ ] Step 2
EOF
```

## Directory Structure

```
.ai-rules/skills/
├── README.md                       # This file
├── brainstorming/
│   └── SKILL.md
├── dispatching-parallel-agents/
│   └── SKILL.md
├── executing-plans/
│   └── SKILL.md
├── frontend-design/
│   └── SKILL.md
├── pr-review/
│   └── SKILL.md
├── refactoring/
│   ├── SKILL.md
│   └── refactoring-catalog.md
├── subagent-driven-development/
│   └── SKILL.md
├── systematic-debugging/
│   └── SKILL.md
├── test-driven-development/
│   └── SKILL.md
└── writing-plans/
    └── SKILL.md
```
