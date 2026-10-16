// Contamination map: tooltip on hover/focus, plus row and column highlighting.
(function () {
  const maps = document.querySelectorAll("table.map");
  if (!maps.length) return;

  const tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.append(tip);

  function fill(a) {
    tip.replaceChildren();
    const head = document.createElement("div");
    head.className = "tip-head";
    const swatch = document.createElement("span");
    swatch.className = "tip-swatch lvl-" + a.dataset.level;
    head.append(swatch, a.dataset.label);
    const pair = document.createElement("div");
    pair.className = "tip-pair";
    pair.textContent = a.dataset.pair;
    const reason = document.createElement("div");
    reason.className = "tip-reason";
    reason.textContent = a.dataset.reason;
    tip.append(head, pair, reason);
    if (a.dataset.score) {
      const score = document.createElement("div");
      score.className = "tip-score";
      score.textContent = a.dataset.score;
      tip.append(score);
    }
    tip.hidden = false;
  }

  function place(x, y) {
    const pad = 14;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    let left = x + pad;
    let top = y + pad;
    if (left + w > window.innerWidth - 8) left = Math.max(8, x - w - pad);
    if (top + h > window.innerHeight - 8) top = Math.max(8, y - h - pad);
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }

  function highlight(map, a, on) {
    a.closest("tr").classList.toggle("hl", on);
    const col = map.querySelector('th[data-col="' + a.dataset.col + '"]');
    if (col) col.classList.toggle("hl", on);
  }

  maps.forEach(function (map) {
    let current = null;
    const enter = function (a) {
      if (current) highlight(map, current, false);
      current = a;
      highlight(map, a, true);
      fill(a);
    };
    const leave = function () {
      if (current) highlight(map, current, false);
      current = null;
      tip.hidden = true;
    };

    map.addEventListener("mouseover", function (e) {
      const a = e.target.closest("a[data-level]");
      if (a) enter(a);
      else leave();
    });
    map.addEventListener("mousemove", function (e) {
      if (current) place(e.clientX, e.clientY);
    });
    map.addEventListener("mouseleave", leave);
    map.addEventListener("focusin", function (e) {
      const a = e.target.closest("a[data-level]");
      if (!a) return;
      enter(a);
      const r = a.getBoundingClientRect();
      place(r.right, r.bottom);
    });
    map.addEventListener("focusout", leave);
  });
})();

// Contamination / Scores switch. Every page load starts in Contamination mode.
(function () {
  const switches = document.querySelectorAll(".mode-switch");
  if (!switches.length) return;

  function apply(mode) {
    document.querySelectorAll("table.map").forEach(function (map) {
      map.classList.toggle("mode-scores", mode === "scores");
      map.classList.toggle("mode-contamination", mode !== "scores");
    });
    document.querySelectorAll(".mode-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
    });
    document.querySelectorAll(".legend-scores").forEach(function (el) {
      el.hidden = mode !== "scores";
    });
    document.querySelectorAll(".legend-contamination").forEach(function (el) {
      el.hidden = mode === "scores";
    });
  }

  switches.forEach(function (sw) {
    sw.addEventListener("click", function (e) {
      const button = e.target.closest("button[data-mode]");
      if (!button) return;
      apply(button.dataset.mode);
    });
  });
})();
