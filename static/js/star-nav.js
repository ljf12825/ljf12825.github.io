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
  let sx = 0, sy = 0;

  const pos = JSON.parse(localStorage.getItem("star-pos") || "null");
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

  function toggle() {
    nav.classList.toggle("collapse");
    localStorage.setItem("star-collapse",
      nav.classList.contains("collapse") ? "1" : "0"
    );
    setTimeout(() => applyPosition(nav.offsetLeft, nav.offsetTop), 0);
  }

  const getClientPos = (e) => {
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const onStart = (e) => {
    e.preventDefault();
    isDown = true;
    const pos = getClientPos(e);
    sx = pos.x;
    sy = pos.y;
    ox = pos.x - nav.offsetLeft;
    oy = pos.y - nav.offsetTop;
  };

  const onMove = (e) => {
    if (!isDown) return;
    const pos = getClientPos(e);
    applyPosition(pos.x - ox, pos.y - oy);
  };

  const onEnd = (e) => {
    if (!isDown) return;
    isDown = false;
    localStorage.setItem("star-pos", JSON.stringify({
      x: nav.offsetLeft,
      y: nav.offsetTop
    }));
    const pos = e.changedTouches
      ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
      : { x: e.clientX, y: e.clientY };
    const d = Math.hypot(pos.x - sx, pos.y - sy);
    const n = Date.now();
    if (d < 10 && n - lastTap < 300) toggle();
    lastTap = n;
  };

  header.addEventListener("mousedown", onStart);
  header.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);

  window.addEventListener("resize", () => {
    applyPosition(nav.offsetLeft, nav.offsetTop);
  });
})();