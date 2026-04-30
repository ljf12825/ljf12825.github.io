(function initGlobalIndexer() {
    const root = document.getElementById("global-indexer");
    const header = root?.querySelector(".float-header");
    const input = document.getElementById("globalIndexInput");
    const dataScript = document.getElementById("global-index-data");
    const tagsEl = document.getElementById("globalIndexTags");
    const catsEl = document.getElementById("globalIndexCategories");
    const typesEl = document.getElementById("globalIndexTypes");
    const previewEl = document.getElementById("globalIndexPreview");
    const countEl = document.getElementById("globalIndexCount");
    const openBtn = document.getElementById("openGlobalSearchPage");
    if (!root || !header || !input || !dataScript || !tagsEl || !catsEl || !typesEl || !previewEl || !countEl || !openBtn) return;

    const pages = JSON.parse(dataScript.textContent || "[]");
    const currentSection = (root.dataset.currentSection || "").toLowerCase();
    const currentType = (root.dataset.currentType || "").toLowerCase();
    const currentPath = (root.dataset.currentPath || "/").toLowerCase();
    let scope = "global";
    const selectedTags = new Set();
    const selectedCategories = new Set();
    const selectedTypes = new Set();

    const ensureArray = (arr) => {
        if (!arr) return [];
        if (Array.isArray(arr)) return arr;
        if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean);
        return [];
    };

    const norm = (v) => String(v || "").trim().toLowerCase();

    const normalizePath = (path) => {
        if (!path) return "/";
        let normalized = path.toLowerCase().trim();
        if (!normalized.startsWith("/")) normalized = "/" + normalized;
        if (!normalized.endsWith("/")) normalized = normalized + "/";
        return normalized;
    };

    const score = (page, q) => {
        if (!q) return 0;
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

    const getSearchScope = () => {
        if (scope === "global") {
            return { type: "global" };
        }

        if (currentType === "lab") {
            return { type: "section_type", section: currentSection, pageType: "lab" };
        } else if (currentType === "log") {
            return { type: "section_type", section: currentSection, pageType: "log" };
        } else if (currentType === "file") {
            return { type: "path", path: normalizePath(currentPath) };
        } else {
            return { type: "section", section: currentSection };
        }
    };

    const scopedPages = () => {
        const searchScope = getSearchScope();

        switch (searchScope.type) {
            case "global":
                return pages;

            case "section":
                return pages.filter(p => norm(p.section) === searchScope.section);

            case "section_type":
                return pages.filter(p =>
                    norm(p.section) === searchScope.section &&
                    norm(p.type) === searchScope.pageType
                );

            case "path":
                const normalizedCurrentPath = normalizePath(currentPath);
                return pages.filter(p => {
                    const pageParentPath = normalizePath(p.parentPath || "");
                    return pageParentPath === normalizedCurrentPath;
                });

            default:
                return pages;
        }
    };

    function matchedPages() {
        const q = norm(input.value);

        if (!q) {
            if (selectedTags.size > 0 || selectedCategories.size > 0 || selectedTypes.size > 0) {
                return scopedPages().filter(p => {
                    const pTags = new Set(ensureArray(p.tags).map(norm));
                    const pCats = new Set(ensureArray(p.categories).map(norm));
                    return [...selectedTags].every(t => pTags.has(t)) &&
                        [...selectedCategories].every(c => pCats.has(c)) &&
                        (selectedTypes.size === 0 || selectedTypes.has(norm(p.type)));
                });
            }
            return [];
        }

        if (q === '/*') return scopedPages().filter(p => {
            const pTags = new Set(ensureArray(p.tags).map(norm));
            const pCats = new Set(ensureArray(p.categories).map(norm));
            return [...selectedTags].every(t => pTags.has(t)) &&
                [...selectedCategories].every(c => pCats.has(c)) &&
                (selectedTypes.size === 0 || selectedTypes.has(norm(p.type)));
        });

        return scopedPages().map(p => ({ p, s: score(p, q) })).filter(({ p, s }) => {
            if (s <= 0) return false;
            const pTags = new Set(ensureArray(p.tags).map(norm));
            const pCats = new Set(ensureArray(p.categories).map(norm));
            return [...selectedTags].every(t => pTags.has(t)) &&
                [...selectedCategories].every(c => pCats.has(c)) &&
                (selectedTypes.size === 0 || selectedTypes.has(norm(p.type)));
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

        // 从 matched 结果中动态收集 tags/categories/types
        const tagSet = new Set();
        const catSet = new Set();
        const typeSet = new Set();

        // 如果有过滤条件，从 matched 收集；否则从 scoped 收集全部
        const q = norm(input.value);
        const hasFilters = q || selectedTags.size > 0 || selectedCategories.size > 0 || selectedTypes.size > 0;

        const source = hasFilters ? matched : scopedPages();
        source.forEach(p => {
            ensureArray(p.tags).map(norm).filter(Boolean).forEach(t => tagSet.add(t));
            ensureArray(p.categories).map(norm).filter(Boolean).forEach(c => catSet.add(c));
            typeSet.add(norm(p.type));
        });

        renderFacet([...tagSet].sort(), tagsEl, selectedTags, "#");
        renderFacet([...catSet].sort(), catsEl, selectedCategories, "[", "]");
        renderFacet([...typeSet].sort(), typesEl, selectedTypes, "<", ">");

        if (!hasFilters) {
            previewEl.innerHTML = "";
            return;
        }

        const isShowAll = q === '/*';

        previewEl.innerHTML = matched.slice(0, 8).map(p => {
            const matchScore = isShowAll ? 0 : score(p, q);
            const maxScore = 200;
            const percentage = isShowAll ? '-' : Math.min(100, Math.round((matchScore / maxScore) * 100)) + '%';

            return `
            <li style="display: flex; align-items: baseline; gap: 8px;">
              <a href="${p.permalink}" title="${p.title}" style="flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.title}</a>
              <span style="font-size: 0.7em; color: #666; flex-shrink: 0;">[${p.type}]</span>
              <span style="font-size: 0.7em; color: #666; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px;">${p.permalink}</span>
              <span style="font-size: 0.75em; color: #666; flex-shrink: 0;">${percentage}</span>
            </li>
        `;
        }).join("");
    }

    function openResultPage() {
        const q = input.value.trim();
        const hasFilters = q || selectedTags.size > 0 || selectedCategories.size > 0 || selectedTypes.size > 0;

        if (!hasFilters) return;

        const searchScope = getSearchScope();

        let scopeParam = "";
        if (searchScope.type === "section") {
            scopeParam = `&section=${encodeURIComponent(currentSection)}`;
        } else if (searchScope.type === "section_type") {
            scopeParam = `&section=${encodeURIComponent(currentSection)}&pageType=${encodeURIComponent(searchScope.pageType)}`;
        } else if (searchScope.type === "path") {
            scopeParam = `&path=${encodeURIComponent(currentPath)}`;
        }

        window.location.href = `/global-search/?q=${encodeURIComponent(q || '/*')}&scope=${scope}&type=${searchScope.type}${scopeParam}&tags=${encodeURIComponent([...selectedTags].join(","))}&categories=${encodeURIComponent([...selectedCategories].join(","))}&types=${encodeURIComponent([...selectedTypes].join(","))}`;
    }

    root.querySelectorAll(".scope-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            root.querySelectorAll(".scope-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            scope = btn.dataset.scope || "global";
            selectedTags.clear();
            selectedCategories.clear();
            selectedTypes.clear();
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
    const toggle = () => {
        root.classList.toggle("closed");
        localStorage.setItem("global-index-collapse", root.classList.contains("closed") ? "1" : "0");
        setTimeout(() => apply(root.offsetLeft, root.offsetTop), 0);
    };

    const getClientPos = (e) => {
        if (e.touches) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };

    const onStart = (e) => {
        e.preventDefault();
        isDown = true;
        const pos = getClientPos(e);
        sx = pos.x;
        sy = pos.y;
        ox = pos.x - root.offsetLeft;
        oy = pos.y - root.offsetTop;
    };

    const onMove = (e) => {
        if (!isDown) return;
        const pos = getClientPos(e);
        apply(pos.x - ox, pos.y - oy);
    };

    const onEnd = (e) => {
        if (!isDown) return;
        isDown = false;
        localStorage.setItem("global-index-pos", JSON.stringify({ x: root.offsetLeft, y: root.offsetTop }));
        const pos = e.changedTouches ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY };
        const d = Math.hypot(pos.x - sx, pos.y - sy), n = Date.now();
        if (d < 10 && n - lastTap < 300) toggle();
        lastTap = n;
    };

    header.addEventListener("mousedown", onStart);
    header.addEventListener("touchstart", onStart, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);

    refresh();
})();