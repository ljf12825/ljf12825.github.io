document.addEventListener("DOMContentLoaded", () => {
  const pre = document.getElementById("alive");
  if (!pre) return;

  let asciiLines = [];
  let frame = 0;
  let animationId = null;
  let originalContent = "";
  let hoverActive = false;

  async function loadAscii(path) {
    const res = await fetch(path);
    const text = await res.text();
    return text.split("\n");
  }

  async function loadDoc(path) {
    const res = await fetch(path);
    return res.text();
  }

  function renderFrame() {
    if (frame >= asciiLines.length) {
      animationId = null;
      return;
    }
    if (!hoverActive) {
      pre.textContent += asciiLines[frame] + "\n";
      originalContent = pre.textContent;
    }
    frame++;
    animationId = requestAnimationFrame(renderFrame);
  }

  async function updateAscii() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    const path =
      window.innerWidth <= 1080
        ? "/ascii/alive-narrow.txt"
        : "/ascii/alive-wide.txt";

    asciiLines = await loadAscii(path);
    pre.textContent = "";
    frame = 0;
    renderFrame();
  }

  const tips = document.querySelectorAll(".tip");
  tips.forEach(span => {
    span.addEventListener("mouseenter", async () => {
      hoverActive = true;
      const docPath = span.dataset.doc;
      if (docPath) {
        pre.textContent = "Loading…";
        try {
          const content = await loadDoc(docPath);
          if (hoverActive) pre.textContent = content;
        } catch (e) {
          pre.textContent = "Error!";
        }
      }
    });
    span.addEventListener("mouseleave", () => {
      hoverActive = false;
      pre.textContent = originalContent;
    });
  });

  let resizeTimeout = null;
  window.addEventListener("resize", () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateAscii, 100);
  });

  updateAscii();
});