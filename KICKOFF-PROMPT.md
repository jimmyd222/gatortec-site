# Claude Code — Kickoff Prompt

Paste the prompt below into Claude Code once you're in the project folder with the three docs
(`README.md`, `GatorTec-Build-Brief.md`, `gatortec-rebuild-mockup.html`) and your asset files present.

---

## STARTER PROMPT (paste this)

I'm building a static website for GatorTec, an Apple Premier Partner and primarily an Apple **products sales** business. The project folder contains three key docs — read all three fully before doing anything:

- `README.md` — project orientation and file inventory
- `GatorTec-Build-Brief.md` — the authoritative spec (structure, positioning, content sources, forms, device tool, ADA, hosting, scope)
- `gatortec-rebuild-mockup.html` — the authoritative visual direction (fonts, brand blue #0171B9, layout, tone) — match this look

The brief governs *what* to build and all positioning/content rules; the mockup governs *how it looks*.

**Before writing any code, do these and then stop and wait for my go-ahead:**

1. Read all three docs. Give me a short summary of: the site structure, the design system, and the key positioning rules — specifically the sales-first focus, the no-e-commerce/consultative model, the sell-vs-service device asymmetry (iPhone is serviced but not sold; Vision Pro not sold), and the MSP-language caution. I want to confirm the docs carried the context across before you build.
2. List the asset files/folders you can see in the project, and tell me what's still needed.
3. Extract a sample of real content from `gatort5_wp389.sql` (e.g. the Service page pricing table and one product page's text) so I can confirm you're reading the database correctly — do NOT write placeholder copy; all real content comes from the SQL.
4. Propose the project folder structure and build order (per brief §12), then wait for my approval before scaffolding.

Build incrementally — show me the homepage against the mockup before building the rest. Don't build all pages at once.

---

## FOLLOW-ON PROMPTS (use these later, as you reach each step)

### When it's building pages — the SQL content extractor
Write a script to extract the real page/post content from `gatort5_wp389.sql` (`wp_posts.post_content`) and the device pricing from the `wp_wpdatatable_*` tables. The content has WordPress/Fusion shortcodes and HTML entities — clean those out and give me usable text/data. Ignore any injected spam.

### When your Apple images are ready — the image + copy extractor
My Apple Relay asset kits are in `apple-products-raw/` (one subfolder per product). I have kits for all focus products. Each subfolder contains: PDP Images, Product Images, Family Product Images, Copy Decks, Asset Kit, Logo, and Apple's Product Page HTML/Flex Modules. There's also an `Apple at Work` folder with B2B program assets for the Business side. Comb through and: (1) use PDP/Product Images as the product visuals — write a batch script (Node `sharp` or Python `Pillow`) to resize to web dimensions, compress, convert to WebP with PNG fallback, preserve transparency, output with consistent names; (2) use the Copy Decks (and Apple-at-Work messaging) as the licensed text; (3) treat any Apple Product Page HTML/Flex Modules as REFERENCE ONLY — do not use Apple's HTML, rebuild in GatorTec's design. Show me one processed image sample + the naming scheme before processing all.

### Forms — Formspree (endpoints are live)
Wire the two contact forms to Formspree using the **Vanilla JS (Ajax)** integration (`@formspree/ajax` via CDN) — this is a static HTML site, not React. Endpoints: Business = `https://formspree.io/f/xvzynego`, Consumer = `https://formspree.io/f/xredvnbe`. Use the data attributes for inline success/error + button disabling, make the message regions `aria-live` for accessibility, and ensure each form has an `email` field (autoresponder requires it). Account is Personal tier with a custom domain so confirmations send from a GatorTec address (not formspree.io).

### Early housekeeping
Convert the Apple signature EPS files to transparent PNG/SVG (use Ghostscript locally). Use ONE signature per page (Premier Partner primary), mention Authorized Service Provider in text.

---

## REMINDERS

- Make it do step 1 (read docs + play back the plan) and STOP before building. Check its summary against what you know — if it says "service-first," or includes iPhone in the sales lineup, the context didn't transfer; correct it before any pages are built.
- Review the homepage against the mockup before letting it build the rest.
- Customer-facing files (backup PDF, etc.) are a DEPLOY-time task, not a build task — handle at go-live, preserving exact URLs.
- DNS cutover: A records only. Never touch MX/SPF/DKIM/DMARC (Google Workspace email).
- If Claude Code is missing context the docs didn't capture, note it — the build brief can be amended and re-handed.
