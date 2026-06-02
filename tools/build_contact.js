// Generate /contact/, /business/contact/, /consumer/contact/, /contact/thanks.html
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');

function head(title, desc, depth) {
  const up = '../'.repeat(depth);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="icon" type="image/png" sizes="32x32" href="${up}assets/img/site/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${up}assets/img/site/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="${up}assets/img/site/apple-touch-icon.png">
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${up}assets/css/tokens.css">
<link rel="stylesheet" href="${up}assets/css/base.css">
</head><body>`;
}

function header(depth) {
  const up = '../'.repeat(depth);
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="top"><div class="wrap">
<a class="brand" href="${up}index.html" aria-label="GatorTec home"><img src="${up}assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<nav class="main" aria-label="Primary">
<a href="${up}products/index.html">Products</a>
<a href="${up}business/index.html">For Business</a>
<a href="${up}consumer/index.html">For Home</a>
<a href="${up}service/index.html">Service</a>
<a class="pill" href="${up}contact/index.html" aria-current="page">Contact</a>
</nav></div></header>`;
}

function footer(depth) {
  const up = '../'.repeat(depth);
  return `<footer class="site"><div class="wrap">
<div class="grid">
<div class="intro">
<a class="brand" href="${up}index.html"><img src="${up}assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<p>North Florida's Apple Premier Partner. Locally owned, Apple-certified, and here since 2010 — helping businesses and individuals choose, source, and own the right Apple devices. Also an Apple Authorized Service Provider.</p>
<div class="sig-row" aria-label="Apple Premier Partner"><img src="${up}assets/signatures/premier-partner-2ln.png" alt="Apple Premier Partner"></div>
</div>
<nav class="col" aria-label="For Business"><h3>For Business</h3>
<a href="${up}business/index.html">Overview</a>
<a href="${up}business/products/index.html">Products</a>
<a href="${up}business/service/index.html">Service</a>
<a href="${up}business/contact/index.html">Request a quote</a>
</nav>
<nav class="col" aria-label="For Home"><h3>For Home</h3>
<a href="${up}consumer/index.html">Overview</a>
<a href="${up}consumer/products/index.html">Products</a>
<a href="${up}consumer/service/index.html">Service</a>
<a href="${up}consumer/contact/index.html">Contact us</a>
</nav>
<nav class="col" aria-label="Company"><h3>Company</h3>
<a href="${up}business/faq/index.html">FAQ</a>
<a href="${up}legal/accessibility.html">Accessibility</a>
<a href="${up}legal/privacy.html">Privacy</a>
<a href="${up}legal/terms.html">Terms</a>
<a href="${up}legal/sms-terms.html">SMS Terms</a>
<a href="/business/apple-parts-list/">Parts List <span class="staff-tag">(staff)</span></a>
</nav>
</div>
<div class="legal"><span>© 2010–2026 GatorTec, LLC. All rights reserved.</span><span>Gainesville, FL · <a href="tel:+13525057582">352.505.7582</a></span></div>
<div class="apple-legal">
<p>Apple, the Apple logo, MacBook, MacBook Air, MacBook Pro, MacBook Neo, iMac, Mac mini, Mac Studio, iPad, iPad Air, iPad Pro, iPad mini, Apple Watch, AirPods, AirPods Pro, AirPods Max, Apple TV, AirTag, HomePod, AppleCare, AppleCare+, Apple Premier Partner, and Apple Authorized Service Provider are trademarks of Apple Inc., registered in the U.S. and other countries and regions. iPhone, Apple Intelligence, and the Apple at Work program name are trademarks of Apple Inc.</p>
<p>TM and © 2026 Apple Inc. All rights reserved.</p>
</div></div></footer>`;
}

function navJsTag(depth) {
  return `<script src="${'../'.repeat(depth)}assets/js/nav.js" defer></script>`;
}

