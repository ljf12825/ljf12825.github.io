document.addEventListener("DOMContentLoaded", () => {
  const headings = document.querySelectorAll(
    ".single_article h1, .single_article h2, .single_article h3, .single_article h4, .single_article h5, .single_article h6"
  );
  const tocLinks = document.querySelectorAll(".toc a");

  let manualActive = false;

  tocLinks.forEach(link => {
    link.addEventListener("click", e => {
      tocLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      manualActive = true;
      setTimeout(() => { manualActive = false }, 800);
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      if (manualActive) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let id = entry.target.getAttribute("id");
          tocLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    }
  );

  headings.forEach(h => observer.observe(h));
});