(function () {
  // 自己读取数据，不依赖外部加载器
  const dataScript = document.getElementById('global-index-data');
  if (!dataScript) {
    console.error('global-index-data script not found');
    return;
  }
  
  let pages = [];
  try {
    pages = JSON.parse(dataScript.textContent || '[]');
  } catch (e) {
    console.error('Failed to parse global-index-data:', e);
    pages = [];
  }
  
  if (pages.length === 0) {
    console.warn('No pages data found');
  }
  
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
        const pagePermalink = normalizePath(p.permalink || "");
        if (pageParentPath !== normalizedPath && !pagePermalink.startsWith(normalizedPath)) {
          return false;
        }
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
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const dateA = a.page.modify || '';
      const dateB = b.page.modify || '';
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });

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

  // 更新顶部统计信息
  const titleEl = document.getElementById('topnav-search-title');
  if (titleEl) {
    titleEl.textContent = summaryText;
  }

  // 检查是否有结果渲染容器
  const holder = document.getElementById('searchlist-result');
  if (!holder) return;

  // 构建表格 - 固定占满宽度，标题可点击
  let rowsHTML = '';
  for (let i = 0; i < result.length; i++) {
    const p = result[i];
    const matchScore = scores[i];
    const maxScore = 200;
    const percentage = isShowAll ? '-' : Math.min(100, Math.round((matchScore / maxScore) * 100)) + '%';
    
    rowsHTML += `
      <tr>
        <td><a href="${p.permalink}" style="color: #0000ee; text-decoration: underline;">${p.title}</a></td>
        <td>{${p.section || '/'}}</td>
        <td>${p.author || '-'}</td>
        <td>${p.date || '-'}</td>
        <td>${p.modify || '-'}</td>
        <td style="word-break: break-word; white-space: normal;">${p.summary || '-'}</td>
        <td>${ensureArray(p.tags).length > 0 ? ensureArray(p.tags).map(t => `#${t}`).join(' ') : '-'}</td>
        <td>${percentage}</td>
      </tr>
    `;
  }

  const listHTML = result.length > 0
    ? `<table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 15%;">Name</th>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 10%;">Section</th>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 10%;">Author</th>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 10%;">Ctime</th>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 10%;">Mtime</th>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 20%;">Summary</th>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 15%;">Tags</th>
            <th style="text-align: left; border-bottom: 2px solid #000; padding: 4px 8px; width: 10%;">Match</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>`
    : '<p>No results found</p>';

  holder.innerHTML = listHTML;
})();
