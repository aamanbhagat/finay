/**
 * Build all favicon assets from app/icon.svg.
 *
 * Outputs:
 *   app/favicon.ico         — multi-res ICO (16, 32, 48) for legacy browsers
 *   app/icon.png            — 512 PNG (modern fallback if SVG ignored)
 *   app/apple-icon.png      — 180×180 PNG for iOS home-screen
 *   public/icon-192.png     — PWA / Android manifest icon
 *   public/icon-512.png     — PWA / Android maskable icon
 *
 * Next.js auto-routes app/{favicon.ico,icon.*,apple-icon.*} to the head of every
 * page, so we don't need to touch metadata. Manifest references the /icon-NNN.png
 * files for installability.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = process.cwd();
const SVG = await fs.readFile(path.join(ROOT, "app", "icon.svg"));

const png = (size) => sharp(SVG, { density: 384 }).resize(size, size).png().toBuffer();

const tasks = [
  { name: "app/icon.png", size: 512 },
  { name: "app/apple-icon.png", size: 180 },
  { name: "public/icon-192.png", size: 192 },
  { name: "public/icon-512.png", size: 512 },
];

for (const t of tasks) {
  const buf = await png(t.size);
  await fs.writeFile(path.join(ROOT, t.name), buf);
  console.log(`  ✓ ${t.name} (${t.size}×${t.size}, ${(buf.length / 1024).toFixed(1)} KB)`);
}

// favicon.ico — bundle 16/32/48 into one file.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map(png));
const ico = await pngToIco(pngs);
await fs.writeFile(path.join(ROOT, "app", "favicon.ico"), ico);
console.log(`  ✓ app/favicon.ico (${icoSizes.join(", ")}, ${(ico.length / 1024).toFixed(1)} KB)`);

console.log("done.");
