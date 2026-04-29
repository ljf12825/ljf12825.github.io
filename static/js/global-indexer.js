(function initGlobalIndexer() {
  const root = document.getElementById("global-indexer");
  const header = root?.querySelector(".float-header");
  const input = document.getElementById("globalIndexInput");
  const dataScript = document.getElementById("global-index-data");
  const tagsEl = document.getElementById("globalIndexTags");
  const catsEl = document.getElementById("globalIndexCategories");
  const previewEl = document.getElementById("globalIndexPreview");
  const countEl = document.getElementById("globalIndexCount");
  const openBtn = document.getElementById("openGlobalSearchPage");
  if (!root || !header || !input || !dataScript || !tagsEl || !catsEl || !previewEl || !countEl || !openBtn) return;

  const pages = JSON.parse(dataScript.textContent || "[]");
  const currentSection = (root.dataset.currentSection || "").toLowerCase();
  let scope = "global";
  const selectedTags = new Set();
  const selectedCategories = new Set();

  // Helper function to ensure value is an array
  const ensureArray = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const norm = (v) => String(v || "").trim().toLowerCase();
  const score = (page, q) => {
    if (!q) return 1;
    const title = norm(page.title);
    const summary = norm(page.summary);
    const tags = ensureArray(page.tags).map(norm);
    const cats = ensureArray(page.categories).map(norm);
    let s = 0;
    if (title === q) s += 200;
    if (title.includes(q)) s += 120;
    if (tags.some(t => t === q)) s += 90;
    if (tags.some(t => t.includes(q))) s += 60;
    if (cats.some(c => c === q)) s += 80;
    if (cats.some(c => c.includes(q))) s += 55;
    if (summary.includes(q)) s += 30;
    return s;
  };

  const scopedPages = () => (scope === "section" && currentSection)
    ? pages.filter(p => norm(p.section) === currentSection)
    : pages;

  function matchedPages() {
    const q = norm(input.value);
    return scopedPages().map(p => ({ p, s: score(p, q) })).filter(({ p, s }) => {
      if (q && s <= 0) return false;
      const pTags = new Set(ensureArray(p.tags).map(norm));
      const pCats = new Set(ensureArray(p.categories).map(norm));
      return [...selectedTags].every(t => pTags.has(t)) && [...selectedCategories].every(c => pCats.has(c));
    }).sort((a, b) => b.s - a.s).map(x => x.p);
  }

  function renderFacet(list, mountEl, activeSet, prefix, suffix = "") {
    mountEl.innerHTML = "";
    list.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = `${prefix}${item}${suffix}`;
      if (activeSet.has(item)) a.classList.add("active");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        activeSet.has(item) ? activeSet.delete(item) : activeSet.add(item);
        refresh();
      });
      li.appendChild(a);
      mountEl.appendChild(li);
    });
  }

  function refresh() {
    const matched = matchedPages();
    countEl.textContent = String(matched.length);

    const tagSet = new Set();
    const catSet = new Set();
    matched.forEach(p => {
      ensureArray(p.tags).map(norm).filter(Boolean).forEach(t => tagSet.add(t));
      ensureArray(p.categories).map(norm).filter(Boolean).forEach(c => catSet.add(c));
    });

    renderFacet([...tagSet].sort(), tagsEl, selectedTags, "#");
    renderFacet([...catSet].sort(), catsEl, selectedCategories, "[", "]");

    previewEl.innerHTML = matched.slice(0, 8).map(p => `
      <li><a href="${p.permalink}">${p.title}</a></li>
    `).join("");
  }

  function openResultPage() {
    const q = encodeURIComponent(input.value || "");
    const tags = encodeURIComponent([...selectedTags].join(","));
    const categories = encodeURIComponent([...selectedCategories].join(","));
    window.location.href = `/global-search/?q=${q}&scope=${scope}&section=${encodeURIComponent(currentSection)}&tags=${tags}&categories=${categories}`;
  }

  root.querySelectorAll(".scope-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      root.querySelectorAll(".scope-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      scope = btn.dataset.scope || "global";
      selectedTags.clear();
      selectedCategories.clear();
      refresh();
    });
  });

  input.addEventListener("input", refresh);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") openResultPage(); });
  openBtn.addEventListener("click", openResultPage);

  let isDown = false, ox = 0, oy = 0, lastTap = 0, sx = 0, sy = 0;
  const saved = JSON.parse(localStorage.getItem("global-index-pos") || "null");
  if (saved) {
    root.style.left = `${saved.x}px`; root.style.top = `${saved.y}px`; root.style.right = "auto"; root.style.bottom = "auto";
  } else {
    root.style.left = "20px"; root.style.bottom = "20px"; root.style.right = "auto"; root.style.top = "auto";
  }
  if (localStorage.getItem("global-index-collapse") === "1") root.classList.add("closed");

  const clamp = (l, t) => ({ left: Math.min(Math.max(0, l), Math.max(0, innerWidth - root.offsetWidth)), top: Math.min(Math.max(0, t), Math.max(0, innerHeight - root.offsetHeight)) });
  const apply = (l, t) => { const c = clamp(l, t); root.style.left = `${c.left}px`; root.style.top = `${c.top}px`; root.style.right = "auto"; root.style.bottom = "auto"; };
  const toggle = () => { root.classList.toggle("closed"); localStorage.setItem("global-index-collapse", root.classList.contains("closed") ? "1" : "0"); setTimeout(() => apply(root.offsetLeft, root.offsetTop), 0); };

  header.addEventListener("mousedown", e => { e.preventDefault(); isDown = true; sx = e.clientX; sy = e.clientY; ox = e.clientX - root.offsetLeft; oy = e.clientY - root.offsetTop; });
  document.addEventListener("mousemove", e => { if (isDown) apply(e.clientX - ox, e.clientY - oy); });
  document.addEventListener("mouseup", e => {
    if (!isDown) return;
    isDown = false;
    localStorage.setItem("global-index-pos", JSON.stringify({ x: root.offsetLeft, y: root.offsetTop }));
    const d = Math.hypot(e.clientX - sx, e.clientY - sy), n = Date.now();
    if (d < 6 && n - lastTap < 300) toggle();
    lastTap = n;
  });

  refresh();
})();