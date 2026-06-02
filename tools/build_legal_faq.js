// Generate FAQ + 4 legal pages from SQL content + standard boilerplate.
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
<style>
  .legal-body { max-width:780px; }
  .legal-body p { font-size:15.5px; line-height:1.7; color:var(--slate); margin:0 0 18px; }
  .legal-body h2 { font-family:var(--display); font-weight:700; font-size:22px; color:var(--ink); margin:40px 0 14px; line-height:1.25; }
  .legal-body h3 { font-family:var(--display); font-weight:600; font-size:17px; color:var(--ink); margin:28px 0 10px; }
  .legal-body ul { font-size:15.5px; line-height:1.65; color:var(--slate); margin:0 0 18px; padding-left:22px; }
  .legal-body ul li { margin-bottom:6px; }
  .legal-body a { color:var(--blue); }
  .legal-body strong { color:var(--ink); font-weight:600; }
  .legal-body .updated { font-size:13px; color:var(--slate-soft); margin-bottom:32px; font-style:italic; }
  .legal-body details { background:var(--white); border:1px solid var(--line); border-radius:10px; margin-bottom:10px; }
  .legal-body details summary { padding:16px 20px; font-weight:600; cursor:pointer; color:var(--ink); list-style:none; display:flex; justify-content:space-between; align-items:center; }
  .legal-body details summary::-webkit-details-marker { display:none; }
  .legal-body details summary::after { content:'+'; font-size:24px; font-weight:300; color:var(--slate-soft); transition:transform .2s; }
  .legal-body details[open] summary::after { transform:rotate(45deg); }
  .legal-body details[open] summary { border-bottom:1px solid var(--mist); }
  .legal-body details .faq-body { padding:16px 20px 4px; }
  .legal-body details .faq-body p { font-size:15px; }
</style>
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
<a class="pill" href="${up}contact/index.html">Contact</a>
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
<a href="${up}products/index.html">Products</a>
<a href="${up}service/index.html">Service</a>
<a href="${up}business/contact/index.html">Request a quote</a>
</nav>
<nav class="col" aria-label="For Home"><h3>For Home</h3>
<a href="${up}consumer/index.html">Overview</a>
<a href="${up}products/index.html">Products</a>
<a href="${up}service/index.html">Service</a>
<a href="${up}consumer/contact/index.html">Contact us</a>
</nav>
<nav class="col" aria-label="Company"><h3>Company</h3>
<a href="${up}business/faq/index.html">FAQ</a>
<a href="${up}legal/accessibility.html">Accessibility</a>
<a href="${up}legal/privacy.html">Privacy</a>
<a href="${up}legal/terms.html">Terms</a>
<a href="${up}legal/sms-terms.html">SMS Terms</a>
</nav>
</div>
<div class="legal"><span>© 2010–2026 GatorTec, LLC. All rights reserved.</span><span>Gainesville, FL · <a href="tel:+13525057582">352.505.7582</a></span></div>
<div class="apple-legal">
<p>Apple, the Apple logo, MacBook, MacBook Air, MacBook Pro, MacBook Neo, iMac, Mac mini, Mac Studio, iPad, iPad Air, iPad Pro, iPad mini, Apple Watch, AirPods, AirPods Pro, AirPods Max, Apple TV, AirTag, HomePod, AppleCare, AppleCare+, Apple Premier Partner, and Apple Authorized Service Provider are trademarks of Apple Inc., registered in the U.S. and other countries and regions. iPhone, Apple Intelligence, and the Apple at Work program name are trademarks of Apple Inc.</p>
<p>TM and © 2026 Apple Inc. All rights reserved.</p>
</div></div></footer>`;
}

function navJs(depth) { return `<script src="${'../'.repeat(depth)}assets/js/nav.js" defer></script>`; }

function legalPage({ title, h1, lede, body, depth, crumbs, updated }) {
  const up = '../'.repeat(depth);
  const crumbHtml = crumbs.map((c, i) =>
    i === crumbs.length - 1
      ? `<span class="current">${c.label}</span>`
      : `<a href="${c.href}">${c.label}</a><span class="sep" aria-hidden="true">›</span>`
  ).join('');
  return `${head(title + ' · GatorTec', lede.replace(/<[^>]+>/g, '').slice(0, 160), depth)}
