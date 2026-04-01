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
  let startX = 0, startY = 0;

  const pos = JSON.parse(localStorage.getItem("ref-pos"));
  if (pos) {
    win.style.left = pos.x + "px";
    win.style.top  = pos.y + "px";
    win.style.right = "auto";
    win.style.bottom = "auto";
  } else {
    win.style.top = "auto";
    win.style.right = "auto";
    win.style.left = "20px";
    win.style.bottom = "20px";
  }

  if (localStorage.getItem("ref-collapse") === "1") {
    win.classList.add("closed");
  }

  requestAnimationFrame(() => {
    applyPosition(win.offsetLeft, win.offsetTop);
  });

  function start(x, y) {
    isDown = true;
    startX = x;
    startY = y;
    ox = x - win.offsetLeft;
    oy = y - win.offsetTop;
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

  function move(x, y) {
    if (!isDown) return;
    applyPosition(x - ox, y - oy);
  }

  function end(x, y) {
    if (!isDown) return;
    isDown = false;

    localStorage.setItem("ref-pos", JSON.stringify({
      x: win.offsetLeft,
      y: win.offsetTop
    }));

    const dist = Math.hypot(x - startX, y - startY);
    const now = Date.now();

    if (dist < 6 && now - lastTap < 300) toggle();
    lastTap = now;
  }

  function toggle() {
    win.classList.toggle("closed");
    localStorage.setItem("ref-collapse",
      win.classList.contains("closed") ? "1" : "0"
    );
    
    setTimeout(() => {
      applyPosition(win.offsetLeft, win.offsetTop);
    }, 0);
  }

  header.addEventListener("mousedown", e => {
    e.preventDefault();
    start(e.clientX, e.clientY);
  });

  document.addEventListener("mousemove", e => move(e.clientX, e.clientY));
  document.addEventListener("mouseup", e => end(e.clientX, e.clientY));

  header.addEventListener("touchstart", e => {
    const t = e.touches[0];
    start(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchmove", e => {
    if (!isDown) return;
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    end(t.clientX, t.clientY);
  });

  window.addEventListener("resize", () => {
    applyPosition(win.offsetLeft, win.offsetTop);
  });
})();