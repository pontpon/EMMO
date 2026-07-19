(() => {
  const header = document.querySelector('#header');
  const menu = document.querySelector('#nav');
  const toggle = document.querySelector('.menu-toggle');
  const topButton = document.querySelector('.to-top');
  const links = [...document.querySelectorAll('#nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    topButton.classList.toggle('show', window.scrollY > 600);
    let current = 'home';
    sections.forEach(section => { if (window.scrollY >= section.offsetTop - 180) current = section.id; });
    links.forEach(link => link.classList.toggle('active', link.hash === `#${current}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.innerHTML = `<i class="bi bi-${open ? 'x' : 'list'}"></i>`;
  });
  links.forEach(link => link.addEventListener('click', () => { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.innerHTML = '<i class="bi bi-list"></i>'; }));
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelector('#year').textContent = new Date().getFullYear();

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal, .skill-reveal, .education-reveal').forEach(el => observer.observe(el));

  const educationData = {
    hnd: {
      title: 'Higher National Diploma in Computing', institution: 'Scottish Qualifications Authority · Scotland',
      qualification: 'Computing: Software Development', year: '2018', achievement: 'Higher National Diploma; Graded Units 1 and 2 awarded Grade B',
      summary: 'Completed the Higher National Diploma in Computing: Software Development, building applied capability across programming, databases, interactive scripting, web development, object-oriented analysis and design, prototyping, project management, and professional computing practice.',
      focus: 'Software development, database systems, web technologies, and applied systems development.',
      awardDate: 'July 2018', level: 'SCQF Level 8; additional Level 7 units',
      subjects: ['Computing: Software Development — Graded Unit 2', 'Computing — Graded Unit 1', 'Relational Database Management Systems', 'Scripting for Interactivity', 'Self Describing Data (XML)', 'Software Development: Data Structures', 'Software Development: Object Oriented Programming', 'Rapid Applications Development and Prototyping', 'Object Oriented Analysis and Design', 'Web Development: Dynamically Generated Content', 'Mathematics for Computing 1', 'Computer Systems Fundamentals', 'Introduction to Project Management', 'Database Design Fundamentals', 'Developing Software: Introduction', 'Professionalism and Ethics in Computing', 'SQL: Introduction', 'Developing Small Scale Standalone Applications', 'Programming Foundations', 'Team Working in Computing', 'Troubleshooting Computing Problems'],
      skills: ['Programming', 'Relational Databases', 'SQL', 'XML', 'Interactive Scripting', 'Web Development', 'Data Structures', 'Object-Oriented Programming', 'Systems Analysis', 'Prototyping', 'Project Management', 'Problem Solving'],
      preview: 'assets/Transcript/SQA_HND%20Certificate.pdf#page=5', download: 'assets/Transcript/SQA_HND%20Certificate.pdf'
    },
    bachelor: {
      title: 'BSc Business Information Technology', institution: 'University of Greenwich · United Kingdom',
      qualification: 'Business Information Technology', year: '2020', achievement: 'Upper Second Class Honours (1st Division)',
      summary: 'Completed the final-year-entry BSc Honours programme in Business Information Technology, combining requirements analysis, systems management, technology planning, development methods, HCI, interface design, and an undergraduate project.',
      focus: 'Connecting business requirements, information systems, development planning, and user-centred interface design.',
      awardDate: '5 February 2020', level: '120 credits gained at Level 6',
      subjects: ['Requirements Analysis', 'Information Systems Management', 'Information Technology Planning', 'Development Frameworks and Methods', 'Human Computer Interaction and Design', 'User Interface Design', 'Information Systems & Multimedia Undergraduate Project'],
      skills: ['Requirements Analysis', 'Information Systems Management', 'Technology Planning', 'Development Methods', 'Human Computer Interaction', 'User Interface Design', 'Undergraduate Project Delivery'],
      preview: 'assets/Transcript/BSC.BIT%20(Bachelor)%20(1).pdf#page=2', download: 'assets/Transcript/BSC.BIT%20(Bachelor)%20(1).pdf'
    },
    master: {
      title: 'Master of Information Technology', institution: 'James Cook University · Singapore',
      qualification: 'Business Informatics Major', year: '2026', achievement: 'Master of Information Technology awarded',
      summary: 'Officially admitted to the Master of Information Technology degree, majoring in Business Informatics, by James Cook University.',
      focus: 'Business Informatics within postgraduate Information Technology study.',
      awardDate: '8 January 2026', level: 'Postgraduate degree; credential reference 131726',
      subjects: ['The uploaded degree certificate does not include an official module list.'],
      skills: ['Business Informatics', 'Information Technology', 'Postgraduate Study'],
      preview: 'assets/Transcript/MASTER%20OF%20INFORMATION%20TECHNOLOGY.pdf', download: 'assets/Transcript/MASTER%20OF%20INFORMATION%20TECHNOLOGY.pdf'
    }
  };

  const educationModal = document.querySelector('#education-modal');
  if (educationModal) {
    let educationTrigger = null;
    const fillPills = (selector, items) => {
      educationModal.querySelector(selector).innerHTML = items.map(item => `<span>${item}</span>`).join('');
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
      const preview = educationModal.querySelector('[data-modal-preview]');
      preview.src = data.preview;
      preview.title = `${data.title} academic document preview`;
      educationModal.querySelector('[data-modal-download]').href = data.download;
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
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
})();
