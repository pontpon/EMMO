(() => {
  const header = document.querySelector('#header');
  const menu = document.querySelector('#nav');
  const toggle = document.querySelector('.menu-toggle');
  const topButton = document.querySelector('.to-top');
  const links = [...document.querySelectorAll('#nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    topButton?.classList.toggle('show', window.scrollY > 600);
    let current = 'home';
    sections.forEach(section => { if (window.scrollY >= section.offsetTop - 180) current = section.id; });
    links.forEach(link => link.classList.toggle('active', link.hash === `#${current}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = `<i class="bi bi-${open ? 'x' : 'list'}"></i>`;
  });
  links.forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.innerHTML = '<i class="bi bi-list"></i>';
  }));
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  const revealItems = document.querySelectorAll('.reveal, .skill-reveal, .education-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .1, rootMargin: '0px 0px -30px' });
    revealItems.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
      observer.observe(element);
    });
  } else {
    revealItems.forEach(element => element.classList.add('visible'));
  }

  const educationData = {
    hnd: {
      title: 'Higher National Diploma in Computing',
      institution: 'Scottish Qualifications Authority · Scotland',
      qualification: 'Computing: Software Development',
      year: '2018',
      achievement: 'Higher National Diploma in Computing',
      summary: 'Built practical technical foundations across programming, databases, web technologies, systems analysis, application development, and professional computing practice.',
      focus: 'Software development, database systems, web technologies, and applied systems development.',
      awardDate: 'July 2018',
      level: 'Higher National Diploma',
      subjects: ['Programming', 'Database Design', 'SQL', 'Software Development', 'Web Development', 'Object-Oriented Programming', 'Systems Analysis', 'Application Development'],
      skills: ['Programming', 'Relational Databases', 'Web Development', 'Systems Analysis', 'Application Development', 'Problem Solving']
    },
    bachelor: {
      title: 'Bachelor of Science in Business Information Technology',
      institution: 'University of Greenwich · United Kingdom',
      qualification: 'Business Information Technology',
      year: '2020',
      achievement: 'Second Class Honours, First Division',
      summary: 'Combined requirements analysis, information systems management, technology planning, development methods, human-computer interaction, interface design, and applied project work.',
      focus: 'Connecting business requirements, information systems, development planning, and user-centred interface design.',
      awardDate: '5 February 2020',
      level: 'Bachelor’s degree · 120 credits at Level 6',
      subjects: ['Requirements Analysis', 'Information Systems Management', 'Information Technology Planning', 'Development Frameworks and Methods', 'Human Computer Interaction and Design', 'User Interface Design', 'Information Systems & Multimedia Undergraduate Project'],
      skills: ['Requirements Analysis', 'Technology Planning', 'Development Methods', 'Human Computer Interaction', 'User Interface Design', 'Project Delivery']
    },
    master: {
      title: 'Master of Information Technology',
      institution: 'James Cook University · Singapore',
      qualification: 'Business Informatics',
      year: '2026',
      achievement: 'Master of Information Technology awarded',
      summary: 'Developed advanced knowledge across business informatics, digital systems, project analysis, user-centred technology, data-driven decision-making, databases, web development, research, and information security.',
      focus: 'Business analysis and delivery, user experience, data and information systems, research, and technical foundations.',
      awardDate: '8 January 2026',
      level: 'Postgraduate degree',
      subjects: ['ICT Project 1: Analysis and Design', 'ICT Project 2: Implementation and Commissioning', 'Advanced Human Computer Interaction', 'Web Design and Development', 'Data Mining', 'Information Management and Analytics Technology', 'Enterprise Database Systems', 'Literature Review and Research Proposal', 'E-Security'],
      skills: ['Business Analysis', 'Project Planning', 'Testing and Delivery', 'User-Centred Design', 'Data Analysis', 'Research Synthesis', 'Information Security']
    }
  };

  const educationModal = document.querySelector('#education-modal');
  if (!educationModal) return;
  let educationTrigger = null;
  const fillPills = (selector, items) => {
    educationModal.querySelector(selector).replaceChildren(...items.map(item => {
      const pill = document.createElement('span');
      pill.textContent = item;
      return pill;
    }));
  };
  const closeEducationModal = () => educationModal.close();

  document.querySelectorAll('.edu-transcript-button').forEach(button => button.addEventListener('click', () => {
    const data = educationData[button.dataset.education];
    if (!data) return;
    educationTrigger = button;
    educationModal.querySelector('[data-modal-title]').textContent = data.title;
    educationModal.querySelector('[data-modal-institution]').textContent = data.institution;
    educationModal.querySelector('[data-modal-qualification]').textContent = data.qualification;
    educationModal.querySelector('[data-modal-year]').textContent = data.year;
    educationModal.querySelector('[data-modal-summary]').textContent = data.summary;
    educationModal.querySelector('[data-modal-focus]').textContent = data.focus;
    educationModal.querySelector('[data-modal-achievement]').textContent = data.achievement;
    educationModal.querySelector('[data-modal-award-date]').textContent = data.awardDate;
    educationModal.querySelector('[data-modal-level]').textContent = data.level;
    fillPills('[data-modal-subjects]', data.subjects);
    fillPills('[data-modal-skills]', data.skills);
    document.body.classList.add('modal-open');
    educationModal.showModal();
    educationModal.querySelector('.education-modal-close').focus();
  }));
  educationModal.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', closeEducationModal));
  educationModal.addEventListener('click', event => { if (event.target === educationModal) closeEducationModal(); });
  educationModal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    educationTrigger?.focus();
  });
  educationModal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...educationModal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.hasAttribute('disabled'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();
