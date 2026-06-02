// Generate Displays + Apple TV + Accessories pages
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const V = '?v=' + Math.floor(Date.now() / 1000);

function header(d){const u='../'.repeat(d);return`<a class="skip-link" href="#main">Skip to main content</a>
<header class="top"><div class="wrap">
<a class="brand" href="${u}index.html" aria-label="GatorTec home"><img src="${u}assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<nav class="main" aria-label="Primary">
<a href="${u}products/index.html" aria-current="page">Products</a>
<a href="${u}business/index.html">For Business</a>
<a href="${u}consumer/index.html">For Home</a>
<a href="${u}service/index.html">Service</a>
<a class="pill" href="${u}contact/index.html">Contact</a>
</nav></div></header>`;}

function footer(d){const u='../'.repeat(d);return`<footer class="site"><div class="wrap">
<div class="grid">
<div class="intro">
<a class="brand" href="${u}index.html"><img src="${u}assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<p>North Florida's Apple Premier Partner. Locally owned, Apple-certified, and here since 2010 — helping businesses and individuals choose, source, and own the right Apple devices. Also an Apple Authorized Service Provider.</p>
<div class="sig-row" aria-label="Apple Premier Partner"><img src="${u}assets/signatures/premier-partner-2ln.png" alt="Apple Premier Partner"></div>
</div>
<nav class="col" aria-label="For Business"><h3>For Business</h3>
<a href="${u}business/index.html">Overview</a>
<a href="${u}business/products/index.html">Products</a>
<a href="${u}business/service/index.html">Service</a>
<a href="${u}business/contact/index.html">Request a quote</a>
</nav>
<nav class="col" aria-label="For Home"><h3>For Home</h3>
<a href="${u}consumer/index.html">Overview</a>
<a href="${u}consumer/products/index.html">Products</a>
<a href="${u}consumer/service/index.html">Service</a>
<a href="${u}consumer/contact/index.html">Contact us</a>
</nav>
<nav class="col" aria-label="Company"><h3>Company</h3>
<a href="${u}business/faq/index.html">FAQ</a>
<a href="${u}legal/accessibility.html">Accessibility</a>
<a href="${u}legal/privacy.html">Privacy</a>
<a href="${u}legal/terms.html">Terms</a>
<a href="${u}legal/sms-terms.html">SMS Terms</a>
</nav>
</div>
<div class="legal"><span>© 2010–2026 GatorTec, LLC. All rights reserved.</span><span>Gainesville, FL · <a href="tel:+13525057582">352.505.7582</a></span></div>
<div class="apple-legal">
<p>Apple, the Apple logo, MacBook, MacBook Air, MacBook Pro, MacBook Neo, iMac, Mac mini, Mac Studio, iPad, iPad Air, iPad Pro, iPad mini, Apple Watch, AirPods, AirPods Pro, AirPods Max, Apple TV, AirTag, HomePod, AppleCare, AppleCare+, Apple Premier Partner, and Apple Authorized Service Provider are trademarks of Apple Inc., registered in the U.S. and other countries and regions. iPhone, Apple Intelligence, and the Apple at Work program name are trademarks of Apple Inc.</p>
<p>TM and © 2026 Apple Inc. All rights reserved.</p>
</div></div></footer>`;}

