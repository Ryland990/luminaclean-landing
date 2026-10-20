# PARKED — luminaclean.app (noticed, not done)

## Placeholders
- **Outrank trial (paid 2026-10-01, renews 2026-11-01).** Auto-publishes to /blog via `api/outrank.js` (manifest `content/outrank-posts.json`). Baseline: Google Search Console = 86 clicks in the 7 days to 2026-10-01 (Razvan's GSC view). Outrank's "719 clicks" tile has no date range — don't compare against it.
  - **~2026-10-08 week-1 audit:** validate every Outrank post against `content/product-facts.md` (pricing, free tier, "sees", competitor claims, YouTube embeds) + list every outbound link (backlink-exchange links Outrank inserts for other members) and flag spam/off-topic domains → disable Network Participation or strip them in api/outrank.js → fix, or turn off "Mention similar products"/YouTube.
  - **~2026-10-28 verdict, before renewal:** GSC clicks vs baseline (site-wide AND Outrank pages only), `web_cta_summary('luminacleanweb', 30)` rows `outrank:*` vs `lumina:*`, backlinks gained (DR was 5). Keep or cancel. Outrank has no cancel button; Razvan blocked the merchant in Revolut on 2026-10-01, so the Nov 1 renewal fails unless he unblocks it. If ending: revoke the GitHub token "Outrank webhook" (expires 2026-11-30 anyway), delete Vercel env GITHUB_TOKEN + OUTRANK_WEBHOOK_TOKEN, decide keep/strip exchange links in Outrank posts.
- **Long-question experiment (started 2026-10-06) — judge ~2026-11-03.** Method (from an X post): GSC → Performance → Query filter, Custom (regex) `^(\S+\s){6,}\S+$` (7+ word queries ≈ how people ask AI) → pick a high-impression question that fits the product → on the page Google shows for it, add the exact question as an H2 near the top + answer in the first 2 sentences with one concrete fact (+ FAQ schema entry). Now run weekly via `content/WEEKLY-CONTENT-SYSTEM.md` (every change logged in its Change log; 5 answer headings + 2 new posts on 10-06). Test #1: query "i deleted all my photos but it still says storage full iphone" → blog/why-iphone-storage-full-after-deleting-photos.html (#deleted-all-photos-still-full). Baseline: get that query's 28-day clicks/impressions/position from Razvan's GSC. Judge: query position + CTR, page clicks, Bing/Copilot citations. If it works → repeat on the next 5-10 long questions (one page edit each) and brief new posts around uncovered long questions. Outrank test runs in parallel; this page also gets Outrank internal links, so compare against a similar untouched page.
- **Lumina button read-out 2026-10-14 (14 days = 30 days, tracking began 2026-09-30):** Lumina boxes 129 views, **0 taps** (storage 63, duplicates 35, shopping 22, screenshots/blurry/gentle 3 each). Top-bar `nav` 16 taps → 8 installs, 1 paying; `home:hero` 4 taps → 2 installs; `article-box` 0 taps (no row at all); `home:get-judged` 18 views 0 taps; `outrank:shopping` 2 views. Every topic is under 100 views → too early to judge any one topic. Only Lumina + get-judged send views, so nav/article-box tap rates can't be computed. **Decided 2026-10-14: keep her as is, re-read on 2026-10-28** with the Outrank verdict; if still 0 taps by ~250 views, reword storage + duplicates first. Odd: article-box 0 taps in 2 weeks across 47 posts — check it's firing.
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
- After their 4-week verdicts (Nov 3 / Nov 10): cut titles >70 chars on does-deleting-duplicates-delete-original (82), iphone-photos-duplicates-album-not-showing (74), why-iphone-storage-goes-up-after-deleting-photos (73), optimize-iphone-storage-not-freeing-space (72). Held back so the title change doesn't muddy the test. (2026-10-20)
- product-facts.md still says Apple "only catches pixel-identical duplicates" and the duplicates Lumina aside says "only catches exact copies"; both conflict with the "Apple doesn't publish its matching rules" rule. Reword once, then re-copy the aside. (2026-10-20)
- Outrank posts put prices in prose (fixed 2 on 2026-10-20). If Outrank re-sends an updated article it may overwrite the fix; add a price/lifetime check to api/outrank.js. (2026-10-20)
- Scams question ("Are iPhone cleaner apps scams?") for do-photo-cleaner-apps-actually-work is still open; page has only 40 impr/28 days. (2026-10-20)
- Unsourced/unverifiable claims still on older posts: "3–5× more duplicates" and "byte-for-byte/pixel-identical" (Apple doesn't publish its matching rules) in best-duplicate-photo-cleaner, delete-duplicate-photos, how-long-iphone-find-duplicates and others; ~200 banned-word hits ("genuinely", "actually", "comprehensive") across pre-pipeline posts. Sweep in one pass. (2026-10-13)
- Extensionless /blog/<slug> URLs 404 (only one is redirected now). Consider a general `/blog/:slug([^./]+)` → `/blog/:slug.html` redirect in vercel.json after checking GSC for others. (2026-10-13)
- Vercel Bot Protection is OFF; ~half of Vercel "visitors" are Linux/AWS bots.
  Turn on, or use the new BotID feature, so Vercel numbers stop lying.
- og-image only in 1.91:1; 4:3 and 1:1 variants would help article rich results.
- terms.html meta description is 51 chars (thin).

## Comms
- TikTok $140 test read-out never happened (Signal recorded nothing until
  2026-08-12). Campaign data since then is in /signal.html.
