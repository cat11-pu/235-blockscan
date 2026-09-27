import assert from "node:assert";
import { cut, totalOf } from "../block.js";
import { scan } from "../scanner.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("cut returns segments", () => {
  assert.ok(Array.isArray(cut([1, 2, 3, 4], 2)));
});

check("totalOf returns a number", () => {
  assert.strictEqual(typeof totalOf([1, 2]), "number");
});

check("scan returns mismatch", () => {
  assert.ok(Array.isArray(scan({ block: 2, left: [1, 1], right: [1, 1] }).mismatch));
});

check("render counts leaves", () => {
  assert.strictEqual(typeof render({ block: 2, left: [1, 1], right: [1, 1] }).count, "number");
});

check("render exposes identical flag", () => {
  assert.strictEqual(typeof render({ block: 2, left: [1, 1], right: [1, 1] }).identical, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
