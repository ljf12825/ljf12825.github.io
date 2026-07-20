(function () {
  const inputEl = document.getElementById('globalIndexInput');
  const dataScript = document.getElementById('global-index-data');
  if (!inputEl || !dataScript) return;

  let pages = [];
  try {
    pages = JSON.parse(dataScript.textContent || '[]');
  } catch (e) {
    console.error('Failed to parse global-index-data:', e);
  }

  let searchBarContainer = inputEl;
  while (searchBarContainer.parentElement && searchBarContainer.parentElement !== document.body) {
    searchBarContainer = searchBarContainer.parentElement;
  }

  let resultHolder = document.getElementById('searchlist-live-result');
  if (!resultHolder) {
    resultHolder = document.createElement('div');
    resultHolder.id = 'searchlist-live-result';
    
    resultHolder.style.cssText = `
      display: none;
      width: 100% !important;
      box-sizing: border-box !important;
      word-break: break-all;
      white-space: normal;
      background: #ffffff;
    `;
    
    document.body.appendChild(resultHolder);
  }

  function updateResultOffset() {
    const rect = searchBarContainer.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(searchBarContainer);
    const isFixedOrSticky = computedStyle.position === 'fixed' || computedStyle.position === 'sticky';

    if (isFixedOrSticky) {
      const offsetTop = rect.bottom;
      resultHolder.style.marginTop = offsetTop + 'px';
    } else {
      resultHolder.style.marginTop = '0px';
    }
  }

  const ensureArray = arr => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr;
    if (typeof arr === 'string') return arr.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const norm = v => String(v || '').toLowerCase();

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

  const hit = (p, query, isShowAll) => {
    if (isShowAll) return true;
    const txt = `${norm(p.title)} ${norm(p.summary)} ${ensureArray(p.tags).map(norm).join(' ')} ${ensureArray(p.categories).map(norm).join(' ')}`;
    return txt.includes(query);
  };

  function renderLiveSearch() {
    const q = inputEl.value.trim().toLowerCase();
    const bodyChildren = Array.from(document.body.children);

    if (!q) {
      bodyChildren.forEach(child => {
        if (child !== resultHolder && child.dataset.searchHidden) {
          child.style.display = child.dataset.oldDisplay || '';
          delete child.dataset.searchHidden;
          delete child.dataset.oldDisplay;
        }
      });
      resultHolder.innerHTML = '';
      resultHolder.style.display = 'none';
      return;
    }

    updateResultOffset();

    bodyChildren.forEach(child => {
      if (child !== resultHolder && child !== searchBarContainer && !child.contains(inputEl)) {
        if (!child.dataset.searchHidden) {
          child.dataset.oldDisplay = child.style.display || '';
          child.dataset.searchHidden = 'true';
          child.style.setProperty('display', 'none', 'important');
        }
      }
    });

    const isShowAll = q === '/*';
    const matched = pages
      .filter(p => hit(p, q, isShowAll))
      .map(p => ({ page: p, score: isShowAll ? 0 : score(p, q) }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.page.modify || '') < (b.page.modify || '') ? 1 : -1;
      });

    const result = matched.map(m => m.page);

    let listHTML = '';
    for (let i = 0; i < result.length; i++) {
      const p = result[i];
      const tagsStr = ensureArray(p.tags).length > 0 ? ensureArray(p.tags).map(t => `#${t}`).join(' ') : '-';

      listHTML += `
        <div style="margin-bottom: 4px; white-space: normal; line-height: 1.4;">
          <a href="${p.permalink}" style="color: #0000ee; text-decoration: underline;">${p.title}</a>
          {${p.section || '/'}}
          ${p.author || '-'}
          ${p.date || '-'}
          ${p.modify || '-'}
          ${p.summary || '-'}
          ${tagsStr}
        </div>
      `;
    }

    resultHolder.innerHTML = result.length > 0 ? listHTML : '<div>No results found</div>';
    resultHolder.style.display = 'block';
  }

  inputEl.addEventListener('input', renderLiveSearch);

  if (inputEl.form) {
    inputEl.form.addEventListener('submit', e => e.preventDefault());
  }
})();
