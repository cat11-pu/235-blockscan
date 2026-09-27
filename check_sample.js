import fs from "node:fs";
import { cut, totalOf } from "./block.js";
import { scan } from "./scanner.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/sides.json", "utf8"));
const view = render(spec);

emit("不一致位置列表 =", JSON.stringify(view.mismatch));
emit("比对次数 =", view.comparisons);
emit("是否完全一致 =", view.identical);
emit("块大小 =", view.block);
emit("叶子数 =", view.leaves);
emit("左总和 =", view.left_sum);
emit("右总和 =", view.right_sum);
emit("段数 =", view.segments);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  scan({ block: 1, left: [1, 2], right: [1, 2] });
  emit("参数写错的错误码", "没有报错");
} catch (error) {
  emit("参数写错的错误码", error && error.code ? error.code : String(error.message));
}
try {
  scan({ block: 2, left: [1, 2, 3], right: [1, 2, 3] });
  emit("形状写错的错误码", "没有报错");
} catch (error) {
  emit("形状写错的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "不一致位置列表": [
    2
  ],
  "比对次数": 5,
  "是否完全一致": false,
  "块大小": 2,
  "叶子数": 4,
  "左总和": 10,
  "右总和": 17,
  "段数": 2,
  "参数写错的错误码": "E_BAD_PARAM",
  "形状写错的错误码": "E_BAD_SHAPE"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
