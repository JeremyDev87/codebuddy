import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LRUCache } from '../lru-cache';

describe('LRUCache', () => {
  let cache: LRUCache<string, string>;

  beforeEach(() => {
    cache = new LRUCache<string, string>({ maxSize: 3, ttl: 1000 });
  });

  describe('Basic Operations', () => {
    it('stores and retrieves values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('returns undefined for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('updates existing keys', () => {
      cache.set('key1', 'value1');
      cache.set('key1', 'value2');
      expect(cache.get('key1')).toBe('value2');
    });

    it('tracks cache size correctly', () => {
      expect(cache.size()).toBe(0);
      cache.set('key1', 'value1');
      expect(cache.size()).toBe(1);
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });

    it('clears all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.size()).toBe(0);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('checks if key exists with has()', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
    });
  });

  describe('LRU Eviction', () => {
    it('evicts least recently used entry when cache is full', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      cache.set('key4', 'value4'); // Should evict key1

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
      expect(cache.size()).toBe(3);
    });

    it('updates LRU order on get()', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.get('key1'); // Move key1 to end (most recently used)

      cache.set('key4', 'value4'); // Should evict key2, not key1

      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });

    it('updates LRU order on set()', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.set('key1', 'updated'); // Move key1 to end

      cache.set('key4', 'value4'); // Should evict key2, not key1

      expect(cache.get('key1')).toBe('updated');
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBe('value3');
      expect(cache.get('key4')).toBe('value4');
    });
  });

  describe('TTL Expiration', () => {
    it('expires entries after TTL', () => {
      vi.useFakeTimers();

      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');

      vi.advanceTimersByTime(1001); // Advance past TTL

      expect(cache.get('key1')).toBeUndefined();
      expect(cache.size()).toBe(0); // Entry should be removed

      vi.useRealTimers();
    });

    it('does not expire entries before TTL', () => {
      vi.useFakeTimers();

      cache.set('key1', 'value1');

      vi.advanceTimersByTime(500); // Half of TTL

      expect(cache.get('key1')).toBe('value1');

      vi.useRealTimers();
    });

    it('uses default TTL when not specified', () => {
      vi.useFakeTimers();

      const defaultCache = new LRUCache<string, string>();
      defaultCache.set('key1', 'value1');

      vi.advanceTimersByTime(5 * 60 * 1000 - 1); // Just before 5 minutes

      expect(defaultCache.get('key1')).toBe('value1');

      vi.advanceTimersByTime(2); // Just after 5 minutes

      expect(defaultCache.get('key1')).toBeUndefined();

      vi.useRealTimers();
    });
  });

  describe('Mtime-based Invalidation', () => {
    it('returns cached value when mtimes match', () => {
      const mtimes = new Map([
        ['file1.ts', 1000],
        ['file2.ts', 2000],
      ]);

      cache.set('key1', 'value1', mtimes);

      const currentMtimes = new Map([
        ['file1.ts', 1000],
        ['file2.ts', 2000],
      ]);

      expect(cache.get('key1', currentMtimes)).toBe('value1');
    });

    it('invalidates cache when mtime changed', () => {
      const mtimes = new Map([
        ['file1.ts', 1000],
        ['file2.ts', 2000],
      ]);

      cache.set('key1', 'value1', mtimes);

      const currentMtimes = new Map([
        ['file1.ts', 1001], // Changed
        ['file2.ts', 2000],
      ]);

      expect(cache.get('key1', currentMtimes)).toBeUndefined();
      expect(cache.size()).toBe(0); // Entry should be removed
    });

    it('invalidates cache when file was deleted', () => {
      const mtimes = new Map([
        ['file1.ts', 1000],
        ['file2.ts', 2000],
      ]);

      cache.set('key1', 'value1', mtimes);

      const currentMtimes = new Map([
        ['file1.ts', 1000],
        // file2.ts missing
      ]);

      expect(cache.get('key1', currentMtimes)).toBeUndefined();
    });

    it('works without mtime tracking', () => {
      cache.set('key1', 'value1'); // No mtimes provided
      expect(cache.get('key1')).toBe('value1');
    });

    it('has() respects mtime invalidation', () => {
      const mtimes = new Map([['file1.ts', 1000]]);
      cache.set('key1', 'value1', mtimes);

      expect(cache.has('key1', mtimes)).toBe(true);

      const changedMtimes = new Map([['file1.ts', 1001]]);
      expect(cache.has('key1', changedMtimes)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles maxSize of 1', () => {
      const smallCache = new LRUCache<string, string>({ maxSize: 1 });
      smallCache.set('key1', 'value1');
      smallCache.set('key2', 'value2');

      expect(smallCache.get('key1')).toBeUndefined();
      expect(smallCache.get('key2')).toBe('value2');
      expect(smallCache.size()).toBe(1);
    });

    it('handles very short TTL', () => {
      vi.useFakeTimers();

      const shortCache = new LRUCache<string, string>({ ttl: 1 });
      shortCache.set('key1', 'value1');

      vi.advanceTimersByTime(2);

      expect(shortCache.get('key1')).toBeUndefined();

      vi.useRealTimers();
    });

    it('uses default maxSize when not specified', () => {
      const defaultCache = new LRUCache<string, string>();

      for (let i = 0; i < 11; i++) {
        defaultCache.set(`key${i}`, `value${i}`);
      }

      expect(defaultCache.size()).toBe(10); // Default maxSize
      expect(defaultCache.get('key0')).toBeUndefined(); // First key evicted
      expect(defaultCache.get('key10')).toBe('value10'); // Last key present
    });

    it('handles complex object values', () => {
      const objectCache = new LRUCache<string, { data: number[] }>();
      const value = { data: [1, 2, 3] };

      objectCache.set('key1', value);

      expect(objectCache.get('key1')).toEqual(value);
    });
  });
});
