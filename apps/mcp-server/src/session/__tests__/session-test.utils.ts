/**
 * Shared Test Utilities for Session Tests
 *
 * Provides common factory functions to reduce duplication across
 * session.parser.spec.ts and session.serializer.spec.ts
 */

import type {
  SessionMetadata,
  SessionSection,
  SessionDocument,
} from '../session.types';

/**
 * Create test metadata with sensible defaults.
 *
 * @param overrides - Partial metadata to override defaults
 * @returns Complete SessionMetadata for testing
 *
 * @example
 * const metadata = createTestMetadata({ title: 'My Session' });
 */
export function createTestMetadata(
  overrides: Partial<SessionMetadata> = {},
): SessionMetadata {
  return {
    id: 'test-session',
    title: 'Test Session',
    createdAt: '2026-01-11T10:00:00Z',
    updatedAt: '2026-01-11T12:00:00Z',
    status: 'active',
    ...overrides,
  };
}

/**
 * Create a test section with sensible defaults.
 *
 * @param mode - The mode for this section (PLAN, ACT, EVAL, AUTO)
 * @param overrides - Partial section to override defaults
 * @returns Complete SessionSection for testing
 *
 * @example
 * const section = createTestSection('PLAN', { primaryAgent: 'solution-architect' });
 */
export function createTestSection(
  mode: 'PLAN' | 'ACT' | 'EVAL' | 'AUTO',
  overrides: Partial<Omit<SessionSection, 'mode'>> = {},
): SessionSection {
  return {
    mode,
    timestamp: '10:00',
    ...overrides,
  };
}

/**
 * Create a complete test document with metadata and sections.
 *
 * @param sections - Sections to include (defaults to empty array)
 * @param metadataOverrides - Partial metadata to override defaults
 * @returns Complete SessionDocument for testing
 *
 * @example
 * const doc = createTestDocument([
 *   createTestSection('PLAN', { primaryAgent: 'solution-architect' }),
 * ]);
 */
export function createTestDocument(
  sections: SessionSection[] = [],
  metadataOverrides: Partial<SessionMetadata> = {},
): SessionDocument {
  return {
    metadata: createTestMetadata(metadataOverrides),
    sections,
  };
}

/**
 * Create a roundtrip test document with all fields populated.
 * Useful for testing serialize -> parse consistency.
 *
 * @param language - Language code for title localization
 * @returns Complete SessionDocument with all fields for roundtrip testing
 */
export function createRoundtripTestDocument(
  language: string = 'en',
): SessionDocument {
  const titles: Record<string, string> = {
    en: 'Roundtrip Test',
    ko: '왕복 테스트',
    ja: 'ラウンドトリップテスト',
    zh: '往返测试',
    es: 'Prueba de ida y vuelta',
  };

  return {
    metadata: createTestMetadata({
      id: 'roundtrip-test',
      title: titles[language] || titles.en,
    }),
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
}
