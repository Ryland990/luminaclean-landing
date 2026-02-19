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

## Design System
- Background: #080510 dark with purple gradient + noise texture + diagonal streaks
- Primary: purple (#8b5cf6), Gold CTA (#d4a853)
- Font: Plus Jakarta Sans (Google Fonts)
- Glass-morphism cards (semi-transparent bg, blur, subtle borders)

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

## Remaining Tasks
- Review blog article quality — AI-generated content may need polish for accuracy and tone
- Test all pages on mobile — verify responsive design