// =================================================================
// /contact/index.html — chooser
// =================================================================
function buildChooser() {
  const depth = 1;
  return `${head('Contact GatorTec — Apple Premier Partner', 'Contact GatorTec — talk to our business team for quotes and fleet orders, or our consumer team to find and order the right Apple device for you.', depth)}
${header(depth)}
<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="../index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<span class="current">Contact</span>
</nav>
<h1 id="h1">Talk to GatorTec. <em>A real person, every time.</em></h1>
<p class="lede">Choose how you'd like us to help. Our business and consumer teams are separate so you get a specialist focused on your kind of order.</p>
</div></section>

<section class="section"><div class="wrap">
<div class="contact-cards">

<a class="contact-card" href="../business/contact/index.html">
<span class="ck">For Business</span>
<h3>Request a B2B quote</h3>
<p>Volume Apple orders, fleet rollouts, AppleCare for Enterprise, deployment with Apple Business Manager, asset tagging, and lifecycle management. An account manager scoped to your team.</p>
<span class="phone"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>352.505.9088</span>
<span class="go">Start a B2B request <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>

<a class="contact-card" href="../consumer/contact/index.html">
<span class="ck">For Home</span>
<h3>Talk to us about your Apple setup</h3>
<p>Personal help finding and ordering the right Mac, iPad, Apple Watch, or accessories. AppleCare+ guidance, trade-in questions, and friendly experts who don't push the upsell.</p>
<span class="phone"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>352.505.7582</span>
<span class="go">Send a consumer message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>

</div>

<div style="text-align:center;margin-top:48px;padding:32px;background:var(--mist);border-radius:var(--radius-md);max-width:920px;margin-left:auto;margin-right:auto">
<h3 style="font-family:var(--display);font-weight:600;font-size:20px;margin:0 0 8px">Need service instead?</h3>
<p style="margin:0 0 14px;color:var(--slate);font-size:14.5px">For repair pricing, AppleCare+ claims, or to drop off a device — visit our Service page.</p>
<a class="btn" href="../service/index.html" style="background:var(--ink);color:#fff;padding:11px 22px;border-radius:999px;font-weight:600;font-size:14.5px;text-decoration:none;display:inline-block">View Service options</a>
</div>

</div></section>

</main>
${footer(depth)}
${navJsTag(depth)}
</body></html>`;
}

// =================================================================
// /business/contact/index.html — B2B form
// =================================================================
function buildBusinessForm() {
  const depth = 2;
  return `${head('Request a B2B Quote — GatorTec', 'Request a business quote from GatorTec, Apple Premier Partner. Volume Macs, iPads, deployment, AppleCare for Enterprise, and more.', depth)}
${header(depth)}
<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="../../index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<a href="../index.html">For Business</a><span class="sep" aria-hidden="true">›</span>
<span class="current">Contact</span>
</nav>
<span class="ptag">For Business</span>
<h1 id="h1">Request a B2B quote.</h1>
<p class="lede">Tell us about your team and what you're looking for — a single Mac, a fleet rollout, accessories, AppleCare for Enterprise, or a full deployment with Apple Business Manager. Your GatorTec account manager will reply within one business day. Call us at <a href="tel:+13525059088" style="color:var(--blue);font-weight:600">352.505.9088</a> for anything urgent.</p>
</div></section>

<section class="section"><div class="wrap">
<form class="form-card" action="https://formspree.io/f/xvzynego" method="POST">

<input type="hidden" name="_subject" value="GatorTec B2B Quote Request">
<input type="hidden" name="_next" value="https://gatortec.com/contact/thanks.html">
<input type="hidden" name="form_source" value="business-contact">
<input type="text" name="_gotcha" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" aria-label="Leave this field blank">

<div class="field-row">
<div class="field">
<label for="b-name">Your name <span class="req">*</span></label>
<input type="text" id="b-name" name="Name" required autocomplete="name">
</div>
<div class="field">
<label for="b-company">Company <span class="req">*</span></label>
<input type="text" id="b-company" name="Company" required autocomplete="organization">
</div>
</div>

<div class="field-row">
<div class="field">
<label for="b-email">Work email <span class="req">*</span></label>
<input type="email" id="b-email" name="email" required autocomplete="email">
</div>
<div class="field">
<label for="b-phone">Phone</label>
<input type="tel" id="b-phone" name="Phone" autocomplete="tel">
</div>
</div>

<div class="field-row">
<div class="field">
<label for="b-team-size">Team size</label>
<select id="b-team-size" name="Team Size">
<option value="">Choose…</option>
<option>1–10</option>
<option>11–50</option>
<option>51–250</option>
<option>251–1,000</option>
<option>1,000+</option>
</select>
</div>
<div class="field">
<label for="b-timeline">Timeline</label>
<select id="b-timeline" name="Timeline">
<option value="">Choose…</option>
<option>This week</option>
<option>This month</option>
<option>This quarter</option>
<option>This year</option>
<option>Just researching</option>
</select>
</div>
</div>

<fieldset class="field field-set"><legend>What are you interested in? <span class="help">Select all that apply</span></legend><div class="checkboxes">
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Mac fleet"> Mac fleet purchase</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="iPad fleet"> iPad fleet purchase</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Accessories"> Accessories (chargers, cables, cases, etc.)</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="AppleCare for Enterprise"> AppleCare for Enterprise</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Apple Business Manager / MDM"> Apple Business Manager &amp; MDM setup</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Kitting / asset tagging"> Kitting &amp; asset tagging</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Trade-in / lifecycle"> Trade-in / lifecycle management</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Service / repair"> Service &amp; repair</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Other"> Something else</label>
</div>
</fieldset>

<div class="field">
<label for="b-message">Tell us a bit more <span class="req">*</span></label>
<textarea id="b-message" name="Message" required placeholder="e.g. We're rolling out 40 new MacBook Airs to our marketing team next month and need help with deployment + AppleCare+ pricing."></textarea>
</div>

<button type="submit" class="submit">Send request
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</button>

<p class="form-foot">By submitting, you'll receive a reply from your GatorTec account manager. We never share your information with anyone.</p>

</form>
</div></section>

</main>
${footer(depth)}
${navJsTag(depth)}
</body></html>`;
}

