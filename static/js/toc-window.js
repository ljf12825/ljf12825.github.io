(function() {
  'use strict';
  
  function initTocWindow() {
    const tocWindow = document.getElementById('toc-window');
    if (!tocWindow) {
      console.log('TOC Window: Element not found');
      return;
    }
    
    const tocHeader = document.getElementById('toc-header');
    const tocBody = document.getElementById('toc-body');
    
    console.log('TOC Window: Initialized');
    
    let isDragging = false;
    let ox = 0, oy = 0;
    let startX = 0, startY = 0;
    let lastTap = 0;
    
    let initialHeight = null;
    let initialBodyHeight = null;
    
    function adjustTocHeight() {
      if (!tocWindow || tocWindow.classList.contains('collapsed')) return;
      
      const windowHeight = window.innerHeight;
      const headerHeight = tocHeader ? tocHeader.offsetHeight : 0;
      const topPosition = parseInt(tocWindow.style.top) || 120;
      
      const maxHeight = windowHeight - topPosition - 40;
      const newHeight = Math.min(maxHeight, windowHeight * 0.7);
      
      if (newHeight > 100) {
        if (!initialHeight) {
          tocWindow.style.maxHeight = `${newHeight}px`;
          if (tocBody) {
            tocBody.style.maxHeight = `${newHeight - headerHeight - 16}px`;
          }
          initialHeight = newHeight;
          initialBodyHeight = newHeight - headerHeight - 16;
        } else {
          tocWindow.style.maxHeight = `${initialHeight}px`;
          if (tocBody) {
            tocBody.style.maxHeight = `${initialBodyHeight}px`;
          }
        }
      }
    }
    
    function resetAndAdjustHeight() {
      initialHeight = null;
      initialBodyHeight = null;
      adjustTocHeight();
    }
    
    function toggleCollapse() {
      tocWindow.classList.toggle('collapsed');
      
      const isCollapsed = tocWindow.classList.contains('collapsed');
      localStorage.setItem('tocCollapsed', isCollapsed);
      
      if (!isCollapsed) {
        setTimeout(adjustTocHeight, 100);
      }
    }
    
    function clampToViewport(left, top) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const elementWidth = tocWindow.offsetWidth;
      const elementHeight = tocWindow.offsetHeight;
      
      const maxLeft = Math.max(0, windowWidth - elementWidth);
      const maxTop = Math.max(0, windowHeight - elementHeight);
      
      return {
        left: Math.min(Math.max(left, 0), maxLeft),
        top: Math.min(Math.max(top, 0), maxTop)
      };
    }
    
    function applyPosition(left, top) {
      const clamped = clampToViewport(left, top);
      tocWindow.style.left = clamped.left + 'px';
      tocWindow.style.top = clamped.top + 'px';
      tocWindow.style.right = 'auto';
      tocWindow.style.bottom = 'auto';
    }
    
    function start(x, y) {
      isDragging = true;
      startX = x;
      startY = y;
      ox = x - tocWindow.offsetLeft;
      oy = y - tocWindow.offsetTop;
      tocWindow.style.cursor = 'grabbing';
      tocWindow.style.transition = 'none';
    }
    
    function move(x, y) {
      if (!isDragging) return;
      const newLeft = x - ox;
      const newTop = y - oy;
      applyPosition(newLeft, newTop);
    }
    
    function end(x, y) {
      if (!isDragging) return;
      isDragging = false;
      tocWindow.style.cursor = '';
      tocWindow.style.transition = '';
      
      localStorage.setItem("toc-pos", JSON.stringify({
        x: tocWindow.offsetLeft,
        y: tocWindow.offsetTop
      }));
      
      const dist = Math.hypot(x - startX, y - startY);
      const now = Date.now();
      
      if (dist < 6 && now - lastTap < 300) {
        toggleCollapse();
      }
      lastTap = now;
    }
    
    function loadPosition() {
      const saved = localStorage.getItem('toc-pos');
      if (saved) {
        try {
          const pos = JSON.parse(saved);
          applyPosition(pos.x, pos.y);
        } catch(e) {
          console.warn('Failed to load TOC position:', e);
          applyPosition(20, 120);
        }
      } else {
        applyPosition(20, 120);
      }
    }
    
    if (tocHeader) {
      tocHeader.addEventListener('mousedown', (e) => {
        e.preventDefault();
        start(e.clientX, e.clientY);
      });
    }
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      move(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      end(e.clientX, e.clientY);
    });
    
    if (tocHeader) {
      tocHeader.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        start(t.clientX, t.clientY);
      }, { passive: false });
    }
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const t = e.touches[0];
      move(t.clientX, t.clientY);
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const t = e.changedTouches[0];
      end(t.clientX, t.clientY);
    });
    
    const wasCollapsed = localStorage.getItem('tocCollapsed') === 'true';
    if (wasCollapsed && tocWindow) {
      tocWindow.classList.add('collapsed');
    }
    
    adjustTocHeight();
    loadPosition();
    
    window.addEventListener('resize', () => {
      resetAndAdjustHeight();
      const currentLeft = parseFloat(tocWindow.style.left);
      const currentTop = parseFloat(tocWindow.style.top);
      if (!isNaN(currentLeft) && !isNaN(currentTop)) {
        applyPosition(currentLeft, currentTop);
        localStorage.setItem("toc-pos", JSON.stringify({
          x: tocWindow.offsetLeft,
          y: tocWindow.offsetTop
        }));
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTocWindow);
  } else {
    initTocWindow();
  }
})();