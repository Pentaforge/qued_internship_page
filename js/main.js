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
  var NL = String.fromCharCode(10);

  var SHARE_URL   = 'https://quedmetrics.com';
  var SHARE_TITLE = 'Academic Intelligence Internship — QUED Metrics';
  var SHARE_TEXT  = [
    '🎓 Academic Intelligence Internship — QUED Metrics',
    '',
    'Build the academic knowledge system behind an AI-driven learning product made for KTU students.',
    '',
    "Not a materials-collection internship — you'll create, organise and validate the content a real product runs on.",
    '',
    "WHAT YOU'LL DO",
    '📚 Research the KTU syllabus from trusted academic sources',
    '✍️ Turn it into structured notes, explanations and Q&A',
    '🔍 Validate every resource before a student sees it',
    '🔧 Work with Git, GitHub and real review cycles',
    '',
    'WHAT YOU GET',
    '🏅 Internship certificate',
    '💼 Portfolio-worthy experience on a real product',
    '🚀 Performance-based opportunities at QUED Metrics',
    '',
    '✅ Open to ALL KTU engineering branches',
    '💻 Remote / Hybrid',
    '',
    'Apply here 👇'
  ].join(NL);

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
     Three-way, because native sharing is not available everywhere:

       navigator.share  -> OS share sheet (all apps). Chrome/Safari on mobile.
                           NOTE: requires HTTPS; it is undefined over plain http.
       touch, no share  -> WhatsApp deep link. Firefox for Android only gained
                           navigator.share in v155, so most Firefox users land
                           here. wa.me works in every mobile browser.
       anything else    -> element removed (laptops/desktops).

     macOS Safari supports navigator.share on laptops, which is why the pointer
     test is needed as well as the feature test. */
  var shareButtons = document.querySelectorAll('.js-share');
  var isTouch      = window.matchMedia('(pointer: coarse)').matches;
  var hasNative    = typeof navigator.share === 'function';

  function waLink() {
    return 'https://wa.me/?text=' +
           encodeURIComponent(SHARE_TEXT + NL + NL + SHARE_URL);
  }

  Array.prototype.forEach.call(shareButtons, function (btn) {
    if (!isTouch) { btn.remove(); return; }

    var label = btn.querySelector('.js-share-label');
    var inMenu = !!btn.closest('.menu');

    if (!hasNative && label) {
      // Say where it actually goes rather than promising a generic share sheet.
      label.textContent = inMenu ? 'Share on WhatsApp' : 'WhatsApp';
    }

    btn.hidden = false;

    btn.addEventListener('click', function () {
      if (hasNative) {
        navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL })
          .catch(function () { /* user dismissed the sheet — not an error */ });
        return;
      }
      var w = window.open(waLink(), '_blank', 'noopener');
      if (!w) window.location.href = waLink();   // popup blocked
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