${header(depth)}
<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap" style="max-width:880px">
<nav class="crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
<h1 id="h1">${h1}</h1>
<p class="lede">${lede}</p>
</div></section>

<section class="section"><div class="wrap legal-body">
${updated ? `<p class="updated">Last updated: ${updated}</p>` : ''}
${body}
</div></section>

</main>
${footer(depth)}
${navJs(depth)}
</body></html>`;
}

// ============ ACCESSIBILITY ============
const accessibilityBody = `
<p>This accessibility statement applies to <strong>gatortec.com</strong>.</p>
<p>The goal of this website is to ensure the accessibility of its content and services for individuals with disabilities who require additional access support. We've dedicated resources to enhancing the website's user-friendliness and accessibility, driven by the belief that every individual deserves to experience and engage with digital content equally.</p>

<h2>Measures to support accessibility</h2>
<ul>
<li>Accessibility is part of our mission statement</li>
<li>Accessibility is integrated throughout our internal policies</li>
<li>Accessibility is considered in our procurement practices</li>
</ul>

<h2>Conformance status</h2>
<p>The Web Content Accessibility Guidelines (WCAG) and the Americans with Disabilities Act (ADA) define requirements for designers and developers to improve accessibility for people with disabilities in the United States. WCAG defines three levels of conformance: Level A, Level AA, and Level AAA. <strong>This website aims to conform with WCAG 2.1 Level AA</strong> and the Americans with Disabilities Act.</p>

<h2>Ongoing efforts</h2>
<p>We remain dedicated to the ongoing enhancement of the accessibility of our website and services. This commitment is rooted in the belief that ensuring a smooth, inclusive, and unrestricted experience for individuals with disabilities is a shared ethical responsibility.</p>
<p>While we are always striving to enhance accessibility, it is possible that some content has not yet been fully aligned with our standards. We work to address known issues as quickly as we identify suitable fixes.</p>

<h2>Reporting accessibility issues</h2>
<p>If you encounter content on this site that you cannot access, please contact us:</p>
<ul>
<li>Email: <a href="mailto:accessibility@gatortec.com">accessibility@gatortec.com</a></li>
<li>Phone: <a href="tel:+13525057582">352.505.7582</a></li>
</ul>
<p>We aim to respond to feedback in a timely manner when a reply is required, and we'll provide an accessible alternative for content you cannot access.</p>

<h2>Third-party content</h2>
<p>We may use third-party resources that embed content on our website. Wherever possible, we ensure these are conformant. We also partner with other websites to provide content, and while we strive to collaborate with reputable sources, we do not control or guarantee the accuracy or compliance of third-party content.</p>

<h2>Technical specifications</h2>
<p>Accessibility of this website relies on the following technologies working with your browser and any assistive technologies installed:</p>
<ul>
<li>HTML</li>
<li>CSS</li>
<li>JavaScript</li>
</ul>
<p>These technologies are relied upon for conformance with the WCAG 2.1 Level AA guidelines.</p>

<h2>How we test and improve</h2>
<p>Our accessibility work is continuous. We regularly review our website and content to identify and fix known issues, including running checks through WAVE® (Web Accessibility Evaluation Tool) and performing WCAG audits through both software and manual testing.</p>
<p>This statement is reviewed at least once a year and updated as needed.</p>
`;

// ============ PRIVACY ============
const privacyBody = `
<p>GatorTec takes your privacy seriously. Our privacy commitments are fundamental to the way we do business. This policy applies to information you voluntarily provide to us, and applies to everyone who has a relationship with GatorTec — customers, vendors, job applicants, employees, and website visitors.</p>

<h2>What information we collect</h2>
<p>As part of our business, we obtain certain personal information from you in order to provide a product or service, or consider you for employment. This information may include what you provide on credit applications, job applications, insurance or other applications, and background check or drug test consent forms. The information collected may include, but is not limited to: financial information, social security numbers, driver's licenses, addresses, and medical information.</p>

<h3>Information you submit through the website</h3>
<p>When you fill out a contact form on gatortec.com, we collect the information you provide (name, email, phone, company, and any message details). We use this only to respond to your inquiry. We do not sign you up for marketing emails without a separate opt-in.</p>

