# Publish schedule — July 2026 batches

Repo: /Users/rp/CascadeProjects/LuminaClean - Landing Page/Landing Page Lumina
Pipeline: follow content/SEO-PIPELINE.md. Drafts below are pre-verified; the publish
session's job is integration + deploy + post-deploy checks only.

## Batches

### Batch A — Monday 2026-07-20
- is-clever-cleaner-really-free.html → blog index section "Reviews & comparisons" (top)
- does-deleting-duplicates-delete-original.html → section "Deep dives" (top)

### Batch B — Wednesday 2026-07-22
- is-cleanmyphone-worth-it.html → section "Reviews & comparisons" (top)
- do-photo-cleaner-apps-actually-work.html → section "Deep dives" (top)
- recover-permanently-deleted-photos-iphone.html → section "How-to guides" (top)

### Batch C — Friday 2026-07-24
- photo-cleaner-stuck-scanning.html → section "How-to guides" (top)
- best-swipe-to-delete-photo-apps-iphone.html → section "Reviews & comparisons" (top)

## Publish steps (per batch, on its date)

1. `git pull origin main` first. Only publish files that exist in content/drafts/;
   if one is missing, skip it and flag it in the report.
2. `mv` the batch's files from content/drafts/ to blog/.
3. blog/index.html: add one card per post in the section noted above, newest on top,
   matching existing card markup; badge "New Jul 2026"; date = the batch date
   (e.g. "Jul 20, 2026"); title/excerpt derived from the post's <title> and meta
   description (excerpt shortened to match existing card lengths).
4. sitemap.xml: add each new URL (https://luminaclean.app/blog/<file>) with
   lastmod = batch date, same entry format as existing posts; bump the
   /blog/ index entry lastmod to the batch date.
5. llms.txt: add one line per post in the Key guides list, matching format.
6. content/keyword-backlog.md: move the corresponding backlog items to Published
   with the batch date.
7. Commit: "Publish blog batch <A|B|C>: <slugs>" with
   Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>. Push origin main.
8. Wait for Vercel deploy, then verify with curl (retry up to 6x/30s):
   each new URL returns 200; sitemap.xml contains the new URLs; blog index
   shows the new cards.
9. IndexNow ping: POST https://api.indexnow.org/indexnow, Content-Type
   application/json, body {"host":"luminaclean.app",
   "key":"5723de94d2a54f8219a2d5344133cf91",
   "urlList":[<the batch's full URLs> plus "https://luminaclean.app/blog/"
   and "https://luminaclean.app/sitemap.xml"]}. Expect 200/202.
10. Report: files published, verification results, IndexNow status, anything skipped.

Note: GSC "Request indexing" for each URL is a manual step for John (or a
browser-agent session) — scheduled sessions may not have Chrome access.