function headTag(title,desc,d){const u='../'.repeat(d);return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="icon" type="image/png" sizes="32x32" href="${u}assets/img/site/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="${u}assets/img/site/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="${u}assets/img/site/apple-touch-icon.png">
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${u}assets/css/tokens.css">
<link rel="stylesheet" href="${u}assets/css/base.css">
</head><body>`;}

// ============= DISPLAYS =============
function buildDisplaysCategory() {
  const products = [
    { slug: 'studio-display', tag: 'Studio Display', h: 'Brilliant 27-inch 5K Retina display.', price: '$1,599', desc: '27-inch 5K Retina · 600 nits sustained · 12MP Center Stage camera · Studio-quality mics and six-speaker sound. The do-it-all display for Mac.' },
    { slug: 'studio-display-xdr', tag: 'Studio Display XDR', h: 'Pro-level performance and color.', price: '$3,999', desc: 'Mini-LED XDR backlighting · ProMotion · Reference modes for professional workflows. The display for serious pro Macs.' },
  ];
  const cards = products.map(p=>`<li><a class="product-card" href="${p.slug}/index.html" aria-labelledby="${p.slug}-h">
<span class="pcimg"><img src="../../assets/img/products/displays/${p.slug}/${p.slug}.webp${V}" alt="${p.tag} front view."></span>
<span class="ptag">${p.tag}</span>
<h3 id="${p.slug}-h">${p.h}</h3>
<span class="pprice">${p.price}</span>
<span class="pdesc">${p.desc}</span>
<span class="pcta">Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a></li>`).join('\n\n');
  return `${headTag('Displays — Studio Display and Studio Display XDR · GatorTec', 'Apple Studio Display and Studio Display XDR at GatorTec.', 2)}
${header(2)}
<main id="main">
<section class="cat-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="../../index.html">Home</a><span class="sep" aria-hidden="true">›</span><a href="../index.html">Products</a><span class="sep" aria-hidden="true">›</span><span class="current">Displays</span></nav>
<h1 id="h1">Apple Displays. <em>Built for Mac.</em></h1>
<p class="lede">A perfect partner for your Mac — 27-inch 5K Retina for the all-around Studio Display, or pro-grade Mini-LED XDR for the most demanding workflows.</p>
</div></section>
<section class="section" aria-labelledby="lineup-h"><div class="wrap">
<h2 id="lineup-h" class="sr-only">The Apple Display lineup</h2>
<ul class="product-grid" role="list">
${cards}
</ul>
</div></section>
${dualCTA(2)}
</main>
${footer(2)}
</body></html>`;
}

function dualCTA(depth) {
  const up = '../'.repeat(depth);
  return `<section class="section alt" aria-labelledby="help-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>Need help?</span><h2 id="help-h">We can help you decide.</h2>
<p>Tell us how it'll be used and we'll recommend the right configuration and accessories.</p>
</div>
<div class="dual-cta">
<a class="dcta biz" href="${up}business/contact/index.html"><span class="dlabel">For Business</span><h3>Request a quote</h3>
<p>Volume purchasing and deployment-ready devices.</p>
<span class="arrow">Get a B2B quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
<a class="dcta home" href="${up}consumer/contact/index.html"><span class="dlabel">For Home</span><h3>Contact us to order</h3>
<p>One-on-one help from a GatorTec expert.</p>
<span class="arrow">Talk to an expert <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
</div>
</div></section>`;
}

const DISPLAYS = {
  'studio-display': {
    title: 'Studio Display · GatorTec',
    desc: 'Apple Studio Display. 27-inch 5K Retina display, 12MP Center Stage camera, studio-quality mics and speakers.',
    tag: 'Studio Display',
    h1: 'Studio Display. <em>Brilliant in every way.</em>',
    tagline: 'A do-it-all 27-inch 5K Retina display. 600 nits of sustained brightness, P3 wide color, True Tone. Plus a 12MP Center Stage camera, studio-quality three-mic array, and six-speaker sound with Spatial Audio.',
    price: '$1,599',
    feature_h: 'Brilliant display. Great camera. Great sound.',
    feature_alts: { 4:'Studio Display rear and ports.', 6:'Studio Display screen detail.' },
    config: {
      'Display': ['27-inch 5K Retina'],
      'Glass options': ['Standard glass', 'Nano-texture glass'],
      'Stand options': ['Tilt-adjustable stand', 'Tilt- and height-adjustable stand', 'VESA mount adapter'],
      'Camera': ['12MP Ultra Wide with Center Stage'],
      'Audio': ['Six-speaker sound with force-canceling woofers', 'Studio-quality three-mic array'],
      'Ports': ['Thunderbolt 3 (USB-C) with 96W charging', 'Three USB-C ports'],
    },
    keyFeatures: [
      { h: '5K Retina display', p: '14.7 million pixels at 218 ppi for stunning detail. 600 nits sustained brightness, P3 wide color, True Tone.' },
      { h: 'Center Stage camera', p: 'A 12MP Ultra Wide front camera that automatically keeps you in frame as you move during video calls.' },
      { h: 'Studio-quality mics', p: 'A three-mic array with directional beamforming captures clear voice and works great for music and video recording.' },
      { h: 'Six-speaker sound', p: 'Four force-canceling woofers and two high-performance tweeters fill any room with rich sound — with Spatial Audio.' },
      { h: 'One-cable connection', p: 'A single Thunderbolt cable charges your Mac at 96W and powers the display, camera, audio, and three additional USB-C ports.' },
      { h: 'Built-in Apple silicon', p: 'An A13 Bionic chip powers the camera and audio features, including Center Stage and Spatial Audio.' },
    ],
    footnotes: ['Configurable options are available. Contact GatorTec for current configurations, pricing, and availability.'],
    cardSummary: 'Glass option, stand option, mounts — we\'ll walk you through it.',
  },
  'studio-display-xdr': {
    title: 'Studio Display XDR · GatorTec',
    desc: 'Apple Studio Display XDR. Pro Mini-LED XDR display for the most demanding professional workflows.',
    tag: 'Studio Display XDR',
    h1: 'Studio Display XDR. <em>Built for pros.</em>',
    tagline: 'A pro reference display with Mini-LED XDR backlighting, ProMotion, and reference modes for color-critical workflows. Designed for the highest-end Mac configurations and the most demanding workflows.',
    price: '$3,999',
    feature_h: 'Pro display. Pro workflow.',
    feature_alts: { 4:'Studio Display XDR rear and connection.', 6:'Studio Display XDR detail.' },
    config: {
      'Display': ['27-inch Retina 6K Mini-LED XDR'],
      'Glass options': ['Standard glass', 'Nano-texture glass'],
      'ProMotion': ['Yes (up to 120Hz)'],
      'Reference modes': ['Apple Display P3, Apple XDR, HDR Video, sRGB, BT.601 / 709, BT.2020, DCI-P3', 'Custom user reference modes'],
      'Stand options': ['Pro Stand (sold separately)', 'VESA mount adapter (sold separately)'],
      'Ports': ['Thunderbolt 4', 'Multiple USB-C ports'],
    },
    keyFeatures: [
      { h: 'Mini-LED XDR backlighting', p: 'Thousands of mini-LEDs provide extreme contrast and brightness — true reference-grade HDR.' },
      { h: '6K resolution', p: '20.4 million pixels for incredible detail in pro photo, video, and 3D workflows.' },
      { h: 'ProMotion up to 120Hz', p: 'Fluid scrolling and responsive interaction; benefits creative apps with high frame-rate previews.' },
      { h: 'Reference modes', p: 'Built-in reference modes for color-critical work — and the ability to define custom modes.' },
      { h: 'Nano-texture option', p: 'For studios with significant glare, the nano-texture glass scatters light to maintain image contrast.' },
      { h: 'Pro Stand', p: 'Optional Pro Stand offers counterbalanced tilt, height, and rotation. VESA mount adapter sold separately.' },
    ],
    footnotes: ['Pro Stand and VESA mount adapter sold separately. Configurable options are available. Contact GatorTec for current configurations, pricing, and availability.'],
    cardSummary: 'Glass, stand, mount, reference modes — we\'ll walk you through it.',
  },
};

function buildSimplePDP(slug, p, basePath, depth, breadcrumbCat, breadcrumbCatHref) {
  const configRows = Object.entries(p.config).map(([k,vs])=>`<div class="config-row"><dt>${k}</dt><dd>${vs.map(v=>`<span class="opt">${v}</span>`).join('')}</dd></div>`).join('\n');
  const kf = p.keyFeatures.map(k=>`<li class="kf"><h3>${k.h}</h3><p>${k.p}</p></li>`).join('\n');
  const fn = p.footnotes.map(f=>`<p>${f}</p>`).join('\n');
  const up = '../'.repeat(depth);
  const imgBase = `${up}assets/img/products/${basePath}`;

  return `${headTag(p.title, p.desc, depth)}
${header(depth)}
<main id="main">

<section class="pdp-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="${up}index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<a href="${up}products/index.html">Products</a><span class="sep" aria-hidden="true">›</span>
<a href="${breadcrumbCatHref}">${breadcrumbCat}</a><span class="sep" aria-hidden="true">›</span>
<span class="current">${p.tag}</span>
</nav>
<div class="hero-grid">
<div>
<span class="ptag">${p.tag}</span>
<h1 id="h1">${p.h1}</h1>
<p class="tagline">${p.tagline}</p>
<p class="price">Starting at <strong>${p.price}</strong></p>
</div>
<div class="product-image">
<img src="${imgBase}/${slug}-default.webp${V}" alt="${p.tag}.">
</div>
</div>
</div></section>

<section class="section alt" aria-labelledby="fg-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>At a glance</span><h2 id="fg-h">${p.feature_h}</h2></div>
<div class="feature-gallery">
<div class="fg-tile"><img src="${imgBase}/${slug}-feature-4.webp" alt="${p.feature_alts[4]}"></div>
<div class="fg-tile"><img src="${imgBase}/${slug}-feature-6.webp" alt="${p.feature_alts[6]}"></div>
</div>
</div></section>

<section class="section" aria-labelledby="kf-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>Key features</span><h2 id="kf-h">What makes it special.</h2></div>
<ul class="key-features" role="list">
${kf}
</ul>
</div></section>

<section class="section" aria-labelledby="config-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>Configurations</span><h2 id="config-h">What you can choose.</h2>
<p>The options Apple offers on this product. Tell us how you'll use it and we'll recommend the right one.</p>
</div>
<dl class="config-table">
${configRows}
</dl>
<p class="config-note">Custom configurations and current pricing — contact GatorTec.</p>
</div></section>

<section class="section" aria-labelledby="cta-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>Talk to GatorTec</span><h2 id="cta-h">Ready to order — or have a question?</h2>
<p>${p.cardSummary}</p>
</div>
<div class="dual-cta">
<a class="dcta biz" href="${up}business/contact/index.html"><span class="dlabel">For Business</span><h3>Request a quote</h3>
<p>Volume purchasing and dedicated account contact.</p>
<span class="arrow">Get a B2B quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
<a class="dcta home" href="${up}consumer/contact/index.html"><span class="dlabel">For Home</span><h3>Contact us to order</h3>
<p>One-on-one help from a GatorTec expert.</p>
<span class="arrow">Talk to an expert <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
</div>
</div></section>

<section class="section alt" aria-labelledby="fn-h"><div class="wrap">
<h2 id="fn-h" class="sr-only">Footnotes</h2>
<div class="footnotes">
${fn}
</div>
</div></section>

</main>
${footer(depth)}
</body></html>`;
}

// ============= APPLE TV =============
const APPLE_TV = {
  title: 'Apple TV 4K · GatorTec',
  desc: 'Apple TV 4K. The Apple experience on your TV — Apple Originals, Apple Fitness+, and a thoughtful Home hub.',
  tag: 'Apple TV 4K',
  h1: 'Apple TV 4K. <em>The Apple experience, on your TV.</em>',
  tagline: 'A19-class performance brings cinematic 4K HDR, Dolby Vision, and Dolby Atmos to your living room. The Apple TV app, Apple Fitness+, Arcade, plus a built-in HomeKit hub. Includes the refreshed Siri Remote.',
  price: '$129',
  feature_h: 'Movies, fitness, games, and more.',
  feature_alts: { 4:'Apple TV 4K and Siri Remote.', 6:'Apple TV 4K interface.' },
  config: {
    'Storage': ['64GB (Wi-Fi)', '128GB (Wi-Fi + Ethernet)'],
    'Resolution': ['4K HDR', 'Dolby Vision', 'HDR10+'],
    'Audio': ['Dolby Atmos', 'Dolby Digital Plus 7.1', 'Spatial Audio with AirPods'],
    'Connectivity': ['Wi-Fi 6 (Wi-Fi model)', 'Wi-Fi 6 + Ethernet (Ethernet model)', 'Bluetooth 5.0'],
    'Home hub': ['Yes — HomeKit and Matter'],
    'Included': ['Siri Remote with USB-C charging', 'Apple TV 4K device'],
  },
  keyFeatures: [
    { h: '4K HDR + Dolby Vision', p: 'Stunning picture quality with deep blacks, vivid color, and high contrast on supported TVs.' },
    { h: 'Dolby Atmos sound', p: 'Cinematic, room-filling sound on supported speaker setups — or with AirPods using Spatial Audio.' },
    { h: 'Apple Fitness+ on the big screen', p: 'Studio-style classes — strength, HIIT, yoga, dance, mindfulness — guided by world-class trainers.' },
    { h: 'Apple Arcade', p: 'Access to a curated catalog of games on the biggest screen in your home.' },
    { h: 'Smart home hub', p: 'Apple TV 4K acts as a HomeKit and Matter hub — control lights, locks, and accessories from anywhere.' },
    { h: 'Siri Remote', p: 'Aluminum design, touch-enabled clickpad, dedicated Siri button, and USB-C charging. Find it with iPhone if you misplace it.' },
  ],
  footnotes: [
    'Apple TV+ subscription sold separately. Apple Arcade and Fitness+ available with separate subscriptions. Contact GatorTec for current configurations, pricing, and availability.',
  ],
  cardSummary: 'Storage tier, AppleCare+ — we\'ll walk you through it.',
};

function buildAppleTV() {
  // Single PDP at /products/apple-tv/index.html — no category landing
  // Breadcrumb: Home > Products > Apple TV (use products index as breadcrumb cat)
  const html = buildSimplePDP('apple-tv-4k', APPLE_TV, 'apple-tv/apple-tv-4k', 2, 'Apple TV', 'index.html');
  return html;
}

// ============= ACCESSORIES =============
function buildAccessoriesLanding() {
  // Single-page overview with categories: AirTag, Pencils, Magic Keyboards
  return `${headTag('Accessories — AirTag, Apple Pencil, Magic Keyboard · GatorTec', 'Apple accessories at GatorTec — AirTag, Apple Pencil, Magic Keyboard, cases, cables, and more.', 2)}
${header(2)}
<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="../../index.html">Home</a><span class="sep" aria-hidden="true">›</span><a href="../index.html">Products</a><span class="sep" aria-hidden="true">›</span><span class="current">Accessories</span></nav>
<h1 id="h1">Apple Accessories. <em>The finishing touches.</em></h1>
<p class="lede">From AirTag to Apple Pencil to Magic Keyboard, plus cases, cables, chargers, and adapters — we carry the full range of Apple accessories and select third-party complements.</p>
</div></section>

<section class="section" aria-labelledby="lineup-h"><div class="wrap">
<h2 id="lineup-h" class="sr-only">Featured accessories</h2>
<ul class="product-grid" role="list">

<li><a class="product-card" href="airtag/index.html" aria-labelledby="airtag-h">
<span class="pcimg"><img src="../../assets/img/products/accessories/airtag/airtag.webp${V}" alt="AirTag."></span>
<span class="ptag">AirTag</span>
<h3 id="airtag-h">Lose your knack for losing things.</h3>
<span class="pprice">From $29</span>
<span class="pdesc">A small accessory that helps keep track of your stuff. Attach to keys, slip in a bag, or stick on a bike — find it with the Find My app.</span>
<span class="pcta">Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a></li>

<li class="product-card">
<span class="pcimg" style="background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#777;font-weight:600">Image coming soon</span>
<span class="ptag">Apple Pencil</span>
<h3>Apple Pencil Pro, USB-C, and 2nd gen.</h3>
<span class="pprice">From $79</span>
<span class="pdesc">Three Apple Pencil options for note-taking, sketching, and markup — paired with the right iPad. Ask us which one fits.</span>
<span class="pcta">Contact us for details</span>
</li>

<li class="product-card">
<span class="pcimg" style="background:#f5f5f5;display:flex;align-items:center;justify-content:center;color:#777;font-weight:600">Image coming soon</span>
<span class="ptag">Magic Keyboard</span>
<h3>Type, trackpad, and protect your iPad.</h3>
<span class="pprice">From $179</span>
<span class="pdesc">Magic Keyboard for iPad Pro, iPad Air, and the iPad-compatible Magic Keyboard Folio. A complete portable workstation.</span>
<span class="pcta">Contact us for details</span>
</li>

</ul>

<p style="text-align:center;margin-top:48px;color:var(--ink-3);max-width:760px;margin-left:auto;margin-right:auto">Plus the full range of cases, MagSafe chargers, cables, adapters, and third-party complements (chargers, hubs, stands, and more). <a href="../../contact/index.html">Tell us what you need</a> and we'll source it.</p>
</div></section>

${dualCTA(2)}

</main>
${footer(2)}
</body></html>`;
}

const AIRTAG = {
  title: 'AirTag · GatorTec',
  desc: 'AirTag. A tiny accessory that helps keep track of your stuff with the Find My app.',
  tag: 'AirTag',
  h1: 'AirTag. <em>Find your things in a flash.</em>',
  tagline: 'AirTag is an easy way to keep track of your stuff. Attach it to your keys, slip it in your backpack, stick one in your luggage. Then use the Find My app to track it down, with audible alerts, on-screen guidance, and Precision Finding on supported iPhones.',
  price: '$29',
  feature_h: 'Small. Smart. Privacy-first.',
  feature_alts: { 4:'AirTag attached to a keyring.', 6:'Find My app showing AirTag location.' },
  config: {
    'Pack sizes': ['Single — $29', '4-pack — $99'],
    'Engraving': ['Free custom engraving — emoji, letters, numbers'],
    'Battery': ['User-replaceable CR2032 coin cell (about a year of life)'],
    'Connectivity': ['Bluetooth', 'Ultra Wideband (with U1 chip for Precision Finding)', 'NFC tap'],
    'Resistance': ['IP67 water and dust resistance'],
    'Compatibility': ['Find My app on iPhone, iPad, Mac, or web'],
  },
  keyFeatures: [
    { h: 'Find My network', p: 'Hundreds of millions of Apple devices help you locate AirTag while keeping you anonymous through end-to-end encryption.' },
    { h: 'Precision Finding', p: 'With a U1-equipped iPhone, see exact distance and direction to your AirTag with on-screen guidance.' },
    { h: 'Privacy-first design', p: 'No location data or location history is physically stored inside AirTag. AirTags moving with someone else generate alerts on their iPhone.' },
    { h: 'User-replaceable battery', p: 'A standard CR2032 coin-cell battery lasts about a year. Swap it yourself.' },
    { h: 'Free engraving', p: 'Personalize each AirTag with emoji, letters, or numbers — free with purchase.' },
    { h: 'Splash, water, and dust resistant', p: 'Rated IP67 (maximum depth of 1 meter up to 30 minutes).' },
  ],
  footnotes: [
    'Find My network and Precision Finding require iOS 14.5 or later. Bluetooth range varies. Contact GatorTec for current configurations, pricing, and availability.',
  ],
  cardSummary: 'Pack size, engraving, AppleCare+ for AirTag — we\'ll walk you through it.',
};

function buildAirtagPDP() {
  return buildSimplePDP('airtag', AIRTAG, 'accessories/airtag', 3, 'Accessories', '../index.html');
}

// ============= WRITE =============
const dDir = path.join(ROOT, 'products', 'displays');
fs.mkdirSync(dDir, { recursive: true });
fs.writeFileSync(path.join(dDir, 'index.html'), buildDisplaysCategory());
console.log('wrote displays category');
for (const [slug, pdp] of Object.entries(DISPLAYS)) {
  const d = path.join(dDir, slug);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'index.html'), buildSimplePDP(slug, pdp, `displays/${slug}`, 3, 'Displays', '../index.html'));
  console.log('wrote display PDP:', slug);
}

const tvDir = path.join(ROOT, 'products', 'apple-tv');
fs.mkdirSync(tvDir, { recursive: true });
fs.writeFileSync(path.join(tvDir, 'index.html'), buildAppleTV());
console.log('wrote Apple TV page');

const aDir = path.join(ROOT, 'products', 'accessories');
fs.mkdirSync(aDir, { recursive: true });
fs.writeFileSync(path.join(aDir, 'index.html'), buildAccessoriesLanding());
fs.mkdirSync(path.join(aDir, 'airtag'), { recursive: true });
fs.writeFileSync(path.join(aDir, 'airtag', 'index.html'), buildAirtagPDP());
console.log('wrote Accessories landing + AirTag PDP');

console.log('\nDone.');
