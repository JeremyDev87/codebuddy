import { describe, it, expect } from 'vitest';
import {
  TypeScriptConfigSchema,
  ESLintConfigSchema,
  PrettierConfigSchema,
  MarkdownLintConfigSchema,
} from './conventions.schemas';

describe('TypeScriptConfigSchema', () => {
  it('should validate a complete TypeScript config', () => {
    const config = {
      compilerOptions: {
        strict: true,
        noImplicitAny: true,
        strictNullChecks: true,
        target: 'ES2021',
        module: 'commonjs',
        paths: {
          '@/*': ['./src/*'],
        },
      },
    };

    const result = TypeScriptConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should validate a minimal TypeScript config', () => {
    const config = {};
    const result = TypeScriptConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should reject TypeScript config with invalid types', () => {
    const config = {
      compilerOptions: {
        strict: 'yes', // Should be boolean
      },
    };

    const result = TypeScriptConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('should allow additional compiler options', () => {
    const config = {
      compilerOptions: {
        strict: true,
        customOption: 'value', // Not in schema but should be allowed
      },
    };

    const result = TypeScriptConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });
});

describe('ESLintConfigSchema', () => {
  it('should validate a complete ESLint config', () => {
    const config = {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'no-console': 'warn',
        'no-unused-vars': 'error',
      },
    };

    const result = ESLintConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should validate ESLint config with numeric ecmaVersion', () => {
    const config = {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    };

    const result = ESLintConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should reject ESLint config with invalid sourceType', () => {
    const config = {
      parserOptions: {
        sourceType: 'invalid',
      },
    };

    const result = ESLintConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('should allow extends as string or array', () => {
    const configString = { extends: 'eslint:recommended' };
    const configArray = { extends: ['eslint:recommended'] };

    expect(ESLintConfigSchema.safeParse(configString).success).toBe(true);
    expect(ESLintConfigSchema.safeParse(configArray).success).toBe(true);
  });
});

describe('PrettierConfigSchema', () => {
  it('should validate a complete Prettier config', () => {
    const config = {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      quoteProps: 'as-needed',
      jsxSingleQuote: false,
      trailingComma: 'es5',
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'avoid',
      endOfLine: 'lf',
    };

    const result = PrettierConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should reject Prettier config with invalid trailingComma', () => {
    const config = {
      trailingComma: 'invalid',
    };

    const result = PrettierConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('should reject Prettier config with invalid types', () => {
    const config = {
      printWidth: '80', // Should be number
    };

    const result = PrettierConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });
});

describe('MarkdownLintConfigSchema', () => {
  it('should validate MarkdownLint config with boolean rules', () => {
    const config = {
      MD001: true,
      MD002: false,
    };

    const result = MarkdownLintConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should validate MarkdownLint config with object rules', () => {
    const config = {
      MD013: {
        style: 'consistent',
        line_length: 120,
      },
    };

    const result = MarkdownLintConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should validate mixed MarkdownLint config', () => {
    const config = {
      default: true,
      MD013: {
        line_length: 120,
      },
      MD033: false,
    };

    const result = MarkdownLintConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('should reject MarkdownLint config with invalid rule types', () => {
    const config = {
      MD001: 'yes', // Should be boolean or object
    };

    const result = MarkdownLintConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });
});
