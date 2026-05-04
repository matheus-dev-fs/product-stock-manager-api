import { isMaxGteMin, toNumber } from './quantities.helper';

describe('quantities.helper', () => {
  describe('toNumber', () => {
    it('returns NaN for empty values', () => {
      expect(Number.isNaN(toNumber())).toBe(true);
      expect(Number.isNaN(toNumber(null as unknown as string))).toBe(true);
      expect(Number.isNaN(toNumber(''))).toBe(true);
    });

    it('parses valid numeric values', () => {
      expect(toNumber('10')).toBe(10);
      expect(toNumber(5)).toBe(5);
    });

    it('returns NaN for invalid values', () => {
      expect(Number.isNaN(toNumber('abc'))).toBe(true);
    });
  });

  describe('isMaxGteMin', () => {
    it('returns true when min or max is missing', () => {
      expect(isMaxGteMin(undefined, 10)).toBe(true);
      expect(isMaxGteMin(1, undefined)).toBe(true);
    });

    it('returns false when values are invalid', () => {
      expect(isMaxGteMin('foo', 10)).toBe(false);
      expect(isMaxGteMin(10, 'bar')).toBe(false);
    });

    it('validates max greater than or equal to min', () => {
      expect(isMaxGteMin(5, 5)).toBe(true);
      expect(isMaxGteMin(5, 6)).toBe(true);
      expect(isMaxGteMin(10, 3)).toBe(false);
    });
  });
});
