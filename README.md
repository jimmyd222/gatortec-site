# GatorTec Website Rebuild — Project README

This folder contains everything needed to build the new GatorTec static website.
**Start by reading `GatorTec-Build-Brief.md` (the spec) and `gatortec-rebuild-mockup.html` (the visual direction).**

---

## What this project is

A clean, static rebuild of gatortec.com, replacing a compromised WordPress site.
GatorTec is an **Apple Premier Partner** and primarily an **Apple products sales business**
(~$6M product / ~$50K service). The site is a **product-research-and-inquire destination** —
no e-commerce checkout; all sales happen through human contact (B2B: "Request a quote",
Consumer: "Contact us to order"). See the build brief for full positioning, including the
important MSP-language caution.

**Tech:** static HTML/CSS/JS → Cloudflare Pages. No CMS, no database, no server runtime.

---

## File inventory

### Specs (read first)
- `GatorTec-Build-Brief.md` — authoritative spec: structure, positioning, content sources, forms, device tool, ADA, hosting, scope.
- `gatortec-rebuild-mockup.html` — authoritative visual direction: fonts (Manrope), brand blue #0171B9, layout, tone. Match this look.

### Content sources
- `gatort5_wp389.sql` — WordPress DB export. Pull REAL page/post text from `wp_posts.post_content`. Device pricing data is in `wp_wpdatatable_*` tables (for the internal device tool). Ignore any injected spam — extract only legitimate content.
- `gatort5_machform.sql` — MachForm archive. **Reference only — NOT built in round one.**

### Brand assets
- Logo files (circular gator mark + wide Premier Partner lockup). The alligator mark and "GatorTec" wordmark are fixed; rest of lockup is flexible.
- Apple signature files (EPS + PNG): Premier Partner & Authorized Service Provider, 1-line & 2-line, black. **Use ONE signature per page (Premier Partner primary), mention the other in text.** EPS files may need converting to transparent PNG/SVG locally.

### Media & static content (PUBLISHABLE)
- WordPress uploads / media library — real product and site images (process: transparent bg where useful, sized, optimized).
- Apple product images & copy — owner downloads licensed **Apple Relay** asset kits into `apple-products-raw/` (one subfolder per product; kits present for all focus products). Each contains PDP/Product Images (primary visuals), Family Product Images (lineup shots), **Copy Decks (licensed product text — use these)**, Asset Kit, Logo, and Apple's own Product Page HTML/Flex Modules (**reference only — do NOT use Apple's HTML; rebuild in GatorTec's design**). Plus an **`Apple at Work`** folder — B2B program assets (business-adoption messaging, B2B imagery, possible partner co-marketing templates) — strong source for the Business side. Claude Code processes images (resize/compress/WebP) and uses Copy Deck / Apple-at-Work text. Keep the MSP-language caution in mind for B2B copy. See brief §13b.
- `/newsletters/` — date-based archive folders. **Preserve at site root so old newsletter image URLs (`gatortec.com/newsletters/...`) keep resolving.**

### `docs/` folder — customer files are a DEPLOY-time task, not a build task
- Some files (e.g. a device-backup PDF) are handed to customers as **direct links** — they are NOT referenced from any page on the site, so **the build can ignore them.**
- But those links are already out there, so the files must **resolve at their existing URLs after migration.** At go-live, place them on the new host at their exact existing paths (e.g. `/docs/<file>.pdf`) so old links keep working. Owner can upload these whenever — independent of the build. Just don't forget them at deploy.
- Purely-internal files: exclude entirely.

### ⚠️ Other INTERNAL material — do NOT publish
- Any folder of in-store reference material (internal staff docs, store-use images, etc.).
  **Recommend renaming purely-internal folders to `_internal-reference/` so they're clearly excluded.**
  When in doubt about any file/folder, ask the owner before publishing.

---

## Build order (summary — see brief §12 for detail)

1. Scaffold project + Cloudflare Pages config + Git
2. Global components (header, footer, design tokens) — match the mockup
3. Two-audience chooser landing (product-led)
4. Business + Consumer home pages
5. Products pages (the focus — real Apple imagery, research-oriented)
6. Service page (secondary — supporting section)
7. Contact pages (two forms → Formspree)
8. FAQ pages
9. Global: Privacy, Terms, Accessibility Statement, SMS Terms
10. `/newsletters/` archive + `_redirects`
11. Internal device tool (behind Cloudflare Access, reads from Google Sheet)
12. Accessibility audit (WCAG 2.1 AA — non-negotiable)
13. Deploy to temp Cloudflare Pages URL → owner review
14. DNS cutover at GoDaddy (A records only — NEVER touch MX/SPF/DKIM/DMARC; email is Google Workspace)

---

## How to run / deploy

- **Local preview:** serve the folder with any static server (e.g. `npx serve` or `python3 -m http.server`).
- **Deploy:** connect the repo to Cloudflare Pages (Git-based auto-deploy) or drag-and-drop the build output. Auto-SSL, global CDN, unlimited bandwidth.
- **Internal device tool:** protect with Cloudflare Access (staff email auth). Dealer pricing (`dealerb`) is staff-only — never public.
- **DNS cutover:** when ready, repoint only `@` and `www` A records at GoDaddy from the old InMotion IP (192.249.117.242) to Cloudflare Pages. Leave all email records untouched.

---

## Out of scope (round two+)

CaaS/NPI feed automation & auto-generated product pages · Slack-approved homepage hero ·
n8n → Google Sheet → RepairShopr sync · newsletter *sending* · MachForm recreation ·
registrar consolidation to PorkBun.
