import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/public/branding';
fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('=== RESTORAINTEL BRAND ASSET GENERATOR ===');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit' });
}

// 1. Full Brand Logo (Dark) - web-optimized WebP from logo1.png
// Trims the extra unneeded margins, scales to crisp 1200px max width, WebP quality 92
run(`convert logo1.png -fuzz 10% -trim +repage -resize 1200x -quality 92 ${OUT_DIR}/logo-full-dark.webp`);

// 2. Full Brand Logo (Light Context Container) - Presentation card badge
// Takes the original full artwork and places it inside a luxury rounded dark presentation badge
// with a subtle brand cyan border (#34abb1 / #4edee3) and soft dark padding, preserving 100% of glowing circuits
run(`convert logo1.png -fuzz 10% -trim +repage -resize 1000x -bordercolor "#08131F" -border 24x24 -quality 92 ${OUT_DIR}/logo-full-light.webp`);

// 3. Standalone Logo Mark (Emblem) - 512x512 square WebP from logowithout.png
// Centered crop prioritizing the chef hat silhouette, utensils and circuits
run(`convert logowithout.png -gravity Center -crop 1200x1034+0+0 +repage -resize 512x512 -quality 92 ${OUT_DIR}/logo-mark.webp`);

// 4. Logo Mark for Dark UI (compact sidebar 64x64 and 128x128)
run(`convert ${OUT_DIR}/logo-mark.webp -resize 128x128 -unsharp 0x0.75+0.75+0.008 -quality 95 ${OUT_DIR}/logo-sidebar-compact.webp`);

// 5. Logo Sidebar Expanded (Horizontal lockup with emblem + wordmark)
// Trim logo1 and scale for horizontal sidebar lockup
run(`convert logo1.png -fuzz 10% -trim +repage -resize 480x -quality 92 ${OUT_DIR}/logo-sidebar-expanded.webp`);

// 6. Wordmark Dark (white/cyan text with transparent background)
// Extracted via mathematical luminance-opacity curve from name.png
run(`convert name.png -fuzz 10% -trim +repage -level 4%,100% \\( +clone -colorspace Gray \\) -alpha off -compose CopyOpacity -composite -resize 900x -quality 95 ${OUT_DIR}/wordmark-dark.webp`);

// 7. Wordmark Light (deep slate #0F172A / brand teal #2C777C text with transparent background)
// Inverted and colorized for high contrast on light backgrounds
run(`convert ${OUT_DIR}/wordmark-dark.webp \\( +clone -fill "#0F172A" -colorize 100% \\) -compose In -composite -quality 95 ${OUT_DIR}/wordmark-light.webp`);

// 8. Favicon variants
// 16x16, 32x32, 48x48 PNGs
run(`convert logowithout.png -gravity Center -crop 1034x1034+0+0 +repage -resize 16x16 -unsharp 0x1.0+1.0+0.05 ${OUT_DIR}/favicon-16.png`);
run(`convert logowithout.png -gravity Center -crop 1034x1034+0+0 +repage -resize 32x32 -unsharp 0x1.0+1.0+0.05 ${OUT_DIR}/favicon-32.png`);
run(`convert logowithout.png -gravity Center -crop 1034x1034+0+0 +repage -resize 48x48 -unsharp 0x0.8+0.8+0.02 ${OUT_DIR}/favicon-48.png`);

// Multi-resolution true Windows ICO file (contains 16, 32, 48)
run(`convert ${OUT_DIR}/favicon-16.png ${OUT_DIR}/favicon-32.png ${OUT_DIR}/favicon-48.png ${OUT_DIR}/favicon.ico`);

// 9. Apple Touch Icon (180x180 PNG with #08131F background)
run(`convert logowithout.png -gravity Center -crop 1034x1034+0+0 +repage -resize 160x160 -gravity Center -background "#08131F" -extent 180x180 ${OUT_DIR}/apple-touch-icon.png`);

// 10. Application Icons (192x192 & 512x512)
run(`convert logowithout.png -gravity Center -crop 1034x1034+0+0 +repage -resize 172x172 -gravity Center -background "#08131F" -extent 192x192 ${OUT_DIR}/icon-192.png`);
run(`convert logowithout.png -gravity Center -crop 1034x1034+0+0 +repage -resize 460x460 -gravity Center -background "#08131F" -extent 512x512 ${OUT_DIR}/icon-512.png`);

console.log('\n--- BRAND ASSET GENERATION FINISHED ---');
