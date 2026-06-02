// Mobile nav toggle — self-attaches to any header.top on the page
(function () {
  const wrap = document.querySelector('header.top .wrap');
  if (!wrap) return;
  const nav = wrap.querySelector('nav.main');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'main-nav');
  btn.innerHTML = '<span></span><span></span><span></span>';

  nav.id = nav.id || 'main-nav';
  wrap.appendChild(btn);

  function close() {
    nav.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }
  function open() {
    nav.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  btn.addEventListener('click', function () {
    if (nav.classList.contains('open')) close(); else open();
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) close();
  });
})();

// Scroll-to-top button — auto-appears on long pages
(function () {
  if (document.documentElement.scrollHeight < 2200) return;
  var b = document.createElement('button');
  b.type = 'button';
  b.className = 'to-top';
  b.setAttribute('aria-label', 'Scroll to top');
  b.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
  b.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(b);
  function toggle() {
    if (window.scrollY > 600) b.classList.add('show'); else b.classList.remove('show');
  }
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();
