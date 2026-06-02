// Inject Open Graph meta tags + JSON-LD into every page
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const SITE = 'https://gatortec.com';
const DEFAULT_OG_IMAGE = '/assets/img/site/og-default.png'; // 1200x630 — placeholder; should be created
const ORG_LOGO = '/assets/img/site/gatortec-mark.png';

// JSON-LD LocalBusiness schema (only injected on homepage)
const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE + "#localbusiness",
  "name": "GatorTec",
  "alternateName": "GatorTec, LLC",
  "description": "Apple Premier Partner and Authorized Service Provider in Gainesville, FL. Volume Apple purchasing for businesses, expert help for home buyers, and Apple-certified repair service since 2010.",
  "url": SITE,
  "logo": SITE + ORG_LOGO,
  "image": SITE + ORG_LOGO,
  "telephone": "+13525057582",
  "email": "store@gatortec.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "602 S Main St",
    "addressLocality": "Gainesville",
    "addressRegion": "FL",
    "postalCode": "32601",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "29.6516",
    "longitude": "-82.3248"
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" }
  ],
  "sameAs": [],
  "foundingDate": "2010",
  "knowsAbout": ["Apple products", "Mac", "iPad", "Apple Watch", "AirPods", "Apple repair", "AppleCare+", "Apple Business Manager"]
};

// Walk site and inject
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    if (entry.name === 'assets') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.html')) {
      processFile(full);
    }
  }
}

function processFile(file) {
  let html = fs.readFileSync(file, 'utf8');

  // Skip if already has OG tags
  if (html.includes('property="og:title"')) return;

  // Find title and description for OG content
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  // Capture the FULL <meta> tag including the closing > so we don't break it on injection
  const descMatch = html.match(/<meta name="description" content="([^"]+)">/);
  if (!titleMatch) return;

  const title = titleMatch[1];
  const desc = descMatch ? descMatch[1] : 'GatorTec — Apple Premier Partner in Gainesville, FL.';

  // Compute canonical URL from file path
  const relPath = path.relative(ROOT, file).replace(/\\/g, '/');
  let canonicalPath = '/' + relPath;
  if (canonicalPath.endsWith('/index.html')) canonicalPath = canonicalPath.slice(0, -'index.html'.length);
  const canonicalUrl = SITE + canonicalPath;

  const ogBlock = [
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${canonicalUrl}">`,
    `<meta property="og:title" content="${escapeAttr(title)}">`,
    `<meta property="og:description" content="${escapeAttr(desc)}">`,
    `<meta property="og:image" content="${SITE}${DEFAULT_OG_IMAGE}">`,
    `<meta property="og:site_name" content="GatorTec">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(desc)}">`,
    `<meta name="twitter:image" content="${SITE}${DEFAULT_OG_IMAGE}">`,
  ].join('\n');

  // Inject right after <meta name="description"> if present, otherwise before </head>
  if (descMatch) {
    html = html.replace(
      descMatch[0],
      descMatch[0] + '\n' + ogBlock
    );
  } else {
    html = html.replace('</head>', ogBlock + '\n</head>');
  }

  // Inject JSON-LD on homepage only
  if (relPath === 'index.html') {
    const jsonld = `<script type="application/ld+json">\n${JSON.stringify(LOCAL_BUSINESS_SCHEMA, null, 2)}\n</script>`;
    html = html.replace('</head>', jsonld + '\n</head>');
  }

  fs.writeFileSync(file, html);
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

walk(ROOT);
console.log('OG meta + JSON-LD injection done');
