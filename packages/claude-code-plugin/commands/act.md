# ACT Mode

## Purpose
Execute the implementation plan with TDD

## Activation
This command activates ACT mode for the CodingBuddy workflow.

## Instructions

**Important:**
- ACT mode executes the plan created in PLAN mode
- After ACT completes, automatically return to PLAN mode (default behavior)
- User can request EVAL for quality assessment

**Trigger:**
- Type `ACT` after PLAN is ready
- Execute implementation steps defined in PLAN

**🔴 Agent Activation (STRICT):**
- When ACT is triggered, **Frontend Developer Agent** (`.ai-rules/agents/frontend-developer.json`) **MUST** be automatically activated
- The Agent's development philosophy and code quality checklist MUST be followed
- See `.ai-rules/agents/frontend-developer.json` for complete development framework

**Purpose:**
Execute implementation following TDD cycle, augmented coding principles, and quality standards

**What ACT does (with Primary Developer Agent):**

1. **Execute TDD Cycle** (via Primary Developer Agent)
   - 🔴 For core logic: Red → Green → Refactor cycle
   - Write failing test first
   - Implement minimal code to pass
   - Refactor only after tests pass
   - 🔴 **Required**: Follow Primary Developer Agent's TDD cycle

2. **Implement Components** (via Primary Developer Agent)
   - Follow framework-specific component patterns
   - Use project design system components first
   - Apply project styling conventions
   - 🔴 **Required**: Follow Primary Developer Agent's component strategy

3. **Maintain Quality Standards** (via Primary Developer Agent)
   - 🔴 Type safety (no unsafe type bypasses)
   - 🔴 Test coverage 90%+
   - 🔴 Pure/impure function separation
   - 🔴 Layer architecture compliance
   - 🔴 No mocking principle
   - 🔴 Accessibility compliance
   - 🔴 **Required**: Reference Implementation Specialist Agents for comprehensive implementation verification (Architecture, Test Strategy, Performance, Security, Accessibility, SEO, Design System, Documentation, Code Quality)

