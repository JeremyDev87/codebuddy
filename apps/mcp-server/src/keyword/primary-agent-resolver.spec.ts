import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { PrimaryAgentResolver } from './primary-agent-resolver';
import { type ResolutionContext } from './keyword.types';

describe('PrimaryAgentResolver', () => {
  let resolver: PrimaryAgentResolver;
  let mockGetProjectConfig: Mock;
  let mockListPrimaryAgents: Mock;

  beforeEach(() => {
    mockGetProjectConfig = vi.fn().mockResolvedValue(null);
    mockListPrimaryAgents = vi
      .fn()
      .mockResolvedValue([
        'frontend-developer',
        'backend-developer',
        'agent-architect',
        'devops-engineer',
        'solution-architect',
        'technical-planner',
        'code-reviewer',
      ]);

    resolver = new PrimaryAgentResolver(
      mockGetProjectConfig,
      mockListPrimaryAgents,
    );
  });

  describe('PLAN mode agent resolution', () => {
    describe('architecture-focused prompts', () => {
      it('returns solution-architect when prompt contains "아키텍처"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          '인증 시스템 아키텍처를 설계해줘',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
        expect(result.confidence).toBeGreaterThanOrEqual(0.8);
      });

      it('returns solution-architect when prompt contains "system design"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'Create a system design for the authentication module',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
      });

      it('returns solution-architect when prompt contains "시스템 설계"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          '새로운 결제 시스템 설계가 필요해',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
      });

      it('returns solution-architect when prompt contains "API 설계"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'REST API 설계를 진행해줘',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
      });

      it('returns solution-architect when prompt contains "microservice"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'Design a microservice architecture for the payment system',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
      });
    });

    describe('planning-focused prompts', () => {
      it('returns technical-planner when prompt contains "구현 계획"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          '로그인 기능 구현 계획을 작성해줘',
        );

        expect(result.agentName).toBe('technical-planner');
        expect(result.source).toBe('intent');
      });

      it('returns technical-planner when prompt contains "implementation plan"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'Write an implementation plan for the new feature',
        );

        expect(result.agentName).toBe('technical-planner');
        expect(result.source).toBe('intent');
      });

      it('returns technical-planner when prompt contains "TDD 계획"', async () => {
        const result = await resolver.resolve('PLAN', 'TDD 계획을 세워줘');

        expect(result.agentName).toBe('technical-planner');
        expect(result.source).toBe('intent');
      });

      it('returns technical-planner when prompt contains "step by step"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'Create a step-by-step plan for implementing the login feature',
        );

        expect(result.agentName).toBe('technical-planner');
        expect(result.source).toBe('intent');
      });

      it('returns technical-planner when prompt contains "개발 계획"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          '새 기능 개발 계획을 세워줘',
        );

        expect(result.agentName).toBe('technical-planner');
        expect(result.source).toBe('intent');
      });

      it('returns technical-planner when prompt contains "refactoring plan"', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'Create a refactoring plan for the authentication module',
        );

        expect(result.agentName).toBe('technical-planner');
        expect(result.source).toBe('intent');
      });
    });

    describe('mixed intent prompts (both patterns match)', () => {
      it('returns solution-architect when both architecture and planning keywords present', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'Create an architecture plan for the microservice',
        );

        // Architecture takes precedence over planning
        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
        expect(result.confidence).toBe(0.85);
        expect(result.reason).toContain('architecture takes precedence');
      });

      it('returns solution-architect when both 아키텍처 and 계획 present', async () => {
        const result = await resolver.resolve(
          'PLAN',
          '시스템 아키텍처 설계 계획을 세워줘',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
      });

      it('returns solution-architect when system design and step present', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'Create a system design with step-by-step implementation',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('intent');
      });
    });

    describe('explicit PLAN agent request', () => {
      it('returns solution-architect when explicitly requested', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'solution-architect로 작업해 새 기능 설계',
        );

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('explicit');
      });

      it('returns technical-planner when explicitly requested', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'use technical-planner agent to plan this feature',
        );

        expect(result.agentName).toBe('technical-planner');
        expect(result.source).toBe('explicit');
      });

      it('ignores ACT agent explicit requests in PLAN mode', async () => {
        const result = await resolver.resolve(
          'PLAN',
          'backend-developer로 작업해 새 API 만들어',
        );

        // Should use PLAN agent, not backend-developer
        expect(['solution-architect', 'technical-planner']).toContain(
          result.agentName,
        );
        expect(result.source).not.toBe('explicit');
      });
    });

    describe('default PLAN agent', () => {
      it('returns solution-architect when no specific intent detected', async () => {
        const result = await resolver.resolve('PLAN', '새 기능 만들어');

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('default');
      });

      it('returns solution-architect for empty prompt', async () => {
        const result = await resolver.resolve('PLAN', '');

        expect(result.agentName).toBe('solution-architect');
        expect(result.source).toBe('default');
      });

      it('returns technical-planner when solution-architect unavailable', async () => {
        mockListPrimaryAgents.mockResolvedValue([
          'frontend-developer',
          'technical-planner',
        ]);

        const result = await resolver.resolve('PLAN', '새 기능 만들어');

        expect(result.agentName).toBe('technical-planner');
      });
    });
  });

  describe('ACT mode agent resolution', () => {
    describe('tooling-engineer pattern matching', () => {
      beforeEach(() => {
        // Add tooling-engineer to the available agents list
        mockListPrimaryAgents.mockResolvedValue([
          'tooling-engineer',
          'frontend-developer',
          'backend-developer',
          'agent-architect',
          'devops-engineer',
          'solution-architect',
          'technical-planner',
          'code-reviewer',
        ]);
      });

      it('returns tooling-engineer for codingbuddy.config.js prompt', async () => {
        const result = await resolver.resolve(
          'ACT',
          'codingbuddy.config.js 수정해',
        );

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
        expect(result.confidence).toBeGreaterThanOrEqual(0.9);
      });

      it('returns tooling-engineer for tsconfig.json prompt', async () => {
        const result = await resolver.resolve(
          'ACT',
          'tsconfig.json 설정 변경해줘',
        );

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('returns tooling-engineer for eslint config prompt', async () => {
        const result = await resolver.resolve('ACT', 'eslint 규칙 추가해줘');

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('returns tooling-engineer for package.json prompt', async () => {
        const result = await resolver.resolve(
          'ACT',
          'package.json 의존성 업데이트해',
        );

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('returns tooling-engineer for vite.config prompt', async () => {
        const result = await resolver.resolve(
          'ACT',
          'vite.config.ts 최적화해줘',
        );

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('returns tooling-engineer for Korean "설정 파일" prompt', async () => {
        const result = await resolver.resolve('ACT', '설정 파일 수정이 필요해');

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('returns tooling-engineer for Korean "빌드 설정" prompt', async () => {
        const result = await resolver.resolve('ACT', '빌드 설정 변경해줘');

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('returns tooling-engineer for next.config.js prompt', async () => {
        const result = await resolver.resolve(
          'ACT',
          'next.config.js 설정 변경',
        );

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('returns tooling-engineer for prettier config prompt', async () => {
        const result = await resolver.resolve('ACT', 'prettier 설정 변경해줘');

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.source).toBe('intent');
      });

      it('prioritizes tooling-engineer over frontend-developer for config files', async () => {
        // eslint.config.ts는 .ts 파일이지만 tooling이 처리해야 함
        const result = await resolver.resolve(
          'ACT',
          'eslint.config.ts 수정해줘',
        );

        expect(result.agentName).toBe('tooling-engineer');
        expect(result.agentName).not.toBe('frontend-developer');
      });
    });

    describe('explicit request parsing', () => {
      it('returns explicit agent when prompt contains "backend-developer로 작업해"', async () => {
        const result = await resolver.resolve(
          'ACT',
          'backend-developer로 작업해 새 API 만들어',
        );

        expect(result.agentName).toBe('backend-developer');
        expect(result.source).toBe('explicit');
        expect(result.confidence).toBe(1.0);
      });

      it('returns explicit agent when prompt contains "use frontend-developer agent"', async () => {
        const result = await resolver.resolve(
          'ACT',
          'use frontend-developer agent to create component',
        );

        expect(result.agentName).toBe('frontend-developer');
        expect(result.source).toBe('explicit');
      });

      it('returns explicit agent when prompt contains "agent-architect로 해줘"', async () => {
        const result = await resolver.resolve(
          'ACT',
          'agent-architect로 해줘 새 에이전트 만들어',
        );

        expect(result.agentName).toBe('agent-architect');
        expect(result.source).toBe('explicit');
      });

      it('returns explicit agent when prompt contains "as devops-engineer"', async () => {
        const result = await resolver.resolve(
          'ACT',
          'implement this feature as devops-engineer',
        );

        expect(result.agentName).toBe('devops-engineer');
        expect(result.source).toBe('explicit');
      });

      it('ignores invalid explicit agent names not in registry', async () => {
        const result = await resolver.resolve(
          'ACT',
          'use invalid-agent agent to do something',
        );

        expect(result.agentName).not.toBe('invalid-agent');
      });

      it('ignores PLAN agents in ACT mode explicit requests', async () => {
        const result = await resolver.resolve(
          'ACT',
          'solution-architect로 작업해',
        );

        // Should fall through to default, not use solution-architect
        expect(result.agentName).toBe('frontend-developer');
        expect(result.source).toBe('default');
      });
    });

    describe('recommended agent from PLAN mode', () => {
      it('uses recommended agent when provided', async () => {
        const result = await resolver.resolve(
          'ACT',
          '이 기능 구현해',
          undefined,
          'backend-developer',
        );

        expect(result.agentName).toBe('backend-developer');
        expect(result.source).toBe('config');
        expect(result.reason).toContain('recommended');
      });

      it('ignores recommended agent if not in registry', async () => {
        const result = await resolver.resolve(
          'ACT',
          '이 기능 구현해',
          undefined,
          'non-existent-agent',
        );

        expect(result.agentName).not.toBe('non-existent-agent');
        expect(result.agentName).toBe('frontend-developer');
      });

      it('explicit request takes priority over recommended', async () => {
        const result = await resolver.resolve(
          'ACT',
          'devops-engineer로 작업해',
          undefined,
          'backend-developer',
        );

        expect(result.agentName).toBe('devops-engineer');
        expect(result.source).toBe('explicit');
      });
    });

    describe('project config resolution', () => {
      it('returns configured agent when project config specifies primaryAgent', async () => {
        mockGetProjectConfig.mockResolvedValue({
          primaryAgent: 'backend-developer',
        });

        const result = await resolver.resolve('ACT', '새 API 만들어');

        expect(result.agentName).toBe('backend-developer');
        expect(result.source).toBe('config');
      });

      it('ignores config if configured agent is not in registry', async () => {
        mockGetProjectConfig.mockResolvedValue({
          primaryAgent: 'non-existent-agent',
        });

        const result = await resolver.resolve('ACT', '새 기능 만들어');

        expect(result.agentName).toBe('frontend-developer');
        expect(result.source).toBe('default');
      });

      it('handles config loading errors gracefully', async () => {
        mockGetProjectConfig.mockRejectedValue(new Error('Config error'));

        const result = await resolver.resolve('ACT', '새 기능 만들어');

        expect(result.agentName).toBe('frontend-developer');
        expect(result.source).toBe('default');
      });
    });

    describe('context-based resolution', () => {
      it('suggests devops-engineer when context includes Dockerfile', async () => {
        const context: ResolutionContext = {
          filePath: '/project/Dockerfile',
        };

        const result = await resolver.resolve('ACT', '이 파일 수정해', context);

        expect(result.agentName).toBe('devops-engineer');
        expect(result.source).toBe('context');
        expect(result.confidence).toBeGreaterThanOrEqual(0.8);
      });

      it('suggests backend-developer when context includes .go files', async () => {
        const context: ResolutionContext = {
          filePath: '/project/main.go',
        };

        const result = await resolver.resolve('ACT', '이 파일 수정해', context);

        expect(result.agentName).toBe('backend-developer');
        expect(result.source).toBe('context');
      });

      it('suggests frontend-developer when context includes .tsx files', async () => {
        const context: ResolutionContext = {
          filePath: '/project/component.tsx',
        };

        const result = await resolver.resolve('ACT', '이 파일 수정해', context);

        // .tsx has lower confidence (0.7), so falls through to default
        expect(result.agentName).toBe('frontend-developer');
      });
    });

    describe('default fallback', () => {
      it('returns frontend-developer when no preference found', async () => {
        const result = await resolver.resolve('ACT', '새 기능 만들어');

        expect(result.agentName).toBe('frontend-developer');
        expect(result.source).toBe('default');
      });

      it('returns default even with empty prompt', async () => {
        const result = await resolver.resolve('ACT', '');

        expect(result.agentName).toBe('frontend-developer');
        expect(result.source).toBe('default');
      });
    });
  });

  describe('EVAL mode behavior', () => {
    it('always returns code-reviewer for EVAL mode regardless of explicit request', async () => {
      const result = await resolver.resolve(
        'EVAL',
        'backend-developer로 평가해',
      );

      expect(result.agentName).toBe('code-reviewer');
      expect(result.source).toBe('default');
      expect(result.reason).toContain('EVAL');
    });

    it('always returns code-reviewer for EVAL mode regardless of config', async () => {
      mockGetProjectConfig.mockResolvedValue({
        primaryAgent: 'backend-developer',
      });

      const result = await resolver.resolve('EVAL', '코드 평가해');

      expect(result.agentName).toBe('code-reviewer');
    });

    it('always returns code-reviewer for EVAL mode regardless of recommended agent', async () => {
      const result = await resolver.resolve(
        'EVAL',
        '코드 리뷰해',
        undefined,
        'backend-developer',
      );

      expect(result.agentName).toBe('code-reviewer');
    });
  });

  describe('priority order in ACT mode', () => {
    it('explicit request takes priority over config', async () => {
      mockGetProjectConfig.mockResolvedValue({
        primaryAgent: 'backend-developer',
      });

      const result = await resolver.resolve(
        'ACT',
        'frontend-developer로 작업해',
      );

      expect(result.agentName).toBe('frontend-developer');
      expect(result.source).toBe('explicit');
    });

    it('recommended agent takes priority over config', async () => {
      mockGetProjectConfig.mockResolvedValue({
        primaryAgent: 'frontend-developer',
      });

      const result = await resolver.resolve(
        'ACT',
        '이 기능 구현해',
        undefined,
        'backend-developer',
      );

      expect(result.agentName).toBe('backend-developer');
      expect(result.source).toBe('config'); // Source is 'config' as it comes from PLAN recommendation
    });

    it('config takes priority over context', async () => {
      mockGetProjectConfig.mockResolvedValue({
        primaryAgent: 'frontend-developer',
      });

      const context: ResolutionContext = {
        filePath: '/project/main.go',
      };

      const result = await resolver.resolve('ACT', '이 파일 수정해', context);

      expect(result.agentName).toBe('frontend-developer');
      expect(result.source).toBe('config');
    });

    it('context takes priority over default when confidence is high', async () => {
      const context: ResolutionContext = {
        filePath: '/project/Dockerfile',
      };

      const result = await resolver.resolve(
        'ACT',
        'Docker 설정 수정해',
        context,
      );

      expect(result.agentName).toBe('devops-engineer');
      expect(result.source).toBe('context');
    });
  });

  describe('parseExplicitRequest patterns', () => {
    it('extracts agent name from Korean pattern "~로 작업해"', async () => {
      const result = await resolver.resolve(
        'ACT',
        'backend-developer로 작업해줘',
      );
      expect(result.agentName).toBe('backend-developer');
    });

    it('extracts agent name from Korean pattern "~으로 해"', async () => {
      const result = await resolver.resolve('ACT', 'agent-architect으로 해줘');
      expect(result.agentName).toBe('agent-architect');
    });

    it('extracts agent name from English pattern "use ~ agent"', async () => {
      const result = await resolver.resolve(
        'ACT',
        'use frontend-developer agent',
      );
      expect(result.agentName).toBe('frontend-developer');
    });

    it('extracts agent name from English pattern "using ~"', async () => {
      const result = await resolver.resolve(
        'ACT',
        'using backend-developer create API',
      );
      expect(result.agentName).toBe('backend-developer');
    });

    it('handles mixed language prompts', async () => {
      const result = await resolver.resolve(
        'ACT',
        'backend-developer agent로 API 만들어',
      );
      expect(result.agentName).toBe('backend-developer');
    });
  });

  describe('safeListPrimaryAgents fallback behavior', () => {
    it('returns default fallback list when listPrimaryAgents returns empty array', async () => {
      mockListPrimaryAgents.mockResolvedValue([]);

      const result = await resolver.resolve('PLAN', 'build a feature');

      // Default PLAN agent from fallback list
      expect(result.agentName).toBe('solution-architect');
    });

    it('returns default fallback list when listPrimaryAgents throws error', async () => {
      mockListPrimaryAgents.mockRejectedValue(new Error('Network error'));

      const result = await resolver.resolve('PLAN', 'build a feature');

      expect(result.agentName).toBe('solution-architect');
    });

    it('uses fallback list for agent validation when listPrimaryAgents fails', async () => {
      mockListPrimaryAgents.mockRejectedValue(new Error('Network error'));

      // backend-developer is in fallback list, so it should be recognized
      const result = await resolver.resolve(
        'ACT',
        'backend-developer로 작업해',
      );

      expect(result.agentName).toBe('backend-developer');
      expect(result.source).toBe('explicit');
    });
  });
});
