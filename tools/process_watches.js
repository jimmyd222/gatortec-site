// Process Apple Watch PDP assets → web-ready WebP
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = '/tmp/watches';
const OUT_BASE = path.join(__dirname, '..', 'site', 'assets', 'img', 'products', 'watches');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const MODELS = {
  'series-11': {
    colors: {
      'jet-black':  `${SRC}/s11-jet/Apple_Watch_Series_11_46mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Images/JPG_Exports/Apple_Watch_Series_11_46mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Image_Position_1__en-US.jpg`,
      'space-gray': `${SRC}/s11-spacegray/Apple_Watch_Series_11_46mm_GPS_Space_Gray_Aluminum_Sport_Band_Black_PDP_Images/JPG_Exports/Apple_Watch_Series_11_46mm_GPS_Space_Gray_Aluminum_Sport_Band_Black_PDP_Image_Position_1__en-US.jpg`,
      silver:       `${SRC}/s11-silver/Apple_Watch_Series_11_46mm_GPS_Silver_Aluminum_Sport_Band_Purple_Fog_PDP_Images/JPG_Exports/Apple_Watch_Series_11_46mm_GPS_Silver_Aluminum_Sport_Band_Purple_Fog_PDP_Image_Position_1__en-US.jpg`,
      'rose-gold':  `${SRC}/s11-rose/Apple_Watch_Series_11_46mm_GPS_Rose_Gold_Aluminum_Sport_Band_Light_Blush_PDP_Images/JPG_Exports/Apple_Watch_Series_11_46mm_GPS_Rose_Gold_Aluminum_Sport_Band_Light_Blush_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'jet-black',
    featurePathFn: (pos) =>
      `${SRC}/s11-jet/Apple_Watch_Series_11_46mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Images/JPG_Exports/Apple_Watch_Series_11_46mm_GPS_Jet_Black_Aluminum_Sport_Band_Black_PDP_Image_Position_${pos}__en-US.jpg`,
  },
  'se-3': {
    colors: {
      midnight:  `${SRC}/se3-midnight/Apple_Watch_SE_3_GPS_Midnight_Aluminum/44MM/Apple_Watch_SE_3_44mm_GPS_Midnight_Aluminum_Sport_Band_Midnight_PDP_Image_Position_1__en-US.jpg`,
      starlight: `${SRC}/se3-starlight/Apple_Watch_SE_3_GPS_Starlight_Aluminum/44MM/Apple_Watch_SE_3_44mm_GPS_Starlight_Aluminum_Sport_Band_Starlight_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'midnight',
    featurePathFn: (pos) =>
      `${SRC}/se3-midnight/Apple_Watch_SE_3_GPS_Midnight_Aluminum/44MM/Apple_Watch_SE_3_44mm_GPS_Midnight_Aluminum_Sport_Band_Midnight_PDP_Image_Position_${pos}__en-US.jpg`,
  },
};

async function processHero(srcPath, outPath) {
  const img = sharp(srcPath).flatten({ background: WHITE });
  const trimmed = await img.trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const TW = 1600, TH = 1200;
  const scale = Math.min((TW * 0.70) / meta.width, (TH * 0.85) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const resized = await sharp(trimmed).resize(w, h, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: TW, height: TH, channels: 3, background: WHITE } })
    .composite([{ input: resized, gravity: 'center' }])
    .webp({ quality: 90 })
    .toFile(outPath);
}

async function processCard(srcPath, outPath) {
  const img = sharp(srcPath).flatten({ background: WHITE });
  const trimmed = await img.trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const TW = 1600, TH = 1448;
  const scale = Math.min((TW * 0.60) / meta.width, (TH * 0.72) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const resized = await sharp(trimmed).resize(w, h, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: TW, height: TH, channels: 3, background: WHITE } })
    .composite([{ input: resized, gravity: 'south' }])
    .webp({ quality: 90 })
    .toFile(outPath);
}

async function processFeature(srcPath, outPath) {
  await sharp(srcPath)
    .resize(1000, 1000, { fit: 'inside', background: WHITE })
    .flatten({ background: WHITE })
    .webp({ quality: 85 })
    .toFile(outPath);
}

(async () => {
  for (const [slug, model] of Object.entries(MODELS)) {
    const outDir = path.join(OUT_BASE, slug);
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`\n=== ${slug} ===`);
    for (const [color, src] of Object.entries(model.colors)) {
      if (!fs.existsSync(src)) { console.log(`  MISSING ${color}: ${src}`); continue; }
      const out = path.join(outDir, `${slug}-${color}.webp`);
      await processHero(src, out);
      console.log(`  hero ${color}`);
    }
    const cardSrc = model.colors[model.default];
    if (cardSrc && fs.existsSync(cardSrc)) {
      await processCard(cardSrc, path.join(outDir, `${slug}.webp`));
      console.log(`  card`);
    }
    for (const pos of [4, 5, 6]) {
      const fSrc = model.featurePathFn(pos);
      if (!fs.existsSync(fSrc)) { console.log(`  MISSING feature-${pos}`); continue; }
      await processFeature(fSrc, path.join(outDir, `${slug}-feature-${pos}.webp`));
      console.log(`  feature-${pos}`);
    }
  }
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
