export const MAX_AVIF_BYTES = 10 * 1024 * 1024;
export function isAvif(buffer: Buffer): boolean {
  if (buffer.length < 16 || buffer.toString('ascii', 4, 8) !== 'ftyp') return false;
  const size = buffer.readUInt32BE(0);
  if (size < 16 || size > buffer.length || size % 4 !== 0) return false;
  for (let offset = 8; offset + 4 <= size; offset += 4) {
    if (offset !== 12 && ['avif', 'avis'].includes(buffer.toString('ascii', offset, offset + 4))) return true;
  }
  return false;
}
