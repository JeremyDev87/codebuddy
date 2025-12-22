/**
 * Framework Templates
 *
 * Export all available config templates
 */

import type { ConfigTemplate } from '../template.types';
import { nextjsTemplate } from './nextjs.template';
import { reactTemplate } from './react.template';
import { nestjsTemplate } from './nestjs.template';
import { expressTemplate } from './express.template';
import { nodeTemplate } from './node.template';
import { defaultTemplate } from './default.template';

/**
 * All available templates
 */
export const TEMPLATES: ConfigTemplate[] = [
  nextjsTemplate,
  reactTemplate,
  nestjsTemplate,
  expressTemplate,
  nodeTemplate,
  defaultTemplate,
];

// Re-export individual templates
export {
  nextjsTemplate,
  reactTemplate,
  nestjsTemplate,
  expressTemplate,
  nodeTemplate,
  defaultTemplate,
};
