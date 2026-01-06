import { Logger } from '@nestjs/common';
import {
  type Mode,
  type PrimaryAgentResolutionResult,
  type PrimaryAgentSource,
  type ResolutionContext,
} from './keyword.types';

/** Project config interface for Primary Agent configuration */
interface ProjectConfig {
  primaryAgent?: string;
}

/** Function type for loading project config */
type GetProjectConfigFn = () => Promise<ProjectConfig | null>;

/** Function type for listing available primary agents */
type ListPrimaryAgentsFn = () => Promise<string[]>;

/**
 * PrimaryAgentResolver - Resolves which Primary Agent to use based on:
 * 1. Explicit request in prompt (highest priority)
 * 2. Project configuration
 * 3. Intent analysis (prompt content analysis)
 * 4. Context (file path, project type)
 * 5. Default fallback (frontend-developer)
 */
export class PrimaryAgentResolver {
  private readonly logger = new Logger(PrimaryAgentResolver.name);
  private static readonly DEFAULT_AGENT = 'frontend-developer';
  private static readonly EVAL_AGENT = 'code-reviewer';

  /** Fallback agents when registry is unavailable */
  private static readonly DEFAULT_FALLBACK_AGENTS = [
    'frontend-developer',
    'backend-developer',
    'code-reviewer',
    'solution-architect',
    'technical-planner',
  ];

  /** Patterns for explicit agent request in prompts */
  private static readonly EXPLICIT_PATTERNS = [
    // Korean patterns: "~로 작업해", "~으로 해줘", "~로 해"
    /(\w+-\w+)(?:로|으로)\s*(?:작업|개발|해)/i,
    // English patterns: "use ~ agent", "using ~"
    /(?:use|using)\s+(\w+-\w+)(?:\s+agent)?/i,
    // English pattern: "as ~"
    /as\s+(\w+-\w+)/i,
    // Direct pattern: "~ agent로"
    /(\w+-\w+)\s+agent(?:로|으로)/i,
  ];

  /** Context patterns for suggesting agents based on file paths */
  private static readonly CONTEXT_PATTERNS: Array<{
    pattern: RegExp;
    agent: string;
    confidence: number;
  }> = [
    {
      pattern: /Dockerfile|docker-compose/i,
      agent: 'devops-engineer',
      confidence: 0.9,
    },
    { pattern: /\.go$/i, agent: 'backend-developer', confidence: 0.85 },
    { pattern: /\.py$/i, agent: 'backend-developer', confidence: 0.85 },
    { pattern: /\.java$/i, agent: 'backend-developer', confidence: 0.85 },
    { pattern: /\.rs$/i, agent: 'backend-developer', confidence: 0.85 },
    { pattern: /\.tsx?$/i, agent: 'frontend-developer', confidence: 0.7 },
    { pattern: /\.jsx?$/i, agent: 'frontend-developer', confidence: 0.7 },
    { pattern: /agents?.*\.json$/i, agent: 'agent-architect', confidence: 0.8 },
  ];

  /** Intent patterns for automatic agent detection based on prompt content */
  private static readonly INTENT_PATTERNS: Array<{
    pattern: RegExp;
    agent: string;
    confidence: number;
    category: 'architecture' | 'planning' | 'implementation';
  }> = [
    // Solution Architect triggers
    {
      pattern: /아키텍처|architecture|시스템\s*설계|system\s*design/i,
      agent: 'solution-architect',
      confidence: 0.85,
      category: 'architecture',
    },
    {
      pattern: /기술\s*선택|technology\s*selection|스택\s*선택/i,
      agent: 'solution-architect',
      confidence: 0.8,
      category: 'architecture',
    },
    {
      pattern: /전체\s*구조|overall\s*structure|설계\s*방향/i,
      agent: 'solution-architect',
      confidence: 0.85,
      category: 'architecture',
    },
    {
      pattern: /구조\s*설계|structural\s*design|API\s*설계|API\s*design/i,
      agent: 'solution-architect',
      confidence: 0.8,
      category: 'architecture',
    },
    {
      pattern:
        /마이크로서비스|microservice|서비스\s*분리|service\s*decomposition/i,
      agent: 'solution-architect',
      confidence: 0.85,
      category: 'architecture',
    },
    // Technical Planner triggers
    {
      pattern: /구현\s*계획|implementation\s*plan|작업\s*분해/i,
      agent: 'technical-planner',
      confidence: 0.85,
      category: 'planning',
    },
    {
      pattern: /태스크|task\s*breakdown|단계별|step.?by.?step/i,
      agent: 'technical-planner',
      confidence: 0.8,
      category: 'planning',
    },
    {
      pattern: /TDD\s*계획|TDD\s*plan|테스트\s*먼저|test.?first/i,
      agent: 'technical-planner',
      confidence: 0.85,
      category: 'planning',
    },
    {
      pattern: /실행\s*계획|execution\s*plan|개발\s*계획|development\s*plan/i,
      agent: 'technical-planner',
      confidence: 0.8,
      category: 'planning',
    },
    {
      pattern: /리팩토링\s*계획|refactoring\s*plan|work\s*breakdown/i,
      agent: 'technical-planner',
      confidence: 0.8,
      category: 'planning',
    },
  ];

  constructor(
    private readonly getProjectConfig: GetProjectConfigFn,
    private readonly listPrimaryAgents: ListPrimaryAgentsFn,
  ) {}

