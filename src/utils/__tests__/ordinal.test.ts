import { toOrdinal } from '../ordinal';

describe('toOrdinal', () => {
  it('returns first for 1', () => expect(toOrdinal(1)).toBe('first'));
  it('returns second for 2', () => expect(toOrdinal(2)).toBe('second'));
  it('returns third for 3', () => expect(toOrdinal(3)).toBe('third'));
  it('returns fourth for 4', () => expect(toOrdinal(4)).toBe('fourth'));
  it('returns fifth for 5', () => expect(toOrdinal(5)).toBe('fifth'));
  it('returns sixth for 6', () => expect(toOrdinal(6)).toBe('sixth'));
  it('returns seventh for 7', () => expect(toOrdinal(7)).toBe('seventh'));
  it('returns eighth for 8', () => expect(toOrdinal(8)).toBe('eighth'));
  it('returns ninth for 9', () => expect(toOrdinal(9)).toBe('ninth'));
  it('returns tenth for 10', () => expect(toOrdinal(10)).toBe('tenth'));
  it('returns eleventh for 11', () => expect(toOrdinal(11)).toBe('eleventh'));
  it('returns twelfth for 12', () => expect(toOrdinal(12)).toBe('twelfth'));
  it('returns thirteenth for 13', () => expect(toOrdinal(13)).toBe('thirteenth'));
  it('returns twentieth for 20', () => expect(toOrdinal(20)).toBe('twentieth'));
  it('falls back to the number as a string beyond twentieth', () => expect(toOrdinal(21)).toBe('21'));
});
