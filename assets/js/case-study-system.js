(() => {
  const body = document.body;
  const main = document.querySelector('.detail-main, #project-page');
  if (!body.classList.contains('project-detail-page') || !main) return;

  body.classList.add('case-study-system-ready');
  if (!main.id) main.id = 'project-content';

  const skipLink = document.createElement('a');
  skipLink.className = 'case-skip-link';
  skipLink.href = `#${main.id}`;
  skipLink.textContent = 'Skip to project content';
  body.prepend(skipLink);

  const progress = document.createElement('div');
  progress.className = 'case-study-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  body.prepend(progress);
  const progressBar = progress.firstElementChild;

  const slugify = value => value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'section';

  const sections = [...main.querySelectorAll('.detail-section')];
  const usedIds = new Set([...document.querySelectorAll('[id]')].map(element => element.id));
  const tocItems = [];

  sections.forEach((section, index) => {
    const heading = section.querySelector(':scope > .detail-shell .detail-heading h2, :scope > .detail-shell > header h2, h2');
    if (!heading) return;
    if (!section.id) {
      const base = `case-${slugify(heading.textContent)}`;
      let id = base;
      let suffix = 2;
      while (usedIds.has(id)) id = `${base}-${suffix++}`;
      section.id = id;
      usedIds.add(id);
    }
    const shortLabel = section.querySelector('.detail-heading small')?.textContent.trim() || heading.textContent.trim();
    tocItems.push({ section, label: shortLabel, index });
  });

  if (tocItems.length > 2) {
    const tocWrap = document.createElement('div');
    tocWrap.className = 'case-study-toc-wrap';
    const tocShell = document.createElement('div');
    tocShell.className = 'detail-shell';
    const toc = document.createElement('nav');
    toc.className = 'case-study-toc';
    toc.setAttribute('aria-label', 'Case study sections');
    toc.innerHTML = `<span class="case-study-toc-label">On this page</span>${tocItems.map(item => `<a href="#${item.section.id}">${item.label}</a>`).join('')}`;
    tocShell.append(toc);
    tocWrap.append(tocShell);

    const contentRoot = main.children.length === 1 && main.firstElementChild?.matches('article')
      ? main.firstElementChild
      : main;
    const directChildren = [...contentRoot.children];
    const overview = directChildren.find(element => element.matches('.overview-grid, .kopo-snapshot'));
    const firstSection = directChildren.find(element => element.matches('.detail-section'));
    const insertAfter = overview || firstSection || directChildren.find(element => element.matches('.detail-hero'));
    insertAfter?.insertAdjacentElement('afterend', tocWrap);

    const tocLinks = [...toc.querySelectorAll('a')];
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        tocLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${visible.target.id}`;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .45] });
      tocItems.forEach(item => sectionObserver.observe(item.section));
    }
  }

  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.setAttribute('rel', [...rel].join(' '));
  });

  main.querySelectorAll('img').forEach(image => {
    if (!image.closest('.detail-hero')) image.loading = 'lazy';
    image.decoding = 'async';
  });

  let ticking = false;
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressBar.style.transform = `scaleX(${amount})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
})();
