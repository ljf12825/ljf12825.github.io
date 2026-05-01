(function waitRefWindow() {
  const win = document.getElementById("ref-window");
  const header = win?.querySelector(".float-header");

  if (!win || !header) {
    setTimeout(waitRefWindow, 50);
    return;
  }

  let isDown = false;
  let ox = 0, oy = 0;
  let lastTap = 0;
  let sx = 0, sy = 0;

  const pos = JSON.parse(localStorage.getItem("ref-pos") || "null");
  if (pos) {
    win.style.left = pos.x + "px";
    win.style.top  = pos.y + "px";
    win.style.right = "auto";
    win.style.bottom = "auto";
  } else {
    win.style.top = "100px";
    win.style.right = "auto";
    win.style.left = "0px";
    win.style.bottom = "auto";
  }

  if (localStorage.getItem("ref-collapse") === "1") {
    win.classList.add("closed");
  }

  function clampToViewport(left, top) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elementWidth = win.offsetWidth;
    const elementHeight = win.offsetHeight;
    const maxLeft = Math.max(0, windowWidth - elementWidth);
    const maxTop = Math.max(0, windowHeight - elementHeight);
    return {
      left: Math.min(Math.max(left, 0), maxLeft),
      top: Math.min(Math.max(top, 0), maxTop)
    };
  }

  function applyPosition(left, top) {
    const clamped = clampToViewport(left, top);
    win.style.left = clamped.left + "px";
    win.style.top = clamped.top + "px";
    win.style.right = "auto";
    win.style.bottom = "auto";
  }

  function toggle() {
    win.classList.toggle("closed");
    localStorage.setItem("ref-collapse",
      win.classList.contains("closed") ? "1" : "0"
    );
    setTimeout(() => applyPosition(win.offsetLeft, win.offsetTop), 0);
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
    ox = pos.x - win.offsetLeft;
    oy = pos.y - win.offsetTop;
  };

  const onMove = (e) => {
    if (!isDown) return;
    const pos = getClientPos(e);
    applyPosition(pos.x - ox, pos.y - oy);
  };

  const onEnd = (e) => {
    if (!isDown) return;
    isDown = false;
    localStorage.setItem("ref-pos", JSON.stringify({
      x: win.offsetLeft,
      y: win.offsetTop
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
    applyPosition(win.offsetLeft, win.offsetTop);
  });
})();