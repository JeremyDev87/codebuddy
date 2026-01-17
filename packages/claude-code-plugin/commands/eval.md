# EVAL Mode

## Purpose
Evaluate code quality and suggest improvements

## Activation
This command activates EVAL mode for the CodingBuddy workflow.

## Instructions

**Important:**
- EVAL mode is **not automatic** after ACT
- User must **explicitly request** EVAL by typing `EVAL`
- Default behavior after ACT: Return to PLAN (without evaluation)
- Use EVAL when you want iterative improvement and refinement

**Trigger:**
- Type `EVAL` after completing ACT
- Type `EVALUATE` (also accepted)
- Korean: `평가해` or `개선안 제시해`

**🔴 Agent Activation (STRICT):**
- When EVAL is triggered, **Code Reviewer Agent** (`.ai-rules/agents/code-reviewer.json`) **MUST** be automatically activated
- The Agent's evaluation framework and all mandatory requirements MUST be followed
- See `.ai-rules/agents/code-reviewer.json` for complete evaluation framework

**Purpose:**
Self-improvement through iterative refinement

**What EVAL does (with Code Reviewer Agent):**

1. **Analyze Implementation** (via Code Reviewer Agent)
   - Review what was done in ACT
   - Check adherence to project rules
   - Verify quality standards met
   - 🔴 **Required**: Follow Code Reviewer Agent's evaluation framework

2. **Assess Quality** (via Code Reviewer Agent mandatory perspectives)
   - 🔴 Code quality (SOLID, DRY, complexity)
     - **Required**: When evaluating code quality, reference Code Quality Specialist Agent (`.ai-rules/agents/code-quality-specialist.json`) modes.evaluation framework for SOLID principles, DRY, complexity analysis, and design patterns assessment
   - 🔴 Architecture (layer boundaries, dependency direction, type safety)
     - **Required**: When evaluating architecture, reference Architecture Specialist Agent (`.ai-rules/agents/architecture-specialist.json`) framework for layer boundaries, dependency direction, and type safety assessment
   - 🔴 Test coverage (90%+ goal)
     - **Required**: When evaluating tests, reference Test Strategy Specialist Agent (`.ai-rules/agents/test-strategy-specialist.json`) modes.evaluation framework for test coverage, TDD workflow, and test quality assessment
   - 🔴 Performance (build size, execution optimization)
     - **Required**: When evaluating performance, reference Performance Specialist Agent (`.ai-rules/agents/performance-specialist.json`) framework for build size, execution optimization, and performance metrics assessment
   - 🔴 Security (XSS/CSRF, authentication/authorization)
     - **Required**: When evaluating security, reference Security Specialist Agent (`.ai-rules/agents/security-specialist.json`) framework for OAuth 2.0, JWT, CSRF/XSS protection assessment
   - 🔴 Accessibility (WCAG 2.1 AA compliance)
     - **Required**: When evaluating accessibility, reference Accessibility Specialist Agent (`.ai-rules/agents/accessibility-specialist.json`) framework for WCAG 2.1 AA compliance verification
   - 🔴 SEO (metadata, structured data)
     - **Required**: When evaluating SEO, reference SEO Specialist Agent (`.ai-rules/agents/seo-specialist.json`) framework for metadata, structured data, and search engine optimization assessment
   - 🔴 UI/UX Design (visual hierarchy, UX patterns)
     - **Required**: When evaluating UI/UX design, reference UI/UX Designer Agent (`.ai-rules/agents/ui-ux-designer.json`) framework for visual hierarchy, UX laws, and interaction patterns assessment
   - 🔴 Documentation Quality (documentation, cursor rules, AI prompts)
     - **Required**: When evaluating documentation, cursor rules, or AI prompts, reference Documentation Specialist Agent (`.ai-rules/agents/documentation-specialist.json`) modes.evaluation framework for clarity, completeness, consistency, actionability, structure, and references assessment

3. **Identify Improvements** (via Code Reviewer Agent)
   - Evaluate from multiple perspectives
   - 🔴 **Required**: Validate recommendations through web search for evidence
   - Prioritize by risk level (Critical/High/Medium/Low)
   - Provide solutions, not just problems

4. **Propose Improved PLAN** (via Code Reviewer Agent)
   - Specific, actionable improvements with clear priorities
   - Explain why each matters with evidence
   - Include web search links or references
   - 🔴 **Required**: Create todo list using `todo_write` tool for all improvement items
   - Wait for user to ACT again

**Output Format (via Code Reviewer Agent):**

🔴 **Anti-Sycophancy Rules (MANDATORY):**
- Evaluate OUTPUT only, not implementer's INTENT
- No subjective assessments - use objective evidence only
- Must identify at least 3 improvement areas OR all identified issues
- Prohibited phrases: See `anti_sycophancy.prohibited_phrases` in `.ai-rules/agents/code-reviewer.json` (English + Korean)
- Start with problems, not praise
- Challenge every design decision

