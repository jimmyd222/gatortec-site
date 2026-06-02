#!/usr/bin/env node
// Process Apple Relay PDP/Product images for the site.
// - Reads ZIPs from apple-products-raw/<product>/PDP Images/
// - Picks "Position_2" (primary front view) for each color
// - Reads selected hi-res TIFs/JPGs from Product Images and Family Product Images
// - Outputs WebP at 1200px max width into site/assets/img/products/<category>/<device>/
//
// Usage:
//   node tools/process_images.js <product-folder-name>
// Example:
//   node tools/process_images.js "MacBook Air - M5 chip"

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const RAW = path.join(ROOT, 'apple-products-raw');
const OUT_BASE = path.join(ROOT, 'site', 'assets', 'img', 'products');

const TMP = '/tmp/relay-extract';
fs.mkdirSync(TMP, { recursive: true });

// Map Apple Relay folder name → site category + device slug
const PRODUCT_MAP = {
  'MacBook Air - M5 chip':        { category: 'notebooks',     device: 'macbook-air' },
  'MacBook Pro - M5 chip':        { category: 'notebooks',     device: 'macbook-pro' },
  'MacBook Neo':                  { category: 'notebooks',     device: 'macbook-neo' },
  'iMac - M4 chip':               { category: 'desktops',      device: 'imac' },
  'Mac mini - M4 chip':           { category: 'desktops',      device: 'mac-mini' },
  'Mac Studio - M4 Max and M3 Ultra chips': { category: 'desktops', device: 'mac-studio' },
  'Studio Display':               { category: 'displays',      device: 'studio-display' },
  'Studio Display XDR':           { category: 'displays',      device: 'studio-display-xdr' },
  'iPad - A16 chip':              { category: 'ipads',         device: 'ipad' },
  'iPad Air - M4 chip':           { category: 'ipads',         device: 'ipad-air' },
  'iPad Pro - M5 chip':           { category: 'ipads',         device: 'ipad-pro' },
  'iPad mini (A17 Pro)':          { category: 'ipads',         device: 'ipad-mini' },
  'Apple Watch Series 11 (GPS)':              { category: 'apple-watches', device: 'apple-watch-series-11' },
  'Apple Watch Series 11 (GPS + Cellular)':   { category: 'apple-watches', device: 'apple-watch-series-11-cellular' },
  'Apple Watch SE 3 (GPS)':                   { category: 'apple-watches', device: 'apple-watch-se-3' },
  'Apple Watch SE 3 (GPS + Cellular)':        { category: 'apple-watches', device: 'apple-watch-se-3-cellular' },
  'AirPods 4':                    { category: 'audio',         device: 'airpods-4' },
  'AirPods Pro 3':                { category: 'audio',         device: 'airpods-pro' },
  'AirPods Max 2':                { category: 'audio',         device: 'airpods-max' },
  'HomePod':                      { category: 'audio',         device: 'homepod' },
  'HomePod mini':                 { category: 'audio',         device: 'homepod-mini' },
  'Apple TV 4K':                  { category: 'apple-tv',      device: 'apple-tv-4k' },
  'AirTag':                       { category: 'accessories',   device: 'airtag' },
};

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Parse a PDP zip filename for size + color, e.g.:
// MacBook_Air_13-in_M5_Midnight_PDP_Image.zip → { size: '13', color: 'midnight' }
// MacBook_Pro_14-in_Space_Black_PDP_Image.zip → { size: '14', color: 'space-black' }
function parsePdpZipName(filename) {
  const stem = filename.replace(/_PDP_Image(_ENTERPRISE)?\.zip$/, '');
  // Patterns observed:
  //   MacBook_Air_13-in_M5_Midnight                  → 13 / midnight
  //   MacBook_Air_13-in_M5_Sky_Blue                  → 13 / sky-blue
  //   MacBook_Pro_14-in_M5_Space_Black               → 14 / space-black
  //   iMac_24-in_M4_Blue                             → 24 / blue
  //   Apple_Watch_Series_11_42mm_Aluminum_Silver_Gray → null / aluminum-silver-gray (etc.)
  let size = null, color = null;
  // Try size-in pattern first
  const m1 = stem.match(/_(\d+)-in_(?:[AM]\d+_)?(.+)$/);
  if (m1) {
    size = m1[1];
    color = m1[2];
  } else {
    // No size — just take everything after the product family prefix
    const m2 = stem.match(/_([A-Z][\w_]+)$/);
    if (m2) color = m2[1];
  }
  return { size, color: color ? slugify(color) : null, stem };
}

function findPositionImage(extractDir, position = 2) {
  // Find a *.jpg / *.tif under extractDir whose name ends with `Position_<N>__en-US.<ext>`
  const walk = (dir) => {
    const out = [];
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) out.push(...walk(full));
      else out.push(full);
    }
    return out;
  };
  return walk(extractDir).find(p =>
    !p.includes('__MACOSX') &&
    new RegExp(`Position_${position}__en-US\\.(jpe?g|tif|tiff)$`, 'i').test(p)
  );
}

async function processImage(srcPath, outPath, { width = 1200, quality = 85 } = {}) {
  await sharp(srcPath, { failOn: 'none' })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outPath);
}