<h3>Do Not Track</h3>
<p>Do Not Track (DNT) is a privacy preference users can set in their web browsers, allowing users to opt out of tracking by websites and online services. The World Wide Web Consortium (W3C) has not yet established universal standards for recognizable DNT signals, so GatorTec does not currently recognize DNT signals.</p>

<h2>What information we disclose</h2>
<p><strong>We do not sell your personal information to anyone, for any purpose.</strong> We do not disclose nonpublic personal information to anyone, except as permitted by law and for legitimate business purposes. The limited circumstances under which we are permitted by law to disclose personal information include:</p>
<ul>
<li>Information necessary to service or process a product or service you requested or authorized</li>
<li>To your legal representative</li>
<li>In response to a subpoena</li>
<li>To comply with federal, state, or local laws</li>
<li>To protect against fraud</li>
<li>To companies that perform services for us under non-disclosure agreement (for example, payment processing or fulfillment services)</li>
</ul>

<h2>Our security procedures</h2>
<p>To protect your privacy, we collect only relevant information and make every effort to keep personal information safe. All of our employees and contractors are required to respect your privacy. We do not provide access to any employee or contractor who has not agreed to our non-disclosure policy. We maintain physical, electronic, and procedural safeguards that comply with state and federal regulations to guard your personal information.</p>

<h2>Cookies</h2>
<p>The gatortec.com website uses essential cookies required for site functionality. We do not use third-party advertising trackers or behavioral targeting cookies.</p>

<h2>Children's privacy</h2>
<p>Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can remove it.</p>

<h2>Changes to this policy</h2>
<p>We may update this privacy policy from time to time. When we do, we'll update the "Last updated" date at the top of this page. Material changes will be highlighted in a notice on this page.</p>

<h2>Contact us about privacy</h2>
<p>If you have questions about this policy or how we handle your information, please contact us:</p>
<ul>
<li>Email: <a href="mailto:privacy@gatortec.com">privacy@gatortec.com</a></li>
<li>Mail: GatorTec, LLC · PO Box 142846 · Gainesville, FL 32614</li>
<li>Phone: <a href="tel:+13525057582">352.505.7582</a></li>
</ul>
`;

// ============ TERMS ============
const termsBody = `
<p>These Terms & Conditions ("Terms") govern your purchases from and relationship with GatorTec, LLC ("GatorTec," "we," or "us"). Please read them carefully. By making a purchase, you agree to these Terms.</p>

<h2>Sales — final and non-refundable</h2>
<p><strong>All sales are final. No refunds or exchanges.</strong> Diagnostics, labor, service parts, and training costs are not refundable. All new products carry their own manufacturer's warranty.</p>
<p>Cancelled orders on which a deposit has been made will be subject to a 25% cancellation fee. Printers with opened ink or toner are subject to a 30% restock fee.</p>
<p>The following items are not returnable:</p>
<ul>
<li>Batteries</li>
<li>Cables</li>
<li>Screen protectors</li>
<li>Single-use products</li>
<li>Software</li>
<li>In-ear or over-ear headphones</li>
<li>Open box, sale, and clearance items</li>
<li>EV vehicles (including OneWheels)</li>
</ul>
<p>AppleCare+ and GatorGuard products are nonrefundable through GatorTec. For AppleCare+ refunds, please call <strong>1-800-APL-CARE</strong> (1-800-275-2273). For GatorGuard refunds, please call Safeware at <strong>1-800-800-1492</strong>.</p>
<p>Prices are subject to substantial change without notice. All prices are final at time of sale.</p>

<h2>Most new sealed items: 10-day exchange</h2>
<p>Most new, still-sealed, non-CTO (non-custom-ordered) devices may be exchanged within 10 days of the original purchase date. These exchanges are evaluated on a case-by-case basis, and the store manager has final discretion on any exchange.</p>

<h2>Payment terms</h2>
<p>Minimum $25 fee for returned checks plus bank charges. Unless otherwise stated in a signed contract, invoices shall be paid in full within 15 days of creation. If charges are not paid in full by their due date, a finance charge of 1.5% per month (18% per annum) will be charged to the customer.</p>
<p>No in-store cash refunds on purchases over $100. GatorTec will refund any sale over $100 by check mailed to the customer within 7–10 business days.</p>

