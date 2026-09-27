// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "块大小 " + (spec.block || 0) + "，两侧各 " + (spec.left || []).length + " 格。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (spec.left || []).forEach(function (value, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "第 " + (spot + 1) + " 格 左 " + value + " 右 " + (spec.right || [])[spot];
      row.appendChild(head);
      const mark = document.createElement("span");
      const bad = (view.mismatch || []).indexOf(spot + 1) !== -1;
      mark.className = "chip" + (bad ? " bad" : " ok");
      mark.textContent = bad ? "不一样" : "一样";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "比对 " + view.comparisons + " 次，块大小 " + view.block
      + "，叶子 " + view.leaves + " 格";
    parts.log.textContent = view.identical ? "两侧完全一致" : "不一致位置 " + JSON.stringify(view.mismatch);
  }

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.value = "5";
  parts.controls.appendChild(valueInput);

  const spotInput = document.createElement("input");
  spotInput.type = "number";
  spotInput.value = "2";
  parts.controls.appendChild(spotInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "比对一遍";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const editButton = document.createElement("button");
  editButton.textContent = "改右表某一格";
  editButton.addEventListener("click", function () {
    const spot = Number(spotInput.value);
    const value = Number(valueInput.value);
    const list = spec.right || [];
    if (!Number.isInteger(spot) || spot < 1 || spot > list.length) return;
    list[spot - 1] = Number.isFinite(value) ? value : 0;
    draw();
  });
  parts.controls.appendChild(editButton);

  const sameButton = document.createElement("button");
  sameButton.textContent = "右表抄左表";
  sameButton.addEventListener("click", function () {
    spec.right = (spec.left || []).slice();
    draw();
  });
  parts.controls.appendChild(sameButton);

  const blockButton = document.createElement("button");
  blockButton.textContent = "块大小翻倍";
  blockButton.addEventListener("click", function () {
    spec.block = (spec.block || 2) * 2;
    draw();
  });
  parts.controls.appendChild(blockButton);

  draw();
}
