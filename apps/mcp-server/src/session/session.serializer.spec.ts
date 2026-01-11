/**
 * Session Serializer Tests
 *
 * Tests for session document serialization including:
 * - serializeDocument function
 * - getLocalizedLabels function
 * - formatTimestamp function
 * - Localization output (en, ko, ja, zh, es)
 * - Roundtrip consistency (serialize → parse → compare)
 */

import { describe, it, expect } from 'vitest';
import {
  serializeDocument,
  getLocalizedLabels,
  formatTimestamp,
  LANGUAGE_TO_LOCALE,
} from './session.serializer';
import { parseDocument, LOCALIZED_LABELS } from './session.parser';
import type { SessionDocument } from './session.types';
import { createTestMetadata } from './__tests__/session-test.utils';

describe('getLocalizedLabels', () => {
  it('should return English labels for "en"', () => {
    const labels = getLocalizedLabels('en');

    expect(labels.SESSION_HEADER).toBe('# Session:');
    expect(labels.CREATED_PREFIX).toBe('**Created**:');
    expect(labels.UPDATED_PREFIX).toBe('**Updated**:');
    expect(labels.STATUS_PREFIX).toBe('**Status**:');
  });

  it('should return Korean labels for "ko"', () => {
    const labels = getLocalizedLabels('ko');

    expect(labels.SESSION_HEADER).toBe('# 세션:');
    expect(labels.CREATED_PREFIX).toBe('**생성일**:');
    expect(labels.UPDATED_PREFIX).toBe('**수정일**:');
    expect(labels.STATUS_PREFIX).toBe('**상태**:');
  });

  it('should return Japanese labels for "ja"', () => {
    const labels = getLocalizedLabels('ja');

    expect(labels.SESSION_HEADER).toBe('# セッション:');
    expect(labels.CREATED_PREFIX).toBe('**作成日**:');
    expect(labels.UPDATED_PREFIX).toBe('**更新日**:');
    expect(labels.STATUS_PREFIX).toBe('**状態**:');
  });

  it('should return Chinese labels for "zh"', () => {
    const labels = getLocalizedLabels('zh');

    expect(labels.SESSION_HEADER).toBe('# 会话:');
    expect(labels.CREATED_PREFIX).toBe('**创建时间**:');
    expect(labels.UPDATED_PREFIX).toBe('**更新时间**:');
    expect(labels.STATUS_PREFIX).toBe('**状态**:');
  });

  it('should return Spanish labels for "es"', () => {
    const labels = getLocalizedLabels('es');

    expect(labels.SESSION_HEADER).toBe('# Sesión:');
    expect(labels.CREATED_PREFIX).toBe('**Creado**:');
    expect(labels.UPDATED_PREFIX).toBe('**Actualizado**:');
    expect(labels.STATUS_PREFIX).toBe('**Estado**:');
  });

  it('should fallback to English for unknown language', () => {
    const labels = getLocalizedLabels('fr');

    expect(labels.SESSION_HEADER).toBe('# Session:');
    expect(labels).toEqual(LOCALIZED_LABELS.en);
  });
});

