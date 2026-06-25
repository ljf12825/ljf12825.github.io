(function() {
  const inputEl = document.getElementById('globalIndexInput');
  const searchBtn = document.getElementById('globalSearchBtn');
  
  if (!inputEl) return;

  // 执行搜索的函数
  function performSearch() {
    const query = inputEl.value.trim();
    if (query) {
      if (!window.location.pathname.includes('/searchlist/')) {
        window.location.href = '/searchlist/?q=' + encodeURIComponent(query);
      } else {
        const params = new URLSearchParams(window.location.search);
        params.set('q', query);
        window.location.search = params.toString();
      }
    }
  }

  // 监听回车事件
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  // 监听按钮点击事件
  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      performSearch();
    });
  }

  // 从 URL 还原搜索词到输入框
  const params = new URLSearchParams(window.location.search);
  const qRaw = params.get('q') || '';
  if (qRaw) {
    inputEl.value = decodeURIComponent(qRaw);
  }
})();
