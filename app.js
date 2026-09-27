// app.js：渲染结果
import { cut, totalOf } from "./block.js";
import { scan } from "./scanner.js";

export function render(spec) {
  const left = spec.left || [];
  const right = spec.right || [];
  const block = spec.block || 0;
  const view = scan(spec);
  const mismatch = view.mismatch || [];
  return { mismatch: mismatch, comparisons: view.comparisons || 0,
           identical: view.identical !== false, block: block, leaves: left.length,
           left_sum: totalOf(left), right_sum: totalOf(right), count: left.length,
           segments: cut(left, block).length, tail: totalOf([1, 2]) };
}
