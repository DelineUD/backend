import { randomInt } from 'node:crypto';

export default function generateOTPCode(size = 4): number {
  return +Array(size)
    .fill(0)
    .map((_, i) => (i === 0 ? randomInt(1, 9) : randomInt(0, 9)))
    .join('');
}
