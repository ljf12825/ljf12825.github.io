document.addEventListener("DOMContentLoaded", () => {
  const normalizePath = (path) => (path || "").replace(/\/$/, "") || "/";
  const currentPath = normalizePath(location.pathname);
  const items = document.querySelectorAll("#star-nav .nav-item, #star-nav-inline .nav-item");
  
  let totalAllArticles = 0;
  items.forEach(el => {
    totalAllArticles += Number(el.dataset.articleCount || 0);
  });

  let maxSqrtInline = 0;
  let maxSqrtHover = 0;
  const processedDataMap = new Map();

  items.forEach(el => {
    const trendDataStr = el.dataset.trend;
    if (trendDataStr) {
      const rawData = trendDataStr.split(",").map(Number).reverse();
      const smoothedData = rawData.map((val, idx) => {
        const start = Math.max(0, idx - 1);
        const end = Math.min(rawData.length - 1, idx + 1);
        let sum = 0;
        for (let i = start; i <= end; i++) {
          sum += rawData[i];
        }
        return sum / (end - start + 1);
      });
      processedDataMap.set(el, smoothedData);
      
      const localMaxSqrt = Math.max(...smoothedData.map(v => Math.sqrt(v)));
      
      if (el.closest("#star-nav-inline")) {
        if (localMaxSqrt > maxSqrtInline) maxSqrtInline = localMaxSqrt;
      } else {
        if (localMaxSqrt > maxSqrtHover) maxSqrtHover = localMaxSqrt;
      }
    }
  });

  const scaleMaxSqrtInline = maxSqrtInline > 0 ? maxSqrtInline : 1;
  const scaleMaxSqrtHover = maxSqrtHover > 0 ? maxSqrtHover : 1;

  items.forEach(el => {
    const label = el.dataset.label || el.textContent.trim();
    const articleCount = Number(el.dataset.articleCount || 0);
    const totalCount = Number(el.dataset.totalCount || 0);
    const recentCount = Number(el.dataset.recentCount || 0);
    
    const share = totalCount > 0 ? articleCount / totalCount : 0;
    const bracketLevel = articleCount > 0 && share >= 0.05
      ? Math.min(5, Math.floor(share * 10 + 0.5))
      : 0;
    
    if (bracketLevel > 0) {
      el.textContent = `${"(".repeat(bracketLevel)}${label}${")".repeat(bracketLevel)}`;
    } else {
      el.textContent = label;
    }
    
    const sharePercent = totalCount > 0 ? Math.round(share * 100) : 0;
    const stat = el.closest(".nav-row")?.querySelector(".nav-stats");
    if (stat) {
      stat.textContent = `${articleCount}(${sharePercent}%) - ${recentCount} / 90d`;
    }
    
    el.classList.remove("activity-high", "activity-medium", "activity-low", "activity-idle");
    if (recentCount === 0) {
      el.classList.add("activity-idle");
    } else if (recentCount >= 5) {
      el.classList.add("activity-high");
    } else if (recentCount >= 2) {
      el.classList.add("activity-medium");
    } else {
      el.classList.add("activity-low");
    }

    const sparklineContainer = el.closest(".nav-row")?.querySelector(".nav-sparkline");
    const data = processedDataMap.get(el);
    
    if (data && sparklineContainer) {
      const isInlineNav = el.closest("#star-nav-inline") !== null;
      
      const width = isInlineNav ? 360 : 150; 
      const finalScaleMaxSqrt = isInlineNav ? scaleMaxSqrtInline : scaleMaxSqrtHover;
      
      const strokeWidth = isInlineNav ? 1.5 : 1.0;
      
      const height = 14; 
      const paddingX = 1;
      const paddingY = 1; 
      
      const points = data.map((val, index) => {
        const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
        const currentSqrt = Math.sqrt(val);
        const y = height - paddingY - (currentSqrt / finalScaleMaxSqrt) * (height - paddingY * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
      
      let strokeColor = "#000080";
      if (el.classList.contains("activity-high")) strokeColor = "#ff0000";
      else if (el.classList.contains("activity-medium")) strokeColor = "#ff00ff";
      else if (el.classList.contains("activity-low")) strokeColor = "#00ffff";
      else if (el.classList.contains("activity-idle")) strokeColor = "#0000ff";
      
      const hasAnyActivity = Math.max(...data) > 0;
      const lineOpacity = hasAnyActivity ? "1.0" : "0.2";
      
      sparklineContainer.innerHTML = `
        <svg width="${width}" height="${height}" style="display: block; overflow: visible;" shape-rendering="geometricPrecision">
          <path d="M ${paddingX},${height - paddingY} L ${points} L ${width - paddingX},${height - paddingY} Z" 
                fill="${strokeColor}" 
                opacity="${hasAnyActivity ? '0.04' : '0'}">
          </path>
          <polyline points="${points}" 
                    fill="none" 
                    stroke="${strokeColor}" 
                    stroke-width="${strokeWidth}" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    opacity="${lineOpacity}">
          </polyline>
        </svg>
      `;
    }
  });
  
  let bestMatch = null;
  let bestMatchLength = 0;
  
  items.forEach(el => {
    const path = normalizePath(el.dataset.path || "");
    const isMatch = currentPath === path || (path !== "/" && currentPath.startsWith(path));
    
    if (isMatch && path.length > bestMatchLength) {
      bestMatch = el;
      bestMatchLength = path.length;
    }
  });
  
  if (bestMatch) {
    bestMatch.classList.add("active");
    if (!bestMatch.textContent.includes("*")) {
      bestMatch.textContent += "*";
    }
  }
});