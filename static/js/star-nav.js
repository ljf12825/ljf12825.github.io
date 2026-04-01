(function waitStarNav() {
  const nav = document.getElementById("star-nav");
  const header = document.getElementById("star-header");

  if (!nav || !header) {
    setTimeout(waitStarNav, 50);
    return;
  }

  let isDown = false;
  let ox = 0, oy = 0;
  let lastTap = 0;
  let startX = 0, startY = 0;

  const pos = JSON.parse(localStorage.getItem("star-pos"));
  if (pos) {
    nav.style.left = pos.x + "px";
    nav.style.top  = pos.y + "px";
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  }

  if (localStorage.getItem("star-collapse") === "1") {
    nav.classList.add("collapse");
  }

  function clampToViewport(left, top) {
    const navWidth = nav.offsetWidth;
    const navHeight = nav.offsetHeight;
    const maxLeft = Math.max(0, window.innerWidth - navWidth);
    const maxTop = Math.max(0, window.innerHeight - navHeight);

    return {
      left: Math.min(Math.max(left, 0), maxLeft),
      top: Math.min(Math.max(top, 0), maxTop)
    };
  }

  function applyPosition(left, top) {
    const clamped = clampToViewport(left, top);
    nav.style.left = clamped.left + "px";
    nav.style.top = clamped.top + "px";
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  }

  function start(x, y) {
    isDown = true;
    startX = x;
    startY = y;
    ox = x - nav.offsetLeft;
    oy = y - nav.offsetTop;
  }

  function move(x, y) {
    if (!isDown) return;
    applyPosition(x - ox, y - oy);
  }

  function end() {
    if (!isDown) return;
    isDown = false;
    localStorage.setItem("star-pos", JSON.stringify({
      x: nav.offsetLeft,
      y: nav.offsetTop
    }));
  }

  header.addEventListener("mousedown", e => {
    e.preventDefault();
    start(e.clientX, e.clientY);
  });
  document.addEventListener("mousemove", e => move(e.clientX, e.clientY));
  document.addEventListener("mouseup", end);

  header.addEventListener("touchstart", e => {
    const t = e.touches[0];
    start(t.clientX, t.clientY);

    const now = Date.now();
    if (now - lastTap < 300) toggle();
    lastTap = now;
  }, { passive: true });

  document.addEventListener("touchmove", e => {
    if (!isDown) return;
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchend", end);

  function toggle() {
    nav.classList.toggle("collapse");
    localStorage.setItem("star-collapse",
      nav.classList.contains("collapse") ? "1" : "0"
    );
  }

  header.addEventListener("dblclick", toggle);

  window.addEventListener("resize", () => {
    applyPosition(nav.offsetLeft, nav.offsetTop);
  });

  console.log("★ star-nav mobile ready");
})();