<h2>Shipping</h2>
<p>GatorTec can ship products to your home, work, or as a gift — most of the time it's free. Call us at <a href="tel:+13525057582">352.505.7582</a> for details.</p>

<h2>Dispute resolution by binding individual arbitration</h2>
<p><strong>Any dispute involving you and GatorTec or any of its agents shall be resolved through individual arbitration, except as otherwise noted below.</strong></p>
<p>"Dispute" shall be interpreted broadly and includes any claim or controversy arising out of or relating in any way to your relationship with GatorTec and its subsidiaries, affiliates, and designees — whether based in contract, tort, statute, fraud, misrepresentation, or any other legal theory. This includes (1) in-home consultations; (2) use of GatorTec's websites; (3) any service terms and conditions; and (4) any products or services offered, sold, or distributed by GatorTec, including their advertising and sales practices.</p>
<p>By agreeing to arbitration, you understand and agree that you are waiving your right to maintain other available resolution processes, such as a court action or administrative proceeding. The rules in arbitration are different: no judge or jury, less discovery, and limited appellate review. Arbitrators can award the same damages and relief that a court can award.</p>
<p>Either party may initiate arbitration by sending a demand to the American Arbitration Association (AAA). You may serve a copy of a demand at: <strong>GatorTec, LLC · 602 S Main St · Gainesville, FL 32601</strong>. Arbitration will be governed by the AAA's Consumer Arbitration Rules or Commercial Arbitration Rules (as appropriate), as modified by these Terms. AAA Rules and the filing form are available at <a href="https://www.adr.org" target="_blank" rel="noopener">www.adr.org</a> or by calling 1-800-778-7879. Payment of all filing, administration, and arbitrator fees will be governed by the AAA's rules; however, we will reimburse those fees (but not any attorney's fees) for claims totaling less than $1,000 unless the arbitrator determines the claim is frivolous.</p>
<p>You and GatorTec agree that each may bring claims against the other only in your or its individual capacity, and not as a plaintiff or class member in any purported class, consolidated, or representative proceeding. This means you may not act on behalf of a class or any other person. The arbitrator may award declaratory or injunctive relief only in favor of the individual party seeking relief and only to the extent necessary to provide relief warranted by that party's individual claim.</p>

<h2>Small-claims exception</h2>
<p>Any dispute that falls within the jurisdictional scope and amount of an appropriate small-claims court shall be brought in small-claims court on an individual basis. Either party may also elect to bring an action in a court of competent jurisdiction to enjoin infringement or other misuse of intellectual property rights.</p>

<h2>Jury trial waiver</h2>
<p>If for any reason a claim may proceed in court rather than in arbitration, we each waive any right to a jury trial, unless such waiver is unenforceable. This means that any claim would be decided by a judge, not a jury.</p>

<h2>Applicable law</h2>
<p>The Federal Arbitration Act and applicable federal law (or in the absence of applicable federal law, then the laws of the State of Florida), without regard to principles of conflict of laws, will govern these Terms and apply to any disputes against GatorTec.</p>

<h2>Severability</h2>
<p>If any portion of these Terms is found unenforceable, the remaining portions will continue in full force and effect.</p>

<h2>Contact</h2>
<p>If you have questions about these Terms, contact us at <a href="mailto:legal@gatortec.com">legal@gatortec.com</a> or 352.505.7582.</p>
`;

// ============ SMS TERMS ============
const smsBody = `
<p>By providing your mobile phone number to GatorTec, you consent to receive text messages from us about your order, service requests, AppleCare+ reminders, and (with separate opt-in) promotional offers. These Terms explain your rights and what to expect.</p>

<h2>Program description</h2>
<p>GatorTec's SMS program sends order status updates, service repair notifications, appointment reminders, and (where you've opted in) occasional promotional offers about Apple products and services.</p>

<h2>Message frequency</h2>
<p>Message frequency varies. You'll receive transactional messages as needed for your orders and service appointments — typically a few per order. If you've opted in to promotional messages, we may send up to four messages per month.</p>

<h2>Message and data rates</h2>
<p><strong>Message and data rates may apply.</strong> Standard messaging rates from your wireless carrier apply to messages sent to you and messages you send to us. GatorTec does not charge for the SMS messages themselves, but your carrier may.</p>

