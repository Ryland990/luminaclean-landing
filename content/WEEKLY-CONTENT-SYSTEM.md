# Weekly content system — luminaclean.app (started 2026-10-06)

Goal: get LuminaClean quoted by Google's AI answers, ChatGPT, Copilot and Perplexity for the questions iPhone users actually ask, and turn those readers into installs. Every piece still passes `SEO-PIPELINE.md` (7 gates), `product-facts.md` and `banned-words.md`.

## The weekly rhythm (4 pieces a week, Tuesday is the work day)

| Day | What happens | Who |
|---|---|---|
| Tuesday | Pull fresh data (below), pick the week's 4 pieces, write/edit, verify, show Razvan | Claude |
| Tuesday/Wednesday | Razvan reads the summary and says "push" | Razvan |
| After push | Sitemap, llms.txt, blog index, IndexNow, request indexing in GSC for new URLs | Claude (GSC click: Razvan) |
| Every 4 weeks | Judge every change that is ≥ 4 weeks old (see Measurement) and feed winners back into the method | Claude |

The 4 pieces each week:
- **2 new question posts**: questions no page of ours answers yet.
- **2 recycles**: existing posts that get new answer headings, fresher facts, or a title rewrite (see Recycling).

Outrank publishes ~7 articles/week on top of this until the trial ends (2026-11-01). Don't write a post Outrank already covered; check `content/outrank-posts.json` and the Outrank planner first.

## Where the questions come from (check in this order)

