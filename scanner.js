// scanner.js：下钻比对（基线：一律给空表）
import { cut, totalOf } from "./block.js";

export function scan(spec) {
  return { mismatch: [], comparisons: 0, identical: true };
}
