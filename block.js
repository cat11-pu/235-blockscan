// block.js：切块与取和
export function cut(values, block) {
  const total = values.length;
  const size = Math.floor(total / block);
  const parts = [];
  for (let i = 0; i < block; i += 1) {
    parts.push(values.slice(i * size, (i + 1) * size));
  }
  return parts;
}

export function totalOf(values) {
  return values.reduce((sum, value) => sum + value, 0);
}
