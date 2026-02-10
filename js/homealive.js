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

    pre.textContent = await loadAscii(path);
  }

  updatePreContent();
  window.addEventListener("resize", updatePreContent);
});
