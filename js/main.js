/* ============================================================
   QUED Metrics — landing page behaviour
   No dependencies. Every effect degrades to a working page.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Share config ------------------------------------------------------
     SHARE_URL is the address students will land on. Change this one line if
     the site ever moves.                                                    */
  var SHARE_URL   = 'https://quedmetrics.com';
  var SHARE_TITLE = 'Academic Intelligence Internship — QUED Metrics';
  var SHARE_TEXT  =
    'Academic Intelligence Internship at QUED Metrics — open to all KTU branches.\n\n' +
    'Work on curriculum research, content development and validation for a real ' +
    'AI-driven learning product. Remote/hybrid, certificate on completion.';

  /* ---------- 1. Nav scroll state ---------- */
  var nav = document.getElementById('nav');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      nav.classList.toggle('is-stuck', window.scrollY > 80);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      burger.focus();
    }
  });

  // Never leave the overlay stranded open when we cross into desktop layout.
  window.matchMedia('(min-width: 1000px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- 3. FAQ accordion (single-open) ---------- */
  var accButtons = document.querySelectorAll('.acc__btn');

  Array.prototype.forEach.call(accButtons, function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close all
      Array.prototype.forEach.call(accButtons, function (other) {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls'))
          .classList.remove('is-open');
      });

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
      }
    });
  });

  /* ---------- 4. Scroll reveals ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-in');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    // Stagger siblings inside a grid so rows cascade rather than pop together.
    Array.prototype.forEach.call(revealables, function (el) {
      var siblings = el.parentElement
        ? el.parentElement.querySelectorAll(':scope > .reveal')
        : [];
      if (siblings.length > 1) {
        var i = Array.prototype.indexOf.call(siblings, el);
        el.style.setProperty('--reveal-delay', (i * 60) + 'ms');
      }
      revealObserver.observe(el);
    });
  }

  /* ---------- 5. Share ----------
     Only exists where the device can actually open a native share sheet:
     navigator.share AND a touch-primary pointer. That rules out laptops and
     desktops (including macOS Safari, which supports navigator.share but has
     no reason to show a "share to WhatsApp" button). Unsupported devices get
     the element removed outright rather than hidden, so the CTA grid reflows
     to two buttons cleanly. */
  var shareButtons = document.querySelectorAll('.js-share');
  var canShare = typeof navigator.share === 'function' &&
                 window.matchMedia('(pointer: coarse)').matches;

  Array.prototype.forEach.call(shareButtons, function (btn) {
    if (!canShare) { btn.remove(); return; }

    btn.hidden = false;
    btn.addEventListener('click', function () {
      navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL })
        .catch(function () { /* user dismissed the sheet — not an error */ });
    });
  });

  /* ---------- 6. Pipeline stage sequence ---------- */
  var stagesEl = document.getElementById('stages');

  if (stagesEl) {
    var stages = stagesEl.querySelectorAll('.stage');

    var lightAll = function () {
      Array.prototype.forEach.call(stages, function (s) { s.classList.add('is-on'); });
    };

    if (reduced || !('IntersectionObserver' in window)) {
      lightAll();
    } else {
      var stageObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          Array.prototype.forEach.call(stages, function (stage, i) {
            window.setTimeout(function () { stage.classList.add('is-on'); }, i * 220);
          });
        });
      }, { threshold: 0.35 });

      stageObserver.observe(stagesEl);
    }
  }
})();
