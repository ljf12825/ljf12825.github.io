---
type: root
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

### Website Structure

This website consists of multiple sub-websites.\
This page is [root(/)](/), provides build informations, a user manual and entrance to [$HOME(~)](/home/)\
If this is your first time here, I recommend that you read through this user manual.

### Floating Window

This website makes extensive use of floating windows to minimize page real estate and accommodate certain extreme screen aspect ratios.\
The floating window is characterized by a blue title bar and is draggable.\
Double-click the title to toggle between expanded and collapsed states.\
The title structure takes the form `>> >> >> NAME << << <<` or `<<<<<<NAME>>>>>>`, corresponding to the expanded and collapsed states, respectively.\
The floating window features state and position memory capabilities; it reverts to its default layout—and only does so—when the page width is reduced, in order to prevent it from being obscured.\
The `NAME` includes:

- `Navigation` and `Nav`
- `Table of Contents` and `Toc`
- `Indexer` and `Idx`

### Two Types of Navigation

This site has two Navigation options: `Main Navigation` and `Top Navigation`.\
As shown in the STRUCTURE, this site uses the root page(`/`, i.e. this page) as the root node for all pages.\
`Main Navigation` is responsible for navigating between different subsites/modules/second-level directories and external websites.\
`Top Navigation` is responsible for navigation within the same subsite's third-level directory; different subsites have different `Top Navigation`.

#### Main Navigation

`Main Navigation` is floating window `Navigation`
The main navigation's default position is in the bottom-right corner of the page. \
The website will remember the position and expanded state, and retain the state on the next visit.\
Navigation comprises two modes: `INTERNAL` and `EXTERNAL` which handle internal and external site redirects, respectively. 

- The `Internal` meaning and content of each node in `Main Navigation` are explained in detail in `~/$HOME`
- The specific details regarding the `External` redirect links can be found under `～/reference/`.

#### Top Navigation

`Top Navigation` is used to provide navigation for the current sub-site.\
It always displays under `Prompt Command`.\
If this option has sub-options, a floating window will appear when you hover the mouse over this item.\
On `Search List` pages, it switches to displaying search result metadata instead.

### ToC

ToC(Table of Contents) is a floating window that appears only on the article page and is responsible for quick article title navigation.\
The default position of ToC is the right-top corner of content page.

### Indexer

Indexer is a floatting windows which default position is left-bottom corner of page.\
Indexer is a global search engine that allows you to quickly index articles by entering their titles or keywords.\
The search scope has two modes: `Global` and `Current`. `Global` mode searches all content on the website from anywhere within the site, while `Current` mode searches within the most granular possible scope.\
You can also perform a fuzzy search by gradually narrowing down the search scope by selecting `Tags`, `Categories`, and `Types`.\
The `Top Results` section will provide up to eight of the most relevant results. To view the complete search results, click `MORE` to jump to the `Search List` for more details.\
If there are no results, `MORE` cannot be clicked.\
Typing `/*` will match all options.

When you are located within a subfolder under `eco/engine/`, the Indexer displays a 3D scatter plot, allowing you to quickly gain an overview and navigate.

#### Search List

`Search List` is a special page which shows all results filtered by `Indexer`, and it supports as detailed information as possible of results.

### Prompt Command

The Prompt Command format `ip@url:path/$ command`

#### ip

Site will query your ip from api, and it used solely for display purposes.\
If the query fails, `guest` is displayed by default.\

#### command

`command` includes:

- `ls | xarg cat` at fold 
- `command = less content name` at content

#### path

`path` consists of a series of links; clicking on a specific segment allows for navigation, thereby implementing a breadcrumb trail.

Jeff Lee\
20 May 2026
