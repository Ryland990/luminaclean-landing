// Vercel serverless function: GET /api/stats?key=...
// Reads back aggregated funnel counts, per-creative breakdown, and a recent
// activity feed via lib/store. Gated by a shared-secret query param so it
// isn't publicly scrapeable once this lives on the real domain.
const store = require('../lib/store');

// "try_demo_deck" is the real top of funnel: it fires whether someone taps
// through the story OR clicks skip, so it's a superset of try_demo_start and
// would otherwise make the funnel go UP between stages. try_demo_start /
// try_demo_skip_story are reported separately as entry-path context instead.
const FUNNEL = ['try_demo_deck', 'try_demo_complete', 'try_demo_store_click'];

module.exports = async (req, res) => {
  const STATS_KEY = process.env.STATS_KEY;
  if (!STATS_KEY || req.query.key !== STATS_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const data = await store.getStats(FUNNEL);
  const entryData = await store.getStats(['try_demo_start', 'try_demo_skip_story']);
  const entryPaths = {
    story: entryData.funnel[0].unique,
    skip: entryData.funnel[1].unique
  };

  res.status(200).json({ ...data, entryPaths, funnelLabels: FUNNEL });
};
