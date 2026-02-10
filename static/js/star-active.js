
document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.replace(/\/$/, "") || "/";
  const items = document.querySelectorAll("#star-nav .nav-item");

  let bestMatch = null;
  let bestLen = 0;

  items.forEach(el => {
    const path = (el.dataset.path || "").replace(/\/$/, "") || "/";
    if (current === path || (path !== "/" && current.startsWith(path))) {
      if (path.length > bestLen) {
        bestMatch = el;
        bestLen = path.length;
      }
    }
  });

  if (bestMatch) {
    const parent = bestMatch.parentNode;
    const nodes = Array.from(parent.childNodes);

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === bestMatch && i < nodes.length - 1) {
        const next = nodes[i + 1];

        // 如果后一个节点是文本，并且以空格开头，就吃掉一个空格
        if (next.nodeType === 3) {
          next.textContent = next.textContent.replace(/^ /, "");
        }
        break;
      }
    }

    bestMatch.textContent += "*";
    bestMatch.classList.add("active");
  }
});