  /**
   * Resolve which Primary Agent to use.
   * Priority: explicit > config > intent > context > default
   *
   * Note: EVAL mode always returns code-reviewer regardless of other settings.
   */
  async resolve(
    mode: Mode,
    prompt: string,
    context?: ResolutionContext,
  ): Promise<PrimaryAgentResolutionResult> {
    // EVAL mode is special - always use code-reviewer
    if (mode === 'EVAL') {
      return this.createResult(
        PrimaryAgentResolver.EVAL_AGENT,
        'default',
        1.0,
        'EVAL mode always uses code-reviewer',
      );
    }

    const availableAgents = await this.safeListPrimaryAgents();

    // 1. Check explicit request in prompt
    const explicit = this.parseExplicitRequest(prompt, availableAgents);
    if (explicit) {
      return explicit;
    }

    // 2. Check project configuration
    const fromConfig = await this.getFromProjectConfig(availableAgents);
    if (fromConfig) {
      return fromConfig;
    }

    // 3. Check intent-based suggestion (analyze prompt content)
    const fromIntent = this.analyzeIntent(prompt, availableAgents);
    if (fromIntent && fromIntent.confidence >= 0.8) {
      return fromIntent;
    }

    // 4. Check context-based suggestion
    if (context) {
      const fromContext = this.inferFromContext(context, availableAgents);
      if (fromContext && fromContext.confidence >= 0.8) {
        return fromContext;
      }
    }

    // 5. Default fallback
    return this.createResult(
      PrimaryAgentResolver.DEFAULT_AGENT,
      'default',
      1.0,
      'No explicit preference, using default frontend-developer',
    );
  }

  /**
   * Parse explicit agent request from prompt.
   * Returns null if no explicit request found or agent not in registry.
   */
  private parseExplicitRequest(
    prompt: string,
    availableAgents: string[],
  ): PrimaryAgentResolutionResult | null {
    for (const pattern of PrimaryAgentResolver.EXPLICIT_PATTERNS) {
      const match = prompt.match(pattern);
      if (match?.[1]) {
        const agentName = match[1].toLowerCase();
        if (availableAgents.includes(agentName)) {
          return this.createResult(
            agentName,
            'explicit',
            1.0,
            `Explicit request for ${agentName} in prompt`,
          );
        }
      }
    }
    return null;
  }

  /**
   * Get Primary Agent from project configuration.
   * Returns null if no config or configured agent not in registry.
   */
  private async getFromProjectConfig(
    availableAgents: string[],
  ): Promise<PrimaryAgentResolutionResult | null> {
    try {
      const config = await this.getProjectConfig();
      if (config?.primaryAgent) {
        const agentName = config.primaryAgent.toLowerCase();
        if (availableAgents.includes(agentName)) {
          return this.createResult(
            agentName,
            'config',
            1.0,
            `Configured in project: ${agentName}`,
          );
        }
        // Agent configured but not available
        this.logger.warn(
          `Configured agent '${config.primaryAgent}' not found in registry. ` +
            `Available: ${availableAgents.join(', ')}`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Failed to load project config for agent resolution: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
    return null;
  }

  /**
   * Infer Primary Agent from context (file path, project type).
   * Returns result with confidence score.
   */
  private inferFromContext(
    context: ResolutionContext,
    availableAgents: string[],
  ): PrimaryAgentResolutionResult | null {
    if (context.filePath) {
      for (const {
        pattern,
        agent,
        confidence,
      } of PrimaryAgentResolver.CONTEXT_PATTERNS) {
        if (pattern.test(context.filePath)) {
          if (availableAgents.includes(agent)) {
            return this.createResult(
              agent,
              'context',
              confidence,
              `Inferred from file path: ${context.filePath}`,
            );
          }
        }
      }
    }

    // Additional inference from projectType if provided
    if (context.projectType === 'infrastructure') {
      if (availableAgents.includes('devops-engineer')) {
        return this.createResult(
          'devops-engineer',
          'context',
          0.85,
          `Inferred from project type: ${context.projectType}`,
        );
      }
    }

    return null;
  }

  /**
   * Analyze prompt intent to suggest appropriate agent.
   * Returns highest confidence match from intent patterns.
   */
  private analyzeIntent(
    prompt: string,
    availableAgents: string[],
  ): PrimaryAgentResolutionResult | null {
    // Early return for empty or whitespace-only prompts
    if (!prompt || !prompt.trim()) {
      return null;
    }

    let bestMatch: {
      agent: string;
      confidence: number;
      category: string;
    } | null = null;

    for (const {
      pattern,
      agent,
      confidence,
      category,
    } of PrimaryAgentResolver.INTENT_PATTERNS) {
      if (pattern.test(prompt) && availableAgents.includes(agent)) {
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = { agent, confidence, category };
        }
      }
    }

    if (bestMatch && bestMatch.confidence >= 0.8) {
      return this.createResult(
        bestMatch.agent,
        'intent',
        bestMatch.confidence,
        `Intent detected: ${bestMatch.category} task`,
      );
    }

    return null;
  }

  /**
   * Safely list primary agents, returning default list on error.
   */
  private async safeListPrimaryAgents(): Promise<string[]> {
    try {
      const agents = await this.listPrimaryAgents();
      if (agents.length === 0) {
        this.logger.debug(
          'No primary agents found in registry, using default fallback list',
        );
        return [...PrimaryAgentResolver.DEFAULT_FALLBACK_AGENTS];
      }
      return agents;
    } catch (error) {
      this.logger.warn(
        `Failed to list primary agents: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
          `Using fallback list.`,
      );
      return [...PrimaryAgentResolver.DEFAULT_FALLBACK_AGENTS];
    }
  }

  /**
   * Create a resolution result object.
   */
  private createResult(
    agentName: string,
    source: PrimaryAgentSource,
    confidence: number,
    reason: string,
  ): PrimaryAgentResolutionResult {
    return { agentName, source, confidence, reason };
  }
}
