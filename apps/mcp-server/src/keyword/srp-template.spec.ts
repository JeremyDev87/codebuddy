import { renderSrpTemplate, SRP_TEMPLATE } from './srp-template';

describe('srp-template', () => {
  describe('SRP_TEMPLATE', () => {
    it('should contain all 5 SRP steps', () => {
      expect(SRP_TEMPLATE).toContain('DECOMPOSE');
      expect(SRP_TEMPLATE).toContain('SOLVE');
      expect(SRP_TEMPLATE).toContain('VERIFY');
      expect(SRP_TEMPLATE).toContain('SYNTHESIZE');
      expect(SRP_TEMPLATE).toContain('REFLECT');
    });

    it('should contain placeholders for dynamic content', () => {
      expect(SRP_TEMPLATE).toContain('{{COMPLEXITY}}');
      expect(SRP_TEMPLATE).toContain('{{REASON}}');
    });

    it('should include confidence level descriptions', () => {
      expect(SRP_TEMPLATE).toContain('🟢 High');
      expect(SRP_TEMPLATE).toContain('🟡 Medium');
      expect(SRP_TEMPLATE).toContain('🔴 Low');
    });

    it('should include min() synthesis rule', () => {
      expect(SRP_TEMPLATE).toContain('min()');
      expect(SRP_TEMPLATE).toContain('Overall Confidence');
    });
  });

  describe('renderSrpTemplate', () => {
    it('should replace complexity placeholder', () => {
      const result = renderSrpTemplate({
        complexity: 'COMPLEX',
        reason: 'Test reason',
      });

      expect(result).toContain('**COMPLEX**');
      expect(result).not.toContain('{{COMPLEXITY}}');
    });

    it('should replace reason placeholder', () => {
      const result = renderSrpTemplate({
        complexity: 'COMPLEX',
        reason: 'Task requires structured reasoning',
      });

      expect(result).toContain('Task requires structured reasoning');
      expect(result).not.toContain('{{REASON}}');
    });

    it('should work with SIMPLE complexity', () => {
      const result = renderSrpTemplate({
        complexity: 'SIMPLE',
        reason: 'Forced via --srp',
      });

      expect(result).toContain('**SIMPLE**');
      expect(result).toContain('Forced via --srp');
    });

    it('should preserve all SRP steps in output', () => {
      const result = renderSrpTemplate({
        complexity: 'COMPLEX',
        reason: 'Test',
      });

      expect(result).toContain('### 1. DECOMPOSE');
      expect(result).toContain('### 2. SOLVE');
      expect(result).toContain('### 3. VERIFY');
      expect(result).toContain('### 4. SYNTHESIZE');
      expect(result).toContain('### 5. REFLECT');
    });
  });
});
