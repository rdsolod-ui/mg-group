// Native browser typography over an AI-generated concept photograph.
// Requires an existing browser CDP endpoint and Playwright; never launches/closes a user's browser.
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "C:/Users/admin/.codex/playwright-runtime/node_modules/playwright");
const root = path.resolve("public");
const template = await readFile("design/social-card.html", "utf8");
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/card") { res.setHeader("Content-Type", "text/html; charset=utf-8"); res.end(template); return; }
    const file = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep)) throw Error("path");
    res.setHeader("Content-Type", { ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2" }[path.extname(file)] || "application/octet-stream");
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.connectOverCDP(process.env.CDP_URL || "http://127.0.0.1:9223");
const page = await browser.contexts()[0].newPage();
try {
  await mkdir("public/social", { recursive: true });
  for (const [name, height] of [["og", 630], ["card", 600], ["square", 1200]]) {
    await page.setViewportSize({ width: 1200, height });
    await page.goto(`http://127.0.0.1:${server.address().port}/card?format=${name}`);
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((image) => image.decode())); });
    const image = await page.screenshot({ animations: "disabled" });
    await sharp(image).jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(`public/social/mg-group-${name}-v1.jpg`);
  }
  console.log("Rendered 1200×630, 1200×600 and 1200×1200 social cards.");
} finally { await page.close(); await browser.close(); server.close(); }
