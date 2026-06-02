// Generate Apple Watches category landing + 2 PDPs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const V = '?v=' + Math.floor(Date.now() / 1000);

function header(depth) {
  const up = '../'.repeat(depth);
  return `<a class="skip-link" href="#main">Skip to main content</a>

<header class="top">
  <div class="wrap">
    <a class="brand" href="${up}index.html" aria-label="GatorTec home">
      <img src="${up}assets/img/site/gatortec-mark.png" alt="" aria-hidden="true">
      <span>GatorTec</span>
    </a>
    <nav class="main" aria-label="Primary">
      <a href="${up}products/index.html" aria-current="page">Products</a>
      <a href="${up}business/index.html">For Business</a>
      <a href="${up}consumer/index.html">For Home</a>
      <a href="${up}service/index.html">Service</a>
      <a class="pill" href="${up}contact/index.html">Contact</a>
    </nav>
  </div>
</header>`;
}

function footer(depth) {
  const up = '../'.repeat(depth);
  return `<footer class="site">
  <div class="wrap">
    <div class="grid">
      <div class="intro">
        <a class="brand" href="${up}index.html">
          <img src="${up}assets/img/site/gatortec-mark.png" alt="" aria-hidden="true">
          <span>GatorTec</span>
        </a>
        <p>North Florida's Apple Premier Partner. Locally owned, Apple-certified, and here since 2010 — helping businesses and individuals choose, source, and own the right Apple devices. Also an Apple Authorized Service Provider.</p>
        <div class="sig-row" aria-label="Apple Premier Partner">
          <img src="${up}assets/signatures/premier-partner-2ln.png" alt="Apple Premier Partner">
        </div>
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
      </nav>
    </div>
    <div class="legal">
      <span>© 2010–2026 GatorTec, LLC. All rights reserved.</span>
      <span>Gainesville, FL · <a href="tel:+13525057582">352.505.7582</a></span>
    </div>
    <div class="apple-legal">
      <p>Apple, the Apple logo, MacBook, MacBook Air, MacBook Pro, MacBook Neo, iMac, Mac mini, Mac Studio, iPad, iPad Air, iPad Pro, iPad mini, Apple Watch, AirPods, AirPods Pro, AirPods Max, Apple TV, AirTag, HomePod, AppleCare, AppleCare+, Apple Premier Partner, and Apple Authorized Service Provider are trademarks of Apple Inc., registered in the U.S. and other countries and regions. iPhone, Apple Intelligence, and the Apple at Work program name are trademarks of Apple Inc.</p>
      <p>TM and © 2026 Apple Inc. All rights reserved.</p>
    </div>
  </div>
</footer>`;
}

