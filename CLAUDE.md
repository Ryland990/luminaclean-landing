# LuminaClean Landing Page

## Project Overview
LuminaClean is an iPhone photo cleaner app (App Store ID: 6757949814). This repo contains its landing page website.

## Useful Links

- **Google Search Console**: https://search.google.com/search-console — Monitor how your site appears in Google search results. Check indexing status, search performance (clicks, impressions, keywords), and any crawl errors. Logged in with nextstep.appstudio@gmail.com.
- **Vercel Dashboard**: https://vercel.com/ctplebs-projects/luminaclean-landing — Manage deployments, custom domain, and analytics. Auto-deploys on every push to main.
- **GitHub Repo**: https://github.com/Ryland990/luminaclean-landing — Source code. Push to main branch to trigger auto-deploy.
- **Live Site**: https://luminaclean.app
- **Vercel Preview URL**: https://luminaclean-landing.vercel.app (always works regardless of DNS)
- **Domain Registrar**: Namecheap (luminaclean.app) — DNS A record points to 76.76.21.21 (Vercel)

## Contact
- Email: nextstep.appstudio@gmail.com
- App Store: https://apps.apple.com/us/app/luminaclean-photo-cleaner/id6757949814

## Design System (ScreenRoast — matches the iOS app since its 2026-05 pivot)
- Background: near-black #0a0a0a surfaces (#111111 cards) + film-grain noise overlay
- Accents: hot pink #FF2E63 (brand) + lime #C7F464 (CTA/success); universe accents per feature
  (sage #9CAF88 organize, sepia #D4A373 flashback, indigo #7B5CFF blurry, audit red #E63946 optimize)
- Fonts: Anton (uppercase display), JetBrains Mono (labels/badges, wide tracking),
  Caveat (script accents, sparingly), system sans for body
- NO glassmorphism (no backdrop blur) — solid dark surfaces, 14/18px radii, lime CTA buttons
- Implementation: original CSS is recolored in place + a "SCREENROAST BRAND LAYER" override
  block at the end of each page's <style>. Edit the brand layer, not the legacy rules above it.

## Site Structure
- `index.html` — Landing page (single-file, inline CSS/JS, base64 images)
- `privacy.html` — Privacy Policy
- `terms.html` — Terms of Service
- `support.html` — Support/Contact
- `blog/index.html` — Blog index with card grid linking to 10 articles
- `blog/*.html` — 10 SEO blog articles on iPhone photo management topics
- `sitemap.xml` — All pages + blog articles
- `robots.txt`
- `assets/images/og-image.png` — OG image (1200x630) for social sharing
- `assets/images/icon.png` — App icon
- `assets/images/favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png` — Favicons
- `assets/images/privacy.PNG` — Privacy screenshot used in landing page
- `google8e791466d37d6ec2.html` — Google Search Console verification file (do not remove)

## What Has Been Done

### Session 1 (prior)
- Built landing page with dark purple/gold theme, glass-morphism design
- Created privacy, terms, and support pages with matching animated backgrounds
- Built blog system with 10 SEO articles on iPhone photo management
- Added JSON-LD Article schema and FAQPage schema to all blog articles
- Added complete meta tags (OG, Twitter, apple-itunes-app) to all articles
- Added "Key Takeaways" and "Related Articles" sections to all blog articles
- Fixed CTA button text colors across all blog pages
- Normalized canonical URLs to use .html extensions

### Session 2 (2026-01-31)
- Fixed stale local dev server (was returning empty replies on port 8080)
- Initialized git repo and pushed to GitHub (Ryland990/luminaclean-landing)
- Installed GitHub CLI (`gh`) and authenticated
- Installed Vercel CLI and deployed site to Vercel
- Connected custom domain `luminaclean.app` (DNS A record → 76.76.21.21, CNAME www → cname.vercel-dns.com)
- Fixed Vercel analytics script that was incorrectly placed inside `<style>` tag in blog/index.html
- Created OG image (1200x630) with app icon, purple background, gold tagline
- Created favicon files (32px, 16px, apple-touch-icon 180px) from app icon
- Updated all sitemap.xml lastmod dates to 2026-01-31
- Set up Google Search Console (verified via HTML file method)
- Submitted sitemap.xml to Google Search Console

### Session 3 (2026-07-02)
- Full ScreenRoast reskin of all 21 pages (index, privacy, terms, support, blog index + 16 articles):
  color remap purple/gold/teal → pink/lime + universe accents, Anton/JetBrains Mono/Caveat fonts,
  glassmorphism removed, lime CTA buttons, per-feature universe accent borders on bento cards
- Copy fixes: "no subscription" → "no subscription required" (app sells an optional monthly sub),
  hero badge "No Paywall" → "No Account", removed stale "NEW" badges on year-old features
- Updated this file's Design System section

### Session 3b (2026-07-02, same day)
- Replaced all in-page screenshots with post-pivot captures John provided (in `../New Screenshots /`):
  hero-mess, organize-categories, swipe-keep, dailybites-timeline, flashback-sections, review-wrapit
  (.jpeg, 602x1308). Old pre-pivot images git-rm'd (recoverable from history). Schema screenshot
  URLs + alt texts updated to match.
- Regenerated og-image.png (1200x630) on-brand via headless Chrome (source: scratchpad og.html)

### Session 3c (2026-07-02, SEO/AIO pass)
- Corrected fabricated schema values against real App Store data (iTunes lookup API):
  ratingCount 1200 → 40, OS 15.0 → 17.6, softwareVersion 1.0 → 2.7, datePublished 2024-01-01 → 2026-01-20.
  NEVER inflate these — fake review markup risks a Google structured-data manual action.
- Added llms.txt (AI-crawler site summary; keep updated when posts are added)
- Populated Organization sameAs (App Store + @ct_pleb X profile)
- Bumped all sitemap lastmod to 2026-07-02

### Session 3d (2026-07-02, mascot icon)
- New site icon: lime-mascot artwork (source: `../New Screenshots /mascot.png`, 1024px).
  Regenerated icon.png (512), apple-touch-icon (180), favicon-32/16, and re-rendered og-image with it.
  NOTE: the App Store app icon is still the old purple one (deliberate, separate art task) —
  site and store icons differ until John updates the app side.

### Session 4 (2026-07-02, web2app swipe demo)
- Built /try.html: 60-second interactive swipe-to-clean demo (web2app funnel top).
  Three beats: pain-point intro → 6-card swipe deck (SVG sample "photos" stamped SAMPLE:
  screenshot/EXHIBIT A, blurry/OUT OF FOCUS, keeper sunset, TWINS duplicate, LOOKALIKES
  similar, dog keeper) → honest result screen with App Store CTA.
  Deliberate design: includes KEEP moments (brand = "keep the memories"), coaching toasts on
  "wrong" swipes (mentions Recently Deleted safety), no dark patterns, no fake urgency.
- Attribution: own AppsFlyer OneLink init with campaign defaultValue "try-demo" (UTMs still
  override for ads). Vercel custom events: try_demo_start / try_demo_complete / try_demo_store_click.
- Wired: nav "Try It" link, mobile menu, hero demo link, sitemap entry, llms.txt entry.

### Session 4b (2026-07-02, John's feedback round)
- /try.html v2: replaced static intro with 5 tap-through story slides (Instagram-story bars,
  stamp-slam entrances, skip link, new event try_demo_skip_story). Slide 1 mirrors the app's
  own onboarding ("Your library is a mess").
- Result screen: freed-MB now counts up huge (Anton, lime) then a pink "GONE ✦" stamp slams in
  with a body shake. Gotcha fixed: stampSlam keyframes must declare opacity at 75%/100% —
  elements with base opacity:0 (payoff stamp) otherwise end invisible under fill:both.
- Favicon cache-bust (?v=2 on all favicon/apple-touch/nav-icon URLs, 16 files) — John saw the
  old purple icon due to browser favicon cache; files were already correct on disk and live.

### Session 4c (2026-07-02, real demo photos + bigger payoff)
- Deck cards now use John's GPT-image photos (assets/images/demo/, source `../New Screenshots /GPT/`):
  receipt, blurry sunset, sharp sunset (reused twice = literally an exact duplicate), lookalike
  sunset with bird, retriever+kitten. SVG art generators removed. Captions kept per John.
- Per-card lime file-size chips; realistic 48MP sizes; junk total now 37.4 MB
  ("sample math at 48-megapixel sizes" note keeps it honest).
- Count-up hardened with a setTimeout completion fallback (background-tab rAF throttling).
- img cards need draggable=false + -webkit-user-drag:none or native image-drag breaks swiping.

### Session 5 (2026-07-02, TikTok ads pixel)
- Installed TikTok Pixel (browser-only method — site is static/Vercel, no backend for Events API)
  sitewide in <head>, all 22 pages. Pixel ID D933DJ3C77U133LMH9CG.
- try.html track() now also fires ttq.track() for 3 mapped events:
  try_demo_deck → 'ViewContent' (TikTok optimization target — fires on EITHER finishing the
  story OR clicking skip, so it always means "reached the swipe mechanic", not the earlier
  first-tap try_demo_start), try_demo_complete → 'DemoComplete' (custom), try_demo_store_click
  → 'ClickButton'. Verified live: pixel + all 3 events POST 200 to analytics.tiktok.com.
- TikTok campaign plan (capped $140 test, 7 days, $20/day, iOS+US/UK/CA/AU only): Sales →
  Website objective (not App Promotion — would skip the demo). Optimize on ViewContent once it
  has event volume (visit /try.html once after any deploy to seed it). Kill criteria: <30%
  landing→ViewContent, <40% ViewContent→DemoComplete, <10% →ClickButton, or CPC on ClickButton
  >$5. Do not extend budget past the cap without re-deriving math — LuminaClean's $8.99
  lifetime price means breakeven CAC is ~$0.40-0.50/install; this test buys funnel data and a
  reusable organic hook, not profitable paid acquisition (see [[project_web2app_try_demo]]).

### Session 6 (2026-07-02, self-owned analytics — built + merged into this repo)
- Sandbox built at `/Users/rp/CascadeProjects/WebAnalytics/` first (self-owned funnel dashboard,
  avoids Vercel's paid Events tier and TikTok's dashboard). Storage is auto-switching
  (`lib/store.js`): local JSON file with zero setup when no Upstash env vars are set, real
  Upstash Redis (REST API) the moment they are — same api/track.js + api/stats.js code runs
  unchanged either way, and unchanged again once deployed to Vercel (CommonJS
  `module.exports = async (req,res)=>{}`, matches Vercel's serverless convention exactly).
- MERGED into this repo (2026-07-02, same day): api/track.js, api/stats.js, lib/store*.js,
  and signal.html (renamed from dashboard.html; noindex/nofollow, key-gated via STATS_KEY).
  try.html's track() now POSTs to /api/track on every funnel event (session id via
  crypto.randomUUID() in localStorage `lc_sid`, plus utm_source/campaign/content from the URL).
- Funnel shown is 3 stages: try_demo_deck → try_demo_complete → try_demo_store_click.
  try_demo_deck (not try_demo_start) is the correct top-of-funnel — it fires whether someone
  taps through the story OR clicks skip, so it's the superset; using try_demo_start as stage 1
  produced impossible >100% "drop-off" for skippers. try_demo_start/skip_story are reported
  separately as "entry path" context above the funnel, not as a funnel stage.
- Verified END TO END for real (not simulated): ran dev-server.js (gitignored, Node http shim
  that executes the real api/*.js against the real try.html/signal.html — the static
  `landing-static` python server can't run serverless functions, so this was necessary for a
  true test), loaded /try.html?utm_source=tiktok&utm_campaign=tt-try-test1&utm_content=roast-hook
  in the browser, clicked through the ACTUAL page (skip → 6 swipes → store click), then confirmed
  /api/stats showed the exact real events with correct UTMs. Test data wiped after (data.local.json).
- John provided real Upstash credentials (database "calm-moose-42257") same day. Verified
  end-to-end for real against the ACTUAL Upstash instance: ran the full try.html funnel in-browser
  (skip → 6 swipes → store click) via dev-server.js, confirmed signal.html read back the correct
  events/UTMs from Upstash, then wiped that test run with flush-test-data.js (gitignored, one-off,
  reads creds from .env.local — reusable if test data needs clearing again later). Dashboard now
  confirmed at a clean zero state.
- LESSON: never pass secrets as literal Bash command-line arguments (e.g. curl -H "Authorization:
  Bearer <token>") — got flagged mid-session for pasting the raw Upstash token into a curl call.
  Always write secrets to .env.local (or reference already-set env vars) and let the
  script/process read them internally; a Bash command's visible text should never contain a
  literal secret, only variable/file references.
- STILL BLOCKED on: (1) adding UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN / STATS_KEY as
  real env vars in Vercel's project dashboard (Settings → Environment Variables) — this is
  dashboard-only, Vercel deliberately disallows declaring secrets in vercel.json, and no `vercel`
  CLI is installed/authenticated on this machine (deploys have only ever gone through git push +
  Vercel's GitHub integration all session) — John needs to add these three himself; (2) explicit
  go-ahead to push api/, lib/, signal.html, and the try.html tracking changes live.

### Session 7 (2026-07-10, DE/FR localization pilot)
- John chose French + German for the site-localization pilot (SEO play: app already localized
  in both, funnel intact end-to-end; grounded in App Sprint per-storefront keyword data —
  DE: speicher/fotos aufräumen/doppelte/fotoreiniger, FR: stockage/nettoyeur/nettoyeur ia/doublons).
- Built 10 pages: /de/ + /fr/ homepages (full transforms of index.html via replacement-map
  scripts in scratchpad), /de/try.html + /fr/try.html (AppsFlyer campaigns try-demo-de/-fr,
  same analytics event names so Signal aggregates one funnel, paths distinguish locales),
  3 guides each under /de/blog/ + /fr/blog/ (storage pillar, duplicates 4-methods,
  no-subscription/Abofalle comparison — DE leans into Abofalle angle, FR into nettoyeur IA).
- Register matches the APP's own localization (checked Localizable.xcstrings): du/tu informal;
  reused app vocabulary (CHAOS/BORDEL, Behalten/Garder, Doppelgänger/sosies, Mediathek/Photothèque).
- Localized pages drop the aggregateRating schema + hero star row (DE/FR storefronts have no
  reviews — verified via iTunes RSS; testimonials keep EN quotes labeled "(EN)", never translate
  real reviews). Replaced the rating stat cell with the anti-Abo "einmal zahlen / zéro abo" stat.
- hreflang wired bidirectionally (5 EN counterparts got en/de/fr/x-default), sitemap +10 URLs
  (32 total), llms.txt has a localized-pages section. All JSON-LD validated, funnel verified
  live on /de/try.html (events land in Upstash with the /de path; test data flushed after).
- FOLLOW-UP for John: in-page app screenshots on DE/FR pages still show the EN app UI —
  recapture from the app set to German/French when convenient (app itself is localized).

### Session 8 (2026-07-11, Traditional Chinese)
- John requested zh-Hant after a real Taiwan purchase overnight (better signal than the Vercel
  "China" traffic, which is bot-shaped: 27% CN + 15% SG + 20% Linux + 90% bounce on an iOS-only
  product — documented as NOT a reason to localize). zh-Hant targets TAIWAN/HK (Google-dominant,
  iOS-heavy); mainland China is unreachable via Google and reads Simplified anyway.
- Built /zh-hant/: homepage + try.html transforms + 3 guides (English slugs: iphone-storage-full,
  delete-duplicate-photos, no-subscription-photo-cleaner). Vocabulary from the app's own
  Localizable.xcstrings zh-Hant (亂成一團/保留/刪除/圖庫/相似照/「最近刪除」/「當年今日」).
  AppsFlyer campaign try-demo-zh. Anton has no CJK glyphs — headings fall back to heavy system
  font, which reads fine (deliberate, no webfont added).
- Wired: zh-Hant hreflang line added to all 15 existing cluster pages, 中文（繁體）added to all
  language dropdowns + mobile rows + guide footers, sitemap now 37 URLs, llms.txt updated.
  Verified: zh homepage/demo render, funnel fires, 4-language switcher maps like-for-like.
- REMINDER carried from June: the zh-Hant App Store listing (app-store-listings-zh-Hant-uk-pl.md
  in the app repo) is still NOT pasted into App Store Connect — the web funnel now lands TW users
  on a store listing that isn't in their language. Publishing it is the missing funnel piece
  (ASC API could do it with John's approval).

## Remaining Tasks
- PUBLISHED 2026-07-11 (commit 0a669be): DE/FR pilot + Signal analytics live. STILL PENDING:
  John must add Vercel env vars (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, STATS_KEY)
  or Signal/track endpoints return 500 (localized pages unaffected). Resubmit sitemap in GSC/Bing.
- Consider linking /try.html from blog article CTA boxes (16 articles) once the demo proves itself
- After DE/FR indexing settles (4–8 weeks): read GSC impressions per locale before any 3rd language
- OPEN QUESTION for John: the "photos cleaned" live counter is synthetic (1,847,293 base + 2,000/day
  formula in JS). AI engines may quote it as fact — consider replacing with a real PostHog number or cutting it.
- Review blog article quality — AI-generated content may need polish for accuracy and tone
- Test all pages on mobile — verify responsive design
