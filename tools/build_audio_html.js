// Generate Audio category landing + 5 PDPs
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

const DOTS = { white:'#f0f0f0', midnight:'#1f2937', blue:'#6790a8', purple:'#9b8fbf', orange:'#e87d3a', starlight:'#f7e9d2', yellow:'#e9d878' };
const LABEL = { white:'White', midnight:'Midnight', blue:'Blue', purple:'Purple', orange:'Orange', starlight:'Starlight', yellow:'Yellow' };

const CAT = {
  title: 'Audio — AirPods, AirPods Max, HomePod · GatorTec',
  desc: 'Explore Apple Audio at GatorTec: AirPods Pro 3, AirPods 4, AirPods Max 2, HomePod, and HomePod mini.',
  h1: 'Apple Audio. <em>Sound that surrounds you.</em>',
  lede: 'AirPods in your ears, HomePod in your room — Apple\'s audio lineup is built for everyday listening, focused work, family calls, and immersive at-home sound. Tell us how you\'ll use it.',
  products: [
    { slug:'airpods-pro-3', tag:'AirPods Pro 3', h:'The new standard for active noise cancellation.', price:'$249', desc:'World-class ANC · Heart rate sensing · Live Translation · Up to 8 hr listening on a charge. The flagship in-ear experience.' },
    { slug:'airpods-4', tag:'AirPods 4', h:'Comfort, sound, and Active Noise Cancellation.', price:'From $129', desc:'Two models — AirPods 4 and AirPods 4 with ANC. Personalized Spatial Audio. Sweat- and water-resistant. Up to 30 hr total with case.' },
    { slug:'airpods-max-2', tag:'AirPods Max 2', h:'High-fidelity. Five colors.', price:'$549', desc:'Custom acoustic design · Adaptive EQ · USB-C · Lossless audio with Lightning-fast charging. Premium over-ear experience.' },
    { slug:'homepod', tag:'HomePod', h:'Room-filling. Spatial Audio.', price:'$299', desc:'High-excursion woofer · Beamforming tweeter array · Spatial Audio · Stereo pair-capable. Brilliant sound for your space.' },
    { slug:'homepod-mini', tag:'HomePod mini', h:'Big sound. Small footprint. Five colors.', price:'$99', desc:'360-degree audio · Built-in Siri · Smart home hub for HomeKit. Perfect for a desk, a nightstand, or anywhere.' },
  ],
};

function buildCategory(){
  const cards = CAT.products.map(p=>`<li><a class="product-card" href="${p.slug}/index.html" aria-labelledby="${p.slug}-h">
<span class="pcimg"><img src="../../assets/img/products/audio/${p.slug}/${p.slug}.webp${V}" alt="${p.tag}."></span>
<span class="ptag">${p.tag}</span>
<h3 id="${p.slug}-h">${p.h}</h3>
<span class="pprice">${p.price}</span>
<span class="pdesc">${p.desc}</span>
<span class="pcta">Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a></li>`).join('\n\n');

  return `${headTag(CAT.title, CAT.desc, 2)}
${header(2)}
<main id="main">
<section class="cat-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="../../index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<a href="../index.html">Products</a><span class="sep" aria-hidden="true">›</span>
<span class="current">Audio</span>
</nav>
<h1 id="h1">${CAT.h1}</h1>
<p class="lede">${CAT.lede}</p>
</div></section>

<section class="section" aria-labelledby="lineup-h"><div class="wrap">
<h2 id="lineup-h" class="sr-only">The Apple Audio lineup</h2>
<ul class="product-grid" role="list">
${cards}
</ul>
</div></section>

<section class="section alt" aria-labelledby="help-h"><div class="wrap">
<div class="shead">
<span class="eyebrow"><span class="dot" aria-hidden="true"></span>Need a recommendation?</span>
<h2 id="help-h">We can help you decide.</h2>
<p>Tell us where and how you'll listen — commute, office, gym, home theater — and we'll match the right AirPods or HomePod to it.</p>
</div>
<div class="dual-cta">
<a class="dcta biz" href="../../business/contact/index.html"><span class="dlabel">For Business</span><h3>Request a quote</h3>
<p>AirPods for distributed teams, HomePod for conference rooms, volume orders with PO.</p>
<span class="arrow">Get a B2B quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
<a class="dcta home" href="../../consumer/contact/index.html"><span class="dlabel">For Home</span><h3>Contact us to order</h3>
<p>One-on-one help from a GatorTec expert.</p>
<span class="arrow">Talk to an expert <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
</div>
</div></section>
</main>
${footer(2)}
</body></html>`;
}

