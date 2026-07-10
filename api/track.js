// Vercel serverless function: POST /api/track
// Logs one funnel/interaction event via lib/store (local JSON file for dev,
// Upstash automatically once configured — see lib/store.js).
const store = require('../lib/store');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const event = typeof body.event === 'string' ? body.event.slice(0, 64) : '';
  if (!event) {
    res.status(400).json({ error: 'Missing event' });
    return;
  }
  const path = typeof body.path === 'string' ? body.path.slice(0, 200) : '/';
  const sessionId = typeof body.session_id === 'string' ? body.session_id.slice(0, 64) : 'unknown';
  const utmSource = typeof body.utm_source === 'string' ? body.utm_source.slice(0, 64) : null;
  const utmCampaign = typeof body.utm_campaign === 'string' ? body.utm_campaign.slice(0, 64) : null;
  const utmContent = typeof body.utm_content === 'string' ? body.utm_content.slice(0, 64) : null;

  try {
    await store.recordEvent({ event, path, sessionId, utmSource, utmCampaign, utmContent });
  } catch (e) {
    // Never fail the visitor's page over a tracking hiccup.
  }

  res.status(204).end();
};
