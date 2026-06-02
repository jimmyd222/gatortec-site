#!/usr/bin/env node
// Generates a thin-line outline SVG icon from a product photo by:
// 1. thresholding to silhouette
// 2. writing 1-bit PBM (potrace's native format)
// 3. running potrace
// 4. rewriting the resulting SVG as stroke-only with a clean 64x48 viewBox
//
// Usage: node tools/trace_icon.js <source-image> <threshold> <out-name>

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const POTRACE = '/usr/local/opt/potrace/bin/potrace';
const OUT_DIR = path.resolve(__dirname, '../site/assets/img/icons');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function trace(src, threshold, outName) {
  const pbm = '/tmp/trace-' + outName + '.pbm';
  const rawSvg = '/tmp/trace-' + outName + '.svg';
  const finalSvg = path.join(OUT_DIR, outName + '.svg');

  const { data, info } = await sharp(src)
    .removeAlpha().greyscale().threshold(threshold)
    .resize({ width: 1000, withoutEnlargement: true })
    .raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;

  // Write 1-bit PBM (P4 binary)
  const rowBytes = Math.ceil(W / 8);
  const packed = Buffer.alloc(rowBytes * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = data[y*W + x];
      if (v < 128) packed[y*rowBytes + (x>>3)] |= (0x80 >> (x & 7));
    }
  }
  fs.writeFileSync(pbm, Buffer.concat([Buffer.from(`P4\n${W} ${H}\n`), packed]));

  // potrace --turdsize ignores tiny specks; --opttolerance smooths curves
  execFileSync(POTRACE, [
    '--svg', '--output', rawSvg,
    '--turdsize', '50',
    '--opttolerance', '0.4',
    '--alphamax', '1',
    pbm,
  ]);

  // Read the potrace SVG and rewrite it as a stroke-only icon
  let svg = fs.readFileSync(rawSvg, 'utf8');
  const dimMatch = svg.match(/width="([\d.]+)pt"\s+height="([\d.]+)pt"/);
  const ow = dimMatch ? parseFloat(dimMatch[1]) : W;
  const oh = dimMatch ? parseFloat(dimMatch[2]) : H;
  // Extract the inner transformed group as-is (potrace's coordinate system + Y-flip)
  const groupMatch = svg.match(/<g\s+transform=["'][^"']+["']\s+fill="[^"]*"\s+stroke="[^"]*">([\s\S]*?)<\/g>/);
  if (!groupMatch) throw new Error('Could not extract path group from potrace SVG');
  const transformMatch = svg.match(/(<g\s+transform=["'][^"']+["'])\s+fill/);
  const transformAttr = transformMatch ? transformMatch[1] + '>' : '<g>';
  // Strip any stray fill/stroke attrs from inner paths
  const innerPaths = groupMatch[1].replace(/\s+(fill|stroke)="[^"]*"/g, '');

  // Use potrace's own viewBox so the path renders correctly. Stroke-width is in
  // potrace-pt units, so multiply by an appropriate factor (potrace coords are
  // 10× pixel coords because of the internal scale(0.1) transform).
  const strokeW = Math.max(ow, oh) * 0.015;  // ~1.5% of the longest dimension
  const out = `<svg viewBox="0 0 ${ow.toFixed(0)} ${oh.toFixed(0)}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="${strokeW.toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" preserveAspectRatio="xMidYMid meet">
${transformAttr}
${innerPaths.trim()}
</g>
</svg>
`;
  fs.writeFileSync(finalSvg, out);

  // Render a PNG preview at 256px so I can eyeball it
  const previewPath = '/tmp/icon-preview-' + outName + '.png';
  await sharp(Buffer.from(out)).resize({ width: 256 }).png().toFile(previewPath);
  return { svgPath: finalSvg, previewPath, bytes: fs.statSync(finalSvg).size };
}

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: node tools/trace_icon.js <src> <threshold> <out-name>');
    process.exit(1);
  }
  const [src, t, name] = args;
  const r = await trace(src, parseInt(t, 10), name);
  console.log('Wrote', r.svgPath, '·', r.bytes, 'bytes  ·  preview:', r.previewPath);
})();
