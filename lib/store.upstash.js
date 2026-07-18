// Production storage: Upstash Redis over its REST API. Used automatically once
// UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set — see store.js.
// This is what actually survives on Vercel, where serverless functions have no
// persistent local disk between invocations.
async function pipeline(commands) {
  const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  const resp = await fetch(`${REST_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands)
  });
  return resp.json();
}

async function recordEvent({ event, path, sessionId, utmSource, utmCampaign, utmContent }) {
  const activityEntry = JSON.stringify({
    event, path, ts: Date.now(),
    utm_source: utmSource || null, utm_campaign: utmCampaign || null, utm_content: utmContent || null
  });
  const day = new Date().toISOString().slice(0, 10);
  const commands = [
    ['INCR', `count:${event}`],
    ['SADD', `uniq:${event}`, sessionId],
    ['INCR', `count:page:${path}`],
    ['INCR', `count:page:${path}:${day}`],
    ['SADD', 'pages', path],
    ['LPUSH', 'activity', activityEntry],
    ['LTRIM', 'activity', '0', '199']
  ];
  if (utmCampaign && utmContent) {
    const creativeKey = `${utmCampaign}|${utmContent}`;
    commands.push(['SADD', 'creatives', creativeKey]);
    commands.push(['INCR', `count:${event}:${creativeKey}`]);
  }
  await pipeline(commands);
}

async function getStats(FUNNEL) {
  const commands = [];
  FUNNEL.forEach((e) => { commands.push(['GET', `count:${e}`]); commands.push(['SCARD', `uniq:${e}`]); });
  commands.push(['GET', 'count:try_demo_skip_story']);
  commands.push(['SMEMBERS', 'creatives']);
  commands.push(['LRANGE', 'activity', '0', '49']);

  const results = await pipeline(commands);
  let i = 0;
  const funnel = FUNNEL.map((event) => {
    const raw = Number(results[i++].result || 0);
    const unique = Number(results[i++].result || 0);
    return { event, raw, unique };
  });
  const skipCount = Number(results[i++].result || 0);
  const creatives = results[i++].result || [];
  const activityRaw = results[i++].result || [];
  const activity = activityRaw.map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);

  let creativeStats = [];
  if (creatives.length) {
    const ccommands = [];
    creatives.forEach((c) => FUNNEL.forEach((e) => ccommands.push(['GET', `count:${e}:${c}`])));
    const cresults = await pipeline(ccommands);
    let j = 0;
    creativeStats = creatives.map((c) => {
      const [campaign, content] = c.split('|');
      const stages = FUNNEL.map(() => Number(cresults[j++].result || 0));
      return { campaign, content, stages };
    });
  }
  return { funnel, skipCount, creativeStats, activity };
}

// Per-path pageview counts with one bucket per day (count:page:{path}:{YYYY-MM-DD}),
// covering the last `days` days including today. Dates are UTC to match recordEvent.
async function getPageStats(days) {
  const dayList = [];
  for (let d = days - 1; d >= 0; d--) {
    dayList.push(new Date(Date.now() - d * 86400000).toISOString().slice(0, 10));
  }
  const smembers = await pipeline([['SMEMBERS', 'pages']]);
  const paths = smembers[0].result || [];
  if (!paths.length) return { days: dayList, pages: [] };

  const commands = [];
  paths.forEach((p) => {
    commands.push(['GET', `count:page:${p}`]);
    dayList.forEach((d) => commands.push(['GET', `count:page:${p}:${d}`]));
  });
  const results = await pipeline(commands);
  let i = 0;
  const pages = paths.map((p) => {
    const total = Number(results[i++].result || 0);
    const daily = dayList.map(() => Number(results[i++].result || 0));
    return { path: p, total, daily };
  });
  pages.sort((a, b) => b.total - a.total);
  return { days: dayList, pages };
}

module.exports = { recordEvent, getStats, getPageStats };
