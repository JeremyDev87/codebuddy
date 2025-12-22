/**
 * Templates Module
 *
 * Template-based config generation system
 */

// Types
export type {
  FrameworkType,
  TemplateMetadata,
  ConfigTemplate,
  ConfigComments,
  TemplateSelectionResult,
  TemplateRenderOptions,
} from './template.types';

// Template selection
export {
  selectTemplate,
  getTemplateById,
  getAllTemplates,
} from './template.selector';

// Template rendering
export { renderConfigAsJs, renderConfigAsJson } from './template.renderer';

// Individual templates
export { TEMPLATES } from './frameworks';
