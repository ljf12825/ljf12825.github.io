(function () {
  const holder = document.getElementById('global-search-result');
  const dataScript = document.getElementById('global-index-data');
  if (!holder || !dataScript) return;
  const pages = JSON.parse(dataScript.textContent || '[]');
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').toLowerCase().trim();
  const scope = (params.get('scope') || 'global').toLowerCase();
  const section = (params.get('section') || '').toLowerCase();
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
  const hit = p => {
    if (scope === 'section' && section && norm(p.section) !== section) return false;
    const txt = `${norm(p.title)} ${norm(p.summary)} ${ensureArray(p.tags).map(norm).join(' ')} ${ensureArray(p.categories).map(norm).join(' ')}`;
    if (q && !txt.includes(q)) return false;
    const pTags = new Set(ensureArray(p.tags).map(norm));
    const pCats = new Set(ensureArray(p.categories).map(norm));
    for (const t of tags) if (!pTags.has(t)) return false;
    for (const c of cats) if (!pCats.has(c)) return false;
    return true;
  };
  const result = pages.filter(hit);
  holder.innerHTML = result.map(p => `<a href="${p.permalink}" class="log-card"><div class="log-content"><h2 class="log-title">${p.title}</h2><div class="log-meta"><span class="meta-line">${ensureArray(p.categories).map(c=>`[${c}]`).join(' ')} ${ensureArray(p.tags).map(t=>`#${t}`).join(' ')}</span></div><p class="log-summary">${p.summary||''}</p><span class="read-more">ReadMore</span></div></a>`).join('');
})();