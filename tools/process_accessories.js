// Process Mac + iPad accessory images
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const OUT = path.join(__dirname, '..', 'site', 'assets', 'img', 'products', 'accessories');

const MAC = '/tmp/accessory-imgs/mac/Mac Accessories - Screen Images';
const CAB = '/tmp/accessory-imgs/cables/Accessories_Cables_Adapters_Chargers_Screen';
const IPAD_PEN = '/tmp/accessory-imgs/pencil-pro/Apple Pencil Pro PDP Images';
const IPAD_MK13 = '/tmp/accessory-imgs/mk-13-pro';
const RAW_IPAD = path.join(__dirname, '..', 'apple-products-raw', 'iPad Accessories', 'PDP Images');

const ITEMS = [
  // iPad Pencils
  { slug: 'apple-pencil-pro', src: `${IPAD_PEN}/Apple_Pencil_Pro_PDP_Image_Position-1__en-US.png` },
  { slug: 'apple-pencil-usbc', src: `${RAW_IPAD}/Apple_Pencil_(USB-C)_PDP_Compatibility_Image__en-US.jpg` },
  { slug: 'apple-pencil-2gen', src: `${RAW_IPAD}/Apple_Pencil_(2ndGen)_PDP_Compatibility_Image__en-US.jpg` },
  // iPad Magic Keyboard
  { slug: 'magic-keyboard-ipad-pro', src: `${IPAD_MK13}/Magic_Keyboard_13_Pro_Space_Black_PDP_Image_Position-1__en-US.png` },
  // Mac input devices
  { slug: 'magic-keyboard', src: `${MAC}/Magic_Keyboard_(USB-C)/Magic_Keyboard_Silver_Pure_Top_Screen__USEN.tif` },
  { slug: 'magic-keyboard-touchid-numpad', src: `${MAC}/Magic_Keyboard_with_Touch_ID_and_Numeric_Keypad_(USB-C)/Magic_Keyboard_with_Touch_ID_and_Numeric_Pad_Black_Pure_Top_Screen__USEN.tif` },
  { slug: 'magic-mouse', src: `${MAC}/Magic_Mouse_(USB-C)/Magic_Mouse_Black_Pure_Top_Screen__USEN.tif` },
  { slug: 'magic-trackpad', src: `${MAC}/Magic_Trackpad_(USB-C)/Magic_Trackpad_Silver_Pure_Top_Screen__USEN.tif` },
  // Power adapters
  { slug: 'power-adapter-70w', src: `${CAB}/Chargers/70W_USB-C_Power_Adapter_Pure_Front_Screen__USEN.tif` },
  { slug: 'power-adapter-140w', src: `${CAB}/Chargers/140W_USB-C_Power_Adapter_34FL_Screen__USEN.tif` },
  { slug: 'power-adapter-35w-dual', src: `${CAB}/Chargers/35W_Dual_USB-C_Port_Compact_Power_Adapter_Pure_Front_Screen__USEN.tif` },
  // Cables
  { slug: 'thunderbolt-4-pro-cable', src: `${CAB}/Cables/Thunderbolt_4_Pro_Cable_1m_Coiled_Screen__USEN.tif` },
  { slug: 'usbc-charge-cable-240w', src: `${CAB}/Cables/240W_USB-C_USB-C_Charge_Cable_2m_Coiled_Screen__USEN.tif` },
  // Adapters
  { slug: 'usbc-digital-av-multiport', src: `${CAB}/Adapters/Adapter-USBC-DigitalAV-Multiport-SCREEN.tif` },
  { slug: 'usbc-sd-adapter', src: `${CAB}/Adapters/USB-C_SDcard_Adapter-SCREEN.tif` },
  { slug: 'usbc-usb-adapter', src: `${CAB}/Adapters/Adapter-USBC-to-USB-SCREEN.tif` },
];

async function process(srcPath, outPath) {
  // Square 1000x1000 with white bg, content centered
  const trimmed = await sharp(srcPath, { unlimited: true }).flatten({ background: WHITE }).trim({ background: WHITE, threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();
  const T = 1000;
  const scale = Math.min((T * 0.78) / meta.width, (T * 0.78) / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const resized = await sharp(trimmed).resize(w, h, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: T, height: T, channels: 3, background: WHITE } })
    .composite([{ input: resized, gravity: 'center' }])
    .webp({ quality: 88 })
    .toFile(outPath);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const item of ITEMS) {
    if (!fs.existsSync(item.src)) { console.log('MISSING:', item.slug, '←', item.src); continue; }
    await process(item.src, path.join(OUT, `${item.slug}.webp`));
    console.log(item.slug);
  }
  console.log('Done.');
})().catch(e => { console.error(e); process.exit(1); });
