import { Injectable } from '@nestjs/common';
import type { ToolDefinition } from './base.handler';
import type { ToolResponse } from '../response.utils';
import { AbstractHandler } from './abstract-handler';
import { SessionService } from '../../session/session.service';
import { createJsonResponse, createErrorResponse } from '../response.utils';
import {
  extractRequiredString,
  extractOptionalString,
} from '../../shared/validation.constants';
import type { Mode } from '../../keyword/keyword.types';

/**
 * Handler for session document tools
 * - create_session: Create a new session document
 * - get_session: Get a session document by ID
 * - get_active_session: Get the most recent active session
 * - update_session: Update a session with new section data
 */
@Injectable()
export class SessionHandler extends AbstractHandler {
  constructor(private readonly sessionService: SessionService) {
    super();
  }

  protected getHandledTools(): string[] {
    return [
      'create_session',
      'get_session',
      'get_active_session',
      'update_session',
    ];
  }

  protected async handleTool(
    toolName: string,
    args: Record<string, unknown> | undefined,
  ): Promise<ToolResponse> {
    switch (toolName) {
      case 'create_session':
        return this.handleCreateSession(args);
      case 'get_session':
        return this.handleGetSession(args);
      case 'get_active_session':
        return this.handleGetActiveSession();
      case 'update_session':
        return this.handleUpdateSession(args);
      default:
        return createErrorResponse(`Unknown tool: ${toolName}`);
    }
  }

  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'create_session',
        description:
          'Create a new session document to track PLAN/ACT/EVAL workflow. Call this at the start of a new task to enable cross-mode context sharing.',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description:
                'Session title/slug (e.g., "auth-feature", "fix-login-bug")',
            },
            task: {
              type: 'string',
              description: 'Initial task description',
            },
          },
          required: ['title'],
        },
      },
      {
        name: 'get_session',
        description:
          'Get a session document by ID. Use this to read previous mode context.',
        inputSchema: {
          type: 'object',
          properties: {
            sessionId: {
              type: 'string',
              description: 'Session ID (filename without .md extension)',
            },
          },
          required: ['sessionId'],
        },
      },
      {
        name: 'get_active_session',
        description:
          'Get the most recent active session. IMPORTANT: Call this at the start of ACT mode to get the recommended agent from PLAN.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'update_session',
        description:
          'Update a session document with new section data. Call this to record your work in each mode (PLAN/ACT/EVAL).',
        inputSchema: {
          type: 'object',
          properties: {
            sessionId: {
              type: 'string',
              description: 'Session ID to update',
            },
            mode: {
              type: 'string',
              enum: ['PLAN', 'ACT', 'EVAL', 'AUTO'],
              description: 'Current workflow mode',
            },
            primaryAgent: {
              type: 'string',
              description: 'Primary agent used in this mode',
            },
            recommendedActAgent: {
              type: 'string',
              description:
                'Agent recommended for ACT phase (only set in PLAN mode)',
            },
            recommendedActAgentConfidence: {
              type: 'number',
              description: 'Confidence score for recommendation (0-1)',
            },
            specialists: {
              type: 'array',
              items: { type: 'string' },
              description: 'Specialist agents used',
            },
            task: {
              type: 'string',
              description: 'Task description',
            },
            decisions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Key decisions made',
            },
            notes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Implementation notes',
            },
            status: {
              type: 'string',
              enum: ['in_progress', 'completed', 'blocked'],
              description: 'Status of this section',
            },
          },
          required: ['sessionId', 'mode'],
        },
      },
    ];
  }

  private async handleCreateSession(
    args: Record<string, unknown> | undefined,
  ): Promise<ToolResponse> {
    const title = extractRequiredString(args, 'title');
    if (title === null) {
      return createErrorResponse('Missing required parameter: title');
    }

    const task = extractOptionalString(args, 'task');

    const result = await this.sessionService.createSession({
      title,
      task: task ?? undefined,
    });

    if (result.success) {
      return createJsonResponse(result);
    }

    return createErrorResponse(result.error || 'Failed to create session');
  }

  private async handleGetSession(
    args: Record<string, unknown> | undefined,
  ): Promise<ToolResponse> {
    const sessionId = extractRequiredString(args, 'sessionId');
    if (sessionId === null) {
      return createErrorResponse('Missing required parameter: sessionId');
    }

    const session = await this.sessionService.getSession(sessionId);

    if (!session) {
      return createErrorResponse(`Session not found: ${sessionId}`);
    }

    return createJsonResponse(session);
  }

  private async handleGetActiveSession(): Promise<ToolResponse> {
    const session = await this.sessionService.getActiveSession();

    if (!session) {
      return createJsonResponse({
        found: false,
        message:
          'No active session found. Create one with create_session tool.',
      });
    }

    // Extract recommended ACT agent from PLAN section if available
    const planSection = session.sections.find(s => s.mode === 'PLAN');
    const recommendedActAgent = planSection?.recommendedActAgent;
    const recommendedActAgentConfidence =
      planSection?.recommendedActAgentConfidence;

    return createJsonResponse({
      found: true,
      session,
      // Highlight recommended agent for easy access
      recommendedActAgent: recommendedActAgent
        ? {
            agent: recommendedActAgent,
            confidence: recommendedActAgentConfidence,
          }
        : null,
    });
  }

  private async handleUpdateSession(
    args: Record<string, unknown> | undefined,
  ): Promise<ToolResponse> {
    const sessionId = extractRequiredString(args, 'sessionId');
    if (sessionId === null) {
      return createErrorResponse('Missing required parameter: sessionId');
    }

    const mode = extractRequiredString(args, 'mode');
    if (mode === null) {
      return createErrorResponse('Missing required parameter: mode');
    }

    if (!['PLAN', 'ACT', 'EVAL', 'AUTO'].includes(mode)) {
      return createErrorResponse(
        `Invalid mode: ${mode}. Must be PLAN, ACT, EVAL, or AUTO`,
      );
    }

    const result = await this.sessionService.updateSession({
      sessionId,
      section: {
        mode: mode as Mode,
        primaryAgent: extractOptionalString(args, 'primaryAgent') ?? undefined,
        recommendedActAgent:
          extractOptionalString(args, 'recommendedActAgent') ?? undefined,
        recommendedActAgentConfidence:
          typeof args?.recommendedActAgentConfidence === 'number'
            ? args.recommendedActAgentConfidence
            : undefined,
        specialists: Array.isArray(args?.specialists)
          ? (args.specialists as string[])
          : undefined,
        task: extractOptionalString(args, 'task') ?? undefined,
        decisions: Array.isArray(args?.decisions)
          ? (args.decisions as string[])
          : undefined,
        notes: Array.isArray(args?.notes)
          ? (args.notes as string[])
          : undefined,
        status:
          (extractOptionalString(args, 'status') as
            | 'in_progress'
            | 'completed'
            | 'blocked') ?? undefined,
      },
    });

    if (result.success) {
      return createJsonResponse(result);
    }

    return createErrorResponse(result.error || 'Failed to update session');
  }
}
