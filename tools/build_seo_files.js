// Generate sitemap.xml, robots.txt, _redirects, _headers, and 404.html
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'site');
const SITE = 'https://gatortec.com';
const TODAY = new Date().toISOString().slice(0, 10);

// ============ SITEMAP ============
// Walk the site/ dir, collect every index.html or .html (excluding /staff-only assets)
function collectPages() {
  const pages = [];
  function walk(dir, urlPrefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
      if (entry.name === 'assets') continue;
      const full = path.join(dir, entry.name);
      const url = urlPrefix + entry.name;
      if (entry.isDirectory()) {
        walk(full, url + '/');
      } else if (entry.name === 'index.html') {
        pages.push(urlPrefix.replace(/\/$/, '') + '/');
      } else if (entry.name.endsWith('.html')) {
        pages.push(url);
      }
    }
  }
  walk(ROOT, '/');
  return pages;
}

const allPages = collectPages();

// Exclude staff/internal pages from public sitemap
const EXCLUDE_FROM_SITEMAP = [
  '/business/apple-parts-list/',  // staff-only lookup
];

const sitemapPages = allPages.filter(p => !EXCLUDE_FROM_SITEMAP.some(ex => p.startsWith(ex)));

// Priority + change frequency hints
function priorityFor(url) {
  if (url === '/') return { priority: '1.0', changefreq: 'weekly' };
  if (url === '/business/' || url === '/consumer/' || url === '/products/' || url === '/service/' || url === '/contact/') {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (url.startsWith('/products/')) return { priority: '0.8', changefreq: 'monthly' };
  if (url.startsWith('/business/resources/')) return { priority: '0.6', changefreq: 'monthly' };
  if (url.startsWith('/legal/')) return { priority: '0.3', changefreq: 'yearly' };
  return { priority: '0.5', changefreq: 'monthly' };
}

const sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemapPages.sort().map(p => {
    const { priority, changefreq } = priorityFor(p);
    return '  <url>\n' +
      '    <loc>' + SITE + p + '</loc>\n' +
      '    <lastmod>' + TODAY + '</lastmod>\n' +
      '    <changefreq>' + changefreq + '</changefreq>\n' +
      '    <priority>' + priority + '</priority>\n' +
      '  </url>';
  }).join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml);
console.log('wrote sitemap.xml (' + sitemapPages.length + ' URLs)');

// ============ ROBOTS.TXT ============
const robots = `User-agent: *
Allow: /

# Staff-only — do not index
Disallow: /business/apple-parts-list/

Sitemap: ${SITE}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots);
console.log('wrote robots.txt');

// ============ _REDIRECTS (Cloudflare Pages / Netlify style) ============
// Map old WordPress URLs to new locations
const redirects = `# WordPress page slugs → new locations
/accessibility-statement       /legal/accessibility.html      301
/apple-parts-list              /business/apple-parts-list/    301
/business                      /business/                     301
/consumer                      /consumer/                     301
/contact                       /contact/                      301
/faq                           /business/faq/                 301
/products                      /products/                     301
/service                       /service/                      301
/terms-conditions              /legal/terms.html              301

# Product slug shortcuts
/imac                          /products/desktops/imac/                  301
/mac-mini                      /products/desktops/mac-mini/              301
/mac-studio                    /products/desktops/mac-studio/            301
/macbook-air                   /products/notebooks/macbook-air/          301
/macbook-pro                   /products/notebooks/macbook-pro/          301
/ipad                          /products/ipads/                          301

# WordPress query-string permalinks (?page_id=N) — Cloudflare Pages supports query-string matching
/* page_id=200       /service/                                301
/* page_id=228       /contact/                                301
/* page_id=306       /business/                               301
/* page_id=427       /consumer/                               301
/* page_id=759       /business/contact/                       301
/* page_id=136       /products/                               301
/* page_id=1059      /contact/                                301
/* page_id=1071      /business/faq/                           301
/* page_id=1078      /legal/terms.html                        301
/* page_id=1092      /business/apple-parts-list/              301
/* page_id=1098      /products/notebooks/macbook-air/         301
/* page_id=1099      /products/notebooks/macbook-pro/         301
/* page_id=1100      /products/desktops/imac/                 301
/* page_id=1102      /products/desktops/mac-mini/             301
/* page_id=1103      /products/desktops/mac-studio/           301
/* page_id=1118      /products/ipads/                         301
/* page_id=1235      /products/                               301
/* page_id=1253      /service/                                301
/* page_id=1334      /business/faq/                           301
/* page_id=1336      /legal/terms.html                        301
/* page_id=1674      /legal/accessibility.html                301

# Old WordPress feed URLs (occasionally crawled)
/feed                /sitemap.xml                             301
/feed/*              /sitemap.xml                             301
/wp-content/*        /                                        410
/wp-admin/*          /                                        410
/wp-login.php        /                                        410

# Catch-all (must be last) — Cloudflare Pages handles 404 automatically
`;
fs.writeFileSync(path.join(ROOT, '_redirects'), redirects);
console.log('wrote _redirects');

// ============ _HEADERS (security + cache) ============
const headers = `# Default security headers for all pages
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

# Aggressive cache for static assets (images, fonts, CSS, JS)
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Moderate cache for JSON data (updated daily by n8n)
/assets/data/*
  Cache-Control: public, max-age=3600

# No cache for HTML — always fetch latest
/*.html
  Cache-Control: public, max-age=0, must-revalidate
`;
fs.writeFileSync(path.join(ROOT, '_headers'), headers);
console.log('wrote _headers');

// ============ 404 PAGE ============
const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found · GatorTec</title>
<meta name="description" content="Sorry — we can't find that page. Try the homepage or our products.">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/site/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/img/site/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/img/site/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/base.css">
</head><body>

<a class="skip-link" href="#main">Skip to main content</a>

<header class="top"><div class="wrap">
<a class="brand" href="/index.html" aria-label="GatorTec home"><img src="/assets/img/site/gatortec-mark.png" alt="" aria-hidden="true"><span>GatorTec</span></a>
<nav class="main" aria-label="Primary">
<a href="/products/index.html">Products</a>
<a href="/business/index.html">For Business</a>
<a href="/consumer/index.html">For Home</a>
<a href="/service/index.html">Service</a>
<a class="pill" href="/contact/index.html">Contact</a>
</nav></div></header>

<main id="main">

<section class="cat-hero" aria-labelledby="h1"><div class="wrap" style="max-width:720px;text-align:center">
<div style="font-family:var(--display);font-weight:800;font-size:96px;color:var(--blue);line-height:1;margin-bottom:14px;letter-spacing:-.04em">404</div>
<h1 id="h1">Page not found.</h1>
<p class="lede">Sorry — we can't find what you're looking for. Maybe one of these helps:</p>
<div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:32px">
<a class="btn-primary" style="background:var(--blue);color:#fff" href="/index.html">Go home
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>
<a class="btn-ghost" style="color:var(--blue);border-color:var(--blue)" href="/products/index.html">Browse products</a>
<a class="btn-ghost" style="color:var(--blue);border-color:var(--blue)" href="/contact/index.html">Contact us</a>
</div>
</div></section>

</main>

<footer class="site"><div class="wrap">
<div class="legal" style="justify-content:center;text-align:center">
<span>© 2010–2026 GatorTec, LLC. All rights reserved.</span>
</div>
</div></footer>

<script src="/assets/js/nav.js" defer></script>
</body></html>
`;
fs.writeFileSync(path.join(ROOT, '404.html'), notFoundHtml);
console.log('wrote 404.html');

console.log('\nAll pre-launch infra files generated.');
