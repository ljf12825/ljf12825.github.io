---
type: home
---

# ljf12825\@ljf12825.github.io:/$

## BUILD INFO

{{< buildinfo >}}

<script>
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("runtime-host");
  if (el) el.textContent = window.location.host;
});
</script>

## MANUAL

> edit at 2026-03-29

### Navigation

Navigation will be permanently displayed on all pages of this site.\
This site has two Navigation options: `Mainnavigation` and `Subnavigation`\
As shown in the STRUCTURE, this site uses the root page(`/`, i.e. this page) as the root node for all pages\
`Mainnavigation` is responsible for navigating between different subsites/modules/second-level directories\
`Subnavigation` is responsible for navigation within the same subsite's third-level directory; different subsites have different `Subnavigation`

#### Mainnavigation

If this is your first time opening this website or you have cleared the website's data, the Mainnavigation will be expanded by default and displayed in the lower right corner of the webpage\
Dragging the title bar moves the `Mainnavigation` position, and double-clicking the title bar minimizes it. The website will remember the position and expanded state, and retain the state on the next visit

![navigation](/images/navigation.png) \
Expanded

![nav](/images/nav.png) \
Folded

The meaning and content of each node in Mainnavigation are explained in detail in `~/$HOME`

#### Subnavigation

Subnavigation is always displayed under Prompt; it is not present on the root page

![subnav](/images/subnav.png)

### Reference

Similar to Mainnavigation, Reference is also a separate window displayed across the entire site, facilitating convenient external link navigation\
It defaults to an expanded state and appears in the lower left corner of the page\
Detailed information about Reference can be found in [`~/references`](https://ljf12825.github.io/home/reference/)

![reference](/images/reference.png) \
Expanded

![ref](/images/ref.png)\
Folded

### Prompt Command

The Prompt Command format

```text
ip@url:path/$ command
```

if you are at fold

```text
command = ls | xarg cat
```

if you are at content

```text
command = less content name
```

site will query your ip from api, and it used solely for display puerposes

![prompt](/images/prompt.png)

there may be a delay from query

it also supports breadcrumb navigation, you can click path to jump