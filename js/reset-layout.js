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

  const COLLAPSE_KEYS = {
    'great-indexer': 'global-index-collapse',
    'ref-window': 'ref-collapse',
    'star-nav': 'star-collapse',
    'toc-window': 'tocCollapsed'
  };

  function applyPosition(el, pos) {
    if (!el) return;
    el.style.left = pos.left;
    el.style.top = pos.top;
    el.style.right = pos.right;
    el.style.bottom = pos.bottom;
  }

  function getCurrentPosition(el) {
    if (!el) return null;
    const style = window.getComputedStyle(el);
    return {
      left: style.left,
      top: style.top,
      right: style.right,
      bottom: style.bottom
    };
  }

  function closeAllPanels() {
    const indexer = document.getElementById('great-indexer');
    const ref = document.getElementById('ref-window');
    const star = document.getElementById('star-nav');
    const toc = document.getElementById('toc-window');
    
    if (indexer) indexer.classList.add('closed');
    if (ref) ref.classList.add('closed');
    if (star) star.classList.add('collapse');
    if (toc) toc.classList.add('collapsed');
  }

  function resetAllToDefault() {
    const isSingle = document.querySelector('.single_article') !== null;
    const positions = isSingle ? SINGLE_POSITIONS : DEFAULT_POSITIONS;

    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    Object.values(COLLAPSE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    Object.entries(positions).forEach(([id, pos]) => {
      const el = document.getElementById(id);
      applyPosition(el, pos);
    });
    
    closeAllPanels();
  }

  function saveLayoutToSession() {
    const layout = {};
    
    Object.entries(STORAGE_KEYS).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        const pos = getCurrentPosition(el);
        if (pos) layout[key] = pos;
      }
    });

    Object.entries(COLLAPSE_KEYS).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'star-nav') {
          layout[key] = el.classList.contains('collapse');
        } else if (id === 'toc-window') {
          layout[key] = el.classList.contains('collapsed');
        } else {
          layout[key] = el.classList.contains('closed');
        }
      }
    });

    sessionStorage.setItem('saved-layout', JSON.stringify(layout));
  }

  function restoreLayoutFromSession() {
    const saved = sessionStorage.getItem('saved-layout');
    if (!saved) return false;
    
    try {
      const layout = JSON.parse(saved);
      
      Object.entries(STORAGE_KEYS).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && layout[key]) {
          applyPosition(el, layout[key]);
          localStorage.setItem(key, JSON.stringify(layout[key]));
        }
      });

      Object.entries(COLLAPSE_KEYS).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && layout[key] !== undefined) {
          if (id === 'star-nav') {
            layout[key] ? el.classList.add('collapse') : el.classList.remove('collapse');
          } else if (id === 'toc-window') {
            layout[key] ? el.classList.add('collapsed') : el.classList.remove('collapsed');
          } else {
            layout[key] ? el.classList.add('closed') : el.classList.remove('closed');
          }
          localStorage.setItem(key, layout[key]);
        }
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  function isSinglePage() {
    return document.querySelector('.single_article') !== null;
  }

  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return;
    
    saveLayoutToSession();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resetAllToDefault();
      sessionStorage.removeItem('saved-layout');
    }, 300);
  });

  function init() {
    if (isSinglePage()) {
      resetAllToDefault();
    } else {
      const restored = restoreLayoutFromSession();
      if (restored) {
        sessionStorage.removeItem('saved-layout');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
