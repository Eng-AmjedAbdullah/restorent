/** Reproducible canvas-only correction for icon canvas dimensions.
 * Original visual pixels are preserved (no recoloring or design changes).
 * The source archive and separate removed-asset ZIP preserve all originals.
 */
const sharp = require('sharp');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const assets = [
  ['favicon-16.png', 16],
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];
(async () => {
  for (const [file, side] of assets) {
    const target = path.join(root, 'public', 'branding', file);
    const image = sharp(target);
    const meta = await image.metadata();
    if (meta.width === side && meta.height === side) {
      console.log(`ALREADY SQUARE ${file}: ${side}×${side}`);
      continue;
    }
    // fit: contain adds transparent padding instead of stretching the mark.
    const result = await image.resize(side, side, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    await require('node:fs/promises').writeFile(target, result);
    const check = await sharp(target).metadata();
    if (check.width !== side || check.height !== side) throw new Error(`Incorrect output canvas: ${file}`);
    console.log(`PADDED ${file}: ${meta.width}×${meta.height} → ${side}×${side}`);
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
