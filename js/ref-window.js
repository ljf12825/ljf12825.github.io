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
  }

  if (localStorage.getItem("ref-collapse") === "1") {
    win.classList.add("closed");
  }

  function start(x, y) {
    isDown = true;
    startX = x;
    startY = y;
    ox = x - win.offsetLeft;
    oy = y - win.offsetTop;
  }

  function move(x, y) {
    if (!isDown) return;
    win.style.left = (x - ox) + "px";
    win.style.top  = (y - oy) + "px";
    win.style.right = "auto";
    win.style.bottom = "auto";
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
})();
