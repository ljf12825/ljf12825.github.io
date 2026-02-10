  document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const tagLinks = Array.from(document.querySelectorAll('.tag-link'));
  const categoryLinks = Array.from(document.querySelectorAll('.category-link'));
  const cards = Array.from(document.querySelectorAll('.blog-card'));

  let tagFilterMode = "AND";
  let categoryFilterMode = "AND";

  const makeModeToggle = (labelText, defaultMode, onChange) => {
    const btn = document.createElement('button');
    btn.textContent = `${labelText}: ${defaultMode}`;
    btn.style.cursor = "pointer";
    btn.style.padding = "0.2rem 0.6rem";
    btn.style.border = "0px solid #999";
    btn.style.background = "transparent";
    btn.style.color = "white";
    btn.style.fontSize = "0.8rem";
    btn.style.marginLeft = "0.5rem";
    btn.addEventListener('mouseenter', () => { btn.style.color = "#fff"; });
    btn.addEventListener('mouseleave', () => { btn.style.color = "white"; });
    btn.addEventListener('click', () => {
      const current = btn.textContent.endsWith("AND") ? "AND" : "OR";
      const next = current === "AND" ? "OR" : "AND";
      btn.textContent = `${labelText}: ${next}`;
      onChange(next);
      filterCards();
    });
    return btn;
  };

  const tagsH3 = document.querySelector('.tags-box h3');
  if (tagsH3) {
    tagsH3.style.display = "flex";
    tagsH3.style.alignItems = "center";
    tagsH3.appendChild(makeModeToggle("Mode", tagFilterMode, (m)=>tagFilterMode=m));
  }

  const catsH3 = document.querySelector('.categories-box h3');
  if (catsH3) {
    catsH3.style.display = "flex";
    catsH3.style.alignItems = "center";
    catsH3.appendChild(makeModeToggle("Mode", categoryFilterMode, (m)=>categoryFilterMode=m));
  }

  cards.forEach(card => {
    const rawTags = card.dataset.tags || '';
    const arrTags = rawTags.split('|').map(s => s.trim()).filter(Boolean).map(s => s.toLowerCase());
    card._tags = new Set(arrTags);

    const rawCats = (card.querySelector('.meta-line')?.innerText || '').toLowerCase();
    const cats = Array.from(rawCats.matchAll(/\[(.*?)\]/g)).map(m => m[1].trim());
    card._categories = new Set(cats);
  });

  const selectedTags = new Set();
  const selectedCategories = new Set();

  const refreshTagUI = () => {
    tagLinks.forEach(link => {
      const t = (link.dataset.tag || '').toLowerCase();
      link.classList.toggle('active', selectedTags.has(t));
    });
  };
  const refreshCategoryUI = () => {
    categoryLinks.forEach(link => {
      const c = (link.dataset.category || '').toLowerCase();
      link.classList.toggle('active', selectedCategories.has(c));
    });
  };

  const filterCards = (() => {
    let timer = null;
    return function doFilter() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const keyword = (searchInput.value || '').trim().toLowerCase();
        const tagsArray = Array.from(selectedTags);
        const catsArray = Array.from(selectedCategories);

        cards.forEach(card => {
          const title = (card.querySelector('.blog-title')?.innerText || '').toLowerCase();
          const summary = (card.querySelector('.blog-summary')?.innerText || '').toLowerCase();
          const matchesSearch = !keyword || title.includes(keyword) || summary.includes(keyword);

          let matchesTags = true;
          if (tagsArray.length > 0) {
            matchesTags = (tagFilterMode === "AND")
              ? tagsArray.every(t => card._tags.has(t))
              : tagsArray.some(t => card._tags.has(t));
          }

          let matchesCats = true;
          if (catsArray.length > 0) {
            matchesCats = (categoryFilterMode === "AND")
              ? catsArray.every(c => card._categories.has(c))
              : catsArray.some(c => card._categories.has(c));
          }

          card.style.display = (matchesSearch && matchesTags && matchesCats) ? '' : 'none';
        });
      }, 80);
    };
  })();

  tagLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const t = (this.dataset.tag || '').toLowerCase();
      if (!t) return;
      if (selectedTags.has(t)) selectedTags.delete(t);
      else selectedTags.add(t);
      refreshTagUI();
      filterCards();
    });
  });

  categoryLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const c = (this.dataset.category || '').toLowerCase();
      if (!c) return;
      if (selectedCategories.has(c)) selectedCategories.delete(c);
      else selectedCategories.add(c);
      refreshCategoryUI();
      filterCards();
    });
  });

  searchInput.addEventListener('input', filterCards);

  refreshTagUI();
  refreshCategoryUI();
  filterCards();
});