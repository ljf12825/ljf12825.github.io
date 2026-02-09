(function waitStarNav() {
  const nav = document.getElementById("star-nav");
  const header = document.getElementById("star-header");

  if (!nav || !header) {
    setTimeout(waitStarNav, 50);
    return;
  }

  const pos = JSON.parse(localStorage.getItem("star-pos"));
  if (pos) {
    nav.style.left = pos.x + "px";
    nav.style.top  = pos.y + "px";
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  }

  const collapsed = localStorage.getItem("star-collapsed");
  if (collapsed === "1") {
    nav.classList.add("collapse");
  }

  let isDown = false, ox = 0, oy = 0;

  header.addEventListener("mousedown", e => {
    isDown = true;
    ox = e.clientX - nav.offsetLeft;
    oy = e.clientY - nav.offsetTop;
  });

  document.addEventListener("mousemove", e => {
    if (!isDown) return;
    nav.style.left = e.clientX - ox + "px";
    nav.style.top  = e.clientY - oy + "px";
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false;

    localStorage.setItem("star-pos", JSON.stringify({
      x: nav.offsetLeft,
      y: nav.offsetTop
    }));
  });

  header.addEventListener("dblclick", () => {
    nav.classList.toggle("collapse");

    localStorage.setItem(
      "star-collapsed",
      nav.classList.contains("collapse") ? "1" : "0"
    );
  });

})();
