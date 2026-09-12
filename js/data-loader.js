// 从 Hugo 渲染的 script 标签中加载数据
(function() {
  const dataScript = document.getElementById('global-index-data');
  if (!dataScript) return;
  
  try {
    window.__pagesData = JSON.parse(dataScript.textContent || '[]');
  } catch (e) {
    console.error('Failed to parse global-index-data:', e);
    window.__pagesData = [];
  }
})();
