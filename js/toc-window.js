// js/toc-window.js
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
    
    // 保存初始高度
    let initialHeight = null;
    let initialBodyHeight = null;
    
    // 优化窗口高度，确保不超过视口
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
    
    // 拖动功能
    let isDragging = false;
    let startMouseX = 0, startMouseY = 0;
    let startWindowLeft = 0, startWindowTop = 0;
    let clickCount = 0;
    let clickTimer = null;
    
    if (tocHeader) {
      tocHeader.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    
    function onMouseDown(e) {
      // 记录鼠标按下时的位置
      startMouseX = e.clientX;
      startMouseY = e.clientY;
      
      // 获取当前窗口的位置
      const rect = tocWindow.getBoundingClientRect();
      startWindowLeft = rect.left;
      startWindowTop = rect.top;
      
      isDragging = true;
      tocWindow.style.cursor = 'grabbing';
      e.preventDefault();
    }
    
    function onMouseMove(e) {
      if (!isDragging) return;
      
      // 计算鼠标移动的距离
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;
      
      // 计算新位置 = 起始窗口位置 + 鼠标移动距离
      let newLeft = startWindowLeft + deltaX;
      let newTop = startWindowTop + deltaY;
      
      // 边界限制
      newLeft = Math.max(10, Math.min(window.innerWidth - tocWindow.offsetWidth - 10, newLeft));
      newTop = Math.max(60, Math.min(window.innerHeight - tocWindow.offsetHeight - 20, newTop));
      
      tocWindow.style.left = newLeft + 'px';
      tocWindow.style.top = newTop + 'px';
      tocWindow.style.right = 'auto';
    }
    
    function onMouseUp(e) {
      if (!isDragging) {
        return;
      }
      
      isDragging = false;
      tocWindow.style.cursor = '';
      
      // 计算总移动距离
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;
      const moved = Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5;
      
      if (!moved) {
        // 没有移动，判断是否是双击
        clickCount++;
        
        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
            clickTimer = null;
          }, 250);
        } else if (clickCount === 2) {
          clearTimeout(clickTimer);
          toggleCollapse();
          clickCount = 0;
          clickTimer = null;
        }
      } else {
        // 有移动，保存位置
        savePosition();
        clickCount = 0;
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
      }
    }
    
    function savePosition() {
      const left = tocWindow.style.left;
      const top = tocWindow.style.top;
      if (left && top && left !== 'auto' && top !== 'auto') {
        localStorage.setItem('tocPosition', JSON.stringify({ left, top }));
      }
    }
    
    function loadPosition() {
      const saved = localStorage.getItem('tocPosition');
      if (saved) {
        try {
          const pos = JSON.parse(saved);
          if (pos.left && pos.top) {
            tocWindow.style.left = pos.left;
            tocWindow.style.top = pos.top;
            tocWindow.style.right = 'auto';
          }
        } catch(e) {
          console.warn('Failed to load TOC position:', e);
        }
      }
    }
    
    const wasCollapsed = localStorage.getItem('tocCollapsed') === 'true';
    if (wasCollapsed && tocWindow) {
      tocWindow.classList.add('collapsed');
    }
    
    adjustTocHeight();
    loadPosition();
    
    window.addEventListener('resize', resetAndAdjustHeight);
    window.addEventListener('beforeunload', savePosition);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTocWindow);
  } else {
    initTocWindow();
  }
})();