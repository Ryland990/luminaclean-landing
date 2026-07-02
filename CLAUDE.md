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

## Remaining Tasks
- Commit + push to publish (Vercel auto-deploys on push to main) — get John's approval first
- Consider linking /try.html from blog article CTA boxes (16 articles) once the demo proves itself
- OPEN QUESTION for John: the "photos cleaned" live counter is synthetic (1,847,293 base + 2,000/day
  formula in JS). AI engines may quote it as fact — consider replacing with a real PostHog number or cutting it.
- Review blog article quality — AI-generated content may need polish for accuracy and tone
- Test all pages on mobile — verify responsive design
