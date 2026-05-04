(function waitRefWindow() {
  var win = document.getElementById("ref-window");
  var header = win ? win.querySelector(".float-header") : null;

  if (!win || !header) {
    setTimeout(waitRefWindow, 50);
    return;
  }

  var isDown = false;
  var ox = 0, oy = 0;
  var lastTap = 0;
  var sx = 0, sy = 0;

  var pos = JSON.parse(localStorage.getItem("ref-pos") || "null");
  if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
    win.style.left = pos.x + "px";
    win.style.top = pos.y + "px";
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
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var elementWidth = win.offsetWidth;
    var elementHeight = win.offsetHeight;
    var maxLeft = Math.max(0, windowWidth - elementWidth);
    var maxTop = Math.max(0, windowHeight - elementHeight);
    return {
      left: Math.min(Math.max(left, 0), maxLeft),
      top: Math.min(Math.max(top, 0), maxTop)
    };
  }

  function applyPosition(left, top) {
    var clamped = clampToViewport(left, top);
    win.style.left = clamped.left + "px";
    win.style.top = clamped.top + "px";
    win.style.right = "auto";
    win.style.bottom = "auto";
  }

  function savePos() {
    var x = parseFloat(win.style.left);
    var y = parseFloat(win.style.top);
    if (!isNaN(x) && !isNaN(y)) {
      localStorage.setItem("ref-pos", JSON.stringify({ x: x, y: y }));
    }
  }

  function toggle() {
    win.classList.toggle("closed");
    localStorage.setItem("ref-collapse", win.classList.contains("closed") ? "1" : "0");
    setTimeout(function() {
      var x = parseFloat(win.style.left);
      var y = parseFloat(win.style.top);
      if (!isNaN(x) && !isNaN(y)) applyPosition(x, y);
    }, 50);
  }

  function getClientPos(e) {
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function onStart(e) {
    e.preventDefault();
    isDown = true;
    var pos = getClientPos(e);
    sx = pos.x;
    sy = pos.y;
    ox = pos.x - win.offsetLeft;
    oy = pos.y - win.offsetTop;
  }

  function onMove(e) {
    if (!isDown) return;
    var pos = getClientPos(e);
    applyPosition(pos.x - ox, pos.y - oy);
  }

  function onEnd(e) {
    if (!isDown) return;
    isDown = false;
    savePos();
    var pos = e.changedTouches
      ? { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
      : { x: e.clientX, y: e.clientY };
    var d = Math.hypot(pos.x - sx, pos.y - sy);
    var n = Date.now();
    if (d < 10 && n - lastTap < 300) toggle();
    lastTap = n;
  }

  header.addEventListener("mousedown", onStart);
  header.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);

  // resize 时保持在视口内
  window.addEventListener("resize", function() {
    var x = parseFloat(win.style.left);
    var y = parseFloat(win.style.top);
    if (!isNaN(x) && !isNaN(y)) applyPosition(x, y);
  });

  // 解决前进后退聚集问题
  window.addEventListener("pageshow", function() {
    var x = parseFloat(win.style.left);
    var y = parseFloat(win.style.top);
    if (!isNaN(x) && !isNaN(y)) {
      applyPosition(x, y);
    } else {
      var saved = JSON.parse(localStorage.getItem("ref-pos") || "null");
      if (saved && typeof saved.x === 'number') {
        applyPosition(saved.x, saved.y);
      }
    }
  });
})();