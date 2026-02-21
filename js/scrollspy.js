document.addEventListener("DOMContentLoaded", () => {
  const headings = document.querySelectorAll(
    ".single_article h1, .single_article h2, .single_article h3, .single_article h4, .single_article h5, .single_article h6"
  );

  const tocLinks = document.querySelectorAll(".toc a");

  if (!headings.length || !tocLinks.length) return;

  let manualActive = false;


  tocLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);

      if (!target) return;

      manualActive = true;

      window.scrollTo({
        top: target.offsetTop - 110,
        behavior: "smooth"
      });

      setActive(link);

      setTimeout(() => {
        manualActive = false;
      }, 800);
    });
  });

function setActive(activeLink) {
  tocLinks.forEach(link => {
    link.classList.remove("active");
  });

  activeLink.classList.add("active");

  const tocContainer = document.querySelector(".toc");

  const linkTop = activeLink.offsetTop;
  const viewTop = tocContainer.scrollTop;
  const viewBottom = viewTop + tocContainer.clientHeight;

  if (linkTop < viewTop) {
    tocContainer.scrollTo({
      top: viewTop - tocContainer.clientHeight,
      behavior: "smooth"
    });
  } 
  else if (linkTop > viewBottom) {
    tocContainer.scrollTo({
      top: viewTop + tocContainer.clientHeight,
      behavior: "smooth"
    });
  }
}

  const observer = new IntersectionObserver(
    entries => {
      if (manualActive) return;

      const visibleHeadings = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (!visibleHeadings.length) return;

      const id = visibleHeadings[0].target.id;

      const matchedLink = document.querySelector(`.toc a[href="#${id}"]`);

      if (matchedLink) {
        setActive(matchedLink);
      }
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    }
  );

  headings.forEach(h => {
    if (h.id) observer.observe(h);
  });
});