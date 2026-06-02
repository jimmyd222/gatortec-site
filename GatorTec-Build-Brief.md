# GatorTec Website Rebuild — Build Brief

**Prepared for:** Claude Code build session
**Project:** Replace compromised WordPress site with a clean, secure static site
**Owner:** Jim Dufek, GatorTec LLC — Apple Premier Partner & Apple Authorized Service Provider, Gainesville FL

---

## 0. Why this rebuild exists (context)

The previous WordPress site on InMotion shared hosting was repeatedly compromised (Indonesian gambling-spam injection, multiple persistence mechanisms, reinfection within 24h of a thorough cleanup). Root cause: server-side content injection at a level below cPanel visibility. Decision: **abandon WordPress entirely** and rebuild as a static site, eliminating the entire attack class (no PHP, no database, no plugins, no admin login on the server).

All real content was extracted from a clean database export *before* abandoning the server. The live site is currently locked down via `.htaccess` (serving an "offline" 403). DNS/registrar (GoDaddy) and email (Google Workspace) are confirmed clean and secured.

**Do NOT reuse any code from the old site.** Only real *content* (text/images) carries over, sourced from the clean exports listed below.

---

## 1. Tech stack & hosting

- **Static site.** Hand-built HTML/CSS/JS. No CMS, no server-side runtime.
- **Host:** Cloudflare Pages (site + assets). Unlimited bandwidth, global CDN, auto-SSL, Git-deploy.
- **Internal tool auth:** Cloudflare Access (free tier) for the staff-only device pricing tool.
- **Forms:** Formspree (owner will sign up). Must send a confirmation copy to the customer and support custom/whitelabel from-address.
- **Registrar:** stays at GoDaddy for now (secured, 2FA on). Possible consolidation to PorkBun later — out of scope for this build.
- **DNS cutover:** when site is ready, repoint only the `@` and `www` A records at GoDaddy from the old InMotion IP (192.249.117.242) to Cloudflare Pages. **Do NOT touch MX, SPF, DKIM, DMARC** — those route Google Workspace email and must be preserved exactly.

---

## 2. Site structure

### Entry
- **Two-audience chooser** landing → **Business** and **Consumer (Home/Personal)**.
- The two sides are *similar* — overlapping services with audience-specific framing — so build **one core site with two front doors**, not two separate sites. Share components, vary copy/emphasis.

### Per-side pages (Business / Consumer each)
- Home
- Products (full Apple lineup, informational — see §5)
- Service (pricing tables — see §6)
- Contact (audience-specific contact form — see §7)
- FAQ

### Shared / global pages (one each, not per-side)
- Privacy Policy
- Terms & Conditions
- Accessibility Statement (carry forward — required, see §8)
- SMS / Text Message Terms (full legal opt-in language — see §9)

### Internal (behind Cloudflare Access, staff only)
- Unified searchable Apple device tool (see §10)

### Suggested additions (nice-to-have, owner-approved in principle)
- "Why GatorTec" trust section on home pages (Premier Partner, Apple Authorized Service Provider, 15+ yrs, Apple-certified). Section, not a full page.
- Business "Resources / Solutions" section surfacing the 9 service articles (see §4).
- Global footer: contact, legal links, Premier Partner signature. **NO hours, NO social media.**

### Explicitly OMITTED
- **Store hours** — omit entirely. GatorTec is appointment-based and does not advertise walk-in retail. (Old site had hours; they created wrong expectations.)
- **Social media links** — none.
- **E-commerce / "buy now"** — none. Products are informational; CTA is "contact us," not purchase.

---

## 3. Positioning & copy guidance (IMPORTANT — read carefully)

GatorTec is **primarily an Apple products SALES business (~$6M/yr in product vs. ~$50K in service).** Sales is the focus; service is a small supporting capability. Sales happen entirely through **human contact — NO e-commerce checkout, ever:**
- **B2B (the core business):** large/repeat customers order via email, PO, and API. Primary CTA = **"Request a quote."**
- **Consumer:** a dedicated tech works one-on-one with customers (mostly returning buyers and "device beyond economical repair → buy new" conversions). Primary CTA = **"Contact us to order."**

