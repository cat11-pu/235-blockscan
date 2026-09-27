// scanner.js：按块大小下钻比对
import { cut } from "./block.js";

const MAX_LEAVES = 500000;

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function isPower(n, base) {
  if (n === 1) return true;
  let v = n;
  while (v % base === 0) {
    v /= base;
    if (v === 1) return true;
  }
  return false;
}

export function scan(spec) {
  const block = spec.block;
  const left = spec.left;
  const right = spec.right;

  if (!Number.isInteger(block) || block < 2) {
    fail("E_BAD_PARAM", "block 必须是不小于 2 的正整数");
  }

  const badShape = !Array.isArray(left) || !Array.isArray(right)
    || left.length === 0 || left.length !== right.length
    || left.length > MAX_LEAVES
    || left.some((v) => !Number.isInteger(v))
    || right.some((v) => !Number.isInteger(v))
    || !isPower(left.length, block);
  if (badShape) {
    fail("E_BAD_SHAPE", "两侧长度必须一致、非空、元素皆整数，且叶子数为块大小的整数次幂");
  }

  const leaves = left.length;
  const mismatch = [];
  let comparisons = 0;

  function compare(start, len) {
    comparisons += 1;
    let same = true;
    for (let i = 0; i < len; i += 1) {
      if (left[start + i] !== right[start + i]) {
        same = false;
        break;
      }
    }
    if (same) return;
    if (len === 1) {
      mismatch.push(start + 1);
      return;
    }
    const partLen = len / block;
    cut(new Array(len), block).forEach((part, index) => {
      compare(start + index * partLen, partLen);
    });
  }

  compare(0, leaves);

  return { mismatch, comparisons, identical: mismatch.length === 0 };
}
