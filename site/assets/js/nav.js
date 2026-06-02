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