**The site's job:** be an **inviting, genuinely useful place to research Apple products**, then drive the visitor to contact GatorTec to buy. A research-and-inquire destination, not a storefront, not a service shop.

**Device coverage — sales vs. service differ (IMPORTANT, easy to get wrong):**
- **Service:** GatorTec services ALL Apple device types — iPhone, Mac, iPad, Apple Watch, AirPods, etc. The Service section/page covers the full device range.
- **Sales:** GatorTec sells everything EXCEPT **iPhone** and **Vision Pro**. Do NOT include iPhone or Vision Pro as categories in the Products/sales lineup.
- Net: iPhone = serviced but NOT sold (appears in service, not in sales lineup). Vision Pro = NOT sold AND NOT mentioned anywhere (GatorTec does service it, but does not advertise that — exclude Vision Pro from both sales and visible service content entirely). Mac / iPad / Watch / AirPods / displays / accessories = both sold AND serviced.
- Do not let the build assume symmetry between the sales lineup and the service lineup — they intentionally differ.

**Copy rules:**
- **Lead with products.** Homepage hero, primary nav, and main browse experience are about exploring the Apple lineup. Make it inviting and informative — somewhere people *want* to research Apple.
- **CTA is always consultative:** "Request a quote" (B2B) / "Contact us to order" (consumer). NEVER "add to cart" / "buy now" / online checkout.
- **Service is secondary** — a supporting section ("We also service what we sell," Apple Authorized Service Provider), never the lead. Keep it brief.
- Address may appear (footer/contact) but de-emphasized; **no hours, no social.** (GatorTec is appointment-based for service; doesn't advertise walk-in retail.)
- **CRITICAL — MSP relationship:** GatorTec sells to end-users of MSPs (often not Apple-authorized) via referral. This must be **implied through tone, NEVER stated explicitly** (gray-market risk to Apple). Do NOT write "we support MSPs," "we serve your IT provider's clients," "we work with resellers," etc. Keep B2B tone service-focused, partner-neutral, non-predatory. Reassurance comes from what is NOT said.

---

## 4. Content sources (all clean, already extracted)

All real content lives in the database export `gatort5_wp389.sql` (provided separately). Pull genuine page/post text from `wp_posts` (`post_content`). **Ignore any injected spam** — extract only legitimate GatorTec content.

**Published pages (18):** Home (`/your-trusted-apple-premier-partner/`), Business, Consumer, Products, Service, FAQs, Contact / B2B Contact, Accessibility Statement, Terms & Conditions, plus device/parts pages: Apple Parts List, MacBook Pro, MacBook Air & Neo, iMac, Mac mini, Mac Studio, iPad.

**Published service articles (9 posts) — use on Business side as Resources/Solutions:** Apple Business Manager, AppleCare for Enterprise, Asset Tagging, Business Apps Getting Started Guide, Kitting, Lifecycle Management, Mac Adoption Blueprint, Mac Employee Starter Guide, Volume Purchasing.

**Media:** WordPress uploads + standalone static subdirectories (provided separately). Process Apple product images: transparent background where appropriate, consistent sizing, web-optimized (source files are large/high-res from Apple).

**Newsletter archive:** preserve the `/newsletters/` directory (date-based subfolders) at the site root so previously-sent newsletters' image URLs (`gatortec.com/newsletters/...`) keep resolving. Static archive only — no newsletter *sending* this round.

**Redirects:** old site had 68 published redirect rules. Review and preserve important ones (old URLs → new) to protect SEO/inbound links. Implement as Cloudflare Pages redirects (`_redirects` file).

---

## 5. Products (THE PRIMARY FOCUS of the site)

- Products lead the site — homepage hero, main nav, primary browse experience. The site should be an **inviting, informative Apple-research destination.**
- Cover the full Apple lineup: Mac (laptops + desktops incl. iMac, Mac mini, Mac Studio, Mac Pro), iPad, iPhone, Apple Watch, AirPods/audio, displays, accessories.
- **Informational + consultative, NOT transactional.** No online checkout. Product pages educate (specs, options, what's new) and drive to contact:
  - **B2B CTA:** "Request a quote"
  - **Consumer CTA:** "Contact us to order"
- Make product pages genuinely useful for research/comparison — the draw is "explore everything, then a real expert helps you buy the right thing."
- **Imagery:** REAL licensed Apple product photos (owner is licensed to host Apple imagery), properly processed — transparent background, sized, optimized. **No amateur hand-drawn device illustrations.**
- **CaaS feed automation (auto-populating rich, always-current product pages from Apple's NPI/CaaS feed) is ROUND TWO** — but build the round-one product pages with this growth path in mind (clean structure that an automated feed can later populate). For now, real content/images entered manually.

---

## 6. Service page (SECONDARY — supporting, not a lead feature)

Service is ~$50K of a ~$6M business — a supporting capability, not a focus. Keep it present but secondary (a section + its own page), framed as "we also service what we sell" / Apple Authorized Service Provider backing. Do NOT let it dominate the homepage.

- **One Service page, organized by device category** — NOT scattered separate tables like the old site.
- Category selector/jump-nav: Mac / iPhone / iPad / Watch / etc. Clicking a category drops down to that category's pricing.
- **Device-family selectors use clean, PROFESSIONAL thin-line outline icons** (wireframe-style device outlines as section markers/headers). Source quality icons or refine properly — do NOT use rough hand-drawn SVGs. This is a specific quality bar the owner cares about. (Same outline-icon treatment is also useful on the Products browse.)
- Pricing tables formatted cleanly (accessible — real `<th>`/`scope`/`<caption>`). Transparent service pricing by device.
- Pull current service pricing from the SQL export — it's there. The Service page content in `wp_posts` contains the real Mac Service Pricing table (e.g. in-warranty: free; screen/enclosure w/ AppleCare+: $99; other damage w/ AppleCare+: $299; out-of-warranty diagnostic: $75, or $115 for 2012-up iMac; in-store backup: $39), AppleCare pricing per device, repair/exchange program info, data recovery options, and the standard disclaimers ("Diagnostic and Labor fees are non-refundable," what's not covered under warranty). **Extract it from the SQL — do NOT invent placeholder pricing.** Content dates ~April 2025, so flag it for the owner to confirm current accuracy before launch.

---

## 7. Contact forms

Rebuild the two captured Gravity Forms as accessible HTML wired to **Formspree**. Each must email the listed address AND send an autoresponder confirmation to the submitter (replicate the existing confirmation behavior).

### Business Contact Form
- **Formspree endpoint: `https://formspree.io/f/xvzynego`**
- Intro: "Looking to see how GatorTec can help with your business's IT needs? Fill out the form below and a team member will be in touch soon."
- Fields: Business Name (required), Your Name (required), Address (required), Your Email Address (required), Your Phone (optional), Your Comments/Questions (required)
- Routes to: **b2b@gatortec.com**
- Autoresponder to submitter: "We have received your inquiry…"
- From: website@gatortec.com / "GatorTec's Website"

### Consumer Contact Form
- **Formspree endpoint: `https://formspree.io/f/xredvnbe`**
- Intro: "We want to hear from you. Complete the form below to send an email to GatorTec. We will get back to you as soon as possible!"
- Fields: Your Name (required), Your Email Address (required), Newsletter subscribe? (required, Yes/No), Your Phone (optional), Subject (required: Service Related / Online Order / Customer Service Related / Retail Store Related), Your Comments/Questions (required)
- Routes to: **store@gatortec.com**
- Autoresponder to submitter (same confirmation style)
- From: website@gatortec.com / "GatorTec's Website"

**Formspree integration (endpoints are live, account created):**
- Business form → `https://formspree.io/f/xvzynego`
- Consumer form → `https://formspree.io/f/xredvnbe`
- **This is a static HTML site — use the Vanilla JS (Ajax) integration** (`@formspree/ajax` via CDN), NOT React (no React in this build) and preferably not a bare HTML POST (Ajax gives inline success/error without a page reload — better UX and easier to keep accessible). Use the library's data attributes (`data-fs-field`, `data-fs-error`, `data-fs-success`, `data-fs-submit-btn`) so messages render inline and the submit button disables during submission. Make error/success regions accessible (`aria-live`) — ties to the ADA requirement.
- Each form must include a field named `email` (the autoresponder requires it). Field `name`s should map to the labels above so notification emails are readable.

**No MachForms in round one** (the 71 archived MachForms are preserved in `gatort5_machform.sql` for reference; most are internal/legacy; revisit later if needed).

**Formspree plan (DECIDED):** owner will use the **Personal plan (~$15/mo)** specifically for the **custom domain** feature — confirmation emails must come from a GatorTec address (e.g. website@gatortec.com), NOT a formspree.io address (owner: "I don't want the emails to say Formspree — looks cheap"). So: configure the custom domain (removes Formspree branding, enables whitelabel from-address + submitted-data in the confirmation) and the autoresponder. The autoresponder needs a form field named `email`. Build forms so the endpoint is easy to swap in once the owner has the account. (Free plan works for build/testing but lacks the custom domain and caps at 50 submissions/mo.)

---

## 8. Accessibility (NON-NEGOTIABLE)

Owner has prior ADA litigation history. Build to **WCAG 2.1 AA** throughout from the start:
- Skip links, semantic landmarks (`header`/`nav`/`main`/`footer`), correct heading hierarchy
- Visible focus states; keyboard navigable
- Real data tables with `<th>`, `scope`, `<caption>`
- All form inputs properly labeled; errors announced
- AA color contrast (verify the brand blue and any grays against backgrounds — darken if needed for small text)
- `prefers-reduced-motion` respected
- Alt text on all meaningful images
- **Plan a full accessibility audit before launch.**

---

## 9. SMS / Text Message Terms page

Full legal compliance opt-in language (model after the structure of sunshinemedspa.com/sms-terms). Must include: program description, opt-in consent, message frequency, message & data rates disclosure, STOP to opt out, HELP for help, privacy reference, supported carriers disclaimer. Owner will confirm/provide specifics (phone number, program name). Not "text us here" casual info — this is the compliance disclosure.

---

## 10. Internal searchable device tool (behind Cloudflare Access)

Replaces the old scattered WPDataTables (one table per device). **Build ONE unified, searchable tool.**

**Data:** all device tables captured in `gatort5_wp389.sql` (`wp_wpdatatable_*`). Families include MacBook Pro (236 rows), MacBook Air/Neo, iMac, Mac mini, Mac Studio, Mac Pro, iPad, and others. Columns include: `applepart` (SKU), `msrp`, `dealerb` (dealer/B2B price), `description`, `screensize`, `color`, `processor`, `memory`, `storage`, `power`, `nanotexture`, `stocked`.

**UX — family-first drill-down:**
1. Pick device **family** (MacBook Pro, iMac, iPad, …) — shown with the thin-line outline icons
2. Filter by size, processor, memory, storage, color, etc.
3. See matching part number, MSRP, and dealer price

**Data source / updates:** data currently lives in Google Sheets. Build the tool to read from the Google Sheet as source of truth so the owner updates pricing/devices in GS without touching code. Round one can read a published-sheet export; design toward automatic refresh from GS.

**Security:** entire tool behind Cloudflare Access (staff email auth). **Dealer pricing (`dealerb`) is staff-only and must never be public.** MSRP-only could be exposed publicly if ever desired, but the tool as a whole is internal for round one.

---

## 11. Brand & design

- **Identity:** GatorTec's own look — clean, modern, professional, content-forward. **"Not an Apple clone" means don't copy Apple's exact layout, structure, and signature moves — NOT "avoid clean modern type."** Use a clean, contemporary, Apple-*adjacent* sans-serif (e.g. Manrope, Inter Tight, or Albert Sans — crisp and modern, not SF Pro itself, NOT a dated serif). Differentiation comes from the brand blue, logo, layout, and copy — not from old-fashioned typography. The look should feel current and polished.
- **Brand blue:** `#0171B9` (extracted from logo) — primary accent.
- **Logo:** the alligator mark + "GatorTec" wordmark/font are FIXED brand elements (use as-is). The rest of the lockup (circle treatment, blue bar, etc.) is flexible to use as design calls for. Both the circular mark and the wide Premier Partner lockup are provided.
- **Apple signatures:** official EPS + PNG provided (Premier Partner + Authorized Service Provider, 1-line & 2-line, black artwork). **Use ONE signature per page** (Premier Partner as primary), mention the other designation in text. The owner's exports ARE correctly transparent (Illustrator export: Background Color = Transparent, confirmed in Photoshop); any flattened/black appearance was an upload-transit artifact only — use the originals as-is.
- Use the **frontend-design skill** during the build to avoid generic-template/AI aesthetic.

---

## 12. Build sequence (suggested)

1. Scaffold project structure + Cloudflare Pages config + Git repo
2. Global components: header (logo + nav), footer (contact, legal links, Premier Partner signature), shared styles/design tokens (brand blue, type scale, spacing)
3. Two-audience chooser landing
4. Business + Consumer home pages
5. Service pages (category drill-down + outline icons + accessible pricing tables)
6. Products pages (real Apple imagery)
7. Contact pages (two forms → Formspree)
8. FAQ pages
9. Global pages: Privacy, Terms, Accessibility Statement, SMS Terms
10. `/newsletters/` archive folder (preserve URLs) + `_redirects`
11. Internal device tool (Cloudflare Access + Google Sheet source)
12. Accessibility audit pass
13. Deploy to temp Cloudflare Pages URL → owner review
14. DNS cutover at GoDaddy (A records only; preserve email records)
15. After cutover confirmed: remove attacker's Search Console ownership (final time — sticks once new site serves no injected tag)

---

## 13. Asset/file inventory (provided separately)

- `gatort5_wp389.sql` — WordPress DB (pages, posts, device tables) — content source
- `gatort5_machform.sql` — MachForm archive (reference only, not built round one)
- WordPress uploads/media + standalone static subdirectories
- `/newsletters/` archive (date-based folders)
- `docs/` folder — **MIXED: some customer-facing, some internal (see §13a)**
- Logo files: circular mark, wide Premier Partner lockup
- Apple signatures: Premier Partner & Authorized Service Provider (EPS + PNG, 1ln/2ln, black). Owner's exports are correctly transparent.
- Apple product images: owner downloads licensed images manually (see §13b)
- DNS reference: full GoDaddy zone (captured) — for cutover, preserving email records

### 13a. Customer-facing files in `docs/` (deploy-time task, NOT a build task)

Some files (e.g. a device-backup instructions PDF) are handed to customers as **direct links** (in texts/emails/RepairShopr templates). They are **not referenced from any page on the site** — so the website build does NOT need them and Claude Code can ignore them while building.

**BUT** these links are already circulating, so the files must still **resolve at their existing URLs after migration** or the links go dead. This is a **deploy/go-live step, not a build step:**
- At deploy, place these files on the new host at their **exact existing paths** (e.g. `gatortec.com/docs/<file>.pdf` → same path on Cloudflare Pages). Path preservation = old links keep working. Same principle as the `/newsletters/` archive.
- Purely-internal files (not customer-linked) are excluded entirely.
- Owner can upload/place these customer files whenever — independent of the site build. Just don't forget them at go-live.
- If unsure which files are customer-linked vs. internal, ask the owner.

### 13b. Bringing in Apple product images & copy (round one = manual download + process)

Owner downloads licensed assets from **Apple Relay** (Apple's asset platform), organized in an `apple-products-raw/` folder — one subfolder per product, each containing the folders below. **Owner has Relay kits for ALL focus products** (the devices the site will feature), so licensed images + copy decks exist for everything — minimal/no need for original copy or apple.com referencing for the core lineup. Each product subfolder typically contains:

- **PDP Images / Product Images** — clean product-on-white shots. **PRIMARY image source for product pages.** High-res — must be processed for web.
- **Family Product Images** — lineup/group shots. Use for category landing pages and the "explore the lineup" tiles.
- **Copy Decks** — Apple's **licensed, approved marketing text** (headlines, feature copy, taglines). **PRIMARY text source for product descriptions** — use this rather than writing from scratch or copying apple.com.
- **Asset Kit** — mixed icons/badges/web-ready variants; comb for usable pieces.
- **Logo** — Apple product/wordmark logos; use sparingly and per Apple brand guidelines (site leans on GatorTec branding).
- **Product Page HTML / Product Page & Flex Modules** — Apple's own pre-built HTML modules. **REFERENCE ONLY — do NOT drop Apple's HTML into the site. This is a DESIGN decision, not a licensing one** (the owner IS licensed to use them). Reason: Apple's HTML is built to Apple's design system, which this site deliberately does NOT clone — using it would make the site look like an Apple clone and break GatorTec's distinct identity. Mine it for structure/content ideas; rebuild in GatorTec's own design.

**Plus a separate `Apple at Work` folder** — Apple's B2B program assets (business-adoption messaging, employee-choice/productivity content, B2B imagery, possibly partner co-marketing templates). **Strong source for the Business side** — use the licensed imagery and approved B2B messaging to strengthen business pages beyond product listings. Same rules: use licensed assets/copy, treat any Apple HTML as reference-only (rebuild in GatorTec design), and keep the MSP-language caution (Apple-at-Work content is about organizations adopting Apple — on-message — but never imply the reseller/MSP referral channel explicitly). If there are partner-customizable co-marketing templates, those are ideal — they're meant for exactly this use.

**Image processing (Claude Code writes the script):** per source image — resize to web dimensions (~1600px max hero/detail, smaller for cards/thumbs), compress, convert to **WebP + PNG/JPG fallback**, preserve transparency, output with consistent predictable names into the product image dir. Show owner a sample + naming scheme before batch-processing all. Ask owner for the raw-ZIP/extracted folder path and the device→image mapping.

**Licensing note:** ALL assets the owner has provided — Relay kits (images, copy decks), Apple at Work content, logos, Apple signatures — are **licensed for GatorTec's use. Use them freely.** Do not be timid with this material or write around it; it's cleared for the site. (The "reference only" note on Apple's HTML/Flex Modules below is a DESIGN choice, not a licensing limit — see why.)

**Text sourcing:** use the **Copy Decks** (and Apple at Work messaging) directly — they're licensed and approved. No need to write original copy or reference apple.com for the core lineup, since the owner has kits for all focus products. (If a future device ever lacks a kit: state factual specs and write original prose; don't copy apple.com marketing text verbatim, which is unlicensed — but this does not apply to anything currently provided.)

Round one is this manual pipeline. Round two replaces it with automated download/caching from the Apple CaaS/NPI feed (feed image URLs are hotlink-protected / 403 externally, so the pipeline fetches via the authorized channel). Build round-one product pages so an automated feed can later populate them.

---

## 14. Out of scope (round two+)

- Apple CaaS/NPI feed automation & auto-generated product pages
- Slack-approved hero / "Just Announced" auto-strip homepage freshness
- n8n pipeline → Google Sheet → RepairShopr POS sync
- Newsletter *sending* (archive preserved now; sending platform TBD later)
- MachForm recreation
- Registrar consolidation to PorkBun
