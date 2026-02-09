# home

> There is only one goal
<div class="layout">
<pre class="ascii">
+--------------------------------------------------------------+
|                        <a href="https://rightbrain.com">RightBrain</a>                            |
|                             |                                |
|             <a href="https://a.com">GCC&Linux</a>       |       <a href="https://b.com">.NET&Windows</a>             |
|                      \      |      /                         |
|                       \     |     /                          |
|                        \    |    /                           |
|                         \   |   /                            |
|                          \  |  /                             |
|      <a href="https://c.com">Graphic</a> ------------ <a href="https://base.com">home*</a> ------------ <a href="https://d.com">System</a>          |
|                          /  |  \                             |
|                         /   |   \                            |
|                        /    |    \                           |
|                       /     |     \                          |
|                      /      |      \                         |
|               <a href="https://e.com">Project</a>       |       <a href="https://f.com">Miscellaneous</a>            |
|                             |                                |
|                         <a href="https://g.com">CSBasic</a>                         <a href="https://ai.com">AI</a>   |
+--------------------------------------------------------------+
</pre>
<div class="side">

<pre class="ascii", id="alive"></pre>

</div>
</div>
<style>
.layout {
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
}

.ascii {
  font-family: monospace;
  flex: 0 0 auto;
  margin: 0;
}

.side {
  flex: 1;
  padding-left: 32px;
}
</style>

<script>

const pre = document.getElementById('alive');

async function loadAscii(path) {
  const res = await fetch(path);
  return res.text();
}

async function updatePreContent() {
  const path =
    window.innerWidth <= 1080
      ? '/ascii/alive-narrow.txt'
      : '/ascii/alive-wide.txt';

  pre.textContent = await loadAscii(path);
}

updatePreContent();
window.addEventListener('resize', updatePreContent);

</script>

---

> Something write down here

```text
The brain has a similar LRU mechanism, so some knowledge needs to find an "extra environment" to store.
Everything and understanding of them is constantly changing, so everything is constantly changing also!
I pursue first principles, original documents and unprocessed sources of knowledge, pure, solid, independent and thoughtful just like espresso!
If what I recorded is helpful to you, it's my pleasure!
If there are any errors, please contact with me.
If one day my site is no longer updated, please check the latest push.
为无为，事无事，味无味。大小多少，抱怨以德。图难于其易，为大于其细。天下难事，必作于易；天下大事，必作于细。是以圣人终不为大，故能成其大。夫轻诺必寡信，多易必多难。是以圣人犹难之，故终无难矣。
```

---

> Full License

```txt
Copyright © 2026 Jeff Lee (ljf12825). All rights reserved.

This repository contains different types of content, each licensed separately:

1. Blog Content
   Unless otherwise noted, blog posts and articles are licensed under
   Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
   See: https://creativecommons.org/licenses/by-sa/4.0/

2. Article Content
   Papers and academic-level writings are licensed under
   Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
   See: https://creativecommons.org/licenses/by-nc-sa/4.0/

3. Source Code
   Source code in this repository is licensed under the MIT License,
   unless explicitly stated otherwise in a subdirectory.
   See: https://opensource.org/licenses/MIT

4. Assets and Other Materials
   Images, diagrams, datasets, and other project assets are, unless otherwise stated,
   licensed under the same license as the content they accompany.

---

Notes:
- If a file or directory contains its own LICENSE file, that license takes precedence.  
- If no license is specified, all rights are reserved.
```

---

>Me: Jeff Lee(ljf12825)

<div style="display: flex; justify-content: space-between; align-items: center;">
  <span>GitHub: <a href="https://github.com/ljf12825">Jeff Lee(ljf12825)</a></span>
  <span>Build with <a href="https://gohugo.io/">Hugo</a></span>
</div>

<div style="display: flex; justify-content: space-between; align-items: center;">
  <span>E-mail: <a href="mailto:ljf12825@graingen.com">ljf12825@graingen.com</a></span>
  <span><img src="/images/imgi_2_hugo-logo-wide.svg" alt="HugoLogo" width="150" height="40" class="hugo-logo"></span>
</div>

<!-- <a href="https://github.com/ljf12825">GitHub</a> <p align="right">Build with <a href="https://gohugo.io/">Hugo</a></p> 

E-mail: <a href="mailto:ljf12825@graingen.com">ljf12825@graingen.com</a> <p align="right"><img src="/images/imgi_2_hugo-logo-wide.svg" alt="HogoLogo"></p> -->
