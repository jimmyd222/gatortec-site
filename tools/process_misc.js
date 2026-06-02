// Process Displays + Apple TV + AirTag PDP assets
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const RAW = path.join(__dirname, '..', 'apple-products-raw');
const OUT = path.join(__dirname, '..', 'site', 'assets', 'img', 'products');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const ITEMS = [
  { dest: 'displays/studio-display',     dir: `${RAW}/Studio Display/PDP Images`,     prefix: 'Studio_Display_PDP_Image_Position_',     suffix: '__en-US.jpg' },
  { dest: 'displays/studio-display-xdr', dir: `${RAW}/Studio Display XDR/PDP Images`, prefix: 'Studio_Display_XDR_PDP_Image_Position_', suffix: '__en-US.jpg' },
  { dest: 'apple-tv/apple-tv-4k',        dir: `${RAW}/Apple TV 4K/PDP Images`,        prefix: 'AppleTV_4k_3rd_Generation_PDP_Image_Position-', suffix: '__en-US.jpg' },
  { dest: 'accessories/airtag',          dir: `${RAW}/AirTag/PDP Images`,             prefix: 'AirTag_PDP_Image_Position_',             suffix: '__en-US.jpg' },
];

async function processHero(src, dst, cardMode = false) {
  const trimmed = await sharp(src).flatten({ background: WHITE }).trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const TW = 1600, TH = cardMode ? 1448 : 1200;
  const widthPct = cardMode ? 0.60 : 0.75;
  const heightPct = cardMode ? 0.75 : 0.85;
  const scale = Math.min((TW * widthPct) / meta.width, (TH * heightPct) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const resized = await sharp(trimmed).resize(w, h, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: TW, height: TH, channels: 3, background: WHITE } })
    .composite([{ input: resized, gravity: cardMode ? 'south' : 'center' }])
    .webp({ quality: 90 })
    .toFile(dst);
}

async function processFeature(src, dst) {
  await sharp(src).resize(1000, 1000, { fit: 'inside', background: WHITE }).flatten({ background: WHITE }).webp({ quality: 85 }).toFile(dst);
}

(async () => {
  for (const item of ITEMS) {
    const outDir = path.join(OUT, item.dest);
    fs.mkdirSync(outDir, { recursive: true });
    const slug = path.basename(item.dest);
    console.log(`\n=== ${item.dest} ===`);
    const hero = path.join(item.dir, `${item.prefix}1${item.suffix}`);
    if (fs.existsSync(hero)) {
      await processHero(hero, path.join(outDir, `${slug}-default.webp`));
      await processHero(hero, path.join(outDir, `${slug}.webp`), true);
      console.log('  hero + card');
    } else { console.log('  MISSING hero:', hero); }
    for (const pos of [4, 5, 6]) {
      const f = path.join(item.dir, `${item.prefix}${pos}${item.suffix}`);
      if (fs.existsSync(f)) {
        await processFeature(f, path.join(outDir, `${slug}-feature-${pos}.webp`));
        console.log(`  feature-${pos}`);
      } else { console.log(`  MISSING feature-${pos}`); }
    }
  }
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
