/**
 * Security utilities for MCP server
 */

import * as path from 'path';

// ============================================================================
// Prototype Pollution Prevention
// ============================================================================

const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'] as const;

/**
 * Recursively check for dangerous keys in an object (prototype pollution prevention)
 * Uses Object.getOwnPropertyNames to also check non-enumerable properties
 *
 * @param obj - Object to check
 * @param objPath - Current path in object (for error messages)
 * @returns The path to the dangerous key if found, null otherwise
 */
export function containsDangerousKeys(
  obj: unknown,
  objPath = '',
): string | null {
  if (obj === null || typeof obj !== 'object') {
    return null;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const result = containsDangerousKeys(obj[i], `${objPath}[${i}]`);
      if (result) return result;
    }
    return null;
  }

  // Use Object.getOwnPropertyNames to catch all properties including non-enumerable
  const keys = Object.getOwnPropertyNames(obj);

  for (const key of keys) {
    if (DANGEROUS_KEYS.includes(key as (typeof DANGEROUS_KEYS)[number])) {
      return objPath ? `${objPath}.${key}` : key;
    }
  }

  // Recursively check nested objects
  for (const key of keys) {
    if (!DANGEROUS_KEYS.includes(key as (typeof DANGEROUS_KEYS)[number])) {
      const result = containsDangerousKeys(
        (obj as Record<string, unknown>)[key],
        objPath ? `${objPath}.${key}` : key,
      );
      if (result) return result;
    }
  }

  return null;
}

// ============================================================================
// Path Safety
// ============================================================================

/**
 * Check if a relative path is safe (doesn't escape base directory)
 *
 * Handles:
 * - Path traversal (../)
 * - Windows backslash paths (\)
 * - Absolute paths
 * - Null byte injection
 *
 * @param basePath - The base directory path
 * @param relativePath - The relative path to validate
 * @returns true if the path is safe, false otherwise
 */
export function isPathSafe(basePath: string, relativePath: string): boolean {
  // Reject null bytes (null byte injection attack)
  if (relativePath.includes('\x00')) {
    return false;
  }

  // Normalize path separators for cross-platform compatibility
  // Convert Windows backslashes to forward slashes before processing
  const normalizedRelative = relativePath.replace(/\\/g, '/');

  // Resolve both paths to absolute paths
  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(basePath, normalizedRelative);

  // Check if the resolved target is equal to or inside the base directory
  // We need to handle the case where resolvedTarget === resolvedBase (e.g., '.' or '')
  if (resolvedTarget === resolvedBase) {
    return true;
  }

  // Check if target starts with base directory + separator
  // This prevents matching /app/rules-backup when base is /app/rules
  return resolvedTarget.startsWith(resolvedBase + path.sep);
}
