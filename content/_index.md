---
type: home
---

## BUILD INFO

{{< buildinfo >}}

<script>
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("runtime-host");
  if (el) el.textContent = window.location.host;
});
</script>

## USER MANUAL

### Navigation

Navigation will be permanently displayed on all pages of this site.\
This site has two Navigation options: `Mainnavigation` and `Subnavigation`\
As shown in the STRUCTURE, this site uses the root page(`/`, i.e. this page) as the root node for all pages\
`Mainnavigation` is responsible for navigating between different subsites/modules/second-level directories\
`Subnavigation` is responsible for navigation within the same subsite's third-level directory; different subsites have different `Subnavigation`

#### Mainnavigation

The main navigation's default position is in the bottom-right corner of the page. When you first open the page—or if the page width is reduced—the main navigation will revert to its default position and remain in a closed state.\
Dragging the title bar moves the `Mainnavigation` position, and double-clicking the title bar minimizes it. The website will remember the position and expanded state, and retain the state on the next visit\
Navigation comprises two pages—Internal and External—which handle internal and external site redirects, respectively. 

![navigation](/images/navigation.png)  ![nav](/images/nav.png)

- The meaning and content of each node in Mainnavigation are explained in detail in `~/$HOME`
- The specific details regarding the external redirect links can be found under `～/reference/`.

#### Subnavigation

Subnavigation is always displayed under Prompt.\
If this option has sub-options, a floating window will appear when you hover the mouse over this item.\
It displays special information on the root and search list pages instead of the subnavigation.

![subnav](/images/subnav.png)

### ToC

TOC(Table of Contents) is a floating window that appears only on the article page and is responsible for quick article title navigation.

![tableofcontents](/images/tableofcontents.jpg)  ![toc](/images/toc.jpg)

### Indexer

Indexer is a global search engine that allows you to quickly index articles by entering their titles or keywords.\
The search scope has two modes: `Global` and `Current`. `Global` mode searches all content on the website from anywhere within the site, while `Current` mode searches within the most granular possible scope.\
You can also perform a fuzzy search by gradually narrowing down the search scope by selecting `Tags`, `Categories`, and `Types`.\
The `Top Results` section will provide up to eight of the most relevant results. To view the complete search results, click `SEEALL` to jump to the `Search List` for more details.\
Typing `/*` will match all options.

![Indexer](/images/indexer.png)
![Idx](/images/idx.jpg)

When you are located within a subfolder under `eco/engine/`, the Indexer displays a 3D scatter plot, allowing you to quickly gain an overview and navigate.

![Indexersp](/images/indexersp.png)

#### Search List

`Search List` will show all results filtered by `Indexer`, and it supports as detailed as possible imformation of results.

![searchlist](/images/searchlist.jpg)

### Prompt Command

The Prompt Command format `ip@url:path/$ command`

- if you are at fold `command = ls | xarg cat`
- if you are at content `command = less content name`
- if you are at root `command = hostnamectl && man -k .`

site will query your ip from api, and it used solely for display puerposes

![prompt](/images/prompt.png)

there may be a delay from query

it also supports breadcrumb navigation, you can click path to jump

May 2026
