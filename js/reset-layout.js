(function() {
  'use strict';
  
  const DEFAULT_POSITIONS = {
    'toc-window':    { left: 'auto', top: '100px', right: '0', bottom: 'auto' },
    'star-nav':      { left: 'auto', top: 'auto', right: '0', bottom: '0' },
    'great-indexer': { left: '0', top: 'auto', right: 'auto', bottom: '0' },
    'ref-window':    { left: '0', top: '100px', right: 'auto', bottom: 'auto' }
  };

  const SINGLE_POSITIONS = {
    'toc-window':    { left: 'auto', top: '100px', right: '0', bottom: 'auto' },
    'star-nav':      { left: 'auto', top: 'auto', right: '0', bottom: '0' },
    'great-indexer': { left: '0', top: 'auto', right: 'auto', bottom: '0' },
    'ref-window':    { left: '0', top: '100px', right: 'auto', bottom: 'auto' }
  };

  const STORAGE_KEYS = {
    'toc-window':    'toc-pos',
    'star-nav':      'star-pos',
    'great-indexer': 'global-index-pos',
    'ref-window':    'ref-pos'
  };

  function applyPosition(el, pos) {
    if (!el) return;
    el.style.left = pos.left;
    el.style.top = pos.top;
    el.style.right = pos.right;
    el.style.bottom = pos.bottom;
  }

  function resetAllToDefault() {
    const isSingle = document.querySelector('.single_article') !== null;
    const positions = isSingle ? SINGLE_POSITIONS : DEFAULT_POSITIONS;

    Object.keys(STORAGE_KEYS).forEach(id => {
      localStorage.removeItem(STORAGE_KEYS[id]);
    });

    Object.entries(positions).forEach(([id, pos]) => {
      const el = document.getElementById(id);
      applyPosition(el, pos);
    });

    localStorage.removeItem('global-index-collapse');
    localStorage.removeItem('ref-collapse');
    localStorage.removeItem('star-collapse');
    localStorage.removeItem('tocCollapsed');
    
    const indexer = document.getElementById('great-indexer');
    const ref = document.getElementById('ref-window');
    const star = document.getElementById('star-nav');
    const toc = document.getElementById('toc-window');
    
    if (indexer) indexer.classList.remove('closed');
    if (ref) ref.classList.remove('closed');
    if (star) star.classList.remove('collapse');
    if (toc) toc.classList.remove('collapsed');
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resetAllToDefault, 300);
  });
})();