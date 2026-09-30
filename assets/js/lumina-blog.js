/* Lumina blog aside: plays the monologue one line at a time when the aside
   scrolls into view, swapping her pose per line. Tap her to skip ahead.
   Reduced motion or no IntersectionObserver: leaves all lines visible. */
(function () {
    'use strict';
    var IMG = '/assets/images/lumina/lumina-';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var asides = document.querySelectorAll('.lumina-aside');
    if (!asides.length || reduce || !('IntersectionObserver' in window)) return;

    asides.forEach(function (aside) {
        var lines = aside.querySelectorAll('.la-lines li');
        var img = aside.querySelector('.la-her img');
        var btn = aside.querySelector('.la-her');
        if (!lines.length || !img) return;
        lines.forEach(function (li) { var p = new Image(); p.src = IMG + li.getAttribute('data-pose') + '.webp'; });

        var dots = aside.querySelector('.la-dots');
        if (dots) for (var d = 0; d < lines.length; d++) dots.appendChild(document.createElement('span'));
        aside.classList.add('la-live');
        aside.querySelector('.la-lines').setAttribute('aria-live', 'polite');

        var i = -1, timer = null, started = false;
        function show(n) {
            if (n >= lines.length) return;
            i = n;
            lines.forEach(function (li, k) { li.classList.toggle('is-on', k === n); });
            if (dots) dots.querySelectorAll('span').forEach(function (s, k) { s.classList.toggle('is-on', k <= n); });
            var pose = lines[n].getAttribute('data-pose');
            img.style.opacity = '0';
            setTimeout(function () { img.src = IMG + pose + '.webp'; img.style.opacity = '1'; }, 150);
            clearTimeout(timer);
            if (n < lines.length - 1) {
                var words = (lines[n].textContent || '').length;
                timer = setTimeout(function () { show(n + 1); }, Math.min(4200, 1700 + words * 28));
            } else {
                aside.classList.add('la-done');
            }
        }
        show(0);  /* first line visible immediately, even before scroll */
        clearTimeout(timer);
        btn.addEventListener('click', function () { started = true; show(i < lines.length - 1 ? i + 1 : 0); if (i === 0) aside.classList.remove('la-done'); });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting || started) return;
                started = true; io.disconnect();
                setTimeout(function () { if (i === 0) show(1); }, 1500);
            });
        }, { threshold: 0.6 });
        io.observe(aside);
    });
})();
