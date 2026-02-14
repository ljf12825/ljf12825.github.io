---
type: home
---

# ljf12825\@ljf12825.github.io:/$

build info

{{< buildinfo >}}

<script>
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("runtime-host");
  if (el) el.textContent = window.location.host;
});
</script>

## STRUCTURE

```text
/
|__~/
|   |__homepage
|__system/
|__unix-like/
|__dotnetandwindows/
|__rightbrain/
|__graphic/
|__csbasic/
|__project/
|__miscellaneous/
|__ai/
```

## MANUAL

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

![guide](/images/guide.png)

#### Subnavigation

Subnavigation is always displayed under Prompt; it is not present on the root page

![subnav](/images/subnav.png)

### Reference

Similar to Mainnavigation, Reference is also a separate window displayed across the entire site, facilitating convenient external link navigation\
It defaults to an expanded state and appears in the lower left corner of the page\
Detailed information about Reference can be found in `~/references`

![reference](/images/reference.png) \
Expanded

![ref](/images/ref.png)\
Folded

### Prompt Command

The Prompt Command displays the current page's path\
It is permanently displayed at the top of the page

![prompt](/images/prompt.png)
