# PARKED — luminaclean.app (noticed, not done)

## Placeholders
- Homepage "Photos cleaned 1,847,293 and counting" counter is synthetic (JS
  formula, not a real metric). Decide: replace with a real number or cut.

## Data fixes
- App Store listing v3.1 still says "monthly plan or one-time Lifetime Access"
  in 7 locales. Locked until the next app version — replacement text ready in
  ../app-store-description-pricing-fix.md; apply via asc.py when v3.2 exists.
- Two July posts (is-cleanmyphone-worth-it, recover-permanently-deleted-photos)
  show 0 Google impressions after 7 weeks; one is "crawled, not indexed". Hit
  Request Indexing in GSC for both, then re-judge all 10 July posts ~2026-10-22.
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
