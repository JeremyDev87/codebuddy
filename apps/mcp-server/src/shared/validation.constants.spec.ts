import { describe, it, expect } from 'vitest';
import {
  validateQuery,
  validatePrompt,
  validateAgentName,
  MAX_QUERY_LENGTH,
  MAX_PROMPT_LENGTH,
  MAX_AGENT_NAME_LENGTH,
} from './validation.constants';

describe('validateQuery', () => {
  it('should accept valid query', () => {
    const result = validateQuery('search term');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty query', () => {
    const result = validateQuery('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Query cannot be empty');
  });

  it('should reject whitespace-only query', () => {
    const result = validateQuery('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Query cannot be empty');
  });

  it('should reject query exceeding max length', () => {
    const longQuery = 'a'.repeat(MAX_QUERY_LENGTH + 1);
    const result = validateQuery(longQuery);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum length');
  });

  it('should accept query at max length', () => {
    const maxQuery = 'a'.repeat(MAX_QUERY_LENGTH);
    const result = validateQuery(maxQuery);
    expect(result.valid).toBe(true);
  });
});

describe('validatePrompt', () => {
  it('should accept valid prompt', () => {
    const result = validatePrompt('PLAN design the authentication flow');
    expect(result.valid).toBe(true);
  });

  it('should reject empty prompt', () => {
    const result = validatePrompt('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Prompt cannot be empty');
  });

  it('should reject prompt exceeding max length', () => {
    const longPrompt = 'a'.repeat(MAX_PROMPT_LENGTH + 1);
    const result = validatePrompt(longPrompt);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum length');
  });

  it('should accept prompt at max length', () => {
    const maxPrompt = 'a'.repeat(MAX_PROMPT_LENGTH);
    const result = validatePrompt(maxPrompt);
    expect(result.valid).toBe(true);
  });
});

describe('validateAgentName', () => {
  it('should accept valid agent names', () => {
    const validNames = [
      'frontend-developer',
      'code-reviewer',
      'devops-engineer',
      'seo-specialist',
      'test123',
    ];

    for (const name of validNames) {
      const result = validateAgentName(name);
      expect(result.valid).toBe(true);
    }
  });

  it('should reject empty name', () => {
    const result = validateAgentName('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Agent name cannot be empty');
  });

  it('should reject name exceeding max length', () => {
    const longName = 'a'.repeat(MAX_AGENT_NAME_LENGTH + 1);
    const result = validateAgentName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds maximum length');
  });

  it('should reject names with uppercase letters', () => {
    const result = validateAgentName('Frontend-Developer');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('lowercase letters');
  });

  it('should reject names with spaces', () => {
    const result = validateAgentName('frontend developer');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('lowercase letters');
  });

  it('should reject names with special characters', () => {
    const result = validateAgentName('frontend_developer');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('lowercase letters');
  });

  it('should reject names with path traversal attempts', () => {
    const result = validateAgentName('../../../etc/passwd');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('lowercase letters');
  });
});
