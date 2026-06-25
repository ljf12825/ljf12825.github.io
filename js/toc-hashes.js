document.addEventListener('DOMContentLoaded', function() {
  const tocBody = document.getElementById('toc-body');
  if (!tocBody) return;

  const tocLinks = tocBody.querySelectorAll('a');
  
  tocLinks.forEach(link => {
    let depth = 0;
    let parent = link.parentElement;
    
    // 向上递归查找 <ul> 层级计算嵌套深度
    while (parent && parent !== tocBody) {
      if (parent.tagName === 'UL') {
        depth++;
      }
      parent = parent.parentElement;
    }
    
    // 注入对应数量的 # 号
    if (depth > 0) {
      const hashes = '#'.repeat(depth) + ' ';
      link.innerText = hashes + link.innerText;
    }
  });
});
