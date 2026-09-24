/** Offline check of every locally referenced public visual asset and the five icon canvases. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public');
const sources = ['index.html'];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(?:vue|ts|css|html)$/.test(entry.name)) sources.push(path.relative(root, file));
  }
}
walk(path.join(root, 'src'));
const source = sources.map(name => fs.readFileSync(path.join(root, name), 'utf8')).join('\n');
const referenced = new Set();
for (const match of source.matchAll(/['"](\/(?!\/)[\w./-]+\.(?:png|webp|jpg|jpeg|svg|ico))['"]/gi)) referenced.add(match[1]);
const failures = [];
for (const url of referenced) {
  if (!fs.existsSync(path.join(pub, url.slice(1)))) failures.push(`Broken public reference: ${url}`);
}
let count = 0;
function publicWalk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) publicWalk(file);
    else if (/\.(?:png|webp|jpg|jpeg|svg|ico)$/i.test(entry.name)) {
      count++;
      const url = '/' + path.relative(pub, file).split(path.sep).join('/');
      if (!referenced.has(url)) failures.push(`Unreferenced retained image: ${url}`);
    }
  }
}
publicWalk(pub);
for (const [name, size] of [['favicon-16.png',16],['favicon-32.png',32],['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]]) {
  const file = path.join(pub, 'branding', name);
  if (!fs.existsSync(file)) { failures.push(`Missing icon ${name}`); continue; }
  const header = fs.readFileSync(file).subarray(0, 24);
  const width = header.readUInt32BE(16), height = header.readUInt32BE(20);
  if (width !== size || height !== size) failures.push(`Wrong icon canvas: ${name} ${width}x${height} (expected ${size}x${size})`);
}
for (const issue of failures) console.error(`FAIL: ${issue}`);
console.log(`ASSETS: ${count} retained visual files, ${referenced.size} static references; ${failures.length} problems.`);
process.exitCode = failures.length ? 1 : 0;
