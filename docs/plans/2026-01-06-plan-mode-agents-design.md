# PLAN Mode Agent System Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add specialized agents for PLAN mode with intent-based automatic selection and skills integration.

**Architecture:** Three-component system - Solution Architect for high-level design, Technical Planner for implementation planning, and enhanced PrimaryAgentResolver with intent analysis.

**Tech Stack:** TypeScript, NestJS, Vitest

---

## Overview

This design adds two new Primary Agents for PLAN mode:

1. **Solution Architect** - High-level system design and architecture planning
2. **Technical Planner** - Low-level implementation planning with TDD approach

Both agents integrate with superpowers skills and are automatically selected via intent analysis in the PrimaryAgentResolver.

## Agent Definitions

### Solution Architect

**Purpose:** Handle high-level architecture design tasks

**Skills Integration:**
- Required: `superpowers:brainstorming` - Explore design options through collaborative dialogue
- Recommended: `superpowers:writing-plans` - Document validated designs

**Activation Intent Patterns:**
- Korean: 아키텍처, 시스템 설계, 전체 구조, 기술 선택, 설계 방향
- English: architecture, system design, technology selection

**Workflow:**
1. Invoke brainstorming skill
2. Ask clarifying questions (one at a time)
3. Propose 2-3 approaches with trade-offs
4. Present design in sections (200-300 words)
5. Validate each section with user
6. Document to docs/plans/

### Technical Planner

**Purpose:** Create detailed implementation plans with TDD approach

**Skills Integration:**
- Required: `superpowers:writing-plans` - Create comprehensive implementation plans
- Recommended: `superpowers:test-driven-development`, `superpowers:subagent-driven-development`

**Activation Intent Patterns:**
- Korean: 구현 계획, 작업 분해, 단계별, TDD 계획, 테스트 먼저
- English: implementation plan, task breakdown, step-by-step, TDD plan

**Workflow:**
1. Invoke writing-plans skill
2. Read design document or requirements
3. Break into bite-sized tasks (2-5 minutes each)
4. Include exact file paths and complete code
5. Save to docs/plans/
6. Offer execution choice (subagent vs parallel session)

## Intent Analysis System

### PrimaryAgentResolver Enhancement

**Resolution Priority (updated):**
1. explicit - Direct agent request in prompt
2. config - Project configuration
3. intent - **NEW** Prompt content analysis
4. context - File path patterns
5. default - frontend-developer

### Intent Pattern Matching

```typescript
private static readonly INTENT_PATTERNS = [
  // Solution Architect triggers
  { pattern: /아키텍처|architecture|시스템\s*설계|system\s*design/i,
    agent: 'solution-architect', confidence: 0.85, category: 'architecture' },
  { pattern: /기술\s*선택|technology\s*selection/i,
    agent: 'solution-architect', confidence: 0.8, category: 'architecture' },

  // Technical Planner triggers
  { pattern: /구현\s*계획|implementation\s*plan|작업\s*분해/i,
    agent: 'technical-planner', confidence: 0.85, category: 'planning' },
  { pattern: /TDD\s*계획|test.?first|단계별/i,
    agent: 'technical-planner', confidence: 0.85, category: 'planning' },
];
```

## Integration Flow

```
User: "PLAN 인증 시스템 아키텍처 설계해줘"
         │
         ▼
    parse_mode → Mode: PLAN
         │
         ▼
    PrimaryAgentResolver.resolve('PLAN', prompt)
      1. explicit? No
      2. config? No
      3. intent? "아키텍처 설계" → solution-architect (0.85) ✓
         │
         ▼
    Solution Architect Activated
      → skills.required: superpowers:brainstorming
      → Invoke brainstorming skill
      → Collaborative design exploration
         │
         ▼
    User: "구현 계획 작성해줘"
         │
         ▼
    PrimaryAgentResolver.resolve('PLAN', prompt)
      → intent: "구현 계획" → technical-planner (0.85) ✓
         │
         ▼
    Technical Planner Activated
      → skills.required: superpowers:writing-plans
      → Create bite-sized TDD implementation plan
```

## Files Modified

### New Files
- `packages/rules/.ai-rules/agents/solution-architect.json`
- `packages/rules/.ai-rules/agents/technical-planner.json`

### Modified Files
- `apps/mcp-server/src/keyword/keyword.types.ts` - Added 'intent' to PrimaryAgentSource
- `apps/mcp-server/src/keyword/primary-agent-resolver.ts` - Added INTENT_PATTERNS and analyzeIntent()
- `apps/mcp-server/src/keyword/primary-agent-resolver.spec.ts` - Added intent analysis tests

## Type Changes

```typescript
// keyword.types.ts
export type PrimaryAgentSource =
  | 'explicit'
  | 'config'
  | 'intent'  // NEW
  | 'context'
  | 'default';
```

## Test Coverage

New tests added for:
- Intent detection for solution-architect (Korean and English)
- Intent detection for technical-planner (Korean and English)
- Priority: explicit > config > intent > context
- Fallback when agent not in registry

## Deployment Notes

1. Both agents have `role.type: "primary"` for automatic registration
2. Skills are defined in agent JSON but require superpowers plugin
3. Intent patterns use bilingual (Korean/English) regex matching
4. Confidence threshold is 0.8 for intent-based selection
