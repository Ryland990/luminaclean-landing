// Local dev storage: a plain JSON file on disk. Zero external accounts needed.
// Swapped automatically for store.upstash.js once UPSTASH_* env vars are set —
// see store.js. This file only makes sense for local testing: it will NOT work
// once deployed to Vercel, because serverless functions can't reliably persist
// writes to local disk between invocations. Upstash becomes mandatory at that point.
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, '..', 'data.local.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { counts: {}, unique: {}, creativeCounts: {}, creatives: [], activity: [] };
  }
}
function save(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db));
}

async function recordEvent({ event, path: p, sessionId, utmSource, utmCampaign, utmContent }) {
  const db = load();
  const day = new Date().toISOString().slice(0, 10);
  db.counts[event] = (db.counts[event] || 0) + 1;
  db.counts[`page:${p}`] = (db.counts[`page:${p}`] || 0) + 1;
  db.counts[`page:${p}:${day}`] = (db.counts[`page:${p}:${day}`] || 0) + 1;
  db.pages = db.pages || [];
  if (!db.pages.includes(p)) db.pages.push(p);
  db.unique[event] = db.unique[event] || [];
  if (!db.unique[event].includes(sessionId)) db.unique[event].push(sessionId);

  db.activity.unshift({
    event, path: p, ts: Date.now(),
    utm_source: utmSource || null, utm_campaign: utmCampaign || null, utm_content: utmContent || null
  });
  db.activity = db.activity.slice(0, 200);

  if (utmCampaign && utmContent) {
    const key = `${utmCampaign}|${utmContent}`;
    if (!db.creatives.includes(key)) db.creatives.push(key);
    const ckey = `${event}:${key}`;
    db.creativeCounts[ckey] = (db.creativeCounts[ckey] || 0) + 1;
  }
  save(db);
}

async function getStats(FUNNEL) {
  const db = load();
  const funnel = FUNNEL.map((event) => ({
    event,
    raw: db.counts[event] || 0,
    unique: (db.unique[event] || []).length
  }));
  const skipCount = db.counts.try_demo_skip_story || 0;
  const creativeStats = db.creatives.map((c) => {
    const [campaign, content] = c.split('|');
    const stages = FUNNEL.map((e) => db.creativeCounts[`${e}:${c}`] || 0);
    return { campaign, content, stages };
  });
  return { funnel, skipCount, creativeStats, activity: db.activity.slice(0, 50) };
}

// Per-path pageview counts with one bucket per day (page:{path}:{YYYY-MM-DD}),
// covering the last `days` days including today. Dates are UTC to match recordEvent.
async function getPageStats(days) {
  const db = load();
  const dayList = [];
  for (let d = days - 1; d >= 0; d--) {
    dayList.push(new Date(Date.now() - d * 86400000).toISOString().slice(0, 10));
  }
  const pages = (db.pages || []).map((p) => ({
    path: p,
    total: db.counts[`page:${p}`] || 0,
    daily: dayList.map((d) => db.counts[`page:${p}:${d}`] || 0)
  }));
  pages.sort((a, b) => b.total - a.total);
  return { days: dayList, pages };
}

module.exports = { recordEvent, getStats, getPageStats };
