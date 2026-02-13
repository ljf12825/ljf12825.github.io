const input = document.getElementById("labSearch");
input.addEventListener("input", function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll(".lab-row:not(.lab-head)").forEach(row => {
    const t = row.dataset.title || "";
    const l = row.dataset.lang || "";
    const s = row.dataset.status || "";
    const tags = row.dataset.tags || "";
    const c = row.dataset.category || "";
    const summary = row.dataset.summary || "";
    const match = t.includes(q) || l.includes(q) || s.includes(q) || tags.includes(q) || summary.includes(q);
    row.style.display = match ? "" : "none";
  });
});