describe('formatTimestamp', () => {
  it('should format timestamp in 24-hour format', () => {
    const date = new Date('2026-01-11T14:30:00Z');
    const result = formatTimestamp(date, 'en');

    // Time depends on locale but should be HH:MM format
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should use correct locale for different languages', () => {
    expect(LANGUAGE_TO_LOCALE.en).toBe('en-US');
    expect(LANGUAGE_TO_LOCALE.ko).toBe('ko-KR');
    expect(LANGUAGE_TO_LOCALE.ja).toBe('ja-JP');
    expect(LANGUAGE_TO_LOCALE.zh).toBe('zh-CN');
    expect(LANGUAGE_TO_LOCALE.es).toBe('es-ES');
  });

  it('should fallback to en-US for unknown language', () => {
    const date = new Date('2026-01-11T14:30:00Z');
    const result = formatTimestamp(date, 'fr');

    // Should not throw and return valid time format
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('serializeDocument', () => {
  describe('metadata serialization', () => {
    it('should serialize metadata header', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('# Session: Test Session');
      expect(result).toContain('**Created**: 2026-01-11T10:00:00Z');
      expect(result).toContain('**Updated**: 2026-01-11T12:00:00Z');
      expect(result).toContain('**Status**: active');
    });

    it('should include section separator after metadata', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('---');
    });
  });

  describe('section serialization', () => {
    it('should serialize section header with mode and timestamp', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('## PLAN (10:00)');
    });

    it('should serialize primary agent', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            primaryAgent: 'solution-architect',
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('**Primary Agent**: solution-architect');
    });

    it('should serialize recommended ACT agent without confidence', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            recommendedActAgent: 'backend-developer',
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('**Recommended ACT Agent**: backend-developer');
      expect(result).not.toContain('confidence');
    });

    it('should serialize recommended ACT agent with confidence', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            recommendedActAgent: 'backend-developer',
            recommendedActAgentConfidence: 0.95,
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain(
        '**Recommended ACT Agent**: backend-developer (confidence: 0.95)',
      );
    });

    it('should serialize specialists list', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'EVAL',
            timestamp: '10:00',
            specialists: ['security', 'performance', 'accessibility'],
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain(
        '**Specialists**: security, performance, accessibility',
      );
    });

    it('should serialize section status', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'ACT',
            timestamp: '10:00',
            status: 'in_progress',
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('**Status**: in_progress');
    });

    it('should serialize task', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            task: 'Implement user authentication',
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('### Task');
      expect(result).toContain('Implement user authentication');
    });

    it('should serialize decisions list', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            decisions: ['Use JWT', 'Add rate limiting'],
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('### Decisions');
      expect(result).toContain('- Use JWT');
      expect(result).toContain('- Add rate limiting');
    });

    it('should serialize notes list', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          {
            mode: 'ACT',
            timestamp: '10:00',
            notes: ['Consider caching', 'Review security'],
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('### Notes');
      expect(result).toContain('- Consider caching');
      expect(result).toContain('- Review security');
    });

    it('should serialize multiple sections', () => {
      const doc: SessionDocument = {
        metadata: createTestMetadata(),
        sections: [
          { mode: 'PLAN', timestamp: '10:00' },
          { mode: 'ACT', timestamp: '12:00' },
          { mode: 'EVAL', timestamp: '14:00' },
        ],
      };

      const result = serializeDocument(doc, 'en');

      expect(result).toContain('## PLAN (10:00)');
      expect(result).toContain('## ACT (12:00)');
      expect(result).toContain('## EVAL (14:00)');
    });
  });

  describe('localization output', () => {
    it('should serialize with Korean labels', () => {
      const doc: SessionDocument = {
        metadata: {
          ...createTestMetadata(),
          title: '인증 구현',
        },
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            primaryAgent: 'solution-architect',
            task: '사용자 인증 구현',
            decisions: ['JWT 사용'],
          },
        ],
      };

      const result = serializeDocument(doc, 'ko');

      expect(result).toContain('# 세션: 인증 구현');
      expect(result).toContain('**생성일**:');
      expect(result).toContain('**수정일**:');
      expect(result).toContain('**상태**:');
      expect(result).toContain('**주 에이전트**: solution-architect');
      expect(result).toContain('### 작업');
      expect(result).toContain('### 결정 사항');
    });

    it('should serialize with Japanese labels', () => {
      const doc: SessionDocument = {
        metadata: {
          ...createTestMetadata(),
          title: '認証実装',
        },
        sections: [],
      };

      const result = serializeDocument(doc, 'ja');

      expect(result).toContain('# セッション: 認証実装');
      expect(result).toContain('**作成日**:');
      expect(result).toContain('**更新日**:');
      expect(result).toContain('**状態**:');
    });

    it('should serialize with Chinese labels', () => {
      const doc: SessionDocument = {
        metadata: {
          ...createTestMetadata(),
          title: '身份验证',
        },
        sections: [],
      };

      const result = serializeDocument(doc, 'zh');

      expect(result).toContain('# 会话: 身份验证');
      expect(result).toContain('**创建时间**:');
      expect(result).toContain('**更新时间**:');
      expect(result).toContain('**状态**:');
    });

    it('should serialize with Spanish labels', () => {
      const doc: SessionDocument = {
        metadata: {
          ...createTestMetadata(),
          title: 'Autenticación',
        },
        sections: [],
      };

      const result = serializeDocument(doc, 'es');

      expect(result).toContain('# Sesión: Autenticación');
      expect(result).toContain('**Creado**:');
      expect(result).toContain('**Actualizado**:');
      expect(result).toContain('**Estado**:');
    });
  });

  describe('roundtrip consistency', () => {
    /**
     * These tests verify the roundtrip invariant: parse(serialize(doc)) ≡ doc
     *
     * Future enhancement consideration:
     * Property-based testing (e.g., fast-check) could generate random documents
     * to catch edge cases like: empty strings, unicode characters, special
     * markdown syntax, nested lists, etc. Current coverage with explicit test
     * cases across 5 languages is sufficient for the current use cases.
     *
     * @see https://github.com/dubzzz/fast-check
     */
    const languages = ['en', 'ko', 'ja', 'zh', 'es'];

    it.each(languages)(
      'should maintain data integrity after serialize → parse cycle (%s)',
      language => {
        const originalDoc: SessionDocument = {
          metadata: {
            id: 'roundtrip-test',
            title: 'Roundtrip Test',
            createdAt: '2026-01-11T10:00:00Z',
            updatedAt: '2026-01-11T12:00:00Z',
            status: 'active',
          },
          sections: [
            {
              mode: 'PLAN',
              timestamp: '10:00',
              primaryAgent: 'solution-architect',
              recommendedActAgent: 'backend-developer',
              recommendedActAgentConfidence: 0.95,
              specialists: ['security', 'test-strategy'],
              task: 'Implement feature',
              decisions: ['Decision 1', 'Decision 2'],
              notes: ['Note 1'],
              status: 'completed',
            },
          ],
        };

        const serialized = serializeDocument(originalDoc, language);
        const parsed = parseDocument(serialized, 'roundtrip-test');

        // Metadata
        expect(parsed.metadata.title).toBe(originalDoc.metadata.title);
        expect(parsed.metadata.createdAt).toBe(originalDoc.metadata.createdAt);
        expect(parsed.metadata.updatedAt).toBe(originalDoc.metadata.updatedAt);
        expect(parsed.metadata.status).toBe(originalDoc.metadata.status);

        // Section
        expect(parsed.sections).toHaveLength(1);
        const section = parsed.sections[0];
        expect(section.mode).toBe('PLAN');
        expect(section.timestamp).toBe('10:00');
        expect(section.primaryAgent).toBe('solution-architect');
        expect(section.recommendedActAgent).toBe('backend-developer');
        expect(section.recommendedActAgentConfidence).toBe(0.95);
        expect(section.specialists).toEqual(['security', 'test-strategy']);
        expect(section.task).toBe('Implement feature');
        expect(section.decisions).toEqual(['Decision 1', 'Decision 2']);
        expect(section.notes).toEqual(['Note 1']);
        expect(section.status).toBe('completed');
      },
    );
  });

  describe('complete document serialization', () => {
    it('should serialize a complete document with all fields', () => {
      const doc: SessionDocument = {
        metadata: {
          id: 'auth-feature',
          title: 'User Authentication Feature',
          createdAt: '2026-01-11T10:00:00Z',
          updatedAt: '2026-01-11T14:30:00Z',
          status: 'active',
        },
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            primaryAgent: 'solution-architect',
            recommendedActAgent: 'backend-developer',
            recommendedActAgentConfidence: 0.95,
            task: 'Implement user authentication with JWT',
            decisions: [
              'Use JWT for session management',
              'Store refresh tokens in httpOnly cookies',
            ],
            notes: ['Consider OAuth integration later'],
            status: 'completed',
          },
          {
            mode: 'ACT',
            timestamp: '12:00',
            primaryAgent: 'backend-developer',
            specialists: ['security', 'test-strategy'],
            task: 'Implement authentication endpoints',
            notes: ['Created auth middleware', 'Added login/logout endpoints'],
            status: 'in_progress',
          },
        ],
      };

      const result = serializeDocument(doc, 'en');

      // Verify structure
      expect(result).toContain('# Session: User Authentication Feature');
      expect(result).toContain('## PLAN (10:00)');
      expect(result).toContain('## ACT (12:00)');
      expect(result).toContain(
        '**Recommended ACT Agent**: backend-developer (confidence: 0.95)',
      );
      expect(result).toContain('**Specialists**: security, test-strategy');
      expect(result).toContain('### Decisions');
      expect(result).toContain('### Notes');
      expect(result).toContain('---');
    });
  });
});