<h2>Opting in</h2>
<p>You opt in by providing your mobile number and explicitly consenting at the time of purchase, service request, or via a separate marketing opt-in. You can also opt in by texting <strong>JOIN</strong> to our service number.</p>

<h2>Opting out</h2>
<p>You can opt out of SMS messages at any time by replying <strong>STOP</strong> to any message we send. You'll receive a final confirmation message. After opting out, you will no longer receive SMS messages from GatorTec.</p>
<p>For help, reply <strong>HELP</strong> to any message or contact us at <a href="tel:+13525057582">352.505.7582</a> or <a href="mailto:store@gatortec.com">store@gatortec.com</a>.</p>

<h2>Supported carriers</h2>
<p>Our SMS program is supported by all major U.S. wireless carriers including AT&amp;T, Verizon, T-Mobile, Sprint, U.S. Cellular, and most regional carriers. Carriers are not liable for delayed or undelivered messages.</p>

<h2>Privacy</h2>
<p>We will not share your mobile number with third parties for their marketing purposes. Information you share with GatorTec via SMS is handled in accordance with our <a href="privacy.html">Privacy Policy</a>. We don't sell your personal information.</p>

<h2>Eligibility</h2>
<p>The SMS program is available to U.S. residents who are at least 18 years old (or the age of majority in their jurisdiction) and own or have authorized use of the mobile phone number provided.</p>

<h2>Changes to these terms</h2>
<p>We may change these SMS Terms from time to time. We'll post any changes on this page with an updated effective date. Continued use of the SMS service after changes constitutes acceptance.</p>

<h2>Contact</h2>
<p>Questions? Contact us at <a href="mailto:store@gatortec.com">store@gatortec.com</a> or 352.505.7582. To stop messages, reply STOP to any message.</p>
`;

// ============ FAQ ============
const FAQ_ITEMS = [
  {
    section: 'Sales',
    items: [
      { q: 'What\'s your return / refund policy?', a: '<p><strong>All sales are final.</strong> No refunds or exchanges. Diagnostics, labor, service parts, and training costs are not refundable. All new products carry their own manufacturer\'s warranty. See our <a href="../../legal/terms.html">Terms & Conditions</a> for full detail.</p>' },
      { q: 'Can I cancel an order I\'ve already placed a deposit on?', a: '<p>Yes, but cancelled orders with a deposit are subject to a 25% cancellation fee.</p>' },
      { q: 'What items are not returnable?', a: '<p>Batteries, cables, screen protectors, single-use products, software, in-ear or over-ear headphones, open box items, EV vehicles (including OneWheels), and sale or clearance items.</p>' },
      { q: 'Can I get a refund on AppleCare+ or GatorGuard?', a: '<p>AppleCare+ and GatorGuard products are nonrefundable through GatorTec. For AppleCare+ refunds, please call <strong>1-800-APL-CARE</strong> (1-800-275-2273). For GatorGuard refunds, call Safeware at <strong>1-800-800-1492</strong>.</p>' },
      { q: 'What are your payment terms for invoiced sales?', a: '<p>Unless otherwise stated in a signed contract, invoices are due in full within 15 days. Late charges accrue at 1.5% per month (18% per annum). Returned-check fee is $25 plus bank charges.</p>' },
      { q: 'How will I receive a refund on a sale over $100?', a: '<p>No in-store cash refunds on purchases over $100. GatorTec will refund any sale over $100 by check mailed to you within 7–10 business days.</p>' },
      { q: 'Can I exchange a new device I just bought?', a: '<p>Most new, still-sealed, non-CTO (non-custom-ordered) devices may be exchanged within 10 days of the original purchase date. Each exchange is evaluated on a case-by-case basis; the store manager has final discretion.</p>' },
      { q: 'Can you ship products to me?', a: '<p>Yes — we can ship products to your home, work, or as a gift. Most of the time it\'s free. Call us at <a href="tel:+13525057582">352.505.7582</a> for details.</p>' },
    ],
  },
  {
    section: 'Service',
    items: [
      { q: 'Is there a diagnostic fee?', a: '<p>Yes — there\'s a $75 diagnostic fee on out-of-warranty Mac repairs. This can be applied toward the final cost of labor if you choose to move forward with the repair. <strong>2012 and newer iMacs have a $115 diagnostic fee.</strong></p>' },
      { q: 'What does the diagnostic fee cover?', a: '<p>The diagnostic fee covers the cost of an Apple-certified technician fully testing your hardware and software to identify the issue. Once they\'ve assessed it, they\'ll call you to explain the repair and quote. If you proceed, the diagnostic fee is applied toward the labor cost.</p>' },
      { q: 'How long do repairs take?', a: '<p>Each repair varies based on complexity and the number of devices in our queue. <strong>Typical turnaround is 3–5 business days.</strong></p>' },
      { q: 'Should I back up my data before service?', a: '<p><strong>Absolutely.</strong> Any time a device is worked on for hardware or software issues, there is a chance data could be lost. Apple has guides:</p><ul><li>iPhone or iPad: <a href="https://support.apple.com/en-us/HT203977" target="_blank" rel="noopener noreferrer" aria-label="iPhone and iPad backup guide on Apple Support (opens in a new tab)">support.apple.com/en-us/HT203977 ↗</a></li><li>Mac: <a href="https://support.apple.com/en-us/HT201250" target="_blank" rel="noopener noreferrer" aria-label="Mac backup guide on Apple Support (opens in a new tab)">support.apple.com/en-us/HT201250 ↗</a></li></ul>' },
      { q: 'How do I get AppleCare+ phone support?', a: '<p>AppleCare+ phone support is available 24/7 by calling <strong>1-800-APL-CARE</strong> (1-800-275-2273).</p>' },
      { q: 'Is service by appointment?', a: '<p>Yes — service is by appointment only. Please call or message us before bringing in a device. See our <a href="../../service/index.html">Service page</a> for pricing and details.</p>' },
    ],
  },
];

function faqBody() {
  return FAQ_ITEMS.map(group => `
