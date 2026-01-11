import type { Mode } from '../keyword/keyword.types';

/**
 * Session document section representing one mode's work.
 */
export interface SessionSection {
  /** Mode type (PLAN, ACT, EVAL, AUTO) */
  mode: Mode;
  /** Timestamp when section was created/updated */
  timestamp: string;
  /** Primary agent used in this mode */
  primaryAgent?: string;
  /** Agent recommended for next ACT phase (only in PLAN) */
  recommendedActAgent?: string;
  /** Confidence score for recommendation (0-1) */
  recommendedActAgentConfidence?: number;
  /** Specialist agents used */
  specialists?: string[];
  /** Task description */
  task?: string;
  /** Key decisions made */
  decisions?: string[];
  /** Implementation notes */
  notes?: string[];
  /** Status of this section */
  status?: 'in_progress' | 'completed' | 'blocked';
}

/**
 * Session document metadata.
 */
export interface SessionMetadata {
  /** Session identifier (slug) */
  id: string;
  /** Session title */
  title: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last updated timestamp */
  updatedAt: string;
  /** Overall session status */
  status: 'active' | 'completed' | 'archived';
}

/**
 * Complete session document structure.
 */
export interface SessionDocument {
  metadata: SessionMetadata;
  sections: SessionSection[];
}

/**
 * Options for creating a new session.
 */
export interface CreateSessionOptions {
  /** Session title/slug */
  title: string;
  /** Initial task description */
  task?: string;
}

/**
 * Options for updating a session.
 */
export interface UpdateSessionOptions {
  /** Session ID to update */
  sessionId: string;
  /** Section to add or update */
  section: Partial<SessionSection> & { mode: Mode };
}

/**
 * Result of session operations.
 */
export interface SessionOperationResult {
  success: boolean;
  sessionId?: string;
  filePath?: string;
  message?: string;
  error?: string;
}

/**
 * Session context included in parse_mode response.
 * Provides previous mode context automatically to AI.
 */
export interface SessionContext {
  /** Session ID */
  sessionId: string;
  /** Session title */
  title: string;
  /** All previous sections (for context) */
  previousSections: SessionSection[];
  /** Recommended ACT agent from PLAN (if available) */
  recommendedActAgent?: {
    agent: string;
    confidence: number;
  };
  /** Summary of key decisions from all modes */
  allDecisions: string[];
  /** Summary of all notes from all modes */
  allNotes: string[];
}
