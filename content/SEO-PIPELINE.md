# LuminaClean blog pipeline (adapted from the FolioKit framework, 2026-07-18)

Every post goes through ALL gates before publishing. No gate, no publish.

1. **Keyword backlog** — posts come only from `keyword-backlog.md`. Empty
   backlog = stop and do a research run (GPT consult + own knowledge).
   Never invent a nearby topic to keep publishing.
2. **Search intent** — label each post: comparison / how-to / definition /
   buying guide / troubleshooting / list. The article answers that intent.
3. **Product validation** — every claim about LuminaClean is checked against
   `product-facts.md` (features that exist AND features that don't).
4. **Structure** — keyword title · short answer near the top (TL;DR box) ·
   longer answer block for AI engines · clear H2 sections · FAQ (with
   FAQPage JSON-LD) · internal links · product section · CTA.
5. **Two anti-slop passes** — pass 1: hype words, corporate verbs, fake hook
   questions, empty marketing phrases, unsupported claims. Pass 2:
   repetitive sentence openings, missing contractions, weak transitions,
   overlong paragraphs, em-dash overuse.
6. **Quality gate** — score before publishing: does it sound human? is every
   product claim true? Below bar → back to step 4. External check: after
   deploy, have GPT (Razvan's account) read the LIVE static URL and score
   it; fix what's damning.
7. **Publish** — build, deploy, add to sitemap.xml + llms.txt, request
   indexing in Google Search Console (property verified), IndexNow ping.

## LuminaClean site specifics (read before touching a file)

- The blog is static, hand-authored HTML. Every post lives at
  `blog/<slug>.html` and URLs include the `.html` extension — do not write
  or link to extensionless URLs.
- Each post carries its own inline `<style>` block. There is no shared
  stylesheet — copy the CSS pattern from an existing post in `blog/` rather
  than inventing a new look, and keep any shared visual language (fonts,
  colors, card styles) consistent across posts by eyeballing a recent one.
- `blog/index.html` is a manually curated set of cards, not a generated
  list. It is grouped into four sections — **Start here**, **How-to
  guides**, **Reviews & comparisons**, **Deep dives** — and every new or
  retired post must be added to / removed from the correct section by hand.
- `sitemap.xml` and `llms.txt` at the repo root must be updated on every
  publish (add new URLs, remove retired ones, fix lastmod). This is part of
  gate 7, not optional cleanup.
- Deploy = `git push` to `origin main`. Vercel auto-deploys the
  `luminaclean-landing` project on push — there is no separate build/deploy
  command to run locally beyond the push itself.
- **John's OK is required before every push to main.** Do not push without
  it, even if all gates pass. Surface the finished draft (and sitemap/llms
  diffs) and wait for confirmation.
- CTA across all posts is the App Store link
  `https://apps.apple.com/app/id6757949814` — LuminaClean has no waitlist,
  so never write a waitlist-style CTA ("join the waitlist", "get early
  access", collect an email, etc).

## LuminaClean content rules (in addition to the 7 gates)

- **Never open with the founder-story / "camera roll graveyard" angle.**
  No first-person founder narrative, no "I built this because my camera
  roll was a graveyard of duplicates" framing, in any post, ever.
- **The "3–5x more duplicates than iOS" style stat is unsourced.** It comes
  from LuminaClean's own blog/observations only, not from any third-party
  study or dataset. Never present it as sourced, cited, or backed by
  research — if used at all, frame it explicitly as LuminaClean's own
  observation, not a statistic with authority behind it.
- **Pricing claims must be exact and match `product-facts.md`:** $17.99
  lifetime (one-time), $4.99/month, and a free tier that is a 65-file
  onboarding scan + 10 free deletes/day. Never round, simplify, or imply a
  different structure (no "weekly", no different price points).
- **Never claim a feature that does not exist.** In particular: no Android
  version, no cloud backup, no weekly subscription tier, and nothing
  auto-deletes without explicit user approval. Check every feature claim
  against the DOES-NOT-EXIST list in `product-facts.md` before publishing.
