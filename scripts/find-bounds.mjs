import { execSync } from 'child_process';
import fs from 'fs';

// Find bounding box where pixel exceeds background threshold
const script = `
const { execSync } = require('child_process');
// Using ImageMagick to get bounding box with different fuzz levels
for (const fuzz of [5, 8, 10, 12, 15]) {
  const out = execSync('convert logowithout.png -fuzz ' + fuzz + '% -trim -format "%wx%h+%X+%Y (fuzz ' + fuzz + '%)" info:').toString().trim();
  console.log('logowithout trim: ' + out);
}
for (const fuzz of [5, 8, 10, 12, 15]) {
  const out = execSync('convert logo1.png -fuzz ' + fuzz + '% -trim -format "%wx%h+%X+%Y (fuzz ' + fuzz + '%)" info:').toString().trim();
  console.log('logo1 trim: ' + out);
}
for (const fuzz of [5, 8, 10, 12, 15]) {
  const out = execSync('convert name.png -fuzz ' + fuzz + '% -trim -format "%wx%h+%X+%Y (fuzz ' + fuzz + '%)" info:').toString().trim();
  console.log('name trim: ' + out);
}
`;

fs.writeFileSync('/tmp/find_bounds.cjs', script);
console.log(execSync('node /tmp/find_bounds.cjs').toString());