// Parse a Pure_Front_Screen TIF filename, e.g.:
// MacBook_Air_13-in_Midnight_Pure_Front_Screen__USEN.tif → { size: '13', color: 'midnight' }
// iMac_24-in_Blue_Pure_Front_Screen__USEN.tif → { size: '24', color: 'blue' }
// Mac_mini_M4_Chip_Silver_Pure_Front_Screen__USEN.tif → { size: null, color: 'silver' }
// MacBook_Neo_Blush_Pure_Front_Screen__USEN.tif → { size: null, color: 'blush' }
function parsePureFrontName(filename, productPrefixes = []) {
  let stem = filename.replace(/_Pure_Front_Screen__USEN\.tiff?$/i, '');
  // Strip any product-family prefix (e.g. "MacBook_Neo_") so the color isn't dirtied
  for (const prefix of productPrefixes) {
    const re = new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '_?', 'i');
    stem = stem.replace(re, '');
  }
  // Try: <size>-in_<color>
  let m = stem.match(/(\d+)-in_(.+)$/);
  if (m) return { size: m[1], color: slugify(m[2]) };
  // Strip chip designator like "M4_Chip_" if it leads the remainder
  stem = stem.replace(/^[AM]\d+_Chip_/i, '');
  // Whatever's left is the color
  if (stem) return { size: null, color: slugify(stem) };
  return { size: null, color: null };
}

async function processProduct(productFolder) {
  const meta = PRODUCT_MAP[productFolder];
  if (!meta) {
    console.error(`✗ Unknown product folder: ${productFolder}`);
    console.error(`  Add it to PRODUCT_MAP in this script.`);
    process.exit(1);
  }
  const srcDir = path.join(RAW, productFolder);
  if (!fs.existsSync(srcDir)) {
    console.error(`✗ Folder not found: ${srcDir}`);
    process.exit(1);
  }
  const outDir = path.join(OUT_BASE, meta.category, meta.device);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\nProcessing: ${productFolder}`);
  console.log(`  → ${path.relative(ROOT, outDir)}`);

  const written = [];

  // 1. Single-device "Pure_Front_Screen" TIFs — canonical Apple hero shot.
  // Search both "Product Images" and "Product Images - Screen" (Apple uses both folder names).
  const imageDirs = ['Product Images - Screen', 'Product Images']
    .map(d => path.join(srcDir, d))
    .filter(d => fs.existsSync(d));
  let usedPureFront = false;
  for (const dir of imageDirs) {
    const candidates = fs.readdirSync(dir)
      .filter(f => /Pure_Front_Screen__USEN\.tiff?$/i.test(f))
      .filter(f => !/_2-?Up_|_2-up_/i.test(f))
      .filter(f => !/Pure_Back/i.test(f))
      .filter(f => !/Business|Education/i.test(f));
    // Build product-family prefixes from the folder name so they can be stripped.
    const productPrefixes = [
      productFolder.replace(/\s*-\s*[A-Z]\d+\s*chip.*$/i, '').replace(/\s+/g, '_'),
      productFolder.replace(/\s+/g, '_'),
    ];
    for (const tif of candidates) {
      const { size, color } = parsePureFrontName(tif, productPrefixes);
      if (!color) { console.log(`  ⚠ skipping ${tif} (could not parse)`); continue; }
      const sizeSlug = size ? `${size}-` : '';
      const outName = `${meta.device}-${sizeSlug}${color}.webp`;
      const outPath = path.join(outDir, outName);
      if (fs.existsSync(outPath)) continue; // already written from preferred folder
      await processImage(path.join(dir, tif), outPath);
      written.push({ src: tif, out: outName, size: fs.statSync(outPath).size });
      usedPureFront = true;
    }
    if (usedPureFront) break; // first folder that produced shots wins
  }

  // 2. Fallback: PDP Images Position_2 (only if Product Images didn't produce shots)
  if (!usedPureFront) {
    const pdpDir = path.join(srcDir, 'PDP Images');
    if (fs.existsSync(pdpDir)) {
      const zips = fs.readdirSync(pdpDir)
        .filter(f => f.endsWith('.zip') && !f.includes('ENTERPRISE'));
      for (const zip of zips) {
        const { size, color, stem } = parsePdpZipName(zip);
        if (!color) { console.log(`  ⚠ skipping ${zip} (could not parse)`); continue; }
        const extractTo = path.join(TMP, slugify(stem));
        fs.rmSync(extractTo, { recursive: true, force: true });
        execSync(`unzip -q -o "${path.join(pdpDir, zip)}" -d "${extractTo}"`);
        const img = findPositionImage(extractTo, 2);
        if (!img) { console.log(`  ⚠ no Position_2 in ${zip}`); continue; }
        const sizeSlug = size ? `${size}-` : '';
        const outName = `${meta.device}-${sizeSlug}${color}.webp`;
        const outPath = path.join(outDir, outName);
        await processImage(img, outPath);
        written.push({ src: path.basename(img), out: outName, size: fs.statSync(outPath).size });
      }
    }
  }

  // 2. Family Product Image (lineup shot) — pick first .tif
  const famDir = path.join(srcDir, 'Family Product Images - Screen');
  if (fs.existsSync(famDir)) {
    const tifs = fs.readdirSync(famDir).filter(f => /\.tiff?$/i.test(f));
    if (tifs.length) {
      // Prefer "Family" or "Lineup" in the name
      const preferred = tifs.find(f => /family|lineup|3-up/i.test(f)) || tifs[0];
      const outPath = path.join(outDir, `${meta.device}-family.webp`);
      await processImage(path.join(famDir, preferred), outPath, { width: 1600 });
      written.push({ src: preferred, out: `${meta.device}-family.webp`, size: fs.statSync(outPath).size });
    }
  }

  // Summary
  console.log(`  Wrote ${written.length} image(s):`);
  for (const w of written) {
    const kb = (w.size / 1024).toFixed(0);
    console.log(`    ${w.out}  (${kb} KB)  ← ${w.src}`);
  }
  return written;
}

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.log('Usage: node tools/process_images.js "<Apple Relay folder name>"');
    console.log('Known products:');
    for (const k of Object.keys(PRODUCT_MAP)) console.log('  - ' + k);
    process.exit(0);
  }
  await processProduct(arg);
  console.log('\nDone.');
})();
