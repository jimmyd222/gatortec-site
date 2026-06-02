// Generate iPads category landing + 4 PDPs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const V = '?v=' + Math.floor(Date.now() / 1000);

// Shared header/footer chunks based on path depth
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

// ===========================================================
// CATEGORY LANDING
// ===========================================================
const CATEGORY = {
  pageTitle: 'iPads — iPad Pro, iPad Air, iPad, iPad mini · GatorTec',
  desc: 'Explore the iPad lineup at GatorTec. iPad Pro, iPad Air, iPad, and iPad mini — research, compare, and let a GatorTec expert help you order the right one.',
  h1: 'iPad. <em>For every kind of work and play.</em>',
  lede: 'From the ultra-portable iPad mini to the powerhouse iPad Pro with M5 — Apple\'s iPad lineup spans note-taking, on-the-go work, creative studios, and field deployments. Tell us how you\'ll use it and we\'ll help you choose.',
  products: [
    { slug: 'ipad-pro', defaultColor: 'silver', tag: 'iPad Pro', h: 'The ultimate iPad experience.', price: 'From $999', desc: 'M5 chip · 11- or 13-inch Ultra Retina XDR display · Apple Pencil Pro. Built for pro workflows — photo and video editing, 3D, music production.' },
    { slug: 'ipad-air', defaultColor: 'blue', tag: 'iPad Air', h: 'Serious performance. Seriously portable.', price: 'From $599', desc: 'M3 chip · 11- or 13-inch Liquid Retina display · Four colors. Powerful and versatile, ideal for everyday work, study, and creativity.' },
    { slug: 'ipad', defaultColor: 'blue', tag: 'iPad', h: 'iPad does it all.', price: 'From $349', desc: 'A16 chip · 11-inch Liquid Retina display · Four colors. The most affordable iPad — perfect for school, browsing, and family use.' },
    { slug: 'ipad-mini', defaultColor: 'blue', tag: 'iPad mini', h: 'Mighty in the palm of your hand.', price: 'From $499', desc: 'A17 Pro chip · 8.3-inch Liquid Retina display · Four colors. Ultra-portable for note-taking, reading, gaming, and field work.' },
  ],
};

