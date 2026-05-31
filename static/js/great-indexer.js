(function initGlobalIndexer() {
    var root = document.getElementById("great-indexer");
    var header = root ? root.querySelector(".float-header") : null;
    var input = document.getElementById("globalIndexInput");
    var dataScript = document.getElementById("global-index-data");
    var tagsEl = document.getElementById("globalIndexTags");
    var catsEl = document.getElementById("globalIndexCategories");
    var typesEl = document.getElementById("globalIndexTypes");
    var previewEl = document.getElementById("globalIndexPreview");
    var countEl = document.getElementById("globalIndexCount");
    var openBtn = document.getElementById("openGlobalSearchPage");

    if (!root || !header || !input || !dataScript || !tagsEl || !catsEl || !typesEl || !previewEl || !countEl || !openBtn) return;

    var pages = JSON.parse(dataScript.textContent || "[]");
    var currentSection = (root.dataset.currentSection || "").toLowerCase();
    var currentType = (root.dataset.currentType || "").toLowerCase();
    var currentPath = (root.dataset.currentPath || "/").toLowerCase();
    var scope = "global";
    var selectedTags = new Set();
    var selectedCategories = new Set();
    var selectedTypes = new Set();

    var hasNav3d = root.dataset.hasNav3d === 'true';
    var searchPanel = document.getElementById('index-panel-search');
    var nav3dPanel = document.getElementById('index-panel-nav3d');
    var scopeBtns = root.querySelectorAll(".scope-btn");

    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    var ensureArray = function (arr) {
        if (!arr) return [];
        if (Array.isArray(arr)) return arr;
        if (typeof arr === 'string') return arr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        return [];
    };

    var norm = function (v) {
        if (v === null || v === undefined) return "";
        return String(v).trim().toLowerCase();
    };

    var normalizePath = function (path) {
        if (!path) return "/";
        var normalized = path.toLowerCase().trim();
        if (!normalized.startsWith("/")) normalized = "/" + normalized;
        if (!normalized.endsWith("/")) normalized = normalized + "/";
        return normalized;
    };

    var score = function (page, q) {
        if (!q) return 0;
        var title = norm(page.title);
        var summary = norm(page.summary);
        var tags = ensureArray(page.tags).map(norm);
        var cats = ensureArray(page.categories).map(norm);
        var s = 0;
        if (title === q) s += 200;
        if (title.includes(q)) s += 120;
        if (tags.some(function (t) { return t === q; })) s += 90;
        if (tags.some(function (t) { return t.includes(q); })) s += 60;
        if (cats.some(function (c) { return c === q; })) s += 80;
        if (cats.some(function (c) { return c.includes(q); })) s += 55;
        if (summary.includes(q)) s += 30;
        return s;
    };

    var getSearchScope = function () {
        if (scope === "global") return { type: "global" };
        if (scope === "section") return { type: "path", path: normalizePath(currentPath) };
        if (currentType === "lab") return { type: "section_type", section: currentSection, pageType: "lab" };
        if (currentType === "log") return { type: "section_type", section: currentSection, pageType: "log" };
        return { type: "path", path: normalizePath(currentPath) };
    };

    var scopedPages = function () {
        var searchScope = getSearchScope();
        switch (searchScope.type) {
            case "global": return pages;
            case "section": return pages.filter(function (p) { return norm(p.section) === searchScope.section; });
            case "section_type": return pages.filter(function (p) { return norm(p.section) === searchScope.section && norm(p.type) === searchScope.pageType; });
            case "path":
                var ncp = normalizePath(currentPath);
                return pages.filter(function (p) {
                    var pPermalink = normalizePath(p.permalink || "");
                    var pParentPath = normalizePath(p.parentPath || "");
                    return pParentPath === ncp || pPermalink.startsWith(ncp);
                });
            default: return pages;
        }
    };

    function matchedPages() {
        var q = norm(input.value);
        if (!q) {
            if (selectedTags.size > 0 || selectedCategories.size > 0 || selectedTypes.size > 0) {
                return scopedPages().filter(function (p) {
                    var pTags = new Set(ensureArray(p.tags).map(norm));
                    var pCats = new Set(ensureArray(p.categories).map(norm));
                    var tagsMatch = true, catsMatch = true;
                    selectedTags.forEach(function (t) { if (!pTags.has(norm(t))) tagsMatch = false; });
                    selectedCategories.forEach(function (c) { if (!pCats.has(norm(c))) catsMatch = false; });
                    return tagsMatch && catsMatch && (selectedTypes.size === 0 || selectedTypes.has(norm(p.type)));
                });
            }
            return [];
        }
        if (q === '/*') return scopedPages().filter(function (p) {
            var pTags = new Set(ensureArray(p.tags).map(norm));
            var pCats = new Set(ensureArray(p.categories).map(norm));
            var tagsMatch = true, catsMatch = true;
            selectedTags.forEach(function (t) { if (!pTags.has(norm(t))) tagsMatch = false; });
            selectedCategories.forEach(function (c) { if (!pCats.has(norm(c))) catsMatch = false; });
            return tagsMatch && catsMatch && (selectedTypes.size === 0 || selectedTypes.has(norm(p.type)));
        });
        return scopedPages().map(function (p) { return { p: p, s: score(p, q) }; })
            .filter(function (x) {
                if (x.s <= 0) return false;
                var pTags = new Set(ensureArray(x.p.tags).map(norm));
                var pCats = new Set(ensureArray(x.p.categories).map(norm));
                var tagsMatch = true, catsMatch = true;
                selectedTags.forEach(function (t) { if (!pTags.has(norm(t))) tagsMatch = false; });
                selectedCategories.forEach(function (c) { if (!pCats.has(norm(c))) catsMatch = false; });
                return tagsMatch && catsMatch && (selectedTypes.size === 0 || selectedTypes.has(norm(x.p.type)));
            }).sort(function (a, b) { return b.s - a.s; }).map(function (x) { return x.p; });
    }

    function renderFacet(list, mountEl, activeSet, prefix, suffix) {
        mountEl.innerHTML = "";
        if (!suffix) suffix = "";
        list.forEach(function (item) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#";
            a.textContent = prefix + item + suffix;
            if (activeSet.has(item)) a.classList.add("active");
            a.addEventListener("click", function (e) {
                e.preventDefault();
                if (activeSet.has(item)) activeSet.delete(item); else activeSet.add(item);
                refresh();
            });
            li.appendChild(a);
            mountEl.appendChild(li);
        });
    }

    function refresh() {
        if (scope === 'nav3d') {
            return;
        }

        var q = norm(input.value);
        var hasFilters = q || selectedTags.size > 0 || selectedCategories.size > 0 || selectedTypes.size > 0;

        var tagsBox = tagsEl.closest('.index-tags-box');
        var catsBox = catsEl.closest('.index-categories-box');
        var typesBox = typesEl.closest('.index-types-box');

        if (tagsBox) tagsBox.style.display = hasFilters ? '' : 'none';
        if (catsBox) catsBox.style.display = hasFilters ? '' : 'none';
        if (typesBox) typesBox.style.display = hasFilters ? '' : 'none';

        var matched = matchedPages();
        countEl.textContent = String(matched.length);
        var tagSet = new Set(), catSet = new Set(), typeSet = new Set();
        var source = hasFilters ? matched : scopedPages();
        source.forEach(function (p) {
            ensureArray(p.tags)
                .map(function (t) { return String(t).trim(); })
                .filter(function (t) { return t !== ''; })
                .forEach(function (t) { tagSet.add(t); });
            ensureArray(p.categories).map(norm).filter(Boolean).forEach(function (c) { catSet.add(c); });
            typeSet.add(norm(p.type));
        });
        var tagArr = [], catArr = [], typeArr = [];
        tagSet.forEach(function (t) { tagArr.push(t); }); tagArr.sort();
        catSet.forEach(function (c) { catArr.push(c); }); catArr.sort();
        typeSet.forEach(function (t) { typeArr.push(t); }); typeArr.sort();
        renderFacet(tagArr, tagsEl, selectedTags, "#");
        renderFacet(catArr, catsEl, selectedCategories, "[", "]");
        renderFacet(typeArr, typesEl, selectedTypes, "<", ">");
        if (!hasFilters) { previewEl.innerHTML = ""; return; }
        var isShowAll = q === '/*';
        previewEl.innerHTML = matched.slice(0, 8).map(function (p) {
            var matchScore = isShowAll ? 0 : score(p, q);
            var percentage = isShowAll ? '-' : Math.min(100, Math.round((matchScore / 200) * 100)) + '%';
            return '<li style="display:flex;align-items:baseline;gap:8px;">' +
                '<a href="' + p.permalink + '" title="' + p.title + '" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.title + '</a>' +
                '<span style="font-size:0.7em;color:#666;flex-shrink:0;">[' + p.type + ']</span>' +
                '<span style="font-size:0.7em;color:#666;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:120px;">' + p.permalink + '</span>' +
                '<span style="font-size:0.75em;color:#666;flex-shrink:0;">' + percentage + '</span></li>';
        }).join("");
    }

    function openResultPage() {
        var q = input.value.trim();
        if (!q && selectedTags.size === 0 && selectedCategories.size === 0 && selectedTypes.size === 0) return;
        var searchScope = getSearchScope();
        var scopeParam = "";
        if (searchScope.type === "section") scopeParam = "&section=" + encodeURIComponent(currentSection);
        else if (searchScope.type === "section_type") scopeParam = "&section=" + encodeURIComponent(currentSection) + "&pageType=" + encodeURIComponent(searchScope.pageType);
        else if (searchScope.type === "path") scopeParam = "&path=" + encodeURIComponent(currentPath);
        var tagsArr = [], catsArr = [], typesArr = [];
        selectedTags.forEach(function (t) { tagsArr.push(t); });
        selectedCategories.forEach(function (c) { catsArr.push(c); });
        selectedTypes.forEach(function (t) { typesArr.push(t); });
        window.location.href = "/searchlist/?q=" + encodeURIComponent(q || '/*') +
            "&scope=" + scope + "&type=" + searchScope.type + scopeParam +
            "&tags=" + encodeURIComponent(tagsArr.join(",")) +
            "&categories=" + encodeURIComponent(catsArr.join(",")) +
            "&types=" + encodeURIComponent(typesArr.join(","));
    }

    scopeBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var targetScope = btn.dataset.scope || "global";

            if (targetScope === 'nav3d' && isTouchDevice) {
                return;
            }

            scopeBtns.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            scope = targetScope;
            selectedTags.clear();
            selectedCategories.clear();
            selectedTypes.clear();

            if (scope === 'nav3d') {
                if (searchPanel) searchPanel.style.display = 'none';
                if (nav3dPanel) nav3dPanel.style.display = 'block';

                var navDataEl = document.getElementById('nav3d-data');
                if (navDataEl) {
                    try {
                        var raw = navDataEl.textContent.trim();
                        if (raw.startsWith('"') && raw.endsWith('"')) {
                            raw = raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                        }
                        var navData = JSON.parse(raw);
                        countEl.textContent = String(navData.length);
                    } catch (e) {
                        countEl.textContent = '-';
                    }
                } else {
                    countEl.textContent = '-';
                }

                if (hasNav3d) {
                    setTimeout(function () {
                        var oldScript = document.querySelector('script[src*="nav3d-float"]');
                        if (oldScript) oldScript.remove();

                        window._nav3dInited = false;

                        if (!window._nav3dInited) {
                            window._nav3dInited = true;
                            if (!document.querySelector('script[type="importmap"]')) {
                                var im = document.createElement('script');
                                im.type = 'importmap';
                                im.textContent = '{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/"}}';
                                document.head.appendChild(im);
                            }
                            var s = document.createElement('script');
                            s.type = 'module';
                            s.src = '/js/nav3d-float.js?v=' + Date.now();
                            document.body.appendChild(s);
                        }
                    }, 200);
                }
            } else {
                if (searchPanel) searchPanel.style.display = 'block';
                if (nav3dPanel) nav3dPanel.style.display = 'none';
                refresh();
            }
        });
    });

    if (isTouchDevice) {
        var nav3dBtn = document.getElementById('scope-btn-nav3d');
        if (nav3dBtn) {
            nav3dBtn.style.display = 'none';
        }
    }

    input.addEventListener("input", refresh);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") openResultPage(); });
    openBtn.addEventListener("click", openResultPage);


    var saved = JSON.parse(localStorage.getItem("global-index-pos") || "null");
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
        root.style.left = saved.x + "px"; root.style.top = saved.y + "px"; root.style.right = "auto"; root.style.bottom = "auto";
    } else {
        root.style.left = "auto";
        root.style.right = "0";
        root.style.top = "0";
        root.style.bottom = "auto";
    }
    if (localStorage.getItem("global-index-collapse") === "1") root.classList.add("closed");

    var isDown = false, ox = 0, oy = 0, lastTap = 0, sx = 0, sy = 0;

    function clamp(l, t) {
        return { left: Math.min(Math.max(0, l), Math.max(0, window.innerWidth - root.offsetWidth)), top: Math.min(Math.max(0, t), Math.max(0, window.innerHeight - root.offsetHeight)) };
    }
    function apply(l, t) { var c = clamp(l, t); root.style.left = c.left + "px"; root.style.top = c.top + "px"; root.style.right = "auto"; root.style.bottom = "auto"; }
    function savePos() { var x = parseFloat(root.style.left), y = parseFloat(root.style.top); if (!isNaN(x) && !isNaN(y)) localStorage.setItem("global-index-pos", JSON.stringify({ x: x, y: y })); }
    function toggle() { root.classList.toggle("closed"); localStorage.setItem("global-index-collapse", root.classList.contains("closed") ? "1" : "0"); setTimeout(function () { var x = parseFloat(root.style.left), y = parseFloat(root.style.top); if (!isNaN(x) && !isNaN(y)) apply(x, y); }, 50); }
    function getClientPos(e) { if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY }; return { x: e.clientX, y: e.clientY }; }
    function onStart(e) { e.preventDefault(); isDown = true; var p = getClientPos(e); sx = p.x; sy = p.y; ox = p.x - root.offsetLeft; oy = p.y - root.offsetTop; }
    function onMove(e) { if (!isDown) return; var p = getClientPos(e); apply(p.x - ox, p.y - oy); }
    function onEnd(e) { if (!isDown) return; isDown = false; savePos(); var p = e.changedTouches ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY } : { x: e.clientX, y: e.clientY }; var d = Math.hypot(p.x - sx, p.y - sy); var n = Date.now(); if (d < 10 && n - lastTap < 300) toggle(); lastTap = n; }

    header.addEventListener("mousedown", onStart);
    header.addEventListener("touchstart", onStart, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);

    window.addEventListener("pageshow", function () {
        var x = parseFloat(root.style.left), y = parseFloat(root.style.top);
        if (!isNaN(x) && !isNaN(y)) apply(x, y);
        else { var sa = JSON.parse(localStorage.getItem("global-index-pos") || "null"); if (sa && typeof sa.x === 'number') apply(sa.x, sa.y); }
    });

    refresh();
})();