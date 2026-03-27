(function() {
  'use strict';

  function initScrollSpy() {
    const headings = Array.from(document.querySelectorAll(
      ".single_article h1, .single_article h2, .single_article h3, .single_article h4, .single_article h5, .single_article h6"
    )).filter(h => h.id);

    const tocContainer = document.querySelector(".toc .toc-body");
    const tocLinks = tocContainer ? Array.from(tocContainer.querySelectorAll("a")) : [];

    if (!headings.length || !tocLinks.length) {
      console.log('ScrollSpy: No headings or TOC links found');
      return;
    }

    console.log(`ScrollSpy: Found ${headings.length} headings and ${tocLinks.length} TOC links`);

    let manualActive = false;
    let scrollTimeout = null;
    let currentActiveLink = null;

    tocLinks.forEach(link => {
      link.addEventListener("click", function(e) {
        e.preventDefault();

        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);

        if (!target) return;

        manualActive = true;

        const offset = 110;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: targetPosition - offset,
          behavior: "smooth"
        });

        setActiveLink(this);

        setTimeout(() => {
          manualActive = false;
        }, 800);
      });
    });

    function setActiveLink(activeLink) {
      if (!activeLink || currentActiveLink === activeLink) return;
      
      currentActiveLink = activeLink;
      
      tocLinks.forEach(link => {
        link.classList.remove("active");
      });
      
      activeLink.classList.add("active");
      
      if (tocContainer && activeLink) {
        const linkTop = activeLink.offsetTop;
        const containerHeight = tocContainer.clientHeight;
        const linkHeight = activeLink.offsetHeight;
        
        const targetScrollTop = linkTop - (containerHeight / 2) + (linkHeight / 2);
        
        const maxScrollTop = tocContainer.scrollHeight - containerHeight;
        const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
        
        tocContainer.scrollTo({
          top: finalScrollTop,
          behavior: "smooth"
        });
      }
    }

    function getCurrentHeading() {
      let currentHeading = null;
      let bestScore = -Infinity;
      
      const viewportCenter = window.pageYOffset + window.innerHeight / 2;
      
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const headingTop = heading.getBoundingClientRect().top + window.pageYOffset;
        const headingBottom = headingTop + heading.offsetHeight;
        
        let score = 0;
        
        if (headingTop < window.pageYOffset + window.innerHeight && headingBottom > window.pageYOffset) {
          const distanceToTop = Math.abs(headingTop - (window.pageYOffset + 120));
          score = 1000 - distanceToTop;
          
          const headingCenter = (headingTop + headingBottom) / 2;
          const distanceToCenter = Math.abs(headingCenter - viewportCenter);
          score = Math.max(score, 500 - distanceToCenter);
        }
        
        if (headingBottom < window.pageYOffset + 100) {
          const distanceAbove = (window.pageYOffset + 100) - headingBottom;
          score = 200 - distanceAbove;
        }
        
        if (score > bestScore) {
          bestScore = score;
          currentHeading = heading;
        }
      }
      
      if (!currentHeading) {
        for (let i = 0; i < headings.length; i++) {
          const heading = headings[i];
          const headingTop = heading.getBoundingClientRect().top + window.pageYOffset;
          if (headingTop > window.pageYOffset + 50) {
            return headings[i - 1] || headings[0];
          }
        }
        return headings[0];
      }
      
      return currentHeading;
    }

    function onScroll() {
      if (manualActive) return;
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const currentHeading = getCurrentHeading();
        if (currentHeading && currentHeading.id) {
          const activeLink = tocContainer.querySelector(`a[href="#${currentHeading.id}"]`);
          if (activeLink && activeLink !== currentActiveLink) {
            setActiveLink(activeLink);
          }
        }
        scrollTimeout = null;
      }, 50);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    setTimeout(() => {
      const currentHeading = getCurrentHeading();
      if (currentHeading && currentHeading.id) {
        const activeLink = tocContainer.querySelector(`a[href="#${currentHeading.id}"]`);
        if (activeLink) {
          setActiveLink(activeLink);
        }
      }
    }, 100);
    
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollSpy);
  } else {
    initScrollSpy();
  }
})();