import { describe, it, expect } from 'vitest';
import { formatBytes } from './format.utils';

describe('format.utils', () => {
  describe('formatBytes', () => {
    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 bytes');
    });

    it('should format 1 byte (singular)', () => {
      expect(formatBytes(1)).toBe('1 byte');
    });

    it('should format bytes (< 1KB)', () => {
      expect(formatBytes(512)).toBe('512 bytes');
      expect(formatBytes(999)).toBe('999 bytes');
      expect(formatBytes(1023)).toBe('1023 bytes');
    });

    it('should format exact KB', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(2048)).toBe('2 KB');
      expect(formatBytes(5120)).toBe('5 KB');
    });

    it('should format fractional KB', () => {
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(2560)).toBe('2.5 KB');
      expect(formatBytes(3584)).toBe('3.5 KB');
    });

    it('should format exact MB', () => {
      expect(formatBytes(1048576)).toBe('1 MB'); // 1024 * 1024
      expect(formatBytes(2097152)).toBe('2 MB'); // 2 * 1024 * 1024
      expect(formatBytes(5242880)).toBe('5 MB'); // 5 * 1024 * 1024
    });

    it('should format fractional MB', () => {
      expect(formatBytes(1572864)).toBe('1.5 MB'); // 1.5 * 1024 * 1024
      expect(formatBytes(2621440)).toBe('2.5 MB'); // 2.5 * 1024 * 1024
    });

    it('should format GB', () => {
      expect(formatBytes(1073741824)).toBe('1 GB'); // 1024 * 1024 * 1024
      expect(formatBytes(2147483648)).toBe('2 GB'); // 2 * 1024 * 1024 * 1024
    });

    it('should format TB', () => {
      expect(formatBytes(1099511627776)).toBe('1 TB'); // 1024 * 1024 * 1024 * 1024
    });

    it('should remove trailing .00 from formatted values', () => {
      expect(formatBytes(1024)).toBe('1 KB'); // Not "1.00 KB"
      expect(formatBytes(1048576)).toBe('1 MB'); // Not "1.00 MB"
    });

    it('should keep significant decimal places for non-round values', () => {
      expect(formatBytes(1126)).toBe('1.1 KB'); // 1.099609375 KB -> 1.10 -> 1.1
      expect(formatBytes(1536000)).toBe('1.46 MB'); // 1.46484375 MB -> 1.46
    });

    it('should handle common file sizes', () => {
      // Config file sizes from SECURITY.md
      expect(formatBytes(5 * 1024)).toBe('5 KB'); // Simple .editorconfig
      expect(formatBytes(50 * 1024)).toBe('50 KB'); // Complex tsconfig.json
      expect(formatBytes(200 * 1024)).toBe('200 KB'); // Edge case config
      expect(formatBytes(1024 * 1024)).toBe('1 MB'); // MAX_CONFIG_FILE_SIZE
    });

    it('should handle size violation scenarios', () => {
      const maxSize = 1024 * 1024; // 1 MB
      const oversized = 2 * 1024 * 1024; // 2 MB

      expect(formatBytes(maxSize)).toBe('1 MB');
      expect(formatBytes(oversized)).toBe('2 MB');
    });
  });
});