const PDPS = {
  'airpods-pro-3': {
    title:'AirPods Pro 3 · GatorTec',
    desc:'AirPods Pro 3. World-class Active Noise Cancellation, heart rate sensing, Live Translation, all-day battery.',
    tag:'AirPods Pro 3',
    h1:'AirPods Pro 3. <em>The new standard.</em>',
    tagline:'A breakthrough in active noise cancellation. The new Adaptive Audio responds to your surroundings. Heart rate sensing during workouts. Live Translation with iPhone. Up to 8 hours of listening with ANC on.',
    price:'$249',
    defaultColor:'white',
    colors:['white'],
    feature_h:'Pro features. Pro fit.',
    feature_alts:{4:'AirPods Pro 3 detail view.',6:'AirPods Pro 3 case.'},
    config:{
      'Earbuds':['Five sizes of soft, ultralow-density foam-infused silicone tips (XXS to L)'],
      'Active Noise Cancellation':['Up to 2× the ANC of AirPods Pro 2'],
      'Listening modes':['Active Noise Cancellation','Transparency','Adaptive Audio'],
      'Conversation Awareness':['Yes'],
      'Heart rate sensing':['Yes — pair with Apple Fitness or supported workout apps'],
      'Live Translation':['Translate spoken languages with iPhone'],
      'Charging':['USB-C MagSafe Charging Case','Qi wireless','Apple Watch chargers'],
      'Battery (ANC on)':['Up to 8 hours listening per charge','Up to 30 hours total with case'],
      'Resistance':['IP57 (earbuds and case) — dust, sweat, water resistant'],
    },
    keyFeatures:[
      {h:'Up to 2× the ANC',p:'A new H-series chip plus reengineered transducers and acoustic vents — Apple\'s most powerful noise cancellation ever.'},
      {h:'Adaptive Audio',p:'Dynamically blends Active Noise Cancellation and Transparency mode to match your environment.'},
      {h:'Heart rate sensing',p:'A photoplethysmography sensor measures heart rate during workouts — pair with Apple Fitness or supported apps.'},
      {h:'Live Translation<sup>1</sup>',p:'Get spoken-language translation through AirPods Pro 3 with a paired iPhone — natural and hands-free.'},
      {h:'Personalized Spatial Audio',p:'Dynamic head tracking and personalized HRTF make movies and music feel like they\'re happening around you.'},
      {h:'IP57 dust, sweat, and water resistance',p:'Workouts, rain, dust — AirPods Pro 3 keep going. The case is rated IP57 too.'},
    ],
    footnotes:[
      '<sup>1</sup> Live Translation requires a paired iPhone with Apple Intelligence and supported languages. See <a href="https://support.apple.com/121115">support.apple.com/121115</a>.',
      'AppleCare+ available. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary:'AppleCare+, accessories, ear tip sizing — we\'ll walk you through it.',
  },
  'airpods-4': {
    title:'AirPods 4 · GatorTec',
    desc:'AirPods 4 and AirPods 4 with Active Noise Cancellation. Personalized Spatial Audio, redesigned for comfort, USB-C.',
    tag:'AirPods 4',
    h1:'AirPods 4. <em>Iconic. Reimagined.</em>',
    tagline:'A new acoustic architecture, a redesigned shape, and Personalized Spatial Audio — for a more immersive, more comfortable AirPods. Choose the standard model or add Active Noise Cancellation.',
    price:'From $129',
    defaultColor:'white',
    colors:['white'],
    feature_h:'Two AirPods. One iconic shape.',
    feature_alts:{4:'AirPods 4 detail.',6:'AirPods 4 case.'},
    config:{
      'Model':['AirPods 4 — $129','AirPods 4 with Active Noise Cancellation — $179'],
      'Earbud fit':['Universal — open-ear (no silicone tips)'],
      'Personalized Spatial Audio':['Yes (both models)'],
      'Active Noise Cancellation':['Only on AirPods 4 with ANC'],
      'Transparency mode':['Only on AirPods 4 with ANC'],
      'Conversation Awareness':['Only on AirPods 4 with ANC'],
      'Charging':['USB-C case','Qi wireless (ANC model)','Apple Watch chargers (ANC model)'],
      'Battery':['Up to 5 hr listening per charge','Up to 30 hr total with case'],
      'Resistance':['IP54 (dust, sweat, water resistant)'],
    },
    keyFeatures:[
      {h:'Redesigned for comfort',p:'A new contour shaped using millions of head and ear scans for a more secure, more comfortable fit.'},
      {h:'Personalized Spatial Audio',p:'Use iPhone\'s TrueDepth camera to create a profile that adapts sound for your ears — built-in on both models.'},
      {h:'Active Noise Cancellation option',p:'Step up to AirPods 4 with ANC for class-leading noise cancellation in an open-ear design — plus Transparency mode and Conversation Awareness.'},
      {h:'Voice Isolation',p:'A new ML algorithm separates your voice from background noise during calls — clearer audio for you and the person on the other end.'},
      {h:'USB-C charging case',p:'Smaller, lighter, and now charges over USB-C. ANC model adds wireless charging via Qi and Apple Watch chargers.'},
      {h:'IP54 rated',p:'Dust, sweat, and water resistant. Designed to handle workouts, walks, and weather.'},
    ],
    footnotes:[
      'AppleCare+ available. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary:'Which model, accessories, AppleCare+ — we\'ll walk you through it.',
  },
  'airpods-max-2': {
    title:'AirPods Max 2 · GatorTec',
    desc:'AirPods Max 2. High-fidelity over-ear sound, USB-C, five new colors. Talk to a GatorTec expert.',
    tag:'AirPods Max 2',
    h1:'AirPods Max. <em>High fidelity. Five new colors.</em>',
    tagline:'A custom acoustic design, Adaptive EQ, and personalized Spatial Audio — for a deeply immersive sound. Now in five fresh colors, with USB-C and Lossless audio support.',
    price:'$549',
    defaultColor:'midnight',
    colors:['midnight','blue','purple','orange','starlight'],
    feature_h:'Premium sound. Premium comfort.',
    feature_alts:{4:'AirPods Max 2 ear cushion detail.',6:'AirPods Max 2 Digital Crown detail.'},
    config:{
      'Driver':['40mm dynamic driver with dual neodymium magnet motor'],
      'Active Noise Cancellation':['Yes — Apple H1 chip in each ear cup'],
      'Transparency mode':['Yes'],
      'Adaptive EQ':['Yes — adjusts in real time to the fit and seal of the ear cushions'],
      'Personalized Spatial Audio':['Yes — with dynamic head tracking'],
      'Charging':['USB-C'],
      'Lossless audio':['Yes — over USB-C cable'],
      'Battery':['Up to 20 hours with ANC, Transparency, or Spatial Audio on'],
      'Colors':['Midnight','Blue','Purple','Orange','Starlight'],
    },
    keyFeatures:[
      {h:'Custom acoustic design',p:'Each ear cup houses a 40mm dynamic driver tuned for the broadest possible frequency response — from deep bass to crisp high notes.'},
      {h:'Adaptive EQ',p:'Real-time tuning adjusts the sound to fit and seal of the ear cushions — and to what you\'re listening to.'},
      {h:'USB-C charging',p:'A new USB-C port — same cable as your iPhone and Mac. Includes a high-quality USB-C cable for Lossless audio playback.'},
      {h:'Personalized Spatial Audio with dynamic head tracking',p:'Pinpoint accurate sound that follows your head — for movies, music, and FaceTime.'},
      {h:'Memory foam ear cushions',p:'Knit-mesh canopy distributes weight to reduce on-head pressure. Memory foam cushions create an effective acoustic seal.'},
      {h:'Smart Case',p:'Preserves battery with an ultralow power state when not in use.'},
    ],
    footnotes:[
      'Lossless audio over USB-C requires compatible source. AppleCare+ available. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary:'Color, accessories, AppleCare+ — we\'ll walk you through it.',
  },
  'homepod': {
    title:'HomePod · GatorTec',
    desc:'HomePod. Room-filling sound, Spatial Audio, stereo-pair capable. Available in White and Midnight.',
    tag:'HomePod',
    h1:'HomePod. <em>Room-filling sound.</em>',
    tagline:'A high-excursion woofer and a beamforming array of horn-loaded tweeters fill any room with deep, distortion-free sound. Spatial Audio support, stereo pair capability, and a built-in Siri smart hub for your home.',
    price:'$299',
    defaultColor:'white',
    colors:['white','midnight'],
    feature_h:'Sound that fills the room.',
    feature_alts:{4:'HomePod detail view.',5:'HomePod top surface and Siri activation.'},
    config:{
      'Speakers':['High-excursion woofer','Five-tweeter beamforming array'],
      'Microphones':['Four-microphone array for far-field Siri'],
      'Spatial Audio':['Yes'],
      'Stereo pair':['Yes (two HomePods of the same model)'],
      'Home hub':['Yes — works as a smart home hub for HomeKit and Matter'],
      'Sensors':['Built-in temperature and humidity sensor'],
      'Colors':['White','Midnight'],
    },
    keyFeatures:[
      {h:'Room-sensing technology',p:'HomePod analyzes the acoustics of its location and tunes the sound automatically.'},
      {h:'Spatial Audio',p:'Dolby Atmos and Spatial Audio tracks come alive with immersive, multi-dimensional sound.'},
      {h:'Stereo pair',p:'Pair two HomePods of the same model for an even more expansive soundstage.'},
      {h:'Smart home hub',p:'Built-in support for HomeKit and Matter — control lights, locks, thermostats, cameras, and more.'},
      {h:'Hands-free Siri',p:'Far-field microphones hear you across the room. Music, timers, smart home, news — all hands-free.'},
      {h:'Temperature and humidity sensor',p:'Trigger automations based on the conditions in your room — without extra hardware.'},
    ],
    footnotes:[
      'Apple Music subscription required for certain features. Siri may not be available in all languages or regions, and features may vary by area. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary:'Single or stereo pair, color, mounting accessories — we\'ll walk you through it.',
  },
  'homepod-mini': {
    title:'HomePod mini · GatorTec',
    desc:'HomePod mini. Surprising sound from a small footprint. Five colors. Built-in Siri.',
    tag:'HomePod mini',
    h1:'HomePod mini. <em>Big sound. Five colors.</em>',
    tagline:'A computational audio engine packs surprisingly rich, 360-degree sound into a 3.3-inch sphere. Multiple HomePod mini speakers throughout your home let you play the same music everywhere — or different music in each room.',
    price:'$99',
    defaultColor:'blue',
    colors:['blue','midnight','orange','white','yellow'],
    feature_h:'Mini in size. Huge in sound.',
    feature_alts:{4:'HomePod mini detail view.',6:'HomePod mini in five colors.'},
    config:{
      'Form factor':['3.3-inch sphere'],
      'Drivers':['Full-range driver','Dual passive radiators'],
      'Computational audio':['Real-time tuning by the Apple S5 chip'],
      'Microphones':['Four-microphone design'],
      'Home hub':['Yes — works as a smart home hub for HomeKit and Matter'],
      'Sensors':['Built-in temperature and humidity sensor'],
      'Colors':['Blue','Midnight','Orange','White','Yellow'],
    },
    keyFeatures:[
      {h:'360-degree audio',p:'Acoustic waveguide directs sound down and out, filling the room in every direction.'},
      {h:'Computational audio',p:'The Apple S5 chip applies complex tuning models in real time — analyzing every note 180 times per second.'},
      {h:'Intercom',p:'Send a voice message to another HomePod, iPhone, iPad, or Apple Watch anywhere in your home.'},
      {h:'Smart home hub',p:'Built-in support for HomeKit and Matter — control your accessories from anywhere.'},
      {h:'Hands-free Siri',p:'Music, timers, calls, the news, smart home control — all by voice.'},
      {h:'Temperature and humidity sensing',p:'Trigger automations based on the conditions in your room.'},
    ],
    footnotes:[
      'Apple Music subscription required for certain features. Siri may not be available in all languages or regions. Contact GatorTec for current configurations, pricing, and availability.',
    ],
    cardSummary:'Color, multi-room setup, smart-home pairing — we\'ll walk you through it.',
  },
};

function buildPDP(slug, p){
  const swatches = p.colors.map(c=>`<button type="button" class="swatch" aria-pressed="${c===p.defaultColor?'true':'false'}"
data-image="../../../assets/img/products/audio/${slug}/${slug}-${c}.webp"
data-alt="${p.tag} in ${LABEL[c]}.">
<span class="swatch-dot" style="background:${DOTS[c]}" aria-hidden="true"></span>${LABEL[c]}
</button>`).join('\n');

  const configRows = Object.entries(p.config).map(([k,vs])=>`<div class="config-row"><dt>${k}</dt><dd>${vs.map(v=>`<span class="opt">${v}</span>`).join('')}</dd></div>`).join('\n');

  const kf = p.keyFeatures.map(k=>`<li class="kf"><h3>${k.h}</h3><p>${k.p}</p></li>`).join('\n');
  const fn = p.footnotes.map(f=>`<p>${f}</p>`).join('\n');

  // HomePod uses feature-5 instead of feature-6 (no Position 6)
  const featB = (slug === 'homepod') ? 5 : 6;

  return `${headTag(p.title, p.desc, 3)}
${header(3)}
<main id="main">

<section class="pdp-hero" aria-labelledby="h1"><div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb">
<a href="../../../index.html">Home</a><span class="sep" aria-hidden="true">›</span>
<a href="../../index.html">Products</a><span class="sep" aria-hidden="true">›</span>
<a href="../index.html">Audio</a><span class="sep" aria-hidden="true">›</span>
<span class="current">${p.tag}</span>
</nav>
<div class="hero-grid">
<div>
<span class="ptag">${p.tag}</span>
<h1 id="h1">${p.h1}</h1>
<p class="tagline">${p.tagline}</p>
<p class="price">Starting at <strong>${p.price}</strong></p>
${p.colors.length > 1 ? `<div class="swatches" role="group" aria-label="Choose a color">\n${swatches}\n</div>` : ''}
</div>
<div class="product-image">
<img src="../../../assets/img/products/audio/${slug}/${slug}-${p.defaultColor}.webp${V}" alt="${p.tag} in ${LABEL[p.defaultColor]}.">
</div>
</div>
</div></section>

<section class="section alt" aria-labelledby="fg-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>At a glance</span><h2 id="fg-h">${p.feature_h}</h2></div>
<div class="feature-gallery">
<div class="fg-tile"><img src="../../../assets/img/products/audio/${slug}/${slug}-feature-4.webp" alt="${p.feature_alts[4]}"></div>
<div class="fg-tile"><img src="../../../assets/img/products/audio/${slug}/${slug}-feature-${featB}.webp" alt="${p.feature_alts[featB]}"></div>
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

<section class="section alt" aria-labelledby="ac-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>Add-on coverage</span><h2 id="ac-h">Cover it with AppleCare+.</h2></div>
<div class="acn">
<span class="acn-logo"><img src="../../../assets/img/site/applecare-plus-logo.svg" alt="AppleCare+"></span>
<div><h3>AppleCare+ for Headphones / Audio</h3><p>Easy, fast repairs for accidents — plus 24/7 priority care from Apple experts.</p></div>
</div>
</div></section>

<section class="section" aria-labelledby="cta-h"><div class="wrap">
<div class="shead"><span class="eyebrow"><span class="dot" aria-hidden="true"></span>Talk to GatorTec</span><h2 id="cta-h">Ready to order — or have a question?</h2>
<p>${p.cardSummary}</p>
</div>
<div class="dual-cta">
<a class="dcta biz" href="../../../business/contact/index.html"><span class="dlabel">For Business</span><h3>Request a quote</h3>
<p>Volume orders for teams and conference rooms.</p>
<span class="arrow">Get a B2B quote <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
<a class="dcta home" href="../../../consumer/contact/index.html"><span class="dlabel">For Home</span><h3>Contact us to order</h3>
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
${footer(3)}
${p.colors.length > 1 ? '<script src="../../../assets/js/pdp.js" defer></script>' : ''}
</body></html>`;
}

const dir = path.join(ROOT, 'products', 'audio');
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
