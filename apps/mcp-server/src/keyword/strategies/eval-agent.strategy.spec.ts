/**
 * EVAL Agent Strategy Tests
 *
 * Tests for the EvalAgentStrategy class.
 * EVAL mode always returns code-reviewer with full confidence.
 */

import { describe, it, expect } from 'vitest';
import { EvalAgentStrategy } from './eval-agent.strategy';
import { EVAL_PRIMARY_AGENT } from '../keyword.types';
import { createEvalContext } from './__tests__/strategy-test.utils';

describe('EvalAgentStrategy', () => {
  const strategy = new EvalAgentStrategy();

  describe('resolve', () => {
    it('should always return code-reviewer agent', async () => {
      const result = await strategy.resolve(createEvalContext());

      expect(result.agentName).toBe(EVAL_PRIMARY_AGENT);
      expect(result.agentName).toBe('code-reviewer');
    });

    it('should return default source', async () => {
      const result = await strategy.resolve(createEvalContext());

      expect(result.source).toBe('default');
    });

    it('should return full confidence (1.0)', async () => {
      const result = await strategy.resolve(createEvalContext());

      expect(result.confidence).toBe(1.0);
    });

    it('should return appropriate reason', async () => {
      const result = await strategy.resolve(createEvalContext());

      expect(result.reason).toBe('EVAL mode always uses code-reviewer');
    });

    it('should ignore prompt content', async () => {
      const result = await strategy.resolve(
        createEvalContext({ prompt: 'Use backend-developer for this task' }),
      );

      expect(result.agentName).toBe('code-reviewer');
    });

    it('should ignore available agents list', async () => {
      const result = await strategy.resolve(
        createEvalContext({ availableAgents: ['frontend-developer'] }),
      );

      expect(result.agentName).toBe('code-reviewer');
    });

    it('should ignore context', async () => {
      const result = await strategy.resolve(
        createEvalContext({
          context: { filePath: '/src/api/users.ts', projectType: 'backend' },
        }),
      );

      expect(result.agentName).toBe('code-reviewer');
    });

    it('should ignore recommended agent', async () => {
      const result = await strategy.resolve(
        createEvalContext({ recommendedActAgent: 'backend-developer' }),
      );

      expect(result.agentName).toBe('code-reviewer');
    });
  });

  describe('result structure', () => {
    it('should return PrimaryAgentResolutionResult interface', async () => {
      const result = await strategy.resolve(createEvalContext());

      expect(result).toHaveProperty('agentName');
      expect(result).toHaveProperty('source');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('reason');
      expect(typeof result.agentName).toBe('string');
      expect(typeof result.source).toBe('string');
      expect(typeof result.confidence).toBe('number');
      expect(typeof result.reason).toBe('string');
    });
  });
});
