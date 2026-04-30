(function () {
  const holder = document.getElementById('searchlist-result');
  const dataScript = document.getElementById('global-index-data');
  if (!holder || !dataScript) return;
  const pages = JSON.parse(dataScript.textContent || '[]');
  const params = new URLSearchParams(location.search);
  const qRaw = params.get('q') || '';
  const q = decodeURIComponent(qRaw).toLowerCase().trim();
  const scope = (params.get('scope') || 'global').toLowerCase();
  const searchType = (params.get('type') || '').toLowerCase();
  const section = (params.get('section') || '').toLowerCase();
  const pageType = (params.get('pageType') || '').toLowerCase();
  const path = (params.get('path') || '').toLowerCase();
  const tags = new Set((params.get('tags') || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean));
  const cats = new Set((params.get('categories') || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean));
  const types = new Set((params.get('types') || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean));

  const ensureArray = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const norm = v => String(v || '').toLowerCase();

  const normalizePath = (p) => {
    if (!p) return "/";
    let normalized = p.toLowerCase().trim();
    if (!normalized.startsWith("/")) normalized = "/" + normalized;
    if (!normalized.endsWith("/")) normalized = normalized + "/";
    return normalized;
  };

  const score = (page, query) => {
    if (!query) return 0;
    const title = norm(page.title);
    const summary = norm(page.summary);
    const pageTags = ensureArray(page.tags).map(norm);
    const pageCats = ensureArray(page.categories).map(norm);
    let s = 0;
    if (title === query) s += 200;
    if (title.includes(query)) s += 120;
    if (pageTags.some(t => t === query)) s += 90;
    if (pageTags.some(t => t.includes(query))) s += 60;
    if (pageCats.some(c => c === query)) s += 80;
    if (pageCats.some(c => c.includes(query))) s += 55;
    if (summary.includes(query)) s += 30;
    return s;
  };

  const isCurrentScope = scope !== 'global';
  const isShowAll = q === '/*';

  const hit = p => {
    if (isCurrentScope) {
      if (searchType === 'section' && section) {
        if (norm(p.section) !== section) return false;
      }
      if (searchType === 'section_type') {
        if (section && norm(p.section) !== section) return false;
        if (pageType && norm(p.type) !== pageType) return false;
      }
      if (searchType === 'path' && path) {
        const normalizedPath = normalizePath(path);
        const pageParentPath = normalizePath(p.parentPath || "");
        if (pageParentPath !== normalizedPath) return false;
      }
    }

    const pTags = new Set(ensureArray(p.tags).map(norm));
    const pCats = new Set(ensureArray(p.categories).map(norm));
    for (const t of tags) if (!pTags.has(t)) return false;
    for (const c of cats) if (!pCats.has(c)) return false;
    if (types.size > 0 && !types.has(norm(p.type))) return false;

    if (isShowAll) return true;

    const txt = `${norm(p.title)} ${norm(p.summary)} ${ensureArray(p.tags).map(norm).join(' ')} ${ensureArray(p.categories).map(norm).join(' ')}`;
    if (q && !txt.includes(q)) return false;

    return true;
  };

  const matched = pages
    .filter(hit)
    .map(p => ({
      page: p,
      score: isShowAll ? 0 : score(p, q)
    }))
    .sort((a, b) => b.score - a.score);

  const result = matched.map(m => m.page);
  const scores = matched.map(m => m.score);

  const filterInfo = [];
  if (isShowAll) {
    filterInfo.push(`all pages`);
  } else if (q) {
    filterInfo.push(`query "${q}"`);
  }
  if (tags.size > 0) filterInfo.push(`tags: ${[...tags].join(', ')}`);
  if (cats.size > 0) filterInfo.push(`categories: ${[...cats].join(', ')}`);
  if (types.size > 0) filterInfo.push(`types: ${[...types].join(', ')}`);
  if (scope !== 'global') {
    if (searchType === 'section') filterInfo.push(`section: ${section}`);
    if (searchType === 'section_type') filterInfo.push(`section: ${section}, type: ${pageType}`);
    if (searchType === 'path') filterInfo.push(`path: ${path}`);
  }

  const summaryText = filterInfo.length > 0
    ? `${result.length} result${result.length !== 1 ? 's' : ''} for ${filterInfo.join(' | ')}`
    : `${result.length} total page${result.length !== 1 ? 's' : ''}`;

  const titleEl = document.getElementById('topnav-search-title');
  if (titleEl) {
    const resultSpan = titleEl.querySelector('span:last-child');
    if (resultSpan) {
      resultSpan.textContent = summaryText;
    }
  }

  const listHTML = result.length > 0
    ? `<div class="searchlist">
        <div class="search_row header">
          <span>Name</span>
          <span>Path</span>
          <span>Type</span>
          <span>Section</span>
          <span>Author</span>
          <span>Modified</span>
          <span>Tags</span>
          <span>Categories</span>
          <span>Score</span>
        </div>
        ${result.map((p, i) => {
      const matchScore = scores[i];
      const maxScore = 200;
      const percentage = isShowAll ? '-' : Math.min(100, Math.round((matchScore / maxScore) * 100)) + '%';

      return `
          <div class="search_row">
            <span class="search_name">
              <a href="${p.permalink}">${p.title}</a>
            </span>
            <span class="search_path">${p.permalink}</span>
            <span class="search_type">&lt;${(p.type || '').toLowerCase()}&gt;</span>
            <span class="search_section">{${p.section || '/'}}</span>
            <span class="search_author">${p.author || '-'}</span>
            <span class="search_date">${p.date || '-'}</span>
            <span class="search_tags">
              ${ensureArray(p.tags).length > 0
          ? ensureArray(p.tags).map(t => `<span class="tag">#${t}</span>`).join(' ')
          : '<span class="empty">-</span>'}
            </span>
            <span class="search_cats">
              ${ensureArray(p.categories).length > 0
          ? ensureArray(p.categories).map(c => `<span class="cat">[${c}]</span>`).join(' ')
          : '<span class="empty">-</span>'}
            </span>
            <span class="search_score">${percentage}</span>
          </div>
        `}).join('')}
      </div>`
    : '<p class="no-results">No results found</p>';

  holder.innerHTML = listHTML;
})();