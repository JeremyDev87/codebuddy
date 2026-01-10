import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionHandler } from './session.handler';
import { SessionService } from '../../session/session.service';
import type { SessionDocument } from '../../session/session.types';

describe('SessionHandler', () => {
  let handler: SessionHandler;
  let mockSessionService: SessionService;

  const mockSession: SessionDocument = {
    metadata: {
      id: '2026-01-11-test-feature',
      title: 'test-feature',
      createdAt: '2026-01-11T00:00:00Z',
      updatedAt: '2026-01-11T00:00:00Z',
      status: 'active',
    },
    sections: [
      {
        mode: 'PLAN',
        timestamp: '02:00',
        primaryAgent: 'architect',
        recommendedActAgent: 'backend-developer',
        recommendedActAgentConfidence: 0.95,
        task: 'Implement feature',
      },
    ],
  };

  beforeEach(() => {
    mockSessionService = {
      createSession: vi.fn().mockResolvedValue({
        success: true,
        sessionId: '2026-01-11-test-feature',
        filePath: '/test/sessions/2026-01-11-test-feature.md',
        message: 'Session created',
      }),
      getSession: vi.fn().mockResolvedValue(mockSession),
      getActiveSession: vi.fn().mockResolvedValue(mockSession),
      updateSession: vi.fn().mockResolvedValue({
        success: true,
        sessionId: '2026-01-11-test-feature',
        message: 'Session updated',
      }),
      getRecommendedActAgent: vi.fn().mockResolvedValue({
        agent: 'backend-developer',
        confidence: 0.95,
      }),
    } as unknown as SessionService;

    handler = new SessionHandler(mockSessionService);
  });

  describe('handle', () => {
    it('should return null for unhandled tools', async () => {
      const result = await handler.handle('unknown_tool', {});
      expect(result).toBeNull();
    });

    describe('create_session', () => {
      it('should create session with valid title', async () => {
        const result = await handler.handle('create_session', {
          title: 'test-feature',
        });

        expect(result?.isError).toBeFalsy();
        expect(mockSessionService.createSession).toHaveBeenCalledWith({
          title: 'test-feature',
          task: undefined,
        });
      });

      it('should create session with optional task', async () => {
        const result = await handler.handle('create_session', {
          title: 'test-feature',
          task: 'Implement authentication',
        });

        expect(result?.isError).toBeFalsy();
        expect(mockSessionService.createSession).toHaveBeenCalledWith({
          title: 'test-feature',
          task: 'Implement authentication',
        });
      });

      it('should return error for missing title', async () => {
        const result = await handler.handle('create_session', {});

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining('Missing required parameter: title'),
        });
      });

      it('should return error when service fails', async () => {
        mockSessionService.createSession = vi.fn().mockResolvedValue({
          success: false,
          error: 'Failed to create session',
        });

        const result = await handler.handle('create_session', {
          title: 'test',
        });

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining('Failed to create session'),
        });
      });
    });

    describe('get_session', () => {
      it('should get session by id', async () => {
        const result = await handler.handle('get_session', {
          sessionId: '2026-01-11-test-feature',
        });

        expect(result?.isError).toBeFalsy();
        expect(mockSessionService.getSession).toHaveBeenCalledWith(
          '2026-01-11-test-feature',
        );
      });

      it('should return error for missing sessionId', async () => {
        const result = await handler.handle('get_session', {});

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining(
            'Missing required parameter: sessionId',
          ),
        });
      });

      it('should return error when session not found', async () => {
        mockSessionService.getSession = vi.fn().mockResolvedValue(null);

        const result = await handler.handle('get_session', {
          sessionId: 'non-existent',
        });

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining('Session not found'),
        });
      });
    });

    describe('get_active_session', () => {
      it('should get active session with recommended agent', async () => {
        const result = await handler.handle('get_active_session', {});

        expect(result?.isError).toBeFalsy();
        const responseText = result?.content[0]?.text;
        const response = JSON.parse(responseText as string);
        expect(response.found).toBe(true);
        expect(response.session).toBeDefined();
        expect(response.recommendedActAgent).toEqual({
          agent: 'backend-developer',
          confidence: 0.95,
        });
      });

      it('should return not found when no active session', async () => {
        mockSessionService.getActiveSession = vi.fn().mockResolvedValue(null);

        const result = await handler.handle('get_active_session', {});

        expect(result?.isError).toBeFalsy();
        const responseText = result?.content[0]?.text;
        const response = JSON.parse(responseText as string);
        expect(response.found).toBe(false);
        expect(response.message).toContain('No active session');
      });

      it('should handle session without recommended agent', async () => {
        const sessionWithoutRecommendation: SessionDocument = {
          ...mockSession,
          sections: [
            {
              mode: 'PLAN',
              timestamp: '02:00',
              primaryAgent: 'architect',
              // No recommendedActAgent
            },
          ],
        };
        mockSessionService.getActiveSession = vi
          .fn()
          .mockResolvedValue(sessionWithoutRecommendation);

        const result = await handler.handle('get_active_session', {});

        expect(result?.isError).toBeFalsy();
        const responseText = result?.content[0]?.text;
        const response = JSON.parse(responseText as string);
        expect(response.found).toBe(true);
        expect(response.recommendedActAgent).toBeNull();
      });
    });

    describe('update_session', () => {
      it('should update session with valid mode', async () => {
        const result = await handler.handle('update_session', {
          sessionId: '2026-01-11-test-feature',
          mode: 'ACT',
          primaryAgent: 'backend-developer',
        });

        expect(result?.isError).toBeFalsy();
        expect(mockSessionService.updateSession).toHaveBeenCalled();
      });

      it('should pass all section fields', async () => {
        const result = await handler.handle('update_session', {
          sessionId: '2026-01-11-test-feature',
          mode: 'PLAN',
          primaryAgent: 'architect',
          recommendedActAgent: 'backend-developer',
          recommendedActAgentConfidence: 0.9,
          specialists: ['security-specialist'],
          task: 'Implement auth',
          decisions: ['Use JWT'],
          notes: ['Check patterns'],
          status: 'completed',
        });

        expect(result?.isError).toBeFalsy();
        expect(mockSessionService.updateSession).toHaveBeenCalledWith({
          sessionId: '2026-01-11-test-feature',
          section: expect.objectContaining({
            mode: 'PLAN',
            primaryAgent: 'architect',
            recommendedActAgent: 'backend-developer',
            recommendedActAgentConfidence: 0.9,
            specialists: ['security-specialist'],
            task: 'Implement auth',
            decisions: ['Use JWT'],
            notes: ['Check patterns'],
            status: 'completed',
          }),
        });
      });

      it('should return error for missing sessionId', async () => {
        const result = await handler.handle('update_session', {
          mode: 'PLAN',
        });

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining(
            'Missing required parameter: sessionId',
          ),
        });
      });

      it('should return error for missing mode', async () => {
        const result = await handler.handle('update_session', {
          sessionId: '2026-01-11-test-feature',
        });

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining('Missing required parameter: mode'),
        });
      });

      it('should return error for invalid mode', async () => {
        const result = await handler.handle('update_session', {
          sessionId: '2026-01-11-test-feature',
          mode: 'INVALID',
        });

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining('Invalid mode'),
        });
      });

      it('should return error when service fails', async () => {
        mockSessionService.updateSession = vi.fn().mockResolvedValue({
          success: false,
          error: 'Session not found',
        });

        const result = await handler.handle('update_session', {
          sessionId: 'non-existent',
          mode: 'PLAN',
        });

        expect(result?.isError).toBe(true);
        expect(result?.content[0]).toMatchObject({
          type: 'text',
          text: expect.stringContaining('Session not found'),
        });
      });
    });
  });

  describe('getToolDefinitions', () => {
    it('should return all 4 tool definitions', () => {
      const definitions = handler.getToolDefinitions();

      expect(definitions).toHaveLength(4);
      expect(definitions.map(d => d.name)).toEqual([
        'create_session',
        'get_session',
        'get_active_session',
        'update_session',
      ]);
    });

    it('should have correct required parameters for create_session', () => {
      const definitions = handler.getToolDefinitions();
      const createSession = definitions.find(d => d.name === 'create_session');

      expect(createSession?.inputSchema.required).toContain('title');
    });

    it('should have correct required parameters for get_session', () => {
      const definitions = handler.getToolDefinitions();
      const getSession = definitions.find(d => d.name === 'get_session');

      expect(getSession?.inputSchema.required).toContain('sessionId');
    });

    it('should have no required parameters for get_active_session', () => {
      const definitions = handler.getToolDefinitions();
      const getActiveSession = definitions.find(
        d => d.name === 'get_active_session',
      );

      expect(getActiveSession?.inputSchema.required).toEqual([]);
    });

    it('should have correct required parameters for update_session', () => {
      const definitions = handler.getToolDefinitions();
      const updateSession = definitions.find(d => d.name === 'update_session');

      expect(updateSession?.inputSchema.required).toEqual([
        'sessionId',
        'mode',
      ]);
    });

    it('should mention IMPORTANT in get_active_session description', () => {
      const definitions = handler.getToolDefinitions();
      const getActiveSession = definitions.find(
        d => d.name === 'get_active_session',
      );

      expect(getActiveSession?.description).toContain('IMPORTANT');
    });
  });
});
