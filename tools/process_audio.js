// Process Audio (AirPods + HomePod) PDP assets → web-ready WebP
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = '/tmp/audio';
const OUT_BASE = path.join(__dirname, '..', 'site', 'assets', 'img', 'products', 'audio');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const MODELS = {
  'airpods-pro-3': {
    colors: {
      white: `${SRC}/airpods-pro3/AirPods_Pro_3_PDP_Images/JPG_Exports/AirPods_Pro_3_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'white',
    feat: (p) => `${SRC}/airpods-pro3/AirPods_Pro_3_PDP_Images/JPG_Exports/AirPods_Pro_3_PDP_Image_Position_${p}__en-US.jpg`,
  },
  'airpods-4': {
    colors: {
      white: `${SRC}/airpods4/AirPods_4_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'white',
    feat: (p) => `${SRC}/airpods4/AirPods_4_PDP_Image_Position_${p}__en-US.jpg`,
  },
  'airpods-max-2': {
    colors: {
      midnight:  `${SRC}/max-midnight/AirPods_Max_2_Midnight_PDP_en-US/AirPods_Max_2_Midnight_PDP_Image_Position_1__en-US.jpg`,
      blue:      `${SRC}/max-blue/AirPods_Max_2_Blue_PDP_en-US/AirPods_Max_2_Blue_PDP_Image_Position_1__en-US.jpg`,
      purple:    `${SRC}/max-purple/AirPods_Max_2_Purple_PDP_en-US/AirPods_Max_2_Purple_PDP_Image_Position_1__en-US.jpg`,
      orange:    `${SRC}/max-orange/AirPods_Max_2_Orange_PDP_en-US/AirPods_Max_2_Orange_PDP_Image_Position_1__en-US.jpg`,
      starlight: `${SRC}/max-starlight/AirPods_Max_2_Starlight_PDP_en-US/AirPods_Max_2_Starlight_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'midnight',
    feat: (p) => `${SRC}/max-midnight/AirPods_Max_2_Midnight_PDP_en-US/AirPods_Max_2_Midnight_PDP_Image_Position_${p}__en-US.jpg`,
  },
  'homepod': {
    colors: {
      white:    `${SRC}/homepod-white/HomePod_PDP_Image_White_Full_Gallery/HomePod_PDP_Image_Position-1__en-US.jpg`,
      midnight: `${SRC}/homepod-midnight/HomePod_PDP_Image_Midnight_Full_Gallery/HomePod_PDP_Image_Position-1__en-US.jpg`,
    },
    default: 'white',
    feat: (p) => `${SRC}/homepod-white/HomePod_PDP_Image_White_Full_Gallery/HomePod_PDP_Image_Position-${p}__en-US.jpg`,
  },
  'homepod-mini': {
    colors: {
      blue:     `${SRC}/mini-blue/Blue/HomePod_mini_Blue_PDP_Image_Position-1__en-US.jpg`,
      midnight: `${SRC}/mini-midnight/Midnight/HomePod_mini_Midnight_PDP_Image_Position-1__en-US.jpg`,
      orange:   `${SRC}/mini-orange/Orange/HomePod_mini_Orange_PDP_Image_Position-1__en-US.jpg`,
      white:    `${SRC}/mini-white/White/HomePod_mini_White_PDP_Image_Position-1__en-US.jpg`,
      yellow:   `${SRC}/mini-yellow/Yellow/HomePod_mini_Yellow_PDP_Image_Position-1__en-US.jpg`,
    },
    default: 'blue',
    feat: (p) => `${SRC}/mini-blue/Blue/HomePod_mini_Blue_PDP_Image_Position-${p}__en-US.jpg`,
  },
};

async function processHero(srcPath, outPath) {
  const trimmed = await sharp(srcPath).flatten({ background: WHITE }).trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const TW = 1600, TH = 1200;
  const scale = Math.min((TW * 0.65) / meta.width, (TH * 0.80) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const resized = await sharp(trimmed).resize(w, h, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: TW, height: TH, channels: 3, background: WHITE } })
    .composite([{ input: resized, gravity: 'center' }])
    .webp({ quality: 90 })
    .toFile(outPath);
}

async function processCard(srcPath, outPath) {
  const trimmed = await sharp(srcPath).flatten({ background: WHITE }).trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const TW = 1600, TH = 1448;
  const scale = Math.min((TW * 0.55) / meta.width, (TH * 0.70) / meta.height);
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
      await processHero(src, path.join(outDir, `${slug}-${color}.webp`));
      console.log(`  hero ${color}`);
    }
    const cardSrc = model.colors[model.default];
    if (cardSrc && fs.existsSync(cardSrc)) {
      await processCard(cardSrc, path.join(outDir, `${slug}.webp`));
      console.log(`  card`);
    }
    for (const pos of [4, 5, 6]) {
      const fSrc = model.feat(pos);
      if (!fs.existsSync(fSrc)) { console.log(`  MISSING feature-${pos}`); continue; }
      await processFeature(fSrc, path.join(outDir, `${slug}-feature-${pos}.webp`));
      console.log(`  feature-${pos}`);
    }
  }
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
