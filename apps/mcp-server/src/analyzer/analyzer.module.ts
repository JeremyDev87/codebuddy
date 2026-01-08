import { Module } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { ConventionsAnalyzer } from './conventions.analyzer';

/**
 * Module for project analysis functionality
 *
 * Provides services for analyzing:
 * - Package.json (dependencies, frameworks)
 * - Directory structure (architecture patterns)
 * - Config files (TypeScript, ESLint, Prettier)
 * - Code conventions (tsconfig, eslint, prettier, editorconfig, markdownlint)
 * - Source code samples
 */
@Module({
  providers: [AnalyzerService, ConventionsAnalyzer],
  exports: [AnalyzerService, ConventionsAnalyzer],
})
export class AnalyzerModule {}
