(function waitStarNav() {
  var nav = document.getElementById("star-nav");
  var header = document.getElementById("star-header");

  if (!nav || !header) {
    setTimeout(waitStarNav, 50);
    return;
  }

  var isDown = false;
  var ox = 0, oy = 0;
  var lastTap = 0;
  var sx = 0, sy = 0;

  var pos = JSON.parse(localStorage.getItem("star-pos") || "null");
  if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
    nav.style.left = pos.x + "px";
    nav.style.top  = pos.y + "px";
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  } else {
    nav.style.right = "0";
    nav.style.bottom = "0";
    nav.style.left = "auto";
    nav.style.top = "auto";
  }

  if (localStorage.getItem("star-collapse") === "1") {
    nav.classList.add("collapse");
  }

  function clampToViewport(left, top) {
    var navWidth = nav.offsetWidth;
    var navHeight = nav.offsetHeight;
    var maxLeft = Math.max(0, window.innerWidth - navWidth);
    var maxTop = Math.max(0, window.innerHeight - navHeight);
    return {
      left: Math.min(Math.max(left, 0), maxLeft),
      top: Math.min(Math.max(top, 0), maxTop)
    };
  }

  function applyPosition(left, top) {
    var clamped = clampToViewport(left, top);
    nav.style.left = clamped.left + "px";
    nav.style.top = clamped.top + "px";
    nav.style.right = "auto";
    nav.style.bottom = "auto";
  }

  function savePos() {
    var x = parseFloat(nav.style.left);
    var y = parseFloat(nav.style.top);
    if (!isNaN(x) && !isNaN(y)) {
      localStorage.setItem("star-pos", JSON.stringify({ x: x, y: y }));
    }
  }

  function toggle() {
    nav.classList.toggle("collapse");
    localStorage.setItem("star-collapse",
      nav.classList.contains("collapse") ? "1" : "0"
    );
    setTimeout(function() {
      var x = parseFloat(nav.style.left);
      var y = parseFloat(nav.style.top);
      if (!isNaN(x) && !isNaN(y)) applyPosition(x, y);
    }, 50);
  }

  var getClientPos = function(e) {
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  var onStart = function(e) {
    e.preventDefault();
    isDown = true;
    var pos = getClientPos(e);
    sx = pos.x;
    sy = pos.y;
    ox = pos.x - nav.offsetLeft;
    oy = pos.y - nav.offsetTop;
  };

  var onMove = function(e) {
    if (!isDown) return;
    var pos = getClientPos(e);
    applyPosition(pos.x - ox, pos.y - oy);
  };

  var onEnd = function(e) {
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
  };

  header.addEventListener("mousedown", onStart);
  header.addEventListener("touchstart", onStart, { passive: false });
  document.addEventListener("mousemove", onMove);
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);

  window.addEventListener("resize", function() {
    var x = parseFloat(nav.style.left);
    var y = parseFloat(nav.style.top);
    if (!isNaN(x) && !isNaN(y)) {
      applyPosition(x, y);
    }
  });

  window.addEventListener("pageshow", function() {
    var x = parseFloat(nav.style.left);
    var y = parseFloat(nav.style.top);
    if (!isNaN(x) && !isNaN(y)) {
      applyPosition(x, y);
    } else {
      var saved = JSON.parse(localStorage.getItem("star-pos") || "null");
      if (saved && typeof saved.x === 'number') {
        applyPosition(saved.x, saved.y);
      }
    }
  });

  // 保存当前激活的 tab
  var savedTab = localStorage.getItem("star-tab") || "nav-panel";
  
  // Tab 切换逻辑
  var tabBtns = nav.querySelectorAll('.tab-btn');
  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // 防止触发拖动
      
      // 更新按钮状态
      tabBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      
      // 切换面板
      var targetId = btn.dataset.tab;
      nav.querySelectorAll('.tab-panel').forEach(function(panel) {
        panel.style.display = 'none';
        panel.classList.remove('active');
      });
      var targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
        targetPanel.classList.add('active');
      }
      
      // 保存当前 tab
      localStorage.setItem("star-tab", targetId);
    });
  });
  
  // 恢复上次的 tab
  var targetBtn = nav.querySelector('.tab-btn[data-tab="' + savedTab + '"]');
  if (targetBtn) {
    targetBtn.click();
  }

})();