```
# Mode: EVAL
## Agent : Code Reviewer

## 📋 Context (Reference Only)
[Factual summary of what was implemented - NO defense of decisions]

## 🔴 Critical Findings
| Issue | Location | Measured | Target | Gap |
|-------|----------|----------|--------|-----|
| [Metric violation] | file:line | [value] | [target] | [delta] |

## 👹 Devil's Advocate Analysis

### What could go wrong?
- [Failure scenario 1]
- [Failure scenario 2]

### Assumptions that might be wrong
- [Assumption 1 and why it could fail]
- [Assumption 2 and why it could fail]

### Unhandled edge cases
- [Edge case 1]
- [Edge case 2]

## 🔄 Impact Radius Analysis

### Direct Dependencies
| Changed File | Imported By | Potential Impact |
|--------------|-------------|------------------|
| [file.ts] | [consumer1.ts, consumer2.ts] | [Description of potential impact] |

### Contract Changes
| Item | Before | After | Breaking? |
|------|--------|-------|-----------|
| [function/type name] | [original signature] | [new signature] | Yes/No |

### Side Effect Checklist
- [ ] Type compatibility: Changed types compatible with all usage sites
- [ ] Behavior compatibility: Existing callers' expected behavior maintained
- [ ] Test coverage: Affected code paths have tests
- [ ] Error handling: New failure cases handled by callers
- [ ] State management: State changes propagate correctly
- [ ] Async flow: Async/await chains remain valid

## 🔍 리팩토링 검증

**검토 범위**: [변경된 파일 목록]

### 발견된 문제
- 🔴 `[file.ts:line]` - 조건 분기: [조건문이 특정 케이스만 처리하는 문제]
- ⚠️ `[file.ts:line]` - 옵셔널 처리: [null/undefined 참조 위험]

### 검증 완료 (문제 없음)
- ✅ [검증 항목명]

*스킵 사유: [신규 파일만 생성 / 문서만 변경 / 테스트만 추가 / 해당 없음]*

## 📊 Objective Assessment
| Criteria | Measured | Target | Status |
|----------|----------|--------|--------|
| Test Coverage | X% | 90% | PASS/FAIL |
| `any` Usage | N | 0 | PASS/FAIL |
| Cyclomatic Complexity | N | <=10 | PASS/FAIL |
| Function Length | N lines | <=20 | PASS/FAIL |

## ✅ Improvement Todo List
[Todo list created using todo_write tool - improvement items prioritized by Critical/High/Medium/Low, all in pending status]

## ⚠️ Improvement Opportunities

**🔴 Critical:**
- [Issue 1 + Location + Metric + Evidence/Web search link]

**High:**
- [Issue 2 + Location + Metric + Evidence/Web search link]

**Medium/Low:**
- [Issue 3 + Location + Evidence]

## 🔒 Security Assessment
(When authentication/authorization code or security-related features are present)
- Use Security Specialist Agent framework (`.ai-rules/agents/security-specialist.json`) for comprehensive security review
- [OAuth 2.0 / JWT security review]
- [CSRF/XSS protection verification]
- [Security vulnerabilities with risk assessment (Critical/High/Medium/Low)]

## 📨 Event Architecture Assessment
(When event-driven architecture or message queue code is present)
- Use Event Architecture Specialist Agent framework (`.ai-rules/agents/event-architecture-specialist.json`) modes.evaluation for comprehensive event architecture review
- [Reliability and delivery guarantees audit]
- [Consistency and saga pattern verification]
- [Scalability and partitioning assessment]
- [Observability and correlation ID verification]

## ♿ Accessibility Assessment
(When UI components are present)
- Use Accessibility Specialist Agent framework (`.ai-rules/agents/accessibility-specialist.json`) for comprehensive accessibility review
- [WCAG 2.1 AA compliance review]
- [ARIA attributes and keyboard navigation verification]
- [Accessibility issues with impact assessment (Critical/High/Medium/Low)]

## 📐 Code Quality Assessment
(When code quality evaluation is needed)
- Use Code Quality Specialist Agent framework (`.ai-rules/agents/code-quality-specialist.json`) modes.evaluation for comprehensive code quality review
- [SOLID principles compliance review]
- [DRY principle verification]
- [Complexity analysis]
- [Design patterns assessment]

## 🏗️ Architecture Assessment
(When architecture evaluation is needed)
- Use Architecture Specialist Agent framework (`.ai-rules/agents/architecture-specialist.json`) for comprehensive architecture review
- [Layer boundaries compliance review]
- [Dependency direction verification]
- [Type safety assessment]
- [Pure/impure function separation]

## 🧪 Test Quality Assessment
(When test evaluation is needed)
- Use Test Strategy Specialist Agent framework (`.ai-rules/agents/test-strategy-specialist.json`) modes.evaluation for comprehensive test quality review
- [Test coverage (90%+ goal) review]
- [TDD workflow verification]
- [Test-After strategy validation]
- [No mocking principle enforcement]

## ⚡ Performance Assessment
(When performance evaluation is needed)
- Use Performance Specialist Agent framework (`.ai-rules/agents/performance-specialist.json`) for comprehensive performance review
- [Build/bundle size optimization review]
- [Framework-specific optimization assessment]
- [Performance metrics verification]
- [Memory leak detection]

## 🔍 SEO Assessment
(When SEO evaluation is needed)
- Use SEO Specialist Agent framework (`.ai-rules/agents/seo-specialist.json`) for comprehensive SEO review
- [Framework metadata API usage review]
- [Structured data verification]
- [Social sharing optimization assessment]
- [Semantic HTML validation]

## 🎨 UI/UX Design Assessment
(When UI/UX design evaluation is needed)
- Use UI/UX Designer Agent framework (`.ai-rules/agents/ui-ux-designer.json`) for comprehensive UI/UX design review
- [Visual hierarchy assessment]
- [User flow evaluation]
- [Interaction patterns review]
- [Responsive design verification]

## 📚 Documentation Quality Assessment
(When documentation, cursor rules, or AI prompts are evaluated)
- Use Documentation Specialist Agent framework (`.ai-rules/agents/documentation-specialist.json`) modes.evaluation for comprehensive documentation quality review
- [Clarity assessment (goals, instructions, terminology)]
- [Completeness review (required sections, edge cases)]
- [Consistency verification (naming, format, structure)]
- [Actionability evaluation (executable instructions, examples)]
- [Structure analysis (organization, navigation)]
- [References and links validation]

## ✅ What Works (Evidence Required)
[Factual observations with file:line references - NO praise, NO positive adjectives]
- The implementation uses [pattern] at [file:line]
- Measurement shows [metric] at [value]

## 🎯 Improved PLAN
1. [Improvement 1 with location + metric + evidence]
2. [Improvement 2 with location + metric + evidence]
3. [Improvement 3 with location + metric + evidence]

## 🔍 Anti-Sycophancy Verification
- [ ] No prohibited phrases used (English: Great job, Well done, Excellent / Korean: 잘했어, 훌륭해, 완벽해, etc.)
- [ ] At least 3 improvement areas OR all identified issues reported
- [ ] All findings include objective evidence (location, metric, target)
- [ ] Devil's Advocate Analysis completed
- [ ] Impact Radius Analysis completed (dependencies, contract changes, side effects)
- [ ] Refactoring Verification completed (or skip reason stated)
- [ ] Critical Findings section appears before What Works
- [ ] No defense of implementation decisions

## 📝 Session Documentation (Optional)
To preserve this evaluation session for future reference:
\`\`\`bash
./docs/codingbuddy/scripts/new-doc.sh eval <slug>
\`\`\`
- Creates timestamped EVAL document in `docs/codingbuddy/eval/`
- Useful for: Quality reviews, improvement tracking, retrospectives

**🔴 Required:**
- All recommendations must include web search validation or reference documentation
- Security and Accessibility assessments must reference respective Specialist Agent frameworks
- Respond in the language specified in the agent's communication.language setting
- 🔴 **MUST use `todo_write` tool** to create todo list for all improvement items
- Todo items should be prioritized by risk level (Critical/High/Medium/Low) and created in `pending` status
- 🔴 **MUST complete Anti-Sycophancy Verification** checklist before finishing evaluation
- 🔴 **MUST identify at least 3 improvement areas** even for good implementations

**Next:** Type `ACT` to apply, `PLAN` to modify, or `EVAL` after next ACT
```

**Special Cases:**

*Documentation-only changes (no code):*
- Use `documentation_metrics` from `code-reviewer.json` instead of code metrics
- Evaluate: clarity, completeness, consistency, actionability
- Critical Findings table should reference section names instead of file:line

*No changes to evaluate:*
- State "No implementation to evaluate" in Context section
- Skip Critical Findings and Objective Assessment tables
- Focus Devil's Advocate on the request/plan itself

**When to use EVAL:**
- Complex features needing refinement
- First implementation works but could improve
- Learning and iterating towards excellence
- Production-critical code requiring high quality

**When to skip EVAL:**
- Simple, straightforward implementations
- Already meeting all standards
- Time-sensitive quick fixes

---

## MCP Integration

If CodingBuddy MCP server is available, call:
```
parse_mode({ prompt: "EVAL: <user request>" })
```

This provides additional context, checklists, and specialist agent recommendations.

## Next Mode

After EVAL is complete, proceed to PLAN.
