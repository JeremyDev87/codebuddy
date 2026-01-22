import {
  classifyComplexity,
  extractSrpOverride,
  generateSrpInstructions,
  DEFAULT_COMPLEXITY_CONFIG,
  COMPLEX_INDICATORS,
  SIMPLE_INDICATORS,
  NEGATION_PATTERNS,
  isNegatedMatch,
  type ComplexityTelemetry,
  type ComplexityIndicator,
} from './complexity-classifier';

describe('complexity-classifier', () => {
  describe('exported indicators', () => {
    it('should export COMPLEX_INDICATORS array', () => {
      expect(COMPLEX_INDICATORS).toBeDefined();
      expect(Array.isArray(COMPLEX_INDICATORS)).toBe(true);
      expect(COMPLEX_INDICATORS.length).toBeGreaterThan(0);
    });

    it('should export SIMPLE_INDICATORS array', () => {
      expect(SIMPLE_INDICATORS).toBeDefined();
      expect(Array.isArray(SIMPLE_INDICATORS)).toBe(true);
      expect(SIMPLE_INDICATORS.length).toBeGreaterThan(0);
    });

    it('each indicator should have pattern, description, and weight', () => {
      const allIndicators = [...COMPLEX_INDICATORS, ...SIMPLE_INDICATORS];
      for (const indicator of allIndicators) {
        expect(indicator.pattern).toBeInstanceOf(RegExp);
        expect(typeof indicator.description).toBe('string');
        expect(typeof indicator.weight).toBe('number');
        expect(indicator.weight).toBeGreaterThan(0);
        expect(indicator.weight).toBeLessThanOrEqual(1);
      }
    });

    it('should allow external customization with exported indicators', () => {
      // Verify indicators can be used for custom classification
      const customIndicator: ComplexityIndicator = {
        pattern: /custom-pattern/i,
        description: 'Custom indicator',
        weight: 0.5,
      };
      const extendedIndicators = [...COMPLEX_INDICATORS, customIndicator];
      expect(extendedIndicators.length).toBe(COMPLEX_INDICATORS.length + 1);
    });
  });

  describe('extractSrpOverride', () => {
    it('should return auto when no override flag present', () => {
      const result = extractSrpOverride('How to fix the bug?');
      expect(result.override).toBe('auto');
      expect(result.cleanedPrompt).toBe('How to fix the bug?');
    });

    it('should detect --srp flag and return force', () => {
      const result = extractSrpOverride('Fix typo --srp');
      expect(result.override).toBe('force');
      expect(result.cleanedPrompt).toBe('Fix typo');
    });

    it('should detect --no-srp flag and return skip', () => {
      const result = extractSrpOverride('Design auth system --no-srp');
      expect(result.override).toBe('skip');
      expect(result.cleanedPrompt).toBe('Design auth system');
    });

    it('should handle flag in middle of prompt', () => {
      const result = extractSrpOverride('Please --srp analyze this code');
      expect(result.override).toBe('force');
      expect(result.cleanedPrompt).toBe('Please  analyze this code');
    });

    it('should be case-insensitive for flags', () => {
      const result = extractSrpOverride('Task --SRP');
      expect(result.override).toBe('force');
    });
  });

  describe('classifyComplexity', () => {
    describe('SIMPLE task classification', () => {
      it('should classify type/syntax questions as SIMPLE', () => {
        const result = classifyComplexity(
          'What is the return type of this function?',
        );
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify definition questions as SIMPLE', () => {
        const result = classifyComplexity(
          'How do I declare a readonly property in TypeScript?',
        );
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify simple fixes as SIMPLE', () => {
        const result = classifyComplexity('Fix the typo in this file');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify rename operations as SIMPLE', () => {
        const result = classifyComplexity(
          'Rename this function to handleClick',
        );
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify add comment requests as SIMPLE', () => {
        const result = classifyComplexity('Add a comment explaining this code');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify formatting requests as SIMPLE', () => {
        const result = classifyComplexity('Format this file');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });
    });

    describe('COMPLEX task classification', () => {
      it('should classify architecture design as COMPLEX', () => {
        const result = classifyComplexity(
          'How should we design the authentication system?',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify trade-off analysis as COMPLEX', () => {
        const result = classifyComplexity(
          'Compare the pros and cons of Redux vs Context API',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify refactoring as COMPLEX', () => {
        const result = classifyComplexity(
          'Refactor the user service to improve maintainability',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify multi-file changes as COMPLEX', () => {
        const result = classifyComplexity(
          'Update the error handling across multiple modules',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify performance optimization as COMPLEX', () => {
        const result = classifyComplexity(
          'How can we optimize the performance of this feature?',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify best approach questions as COMPLEX', () => {
        const result = classifyComplexity(
          "What's the best way to implement state management?",
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify integration tasks as COMPLEX', () => {
        const result = classifyComplexity(
          'Integrate the payment service with our API',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });
    });

    describe('override handling', () => {
      it('should force SRP with --srp flag on SIMPLE task', () => {
        const result = classifyComplexity('Fix typo --srp');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(true);
        expect(result.override).toBe('force');
        expect(result.reason).toContain('[Override: --srp]');
      });

      it('should skip SRP with --no-srp flag on COMPLEX task', () => {
        const result = classifyComplexity(
          'How should we design the architecture? --no-srp',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(false);
        expect(result.override).toBe('skip');
        expect(result.reason).toContain('[Override: --no-srp]');
      });
    });

    describe('confidence levels', () => {
      it('should have confidence between 0 and 1', () => {
        const result = classifyComplexity('Design the auth system');
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });

      it('should provide matched indicators', () => {
        const result = classifyComplexity(
          'How should we design the authentication system?',
        );
        expect(result.matchedIndicators.length).toBeGreaterThan(0);
      });
    });

    describe('borderline cases', () => {
      it('should lean towards COMPLEX for ambiguous prompts with both indicators', () => {
        // This prompt has both simple and complex indicators
        const result = classifyComplexity(
          'How to fix the architecture design issue?',
        );
        // Should lean towards COMPLEX for safety
        expect(result.applySrp).toBe(true);
      });

      it('should classify as SIMPLE when no indicators match', () => {
        const result = classifyComplexity('Hello');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });
    });

    describe('Korean (i18n) pattern support', () => {
      it('should classify Korean design task as COMPLEX', () => {
        const result = classifyComplexity('인증 시스템 설계 방안');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Korean refactoring as COMPLEX', () => {
        const result = classifyComplexity('코드 리팩토링 진행');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Korean architecture task as COMPLEX', () => {
        const result = classifyComplexity('아키텍처 개선 방안 검토');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Korean optimization as COMPLEX', () => {
        const result = classifyComplexity('성능 최적화 작업');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Korean typo fix as SIMPLE', () => {
        const result = classifyComplexity('오타 수정');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Korean comment request as SIMPLE', () => {
        const result = classifyComplexity('주석 추가해줘');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Korean formatting request as SIMPLE', () => {
        const result = classifyComplexity('코드 포맷팅 정리');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });
    });

    describe('Japanese (i18n) pattern support', () => {
      it('should classify Japanese design task as COMPLEX', () => {
        const result = classifyComplexity('認証システムの設計');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Japanese refactoring as COMPLEX', () => {
        const result = classifyComplexity('コードのリファクタリング');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Japanese architecture task as COMPLEX', () => {
        const result = classifyComplexity('アーキテクチャの改善');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Japanese typo fix as SIMPLE', () => {
        const result = classifyComplexity('タイポを直して');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Japanese comment request as SIMPLE', () => {
        const result = classifyComplexity('コメントを追加');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Japanese formatting request as SIMPLE', () => {
        const result = classifyComplexity('コードをフォーマット');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });
    });

    describe('Chinese (i18n) pattern support', () => {
      it('should classify Chinese design task as COMPLEX', () => {
        const result = classifyComplexity('设计认证系统');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Chinese refactoring as COMPLEX', () => {
        const result = classifyComplexity('代码重构');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Chinese architecture task as COMPLEX', () => {
        const result = classifyComplexity('改进架构设计');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Chinese typo fix as SIMPLE', () => {
        const result = classifyComplexity('修复错误');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Chinese comment request as SIMPLE', () => {
        const result = classifyComplexity('添加注释');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Chinese formatting request as SIMPLE', () => {
        const result = classifyComplexity('格式化代码');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });
    });

    describe('Spanish (i18n) pattern support', () => {
      it('should classify Spanish design task as COMPLEX', () => {
        const result = classifyComplexity(
          'diseño del sistema de autenticación',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Spanish refactoring as COMPLEX', () => {
        const result = classifyComplexity('refactorizar el código');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Spanish architecture task as COMPLEX', () => {
        const result = classifyComplexity('mejorar la arquitectura');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should classify Spanish typo fix as SIMPLE', () => {
        const result = classifyComplexity('corregir el error');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Spanish comment request as SIMPLE', () => {
        const result = classifyComplexity('agregar un comentario');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should classify Spanish formatting request as SIMPLE', () => {
        const result = classifyComplexity('formatear el código');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });
    });

    describe('negation pattern handling', () => {
      describe('English negations', () => {
        it('should classify "don\'t refactor" as SIMPLE', () => {
          const result = classifyComplexity("don't refactor the code");
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "do not design" as SIMPLE', () => {
          const result = classifyComplexity('do not design this yet');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "no need to optimize" as SIMPLE', () => {
          const result = classifyComplexity(
            'no need to optimize this function',
          );
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "skip the refactoring" as SIMPLE', () => {
          const result = classifyComplexity('skip the refactoring for now');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "avoid architecture changes" as SIMPLE', () => {
          const result = classifyComplexity('avoid architecture changes');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should still classify non-negated as COMPLEX', () => {
          const result = classifyComplexity('please refactor the code');
          expect(result.complexity).toBe('COMPLEX');
          expect(result.applySrp).toBe(true);
        });
      });

      describe('Korean negations', () => {
        it('should classify "리팩토링 하지 말고" as SIMPLE', () => {
          const result = classifyComplexity('리팩토링 하지 말고 그냥 두세요');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "설계 안 해도" as SIMPLE', () => {
          const result = classifyComplexity('설계 안 해도 됩니다');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "최적화 필요 없어" as SIMPLE', () => {
          const result = classifyComplexity('최적화 필요 없어요');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });
      });

      describe('Japanese negations', () => {
        it('should classify "リファクタリングしないで" as SIMPLE', () => {
          const result = classifyComplexity('リファクタリングしないでください');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "設計必要ない" as SIMPLE', () => {
          const result = classifyComplexity('設計必要ないです');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });
      });

      describe('Chinese negations', () => {
        it('should classify "不要重构" as SIMPLE', () => {
          const result = classifyComplexity('不要重构这个代码');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "不需要设计" as SIMPLE', () => {
          const result = classifyComplexity('不需要设计');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });
      });

      describe('Spanish negations', () => {
        it('should classify "no refactorizar" as SIMPLE', () => {
          const result = classifyComplexity('no refactorizar el código');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "sin diseño" as SIMPLE', () => {
          const result = classifyComplexity('sin diseño por ahora');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });

        it('should classify "evitar arquitectura" as SIMPLE', () => {
          const result = classifyComplexity('evitar arquitectura compleja');
          expect(result.complexity).toBe('SIMPLE');
          expect(result.applySrp).toBe(false);
        });
      });
    });

    describe('multi-language mixed prompts', () => {
      it('should handle English + Korean mixed prompt as COMPLEX', () => {
        const result = classifyComplexity(
          'Please 설계 the authentication system',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should handle English + Japanese mixed prompt as COMPLEX', () => {
        const result = classifyComplexity(
          'Need to リファクタリング this module',
        );
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should handle English + Chinese mixed prompt as COMPLEX', () => {
        const result = classifyComplexity('Let me 设计 the new feature');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should handle English + Spanish mixed prompt as COMPLEX', () => {
        const result = classifyComplexity('We need to refactorizar the module');
        expect(result.complexity).toBe('COMPLEX');
        expect(result.applySrp).toBe(true);
      });

      it('should handle Korean + English mixed prompt as SIMPLE', () => {
        const result = classifyComplexity('이 파일을 format 해주세요');
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });

      it('should handle negation across languages', () => {
        // English negation + Korean keyword
        const result = classifyComplexity("don't 리팩토링");
        expect(result.complexity).toBe('SIMPLE');
        expect(result.applySrp).toBe(false);
      });
    });

    describe('isNegatedMatch utility', () => {
      it('should detect English prefix negation', () => {
        // "don't " = 6 chars (indices 0-5), "refactor" starts at index 6
        expect(isNegatedMatch("don't refactor", 6, 14)).toBe(true);
      });

      it('should not detect negation when not present', () => {
        expect(isNegatedMatch('please refactor', 7, 15)).toBe(false);
      });

      it('should handle match at start of string', () => {
        expect(isNegatedMatch('refactor this', 0, 8)).toBe(false);
      });

      it('should detect Korean suffix negation', () => {
        // "리팩토링" at index 0-4, followed by " 하지 말고"
        expect(isNegatedMatch('리팩토링 하지 말고', 0, 4)).toBe(true);
      });

      it('should detect Japanese suffix negation', () => {
        // "リファクタリング" followed by "しないで"
        expect(isNegatedMatch('リファクタリングしないで', 0, 8)).toBe(true);
      });
    });

    describe('NEGATION_PATTERNS export', () => {
      it('should export NEGATION_PATTERNS array', () => {
        expect(NEGATION_PATTERNS).toBeDefined();
        expect(Array.isArray(NEGATION_PATTERNS)).toBe(true);
        expect(NEGATION_PATTERNS.length).toBeGreaterThan(0);
      });

      it('each negation pattern should be a RegExp', () => {
        for (const pattern of NEGATION_PATTERNS) {
          expect(pattern).toBeInstanceOf(RegExp);
        }
      });
    });

    describe('configurable thresholds', () => {
      it('should use custom config when provided', () => {
        const customConfig = {
          ...DEFAULT_COMPLEXITY_CONFIG,
          complexThreshold: 0.01, // Very low threshold
        };
        const result = classifyComplexity('design', { config: customConfig });
        expect(result.complexity).toBe('COMPLEX');
      });

      it('should support legacy config format (backwards compatibility)', () => {
        // Test that passing config directly still works
        const result = classifyComplexity('design', DEFAULT_COMPLEXITY_CONFIG);
        expect(result.complexity).toBe('COMPLEX');
      });

      it('should respect maxConfidence setting', () => {
        const customConfig = {
          ...DEFAULT_COMPLEXITY_CONFIG,
          maxConfidence: 0.7,
        };
        const result = classifyComplexity(
          'How should we design and architect the authentication system?',
          { config: customConfig },
        );
        expect(result.confidence).toBeLessThanOrEqual(0.7);
      });
    });

    describe('telemetry callback', () => {
      it('should call telemetry callback with classification data', () => {
        const telemetryData: ComplexityTelemetry[] = [];
        const onTelemetry = (t: ComplexityTelemetry) => telemetryData.push(t);

        classifyComplexity('Design the auth system', { onTelemetry });

        expect(telemetryData.length).toBe(1);
        expect(telemetryData[0]).toMatchObject({
          complexity: 'COMPLEX',
          applySrp: true,
        });
        expect(telemetryData[0].timestamp).toBeGreaterThan(0);
        expect(telemetryData[0].promptLength).toBe(
          'Design the auth system'.length,
        );
        expect(telemetryData[0].complexScore).toBeGreaterThan(0);
        expect(telemetryData[0].complexMatches).toBeGreaterThan(0);
      });

      it('should include override in telemetry when present', () => {
        const telemetryData: ComplexityTelemetry[] = [];
        const onTelemetry = (t: ComplexityTelemetry) => telemetryData.push(t);

        classifyComplexity('Fix typo --srp', { onTelemetry });

        expect(telemetryData[0].override).toBe('force');
      });

      it('should not fail when telemetry callback is not provided', () => {
        // Should not throw
        const result = classifyComplexity('Design system');
        expect(result).toBeDefined();
      });

      it('should support both config and telemetry in options', () => {
        const telemetryData: ComplexityTelemetry[] = [];
        const customConfig = {
          ...DEFAULT_COMPLEXITY_CONFIG,
          maxConfidence: 0.8,
        };

        classifyComplexity('Design system', {
          config: customConfig,
          onTelemetry: t => telemetryData.push(t),
        });

        expect(telemetryData.length).toBe(1);
        expect(telemetryData[0].confidence).toBeLessThanOrEqual(0.8);
      });
    });
  });

  describe('generateSrpInstructions', () => {
    it('should return undefined when applySrp is false', () => {
      const classification = classifyComplexity('What is the type?');
      const instructions = generateSrpInstructions(classification);
      expect(instructions).toBeUndefined();
    });

    it('should return SRP instructions when applySrp is true', () => {
      const classification = classifyComplexity('Design the auth system');
      const instructions = generateSrpInstructions(classification);

      expect(instructions).toBeDefined();
      expect(instructions).toContain('Structured Reasoning Process');
      expect(instructions).toContain('DECOMPOSE');
      expect(instructions).toContain('SOLVE');
      expect(instructions).toContain('VERIFY');
      expect(instructions).toContain('SYNTHESIZE');
      expect(instructions).toContain('REFLECT');
    });

    it('should include confidence level descriptions', () => {
      const classification = classifyComplexity('Design the architecture');
      const instructions = generateSrpInstructions(classification);

      expect(instructions).toContain('🟢 High');
      expect(instructions).toContain('🟡 Medium');
      expect(instructions).toContain('🔴 Low');
    });

    it('should include min() synthesis rule', () => {
      const classification = classifyComplexity('Compare multiple approaches');
      const instructions = generateSrpInstructions(classification);

      expect(instructions).toContain('min()');
      expect(instructions).toContain('Overall Confidence');
    });

    it('should return instructions when forced via --srp', () => {
      const classification = classifyComplexity('Fix typo --srp');
      const instructions = generateSrpInstructions(classification);
      expect(instructions).toBeDefined();
    });
  });
});
