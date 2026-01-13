/**
 * Gitignore Utilities
 *
 * Functions for manipulating .gitignore files
 */

import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';

/**
 * Error thrown when .gitignore file cannot be read
 */
export class GitignoreReadError extends Error {
  readonly cause: unknown;

  constructor(gitignorePath: string, cause: unknown) {
    const message = `Failed to read .gitignore at ${gitignorePath}`;
    super(message);
    this.name = 'GitignoreReadError';
    this.cause = cause;
  }
}

/**
 * Error thrown when .gitignore file cannot be written
 */
export class GitignoreWriteError extends Error {
  readonly cause: unknown;

  constructor(gitignorePath: string, cause: unknown) {
    const message = `Failed to update .gitignore at ${gitignorePath}`;
    super(message);
    this.name = 'GitignoreWriteError';
    this.cause = cause;
  }
}

/**
 * Entry to add to .gitignore
 */
export interface GitignoreEntry {
  /** Pattern to add (e.g., 'node_modules/', 'dist/') */
  pattern: string;
  /** Optional comment to add before the entry (only first entry's comment is used) */
  comment?: string;
}

/**
 * Result of ensureGitignoreEntries operation
 */
export interface EnsureGitignoreResult {
  /** Patterns that were added */
  added: string[];
  /** Patterns that already existed */
  alreadyExists: string[];
}

/**
 * Check if a pattern exists in gitignore content
 */
function patternExists(content: string, pattern: string): boolean {
  const lines = content.split('\n');
  return lines.some(line => line.trim() === pattern);
}

/**
 * Ensure entries exist in .gitignore file
 *
 * - Creates .gitignore if it doesn't exist
 * - Adds entries that don't already exist
 * - Groups entries under a single comment (from first entry with comment)
 * - Preserves existing content
 *
 * @param projectRoot - Project root directory
 * @param entries - Entries to ensure in .gitignore
 * @returns Result with added and already existing patterns
 * @throws {GitignoreReadError} When an existing .gitignore file cannot be read
 * @throws {GitignoreWriteError} When the .gitignore file cannot be written (e.g., permission denied, disk full)
 */
export async function ensureGitignoreEntries(
  projectRoot: string,
  entries: GitignoreEntry[],
): Promise<EnsureGitignoreResult> {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  const result: EnsureGitignoreResult = {
    added: [],
    alreadyExists: [],
  };

  // Read existing content or start with empty
  let existingContent = '';
  if (existsSync(gitignorePath)) {
    try {
      existingContent = await readFile(gitignorePath, 'utf-8');
    } catch (error) {
      throw new GitignoreReadError(gitignorePath, error);
    }
  }

  // Categorize entries
  for (const entry of entries) {
    if (patternExists(existingContent, entry.pattern)) {
      result.alreadyExists.push(entry.pattern);
    } else {
      result.added.push(entry.pattern);
    }
  }

  // If nothing to add, return early
  if (result.added.length === 0) {
    return result;
  }

  // Build new content section
  const newLines: string[] = [];

  // Get comment from first entry that has one
  const comment = entries.find(e => e.comment)?.comment;
  if (comment) {
    newLines.push(comment);
  }

  // Add patterns that need to be added
  for (const pattern of result.added) {
    newLines.push(pattern);
  }

  // Build final content
  let finalContent = existingContent;

  // Ensure existing content ends with newline
  if (finalContent.length > 0 && !finalContent.endsWith('\n')) {
    finalContent += '\n';
  }

  // Add blank line before new section if there's existing content
  if (finalContent.length > 0) {
    finalContent += '\n';
  }

  // Append new lines
  finalContent += newLines.join('\n') + '\n';

  // Write file
  try {
    await writeFile(gitignorePath, finalContent, 'utf-8');
  } catch (error) {
    throw new GitignoreWriteError(gitignorePath, error);
  }

  return result;
}
