// Auto-picks storage: Upstash if configured, otherwise a local JSON file.
// Both implement the same recordEvent()/getStats() shape, so api/track.js and
// api/stats.js never need to know which one is active.
const useUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
module.exports = useUpstash ? require('./store.upstash') : require('./store.local');