function buildCategory() {
  const cards = CATEGORY.products.map(p => `      <li><a class="product-card" href="${p.slug}/index.html" aria-labelledby="${p.slug}-h">
        <span class="pcimg"><img src="../../assets/img/products/ipads/${p.slug}/${p.slug}.webp${V}" alt="${p.tag}, front view."></span>
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
      <span class="current">iPads</span>
    </nav>
    <h1 id="h1">${CATEGORY.h1}</h1>
    <p class="lede">${CATEGORY.lede}</p>
  </div>
</section>

<section class="section" aria-labelledby="lineup-h">
  <div class="wrap">
    <h2 id="lineup-h" class="sr-only">The iPad lineup</h2>
    <ul class="product-grid" role="list">

${cards}

    </ul>
  </div>
</section>

<section class="section alt" aria-labelledby="help-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>Not sure which iPad?</span>
      <h2 id="help-h">We can help you decide.</h2>
      <p>Tell us how the iPad will be used — note-taking, drawing, video, fleet deployment, kiosks — and we'll recommend the right size, chip, storage, and accessories. No pressure, no checkout.</p>
    </div>
    <div class="dual-cta">
      <a class="dcta biz" href="../../business/contact/index.html">
        <span class="dlabel">For Business</span>
        <h3>Request a quote</h3>
        <p>Volume purchasing, deployment-ready devices, Apple Business Manager enrollment, and dedicated account contact.</p>
        <span class="arrow">Get a B2B quote
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </a>
      <a class="dcta home" href="../../consumer/contact/index.html">
        <span class="dlabel">For Home</span>
        <h3>Contact us to order</h3>
        <p>One-on-one help from a GatorTec expert. We'll match the right iPad to how you actually use it, and order it for you.</p>
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

// ===========================================================
// PDPs
// ===========================================================
const COLOR_DOTS = {
  silver: '#e3e4e5',
  'space-black': '#39383d',
  blue: '#6790a8',
  purple: '#9b8fbf',
  'space-gray': '#5e5e5e',
  starlight: '#f7e9d2',
  pink: '#f5c0c0',
  yellow: '#e9d878',
};

const COLOR_LABELS = {
  silver: 'Silver',
  'space-black': 'Space Black',
  blue: 'Blue',
  purple: 'Purple',
  'space-gray': 'Space Gray',
  starlight: 'Starlight',
  pink: 'Pink',
  yellow: 'Yellow',
};

const PDPS = {
  'ipad-pro': {
    title: 'iPad Pro with M5 chip · GatorTec',
    desc: 'iPad Pro with M5 chip. 11- or 13-inch Ultra Retina XDR display, supports Apple Pencil Pro. Talk to a GatorTec expert.',
    tag: 'iPad Pro · M5 chip',
    h1: 'iPad Pro. <em>Unbelievably thin. Incredibly powerful.</em>',
    tagline: 'The all-new M5 chip lifts iPad Pro performance to extraordinary new heights. Ultra Retina XDR display with tandem OLED for stunning visuals. Pair with Apple Pencil Pro and the Magic Keyboard for a complete mobile pro studio.<sup>1</sup>',
    price: '$999',
    defaultColor: 'silver',
    colors: ['silver', 'space-black'],
    feature_alts: {
      4: 'iPad Pro with Magic Keyboard.',
      5: 'iPad Pro with Apple Pencil Pro.',
      6: 'Apple M5 chip detail.',
    },
    feature_h: 'A complete pro studio.',
    config: {
      'Display': ['11-inch Ultra Retina XDR', '13-inch Ultra Retina XDR'],
      'Display options': ['Standard glass', 'Nano-texture glass (1TB/2TB)'],
      'Chip': ['Apple M5'],
      'Memory': ['12GB (256GB/512GB)', '16GB (1TB/2TB)'],
      'Storage': ['256GB', '512GB', '1TB', '2TB'],
      'Connectivity': ['Wi-Fi', 'Wi-Fi + Cellular (5G)'],
      'Colors': ['Silver', 'Space Black'],
      'Accessories': ['Apple Pencil Pro', 'Apple Pencil (USB-C)', 'Magic Keyboard for iPad Pro'],
    },
    keyFeatures: [
      { h: 'M5 chip — pro performance, anywhere', p: 'The next leap in Apple silicon for iPad. CPU and GPU performance for demanding workflows like photo editing, 4K video, music production, and 3D modeling.' },
      { h: 'Ultra Retina XDR display', p: 'Tandem OLED technology delivers extreme brightness, exceptional contrast, and pin-sharp detail. ProMotion for fluid scrolling and responsive interactions.' },
      { h: 'Apple Pencil Pro', p: 'Squeeze for tool palettes, barrel roll for precise shaping, haptic feedback, and Find My support. The most advanced Apple Pencil ever.' },
      { h: 'Apple Intelligence built in', p: 'On-device AI for writing, image creation, and natural language. Private by design.<sup>1</sup>' },
      { h: 'Thunderbolt 4 / USB-4', p: 'Connect to high-performance accessories, displays, and external storage. Faster transfers, broader compatibility.' },
      { h: 'All-day battery life', p: 'Up to 10 hours of surfing the web on Wi-Fi or watching video. Wi-Fi + Cellular models support fast 5G.' },
    ],
    footnotes: [
      '<sup>1</sup> Apple Intelligence is available in beta. Some features may not be available in all regions or languages. For feature and language availability and system requirements, see <a href="https://support.apple.com/121115">support.apple.com/121115</a>.',
      'Configurable options are available. iPad Pro accessories sold separately. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary: 'Configurations, sizes, storage, accessories — we\'ll walk you through it.',
  },

  'ipad-air': {
    title: 'iPad Air with M3 chip · GatorTec',
    desc: 'iPad Air with M3 chip. 11- or 13-inch Liquid Retina display, four colors, Apple Pencil Pro support. Talk to a GatorTec expert.',
    tag: 'iPad Air · M3 chip',
    h1: 'iPad Air. <em>Light. Mighty. Magic.</em>',
    tagline: 'A breakthrough combination of design and performance — the M3 chip delivers a major boost to everyday tasks and demanding apps alike, in an ultraportable form factor that fits in any bag.<sup>1</sup>',
    price: '$599',
    defaultColor: 'blue',
    colors: ['blue', 'purple', 'space-gray', 'starlight'],
    feature_alts: {
      4: 'iPad Air with Magic Keyboard.',
      5: 'iPad Air with Apple Pencil Pro.',
      6: 'iPad Air in four colors.',
    },
    feature_h: 'Made for what\'s next.',
    config: {
      'Display': ['11-inch Liquid Retina', '13-inch Liquid Retina'],
      'Chip': ['Apple M3'],
      'Memory': ['8GB unified memory'],
      'Storage': ['128GB', '256GB', '512GB', '1TB'],
      'Connectivity': ['Wi-Fi', 'Wi-Fi + Cellular (5G)'],
      'Colors': ['Blue', 'Purple', 'Space Gray', 'Starlight'],
      'Accessories': ['Apple Pencil Pro', 'Apple Pencil (USB-C)', 'Magic Keyboard for iPad Air'],
    },
    keyFeatures: [
      { h: 'M3 chip', p: 'A big performance jump from the previous generation — handles demanding apps, multitasking, and graphics with ease.' },
      { h: 'Two sizes — 11 or 13 inches', p: 'Pick the size that fits how you work. Both feature gorgeous Liquid Retina displays with True Tone and P3 wide color.' },
      { h: 'Four bold colors', p: 'Blue, Purple, Space Gray, and Starlight — make iPad Air your own.' },
      { h: 'Apple Pencil Pro support', p: 'Get the latest Pencil features — squeeze, barrel roll, haptic feedback — for note-taking, drawing, and markup.' },
      { h: 'Apple Intelligence ready', p: 'Built-in AI helps you write, summarize, generate, and stay on task — privately, on device.<sup>1</sup>' },
      { h: 'All-day battery life', p: 'Up to 10 hours of web on Wi-Fi or watching video. Charges quickly over USB-C.' },
    ],
    footnotes: [
      '<sup>1</sup> Apple Intelligence is available in beta. Some features may not be available in all regions or languages. See <a href="https://support.apple.com/121115">support.apple.com/121115</a>.',
      'Configurable options are available. Accessories sold separately. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary: 'Sizes, storage, colors, accessories — we\'ll help you choose.',
  },

  'ipad': {
    title: 'iPad with A16 chip · GatorTec',
    desc: 'iPad with A16 chip. 11-inch Liquid Retina display, four colors, the most affordable iPad. Talk to a GatorTec expert.',
    tag: 'iPad · A16 chip',
    h1: 'iPad. <em>Helpful. Cheerful. Capable.</em>',
    tagline: 'A vibrant, easy-to-love iPad that\'s perfect for browsing, family use, students, and casual creators. With the A16 chip, an 11-inch Liquid Retina display, and a starting price that\'s very approachable.',
    price: '$349',
    defaultColor: 'blue',
    colors: ['blue', 'pink', 'silver', 'yellow'],
    feature_alts: {
      4: 'iPad with Magic Keyboard Folio.',
      5: 'iPad with Apple Pencil (USB-C).',
      6: 'iPad in four colors.',
    },
    feature_h: 'Built for everyday brilliance.',
    config: {
      'Display': ['11-inch Liquid Retina'],
      'Chip': ['Apple A16 Bionic'],
      'Storage': ['128GB', '256GB', '512GB'],
      'Connectivity': ['Wi-Fi', 'Wi-Fi + Cellular (5G)'],
      'Colors': ['Blue', 'Pink', 'Silver', 'Yellow'],
      'Accessories': ['Apple Pencil (USB-C)', 'Apple Pencil (1st gen)', 'Magic Keyboard Folio for iPad'],
    },
    keyFeatures: [
      { h: 'A16 chip', p: 'Fast and efficient — handles everything from web browsing and email to photo editing and casual games.' },
      { h: '11-inch Liquid Retina display', p: 'A larger, more vibrant display with True Tone for comfortable reading any time of day.' },
      { h: 'Four cheerful colors', p: 'Blue, Pink, Silver, and Yellow — pick the one that suits your style.' },
      { h: 'Apple Pencil support', p: 'Compatible with Apple Pencil (USB-C) for note-taking, sketching, and markup — and with the original 1st-generation Apple Pencil.' },
      { h: 'Landscape camera', p: 'A 12MP Ultra Wide front-facing camera positioned for landscape orientation — perfect for video calls.' },
      { h: 'All-day battery life', p: 'Up to 10 hours of web browsing on Wi-Fi. Charges over USB-C.' },
    ],
    footnotes: [
      'Apple Pencil and Magic Keyboard Folio sold separately. Configurable options are available. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary: 'Storage, color, accessories — we\'ll help you pick.',
  },

  'ipad-mini': {
    title: 'iPad mini with A17 Pro chip · GatorTec',
    desc: 'iPad mini with A17 Pro chip. 8.3-inch Liquid Retina display, four colors, ultra-portable. Talk to a GatorTec expert.',
    tag: 'iPad mini · A17 Pro chip',
    h1: 'iPad mini. <em>Mega power. Mini sized.</em>',
    tagline: 'An ultra-portable iPad with the muscle of Apple Intelligence inside. The A17 Pro chip handles graphics-intensive apps and on-device AI in a form factor small enough to hold one-handed.<sup>1</sup>',
    price: '$499',
    defaultColor: 'blue',
    colors: ['blue', 'purple', 'space-gray', 'starlight'],
    feature_alts: {
      4: 'iPad mini with Apple Pencil Pro.',
      5: 'iPad mini held one-handed.',
      6: 'iPad mini in four colors.',
    },
    feature_h: 'Ultra-portable. Ultra-capable.',
    config: {
      'Display': ['8.3-inch Liquid Retina'],
      'Chip': ['Apple A17 Pro'],
      'Storage': ['128GB', '256GB', '512GB'],
      'Connectivity': ['Wi-Fi', 'Wi-Fi + Cellular (5G)'],
      'Colors': ['Blue', 'Purple', 'Space Gray', 'Starlight'],
      'Accessories': ['Apple Pencil Pro', 'Apple Pencil (USB-C)'],
    },
    keyFeatures: [
      { h: 'A17 Pro chip', p: 'Hardware-accelerated ray tracing, faster CPU and GPU — built to handle on-device Apple Intelligence and demanding apps.<sup>1</sup>' },
      { h: '8.3-inch Liquid Retina display', p: 'Vibrant, sharp, and held one-handed. Wide color, True Tone, and great viewing angles.' },
      { h: 'Apple Pencil Pro support', p: 'Squeeze for tool palettes, barrel roll for shaping, haptic feedback, Find My — full Pencil Pro features in the smallest iPad.' },
      { h: 'Apple Intelligence', p: 'On-device AI helps you write, summarize, generate, and get things done — privately.<sup>1</sup>' },
      { h: 'Pocketable form factor', p: 'Easy to carry in a jacket pocket, a small bag, or in hand. Perfect for field work, reading, and gaming.' },
      { h: '5G cellular option', p: 'Stay connected anywhere. Wi-Fi + Cellular models support fast 5G.' },
    ],
    footnotes: [
      '<sup>1</sup> Apple Intelligence is available in beta. Some features may not be available in all regions or languages. See <a href="https://support.apple.com/121115">support.apple.com/121115</a>.',
      'Apple Pencil sold separately. Configurable options are available. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary: 'Storage, color, Pencil options — we\'ll help you pick.',
  },
};

function buildPDP(slug, pdp) {
  const swatches = pdp.colors.map((c, i) => `          <button type="button" class="swatch" aria-pressed="${c === pdp.defaultColor ? 'true' : 'false'}"
                  data-image="../../../assets/img/products/ipads/${slug}/${slug}-${c}.webp"
                  data-alt="${pdp.tag.split('·')[0].trim()} in ${COLOR_LABELS[c]}, front view.">
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
      <a href="../index.html">iPads</a>
      <span class="sep" aria-hidden="true">›</span>
      <span class="current">${pdp.tag.split('·')[0].trim()}</span>
    </nav>
    <div class="hero-grid">
      <div>
        <span class="ptag">${pdp.tag}</span>
        <h1 id="h1">${pdp.h1}</h1>
        <p class="tagline">${pdp.tagline}</p>
        <p class="price">Starting at <strong>${pdp.price}</strong></p>
        <div class="swatches" role="group" aria-label="Choose a color">
${swatches}
        </div>
      </div>
      <div class="product-image">
        <img src="../../../assets/img/products/ipads/${slug}/${slug}-${pdp.defaultColor}.webp${V}"
             alt="${pdp.tag.split('·')[0].trim()} in ${COLOR_LABELS[pdp.defaultColor]}, front view.">
      </div>
    </div>
  </div>
</section>

<!-- ============ FEATURE GALLERY ============ -->
<section class="section alt" aria-labelledby="fg-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>At a glance</span>
      <h2 id="fg-h">${pdp.feature_h}</h2>
    </div>
    <div class="feature-gallery">
      <div class="fg-tile"><img src="../../../assets/img/products/ipads/${slug}/${slug}-feature-4.webp" alt="${pdp.feature_alts[4]}"></div>
      <div class="fg-tile"><img src="../../../assets/img/products/ipads/${slug}/${slug}-feature-6.webp" alt="${pdp.feature_alts[6]}"></div>
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

<!-- ============ CONFIGURATIONS ============ -->
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
    <p class="config-note">Custom configurations and current pricing — contact GatorTec.</p>
  </div>
</section>

<section class="section alt" aria-labelledby="ac-h">
  <div class="wrap">
    <div class="shead">
      <span class="eyebrow"><span class="dot" aria-hidden="true"></span>Add-on coverage</span>
      <h2 id="ac-h">Cover your iPad with AppleCare+.</h2>
    </div>
    <div class="acn">
      <span class="acn-logo"><img src="../../../assets/img/site/applecare-plus-logo.svg" alt="AppleCare+"></span>
      <div>
        <h3>AppleCare+ for iPad</h3>
        <p>Easy, fast repairs for accidents like drops and spills, plus 24/7 priority care from Apple experts — chat, call, or tap.</p>
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
        <p>Volume purchasing, deployment-ready devices, Apple Business Manager enrollment, and dedicated account contact.</p>
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

// ===== WRITE =====
const ipadsDir = path.join(ROOT, 'products', 'ipads');
fs.mkdirSync(ipadsDir, { recursive: true });
fs.writeFileSync(path.join(ipadsDir, 'index.html'), buildCategory());
console.log('wrote category landing');

for (const [slug, pdp] of Object.entries(PDPS)) {
  const d = path.join(ipadsDir, slug);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'index.html'), buildPDP(slug, pdp));
  console.log('wrote PDP:', slug);
}
console.log('Done.');