<h2>${group.section}</h2>
${group.items.map(it => `<details>
<summary>${it.q}</summary>
<div class="faq-body">${it.a}</div>
</details>`).join('\n')}
`).join('\n');
}

// ============ WRITE ============

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const writes = [
  ['legal/accessibility.html', legalPage({
    title: 'Accessibility Statement',
    h1: 'Accessibility Statement.',
    lede: 'Our commitment to WCAG 2.1 Level AA conformance and accessible content for everyone.',
    body: accessibilityBody,
    depth: 1,
    crumbs: [{ label: 'Home', href: '../index.html' }, { label: 'Accessibility' }],
    updated: today,
  })],
  ['legal/privacy.html', legalPage({
    title: 'Privacy Policy',
    h1: 'Privacy Policy.',
    lede: 'How GatorTec collects, uses, and protects your personal information.',
    body: privacyBody,
    depth: 1,
    crumbs: [{ label: 'Home', href: '../index.html' }, { label: 'Privacy' }],
    updated: today,
  })],
  ['legal/terms.html', legalPage({
    title: 'Terms & Conditions',
    h1: 'Terms & Conditions.',
    lede: 'The rules that govern purchases and relationships with GatorTec.',
    body: termsBody,
    depth: 1,
    crumbs: [{ label: 'Home', href: '../index.html' }, { label: 'Terms' }],
    updated: today,
  })],
  ['legal/sms-terms.html', legalPage({
    title: 'SMS Terms',
    h1: 'SMS Terms.',
    lede: 'Text-message program terms, opt-in/opt-out, and what to expect.',
    body: smsBody,
    depth: 1,
    crumbs: [{ label: 'Home', href: '../index.html' }, { label: 'SMS Terms' }],
    updated: today,
  })],
  ['business/faq/index.html', legalPage({
    title: 'Frequently Asked Questions',
    h1: 'Frequently asked questions.',
    lede: 'Answers to common questions about sales, service, and how we work.',
    body: faqBody(),
    depth: 2,
    crumbs: [{ label: 'Home', href: '../../index.html' }, { label: 'For Business', href: '../index.html' }, { label: 'FAQ' }],
    updated: today,
  })],
];

for (const [rel, content] of writes) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log('wrote:', rel);
}
console.log('Done.');
