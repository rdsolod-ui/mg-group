// Rebuild deterministic icons from the approved MG vector; no image generation here.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";
const dir = "public/icons";
await mkdir(dir, { recursive: true });
const mark = await readFile("public/brand/mg-group-mark.svg", "utf8");
const paths = [...mark.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join("");
const square = (maskable = false, adaptive = false) => {
  const width = maskable ? 304 : 438;
  const offset = (512 - width) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>MG Group</title>${adaptive ? '<style>@media(prefers-color-scheme:dark){.background{fill:#102d40}.mark{fill:#fff}}</style>' : ''}<rect class="background" width="512" height="512" rx="${maskable ? 0 : 88}" fill="#f6f4ee"/><g class="mark" fill="#183E58" transform="translate(${offset} ${256 - width * 59 / 184}) scale(${width / 184})">${paths}</g></svg>`;
};
await writeFile(`${dir}/favicon.svg`, square(false, true));
await writeFile(`${dir}/safari-pinned-tab.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g fill="#000" transform="translate(37 115.55) scale(2.38)">${paths.replaceAll(' fill="#EE7638"', '')}</g></svg>`);
const png = async (size, maskable = false) => sharp(Buffer.from(square(maskable))).resize(size, size).flatten({ background: "#f6f4ee" }).png().toBuffer();
for (const size of [16, 32, 48, 96]) await writeFile(`${dir}/favicon-${size}.png`, await png(size));
for (const size of [152, 167, 180]) await writeFile(`${dir}/apple-touch-icon-${size}.png`, await png(size));
for (const size of [192, 512]) {
  await writeFile(`${dir}/android-chrome-${size}.png`, await png(size));
  await writeFile(`${dir}/maskable-${size}.png`, await png(size, true));
}
await writeFile(`${dir}/logo-512.png`, await png(512));
for (const size of [70, 150, 310]) await writeFile(`${dir}/mstile-${size}.png`, await png(size, true));
await sharp(await png(150, true)).extend({ left: 80, right: 80, top: 0, bottom: 0, background: "#f6f4ee" }).png().toFile(`${dir}/mstile-310x150.png`);
// ICO directory with independent PNG payloads; multi-size support in current browsers and Windows.
const sizes = [16, 24, 32, 48, 64];
const frames = await Promise.all(sizes.map((size) => png(size)));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const at = 6 + 16 * i;
  header[at] = sizes[i]; header[at + 1] = sizes[i];
  header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(frame.length, at + 8); header.writeUInt32LE(offset, at + 12);
  offset += frame.length;
});
await writeFile("public/favicon.ico", Buffer.concat([header, ...frames]));
await writeFile("public/site.webmanifest", JSON.stringify({
  id: "/mg-group/", name: "MG Group | مجموعة إم جي", short_name: "MG Group",
  description: "هندسة وتركيب وتشغيل مدن الملاهي. Amusement park engineering, installation and operations.",
  lang: "ar", dir: "rtl", start_url: "/mg-group/", scope: "/mg-group/", display: "standalone",
  background_color: "#f6f4ee", theme_color: "#102d40", categories: ["business"],
  icons: [192, 512].flatMap((size) => [
    { src: `/mg-group/icons/android-chrome-${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" },
    { src: `/mg-group/icons/maskable-${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "maskable" },
  ]),
}, null, 2) + "\n");
await writeFile("public/browserconfig.xml", `<?xml version="1.0" encoding="utf-8"?>\n<browserconfig><msapplication><tile><square70x70logo src="/mg-group/icons/mstile-70.png"/><square150x150logo src="/mg-group/icons/mstile-150.png"/><wide310x150logo src="/mg-group/icons/mstile-310x150.png"/><square310x310logo src="/mg-group/icons/mstile-310.png"/><TileColor>#102d40</TileColor></tile></msapplication></browserconfig>\n`);
console.log("Created SVG, 5-frame ICO, 16 PNG icons, manifest and legacy tile configuration.");
