/**
 * Slaydları HTML paketindən 1080 px enində PNG kimi çıxarır.
 *   node render-png.mjs
 * Nəticə: ./png/*.png  (karusel 1080×1350, reels 1080×1920)
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdirSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, "link-nedi-post-paketi.html");
const outDir = resolve(here, "png");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1400, height: 1000 },
  deviceScaleFactor: 1,
});

await page.goto("file://" + source);

// Lentdəki kiçildilmiş slaydları tam ölçüyə açırıq.
await page.addStyleTag({
  content: `
    .strip { display: block !important; overflow: visible !important; }
    .strip .slide, .reel .slide { flex: none !important; width: 1080px !important; max-width: none !important; }
    .slide { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
  `,
});
await page.waitForTimeout(300);

const slides = await page.$$("[data-png]");
let count = 0;
for (const slide of slides) {
  const name = await slide.getAttribute("data-png");
  await slide.screenshot({ path: resolve(outDir, `${name}.png`) });
  const box = await slide.boundingBox();
  console.log(`${name}.png  ${Math.round(box.width)}×${Math.round(box.height)}`);
  count++;
}

await browser.close();
console.log(`\n${count} slayd → ${outDir}`);
