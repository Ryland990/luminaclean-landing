// Vercel serverless function: POST /api/outrank — Outrank.so publishing webhook.
// Each article becomes blog/<slug>.html in the site's own design, its images are
// copied into the repo (so they survive cancelling Outrank), and the blog index,
// sitemap and llms.txt are patched — all in ONE commit to main via the GitHub
// API, which Vercel then deploys. Spec: https://www.outrank.so/docs/webhook
//
// Env: OUTRANK_WEBHOOK_TOKEN (same value as the Access Token in Outrank),
//      GITHUB_TOKEN (fine-grained, Contents read/write on this repo only),
//      optional OUTRANK_GITHUB_REPO / OUTRANK_GITHUB_BRANCH, OUTRANK_DRY_RUN=1.
const crypto = require('crypto');
const page = require('../lib/outrank-page');

const REPO = process.env.OUTRANK_GITHUB_REPO || 'Ryland990/luminaclean-landing';
const BRANCH = process.env.OUTRANK_GITHUB_BRANCH || 'main';
const MANIFEST = 'content/outrank-posts.json';
const IMG_DIR = 'assets/images/blog/outrank';
const MAX_IMG = 5 * 1024 * 1024;
const INDEXNOW_KEY = '5723de94d2a54f8219a2d5344133cf91';
// Outrank's documented sample payload — never publish it if a test sends it.
const SAMPLE_IDS = new Set(['123456', '789012']);
const MIN_CONTENT = 1500;

function tokenOk(req) {
  const want = process.env.OUTRANK_WEBHOOK_TOKEN || '';
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!want || !m) return false;
  const a = Buffer.from(m[1].trim()), b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function gh(method, path, body) {
  const r = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'luminaclean-outrank-webhook',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 404 && method === 'GET') return null;
  const json = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(`GitHub ${method} ${path} → ${r.status}: ${json.message || ''}`);
    err.status = r.status;
    throw err;
  }
  return json;
}

async function readFile(path, ref) {
  const f = await gh('GET', `/contents/${encodeURI(path)}?ref=${ref}`);
  if (!f) return null;
  if (f.content != null && f.encoding === 'base64' && f.content !== '') return Buffer.from(f.content, 'base64').toString('utf8');
  const blob = await gh('GET', `/git/blobs/${f.sha}`);          // files > 1 MB
  return Buffer.from(blob.content, 'base64').toString('utf8');
}

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
async function fetchImage(url) {
  try {
    const r = await fetch(url, { redirect: 'follow' });
    if (!r.ok) return null;
    const type = (r.headers.get('content-type') || '').split(';')[0].trim();
    const buf = Buffer.from(await r.arrayBuffer());
    if (!EXT[type] || buf.length === 0 || buf.length > MAX_IMG) return null;
    return { buf, ext: EXT[type] };
  } catch { return null; }
}

