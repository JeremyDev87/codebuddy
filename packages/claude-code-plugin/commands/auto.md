# AUTO Mode

## Purpose
Autonomous PLAN → ACT → EVAL cycle until quality achieved

## Activation
This command activates AUTO mode for the CodingBuddy workflow.

## Instructions

**Important:**
- AUTO mode is an **autonomous execution mode** that cycles through PLAN → ACT → EVAL automatically
- User initiates with `AUTO` keyword and the system handles the entire workflow
- Continues iterating until quality targets are achieved or maximum iterations reached
- Best for tasks where iterative refinement is expected

**Trigger:**
- Type `AUTO` to start autonomous execution
- Korean: `자동`
- Japanese: `自動`
- Chinese: `自动`
- Spanish: `AUTOMÁTICO`

**Purpose:**
Autonomous iterative development - automatically cycling through planning, implementation, and evaluation until quality standards are met.

**How AUTO Works:**

1. **Initial Phase: PLAN**
   - Creates implementation plan following TDD and augmented coding principles
   - Activates Primary Developer Agent automatically
   - Outputs structured plan with todo items

2. **Execution Phase: ACT**
   - Executes the plan created in PLAN phase
   - Follows TDD cycle for core logic, Test-After for UI
   - Maintains quality standards throughout

3. **Evaluation Phase: EVAL**
   - Automatically evaluates the implementation (no user prompt required)
   - Activates Code Reviewer Agent
   - Assesses quality across all mandatory perspectives
   - Categorizes issues by severity: Critical, High, Medium, Low

4. **Iteration Decision:**
   - **Success (Exit):** Critical = 0 AND High = 0 → Complete with success summary
   - **Continue:** Critical > 0 OR High > 0 → Return to PLAN with improvements
   - **Failure (Exit):** Max iterations reached → Transition to PLAN mode with suggestions

**Exit Conditions:**

| Condition | Result | Next Action |
|-----------|--------|-------------|
| Critical = 0 AND High = 0 | Success | Display completion summary |
| Max iterations reached | Failure | Transition to PLAN with remaining issues |
| User interruption | Stopped | Return control to user |

**Configuration:**

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `auto.maxIterations` | 3 | 1-10 | Maximum PLAN→ACT→EVAL cycles before forced exit |

**🔴 Agent Activation (STRICT):**
- When AUTO mode is triggered, **Primary Developer Agent** (e.g., `.ai-rules/agents/frontend-developer.json`) **MUST** be automatically activated for PLAN and ACT phases
- During EVAL phase, **Code Reviewer Agent** (`.ai-rules/agents/code-reviewer.json`) **MUST** be automatically activated
- The respective Agent's workflow framework and all mandatory requirements MUST be followed
- See `.ai-rules/agents/` for complete agent frameworks

**Output Format:**
```
# Mode: AUTO
## Autonomous Execution Started

Task: [Task description]
Max Iterations: [maxIterations]

---

## Iteration 1/[maxIterations] - PLAN Phase
[Standard PLAN mode output]

---
## Iteration 1/[maxIterations] - ACT Phase
[Standard ACT mode output]

---
## Iteration 1/[maxIterations] - EVAL Phase
[Standard EVAL mode output]

Issues Found:
- Critical: [N]
- High: [N] <- 반복 필요 (if Critical > 0 OR High > 0)
- Medium: [N]
- Low: [N]

[If continue iteration: proceed to next iteration]
[If success: display completion format]
[If max iterations: display failure format]
```

**Success Completion Format:**
```
---
# Mode: AUTO - COMPLETED

Task completed successfully!
Final Stats:
- Iterations: [N]/[maxIterations]
- Critical: 0, High: 0
- Medium: [N], Low: [N]

Modified Files:
- [file1]
- [file2]
```

**Failure (Max Iterations) Format:**
```
---
# Mode: AUTO - MAX ITERATIONS REACHED

[maxIterations]회 시도했지만 일부 이슈가 남아있습니다.

Remaining Issues:
- [CRITICAL] [Issue description]
- [HIGH] [Issue description]

시도한 접근:
- Iteration 1: [approach]
- Iteration 2: [approach]
- Iteration 3: [approach]

---
# Mode: PLAN
```

**When to use AUTO:**
- Complex features requiring multiple refinement cycles
- Tasks where iterative improvement is expected
- When you want hands-off development until quality is achieved
- Production-critical code requiring thorough quality assurance
- Large implementations that benefit from systematic iteration

**When to use manual workflow instead:**
- Simple, single-step implementations
- When you want fine-grained control over each phase
- Exploratory development where direction may change
- Time-sensitive tasks that shouldn't iterate
- When specific phase customization is needed

**AUTO vs Manual Comparison:**

| Aspect | AUTO Mode | Manual (PLAN/ACT/EVAL) |
|--------|-----------|------------------------|
| User intervention | Minimal (start only) | Required for each phase |
| Iteration control | Automatic | User-controlled |
| Best for | Complex, iterative tasks | Simple or exploratory tasks |
| Quality guarantee | Enforced (exit conditions) | User judgment |
| Time efficiency | Optimized for quality | Optimized for control |

**🔴 Required:**
- All PLAN phases must follow the Primary Developer Agent's workflow framework
- All ACT phases must follow the Primary Developer Agent's code quality checklist
- All EVAL phases must follow the Code Reviewer Agent's evaluation framework
- Respond in the language specified in the agent's communication.language setting
- Continue iterating automatically until exit conditions are met (Critical = 0 AND High = 0)
- Transition to PLAN mode with remaining issues when max iterations reached

**Verification:**
- Mode indicator `# Mode: AUTO` should be first line at start
- Task description and max iterations should be displayed in start header
- Each iteration should display phase indicator: `## Iteration N/[maxIterations] - [Phase] Phase`
- EVAL phase must include issues summary with Critical, High, Medium, Low counts
- Success completion should display `# Mode: AUTO - COMPLETED`
- Failure completion should display `# Mode: AUTO - MAX ITERATIONS REACHED`
- Exit conditions should be evaluated after each EVAL phase
- Agent activation rules from PLAN, ACT, EVAL modes apply to respective phases within AUTO mode

---

## MCP Integration

If CodingBuddy MCP server is available, call:
```
parse_mode({ prompt: "AUTO: <user request>" })
```

This provides additional context, checklists, and specialist agent recommendations.

## Next Mode

After AUTO is complete, proceed to Complete (or continue iteration).
