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

## Recycling (the other half of the system)

1. **Answer headings (weekly)**: for every long question a page already shows for, add the exact question as an H2 + 2-sentence answer near the top and to its FAQ schema. Bump `dateModified`.
2. **Title/description rewrite (when CTR < 1% at position ≤ 10)**: rewrite to match the top query's wording.
3. **Fact refresh (when iOS changes)**: iOS menu paths, screenshots, version names. Bump `dateModified` only when content changed.
4. **Merge or retire (quarterly, ≥ 3 months old)**: overlapping weak posts get merged into the stronger one with a 301 in `vercel.json` (method: `memory/project_blog_prune_expand`). Outrank articles that compete with a hand-written post: keep the better one, 301 the other.
5. **Off-site reuse (draft only, Razvan posts)**: each new post → one genuine Reddit answer draft (no link where the sub forbids it) and one short X post. Claude never posts on Razvan's behalf.
6. **Unpublished drafts**: `content/drafts/` (photo-cleaner-stuck-scanning, best-swipe-to-delete-photo-apps-iphone) get re-checked against today's facts and used as recycle slots.

## Measurement

Log every change in `## Change log` below (date, page, question, type). After 4 weeks, per change:
- GSC: that query's position and CTR vs before; the page's clicks.
- FolioKit: page views and App Store taps/installs for that page (Growth tab, or ask Claude for `web_cta_summary`).
- Bing AI Performance / GSC AI report: is the page cited?
Winner = position or clicks up and no drop elsewhere. Three winners in a row → keep the method; three flat → change the template, not the cadence.

## Calendar

**Week of Oct 6 (done today, pending push)**
- New: why-iphone-storage-goes-up-after-deleting-photos · delete-photos-from-iphone-keep-in-icloud
- Recycle (answer headings): why-iphone-storage-full-after-deleting-photos · recently-deleted-photos-take-up-storage · best-duplicate-photo-cleaner-iphone · iphone-photo-library-too-big-crashing · merge-exact-copies-iphone-photos

**Week of Oct 13**
- New: "Why isn't Optimize iPhone Storage freeing up space?" (Reddit rising, unanswered) · "Where did Camera Roll and Merge Duplicates go in iOS 26?" (rising)
- Recycle: iphone-photos-duplicates-album-not-showing ← "Why isn't Apple's Duplicates feature finding obvious duplicates?" (GSC 1,030 impr cluster + Reddit #7) · find-remove-blurry-photos-iphone (position 44, rework the title and opening)
- Also: Oct 8 Outrank week-1 audit; Oct 14 Lumina button numbers

**Week of Oct 20**
- New: "Which of five nearly identical photos should I keep?" (core product question, rising) · "How do I clean up tens of thousands of photos without checking every one?"
- Recycle: iphone-photo-privacy-safety ← "What's the safest photo cleaner that won't upload my pictures?" · do-photo-cleaner-apps-actually-work ← "Are iPhone cleaner apps scams?"

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
