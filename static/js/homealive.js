document.addEventListener("DOMContentLoaded", () => {
  const pre = document.getElementById("alive");
  if (!pre) return;

  async function loadAscii(path) {
    const res = await fetch(path);
    return res.text();
  }

  async function updatePreContent() {
    const path =
      window.innerWidth <= 1080
        ? "/ascii/alive-narrow.txt"
        : "/ascii/alive-wide.txt";

    const text = await loadAscii(path);
    const lines = text.split("\n");
    pre.textContent = "";

    for (let i = 0; i < lines.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          pre.textContent += lines[i] + "\n";
          resolve();
        }, 150);
      });
    }
  }

  updatePreContent();
  window.addEventListener("resize", updatePreContent);
});
