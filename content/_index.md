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

> Edit 

### Navigation

Navigation will be permanently displayed on all pages of this site.\
This site has two Navigation options: `Mainnavigation` and `Subnavigation`\
As shown in the STRUCTURE, this site uses the root page(`/`, i.e. this page) as the root node for all pages\
`Mainnavigation` is responsible for navigating between different subsites/modules/second-level directories\
`Subnavigation` is responsible for navigation within the same subsite's third-level directory; different subsites have different `Subnavigation`

#### Mainnavigation

If this is your first time opening this website or you have cleared the website's data, the Mainnavigation will be expanded by default and displayed in the lower right corner of the webpage\
Dragging the title bar moves the `Mainnavigation` position, and double-clicking the title bar minimizes it. The website will remember the position and expanded state, and retain the state on the next visit

![navigation](/images/navigation.png)  ![nav](/images/nav.png)

The meaning and content of each node in Mainnavigation are explained in detail in `~/$HOME`

#### Subnavigation

Subnavigation is always displayed under Prompt.\
If this option has sub-options, a floating window will appear when you hover the mouse over this item.\
It displays special information on the root and search list pages instead of the subnavigation.

![subnav](/images/subnav.png)

### Reference

Similar to Mainnavigation, Reference is also a separate window displayed across the entire site, facilitating convenient external link navigation\
It defaults to an expanded state and appears in the lower left corner of the page\
Detailed information about Reference can be found in [`~/references`](https://ljf12825.github.io/home/reference/)

![reference](/images/reference.png)  ![ref](/images/ref.png)

### TOC

TOC(Table of Contents) is a floating window that appears only on the article page and is responsible for quick article title navigation.

![tableofcontents](/images/tableofcontents.jpg)  ![toc](/images/toc.jpg)

### Indexer

Indexer is a global search engine that allows you to quickly index articles by entering their titles or keywords.\
The search scope has two modes: `Global` and `Current`. `Global` mode searches all content on the website from anywhere within the site, while `Current` mode searches within the most granular possible scope.\
You can also perform a fuzzy search by gradually narrowing down the search scope by selecting `Tags`, `Categories`, and `Types`.\
The `Top Results` section will provide up to eight of the most relevant results. To view the complete search results, click `SEEALL` to jump to the `Search List` for more details.\
Typing `/*` will match all options.

![Indexer](/images/indexer.jpg)

![Idx](/images/idx.jpg)

#### Search List

`Search List` will show all results filtered by `Indexer`, and it supports as detailed as possible imformation of results.

![searchlist](/images/searchlist.jpg)

### Prompt Command

The Prompt Command format `ip@url:path/$ command`

if you are at fold `command = ls | xarg cat`

if you are at content `command = less content name`

site will query your ip from api, and it used solely for display puerposes

![prompt](/images/prompt.png)

there may be a delay from query

it also supports breadcrumb navigation, you can click path to jump

April 2026