**Output Format (via Primary Developer Agent):**
```
# Mode: ACT
## Agent : [Primary Developer Agent Name]

## 🚀 Implementation Progress

### Step 1: [Task Name]
✅ [Completed action]
- [File created/modified]: [Description]

### Step 2: [Task Name]
✅ [Completed action]
- [File created/modified]: [Description]

## 🏗️ Architecture Implementation Verification
(When architecture implementation verification is needed)
- Use Architecture Specialist Agent framework (`.ai-rules/agents/architecture-specialist.json`) modes.implementation for comprehensive architecture implementation verification
- [Layer placement verification]
- [Dependency direction verification]
- [Type definitions verification]

## 🧪 Test Strategy Implementation Verification
(When test strategy implementation verification is needed)
- Use Test Strategy Specialist Agent framework (`.ai-rules/agents/test-strategy-specialist.json`) modes.implementation for comprehensive test strategy implementation verification
- [TDD vs Test-After verification]
- [Test coverage verification (90%+ for core logic)]
- [Test file structure verification]

## ⚡ Performance Implementation Verification
(When performance implementation verification is needed)
- Use Performance Specialist Agent framework (`.ai-rules/agents/performance-specialist.json`) modes.implementation for comprehensive performance implementation verification
- [Bundle/build size verification]
- [Code splitting verification]
- [Framework-specific optimization verification]

## 🔒 Security Implementation Verification
(When security implementation verification is needed)
- Use Security Specialist Agent framework (`.ai-rules/agents/security-specialist.json`) modes.implementation for comprehensive security implementation verification
- [Authentication verification (OAuth 2.0, JWT)]
- [Authorization verification]
- [Input validation verification]
- [XSS/CSRF protection verification]

## 📨 Event Architecture Implementation Verification
(When event-driven architecture implementation verification is needed)
- Use Event Architecture Specialist Agent framework (`.ai-rules/agents/event-architecture-specialist.json`) modes.implementation for comprehensive event architecture implementation verification
- [Producer/consumer implementation verification]
- [Idempotency and retry configuration verification]
- [DLQ and error handling verification]
- [Correlation ID tracking verification]

## ♿ Accessibility Implementation Verification
(When accessibility implementation verification is needed)
- Use Accessibility Specialist Agent framework (`.ai-rules/agents/accessibility-specialist.json`) modes.implementation for comprehensive accessibility implementation verification
- [WCAG 2.1 AA compliance verification]
- [ARIA attributes verification]
- [Keyboard navigation verification]
- [Focus management verification]

## 🔍 SEO Implementation Verification
(When SEO implementation verification is needed)
- Use SEO Specialist Agent framework (`.ai-rules/agents/seo-specialist.json`) modes.implementation for comprehensive SEO implementation verification
- [Framework metadata API verification]
- [Structured data verification]
- [Social sharing optimization verification]

## 🎨 UI/UX Design Implementation Verification
(When UI/UX design implementation verification is needed)
- Use UI/UX Designer Agent framework (`.ai-rules/agents/ui-ux-designer.json`) modes.implementation for comprehensive UI/UX design implementation verification
- [Visual hierarchy verification]
- [Interaction states verification]
- [Responsive design verification]

## 📚 Documentation Implementation Verification
(When documentation implementation verification is needed)
- Use Documentation Specialist Agent framework (`.ai-rules/agents/documentation-specialist.json`) modes.implementation for comprehensive documentation implementation verification
- [Code comments verification for complex logic]
- [TypeScript type definitions verification]
- [JSDoc verification for public APIs]

## 📐 Code Quality Implementation Verification
(When code quality implementation verification is needed)
- Use Code Quality Specialist Agent framework (`.ai-rules/agents/code-quality-specialist.json`) modes.implementation for comprehensive code quality implementation verification
- [SOLID principles verification]
- [DRY principle verification (code duplication elimination)]
- [Complexity verification (function size, nesting depth)]
- [Design patterns verification]

## ✅ Quality Checks
- ✅ Type Safety: All types explicit
- ✅ Tests: All passing (coverage: X%)
- ✅ Linting: Zero errors
- ✅ Design System: Used where applicable

## 📝 Next Steps
[Return to PLAN mode automatically]

## 📝 Session Documentation (Optional)
To preserve this implementation session for future reference:
\`\`\`bash
./docs/codingbuddy/scripts/new-doc.sh act <slug>
\`\`\`
- Creates timestamped ACT document in `docs/codingbuddy/act/`
- Useful for: Implementation decisions, debugging context, knowledge transfer

**Next:** Type `ACT` to continue, `PLAN` to review, or `EVAL` for quality assessment
```

**🔴 Required:**
- All implementations must follow the Primary Developer Agent's code quality checklist
- Respond in the language specified in the agent's communication.language setting
- Execute one step at a time, verify tests after each step
- Stop and return to PLAN if blockers encountered

**Verification:**
- Agent name should appear as `## Agent : [Primary Developer Agent Name]` in response
- Mode indicator `# Mode: ACT` should be first line
- Implementation Progress should show step-by-step completion
- Implementation Specialist Verification sections should be included when applicable (Architecture, Test Strategy, Performance, Security, Accessibility, SEO, Design System, Documentation, Code Quality)
- Quality Checks section should verify: Type Safety, Tests, Linting, Design System
- Use `verification_guide` from Primary Developer Agent for detailed checklist validation
- For TDD: Verify test file exists before implementation, test fails first (Red), then passes (Green)
- For Test-After: Verify component exists before test file
- Verify framework-specific component patterns are followed
- Verify design system components used first
- Implementation Specialist Agents should be referenced when verifying respective areas (Architecture, Test Strategy, Performance, Security, Accessibility, SEO, Design System, Documentation, Code Quality)

---

## MCP Integration

If CodingBuddy MCP server is available, call:
```
parse_mode({ prompt: "ACT: <user request>" })
```

This provides additional context, checklists, and specialist agent recommendations.

## Next Mode

After ACT is complete, proceed to EVAL.
