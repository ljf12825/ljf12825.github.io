document.addEventListener("DOMContentLoaded", () => {
  const pre = document.getElementById("alive");
  if (!pre) return;

  let asciiLines = [];
  let frame = 0;
  let animationId = null;

  async function loadAscii(path) {
    const res = await fetch(path);
    const text = await res.text();
    return text.split("\n");
  }

  function renderFrame() {
    if (frame >= asciiLines.length) {
      animationId = null;
      return;
    }
    pre.textContent += asciiLines[frame] + "\n";
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

  let resizeTimeout = null;
  window.addEventListener("resize", () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateAscii, 100);
  });

  updateAscii();
});
