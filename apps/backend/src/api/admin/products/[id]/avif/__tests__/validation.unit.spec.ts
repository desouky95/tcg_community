import { isAvif, MAX_AVIF_BYTES } from '../validation';

describe('AVIF validation', () => {
  it('accepts AVIF and AVIS compatible brands in valid ftyp boxes', () => {
    const major = Buffer.from('000000186674797061766966000000006d69663161766966', 'hex');
    const compatible = Buffer.from('00000018667479706d696631000000006176696669736f6d', 'hex');
    expect(isAvif(major)).toBe(true);
    expect(isAvif(compatible)).toBe(true);
  });
  it('rejects truncated, non-AVIF and malformed boxes', () => {
    expect(isAvif(Buffer.from('avif'))).toBe(false);
    expect(isAvif(Buffer.from('00000014667479706d6966310000000068656963', 'hex'))).toBe(false);
    expect(isAvif(Buffer.from('00000100667479706176696600000000', 'hex'))).toBe(false);
    expect(MAX_AVIF_BYTES).toBe(10485760);
  });
});
