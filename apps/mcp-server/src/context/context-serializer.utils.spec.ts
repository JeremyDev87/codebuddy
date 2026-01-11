import { describe, it, expect } from 'vitest';
import {
  serializeContextDocument,
  serializeMetadata,
  serializeSection,
  createNewContextDocument,
  createPlanSection,
  mergeArraysUnique,
  mergeSection,
  generateTimestamp,
} from './context-serializer.utils';
import type { ContextDocument, ContextSection } from './context-document.types';

describe('context-serializer.utils', () => {
  describe('serializeMetadata', () => {
    it('serializes all metadata fields', () => {
      const metadata = {
        title: 'Test Task',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastUpdatedAt: '2024-01-01T01:00:00.000Z',
        currentMode: 'PLAN' as const,
        status: 'active' as const,
      };

      const lines = serializeMetadata(metadata);

      expect(lines).toContain('# Context: Test Task');
      expect(lines).toContain('**Created**: 2024-01-01T00:00:00.000Z');
      expect(lines).toContain('**Updated**: 2024-01-01T01:00:00.000Z');
      expect(lines).toContain('**Current Mode**: PLAN');
      expect(lines).toContain('**Status**: active');
      expect(lines).toContain('---');
    });
  });

  describe('serializeSection', () => {
    it('serializes basic section', () => {
      const section: ContextSection = {
        mode: 'PLAN',
        timestamp: '10:00',
        task: 'Plan the feature',
      };

      const lines = serializeSection(section);
      const content = lines.join('\n');

      expect(content).toContain('## PLAN (10:00)');
      expect(content).toContain('### Task');
      expect(content).toContain('Plan the feature');
    });

    it('serializes section with agent info', () => {
      const section: ContextSection = {
        mode: 'PLAN',
        timestamp: '10:00',
        primaryAgent: 'technical-planner',
        recommendedActAgent: 'frontend-developer',
        recommendedActAgentConfidence: 0.9,
      };

      const lines = serializeSection(section);
      const content = lines.join('\n');

      expect(content).toContain('**Primary Agent**: technical-planner');
      expect(content).toContain(
        '**Recommended ACT Agent**: frontend-developer (confidence: 0.9)',
      );
    });

    it('serializes section with decisions and notes', () => {
      const section: ContextSection = {
        mode: 'PLAN',
        timestamp: '10:00',
        decisions: ['Decision 1', 'Decision 2'],
        notes: ['Note 1'],
      };

      const lines = serializeSection(section);
      const content = lines.join('\n');

      expect(content).toContain('### Decisions');
      expect(content).toContain('- Decision 1');
      expect(content).toContain('- Decision 2');
      expect(content).toContain('### Notes');
      expect(content).toContain('- Note 1');
    });

    it('serializes ACT section with progress', () => {
      const section: ContextSection = {
        mode: 'ACT',
        timestamp: '11:00',
        progress: ['Created types', 'Added service'],
      };

      const lines = serializeSection(section);
      const content = lines.join('\n');

      expect(content).toContain('## ACT (11:00)');
      expect(content).toContain('### Progress');
      expect(content).toContain('- Created types');
      expect(content).toContain('- Added service');
    });

    it('serializes EVAL section with findings and recommendations', () => {
      const section: ContextSection = {
        mode: 'EVAL',
        timestamp: '12:00',
        findings: ['Finding 1'],
        recommendations: ['Recommendation 1'],
      };

      const lines = serializeSection(section);
      const content = lines.join('\n');

      expect(content).toContain('## EVAL (12:00)');
      expect(content).toContain('### Findings');
      expect(content).toContain('- Finding 1');
      expect(content).toContain('### Recommendations');
      expect(content).toContain('- Recommendation 1');
    });
  });

  describe('serializeContextDocument', () => {
    it('serializes complete document', () => {
      const doc: ContextDocument = {
        metadata: {
          title: 'Test Task',
          createdAt: '2024-01-01T00:00:00.000Z',
          lastUpdatedAt: '2024-01-01T02:00:00.000Z',
          currentMode: 'ACT',
          status: 'active',
        },
        sections: [
          {
            mode: 'PLAN',
            timestamp: '10:00',
            task: 'Plan',
            decisions: ['Decision 1'],
          },
          {
            mode: 'ACT',
            timestamp: '11:00',
            task: 'Implement',
          },
        ],
      };

      const content = serializeContextDocument(doc);

      expect(content).toContain('# Context: Test Task');
      expect(content).toContain('## PLAN (10:00)');
      expect(content).toContain('## ACT (11:00)');
      expect(content).toContain('- Decision 1');
    });
  });

  describe('createNewContextDocument', () => {
    it('creates document with metadata and section', () => {
      const planSection: ContextSection = {
        mode: 'PLAN',
        timestamp: '10:00',
        task: 'Test task',
      };

      const isoTimestamp = '2024-01-15T10:00:00.000Z';
      const doc = createNewContextDocument(
        'Test Title',
        planSection,
        isoTimestamp,
      );

      expect(doc.metadata.title).toBe('Test Title');
      expect(doc.metadata.createdAt).toBe(isoTimestamp);
      expect(doc.metadata.lastUpdatedAt).toBe(isoTimestamp);
      expect(doc.metadata.currentMode).toBe('PLAN');
      expect(doc.metadata.status).toBe('active');
      expect(doc.sections).toHaveLength(1);
      expect(doc.sections[0]).toEqual(planSection);
    });
  });

  describe('createPlanSection', () => {
    it('creates PLAN section with all fields', () => {
      const section = createPlanSection(
        {
          task: 'Plan task',
          primaryAgent: 'planner',
          recommendedActAgent: 'developer',
          recommendedActAgentConfidence: 0.8,
          decisions: ['D1'],
          notes: ['N1'],
        },
        '10:00',
      );

      expect(section.mode).toBe('PLAN');
      expect(section.timestamp).toBe('10:00');
      expect(section.task).toBe('Plan task');
      expect(section.primaryAgent).toBe('planner');
      expect(section.recommendedActAgent).toBe('developer');
      expect(section.recommendedActAgentConfidence).toBe(0.8);
      expect(section.decisions).toEqual(['D1']);
      expect(section.notes).toEqual(['N1']);
      expect(section.status).toBe('in_progress');
    });
  });

  describe('mergeArraysUnique', () => {
    it('merges arrays without duplicates', () => {
      const existing = ['A', 'B'];
      const newItems = ['B', 'C'];

      const result = mergeArraysUnique(existing, newItems);

      expect(result).toEqual(['A', 'B', 'C']);
    });

    it('handles undefined existing array', () => {
      const result = mergeArraysUnique(undefined, ['A', 'B']);

      expect(result).toEqual(['A', 'B']);
    });

    it('handles undefined new items', () => {
      const result = mergeArraysUnique(['A', 'B'], undefined);

      expect(result).toEqual(['A', 'B']);
    });

    it('handles both undefined', () => {
      const result = mergeArraysUnique(undefined, undefined);

      expect(result).toEqual([]);
    });
  });

  describe('mergeSection', () => {
    it('merges section data with accumulation', () => {
      const existing: ContextSection = {
        mode: 'ACT',
        timestamp: '10:00',
        task: 'Original task',
        decisions: ['D1'],
        notes: ['N1'],
      };

      const newData: Partial<ContextSection> = {
        decisions: ['D2'],
        notes: ['N2'],
        progress: ['P1'],
      };

      const result = mergeSection(existing, newData, '11:00');

      expect(result.mode).toBe('ACT');
      expect(result.timestamp).toBe('11:00');
      expect(result.task).toBe('Original task');
      expect(result.decisions).toEqual(['D1', 'D2']);
      expect(result.notes).toEqual(['N1', 'N2']);
      expect(result.progress).toEqual(['P1']);
    });

    it('overwrites task when provided', () => {
      const existing: ContextSection = {
        mode: 'ACT',
        timestamp: '10:00',
        task: 'Original',
      };

      const result = mergeSection(existing, { task: 'Updated' }, '11:00');

      expect(result.task).toBe('Updated');
    });
  });

  describe('generateTimestamp', () => {
    it('generates HH:MM format', () => {
      const date = new Date('2024-01-01T14:30:00');

      const result = generateTimestamp(date);

      // Format depends on locale, but should contain hour and minute
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('uses current date when not provided', () => {
      const result = generateTimestamp();

      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });
});
