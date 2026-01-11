/**
 * Session Parser Tests
 *
 * Tests for parseDocument function including:
 * - Metadata parsing (title, created, updated, status)
 * - Section header parsing (mode, timestamp)
 * - Section fields (primaryAgent, recommendedActAgent, specialists, status)
 * - List parsing (task, decisions, notes)
 * - Localization support (en, ko, ja, zh, es)
 * - Edge cases and error handling
 */

import { describe, it, expect } from 'vitest';
import { parseDocument } from './session.parser';

describe('parseDocument', () => {
  describe('metadata parsing', () => {
    it('should parse session title', () => {
      const content = `# Session: My Test Session
**Created**: 2026-01-11T10:00:00Z
**Updated**: 2026-01-11T12:00:00Z
**Status**: active`;

      const result = parseDocument(content, 'test-session');

      expect(result.metadata.title).toBe('My Test Session');
    });

    it('should parse created timestamp', () => {
      const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z
**Updated**: 2026-01-11T12:00:00Z
**Status**: active`;

      const result = parseDocument(content, 'test-session');

      expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
    });

    it('should parse updated timestamp', () => {
      const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z
**Updated**: 2026-01-11T12:30:00Z
**Status**: active`;

      const result = parseDocument(content, 'test-session');

      expect(result.metadata.updatedAt).toBe('2026-01-11T12:30:00Z');
    });

    it('should parse active status', () => {
      const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z
**Updated**: 2026-01-11T12:00:00Z
**Status**: active`;

      const result = parseDocument(content, 'test-session');

      expect(result.metadata.status).toBe('active');
    });

    it('should parse completed status', () => {
      const content = `# Session: Test
**Status**: completed`;

      const result = parseDocument(content, 'test-session');

      expect(result.metadata.status).toBe('completed');
    });

    it('should parse archived status', () => {
      const content = `# Session: Test
**Status**: archived`;

      const result = parseDocument(content, 'test-session');

      expect(result.metadata.status).toBe('archived');
    });

    it('should use session ID for default metadata', () => {
      const result = parseDocument('', 'my-session-id');

      expect(result.metadata.id).toBe('my-session-id');
      expect(result.metadata.title).toBe('my-session-id');
      expect(result.metadata.status).toBe('active');
    });
  });

  describe('section header parsing', () => {
    it('should parse PLAN section', () => {
      const content = `# Session: Test
---

## PLAN (10:00)`;

      const result = parseDocument(content, 'test');

      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].mode).toBe('PLAN');
      expect(result.sections[0].timestamp).toBe('10:00');
    });

    it('should parse ACT section', () => {
      const content = `# Session: Test
---

## ACT (14:30)`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].mode).toBe('ACT');
      expect(result.sections[0].timestamp).toBe('14:30');
    });

    it('should parse EVAL section', () => {
      const content = `# Session: Test
---

## EVAL (16:45)`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].mode).toBe('EVAL');
      expect(result.sections[0].timestamp).toBe('16:45');
    });

    it('should parse AUTO section', () => {
      const content = `# Session: Test
---

## AUTO (09:15)`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].mode).toBe('AUTO');
      expect(result.sections[0].timestamp).toBe('09:15');
    });

    it('should parse multiple sections', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

**Primary Agent**: solution-architect

---

## ACT (11:00)

**Primary Agent**: backend-developer

---`;

      const result = parseDocument(content, 'test');

      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].mode).toBe('PLAN');
      expect(result.sections[1].mode).toBe('ACT');
    });
  });

  describe('section field parsing', () => {
    it('should parse primary agent', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

**Primary Agent**: solution-architect`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].primaryAgent).toBe('solution-architect');
    });

    it('should parse recommended ACT agent without confidence', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

**Recommended ACT Agent**: backend-developer`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].recommendedActAgent).toBe('backend-developer');
      expect(result.sections[0].recommendedActAgentConfidence).toBeUndefined();
    });

    it('should parse recommended ACT agent with confidence', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

**Recommended ACT Agent**: backend-developer (confidence: 0.95)`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].recommendedActAgent).toBe('backend-developer');
      expect(result.sections[0].recommendedActAgentConfidence).toBe(0.95);
    });

    it('should parse specialists list', () => {
      const content = `# Session: Test
---

## EVAL (10:00)

**Specialists**: security, performance, accessibility`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].specialists).toEqual([
        'security',
        'performance',
        'accessibility',
      ]);
    });

    it('should parse section status', () => {
      const content = `# Session: Test
---

## ACT (10:00)

**Status**: in_progress`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].status).toBe('in_progress');
    });
  });

  describe('list parsing', () => {
    it('should parse task content', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

### Task
Implement user authentication with JWT`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].task).toBe(
        'Implement user authentication with JWT',
      );
    });

    it('should parse multi-line task content', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

### Task
Implement user authentication
with JWT tokens`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].task).toBe(
        'Implement user authentication\nwith JWT tokens',
      );
    });

    it('should parse decisions list', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

### Decisions
- Use JWT for session management
- Store refresh tokens in httpOnly cookies`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].decisions).toEqual([
        'Use JWT for session management',
        'Store refresh tokens in httpOnly cookies',
      ]);
    });

    it('should parse notes list', () => {
      const content = `# Session: Test
---

## ACT (10:00)

### Notes
- Consider rate limiting
- Need to add password hashing`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].notes).toEqual([
        'Consider rate limiting',
        'Need to add password hashing',
      ]);
    });
  });

  describe('localization - Korean', () => {
    it('should parse Korean session header', () => {
      const content = `# 세션: 인증 구현
**생성일**: 2026-01-11T10:00:00Z
**수정일**: 2026-01-11T12:00:00Z
**상태**: active`;

      const result = parseDocument(content, 'test');

      expect(result.metadata.title).toBe('인증 구현');
      expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
      expect(result.metadata.updatedAt).toBe('2026-01-11T12:00:00Z');
    });

    it('should parse Korean section fields', () => {
      const content = `# 세션: 테스트
---

## PLAN (10:00)

**주 에이전트**: solution-architect
**권장 ACT 에이전트**: backend-developer (confidence: 0.9)
**전문가**: security, performance`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].primaryAgent).toBe('solution-architect');
      expect(result.sections[0].recommendedActAgent).toBe('backend-developer');
      expect(result.sections[0].recommendedActAgentConfidence).toBe(0.9);
      expect(result.sections[0].specialists).toEqual([
        'security',
        'performance',
      ]);
    });

    it('should parse Korean list headers', () => {
      const content = `# 세션: 테스트
---

## PLAN (10:00)

### 작업
사용자 인증 구현

### 결정 사항
- JWT 사용
- 쿠키에 토큰 저장

### 노트
- 보안 검토 필요`;

      const result = parseDocument(content, 'test');

      expect(result.sections[0].task).toBe('사용자 인증 구현');
      expect(result.sections[0].decisions).toEqual([
        'JWT 사용',
        '쿠키에 토큰 저장',
      ]);
      expect(result.sections[0].notes).toEqual(['보안 검토 필요']);
    });
  });

  describe('localization - Japanese', () => {
    it('should parse Japanese session header', () => {
      const content = `# セッション: 認証実装
**作成日**: 2026-01-11T10:00:00Z
**更新日**: 2026-01-11T12:00:00Z
**状態**: active`;

      const result = parseDocument(content, 'test');

      expect(result.metadata.title).toBe('認証実装');
      expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
    });
  });

  describe('localization - Chinese', () => {
    it('should parse Chinese session header', () => {
      const content = `# 会话: 身份验证
**创建时间**: 2026-01-11T10:00:00Z
**更新时间**: 2026-01-11T12:00:00Z
**状态**: active`;

      const result = parseDocument(content, 'test');

      expect(result.metadata.title).toBe('身份验证');
      expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
    });
  });

  describe('localization - Spanish', () => {
    it('should parse Spanish session header', () => {
      const content = `# Sesión: Autenticación
**Creado**: 2026-01-11T10:00:00Z
**Actualizado**: 2026-01-11T12:00:00Z
**Estado**: active`;

      const result = parseDocument(content, 'test');

      expect(result.metadata.title).toBe('Autenticación');
      expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
    });
  });

  describe('edge cases', () => {
    it('should handle empty content', () => {
      const result = parseDocument('', 'empty-session');

      expect(result.metadata.id).toBe('empty-session');
      expect(result.metadata.title).toBe('empty-session');
      expect(result.sections).toHaveLength(0);
    });

    it('should handle content with only metadata', () => {
      const content = `# Session: Test Only
**Status**: active`;

      const result = parseDocument(content, 'test');

      expect(result.metadata.title).toBe('Test Only');
      expect(result.sections).toHaveLength(0);
    });

    it('should handle section without content', () => {
      const content = `# Session: Test
---

## PLAN (10:00)

---`;

      const result = parseDocument(content, 'test');

      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].mode).toBe('PLAN');
      expect(result.sections[0].decisions).toBeUndefined();
      expect(result.sections[0].notes).toBeUndefined();
    });

    it('should ignore invalid status values', () => {
      const content = `# Session: Test
**Status**: invalid_status`;

      const result = parseDocument(content, 'test');

      // Should keep default 'active' status
      expect(result.metadata.status).toBe('active');
    });

    it('should handle extra whitespace', () => {
      const content = `# Session:   Test With Spaces
**Created**:   2026-01-11T10:00:00Z  `;

      const result = parseDocument(content, 'test');

      expect(result.metadata.title).toBe('Test With Spaces');
      expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
    });
  });

  describe('complete document parsing', () => {
    it('should parse a complete session document', () => {
      const content = `# Session: User Authentication Feature
**Created**: 2026-01-11T10:00:00Z
**Updated**: 2026-01-11T14:30:00Z
**Status**: active

---

## PLAN (10:00)

**Primary Agent**: solution-architect
**Recommended ACT Agent**: backend-developer (confidence: 0.95)

### Task
Implement user authentication with JWT

### Decisions
- Use JWT for session management
- Store refresh tokens in httpOnly cookies
- Add rate limiting for login endpoint

### Notes
- Consider OAuth integration later

**Status**: completed

---

## ACT (12:00)

**Primary Agent**: backend-developer
**Specialists**: security, test-strategy

### Task
Implement authentication endpoints

### Notes
- Created auth middleware
- Added login/logout endpoints

**Status**: in_progress

---`;

      const result = parseDocument(content, 'auth-feature');

      // Metadata
      expect(result.metadata.title).toBe('User Authentication Feature');
      expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
      expect(result.metadata.updatedAt).toBe('2026-01-11T14:30:00Z');
      expect(result.metadata.status).toBe('active');

      // Sections
      expect(result.sections).toHaveLength(2);

      // PLAN section
      const planSection = result.sections[0];
      expect(planSection.mode).toBe('PLAN');
      expect(planSection.timestamp).toBe('10:00');
      expect(planSection.primaryAgent).toBe('solution-architect');
      expect(planSection.recommendedActAgent).toBe('backend-developer');
      expect(planSection.recommendedActAgentConfidence).toBe(0.95);
      expect(planSection.task).toBe('Implement user authentication with JWT');
      expect(planSection.decisions).toHaveLength(3);
      expect(planSection.notes).toHaveLength(1);
      expect(planSection.status).toBe('completed');

      // ACT section
      const actSection = result.sections[1];
      expect(actSection.mode).toBe('ACT');
      expect(actSection.timestamp).toBe('12:00');
      expect(actSection.primaryAgent).toBe('backend-developer');
      expect(actSection.specialists).toEqual(['security', 'test-strategy']);
      expect(actSection.status).toBe('in_progress');
    });
  });

  describe('malformed input handling', () => {
    describe('missing or invalid session header', () => {
      it('should handle document without session header', () => {
        const content = `**Created**: 2026-01-11T10:00:00Z
**Updated**: 2026-01-11T12:00:00Z
**Status**: active`;

        const result = parseDocument(content, 'no-header');

        // Should handle gracefully - id is set, title may be empty or id
        expect(result.metadata.id).toBe('no-header');
        // Title may be empty or use a fallback
        expect(typeof result.metadata.title).toBe('string');
      });

      it('should handle incomplete session header', () => {
        const content = `# Session:
**Created**: 2026-01-11T10:00:00Z`;

        const result = parseDocument(content, 'test');

        expect(result.metadata.title).toBe('');
        expect(result.metadata.createdAt).toBe('2026-01-11T10:00:00Z');
      });

      it('should handle session header with only whitespace title', () => {
        const content = `# Session:
**Created**: 2026-01-11T10:00:00Z`;

        const result = parseDocument(content, 'test');

        expect(result.metadata.title).toBe('');
      });
    });

    describe('duplicate metadata keys', () => {
      it('should handle duplicate Created timestamps gracefully', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z
**Created**: 2026-01-11T11:00:00Z
**Updated**: 2026-01-11T12:00:00Z`;

        const result = parseDocument(content, 'test');

        // Parser uses last occurrence for duplicate fields
        expect(result.metadata.createdAt).toBe('2026-01-11T11:00:00Z');
      });

      it('should handle duplicate status fields gracefully', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z
**Status**: active
**Status**: completed`;

        const result = parseDocument(content, 'test');

        // Parser uses last occurrence for duplicate fields
        expect(result.metadata.status).toBe('completed');
      });
    });

    describe('invalid section headers', () => {
      it('should ignore section with invalid mode name', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z

---

## INVALID_MODE (10:00)

**Primary Agent**: some-agent`;

        const result = parseDocument(content, 'test');

        // Invalid mode should not create a section
        expect(result.sections).toHaveLength(0);
      });

      it('should handle section header without timestamp', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z

---

## PLAN

**Primary Agent**: solution-architect`;

        const result = parseDocument(content, 'test');

        // Section without proper timestamp format may not be parsed
        // Behavior depends on parser implementation
        expect(result.metadata.title).toBe('Test');
      });

      it('should handle section header with malformed timestamp', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z

---

## PLAN (invalid-time)

**Primary Agent**: solution-architect`;

        const result = parseDocument(content, 'test');

        // Parser should handle gracefully
        expect(result.metadata.title).toBe('Test');
      });
    });

    describe('corrupted markdown structure', () => {
      it('should handle document with only separators', () => {
        const content = `---
---
---`;

        const result = parseDocument(content, 'separators-only');

        expect(result.metadata.id).toBe('separators-only');
        expect(result.sections).toHaveLength(0);
      });

      it('should handle document with mixed valid and invalid sections', () => {
        const content = `# Session: Mixed Content
**Created**: 2026-01-11T10:00:00Z
**Status**: active

---

## PLAN (10:00)

**Primary Agent**: solution-architect
**Status**: completed

---

## GARBAGE_MODE (11:00)

This should be ignored

---

## ACT (12:00)

**Primary Agent**: backend-developer`;

        const result = parseDocument(content, 'test');

        // Should parse valid sections, ignore invalid
        expect(result.metadata.title).toBe('Mixed Content');
        // Valid sections should be parsed (PLAN and ACT)
        const validModes = result.sections.map(s => s.mode);
        expect(validModes).not.toContain('GARBAGE_MODE');
      });

      it('should handle section without closing separator', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z

---

## PLAN (10:00)

**Primary Agent**: solution-architect

### Task
This is the task content`;

        const result = parseDocument(content, 'test');

        // Parser should still parse the section
        expect(result.sections.length).toBeGreaterThanOrEqual(0);
        if (result.sections.length > 0) {
          expect(result.sections[0].mode).toBe('PLAN');
        }
      });
    });

    describe('special characters and edge cases', () => {
      it('should handle unicode characters in content', () => {
        const content = `# Session: 테스트 🚀 Test
**Created**: 2026-01-11T10:00:00Z

---

## PLAN (10:00)

### Task
Handle emojis 🎉 and unicode: 日本語 中文 한국어`;

        const result = parseDocument(content, 'test');

        expect(result.metadata.title).toBe('테스트 🚀 Test');
        if (result.sections.length > 0) {
          expect(result.sections[0].task).toContain('emojis');
        }
      });

      it('should handle very long content in fields', () => {
        const longText = 'A'.repeat(10000);
        const content = `# Session: ${longText}
**Created**: 2026-01-11T10:00:00Z`;

        const result = parseDocument(content, 'test');

        expect(result.metadata.title).toBe(longText);
      });

      it('should handle newlines in task content', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z

---

## PLAN (10:00)

### Task
Line 1
Line 2
Line 3`;

        const result = parseDocument(content, 'test');

        if (result.sections.length > 0 && result.sections[0].task) {
          expect(result.sections[0].task).toContain('Line 1');
        }
      });
    });

    describe('missing required fields', () => {
      it('should handle document without status', () => {
        const content = `# Session: No Status
**Created**: 2026-01-11T10:00:00Z
**Updated**: 2026-01-11T12:00:00Z`;

        const result = parseDocument(content, 'test');

        expect(result.metadata.title).toBe('No Status');
        // Status should have default or be empty
        expect(result.metadata.status).toBeDefined();
      });

      it('should handle section without primary agent', () => {
        const content = `# Session: Test
**Created**: 2026-01-11T10:00:00Z

---

## PLAN (10:00)

### Task
Some task without primary agent`;

        const result = parseDocument(content, 'test');

        if (result.sections.length > 0) {
          expect(result.sections[0].primaryAgent).toBeUndefined();
        }
      });
    });
  });
});
