(function() {
  'use strict';
  
  const DEFAULT_POSITIONS = {
    'toc-window':    { left: 'auto', top: '100px', right: '0', bottom: 'auto' },
    'star-nav':      { left: 'auto', top: 'auto', right: '0', bottom: '0' },
    'great-indexer': { left: 'auto', top: '0', right: '0', bottom: 'auto' }
  };

  const SINGLE_POSITIONS = {
    'toc-window':    { left: 'auto', top: '100px', right: '0', bottom: 'auto' },
    'star-nav':      { left: 'auto', top: 'auto', right: '0', bottom: '0' },
    'great-indexer': { left: 'auto', top: '0', right: '0', bottom: 'auto' }
  };

  const STORAGE_KEYS = {
    'toc-window':    'toc-pos',
    'star-nav':      'star-pos',
    'great-indexer': 'global-index-pos'
  };

  const COLLAPSE_KEYS = {
    'great-indexer': 'global-index-collapse',
    'star-nav':      'star-collapse',
    'toc-window':    'tocCollapsed'
  };

  function applyPosition(el, pos) {
    if (!el) return;
    el.style.left = pos.left;
    el.style.top = pos.top;
    el.style.right = pos.right;
    el.style.bottom = pos.bottom;
  }

  function closeAllPanels() {
    var indexer = document.getElementById('great-indexer');
    var star = document.getElementById('star-nav');
    var toc = document.getElementById('toc-window');
    
    if (indexer) indexer.classList.add('closed');
    if (star) star.classList.add('collapse');
    if (toc) toc.classList.add('collapsed');
  }

  function clearAllMemory() {
    Object.values(STORAGE_KEYS).forEach(function(key) {
      localStorage.removeItem(key);
    });
    Object.values(COLLAPSE_KEYS).forEach(function(key) {
      localStorage.removeItem(key);
    });
  }

  function resetAllToDefault() {
    var isSingle = document.querySelector('.single_article') !== null;
    var positions = isSingle ? SINGLE_POSITIONS : DEFAULT_POSITIONS;

    Object.keys(positions).forEach(function(id) {
      var el = document.getElementById(id);
      applyPosition(el, positions[id]);
    });
    
    closeAllPanels();
    clearAllMemory();
  }

  var resizeTimer;
  var lastWidth = window.innerWidth;

  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      var currentWidth = window.innerWidth;
      if (currentWidth < lastWidth) {
        resetAllToDefault();
      }
      lastWidth = currentWidth;
    }, 300);
  });

})();