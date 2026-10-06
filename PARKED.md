# PARKED — luminaclean.app (noticed, not done)

## Placeholders
- **Outrank trial (paid 2026-10-01, renews 2026-11-01).** Auto-publishes to /blog via `api/outrank.js` (manifest `content/outrank-posts.json`). Baseline: Google Search Console = 86 clicks in the 7 days to 2026-10-01 (Razvan's GSC view). Outrank's "719 clicks" tile has no date range — don't compare against it.
  - **~2026-10-08 week-1 audit:** validate every Outrank post against `content/product-facts.md` (pricing, free tier, "sees", competitor claims, YouTube embeds) + list every outbound link (backlink-exchange links Outrank inserts for other members) and flag spam/off-topic domains → disable Network Participation or strip them in api/outrank.js → fix, or turn off "Mention similar products"/YouTube.
  - **~2026-10-28 verdict, before renewal:** GSC clicks vs baseline (site-wide AND Outrank pages only), `web_cta_summary('luminacleanweb', 30)` rows `outrank:*` vs `lumina:*`, backlinks gained (DR was 5). Keep or cancel. Outrank has no cancel button; Razvan blocked the merchant in Revolut on 2026-10-01, so the Nov 1 renewal fails unless he unblocks it. If ending: revoke the GitHub token "Outrank webhook" (expires 2026-11-30 anyway), delete Vercel env GITHUB_TOKEN + OUTRANK_WEBHOOK_TOKEN, decide keep/strip exchange links in Outrank posts.
- **Long-question experiment (started 2026-10-06) — judge ~2026-11-03.** Method (from an X post): GSC → Performance → Query filter, Custom (regex) `^(\S+\s){6,}\S+$` (7+ word queries ≈ how people ask AI) → pick a high-impression question that fits the product → on the page Google shows for it, add the exact question as an H2 near the top + answer in the first 2 sentences with one concrete fact (+ FAQ schema entry). Test #1: query "i deleted all my photos but it still says storage full iphone" → blog/why-iphone-storage-full-after-deleting-photos.html (#deleted-all-photos-still-full). Baseline: get that query's 28-day clicks/impressions/position from Razvan's GSC. Judge: query position + CTR, page clicks, Bing/Copilot citations. If it works → repeat on the next 5-10 long questions (one page edit each) and brief new posts around uncovered long questions. Outrank test runs in parallel; this page also gets Outrank internal links, so compare against a similar untouched page.
- **Read Lumina button results ~2026-10-14** (2 weeks after launch). Ask Claude for "Lumina button numbers", or run from the appcore repo: `supabase db query --linked "select * from web_cta_summary('luminacleanweb', 14)"` → views / taps / installs / paying per button (lumina:<topic> vs nav / article-box / home:*). Decide: keep, reword the weak topics, or move her higher in posts. Taps are meaningful after ~1 week; installs need longer. (added 2026-09-30)
- Homepage "Photos cleaned 1,847,293 and counting" counter is synthetic (JS
  formula, not a real metric). Decide: replace with a real number or cut.

## Data fixes
- Localized blog posts (DE/FR/zh-Hant): ~8 Google clicks and 0 App Store clicks in 90 days, mostly on page 2. Re-judge ~Oct 11 (3 months) before adding any language. (2026-09-23)
- App Store listing v3.1 still says "monthly plan or one-time Lifetime Access"
  in 7 locales. Locked until the next app version — replacement text ready in
  ../app-store-description-pricing-fix.md; apply via asc.py when v3.2 exists.
- Re-judge the July posts ~2026-10-22 using Google AND Bing/Copilot data,
  not Google alone. As of 2026-09-23:
  - is-cleanmyphone-worth-it: 0 Google impressions, but it's the #1
    Copilot-cited page (112 citations for "cleanmyphone review") and has 6
    Bing clicks.
  - is-clever-cleaner-really-free: 8 Bing clicks (17% CTR).
  Don't cut either of them. recover-permanently-deleted and
  cancel-refund remain weak on both engines.
- Resubmit sitemap in GSC + Bing after the 2026-09-09 publish (3 removals,
  4 additions).

## Product ideas
- Batch C drafts (photo-cleaner-stuck-scanning, best-swipe-to-delete-photo-apps)
  never published — sitting in content/drafts/ (now pricing-corrected). Publish
  or delete.
- Language #4 gate: FR guide already clicks at 4.5% CTR, zh-Hant homepage at
  position 5.8 — revisit after the localized guides have 3 months of data.

## Code health
- Vercel Bot Protection is OFF; ~half of Vercel "visitors" are Linux/AWS bots.
  Turn on, or use the new BotID feature, so Vercel numbers stop lying.
- og-image only in 1.91:1; 4:3 and 1:1 variants would help article rich results.
- terms.html meta description is 51 chars (thin).

## Comms
- TikTok $140 test read-out never happened (Signal recorded nothing until
  2026-08-12). Campaign data since then is in /signal.html.