1. **GSC long questions**: property `https://luminaclean.app/` (the Domain property is not on Razvan's account) → Performance → last 28 days → Query filter, Custom (regex): `^(\S+\s){6,}\S+$`. These 7+ word queries are the closest thing to how people talk to AI. Sort by impressions.
2. **GSC near misses**: any query at position 4–15 with many impressions and a CTR under 1%.
3. **Reddit via ChatGPT** (monthly): ask ChatGPT (Razvan's account, Chat mode, web search) for the 25 most common/rising iPhone photo-cleanup questions on r/iphonehelp, r/iCloud, r/iOS, r/ApplePhotos, r/iphone, with thread links, plus "5 questions nobody answers well". Last run: `long-question-research-2026-10.md`.
4. **GSC "generative AI features" report** (Performance page banner → Open report) and **Bing Webmaster → AI Performance** (Copilot citations): which pages AI already quotes.
5. `keyword-backlog.md`, App Store reviews, support emails.

Also every week: GSC > Indexing > Pages. Only act if a real page (blog post, homepage, try page) shows under Not found, Crawled - not indexed, or Blocked. Known harmless: /api/track (blocked on purpose), /cdn-cgi/l/email-protection (old hosting leftover).

## How to pick (score each candidate 0–2 on each, take the top 4)

- **Demand**: GSC impressions summed across phrasings, or Reddit frequency High/Rising.
- **Product fit**: can LuminaClean honestly help the reader? (storage, duplicates, similar shots, screenshots, blurry, videos, cleanup fear = 2; iCloud/System Data = 1; unrelated = 0, skip).
- **Gap**: no page answers it as its main question (new post) or a page ranks 4–15 without answering it in the first lines (recycle).
- **Freshness**: iOS 26 change or rising on Reddit.
- **No overlap**: not already covered by one of our posts or an Outrank article (otherwise recycle that page instead).

Rule of thumb: **a page of ours already shows for it → recycle (add the heading). No page shows → new post.**

## The post template (what made the structure work)

1. `<title>` and H1 carry the main question in plain words, year in brackets.
2. **First thing in the article: the exact question as an H2 (with an id), then a 2-sentence answer containing one specific number or fact.** This is the part AI answers lift.
3. Short-answer box, then sections per cause/method with how to tell + fix.
4. Lumina aside before the 3rd H2, topic matched (storage / duplicates / screenshots / blurry / shopping / gentle for loss-and-recovery topics). Tagged `data-appcore-cta="lumina:<topic>"`.
5. One honest product section (scans on the iPhone, nothing uploaded, swipe to keep/delete, Recently Deleted first, free video compression, 65 free deletes then 10 more every day, optional Premium). Bottom CTA box tagged `article-box`.
6. Related guides (3–5 internal links), FAQ of 4–5 long-question variants mirrored in FAQPage JSON-LD.
7. Template file to copy: `blog/how-long-iphone-find-duplicates.html`. Writers: Opus subagents with a self-contained brief; Claude verifies facts, banned words, JSON-LD and renders the page before showing Razvan.

**Title rule (2026-10-20):** ≤70 characters including any brand suffix (Bing flags >70; Google shows ~60 and adds the site name itself). The question goes first, in plain words, with (2026). Leave off " | LuminaClean" when it pushes a title over 70.

## Recycling (the other half of the system)

1. **Answer headings (weekly)**: for every long question a page already shows for, add the exact question as an H2 + 2-sentence answer near the top and to its FAQ schema. Bump `dateModified`.
2. **Title/description rewrite (when CTR < 1% at position ≤ 10)**: rewrite to match the top query's wording.
3. **Fact refresh (when iOS changes)**: iOS menu paths, screenshots, version names. Bump `dateModified` only when content changed.
4. **Merge or retire (quarterly, ≥ 3 months old)**: overlapping weak posts get merged into the stronger one with a 301 in `vercel.json` (method: `memory/project_blog_prune_expand`). Outrank articles that compete with a hand-written post: keep the better one, 301 the other.
5. **Off-site reuse (draft only, Razvan posts)**: each new post → one genuine Reddit answer draft (no link where the sub forbids it) and one short X post. Claude never posts on Razvan's behalf.
6. **Unpublished drafts**: `content/drafts/` (photo-cleaner-stuck-scanning, best-swipe-to-delete-photo-apps-iphone) get re-checked against today's facts and used as recycle slots.

## Measurement

Log every change in `## Baseline for the 2026-10-06 changes (GSC, 28 days ending ~2026-10-05)

Pages: why-iphone-storage-full 119 clicks / 20,311 impr / pos 7.1 · photo-library-crashing 24 / 4,161 / 6.7 · best-duplicate-cleaner 4 / 3,153 / 7.4 · recently-deleted 0 / 414 / 7.9 · cleaner-app-deleted-from-icloud 1 / 241 / 7.9 · merge-exact-copies and how-long-storage-update: too few to list.
Target questions (all phrasings together): 0 clicks / 756 impressions. Biggest: "best app to delete duplicate photos on iphone free" 174 impr p8.2 · "i deleted all my photos but it still says storage full iphone" 163 p9.5 · "how long do recently deleted photos stay on iphone" 70 p8.1 · "why does my photos app keep crashing" 39 p8.6 · "does merging photos on iphone delete them" 25 p7.2 · storage-goes-up phrasings ~150 combined p6–10.

## Change log` below (date, page, question, type). After 4 weeks, per change:
- GSC: that query's position and CTR vs before; the page's clicks.
- FolioKit: page views and App Store taps/installs for that page (Growth tab, or ask Claude for `web_cta_summary`).
- Bing AI Performance / GSC AI report: is the page cited?
Winner = position or clicks up and no drop elsewhere. Three winners in a row → keep the method; three flat → change the template, not the cadence.

## Calendar

**Week of Oct 6 (done today, pending push)**
- New: why-iphone-storage-goes-up-after-deleting-photos · delete-photos-from-iphone-keep-in-icloud
- Recycle (answer headings): why-iphone-storage-full-after-deleting-photos · recently-deleted-photos-take-up-storage · best-duplicate-photo-cleaner-iphone · iphone-photo-library-too-big-crashing · merge-exact-copies-iphone-photos

**Week of Oct 13 (live 2026-10-13; IndexNow sent, GSC indexing requested for both new URLs)**
- New: optimize-iphone-storage-not-freeing-space · ios-26-photos-camera-roll-merge-duplicates
- Recycle (fact refresh): Albums → Collections + Select > More (…) > Delete All in 16 posts (paths confirmed on Apple's iOS 27 guide too)
- Recycle: iphone-photos-duplicates-album-not-showing ← "Why isn't Apple's Duplicates feature finding obvious duplicates?" (+ removed unsourced "3–5×", "80%+", "byte-for-byte") · does-deleting-duplicates-delete-original: title "… Merge vs Delete (2026)" + 2 answer headings (page 4,929 impr / 14 clicks / 0.28% CTR at p6.8)
- Moved to Oct 20: find-remove-blurry-photos-iphone rework (its long queries are "how to unblur…" at p44–66, 28 impr: wrong intent, low value)
- Oct 14: Lumina button numbers still due

**Week of Oct 20 (prepared 2026-10-20, pending push)**
- New: which-similar-photo-to-keep-iphone · clean-up-thousands-of-iphone-photos
- Recycle: iphone-photo-privacy-safety ← "Are photo cleaner apps safe to use on iPhone?" + "What's the safest photo cleaner that won't upload my pictures?" · iphone-storage-full-free-space ← "Why is my iPhone storage full after the iOS 27 update?" + title rewrite
- Swapped out: do-photo-cleaner-apps-actually-work (40 impr / 0 clicks in 28 days, no visible queries) for iphone-storage-full-free-space (2,931 impr / 22 clicks / 0.8% CTR at p7.9; "ios 27 storage full" 29 impr, "iphone storage full after ios 27 update" 11). Scams question moves to a later week.
- No verdicts yet: the oldest changes (Oct 6) are 2 weeks old; first round Nov 3.

**Week of Oct 27**
- New: "How do I get rid of thousands of screenshots without going one by one?" · "Is it Photos or System Data filling my iPhone?" (honest: the app doesn't fix System Data)
- Recycle: the two parked drafts in `content/drafts/`
- Oct 28 Outrank verdict. Nov 3: judge the Oct 6 changes (first measurement round)

Later: Live Photos "remove the video part" (only once Live Photo conversion is free in the shipped app version), back-up-before-deleting guide.

## Change log

| Date | Page | Question / change | Type |
|---|---|---|---|
| 2026-10-06 | why-iphone-storage-full-after-deleting-photos | "I deleted all my photos but my iPhone still says storage full. Why?" | answer heading |
| 2026-10-06 | recently-deleted-photos-take-up-storage | "How long do deleted photos stay on iPhone?" | answer heading |
| 2026-10-06 | best-duplicate-photo-cleaner-iphone | "What is the best free app to delete duplicate photos on iPhone?" | answer heading |
| 2026-10-06 | iphone-photo-library-too-big-crashing | "Why does my Photos app keep crashing on iPhone?" | answer heading |
| 2026-10-06 | merge-exact-copies-iphone-photos | "Does merging photos on iPhone delete them?" | answer heading |
| 2026-10-06 | why-iphone-storage-goes-up-after-deleting-photos | new post | new |
| 2026-10-06 | delete-photos-from-iphone-keep-in-icloud | new post | new |
| 2026-10-06 | recently-deleted, how-long-storage-update, cleaner-app-deleted-from-icloud, clean-up-screenshots, shared-albums, blog index | Correction: Apple says Recently Deleted does NOT count toward iCloud storage (support.apple.com/en-us/108922); we had said it did | fact fix |
| 2026-10-13 | 16 posts (Recently Deleted, Duplicates, Media Types paths) | iOS 26 renamed Albums to Collections; Delete All is under Select > More (…) | fact fix |
| 2026-10-13 | iphone-photos-duplicates-album-not-showing | "Why isn't Apple's Duplicates feature finding obvious duplicates?" (cluster 124 impr p8.5; page 9,540 impr / 44 clicks / p7.0) | answer heading |
| 2026-10-13 | does-deleting-duplicates-delete-original | "Does deleting duplicates delete the original photo?" (76 impr p4.7, 0 clicks) + "Is it better to merge or delete duplicate photos?" (17 impr p7); title rewrite. Page 4,929 impr / 14 clicks / p6.8 | answer heading + title |
| 2026-10-13 | optimize-iphone-storage-not-freeing-space | new post (Reddit #11, rising fast; GSC ~0) | new |
| 2026-10-13 | ios-26-photos-camera-roll-merge-duplicates | new post (Reddit #20–22, rising; GSC "merge" cluster 25 impr) | new |
| 2026-10-13 | vercel.json | 301 /blog/why-iphone-storage-full-after-deleting-photos (no .html) → .html; it 404'd live while Google showed it (21 impr, p1.6) | fix |
| 2026-10-13 | best-photo-cleaner-no-subscription-iphone | "5.3× LuminaClean lifetime" → "yearly Premium" (no lifetime plan is sold) | fact fix |
| 2026-10-20 | iphone-photo-privacy-safety | "Are photo cleaner apps safe to use on iPhone?" + "What's the safest photo cleaner that won't upload my pictures?"; banned-word sweep, unsourced "privacy scandals" line cut. Page 1,146 impr / 16 clicks / 1.4% / p7.0; "safe" queries ~60 impr combined | answer heading |
| 2026-10-20 | iphone-storage-full-free-space | "Why is my iPhone storage full after the iOS 27 update?" (Apple Intelligence up to 8 / 14 GB, support.apple.com/en-us/121115); title "iPhone Storage Full on iOS 27? How to Free Up Space (2026)". Page 2,931 impr / 22 clicks / 0.8% / p7.9 | answer heading + title |
| 2026-10-20 | which-similar-photo-to-keep-iphone | new post (Reddit #6 + #25, High/rising; GSC ~0) | new |
| 2026-10-20 | clean-up-thousands-of-iphone-photos | new post (Reddit #5, High/rising; GSC ~0) | new |
| 2026-10-20 | find-duplicate-photos-guide, how-to-reduce-video-file-size-on-iphone-guide (Outrank) | removed in-prose prices ($5.99 / $17.99); prices only in tables | fact fix |
| 2026-10-20 | 17 pages (EN/DE/FR, incl. homepage) | Titles over 70 chars cut to ≤70 (Bing "Title too long", 5 pages flagged). Rule: question wording kept; drop " \| LuminaClean" first, reword only if still >70. Skipped the 4 answer-heading pages under test (does-deleting-duplicates, duplicates-album-not-showing, storage-goes-up, optimize-not-freeing) until their verdict | title length |
