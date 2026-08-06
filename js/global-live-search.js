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
      padding: 8px 16px;
    `;
    document.body.appendChild(resultHolder);
  }

  function updateResultOffset() {
    const rect = searchBarContainer.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(searchBarContainer);
    const isFixedOrSticky = computedStyle.position === 'fixed' || computedStyle.position === 'sticky';
    if (isFixedOrSticky) {
      resultHolder.style.marginTop = rect.bottom + 'px';
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

  function parseQueryInput(rawQuery) {
    let q = rawQuery.trim();

    if (q === 'all::') {
      return { targetSection: null, conditionStr: 'all::' };
    }

    if (q.startsWith('all::')) {
      q = q.slice(5).trim();
      return { targetSection: null, conditionStr: q };
    }

    if (q === 'lab::') {
      return { targetSection: 'lab', conditionStr: '' };
    }

    if (q.startsWith('lab::')) {
      q = q.slice(5).trim();
      return { targetSection: 'lab', conditionStr: q };
    }

    return { targetSection: '', conditionStr: q };
  }

  function evaluateCondition(pageText, conditionStr) {
    if (!conditionStr) return { match: true, highlightTokens: [] };

    const tokensToHighlight = new Set();
    const orGroups = conditionStr.split('||');
    let overallMatch = false;

    for (let orGroup of orGroups) {
      if (!orGroup.trim()) continue;

      const rawAndTokens = orGroup.split('&&').map(t => t.trim()).filter(Boolean);
      const andTokens = [];

      for (let rawToken of rawAndTokens) {
        if (rawToken.startsWith('!')) {
          andTokens.push(rawToken);
        } else {
          const words = rawToken.split(/\s+/).filter(Boolean);
          andTokens.push(...words);
        }
      }

      if (andTokens.length === 0) continue;

      let groupMatched = true;
      const groupHighlights = [];

      for (let token of andTokens) {
        let isNot = false;
        let word = token;

        if (word.startsWith('!')) {
          isNot = true;
          word = word.slice(1).trim();
        }

        if (!word) continue;

        const lowerWord = norm(word);
        const hasWord = pageText.includes(lowerWord);

        if (isNot) {
          if (hasWord) {
            groupMatched = false;
            break;
          }
        } else {
          if (!hasWord) {
            groupMatched = false;
            break;
          } else {
            groupHighlights.push(word);
          }
        }
      }

      if (groupMatched) {
        overallMatch = true;
        groupHighlights.forEach(w => tokensToHighlight.add(w));
      }
    }

    return {
      match: overallMatch,
      highlightTokens: Array.from(tokensToHighlight)
    };
  }

  function highlightText(text, tokens) {
    if (!text || !tokens || tokens.length === 0) return text || '-';

    const validTokens = tokens
      .filter(t => t && t.trim().length > 0)
      .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (validTokens.length === 0) return text;

    const pattern = new RegExp(`(${validTokens.join('|')})`, 'gi');
    return String(text).replace(pattern, '<mark style="background-color: #ffff00; color: #000000; padding: 0 2px;">$1</mark>');
  }

  function getTimestamp(val) {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    const str = String(val).trim().replace(/-/g, '/');
    const ts = new Date(str).getTime();
    return isNaN(ts) ? 0 : ts;
  }

  function renderLiveSearch() {
    const rawQuery = inputEl.value;
    const bodyChildren = Array.from(document.body.children);

    if (!rawQuery.trim()) {
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

    const { targetSection, conditionStr } = parseQueryInput(rawQuery);
    
    const isShowAll = (conditionStr === 'all::') || (targetSection !== null && !conditionStr);

    const matchedResults = [];

    for (let p of pages) {
      if (targetSection !== null && norm(p.section) !== targetSection) {
        continue;
      }

      if (isShowAll) {
        matchedResults.push({ page: p, highlights: [] });
        continue;
      }

      const pageText = [
        norm(p.title),
        norm(p.summary),
        norm(p.content),
        norm(p.permalink),
        norm(p.section),
        ...ensureArray(p.tags).map(norm),
        ...ensureArray(p.categories).map(norm)
      ].join(' ');

      const { match, highlightTokens } = evaluateCondition(pageText, conditionStr);

      if (match) {
        matchedResults.push({ page: p, highlights: highlightTokens });
      }
    }

    matchedResults.sort((a, b) => {
      const pageA = a.page || {};
      const pageB = b.page || {};

      const timeA = getTimestamp(pageA.lastmod || pageA.modify || pageA.updated || pageA.date);
      const timeB = getTimestamp(pageB.lastmod || pageB.modify || pageB.updated || pageB.date);

      return timeB - timeA;
    });

    let listHTML = '';
    for (let i = 0; i < matchedResults.length; i++) {
      const { page: p, highlights } = matchedResults[i];
      const tagsArr = ensureArray(p.tags);
      const tagsStr = tagsArr.length > 0 ? tagsArr.map(t => `#${t}`).join(' ') : '-';

      const hTitle = highlightText(p.title, highlights);
      const hSummary = highlightText(p.summary, highlights);
      const hTags = highlightText(tagsStr, highlights);

      const sectionTag = norm(p.section) === 'lab' ? `<span style="color: #666;">{lab}</span>` : '';

      listHTML += `
        <div style="margin-bottom: 6px; white-space: normal; line-height: 1.4; border-bottom: 1px dashed #eee; padding-bottom: 4px;">
          <a href="${p.permalink}" style="color: #0000ee; text-decoration: underline; font-weight: bold;">${hTitle}</a>
          ${sectionTag}
          ${p.author || '-'}
          ${p.date || '-'}
          ${p.lastmod || p.modify || '-'}
          ${hSummary}
          <span style="color: #008000;">${hTags}</span>
        </div>
      `;
    }

    resultHolder.innerHTML = matchedResults.length > 0 ? listHTML : '<div>No results found</div>';
    resultHolder.style.display = 'block';
  }

  inputEl.addEventListener('input', renderLiveSearch);

  if (inputEl.form) {
    inputEl.form.addEventListener('submit', e => e.preventDefault());
  }
})();
