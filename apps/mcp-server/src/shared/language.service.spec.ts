import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    service = new LanguageService();
  });

  describe('getLanguageInstruction', () => {
    it('should return Korean instruction for "ko"', () => {
      const result = service.getLanguageInstruction('ko');
      expect(result.language).toBe('ko');
      expect(result.instruction).toBe('Always respond in Korean (한국어).');
      expect(result.fallback).toBe(false);
    });

    it('should return English instruction for "en"', () => {
      const result = service.getLanguageInstruction('en');
      expect(result.language).toBe('en');
      expect(result.instruction).toBe('Always respond in English.');
      expect(result.fallback).toBe(false);
    });

    it('should return Japanese instruction for "ja"', () => {
      const result = service.getLanguageInstruction('ja');
      expect(result.language).toBe('ja');
      expect(result.instruction).toBe('Always respond in Japanese (日本語).');
      expect(result.fallback).toBe(false);
    });

    it('should return Chinese instruction for "zh"', () => {
      const result = service.getLanguageInstruction('zh');
      expect(result.language).toBe('zh');
      expect(result.instruction).toBe('Always respond in Chinese (中文).');
      expect(result.fallback).toBe(false);
    });

    it('should return Spanish instruction for "es"', () => {
      const result = service.getLanguageInstruction('es');
      expect(result.language).toBe('es');
      expect(result.instruction).toBe('Always respond in Spanish (Español).');
      expect(result.fallback).toBe(false);
    });

    it('should return default English for unknown code', () => {
      const result = service.getLanguageInstruction('xyz');
      expect(result.language).toBe('xyz');
      expect(result.instruction).toBe('Always respond in English.');
      expect(result.fallback).toBe(true);
    });

    it('should return default English for empty string', () => {
      const result = service.getLanguageInstruction('');
      expect(result.language).toBe('');
      expect(result.instruction).toBe('Always respond in English.');
      expect(result.fallback).toBe(true);
    });

    it('should return default English for undefined', () => {
      const result = service.getLanguageInstruction(undefined);
      expect(result.language).toBe('');
      expect(result.instruction).toBe('Always respond in English.');
      expect(result.fallback).toBe(true);
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return list of supported languages', () => {
      const languages = service.getSupportedLanguages();
      expect(languages).toBeInstanceOf(Array);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages.find(l => l.code === 'ko')).toBeDefined();
      expect(languages.find(l => l.code === 'en')).toBeDefined();
    });
  });

  describe('isLanguageSupported', () => {
    it('should return true for supported language', () => {
      expect(service.isLanguageSupported('ko')).toBe(true);
      expect(service.isLanguageSupported('en')).toBe(true);
      expect(service.isLanguageSupported('ja')).toBe(true);
    });

    it('should return false for unsupported language', () => {
      expect(service.isLanguageSupported('xyz')).toBe(false);
      expect(service.isLanguageSupported('')).toBe(false);
    });
  });
});
