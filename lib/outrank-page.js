// Pure helpers for api/outrank.js: turn one Outrank article into a blog page in
// the site's own design (Lumina aside + App Store buttons included), and patch
// the blog index, sitemap and llms.txt. No network calls here — easy to test.
const shell = require('./outrank-shell');

const SITE = 'https://luminaclean.app';
const STORE = 'https://apps.apple.com/app/apple-store/id6757949814?pt=128405841&ct=Landing%20Page&mt=8';
const APPLE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';

// Same monologues as the hand-written posts (scratchpad lumina_blog.py, EN).
const TOPICS = {
  duplicates: [['idle', 'The same sunset. Four times.'],
               ['realise', "Apple's album only catches exact copies. The near-identical ones are still in there."],
               ['point', 'Guess your duplicate count. Go on.']],
  storage:    [['idle', 'Storage full. At the worst moment.'],
               ['realise', "It's rarely the photos you love. It's receipts. From March."],
               ['point', 'Guess how much I could eat. Go on.']],
  screenshots:[['idle', "1,249 captures of things you swore you'd read later."],
               ['realise', "You didn't."],
               ['point', 'Guess your screenshot count. Go on.']],
  blurry:     [['idle', 'Twelve photos of a moving dog. One is in focus.'],
               ['polaroid', 'I keep one blurry polaroid. We are not proud.'],
               ['point', 'Guess how many blurry ones you have. Go on.']],
  shopping:   [['idle', 'Still comparing apps? Fair.'],
               ['realise', 'Most show you a scary number, then a paywall.'],
               ['point', 'I show you the pile, and you delete some for free. Guess yours. Go on.']],
  gentle:     [['polaroid', "Deleted the wrong ones? That's the one thing I don't joke about."],
               ['idle', 'Everything I eat goes to Recently Deleted first. Thirty days to take it back.'],
               ['thumbsup', 'And nothing goes without your swipe. Not one photo.']],
};

// First match wins; order matters (recovery posts must not get the roast).
const TOPIC_RULES = [
  ['gentle', /\b(recover|restore|undelete|get (them|it|photos) back|deleted (the )?wrong|lost photos|accidentally deleted|permanently deleted)\b/i],
  ['screenshots', /screenshot/i],
  ['blurry', /\b(blurr?y|out of focus|blur)\b/i],
  ['duplicates', /\b(duplicate|similar photos|near.identical|burst|merge)\b/i],
  ['shopping', /\b(app|apps|cleaner|vs\.?|versus|review|alternative|subscription|worth it|best)\b/i],
];

