document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typed-line");
  if (!el) return;

  const host = location.host;

  getIP().then(ip => start(ip));

  function start(user) {
    const { path, cmd, file } = resolve();
    const clickablePath = getClickablePath(path);
    typeWithHTML(`${user}@${host}:${clickablePath}$ ${cmd}`);
  }

  function getClickablePath(path) {
    if (path === "/") {
      return `<a href="/" class="path-link" data-path="/">/</a>`;
    }
    
    let realPath = path;
    let hasTilde = false;
    
    if (path.startsWith("~")) {
      hasTilde = true;
      realPath = "/home" + path.slice(1);
    }
    
    const segments = realPath.split("/").filter(Boolean);
    let clickablePath = "";
    let accumulatedPath = "";
    
    if (hasTilde) {
      clickablePath = `<a href="/home" class="path-link" data-path="/home">~</a>`;
      accumulatedPath = "/home";
      
      if (segments.length > 0) {
        const hasNonHome = segments.some((seg, idx) => !(idx === 0 && seg === "home"));
        if (hasNonHome) {
          clickablePath += "/";
        }
      }
    } else {
      clickablePath = "/";
    }
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      if (hasTilde && i === 0 && segment === "home") {
        continue;
      }
      
      accumulatedPath += "/" + segment;
      
      clickablePath += `<a href="${accumulatedPath}" class="path-link" data-path="${accumulatedPath}">${segment}</a>`;
      
      const isLast = (hasTilde && i === segments.length - 1) || (!hasTilde && i === segments.length - 1);
      if (!isLast) {
        clickablePath += "/";
      }
    }
    
    if (!hasTilde && segments.length === 0) {
      clickablePath = "/";
    }
    
    return clickablePath;
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
        cmd: `less ${file}`,
        file: file
      };
    }

    return {
      path: virtualPath("/" + parts.join("/")),
      cmd: "ls | xargs cat",
      file: null
    };
  }

  function virtualPath(p) {
    if (p === "/") return "/";
    if (p === "/home") return "~";
    if (p.startsWith("/home/")) return "~" + p.slice(5);
    return p;
  }

  function typeWithHTML(htmlString) {
    el.innerHTML = "";
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const nodes = Array.from(tempDiv.childNodes);
    
    let nodeIndex = 0;
    let charIndex = 0;
    let currentNode = nodes[nodeIndex];
    
    function typeNextChar() {
      if (!currentNode) {
        setTimeout(() => {
          const c = document.querySelector(".cursor");
          if (c) c.classList.add("stop");
          attachPathClickHandlers();
        }, 2500);
        return;
      }
      
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const text = currentNode.textContent;
        if (charIndex < text.length) {
          el.innerHTML += text[charIndex];
          charIndex++;
          setTimeout(typeNextChar, 10);
        } else {
          nodeIndex++;
          currentNode = nodes[nodeIndex];
          charIndex = 0;
          setTimeout(typeNextChar, 10);
        }
      } 
      else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const elementHtml = currentNode.outerHTML;
        el.innerHTML += elementHtml;
        nodeIndex++;
        currentNode = nodes[nodeIndex];
        charIndex = 0;
        setTimeout(typeNextChar, 10);
      } else {
        nodeIndex++;
        currentNode = nodes[nodeIndex];
        setTimeout(typeNextChar, 10);
      }
    }
    
    typeNextChar();
  }

  function attachPathClickHandlers() {
    const links = document.querySelectorAll(".path-link");
    links.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const path = link.getAttribute("data-path");
        if (path) {
          window.location.href = path;
        }
      });
    });
  }

  async function getIP() {
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
          return ip;
        }
      } catch {}
    }

    return "guest";
  }
});