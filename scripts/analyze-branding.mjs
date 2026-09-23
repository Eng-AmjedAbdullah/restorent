import { execSync } from 'child_process';
import fs from 'fs';

console.log('--- BRAND ASSET DIAGNOSTIC ---');

const files = ['logo1.png', 'logowithout.png', 'name.png'];

for (const file of files) {
  const stat = fs.statSync(file);
  const info = execSync(`identify -format "%w %h %[colorspace] %[type]" ${file}`).toString().trim().split(' ');
  const [w, h, colorspace, type] = info;
  
  // Sample 4 corners
  const tl = execSync(`convert ${file} -crop 1x1+0+0 -format "%[pixel:s]" info:`).toString().trim();
  const tr = execSync(`convert ${file} -crop 1x1+${w-1}+0 -format "%[pixel:s]" info:`).toString().trim();
  const bl = execSync(`convert ${file} -crop 1x1+0+${h-1} -format "%[pixel:s]" info:`).toString().trim();
  const br = execSync(`convert ${file} -crop 1x1+${w-1}+${h-1} -format "%[pixel:s]" info:`).toString().trim();

  console.log(`\nFile: ${file}`);
  console.log(`  Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB (${stat.size} bytes)`);
  console.log(`  Dimensions: ${w} x ${h} px`);
  console.log(`  Colorspace: ${colorspace}, Type: ${type}`);
  console.log(`  Corners: TL=${tl}, TR=${tr}, BL=${bl}, BR=${br}`);
}
