/**
 * Input Validation Constants
 *
 * Defines limits and patterns for validating user input
 * to prevent resource exhaustion and injection attacks.
 */

// ============================================================================
// Length Limits
// ============================================================================

/**
 * Maximum length for search queries
 * Prevents large queries from consuming excessive resources
 */
export const MAX_QUERY_LENGTH = 1000;

/**
 * Maximum length for prompts (PLAN/ACT/EVAL mode)
 * Allows for detailed prompts while preventing abuse
 */
export const MAX_PROMPT_LENGTH = 10000;

/**
 * Maximum length for agent names
 * Agent names should be short identifiers
 */
export const MAX_AGENT_NAME_LENGTH = 100;

// ============================================================================
// Patterns
// ============================================================================

/**
 * Valid agent name pattern
 * Only allows lowercase letters, numbers, and hyphens
 * Examples: "frontend-developer", "code-reviewer", "devops-engineer"
 */
export const AGENT_NAME_PATTERN = /^[a-z0-9-]+$/;

// ============================================================================
// Validation Functions
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate search query input
 */
export function validateQuery(query: string): ValidationResult {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: 'Query cannot be empty' };
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`,
    };
  }
  return { valid: true };
}

/**
 * Validate prompt input for mode parsing
 */
export function validatePrompt(prompt: string): ValidationResult {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`,
    };
  }
  return { valid: true };
}

/**
 * Validate agent name format
 */
export function validateAgentName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Agent name cannot be empty' };
  }
  if (name.length > MAX_AGENT_NAME_LENGTH) {
    return {
      valid: false,
      error: `Agent name exceeds maximum length of ${MAX_AGENT_NAME_LENGTH} characters`,
    };
  }
  if (!AGENT_NAME_PATTERN.test(name)) {
    return {
      valid: false,
      error:
        'Agent name must contain only lowercase letters, numbers, and hyphens',
    };
  }
  return { valid: true };
}
