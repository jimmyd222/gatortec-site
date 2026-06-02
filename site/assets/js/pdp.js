// Product detail page: clickable color swatches that swap the hero image.
// Progressive enhancement — page loads with default image; JS only adds interactivity.
(function () {
  'use strict';
  function init(group) {
    var hero = group.closest('section')?.querySelector('.product-image img');
    if (!hero) return;
    // Preload the alternate color images so swap is instant
    Array.from(group.querySelectorAll('button[data-image]')).forEach(function (btn) {
      var img = new Image();
      img.src = btn.dataset.image;
    });
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-image]');
      if (!btn) return;
      hero.src = btn.dataset.image;
      if (btn.dataset.alt) hero.alt = btn.dataset.alt;
      Array.from(group.querySelectorAll('button')).forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
    // Keyboard: left/right arrow navigation between swatches
    group.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var buttons = Array.from(group.querySelectorAll('button[data-image]'));
      var current = buttons.indexOf(document.activeElement);
      if (current === -1) return;
      e.preventDefault();
      var next = e.key === 'ArrowRight'
        ? (current + 1) % buttons.length
        : (current - 1 + buttons.length) % buttons.length;
      buttons[next].focus();
      buttons[next].click();
    });
  }
  document.querySelectorAll('.swatches').forEach(init);
})();
