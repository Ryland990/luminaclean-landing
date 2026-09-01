// Same-domain ad tracking link: https://luminaclean.app/go
//
// Exists because OpenAI Ads gates OFF-domain destination links ("custom
// links") behind account verification — a link on the pixel's own site
// passes. Thin relay to FolioKit's campaign-link chain: forwards the click
// (oppref click reference, geography, address, UA) to the Supabase `go`
// function, which logs one campaign_clicks row and answers 302 to the App
// Store. Campaign defaults to oai-install; override with ?c=<slug> for
// future same-domain campaigns.
export const config = { runtime: "edge" };

const UPSTREAM = "https://shfpcykkzmzijpimpsrd.supabase.co/functions/v1/go";
const SLUG_RE = /^[a-z0-9-]{1,60}$/;

export default async function handler(req) {
  const url = new URL(req.url);
  const campaign = (url.searchParams.get("c") || "oai-install").toLowerCase();
  const safeCampaign = SLUG_RE.test(campaign) ? campaign : "oai-install";
  const oppref = url.searchParams.get("oppref");
  const ip = req.headers.get("x-real-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const country = req.headers.get("x-vercel-ip-country");
  const referer = req.headers.get("referer");
  const ua = req.headers.get("user-agent");
  try {
    const upstream = await fetch(
      `${UPSTREAM}?app=lc&campaign=${encodeURIComponent(safeCampaign)}`,
      {
        headers: {
          ...(country ? { "x-client-geo-country": country } : {}),
          ...(referer ? { "x-client-referer": referer } : {}),
          ...(ua ? { "x-client-ua": ua.slice(0, 300) } : {}),
          ...(oppref ? { "x-client-oppref": encodeURIComponent(oppref.slice(0, 300)) } : {}),
          ...(ip ? { "x-client-ip": ip } : {}),
        },
        redirect: "manual",
      },
    );
    const location = upstream.headers.get("location");
    if (upstream.status === 302 && location) {
      return new Response(null, {
        status: 302,
        headers: { location, "cache-control": "no-store" },
      });
    }
  } catch (e) {
    console.error("go relay failed:", e);
  }
  // Any failure: never strand a visitor — send them to the App Store direct.
  return new Response(null, {
    status: 302,
    headers: {
      location: "https://apps.apple.com/app/id6757949814",
      "cache-control": "no-store",
    },
  });
}
