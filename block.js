// block.js：切块与取和
export function cut(values, block) {
  const parts = [];
  const total = values.length;
  if (!Number.isInteger(block) || block < 1 || total % block !== 0) return parts;
  const size = total / block;
  for (let i = 0; i < block; i++) {
    parts.push(values.slice(i * size, (i + 1) * size));
  }
  return parts;
}

export function totalOf(values) {
  return values.reduce((sum, value) => sum + value, 0);
}
