import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SessionService } from './session.service';
import { ConfigService } from '../config/config.service';
import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

vi.mock('fs/promises');
vi.mock('fs', async () => {
  const actual = await vi.importActual('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
  };
});

describe('SessionService', () => {
  let service: SessionService;
  let mockConfigService: ConfigService;
  const mockProjectRoot = '/test/project';
  const sessionsDir = path.join(mockProjectRoot, 'docs/codingbuddy/sessions');

  beforeEach(() => {
    vi.clearAllMocks();

    mockConfigService = {
      getProjectRoot: vi.fn().mockReturnValue(mockProjectRoot),
    } as unknown as ConfigService;

    service = new SessionService(mockConfigService);

    // Default: sessions directory exists
    vi.mocked(existsSync).mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createSession', () => {
    it('should create a new session document', async () => {
      vi.mocked(existsSync)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      vi.mocked(fs.writeFile).mockResolvedValue();

      const result = await service.createSession({
        title: 'test-feature',
      });

      expect(result.success).toBe(true);
      expect(result.sessionId).toMatch(/^\d{4}-\d{2}-\d{2}-test-feature$/);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should create sessions directory if not exists', async () => {
      vi.mocked(existsSync)
        .mockReturnValueOnce(false) // sessions dir doesn't exist
        .mockReturnValueOnce(false); // session file doesn't exist
      vi.mocked(fs.writeFile).mockResolvedValue();

      await service.createSession({ title: 'new-session' });

      expect(mkdirSync).toHaveBeenCalledWith(sessionsDir, { recursive: true });
    });

    it('should return existing session if file already exists', async () => {
      vi.mocked(existsSync).mockReturnValue(true);

      const result = await service.createSession({
        title: 'existing-feature',
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('already exists');
      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle write errors', async () => {
      vi.mocked(existsSync)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      vi.mocked(fs.writeFile).mockRejectedValue(new Error('Write failed'));

      const result = await service.createSession({ title: 'error-test' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Write failed');
    });

    it('should generate filename with slugified title', async () => {
      vi.mocked(existsSync)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      vi.mocked(fs.writeFile).mockResolvedValue();

      const result = await service.createSession({
        title: 'Feature With Spaces!',
      });

      expect(result.sessionId).toMatch(
        /^\d{4}-\d{2}-\d{2}-feature-with-spaces$/,
      );
    });
  });

  describe('getSession', () => {
    it('should return parsed session document', async () => {
      const mockContent = `# Session: test-session

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---

## PLAN (02:00)

**Primary Agent**: architect
**Recommended ACT Agent**: backend-developer (confidence: 0.9)

### Task
Implement feature

---
`;
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      const result = await service.getSession('test-session');

      expect(result).not.toBeNull();
      expect(result?.metadata.title).toBe('test-session');
      expect(result?.metadata.status).toBe('active');
      expect(result?.sections).toHaveLength(1);
      expect(result?.sections[0].mode).toBe('PLAN');
      expect(result?.sections[0].primaryAgent).toBe('architect');
      expect(result?.sections[0].recommendedActAgent).toBe('backend-developer');
    });

    it('should return null for non-existent session', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = await service.getSession('non-existent');

      expect(result).toBeNull();
    });

    it('should handle read errors', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('Read failed'));

      const result = await service.getSession('error-session');

      expect(result).toBeNull();
    });
  });

  describe('getActiveSession', () => {
    it('should return most recent active session', async () => {
      const mockFiles = ['2026-01-10-old.md', '2026-01-11-new.md'];
      vi.mocked(fs.readdir).mockResolvedValue(mockFiles as any);

      const mockContent = `# Session: new

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---
`;
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      const result = await service.getActiveSession();

      expect(result).not.toBeNull();
      expect(result?.metadata.status).toBe('active');
    });

    it('should skip completed sessions', async () => {
      const mockFiles = ['2026-01-11-completed.md', '2026-01-10-active.md'];
      vi.mocked(fs.readdir).mockResolvedValue(mockFiles as any);

      const completedContent = `# Session: completed

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: completed

---
`;
      const activeContent = `# Session: active

**Created**: 2026-01-10T00:00:00Z
**Updated**: 2026-01-10T00:00:00Z
**Status**: active

---
`;
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(completedContent)
        .mockResolvedValueOnce(activeContent);

      const result = await service.getActiveSession();

      expect(result).not.toBeNull();
      expect(result?.metadata.title).toBe('active');
    });

    it('should return null when sessions directory does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = await service.getActiveSession();

      expect(result).toBeNull();
    });

    it('should return null when no active sessions', async () => {
      vi.mocked(fs.readdir).mockResolvedValue([]);

      const result = await service.getActiveSession();

      expect(result).toBeNull();
    });
  });

  describe('updateSession', () => {
    const mockSession = `# Session: test

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---
`;

    it('should add new section to session', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(mockSession);
      vi.mocked(fs.writeFile).mockResolvedValue();

      const result = await service.updateSession({
        sessionId: 'test',
        section: {
          mode: 'PLAN',
          primaryAgent: 'architect',
          recommendedActAgent: 'backend-developer',
          recommendedActAgentConfidence: 0.95,
          task: 'Implement feature',
        },
      });

      expect(result.success).toBe(true);
      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = vi.mocked(fs.writeFile).mock.calls[0][1] as string;
      expect(writtenContent).toContain('## PLAN');
      expect(writtenContent).toContain('**Primary Agent**: architect');
      expect(writtenContent).toContain(
        '**Recommended ACT Agent**: backend-developer',
      );
    });

    it('should update existing section', async () => {
      const sessionWithPlan = `# Session: test

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---

## PLAN (02:00)

**Primary Agent**: old-agent

---
`;
      vi.mocked(fs.readFile).mockResolvedValue(sessionWithPlan);
      vi.mocked(fs.writeFile).mockResolvedValue();

      const result = await service.updateSession({
        sessionId: 'test',
        section: {
          mode: 'PLAN',
          primaryAgent: 'new-agent',
        },
      });

      expect(result.success).toBe(true);
      const writtenContent = vi.mocked(fs.writeFile).mock.calls[0][1] as string;
      expect(writtenContent).toContain('**Primary Agent**: new-agent');
    });

    it('should return error for non-existent session', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = await service.updateSession({
        sessionId: 'non-existent',
        section: { mode: 'PLAN' },
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('getRecommendedActAgent', () => {
    it('should extract recommended agent from PLAN section', async () => {
      const mockContent = `# Session: test

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---

## PLAN (02:00)

**Recommended ACT Agent**: backend-developer (confidence: 0.95)

---
`;
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      const result = await service.getRecommendedActAgent('test');

      expect(result).not.toBeNull();
      expect(result?.agent).toBe('backend-developer');
      expect(result?.confidence).toBe(0.95);
    });

    it('should return null when no PLAN section', async () => {
      const mockContent = `# Session: test

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---
`;
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      const result = await service.getRecommendedActAgent('test');

      expect(result).toBeNull();
    });

    it('should return null when PLAN has no recommended agent', async () => {
      const mockContent = `# Session: test

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---

## PLAN (02:00)

**Primary Agent**: architect

---
`;
      vi.mocked(fs.readFile).mockResolvedValue(mockContent);

      const result = await service.getRecommendedActAgent('test');

      expect(result).toBeNull();
    });

    it('should return null for non-existent session', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = await service.getRecommendedActAgent('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('document serialization/parsing', () => {
    it('should correctly round-trip a full session document', async () => {
      vi.mocked(existsSync)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      vi.mocked(fs.writeFile).mockResolvedValue();

      // Create session
      await service.createSession({ title: 'roundtrip-test' });

      // Get the written content
      const writtenContent = vi.mocked(fs.writeFile).mock.calls[0][1] as string;

      // Mock reading back the same content
      vi.mocked(fs.readFile).mockResolvedValue(writtenContent);

      // Now update with a full section
      vi.mocked(fs.writeFile).mockReset();
      vi.mocked(fs.writeFile).mockResolvedValue();

      await service.updateSession({
        sessionId: 'roundtrip-test',
        section: {
          mode: 'PLAN',
          primaryAgent: 'architect',
          recommendedActAgent: 'backend-developer',
          recommendedActAgentConfidence: 0.9,
          specialists: ['security-specialist', 'test-strategy'],
          task: 'Implement auth feature',
          decisions: ['Use JWT', 'Add refresh tokens'],
          notes: ['Check existing auth patterns', 'Consider OAuth later'],
          status: 'completed',
        },
      });

      // Get the updated content
      const updatedContent = vi.mocked(fs.writeFile).mock.calls[0][1] as string;

      // Verify all fields are present
      expect(updatedContent).toContain('## PLAN');
      expect(updatedContent).toContain('**Primary Agent**: architect');
      expect(updatedContent).toContain(
        '**Recommended ACT Agent**: backend-developer (confidence: 0.9)',
      );
      expect(updatedContent).toContain(
        '**Specialists**: security-specialist, test-strategy',
      );
      expect(updatedContent).toContain('**Status**: completed');
      expect(updatedContent).toContain('### Task');
      expect(updatedContent).toContain('Implement auth feature');
      expect(updatedContent).toContain('### Decisions');
      expect(updatedContent).toContain('- Use JWT');
      expect(updatedContent).toContain('- Add refresh tokens');
      expect(updatedContent).toContain('### Notes');
      expect(updatedContent).toContain('- Check existing auth patterns');

      // Parse it back
      vi.mocked(fs.readFile).mockResolvedValue(updatedContent);
      const parsed = await service.getSession('roundtrip-test');

      expect(parsed).not.toBeNull();
      expect(parsed?.sections).toHaveLength(1);
      const planSection = parsed?.sections[0];
      expect(planSection?.mode).toBe('PLAN');
      expect(planSection?.primaryAgent).toBe('architect');
      expect(planSection?.recommendedActAgent).toBe('backend-developer');
      expect(planSection?.recommendedActAgentConfidence).toBe(0.9);
      expect(planSection?.specialists).toEqual([
        'security-specialist',
        'test-strategy',
      ]);
      expect(planSection?.decisions).toEqual(['Use JWT', 'Add refresh tokens']);
    });
  });

  describe('security', () => {
    describe('path traversal prevention', () => {
      it('should reject session ID with path traversal sequences', async () => {
        const result = await service.getSession('../../../etc/passwd');
        expect(result).toBeNull();
        expect(fs.readFile).not.toHaveBeenCalled();
      });

      it('should reject session ID with forward slashes', async () => {
        const result = await service.getSession('path/to/session');
        expect(result).toBeNull();
        expect(fs.readFile).not.toHaveBeenCalled();
      });

      it('should reject session ID with backslashes', async () => {
        const result = await service.getSession('path\\to\\session');
        expect(result).toBeNull();
        expect(fs.readFile).not.toHaveBeenCalled();
      });

      it('should reject session ID with null bytes', async () => {
        const result = await service.getSession('valid\x00malicious');
        expect(result).toBeNull();
        expect(fs.readFile).not.toHaveBeenCalled();
      });

      it('should reject session ID with special characters', async () => {
        const result = await service.getSession('session<script>');
        expect(result).toBeNull();
        expect(fs.readFile).not.toHaveBeenCalled();
      });

      it('should accept valid session ID with Korean characters', async () => {
        vi.mocked(existsSync).mockReturnValue(false);
        const result = await service.getSession('2026-01-11-테스트-세션');
        // Should attempt to read (even if file doesn't exist)
        expect(result).toBeNull(); // File doesn't exist, but validation passed
      });

      it('should reject path traversal in updateSession', async () => {
        const result = await service.updateSession({
          sessionId: '../../../etc/passwd',
          section: { mode: 'PLAN' },
        });
        expect(result.success).toBe(false);
        expect(result.error).toContain('not found');
      });

      it('should reject empty session ID', async () => {
        const result = await service.getSession('');
        expect(result).toBeNull();
        expect(fs.readFile).not.toHaveBeenCalled();
      });

      it('should reject excessively long session ID', async () => {
        const longId = 'a'.repeat(200);
        const result = await service.getSession(longId);
        expect(result).toBeNull();
        expect(fs.readFile).not.toHaveBeenCalled();
      });

      it('should reject Unicode encoded path traversal attempts', async () => {
        // URL-encoded ../ sequence
        const result1 = await service.getSession('%2e%2e%2fetc%2fpasswd');
        expect(result1).toBeNull();

        // Unicode fullwidth characters
        const result2 = await service.getSession('．．／etc／passwd');
        expect(result2).toBeNull();

        // Mixed normal and special Unicode dots
        const result3 = await service.getSession('session\u2024\u2024');
        expect(result3).toBeNull();
      });
    });

    describe('title validation', () => {
      it('should reject empty title', async () => {
        const result = await service.createSession({ title: '' });
        expect(result.success).toBe(false);
        expect(result.error).toContain('empty');
      });

      it('should reject whitespace-only title', async () => {
        const result = await service.createSession({ title: '   ' });
        expect(result.success).toBe(false);
        expect(result.error).toContain('empty');
      });

      it('should reject excessively long title', async () => {
        const longTitle = 'a'.repeat(250);
        const result = await service.createSession({ title: longTitle });
        expect(result.success).toBe(false);
        expect(result.error).toContain('maximum length');
      });
    });

    describe('type-safe parsing', () => {
      it('should ignore invalid session status', async () => {
        const invalidContent = `# Session: test

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: invalid_status

---
`;
        vi.mocked(fs.readFile).mockResolvedValue(invalidContent);
        const result = await service.getSession('test');

        // Should default to 'active' when status is invalid
        expect(result?.metadata.status).toBe('active');
      });

      it('should ignore invalid section status', async () => {
        const invalidContent = `# Session: test

**Created**: 2026-01-11T00:00:00Z
**Updated**: 2026-01-11T00:00:00Z
**Status**: active

---

## PLAN (02:00)

**Status**: not_a_valid_status

---
`;
        vi.mocked(fs.readFile).mockResolvedValue(invalidContent);
        const result = await service.getSession('test');

        // Status should be undefined when invalid
        expect(result?.sections[0]?.status).toBeUndefined();
      });
    });
  });
});
