// Process iPad PDP assets into web-ready WebP files
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = '/tmp/ipad-pdp';
const OUT_BASE = path.join(__dirname, '..', 'site', 'assets', 'img', 'products', 'ipads');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

// Per model: src path patterns
const MODELS = {
  'ipad-pro': {
    colors: {
      silver:      `${SRC}/pro-silver/10102025/iPad_Pro_11-in_M5_WiFi_Silver_PDP_Images/iPad_Pro_11-in_M5_WiFi_Silver_PDP_Image_Position_1__en-US.jpg`,
      'space-black': `${SRC}/pro-spaceblack/10102025/iPad_Pro_11-in_M5_WiFi_Space_Black_PDP_Images/iPad_Pro_11-in_M5_WiFi_Space_Black_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'silver',
    featureDir: `${SRC}/pro-silver/10102025/iPad_Pro_11-in_M5_WiFi_Silver_PDP_Images`,
    featurePrefix: 'iPad_Pro_11-in_M5_WiFi_Silver_PDP_Image_Position_',
    featureSuffix: '__en-US.jpg',
  },
  'ipad-air': {
    colors: {
      blue:         `${SRC}/air-blue/Blue/iPad_Air_13_Air_M4_Wifi_Blue_PDP_Image/iPad_Air_13_Air_M4_Wifi_Blue_PDP_Image_Position_1__en-US.jpg`,
      purple:       `${SRC}/air-purple/Purple/iPad_Air_13_Air_M4_Wifi_Purple_PDP_Image/iPad_Air_13_Air_M4_Wifi_Purple_PDP_Image_Position_1__en-US.jpg`,
      'space-gray': `${SRC}/air-space_gray/Space Gray/iPad_Air_13_Air_M4_Wifi_Space_Gray_PDP_Image/iPad_Air_13_Air_M4_Wifi_Space_Gray_PDP_Image_Position_1__en-US.jpg`,
      starlight:    `${SRC}/air-starlight/Starlight/iPad_Air_13_Air_M4_Wifi_Starlight_PDP_Image/iPad_Air_13_Air_M4_Wifi_Starlight_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'blue',
    featureDir: `${SRC}/air-blue/Blue/iPad_Air_13_Air_M4_Wifi_Blue_PDP_Image`,
    featurePrefix: 'iPad_Air_13_Air_M4_Wifi_Blue_PDP_Image_Position_',
    featureSuffix: '__en-US.jpg',
  },
  'ipad': {
    colors: {
      blue:   `${SRC}/a16-blue/Blue/iPad_A16_WiFi_Blue_PDP_Image/iPad_A16_WiFi_Blue_PDP_Image_Position_1__en-US.jpg`,
      pink:   `${SRC}/a16-pink/Pink/iPad_A16_WiFi_Pink_PDP_Image/iPad_A16_WiFi_Pink_PDP_Image_Position_1__en-US.jpg`,
      silver: `${SRC}/a16-silver/Silver/iPad_A16_WiFi_Silver_PDP_Image/iPad_A16_WiFi_Silver_PDP_Image_Position_1__en-US.jpg`,
      yellow: `${SRC}/a16-yellow/Yellow/iPad_A16_WiFi_Yellow_PDP_Image/iPad_A16_WiFi_Yellow_PDP_Image_Position_1__en-US.jpg`,
    },
    default: 'blue',
    featureDir: `${SRC}/a16-blue/Blue/iPad_A16_WiFi_Blue_PDP_Image`,
    featurePrefix: 'iPad_A16_WiFi_Blue_PDP_Image_Position_',
    featureSuffix: '__en-US.jpg',
  },
  'ipad-mini': {
    colors: {
      blue:         `${SRC}/mini-blue/iPad_mini_Blue_PDP_Images__enUS/WiFi_Non_5G/Blue/iPad_mini_Blue_PDP_Image_Position_1a_WiFi__en-US.jpg`,
      purple:       `${SRC}/mini-purple/iPad_mini_Purple_PDP_Images__enUS/WiFi_Non_5G/Purple/iPad_mini_Purple_PDP_Image_Position_1a_WiFi__en-US.jpg`,
      'space-gray': `${SRC}/mini-space_gray/iPad_mini_Space_Gray_PDP_Images__enUS/WiFi_Non_5G/Space Gray/iPad_mini_Space_Gray_PDP_Image_Position_1a_WiFi__en-US.jpg`,
      starlight:    `${SRC}/mini-starlight/iPad_mini_Starlight_PDP_Images__enUS/WiFi_Non_5G/Starlight/iPad_mini_Starlight_PDP_Image_Position_1a_WiFi__en-US.jpg`,
    },
    default: 'blue',
    featureDirFn: () => {
      // Mini features live in WiFi_Non_5G/Blue/
      return `${SRC}/mini-blue/iPad_mini_Blue_PDP_Images__enUS/WiFi_Non_5G/Blue`;
    },
    featurePrefix: 'iPad_mini_Blue_PDP_Image_Position_',
    featureSuffix: '_WiFi__en-US.jpg',
  },
};

async function processHero(srcPath, outPath) {
  // Trim whitespace, then fit on white canvas, full bleed (90% width)
  const img = sharp(srcPath).flatten({ background: WHITE });
  const trimmed = await img.trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  // Target canvas 1600x1200 (4:3) — iPads are landscape on Apple's pages
  const TW = 1600, TH = 1200;
  // Scale so it fits within 80% width / 85% height
  const scale = Math.min((TW * 0.80) / meta.width, (TH * 0.85) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const resized = await sharp(trimmed).resize(w, h, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: TW, height: TH, channels: 3, background: WHITE } })
    .composite([{ input: resized, gravity: 'center' }])
    .webp({ quality: 90 })
    .toFile(outPath);
}

