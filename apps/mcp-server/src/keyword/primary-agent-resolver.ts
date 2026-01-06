import { Logger } from '@nestjs/common';
import {
  EVAL_PRIMARY_AGENT,
  DEFAULT_ACT_AGENT,
  ALL_PRIMARY_AGENTS_LIST,
  PLAN_PRIMARY_AGENTS_LIST,
  ACT_PRIMARY_AGENTS_LIST,
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

  constructor(
    private readonly getProjectConfig: GetProjectConfigFn,
    private readonly listPrimaryAgents: ListPrimaryAgentsFn,
  ) {}

  /**
   * Resolve which Primary Agent to use.
   *
   * Mode-specific behavior:
   * - PLAN: Always uses solution-architect or technical-planner
   * - ACT: Uses recommended agent if provided, otherwise AI analysis
   * - EVAL: Always uses code-reviewer
   *
   * @param recommendedActAgent - ACT agent recommended by PLAN mode (only for ACT mode)
   */
  async resolve(
    mode: Mode,
    prompt: string,
    context?: ResolutionContext,
    recommendedActAgent?: string,
  ): Promise<PrimaryAgentResolutionResult> {
    // EVAL mode is special - always use code-reviewer
    if (mode === 'EVAL') {
      return this.createResult(
        EVAL_PRIMARY_AGENT,
        'default',
        1.0,
        'EVAL mode always uses code-reviewer',
      );
    }

    const availableAgents = await this.safeListPrimaryAgents();

    // PLAN mode - always use solution-architect or technical-planner
    if (mode === 'PLAN') {
      return this.resolvePlanAgent(prompt, availableAgents);
    }

    // ACT mode - use recommended agent or fallback to AI analysis
    return this.resolveActAgent(
      prompt,
      availableAgents,
      context,
      recommendedActAgent,
    );
  }

  /**
   * Resolve PLAN mode agent (always solution-architect or technical-planner).
   * Chooses based on prompt analysis.
   */
  private resolvePlanAgent(
    prompt: string,
    availableAgents: string[],
  ): PrimaryAgentResolutionResult {
    // Check for explicit PLAN agent request
    const explicit = this.parseExplicitRequest(
      prompt,
      availableAgents,
      PLAN_PRIMARY_AGENTS_LIST,
    );
    if (explicit) {
      return explicit;
    }

    // Analyze prompt to choose between solution-architect and technical-planner
    const planAgent = this.choosePlanAgent(prompt, availableAgents);
    return planAgent;
  }

  /**
   * Choose between solution-architect and technical-planner based on prompt.
   *
   * Priority order:
   * 1. Architecture-only keywords → solution-architect (high-level design)
   * 2. Planning-only keywords → technical-planner (implementation planning)
   * 3. Both patterns match → solution-architect (architecture takes precedence)
   * 4. Neither matches → solution-architect (default for PLAN mode)
   */
  private choosePlanAgent(
    prompt: string,
    availableAgents: string[],
  ): PrimaryAgentResolutionResult {
    // Architecture-focused keywords suggest solution-architect
    const architecturePatterns =
      /아키텍처|architecture|시스템\s*설계|system\s*design|구조|structure|API\s*설계|마이크로서비스|microservice|기술\s*선택|technology/i;

    // Planning/task-focused keywords suggest technical-planner
    const planningPatterns =
      /계획|plan|단계|step|태스크|task|TDD|구현\s*순서|implementation\s*order|리팩토링|refactor/i;

    const hasArchitectureIntent = architecturePatterns.test(prompt);
    const hasPlanningIntent = planningPatterns.test(prompt);

    // Priority 1: Architecture-only → solution-architect
    if (hasArchitectureIntent && !hasPlanningIntent) {
      if (availableAgents.includes('solution-architect')) {
        return this.createResult(
          'solution-architect',
          'intent',
          0.9,
          'Architecture-focused task detected in PLAN mode',
        );
      }
    }

    // Priority 2: Planning-only → technical-planner
    if (hasPlanningIntent && !hasArchitectureIntent) {
      if (availableAgents.includes('technical-planner')) {
        return this.createResult(
          'technical-planner',
          'intent',
          0.9,
          'Planning/implementation-focused task detected in PLAN mode',
        );
      }
    }

    // Priority 3: Both patterns match → solution-architect (architecture precedence)
    if (hasArchitectureIntent && hasPlanningIntent) {
      if (availableAgents.includes('solution-architect')) {
        return this.createResult(
          'solution-architect',
          'intent',
          0.85,
          'Both architecture and planning detected; architecture takes precedence',
        );
      }
    }

    // Priority 4: Neither matches → default to solution-architect
    const defaultPlanAgent = availableAgents.includes('solution-architect')
      ? 'solution-architect'
      : availableAgents.includes('technical-planner')
        ? 'technical-planner'
        : DEFAULT_ACT_AGENT;

    return this.createResult(
      defaultPlanAgent,
      'default',
      1.0,
      'PLAN mode default: solution-architect for high-level design',
    );
  }

  /**
   * Resolve ACT mode agent.
   * Priority: explicit > recommended > config > context > default
   */
  private async resolveActAgent(
    prompt: string,
    availableAgents: string[],
    context?: ResolutionContext,
    recommendedActAgent?: string,
  ): Promise<PrimaryAgentResolutionResult> {
    // 1. Check explicit request in prompt
    const explicit = this.parseExplicitRequest(
      prompt,
      availableAgents,
      ACT_PRIMARY_AGENTS_LIST,
    );
    if (explicit) {
      return explicit;
    }

    // 2. Use recommended agent from PLAN mode if provided
    if (recommendedActAgent && availableAgents.includes(recommendedActAgent)) {
      return this.createResult(
        recommendedActAgent,
        'config', // Source is 'config' as it comes from PLAN recommendation
        1.0,
        `Using recommended agent from PLAN mode: ${recommendedActAgent}`,
      );
    }

    // 3. Check project configuration
    const fromConfig = await this.getFromProjectConfig(availableAgents);
    if (fromConfig) {
      return fromConfig;
    }

    // 4. Check context-based suggestion
    if (context) {
      const fromContext = this.inferFromContext(context, availableAgents);
      if (fromContext && fromContext.confidence >= 0.8) {
        return fromContext;
      }
    }

    // 5. Default fallback for ACT mode
    return this.createResult(
      DEFAULT_ACT_AGENT,
      'default',
      1.0,
      'ACT mode default: frontend-developer',
    );
  }

  /**
   * Parse explicit agent request from prompt.
   * Returns null if no explicit request found or agent not in registry.
   *
   * @param prompt - User prompt to analyze
   * @param availableAgents - All available agents from registry
   * @param allowedAgents - Optional filter to only match specific agents (e.g., PLAN_AGENTS or ACT_AGENTS)
   */
  private parseExplicitRequest(
    prompt: string,
    availableAgents: string[],
    allowedAgents?: string[],
  ): PrimaryAgentResolutionResult | null {
    for (const pattern of PrimaryAgentResolver.EXPLICIT_PATTERNS) {
      const match = prompt.match(pattern);
      if (match?.[1]) {
        const agentName = match[1].toLowerCase();
        // Must be in available agents AND (if specified) in allowed agents
        const isAvailable = availableAgents.includes(agentName);
        const isAllowed = !allowedAgents || allowedAgents.includes(agentName);
        if (isAvailable && isAllowed) {
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
   * Safely list primary agents, returning default list on error.
   */
  private async safeListPrimaryAgents(): Promise<string[]> {
    try {
      const agents = await this.listPrimaryAgents();
      if (agents.length === 0) {
        this.logger.debug(
          'No primary agents found in registry, using default fallback list',
        );
        return [...ALL_PRIMARY_AGENTS_LIST];
      }
      return agents;
    } catch (error) {
      this.logger.warn(
        `Failed to list primary agents: ${error instanceof Error ? error.message : 'Unknown error'}. ` +
          `Using fallback list.`,
      );
      return [...ALL_PRIMARY_AGENTS_LIST];
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
