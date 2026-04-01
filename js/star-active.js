document.addEventListener("DOMContentLoaded", () => {
  const normalizePath = (path) => (path || "").replace(/\/$/, "") || "/";
  const currentPath = normalizePath(location.pathname);
  const items = document.querySelectorAll("#star-nav .nav-item");
  
  let totalAllArticles = 0;
  items.forEach(el => {
    totalAllArticles += Number(el.dataset.articleCount || 0);
  });
  
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
    const stat = el.parentElement?.querySelector(".nav-stats");
    if (stat) {
      stat.textContent = `${articleCount}(${sharePercent}%) ${recentCount}/3m`;
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