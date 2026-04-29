(function () {
  const holder = document.getElementById('global-search-result');
  const dataScript = document.getElementById('global-index-data');
  if (!holder || !dataScript) return;
  const pages = JSON.parse(dataScript.textContent || '[]');
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').toLowerCase().trim();
  const scope = (params.get('scope') || 'global').toLowerCase();
  const searchType = (params.get('type') || '').toLowerCase();
  const section = (params.get('section') || '').toLowerCase();
  const pageType = (params.get('pageType') || '').toLowerCase();
  const path = (params.get('path') || '').toLowerCase();
  const tags = new Set((params.get('tags') || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean));
  const cats = new Set((params.get('categories') || '').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean));
  
  // Helper function to ensure value is an array
  const ensureArray = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };
  
  const norm = v => String(v || '').toLowerCase();
  
  // 标准化路径
  const normalizePath = (p) => {
    if (!p) return "/";
    let normalized = p.toLowerCase().trim();
    if (!normalized.startsWith("/")) normalized = "/" + normalized;
    if (!normalized.endsWith("/")) normalized = normalized + "/";
    return normalized;
  };
  
  // P1 修复：只要 scope 不是 global，就应用 current 过滤
  const isCurrentScope = scope !== 'global';
  
  const hit = p => {
    // 应用 current 范围的过滤
    if (isCurrentScope) {
      // 按 section 过滤
      if (searchType === 'section' && section) {
        if (norm(p.section) !== section) return false;
      }
      
      // 按 section + type 过滤（lab/log）
      if (searchType === 'section_type') {
        if (section && norm(p.section) !== section) return false;
        if (pageType && norm(p.type) !== pageType) return false;
      }
      
      // P2 & P3 修复：按 path 过滤，只显示直接子页面
      if (searchType === 'path' && path) {
        const normalizedPath = normalizePath(path);
        const pageParentPath = normalizePath(p.parentPath || "");
        
        // 只允许直接子页面，不进行任何回退
        if (pageParentPath !== normalizedPath) {
          return false;
        }
      }
    }
    
    // 文本搜索
    const txt = `${norm(p.title)} ${norm(p.summary)} ${ensureArray(p.tags).map(norm).join(' ')} ${ensureArray(p.categories).map(norm).join(' ')}`;
    if (q && !txt.includes(q)) return false;
    
    // 标签和分类过滤
    const pTags = new Set(ensureArray(p.tags).map(norm));
    const pCats = new Set(ensureArray(p.categories).map(norm));
    for (const t of tags) if (!pTags.has(t)) return false;
    for (const c of cats) if (!pCats.has(c)) return false;
    
    return true;
  };
  
  const result = pages.filter(hit);
  
  holder.innerHTML = result.length > 0 
    ? result.map(p => `
      <a href="${p.permalink}" class="log-card">
        <div class="log-content">
          <h2 class="log-title">${p.title}</h2>
          <div class="log-meta">
            <span class="meta-line">
              ${ensureArray(p.categories).map(c=>`[${c}]`).join(' ')} 
              ${ensureArray(p.tags).map(t=>`#${t}`).join(' ')}
            </span>
          </div>
          <p class="log-summary">${p.summary||''}</p>
          <span class="read-more">ReadMore</span>
        </div>
      </a>
    `).join('')
    : '<p class="no-results">No results found</p>';
})();