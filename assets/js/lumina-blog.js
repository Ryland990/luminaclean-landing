/* Lumina blog aside: when it scrolls into view, a small swipe demo plays first
   (Polaroids swiped left fly into Lumina's mouth, one swiped right is kept),
   then her monologue plays one line at a time, swapping her pose per line.
   Tap her to skip ahead; tap the cards to replay the swipes.
   Gentle (lost-photo) asides get no eating demo.
   Reduced motion or no IntersectionObserver: how-to line + all lines visible. */
(function () {
    'use strict';
    var IMG = '/assets/images/lumina/lumina-';
    var CARDS = '/assets/images/lumina/cards/';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var asides = document.querySelectorAll('.lumina-aside');
    if (!asides.length) return;

    /* stamp words match the app's own swipe labels per language */
    var T = {
        en: { del: 'DELETE', keep: 'KEEP', howto: 'Swipe left, I eat it. Swipe right, you keep it.', tally: '<b class="d">3 deleted</b> · <b class="k">1 kept</b>' },
        de: { del: 'LÖSCHEN', keep: 'BEHALTEN', howto: 'Wisch nach links, ich fress es. Wisch nach rechts, du behältst es.', tally: '<b class="d">3 gelöscht</b> · <b class="k">1 behalten</b>' },
        fr: { del: 'SUPPRIMER', keep: 'GARDER', howto: 'Glisse à gauche, je le mange. Glisse à droite, tu le gardes.', tally: '<b class="d">3 supprimées</b> · <b class="k">1 gardée</b>' },
        zh: { del: '刪除', keep: '保留', howto: '往左滑，我吃掉。往右滑，你留著。', tally: '<b class="d">刪除 3 張</b> · <b class="k">保留 1 張</b>' }
    };
    /* left = delete (eaten), right = keep */
    var DECK = [['lookalike', 'del'], ['pets', 'keep'], ['blurry', 'del'], ['receipt', 'del']];

    function lang(aside) {
        var l = (aside.getAttribute('lang') || document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
        return T[l] ? l : 'en';
    }

    asides.forEach(function (aside) {
        var t = T[lang(aside)];
        var gentle = aside.classList.contains('lumina-aside--gentle');
        var list = aside.querySelector('.la-lines');
        if (!list) return;

        if (!gentle) {
            var how = document.createElement('li');
            how.setAttribute('data-pose', 'idle');
            how.className = 'la-howto';
            how.textContent = t.howto;
            list.insertBefore(how, list.firstChild);
        }
        if (reduce || !('IntersectionObserver' in window)) return;

        var lines = aside.querySelectorAll('.la-lines li');
        var img = aside.querySelector('.la-her img');
        var btn = aside.querySelector('.la-her');
        if (!lines.length || !img) return;
        lines.forEach(function (li) { var p = new Image(); p.src = IMG + li.getAttribute('data-pose') + '.webp'; });

        var dots = aside.querySelector('.la-dots');
        if (dots) for (var d = 0; d < lines.length; d++) dots.appendChild(document.createElement('span'));
        aside.classList.add('la-live');
        list.setAttribute('aria-live', 'polite');

        var i = -1, timer = null, started = false;
        function pose(name) {
            img.style.opacity = '0';
            setTimeout(function () { img.src = IMG + name + '.webp'; img.style.opacity = '1'; }, 150);
        }
        function show(n) {
            if (n >= lines.length) return;
            i = n;
            lines.forEach(function (li, k) { li.classList.toggle('is-on', k === n); });
            if (dots) dots.querySelectorAll('span').forEach(function (s, k) { s.classList.toggle('is-on', k <= n); });
            pose(lines[n].getAttribute('data-pose'));
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

        var demo = (!gentle && document.body.animate) ? buildDemo(aside, t, pose, btn) : null;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                io.disconnect();
                if (demo) {
                    demo.play(function () { if (!started && i === 0) timer = setTimeout(function () { show(1); }, 900); });
                } else if (!started) {
                    started = true;
                    setTimeout(function () { if (i === 0) show(1); }, 1500);
                }
            });
        }, { threshold: 0.6 });
        io.observe(aside);
    });

    function buildDemo(aside, t, pose, her) {
        var stage = aside.querySelector('.la-stage');
        if (!stage) return null;
        aside.classList.add('la-has-demo');
        var deck = document.createElement('div');
        deck.className = 'la-deck';
        deck.setAttribute('aria-hidden', 'true');
        var cards = DECK.map(function (c) {
            var el = document.createElement('figure');
            el.className = 'la-card';
            el.innerHTML = '<img src="' + CARDS + c[0] + '.webp" alt="" width="90" height="90" loading="lazy">' +
                '<span class="la-stamp la-stamp--' + c[1] + '">' + (c[1] === 'del' ? '← ' + t.del : t.keep + ' →') + '</span>';
            deck.appendChild(el);
            return { el: el, kind: c[1], rest: el.style.transform };
        });
        var hint = document.createElement('div');
        hint.className = 'la-hint';
        hint.setAttribute('aria-hidden', 'true');
        hint.innerHTML = '<b class="d">← ' + t.del + '</b> · <b class="k">' + t.keep + ' →</b>';
        var tally = document.createElement('div');
        tally.className = 'la-kept';
        tally.setAttribute('aria-hidden', 'true');
        tally.innerHTML = t.tally;
        stage.appendChild(deck);
        stage.appendChild(hint);
        stage.appendChild(tally);

        var running = false;
        function chomp() {
            her.classList.remove('la-chomp'); void her.offsetWidth; her.classList.add('la-chomp');
        }
        function reset() {
            cards.forEach(function (c) {
                c.el.getAnimations().forEach(function (a) { a.cancel(); });
                c.el.querySelector('.la-stamp').getAnimations().forEach(function (a) { a.cancel(); });
                c.el.style.zIndex = '';
            });
            tally.classList.remove('is-on');
            hint.style.opacity = '';
        }
        /* mouth sits ~72px from the stage's left edge, ~115px down; the deck's
           centre is ~224px across, ~57px down. Kept cards slide off right. */
        function swipe(c, done) {
            var stamp = c.el.querySelector('.la-stamp');
            stamp.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: 'forwards' });
            var frames = c.kind === 'del' ? [
                { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
                { transform: 'translate(-22px,-4px) rotate(-14deg) scale(1)', opacity: 1, offset: 0.35 },
                { transform: 'translate(-152px,58px) rotate(-38deg) scale(0.12)', opacity: 0.2 }
            ] : [
                { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
                { transform: 'translate(20px,-4px) rotate(12deg) scale(1)', opacity: 1, offset: 0.35 },
                { transform: 'translate(78px,-8px) rotate(22deg) scale(0.9)', opacity: 0 }
            ];
            var a = c.el.animate(frames, { duration: c.kind === 'del' ? 720 : 760, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'forwards' });
            a.onfinish = done;
        }
        function play(after) {
            if (running) return;
            running = true;
            reset();
            pose('idle');
            var order = cards.slice().reverse();  /* top card first */
            var k = 0, eaten = 0;
            (function next() {
                if (k >= order.length) {
                    hint.style.opacity = '0';
                    tally.classList.add('is-on');
                    setTimeout(function () { pose('stuffed'); }, 250);
                    setTimeout(function () { running = false; if (after) after(); after = null; }, 1400);
                    return;
                }
                var c = order[k++];
                c.el.style.zIndex = '5';
                swipe(c, function () {
                    if (c.kind === 'del') {
                        eaten++;
                        pose(eaten === 3 ? 'stuffed' : 'chew');
                        chomp();
                    } else {
                        pose('thumbsup');
                    }
                    setTimeout(next, 420);
                });
            })();
        }
        deck.addEventListener('click', function () { play(null); });
        return { play: play };
    }
})();
