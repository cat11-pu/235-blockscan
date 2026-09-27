// scanner.js：下钻比对
import { cut } from "./block.js";

const MAX_LEAVES = 500000;
const COMPARISON_FACTOR = 2;

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function isIntArray(values) {
  return Array.isArray(values) && values.every((value) => Number.isInteger(value));
}

export function scan(spec) {
  const block = spec.block;
  const left = spec.left;
  const right = spec.right;

  if (!Number.isInteger(block) || block < 2) {
    fail("E_BAD_PARAM", "block 必须是不小于 2 的正整数");
  }
  if (!isIntArray(left) || !isIntArray(right) || left.length === 0
      || left.length !== right.length || left.length > MAX_LEAVES) {
    fail("E_BAD_SHAPE", "两侧必须是等长、非空、元素全为整数的数列，且叶子数不超过 " + MAX_LEAVES);
  }

  const leaves = left.length;
  let power = leaves;
  while (power % block === 0) power /= block;
  if (power !== 1) {
    fail("E_BAD_SHAPE", "叶子数 " + leaves + " 不是块大小 " + block + " 的整数次幂");
  }

  const bound = COMPARISON_FACTOR * leaves;
  let comparisons = 0;
  const mismatch = [];

  function compare(start, length) {
    comparisons += 1;
    if (comparisons >= bound) {
      fail("E_BAD_SHAPE", "比对次数超过上界 " + bound);
    }
    let same = true;
    for (let i = 0; i < length; i++) {
      if (left[start + i] !== right[start + i]) { same = false; break; }
    }
    if (same) return;
    if (length === 1) {
      mismatch.push(start + 1);
      return;
    }
    const childLength = length / block;
    for (let part = 0; part < block; part++) {
      compare(start + part * childLength, childLength);
    }
  }

  compare(0, leaves);

  return { mismatch: mismatch, comparisons: comparisons, identical: mismatch.length === 0 };
}
