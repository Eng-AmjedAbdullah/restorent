import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/app/applet/public/branding';
fs.mkdirSync(OUT_DIR, { recursive: true });

console.log('=== RESTORAINTEL BRAND ASSET GENERATOR (CORRECTED TASK 02R) ===');

function run(cmd) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { stdio: 'inherit' });
}

// 1. Full Master Original Logo (Dark) - from logo1.png
// Preserves the entire original artwork, twin chef hats, circuits, wordmark, and ambient cyan glow on native dark background
run(`convert logo1.png -fuzz 8% -trim +repage -resize 1200x -quality 92 ${OUT_DIR}/logo-full-original-dark.webp`);
// Also keep logo-full-dark.webp as a clean copy
run(`cp ${OUT_DIR}/logo-full-original-dark.webp ${OUT_DIR}/logo-full-dark.webp`);

// 2. VARIANT 1: Complete Full Twin-Chef-Hat Emblem at Natural Aspect Ratio
// From logowithout.png - 1841x961 content preserved 100% across natural horizontal aspect ratio (~1.92:1)
// Neither left nor right chef hat is cut off! Both outer hats, utensils, and circuit wings intact.
run(`convert logowithout.png -fuzz 8% -trim +repage -resize 1200x -quality 92 ${OUT_DIR}/logo-twin-mark-dark.webp`);

// 3. VARIANT 2: Compact Emblem using ONE Complete Authentic Chef-Hat-and-Utensil Motif
// Cropped directly from the authentic original artwork (logowithout.png)
// Left authentic unit: x=79, y=45, w=840, h=940 placed inside a 1:1 square canvas (940x940) centered with dark #08131F background
run(`convert logowithout.png -crop 840x940+79+45 +repage -gravity Center -background "#08131F" -extent 940x940 -resize 512x512 -quality 95 ${OUT_DIR}/logo-compact-mark-dark.webp`);

// Compact 128x128 for sidebar and dock
run(`convert ${OUT_DIR}/logo-compact-mark-dark.webp -resize 128x128 -unsharp 0x0.8+0.8+0.01 -quality 95 ${OUT_DIR}/logo-compact-mark-128.webp`);

// Also provide the right authentic unit for comparison in approval gate
run(`convert logowithout.png -crop 853x940+1067+45 +repage -gravity Center -background "#08131F" -extent 940x940 -resize 512x512 -quality 95 ${OUT_DIR}/logo-compact-mark-alt-right.webp`);

// Keep logo-mark.webp updated with the non-destructive authentic complete emblem
run(`cp ${OUT_DIR}/logo-compact-mark-dark.webp ${OUT_DIR}/logo-mark.webp`);
run(`cp ${OUT_DIR}/logo-compact-mark-128.webp ${OUT_DIR}/logo-sidebar-compact.webp`);

// 4. Wordmark Dark (Authentic extracted typography for dark UI)
// Luminance-to-alpha subpixel extraction from name.png
run(`convert name.png -fuzz 8% -trim +repage -level 4%,100% \\( +clone -colorspace Gray \\) -alpha off -compose CopyOpacity -composite -resize 900x -quality 95 ${OUT_DIR}/wordmark-dark.webp`);

// 5. Wordmark Light (Authentic extracted typography in deep slate #0F172A for light UI)
run(`convert ${OUT_DIR}/wordmark-dark.webp \\( +clone -fill "#0F172A" -colorize 100% \\) -compose In -composite -quality 95 ${OUT_DIR}/wordmark-light.webp`);

// 6. Real Dark App Lockup (Compact Mark + Wordmark on Dark Background)
run(`convert -size 560x90 xc:"#060E17" \\
  \\( ${OUT_DIR}/logo-compact-mark-128.webp -resize 64x64 \\) -geometry +16+13 -composite \\
  \\( ${OUT_DIR}/wordmark-dark.webp -resize 440x \\) -geometry +96+26 -composite \\
  -quality 95 ${OUT_DIR}/logo-lockup-dark.webp`);

// 7. Real Light App Lockup (Discrete Rounded Jewel Badge + Transparent Deep Slate Wordmark)
// 100% transparent canvas - NOT an oversized dark box!
run(`convert -size 560x90 xc:none \\
  \\( ${OUT_DIR}/logo-compact-mark-128.webp -resize 56x56 -bordercolor "#34abb1" -border 2x2 \\) -geometry +16+15 -composite \\
  \\( ${OUT_DIR}/wordmark-light.webp -resize 440x \\) -geometry +92+26 -composite \\
  -quality 95 ${OUT_DIR}/logo-lockup-light.webp`);

// 8. Favicons and Icons generated from the authentic single-motif chef hat
run(`convert ${OUT_DIR}/logo-compact-mark-dark.webp -resize 16x16 -unsharp 0x1.2+1.0+0.05 ${OUT_DIR}/favicon-16.png`);
run(`convert ${OUT_DIR}/logo-compact-mark-dark.webp -resize 32x32 -unsharp 0x1.0+0.9+0.04 ${OUT_DIR}/favicon-32.png`);
run(`convert ${OUT_DIR}/logo-compact-mark-dark.webp -resize 48x48 -unsharp 0x0.8+0.8+0.02 ${OUT_DIR}/favicon-48.png`);
run(`convert ${OUT_DIR}/favicon-16.png ${OUT_DIR}/favicon-32.png ${OUT_DIR}/favicon-48.png ${OUT_DIR}/favicon.ico`);

// 9. Apple Touch Icon (180x180)
run(`convert ${OUT_DIR}/logo-compact-mark-dark.webp -resize 180x180 ${OUT_DIR}/apple-touch-icon.png`);

// 10. Mobile and PWA Launchers (192x192 & 512x512)
run(`convert ${OUT_DIR}/logo-compact-mark-dark.webp -resize 192x192 ${OUT_DIR}/icon-192.png`);
run(`convert ${OUT_DIR}/logo-compact-mark-dark.webp -resize 512x512 ${OUT_DIR}/icon-512.png`);

console.log('=== BRAND ASSET GENERATION FINISHED ===');