// =================================================================
// /consumer/contact/index.html — Consumer form
// =================================================================
function buildConsumerForm() {
  const depth = 2;
  return `${head('Contact GatorTec — For Home', 'Contact GatorTec to find and order the right Apple device for you and your family.', depth)}
${header(depth)}
<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="../../index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<a href="../index.html">For Home</a><span class="sep" aria-hidden="true">›</span>
<span class="current">Contact</span>
</nav>
<span class="ptag">For Home</span>
<h1 id="h1">Tell us how to help.</h1>
<p class="lede">Looking for a new Mac, iPad, Apple Watch, or AirPods? Need help choosing the right configuration, or curious whether AppleCare+ is worth it? Send us a note and a GatorTec expert will reply — usually within a day. For something urgent, call us at <a href="tel:+13525057582" style="color:var(--blue);font-weight:600">352.505.7582</a>.</p>
</div></section>

<section class="section"><div class="wrap">
<form class="form-card" action="https://formspree.io/f/xredvnbe" method="POST">

<input type="hidden" name="_subject" value="GatorTec Consumer Contact">
<input type="hidden" name="_next" value="https://gatortec.com/contact/thanks.html">
<input type="hidden" name="form_source" value="consumer-contact">
<input type="text" name="_gotcha" class="honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" aria-label="Leave this field blank">

<div class="field-row">
<div class="field">
<label for="c-name">Your name <span class="req">*</span></label>
<input type="text" id="c-name" name="Name" required autocomplete="name">
</div>
<div class="field">
<label for="c-email">Email <span class="req">*</span></label>
<input type="email" id="c-email" name="email" required autocomplete="email">
</div>
</div>

<div class="field">
<label for="c-phone">Phone <span class="help">Optional — only if you'd rather we call</span></label>
<input type="tel" id="c-phone" name="Phone" autocomplete="tel">
</div>

<fieldset class="field field-set"><legend>What are you looking for? <span class="help">Select all that apply</span></legend><div class="checkboxes">
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Mac"> A new Mac</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="iPad"> A new iPad</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Apple Watch"> A new Apple Watch</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="AirPods / HomePod"> AirPods or HomePod</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Display"> Apple Display</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Accessories"> Accessories</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="AppleCare+"> AppleCare+ help</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Trade-in"> Trade-in / buyback</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Service"> Service or repair</label>
<label class="checkbox-item"><input type="checkbox" name="Interests" value="Other"> Something else</label>
</div>
</fieldset>

<div class="field">
<label for="c-message">Tell us a bit more <span class="req">*</span></label>
<textarea id="c-message" name="Message" required placeholder="e.g. Looking for a new MacBook Air for my daughter for college — leaning toward the 13-inch. What do you think?"></textarea>
</div>

<button type="submit" class="submit">Send message
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</button>

<p class="form-foot">By submitting, you'll receive a reply from a GatorTec expert. We never share your information with anyone.</p>

</form>
</div></section>

</main>
${footer(depth)}
${navJsTag(depth)}
</body></html>`;
}

// =================================================================
// /contact/thanks.html — Post-submit confirmation
// =================================================================
function buildThanks() {
  const depth = 1;
  return `${head('Thanks — GatorTec', 'Thanks for contacting GatorTec. We received your message and will be in touch shortly.', depth)}
${header(depth)}
<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap" style="max-width:720px;text-align:center">
<div style="width:72px;height:72px;background:var(--blue);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px">
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
</div>
<h1 id="h1">Thanks. <em>We got it.</em></h1>
<p class="lede">A GatorTec account manager will be in touch soon. For anything urgent, give us a call:</p>
<div style="display:flex;gap:32px;justify-content:center;margin-top:32px;flex-wrap:wrap">
<div><div style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);margin-bottom:4px">For Business</div><a href="tel:+13525059088" style="font-family:var(--display);font-weight:700;font-size:24px;color:var(--ink);text-decoration:none">352.505.9088</a></div>
<div><div style="font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);margin-bottom:4px">For Home</div><a href="tel:+13525057582" style="font-family:var(--display);font-weight:700;font-size:24px;color:var(--ink);text-decoration:none">352.505.7582</a></div>
</div>
</div></section>

<section class="section"><div class="wrap" style="text-align:center">
<a href="../index.html" style="color:var(--blue);font-weight:600;font-size:15px;text-decoration:none">← Back to GatorTec home</a>
</div></section>

</main>
${footer(depth)}
${navJsTag(depth)}
</body></html>`;
}

// === WRITE ===
const writes = [
  ['contact/index.html', buildChooser()],
  ['contact/thanks.html', buildThanks()],
  ['business/contact/index.html', buildBusinessForm()],
  ['consumer/contact/index.html', buildConsumerForm()],
];

for (const [rel, content] of writes) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log('wrote:', rel);
}
console.log('Done.');
