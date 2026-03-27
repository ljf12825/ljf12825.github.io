// js/scrollspy.js
(function() {
  'use strict';

  function initScrollSpy() {
    // 获取所有标题
    const headings = Array.from(document.querySelectorAll(
      ".single_article h1, .single_article h2, .single_article h3, .single_article h4, .single_article h5, .single_article h6"
    )).filter(h => h.id); // 只保留有 id 的标题

    // 获取 TOC 容器和链接
    const tocContainer = document.querySelector(".toc .toc-body");
    const tocLinks = tocContainer ? Array.from(tocContainer.querySelectorAll("a")) : [];

    if (!headings.length || !tocLinks.length) {
      console.log('ScrollSpy: No headings or TOC links found');
      return;
    }

    console.log(`ScrollSpy: Found ${headings.length} headings and ${tocLinks.length} TOC links`);

    let manualActive = false;
    let ticking = false;

    // 点击 TOC 链接滚动到标题
    tocLinks.forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();

        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);

        if (!target) return;

        manualActive = true;

        // 计算滚动位置
        const offset = 110;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: targetPosition - offset,
          behavior: "smooth"
        });

        // 立即高亮当前点击的链接
        setActiveLink(this);

        // 500ms 后恢复自动高亮
        setTimeout(() => {
          manualActive = false;
        }, 800);
      });
    });

    // 设置激活的链接
    function setActiveLink(activeLink) {
      if (!activeLink) return;
      
      // 移除所有 active 类
      tocLinks.forEach(link => {
        link.classList.remove("active");
      });
      
      // 添加 active 类
      activeLink.classList.add("active");
      
      // 自动滚动 TOC 容器，确保激活的链接可见
      if (tocContainer && activeLink) {
        const linkElement = activeLink;
        const containerRect = tocContainer.getBoundingClientRect();
        const linkRect = linkElement.getBoundingClientRect();
        
        // 计算链接相对于容器的位置
        const relativeTop = linkRect.top - containerRect.top + tocContainer.scrollTop;
        const containerHeight = tocContainer.clientHeight;
        const linkHeight = linkElement.offsetHeight;
        
        // 如果链接在容器可见区域上方
        if (relativeTop < tocContainer.scrollTop) {
          tocContainer.scrollTo({
            top: relativeTop - 10,
            behavior: "smooth"
          });
        } 
        // 如果链接在容器可见区域下方
        else if (relativeTop + linkHeight > tocContainer.scrollTop + containerHeight) {
          tocContainer.scrollTo({
            top: relativeTop + linkHeight - containerHeight + 10,
            behavior: "smooth"
          });
        }
      }
    }

    // 根据当前滚动位置找到当前激活的标题
    function getCurrentHeading() {
      let currentHeading = null;
      let minDistance = Infinity;
      
      // 获取视口顶部位置（考虑偏移）
      const viewportTop = window.pageYOffset + 120; // 120px 偏移，让高亮更准确
      
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const headingTop = heading.getBoundingClientRect().top + window.pageYOffset;
        const headingBottom = headingTop + heading.offsetHeight;
        
        // 如果标题顶部在视口顶部之上，且底部在视口顶部之下
        if (headingTop <= viewportTop && headingBottom >= viewportTop) {
          return heading;
        }
        
        // 计算距离视口顶部的距离
        const distance = Math.abs(headingTop - viewportTop);
        if (distance < minDistance && headingTop <= viewportTop + 200) {
          minDistance = distance;
          currentHeading = heading;
        }
      }
      
      // 如果没有找到，返回第一个在视口上方的标题
      if (!currentHeading) {
        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          const headingTop = heading.getBoundingClientRect().top + window.pageYOffset;
          if (headingTop <= viewportTop) {
            return heading;
          }
        }
      }
      
      return currentHeading || headings[0];
    }

    // 滚动事件处理
    function onScroll() {
      if (manualActive) return;
      
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentHeading = getCurrentHeading();
          if (currentHeading && currentHeading.id) {
            // 找到对应的 TOC 链接
            const activeLink = tocContainer.querySelector(`a[href="#${currentHeading.id}"]`);
            if (activeLink && !activeLink.classList.contains('active')) {
              setActiveLink(activeLink);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    // 监听滚动事件
    window.addEventListener('scroll', onScroll);
    
    // 页面加载完成后，立即激活当前标题
    setTimeout(() => {
      const currentHeading = getCurrentHeading();
      if (currentHeading && currentHeading.id) {
        const activeLink = tocContainer.querySelector(`a[href="#${currentHeading.id}"]`);
        if (activeLink) {
          setActiveLink(activeLink);
        }
      }
    }, 100);
    
    // 监听窗口大小改变，重新计算
    window.addEventListener('resize', () => {
      setTimeout(() => {
        const currentHeading = getCurrentHeading();
        if (currentHeading && currentHeading.id) {
          const activeLink = tocContainer.querySelector(`a[href="#${currentHeading.id}"]`);
          if (activeLink) {
            setActiveLink(activeLink);
          }
        }
      }, 100);
    });
    
    console.log('ScrollSpy: Initialized successfully');
  }

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollSpy);
  } else {
    initScrollSpy();
  }
})();
