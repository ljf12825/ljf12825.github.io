document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="http"]').forEach(a => {
    a.setAttribute('target', '_blank');
  });

  const el = document.getElementById("typed-line");
  if (!el) return;

  const user = "ljf12825";
  const host = "ljf12825.github.io";
  const path = virtualPath();

  const cmd = "ls | xargs cat";
  const text = `${user}@${host}:${path}$ ${cmd}`;

  let i = 0;
  el.textContent = "";

  function virtualPath() {
    let p = window.location.pathname.replace(/\/$/, "");

    if (p === "" || p === "/") return "/";

    if (p === "/home") return "~";

    if (p.startsWith("/home/")) {
      return "~" + p.replace("/home", "");
    }

    return p;
  }

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i++);
      setTimeout(type, 40);
    } else {
      setTimeout(() => {
        const cursor = document.querySelector(".cursor");
        if (cursor) cursor.classList.add("hide");
      }, 5000);
    }
  }

  type();
});