async function processCard(srcPath, outPath) {
  // Card uses same 1600x1448 canvas as Desktops, product centered/bottom
  const img = sharp(srcPath).flatten({ background: WHITE });
  const trimmed = await img.trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const TW = 1600, TH = 1448;
  const scale = Math.min((TW * 0.70) / meta.width, (TH * 0.78) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const resized = await sharp(trimmed).resize(w, h, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: TW, height: TH, channels: 3, background: WHITE } })
    .composite([{ input: resized, gravity: 'south' }])
    .webp({ quality: 90 })
    .toFile(outPath);
}

async function processFeature(srcPath, outPath) {
  // Match Notebooks/Desktops: 1000×1000 square at 85% quality
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

    // Per-color hero
    for (const [color, src] of Object.entries(model.colors)) {
      if (!fs.existsSync(src)) { console.log(`  MISSING: ${color}: ${src}`); continue; }
      const out = path.join(outDir, `${slug}-${color}.webp`);
      await processHero(src, out);
      console.log(`  hero ${color} → ${path.basename(out)}`);
    }

    // Card image (using default color)
    const cardSrc = model.colors[model.default];
    if (cardSrc && fs.existsSync(cardSrc)) {
      const cardOut = path.join(outDir, `${slug}.webp`);
      await processCard(cardSrc, cardOut);
      console.log(`  card → ${path.basename(cardOut)}`);
    }

    // Feature images (positions 4, 5, 6)
    const fDir = model.featureDirFn ? model.featureDirFn() : model.featureDir;
    for (const pos of [4, 5, 6]) {
      const fSrc = path.join(fDir, `${model.featurePrefix}${pos}${model.featureSuffix}`);
      if (!fs.existsSync(fSrc)) { console.log(`  MISSING feature ${pos}: ${fSrc}`); continue; }
      const fOut = path.join(outDir, `${slug}-feature-${pos}.webp`);
      await processFeature(fSrc, fOut);
      console.log(`  feature-${pos} → ${path.basename(fOut)}`);
    }
  }
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