// Copies cover + body images into the repo; returns rewritten HTML and blobs.
async function localiseImages(a, slug) {
  const files = [];
  let html = String(a.content_html || '');
  let coverSrc = null;
  if (a.image_url) {
    // Outrank often repeats the cover as the first body image; the page shows it once.
    const esc = a.image_url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`^\\s*(<p>\\s*)?<img\\b[^>]*src=["']${esc}["'][^>]*>(\\s*</p>)?`, 'i'), '');
    const img = await fetchImage(a.image_url);
    if (img) {
      coverSrc = `/${IMG_DIR}/${slug}-cover.${img.ext}`;
      files.push({ path: coverSrc.slice(1), buf: img.buf });
    } else coverSrc = null;
  }
  const srcs = [...new Set([...html.matchAll(/<img\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["']/gi)].map((m) => m[1]))];
  let n = 0;
  for (const src of srcs) {
    if (/^https?:\/\/(www\.)?luminaclean\.app\//i.test(src)) continue;
    const img = await fetchImage(src);
    if (!img) continue;                     // leave the remote URL in place
    const local = `/${IMG_DIR}/${slug}-${++n}.${img.ext}`;
    files.push({ path: local.slice(1), buf: img.buf });
    html = html.split(src).join(local);
  }
  return { html, coverSrc, files };
}

function realArticle(a) {
  return a && typeof a === 'object' && !SAMPLE_IDS.has(String(a.id)) && a.title &&
    String(a.content_html || '').length >= MIN_CONTENT;
}

async function processBatch(articles, type) {
  const ref = await gh('GET', `/git/ref/heads/${BRANCH}`);
  const headSha = ref.object.sha;
  const head = await gh('GET', `/git/commits/${headSha}`);

  const manifest = JSON.parse((await readFile(MANIFEST, headSha)) || '[]');
  let index = await readFile('blog/index.html', headSha);
  let sitemap = await readFile('sitemap.xml', headSha);
  let llms = await readFile('llms.txt', headSha);
  if (!index || !sitemap || !llms) throw new Error('could not read index/sitemap/llms from repo');

  const today = new Date().toISOString().slice(0, 10);
  const textFiles = {};
  const binFiles = [];
  const done = [];

  for (const a of articles) {
    if (!realArticle(a)) { done.push({ id: a && a.id, skipped: 'sample or too short' }); continue; }
    let entry = manifest.find((m) => m.id === String(a.id));
    // Outrank "Improvements" can target any page with Search Console traffic,
    // including hand-written posts. Updates only ever touch Outrank's own posts.
    if (!entry && type === 'update_article') { done.push({ id: String(a.id), skipped: 'update for a page Outrank did not publish' }); continue; }
    let path;
    if (entry) {
      path = entry.path;                                   // update: same URL forever
    } else {
      // New article: never overwrite a hand-written post or an earlier Outrank one.
      const base = page.slugify(a.slug || a.title);
      let slug = base;
      for (let i = 1; ; i++) {
        const candidate = `blog/${slug}.html`;
        const taken = textFiles[candidate] || manifest.some((m) => m.path === candidate) ||
          (await gh('GET', `/contents/${candidate}?ref=${headSha}`));
        if (!taken) { path = candidate; break; }
        slug = i === 1 ? `${base}-guide` : `${base}-${i}`;
      }
      entry = { id: String(a.id), path, created_at: a.created_at || new Date().toISOString() };
      manifest.push(entry);
    }
    const slug = path.replace(/^blog\//, '').replace(/\.html$/, '');
    const { html, coverSrc, files } = await localiseImages(a, slug);
    binFiles.push(...files);

    textFiles[path] = page.buildPage(a, { path, coverSrc, contentHtml: html, published: entry.created_at, modified: new Date().toISOString() });
    const file = path.replace(/^blog\//, '');
    const desc = String(a.meta_description || '').trim();
    index = page.patchIndex(index, file, a.title, desc, entry.created_at);
    sitemap = page.patchSitemap(sitemap, path, today);
    llms = page.patchLlms(llms, path, a.title, desc);
    Object.assign(entry, { title: a.title, topic: page.topicFor(a), updated_at: new Date().toISOString() });
    done.push({ id: String(a.id), path });
  }

  const published = done.filter((d) => d.path);
  if (!published.length) return { done, commit: null };
  if (process.env.OUTRANK_DRY_RUN === '1') return { done, commit: 'dry-run', urls: published.map((d) => `${page.SITE}/${d.path}`) };

  Object.assign(textFiles, {
    'blog/index.html': index, 'sitemap.xml': sitemap, 'llms.txt': llms,
    [MANIFEST]: JSON.stringify(manifest, null, 2) + '\n',
  });
  const tree = [];
  for (const [path, content] of Object.entries(textFiles)) tree.push({ path, mode: '100644', type: 'blob', content });
  for (const f of binFiles) {
    const blob = await gh('POST', '/git/blobs', { content: f.buf.toString('base64'), encoding: 'base64' });
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const newTree = await gh('POST', '/git/trees', { base_tree: head.tree.sha, tree });
  const titles = articles.filter(realArticle).map((a) => a.title);
  const message = titles.length === 1 ? `Outrank: ${titles[0]}` : `Outrank: ${titles.length} articles\n\n- ${titles.join('\n- ')}`;
  const commit = await gh('POST', '/git/commits', { message, tree: newTree.sha, parents: [headSha] });
  await gh('PATCH', `/git/refs/heads/${BRANCH}`, { sha: commit.sha, force: false });   // fails on a race → retried

  return { done, commit: commit.sha, urls: published.map((d) => `${page.SITE}/${d.path}`) };
}

async function pingIndexNow(urls) {
  if (!urls || !urls.length || BRANCH !== 'main') return;
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: 'luminaclean.app', key: INDEXNOW_KEY, keyLocation: `${page.SITE}/${INDEXNOW_KEY}.txt`, urlList: urls }),
    });
  } catch { /* best effort */ }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  if (!tokenOk(req)) { res.status(401).json({ error: 'Invalid access token' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const { event_type: type, data = {} } = body;
  const articles = type === 'publish_articles' ? (data.articles || [])
    : type === 'update_article' ? (data.article ? [data.article] : [])
    : [];
  if (!articles.length) {
    res.status(200).json({ message: 'Webhook processed successfully', note: `nothing to publish for ${type || 'unknown event'}` });
    return;
  }
  if (!process.env.GITHUB_TOKEN) { res.status(500).json({ error: 'GITHUB_TOKEN not configured' }); return; }

  for (let attempt = 1; ; attempt++) {
    try {
      const result = await processBatch(articles, type);
      console.log('[outrank]', type, JSON.stringify(result));
      if (result.commit && result.commit !== 'dry-run') await pingIndexNow(result.urls);
      res.status(200).json({ message: 'Webhook processed successfully', ...result });
      return;
    } catch (e) {
      console.error('[outrank] attempt', attempt, e.message);
      if (attempt < 3 && (e.status === 422 || e.status === 409 || e.status >= 500)) continue;
      res.status(500).json({ error: e.message });
      return;
    }
  }
};