function topicFor(article) {
  const hay = [article.title, (article.tags || []).join(' '), article.meta_description].join(' ');
  for (const [topic, re] of TOPIC_RULES) if (re.test(hay)) return topic;
  return 'storage';
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function slugify(s) {
  return String(s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/g, '') || 'article';
}

// Outrank is authenticated, but the HTML still goes live unreviewed: drop
// anything executable and keep only YouTube iframes.
function cleanHtml(html, title) {
  let h = String(html || '');
  h = h.replace(/<script\b[\s\S]*?<\/script>/gi, '')
       .replace(/<style\b[\s\S]*?<\/style>/gi, '')
       .replace(/<(object|embed|form|input|button|link|meta|base)\b[^>]*>(?:[\s\S]*?<\/\1>)?/gi, '')
       .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
       .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
  h = h.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>|<iframe\b[^>]*\/?>/gi, (m) => {
    const src = (m.match(/src\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
    if (!/^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com)\/embed\//i.test(src)) return '';
    return `<iframe src="${esc(src)}" title="YouTube video" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  });
  // The page template renders its own <h1>; demote any in the body.
  h = h.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, '')
       .replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi, '<h2$1>$2</h2>');
  // Lazy-load body images; tag outbound links.
  h = h.replace(/<img\b(?![^>]*\bloading=)/gi, '<img loading="lazy"');
  h = h.replace(/<a\b([^>]*\bhref\s*=\s*["']https?:\/\/(?!(www\.)?luminaclean\.app)[^"']+["'][^>]*)>/gi,
    (m, attrs) => /\brel=/.test(attrs) ? m : `<a${attrs} rel="noopener">`);
  // Any App Store link Outrank adds gets its own attribution tag.
  h = h.replace(/<a\b(?![^>]*data-appcore-cta)([^>]*href\s*=\s*["']https:\/\/apps\.apple\.com[^"']*["'])/gi,
    '<a data-appcore-cta="outrank:inline"$1');
  return h.trim();
}

function asideHtml(topic) {
  const gentle = topic === 'gentle';
  const lines = TOPICS[topic];
  const lis = lines.map(([p, t]) => `            <li data-pose="${p}">${esc(t)}</li>`).join('\n');
  const cta = gentle
    ? `<a class="la-cta la-cta--badge" href="${STORE}">${APPLE}<span class="la-badge"><span class="la-badge-small">Download on the</span><span class="la-badge-large">App Store</span></span></a>`
    : `<a class="la-cta la-cta--judged" href="${STORE}"><span class="la-cta-main">GET JUDGED</span><span class="la-cta-dash" aria-hidden="true">—</span><span class="la-cta-dl">${APPLE}<span>Download on the App Store</span></span></a>`;
  const sub = gentle
    ? 'Free to start. Every delete is your swipe, and it lands in Recently Deleted first.'
    : 'Free to start. Counted on your iPhone, nowhere else.';
  return `
    <aside class="lumina-aside${gentle ? ' lumina-aside--gentle' : ''}" lang="en" data-lumina-topic="${topic}" data-appcore-view="cta_view" data-appcore-cta="outrank:${topic}">
        <div class="la-stage">
            <button class="la-her" type="button" aria-label="Lumina. Tap for her next line."><img src="/assets/images/lumina/lumina-${lines[0][0]}.webp" alt="" width="640" height="634" loading="lazy"></button>
        </div>
        <div class="la-talk">
            <p class="la-kicker">Lumina has notes</p>
            <ol class="la-lines">
${lis}
            </ol>
            <div class="la-dots" aria-hidden="true"></div>
            ${cta}
            <p class="la-sub">${sub}</p>
        </div>
    </aside>
`;
}

// Same spot as the hand-written posts: before the 3rd <h2> (or the last one).
function insertAside(body, topic) {
  const h2 = [...body.matchAll(/<h2[\s>]/gi)].map((m) => m.index);
  const at = h2.length >= 3 ? h2[2] : h2.length ? h2[h2.length - 1] : body.length;
  return body.slice(0, at) + asideHtml(topic) + '\n' + body.slice(at);
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function dateParts(iso) {
  const d = new Date(iso);
  const ok = !isNaN(d);
  const x = ok ? d : new Date();
  return {
    iso: x.toISOString().slice(0, 10),
    long: `${MONTHS[x.getUTCMonth()]} ${x.getUTCDate()}, ${x.getUTCFullYear()}`,
    badge: `New ${MONTHS[x.getUTCMonth()].slice(0, 3)} ${x.getUTCFullYear()}`,
  };
}

/**
 * @param a       Outrank article ({title, content_html, meta_description, slug, tags, created_at})
 * @param opts    {path: 'blog/x.html', coverSrc: '/assets/...' | null, contentHtml: html with
 *                images already rewritten, published: ISO date (kept on updates), modified: ISO}
 */
function buildPage(a, opts) {
  const url = `${SITE}/${opts.path}`;
  const topic = topicFor(a);
  const pub = dateParts(opts.published || a.created_at);
  const mod = dateParts(opts.modified || new Date().toISOString());
  const title = String(a.title || '').trim();
  const desc = String(a.meta_description || '').trim().slice(0, 300);
  const ogImage = opts.coverSrc ? SITE + opts.coverSrc : `${SITE}/assets/images/og-image.png`;
  const body = insertAside(cleanHtml(opts.contentHtml != null ? opts.contentHtml : a.content_html, title), topic);
  const ld = [
    { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'LuminaClean', url: `${SITE}/`, logo: { '@type': 'ImageObject', url: `${SITE}/assets/images/icon.png` } },
    { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${url}#article`, headline: title, description: desc,
      datePublished: `${pub.iso}T00:00:00+00:00`, dateModified: `${mod.iso}T00:00:00+00:00`, url, mainEntityOfPage: { '@id': url },
      image: ogImage, inLanguage: 'en', author: { '@id': `${SITE}/#organization` }, publisher: { '@id': `${SITE}/#organization` } },
  ];
  const keywords = (a.tags || []).filter((t) => typeof t === 'string').slice(0, 10).join(', ');

  return `${shell.headTop}    <!-- Primary SEO Meta Tags -->
    <!-- outrank-article id="${esc(a.id)}" topic="${topic}" -->
    <title>${esc(title)} | LuminaClean</title>
    <meta name="description" content="${esc(desc)}">
${keywords ? `    <meta name="keywords" content="${esc(keywords)}">\n` : ''}    <meta name="author" content="LuminaClean">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <link rel="canonical" href="${url}">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:site_name" content="LuminaClean">
    <meta property="article:published_time" content="${pub.iso}">
    <meta property="article:modified_time" content="${mod.iso}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <meta name="twitter:image" content="${ogImage}">

    <meta name="apple-itunes-app" content="app-id=6757949814">
    <meta name="theme-color" content="#0a0a0a">

    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32.png?v=2">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16.png?v=2">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png?v=2">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <script type="application/ld+json">
${JSON.stringify(ld, null, 2).replace(/</g, '\\u003c')}
    </script>

${shell.headStyles}</head>
${shell.bodyTop}    <main class="article-container">
        <a href="./" class="back-link">&larr; Back to Blog</a>
        <span class="category-badge">Guide</span>
        <span class="new-badge">${pub.badge}</span>
        <p class="article-date">${pub.long}</p>
        <h1 class="article-title">${esc(title)}</h1>
${opts.coverSrc ? `        <img class="article-cover" src="${esc(opts.coverSrc)}" alt="${esc(title)}" width="1200" height="630">\n` : ''}
        <div class="article-wrapper">
${body}

            <div class="cta-box">
                <p><strong>Clean up your camera roll in minutes.</strong><br>LuminaClean scans on-device, groups duplicates, similar shots, screenshots and blurry photos, and deletes only what you confirm. Free to start, no account.</p>
                <a data-appcore-cta="outrank:article-box" href="${STORE}" class="cta-button">Download LuminaClean Free</a>
            </div>
        </div>
    </main>

${shell.footer}`;
}

// ---- blog index / sitemap / llms.txt patches (all idempotent) ----

const LATEST_ANCHOR = '    <div class="section-label">\n        <h2>How-to guides</h2>';
const LATEST_OPEN = '    <section class="blog-grid" aria-label="Latest articles">\n';

function cardHtml(href, title, desc, badge) {
  return `        <a href="${href}" class="blog-card">
            <span class="card-category">Guide</span>
            <h2 class="card-title">${esc(title)}</h2>
            <p class="card-excerpt">${esc(desc)}</p>
            <div class="card-footer">
                <span class="card-date">${badge}</span>
                <span class="card-link">Read more &rarr;</span>
            </div>
        </a>

`;
}

function patchIndex(index, file, title, desc, createdIso) {
  const card = cardHtml(file, title, desc, dateParts(createdIso).badge);
  const existing = new RegExp(`        <a href="${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" class="blog-card">[\\s\\S]*?</a>\\n\\n`);
  if (existing.test(index)) return index.replace(existing, card);   // update in place
  if (!index.includes(LATEST_OPEN)) {
    if (!index.includes(LATEST_ANCHOR)) throw new Error('blog index anchor missing');
    const section = `    <div class="section-label">
        <h2>Latest articles</h2>
        <span>New guides on iPhone photos and storage</span>
    </div>

${LATEST_OPEN}    </section>

`;
    index = index.replace(LATEST_ANCHOR, section + LATEST_ANCHOR);
  }
  return index.replace(LATEST_OPEN, LATEST_OPEN + card);           // newest first
}

function patchSitemap(xml, path, modIso) {
  const loc = `${SITE}/${path}`;
  const block = new RegExp(`(<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*(</lastmod>)`);
  if (block.test(xml)) return xml.replace(block, `$1${modIso}$2`);
  const entry = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${modIso}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  return xml.replace('</urlset>', entry + '</urlset>');
}

function patchLlms(txt, path, title, desc) {
  const url = `${SITE}/${path}`;
  const line = `- [${title.replace(/[\[\]]/g, '')}](${url}): ${desc.replace(/\s+/g, ' ')}`;
  const re = new RegExp(`^- \\[[^\\]]*\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\).*$`, 'm');
  if (re.test(txt)) return txt.replace(re, line);
  const anchor = '\n\n## Localized pages';
  return txt.includes(anchor) ? txt.replace(anchor, `\n${line}${anchor}`) : `${txt.trimEnd()}\n${line}\n`;
}

module.exports = { buildPage, patchIndex, patchSitemap, patchLlms, slugify, topicFor, cleanHtml, dateParts, SITE };
