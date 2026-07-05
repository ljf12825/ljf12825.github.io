---
title: "ljf12825.github.io/"
---

## BUILD INFO

{{< buildinfo >}}

<script>
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("runtime-host");
  if (el) {
    el.textContent = window.location.host;
    el.style.display = "inline-block";
    el.style.overflowWrap = "break-word"; 
    el.style.maxWidth = "100%";
  }
});
</script>

## Guide

### Website structure

```txt
content/
    |-- _index.md   # current page
    |-- article/    # notes
    |-- lab/        # projects and experiments
    |-- log/        # log blogs
    |-- oj/         # online judge problems
    |-- searchlist/ # search result page
```

- [article](/article/)
- [lab](/lab/)
- [log](/log/)
- [oj](/oj/)
- [searchlist](/searchlist/) <- this equivalent to entering `/*` in the search bar

### Search

Input tag, title, summary to search result, you will jump to searchlist and return result

## Code for myself

```text
The brain works much like an LRU cache,
so some knowledge needs an external environment to be stored.

Everything—and our understanding of it—is constantly changing.
Therefore, everything must keep evolving.

I pursue first principles, original documents, and unprocessed sources of knowledge:
pure, solid, independent, and thoughtful—like a shot of espresso.

If what I record here is helpful to you, it is my pleasure.
If you find any errors, please feel free to contact me.

If one day this site is no longer updated,
please check the latest commit for the most recent changes.

Status: ALIVE
```

## Full License

```md
# Multi-License Declaration

Copyright © 2026 Jeff Lee (ljf12825)

This repository contains different types of content, each licensed separately.

---

## 1. Website & log Content

Unless otherwise noted, log posts and general website content are licensed under:

**Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**  
https://creativecommons.org/licenses/by-sa/4.0/

Applies to:
- `content/`
- All Markdown/HTML content unless otherwise specified.

---

## 2. Article / Academic Content

Papers and academic-level writings are licensed under:

**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**  
https://creativecommons.org/licenses/by-nc/4.0/

Applies to:
- `content/home/article/`
- `content/hoem/reference/`

---

## 3. Code Examples in Documentation

All code snippets and examples contained within Markdown or HTML documents
are considered part of the documentation and are licensed under the same
license as the document in which they appear, unless otherwise stated.

These code examples are provided for educational and illustrative purposes
and are not intended as production-ready software.

---

## 4. Assets and Other Materials

Images, diagrams, datasets, and other project assets are licensed under
the same license as the content they accompany, unless otherwise stated.

---

## Notes

- If a file or directory contains its own LICENSE file, that license takes precedence.  
- If no license is specified, all rights are reserved.  
- Commercial use of non-code content is prohibited unless explicitly allowed.
```
