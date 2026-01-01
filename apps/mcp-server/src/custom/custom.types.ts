export interface CustomFile {
  name: string;
  path: string;
  content: string;
  source: 'custom' | 'default';
}

export interface CustomRule extends CustomFile {
  type: 'rule';
}

export interface CustomAgent extends CustomFile {
  type: 'agent';
  parsed: CustomAgentSchema;
}

export interface CustomSkill extends CustomFile {
  type: 'skill';
}

/**
 * Schema for custom agent JSON files.
 * Compatible with AgentProfile from rules.types.ts
 */
export interface CustomAgentSchema {
  name: string;
  description: string;
  role: {
    title: string;
    expertise: string[];
    tech_stack_reference?: string;
    responsibilities?: string[];
  };
  [key: string]: unknown;
}

export const CUSTOM_DIR = '.codingbuddy';

export const CUSTOM_SUBDIRS = {
  rules: 'rules',
  agents: 'agents',
  skills: 'skills',
} as const;
