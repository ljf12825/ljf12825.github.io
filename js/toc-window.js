(function() {
  'use strict';
  
  function initTocWindow() {
    var tocWindow = document.getElementById('toc-window');
    if (!tocWindow) {
      console.log('TOC Window: Element not found');
      return;
    }
    
    var tocHeader = document.getElementById('toc-header');
    var tocBody = document.getElementById('toc-body');
    
    console.log('TOC Window: Initialized');
    
    var isDragging = false;
    var ox = 0, oy = 0;
    var startX = 0, startY = 0;
    var lastTap = 0;
    
    var initialHeight = null;
    var initialBodyHeight = null;
    
    function adjustTocHeight() {
      if (!tocWindow || tocWindow.classList.contains('collapsed')) return;
      
      var windowHeight = window.innerHeight;
      var headerHeight = tocHeader ? tocHeader.offsetHeight : 0;
      var topPosition = parseInt(tocWindow.style.top) || 120;
      
      var maxHeight = windowHeight - topPosition - 40;
      var newHeight = Math.min(maxHeight, windowHeight * 0.7);
      
      if (newHeight > 100) {
        if (!initialHeight) {
          tocWindow.style.maxHeight = newHeight + 'px';
          if (tocBody) {
            tocBody.style.maxHeight = (newHeight - headerHeight - 16) + 'px';
          }
          initialHeight = newHeight;
          initialBodyHeight = newHeight - headerHeight - 16;
        } else {
          tocWindow.style.maxHeight = initialHeight + 'px';
          if (tocBody) {
            tocBody.style.maxHeight = initialBodyHeight + 'px';
          }
        }
      }
    }

    function applyHashesToLevels() {
      if (!tocBody) return;

      var convertLevelsToHashes = function(container, depth) {
        var children = container.children;
        for (var i = 0; i < children.length; i++) {
          var li = children[i];
          if (li.tagName.toLowerCase() === 'li') {
            var link = li.querySelector(':scope > a');
            if (link) {
              var hashes = '#'.repeat(depth) + ' ';
              if (!link.hasAttribute('data-has-hash')) {
                link.textContent = hashes + link.textContent;
                link.setAttribute('data-has-hash', 'true');
              }
            }
            var subUl = li.querySelector(':scope > ul');
            if (subUl) {
              convertLevelsToHashes(subUl, depth + 1);
            }
          } else if (li.tagName.toLowerCase() === 'ul') {
            convertLevelsToHashes(li, depth);
          }
        }
      };

      var rootUl = tocBody.querySelector('ul');
      if (rootUl) {
        convertLevelsToHashes(rootUl, 1);
      }
    }
    
    function resetAndAdjustHeight() {
      initialHeight = null;
      initialBodyHeight = null;
      adjustTocHeight();
    }
    
    function toggleCollapse() {
      tocWindow.classList.toggle('collapsed');
      
      var isCollapsed = tocWindow.classList.contains('collapsed');
      localStorage.setItem('tocCollapsed', isCollapsed);
      
      if (!isCollapsed) {
        setTimeout(adjustTocHeight, 100);
      }
    }
    
    function clampToViewport(left, top) {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var elementWidth = tocWindow.offsetWidth;
      var elementHeight = tocWindow.offsetHeight;
      
      var maxLeft = Math.max(0, windowWidth - elementWidth);
      var maxTop = Math.max(0, windowHeight - elementHeight);
      
      return {
        left: Math.min(Math.max(left, 0), maxLeft),
        top: Math.min(Math.max(top, 0), maxTop)
      };
    }
    
    function applyPosition(left, top) {
      var clamped = clampToViewport(left, top);
      tocWindow.style.left = clamped.left + 'px';
      tocWindow.style.top = clamped.top + 'px';
      tocWindow.style.right = 'auto';
      tocWindow.style.bottom = 'auto';
    }

    function savePos() {
      var x = parseFloat(tocWindow.style.left);
      var y = parseFloat(tocWindow.style.top);
      if (!isNaN(x) && !isNaN(y)) {
        localStorage.setItem("toc-pos", JSON.stringify({ x: x, y: y }));
      }
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
      var newLeft = x - ox;
      var newTop = y - oy;
      applyPosition(newLeft, newTop);
    }
    
    function end(x, y) {
      if (!isDragging) return;
      isDragging = false;
      tocWindow.style.cursor = '';
      tocWindow.style.transition = '';
      
      savePos();
      
      var dist = Math.hypot(x - startX, y - startY);
      var now = Date.now();
      
      if (dist < 6 && now - lastTap < 300) {
        toggleCollapse();
      }
      lastTap = now;
    }
    
    function loadPosition() {
      var saved = localStorage.getItem('toc-pos');
      if (saved) {
        try {
          var pos = JSON.parse(saved);
          if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            applyPosition(pos.x, pos.y);
            return;
          }
        } catch(e) {}
      }
      applyDefaultPosition();
    }

    function applyDefaultPosition() {
      tocWindow.style.left = 'auto';
      tocWindow.style.top = '100px';
      tocWindow.style.right = '0px';
      tocWindow.style.bottom = 'auto';
    }
    
    if (tocHeader) {
      tocHeader.addEventListener('mousedown', function(e) {
        e.preventDefault();
        start(e.clientX, e.clientY);
      });
    }
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
      move(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', function(e) {
      if (!isDragging) return;
      end(e.clientX, e.clientY);
    });
    
    if (tocHeader) {
      tocHeader.addEventListener('touchstart', function(e) {
        var t = e.touches[0];
        start(t.clientX, t.clientY);
      }, { passive: false });
    }
    
    document.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
      var t = e.touches[0];
      move(t.clientX, t.clientY);
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      var t = e.changedTouches[0];
      end(t.clientX, t.clientY);
    });
    
    var wasCollapsed = localStorage.getItem('tocCollapsed') === 'true';
    if (wasCollapsed && tocWindow) {
      tocWindow.classList.add('collapsed');
    }
    
    // 初始化时执行转换与高度调整
    applyHashesToLevels();
    adjustTocHeight();
    loadPosition();
    
    window.addEventListener('resize', function() {
      resetAndAdjustHeight();
      var currentLeft = parseFloat(tocWindow.style.left);
      var currentTop = parseFloat(tocWindow.style.top);
      if (!isNaN(currentLeft) && !isNaN(currentTop)) {
        applyPosition(currentLeft, currentTop);
        savePos();
      }
    });

    window.addEventListener("pageshow", function() {
      applyHashesToLevels();
      var x = parseFloat(tocWindow.style.left);
      var y = parseFloat(tocWindow.style.top);
      if (!isNaN(x) && !isNaN(y)) {
        applyPosition(x, y);
      } else {
        var saved = JSON.parse(localStorage.getItem("toc-pos") || "null");
        if (saved && typeof saved.x === 'number') {
          applyPosition(saved.x, saved.y);
        }
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTocWindow);
  } else {
    initTocWindow();
  }
})();