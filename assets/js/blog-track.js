// Blog pageview beacon. Fires one "pageview" event per page load to /api/track,
// the same backend as the try-demo funnel, so blog traffic shows up alongside it
// (per-path totals + daily buckets — see /api/stats?view=pages). No dependencies.
(function () {
    'use strict';

    /* Same localStorage key as try.html, so a reader who later opens the demo
       counts as ONE unique visitor across the whole site. */
    var sessionId = (function () {
        try {
            var k = localStorage.getItem('lc_sid');
            if (!k) { k = crypto.randomUUID(); localStorage.setItem('lc_sid', k); }
            return k;
        } catch (e) { return 'nostorage'; }
    })();

    try {
        var p = new URLSearchParams(location.search);
        fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
                event: 'pageview',
                path: location.pathname,
                session_id: sessionId,
                utm_source: p.get('utm_source') || null,
                utm_campaign: p.get('utm_campaign') || null,
                utm_content: p.get('utm_content') || null
            })
        });
    } catch (e) {}
})();