function headTag(title, desc, depth) {
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
</head>
<body>`;
}

const COLOR_DOTS = {
  'jet-black': '#1a1a1a',
  'space-gray': '#5e5e5e',
  silver: '#e3e4e5',
  'rose-gold': '#dfb7a8',
  midnight: '#1f2937',
  starlight: '#f7e9d2',
};
const COLOR_LABELS = {
  'jet-black': 'Jet Black',
  'space-gray': 'Space Gray',
  silver: 'Silver',
  'rose-gold': 'Rose Gold',
  midnight: 'Midnight',
  starlight: 'Starlight',
};

const CATEGORY = {
  pageTitle: 'Apple Watch — Series 11 and SE 3 · GatorTec',
  desc: 'Explore the Apple Watch lineup at GatorTec. Apple Watch Series 11 and Apple Watch SE 3 — health, fitness, and connectivity on your wrist.',
  h1: 'Apple Watch. <em>The future of health is on your wrist.</em>',
  lede: 'A smarter, healthier, more connected life — designed to live on your wrist. Whether you want the most capable Apple Watch ever or a great-value entry into the lineup, we\'ll help you pick the right one.',
  products: [
    { slug: 'series-11', defaultColor: 'jet-black', tag: 'Apple Watch Series 11', h: 'The most advanced Apple Watch.', price: 'From $399', desc: 'S10 chip · Always-On display · Hypertension and sleep apnea notifications · 5G cellular option. Health, fitness, and connectivity at their best.' },
    { slug: 'se-3', defaultColor: 'midnight', tag: 'Apple Watch SE 3', h: 'All the essentials. Less of the cost.', price: 'From $249', desc: 'S10 chip · Crash and Fall Detection · Activity tracking · Family Setup. The Apple Watch experience at a friendly price.' },
  ],
};

function buildCategory() {
  const cards = CATEGORY.products.map(p => `      <li><a class="product-card" href="${p.slug}/index.html" aria-labelledby="${p.slug}-h">
        <span class="pcimg"><img src="../../assets/img/products/watches/${p.slug}/${p.slug}.webp${V}" alt="${p.tag}, front view."></span>
        <span class="ptag">${p.tag}</span>
        <h3 id="${p.slug}-h">${p.h}</h3>
        <span class="pprice">${p.price}</span>
        <span class="pdesc">${p.desc}</span>
        <span class="pcta">Learn more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a></li>`).join('\n\n');

  return `${headTag(CATEGORY.pageTitle, CATEGORY.desc, 2)}
${header(2)}

<main id="main">

<section class="cat-hero" aria-labelledby="h1">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="../../index.html">Home</a>
      <span class="sep" aria-hidden="true">›</span>
      <a href="../index.html">Products</a>
      <span class="sep" aria-hidden="true">›</span>
      <span class="current">Apple Watch</span>
    </nav>
    <h1 id="h1">${CATEGORY.h1}</h1>
    <p class="lede">${CATEGORY.lede}</p>
  </div>
</section>

<section class="section" aria-labelledby="lineup-h">
  <div class="wrap">
    <h2 id="lineup-h" class="sr-only">The Apple Watch lineup</h2>
    <ul class="product-grid" role="list">

${cards}

    </ul>
  </div>
</section>

<section class="section alt" aria-labelledby="help-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>Not sure which Apple Watch?</span>
      <h2 id="help-h">We can help you decide.</h2>
      <p>Tell us what features matter most — cellular, advanced health sensors, screen brightness, battery life — and we'll recommend the right model, case material, and band.</p>
    </div>
    <div class="dual-cta">
      <a class="dcta biz" href="../../business/contact/index.html">
        <span class="dlabel">For Business</span>
        <h3>Request a quote</h3>
        <p>Apple Watch deployments for field teams, healthcare, and corporate wellness.</p>
        <span class="arrow">Get a B2B quote
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>
      <a class="dcta home" href="../../consumer/contact/index.html">
        <span class="dlabel">For Home</span>
        <h3>Contact us to order</h3>
        <p>One-on-one help from a GatorTec expert.</p>
        <span class="arrow">Talk to an expert
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>
    </div>
  </div>
</section>

</main>

${footer(2)}

</body>
</html>
`;
}

const PDPS = {
  'series-11': {
    title: 'Apple Watch Series 11 · GatorTec',
    desc: 'Apple Watch Series 11. S10 chip, hypertension and sleep apnea notifications, always-on display, 5G cellular option. Talk to a GatorTec expert.',
    tag: 'Apple Watch Series 11',
    h1: 'Apple Watch Series 11. <em>Forward thinking.</em>',
    tagline: 'The most advanced Apple Watch ever. Industry-first hypertension notifications. Sleep score. Twice the durability with new scratch-resistant glass. Faster 5G cellular. All-day battery life.',
    price: '$399',
    defaultColor: 'jet-black',
    colors: ['jet-black', 'space-gray', 'silver', 'rose-gold'],
    feature_h: 'Built for your wellbeing.',
    feature_alts: {
      4: 'Apple Watch showing the always-on Retina display.',
      6: 'Apple Watch Series 11 case detail.',
    },
    config: {
      'Case size': ['42mm', '46mm'],
      'Case material': ['Aluminum', 'Titanium (select finishes)'],
      'Case finishes (Aluminum)': ['Jet Black', 'Space Gray', 'Silver', 'Rose Gold'],
      'Connectivity': ['GPS', 'GPS + Cellular (5G)'],
      'Health features': ['ECG', 'Blood Oxygen<sup>1</sup>', 'Hypertension notifications<sup>2</sup>', 'Sleep apnea notifications<sup>2</sup>', 'Temperature sensing'],
      'Bands': ['Sport Band', 'Sport Loop', 'Braided Solo Loop', 'Solo Loop', 'Milanese Loop', 'Modern Buckle', 'and more'],
    },
    keyFeatures: [
      { h: 'S10 chip', p: 'Faster on-device intelligence powers smarter Siri, faster app launches, and on-device dictation.' },
      { h: 'Always-On Retina display', p: 'Up to 2,000 nits of brightness and twice the scratch resistance with new Ion-X front crystal — easier to read in any light, more durable in everyday wear.' },
      { h: 'Hypertension notifications<sup>2</sup>', p: 'Apple Watch can analyze how your blood vessels respond to your heartbeats over 30 days and notify you of patterns consistent with chronic hypertension.' },
      { h: 'Sleep score and sleep apnea<sup>2</sup>', p: 'A nightly Sleep Score helps you understand your sleep quality. Apple Watch can also detect breathing disturbances that may indicate sleep apnea.' },
      { h: '5G cellular option', p: 'Stay connected — calls, messages, music — even when your iPhone is at home. New faster 5G modem.' },
      { h: 'Crash and Fall Detection', p: 'Apple Watch can detect a severe car crash or a hard fall and connect you to emergency services.<sup>3</sup>' },
    ],
    footnotes: [
      '<sup>1</sup> The Blood Oxygen feature is not available in all regions; see <a href="https://support.apple.com">support.apple.com</a> for details.',
      '<sup>2</sup> Hypertension and sleep apnea notifications are not intended for users with a previously established diagnosis. They are not designed to detect a heart attack, heart conditions, or other conditions. Consult your doctor before making any medical decisions.',
      '<sup>3</sup> Crash Detection is designed to detect severe car crashes — such as front-impact, side-impact, rear-end, and rollover collisions. Not all crashes will be detected.',
      'Cellular service requires a wireless service plan sold separately. Bands sold separately. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary: 'Case size, finish, cellular, bands — we\'ll walk you through it.',
  },
  'se-3': {
    title: 'Apple Watch SE 3 · GatorTec',
    desc: 'Apple Watch SE 3. S10 chip, Crash Detection, Fall Detection, all the essentials at a friendlier price. Talk to a GatorTec expert.',
    tag: 'Apple Watch SE 3',
    h1: 'Apple Watch SE 3. <em>All the essentials. Less of the cost.</em>',
    tagline: 'The most affordable Apple Watch — with the S10 chip, Crash Detection, Fall Detection, and activity tracking. A great first Apple Watch, a great pick for kids on Family Setup, and a great companion for everyday life.',
    price: '$249',
    defaultColor: 'midnight',
    colors: ['midnight', 'starlight'],
    feature_h: 'Everything you need. Nothing you don\'t.',
    feature_alts: {
      4: 'Apple Watch SE 3 on a wrist showing fitness rings.',
      6: 'Apple Watch SE 3 case detail.',
    },
    config: {
      'Case size': ['40mm', '44mm'],
      'Case material': ['Aluminum'],
      'Case finishes': ['Midnight', 'Starlight'],
      'Connectivity': ['GPS', 'GPS + Cellular'],
      'Health features': ['Heart rate', 'High and low heart rate notifications', 'Temperature sensing'],
      'Bands': ['Sport Band', 'Sport Loop', 'Solo Loop', 'and more'],
    },
    keyFeatures: [
      { h: 'S10 chip', p: 'Smooth, responsive performance — the same chip family as Series 11. Smarter Siri and faster app launches.' },
      { h: 'Crash and Fall Detection', p: 'Apple Watch SE can detect a severe car crash or a hard fall and connect you to emergency services if you need help.<sup>1</sup>' },
      { h: 'Activity, Workout, and Sleep tracking', p: 'Close your rings, track over 50 workout types, and get a nightly Sleep Score to better understand your sleep.' },
      { h: 'Always-on heart rate', p: 'Heart rate monitoring with high and low heart rate notifications. Temperature sensing for cycle tracking.' },
      { h: 'Family Setup', p: 'A great Apple Watch for kids or older family members without an iPhone — managed and paired from your iPhone.' },
      { h: 'Up to 18 hours of battery life', p: 'All-day battery with low power mode extending up to 36 hours. Fast charging when you need it.' },
    ],
    footnotes: [
      '<sup>1</sup> Crash Detection is designed to detect severe car crashes. Not all crashes will be detected.',
      'Cellular service requires a wireless service plan sold separately. Bands sold separately. Family Setup requires a compatible iPhone. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary: 'Case size, color, cellular, bands — we\'ll help you pick.',
  },
};

function buildPDP(slug, pdp) {
  const swatches = pdp.colors.map(c => `          <button type="button" class="swatch" aria-pressed="${c === pdp.defaultColor ? 'true' : 'false'}"
                  data-image="../../../assets/img/products/watches/${slug}/${slug}-${c}.webp"
                  data-alt="${pdp.tag} in ${COLOR_LABELS[c]}.">
            <span class="swatch-dot" style="background:${COLOR_DOTS[c]}" aria-hidden="true"></span>${COLOR_LABELS[c]}
          </button>`).join('\n');

  const configRows = Object.entries(pdp.config).map(([key, vals]) =>
    `      <div class="config-row"><dt>${key}</dt><dd>${vals.map(v => `<span class="opt">${v}</span>`).join('')}</dd></div>`
  ).join('\n');

  const kf = pdp.keyFeatures.map(k => `      <li class="kf"><h3>${k.h}</h3>\n        <p>${k.p}</p></li>`).join('\n');
  const footnotes = pdp.footnotes.map(f => `      <p>${f}</p>`).join('\n');

  return `${headTag(pdp.title, pdp.desc, 3)}
${header(3)}

<main id="main">

<section class="pdp-hero" aria-labelledby="h1">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="../../../index.html">Home</a>
      <span class="sep" aria-hidden="true">›</span>
      <a href="../../index.html">Products</a>
      <span class="sep" aria-hidden="true">›</span>
      <a href="../index.html">Apple Watch</a>
      <span class="sep" aria-hidden="true">›</span>
      <span class="current">${pdp.tag.replace(/Apple Watch /, '')}</span>
    </nav>
    <div class="hero-grid">
      <div>
        <span class="ptag">${pdp.tag}</span>
        <h1 id="h1">${pdp.h1}</h1>
        <p class="tagline">${pdp.tagline}</p>
        <p class="price">Starting at <strong>${pdp.price}</strong></p>
        <div class="swatches" role="group" aria-label="Choose a finish">
${swatches}
        </div>
      </div>
      <div class="product-image">
        <img src="../../../assets/img/products/watches/${slug}/${slug}-${pdp.defaultColor}.webp${V}"
             alt="${pdp.tag} in ${COLOR_LABELS[pdp.defaultColor]}.">
      </div>
    </div>
  </div>
</section>

<section class="section alt" aria-labelledby="fg-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>At a glance</span>
      <h2 id="fg-h">${pdp.feature_h}</h2>
    </div>
    <div class="feature-gallery">
      <div class="fg-tile"><img src="../../../assets/img/products/watches/${slug}/${slug}-feature-4.webp" alt="${pdp.feature_alts[4]}"></div>
      <div class="fg-tile"><img src="../../../assets/img/products/watches/${slug}/${slug}-feature-6.webp" alt="${pdp.feature_alts[6]}"></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="kf-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>Key features</span>
      <h2 id="kf-h">What makes it special.</h2>
    </div>
    <ul class="key-features" role="list">
${kf}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="config-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>Configurations</span>
      <h2 id="config-h">What you can choose.</h2>
      <p>The options Apple offers on this product. Tell us how you'll use it and we'll recommend the right one — or build to your spec.</p>
    </div>
    <dl class="config-table">
${configRows}
    </dl>
    <p class="config-note">Custom configurations, band combinations, and current pricing — contact GatorTec.</p>
  </div>
</section>

<section class="section alt" aria-labelledby="ac-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>Add-on coverage</span>
      <h2 id="ac-h">Cover your Apple Watch with AppleCare+.</h2>
    </div>
    <div class="acn">
      <span class="acn-logo"><img src="../../../assets/img/site/applecare-plus-logo.svg" alt="AppleCare+"></span>
      <div>
        <h3>AppleCare+ for Apple Watch</h3>
        <p>Easy, fast repairs for accidents like drops and cracked screens, plus 24/7 priority care from Apple experts.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="cta-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>Talk to GatorTec</span>
      <h2 id="cta-h">Ready to order — or have a question?</h2>
      <p>${pdp.cardSummary}</p>
    </div>
    <div class="dual-cta">
      <a class="dcta biz" href="../../../business/contact/index.html">
        <span class="dlabel">For Business</span>
        <h3>Request a quote</h3>
        <p>Apple Watch deployments for field teams, healthcare, and corporate wellness.</p>
        <span class="arrow">Get a B2B quote
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>
      <a class="dcta home" href="../../../consumer/contact/index.html">
        <span class="dlabel">For Home</span>
        <h3>Contact us to order</h3>
        <p>One-on-one help from a GatorTec expert.</p>
        <span class="arrow">Talk to an expert
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>
    </div>
  </div>
</section>

<section class="section alt" aria-labelledby="fn-h">
  <div class="wrap">
    <h2 id="fn-h" class="sr-only">Footnotes</h2>
    <div class="footnotes">
${footnotes}
    </div>
  </div>
</section>

</main>

${footer(3)}

<script src="../../../assets/js/pdp.js" defer></script>
</body>
</html>
`;
}

const dir = path.join(ROOT, 'products', 'watches');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.html'), buildCategory());
console.log('wrote category landing');

for (const [slug, pdp] of Object.entries(PDPS)) {
  const d = path.join(dir, slug);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'index.html'), buildPDP(slug, pdp));
  console.log('wrote PDP:', slug);
}
console.log('Done.');
