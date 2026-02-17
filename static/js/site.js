document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typed-line");
  if (!el) return;

  const host = location.host;

  getIP().then(ip => start(ip));

  function start(user) {
    const { path, cmd } = resolve();
    type(`${user}@${host}:${path}$ ${cmd}`);
  }

  function resolve() {
  const raw = window.location.pathname.replace(/\/$/, "");
  const parts = raw.split("/").filter(Boolean);

  const kind = document.querySelector(
    "meta[name='page-kind']"
  )?.content;

  if (kind === "page" && parts.length > 0) {
    const file = parts.pop();
    const dir = "/" + parts.join("/");

    return {
      path: virtualPath(dir || "/"),
      cmd: `less ${file}`
    };
  }

  return {
    path: virtualPath("/" + parts.join("/")),
    cmd: "ls | xargs cat"
  };
}

  function virtualPath(p) {
    if (p === "/") return "/";
    if (p === "/home") return "~";
    if (p.startsWith("/home/")) return "~" + p.slice(5);
    return p;
  }

  function type(text) {
    let i = 0;
    el.textContent = "";
    (function t() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(t, 10);
      } else {
        setTimeout(() => {
          const c = document.querySelector(".cursor");
          if (c) c.classList.add("stop");
        }, 2500);
      }
    })();
  }

  async function getIP() {
  const cached = localStorage.getItem("client-ip");
  if (cached) return cached;

  const apis = [
    async () => (await fetch("https://ip.sb/jsonip")).json().then(d => d.ip),
    async () => (await fetch("https://api.ipify.org?format=json")).json().then(d => d.ip),
    async () => (await fetch("https://myip.ipip.net")).text()
      .then(t => t.match(/\d+\.\d+\.\d+\.\d+/)?.[0])
  ];

  for (const api of apis) {
    try {
      const ip = await api();
      if (ip) {
        localStorage.setItem("client-ip", ip);
        return ip;
      }
    } catch {}
  }

  return "guest";
}

});
