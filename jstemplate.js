(function () {
  'use strict';

  // Feature flag: parallax is disabled on small screens and for reduced motion
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function isPortraitLayout() {
    return window.matchMedia && (window.matchMedia('(max-width: 769px)').matches || window.matchMedia('(orientation: portrait)').matches);
  }

  // Hide speech bubbles whose comment is empty
  function cleanupBubbles() {
    var bubbles = document.querySelectorAll('.opinion-bubble');
    for (var i = 0; i < bubbles.length; i++) {
      var textEl = bubbles[i].querySelector('.opinion-bubble__text');
      var text = textEl ? (textEl.textContent || '') : '';
      bubbles[i].style.display = (text.trim() === '') ? 'none' : '';
    }
  }

  // Subtle pointer-based parallax for the stage (desktop only)
  function initParallax() {
    if (prefersReducedMotion() || isPortraitLayout()) return;

    var track = document.getElementById('opinion-track');
    if (!track) return;
    var stage = track.closest('.opinion-stage');
    if (!stage) return;

    var rafId = null;
    var lastEvent = null;

    stage.addEventListener('mousemove', function (event) {
      lastEvent = event;
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        rafId = null;
        if (!lastEvent) return;
        var rect = stage.getBoundingClientRect();
        var x = (lastEvent.clientX - rect.left) / rect.width - 0.5;
        var y = (lastEvent.clientY - rect.top) / rect.height - 0.5;
        track.style.setProperty('--px', (x * 6).toFixed(2) + 'deg');
        track.style.setProperty('--py', (y * -4).toFixed(2) + 'deg');
      });
    });

    stage.addEventListener('mouseleave', function () {
      track.style.setProperty('--px', '0deg');
      track.style.setProperty('--py', '0deg');
    });
  }

  function init() {
    cleanupBubbles();
    initParallax();
  }

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch (error) {
    console.error('opinion template init failed', error);
  }
})();