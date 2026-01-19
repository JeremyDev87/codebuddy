/**
 * Diagnostic log entry structure
 */
export interface DiagnosticLogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: string;
  message: string;
  context?: Record<string, unknown>;
}

/**
 * Diagnostic log file structure
 */
export interface DiagnosticLogFile {
  version: string;
  createdAt: string;
  entries: DiagnosticLogEntry[];
}

/**
 * Log operation result
 */
export interface LogOperationResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Log directory path (relative to project root)
 */
export const LOG_DIR_PATH = 'docs/codingbuddy/log';

/**
 * Log file name pattern
 */
export const LOG_FILE_NAME = 'diagnostic.log';

/**
 * Schema version for log file format
 */
export const LOG_SCHEMA_VERSION = '1.0.0';

/**
 * Maximum number of log entries to keep in a single file
 */
export const MAX_LOG_ENTRIES = 1000;
