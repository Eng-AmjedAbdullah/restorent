import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const dir = '/public/branding';
const files = fs.readdirSync(dir).sort();

console.log('| Asset Name | Format | Dimensions | File Size | Description |');
console.log('|---|---|---|---|---|');

for (const file of files) {
  const filePath = path.join(dir, file);
  const stat = fs.statSync(filePath);
  let dimensions = 'N/A';
  try {
    dimensions = execSync(`identify -format "%wx%h" "${filePath}"`).toString().trim().replace(/\n/g, ', ');
  } catch (e) {
    dimensions = 'Multi-layer';
  }
  
  const sizeKb = (stat.size / 1024).toFixed(1) + ' KB';
  const ext = path.extname(file).toUpperCase().replace('.', '');
  console.log(`| \`${file}\` | ${ext} | ${dimensions} | ${sizeKb} | |`);
}
