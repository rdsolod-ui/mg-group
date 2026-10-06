import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root = "out";
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const ids = [
  "intro",
  "proof",
  "engineering",
  "specialists",
  "lifecycle",
  "geography",
  "skazka",
  "leo-tolstoy",
  "vdnkh",
  "izmaylovo",
  "ohta",
  "minny-gorodok",
  "al-haffa",
  "airport",
  "partnership",
  "contact",
];
for (const id of ids)
  if (!html.includes(`id="${id}"`)) throw Error(`Missing chapter ${id}`);
if (
  html.includes("/muscat-amusement-park/") ||
  html.includes("localhost") ||
  html.includes("C:\\Users")
)
  throw Error("Foreign path in HTML");
for (const file of [
  "brand/mg-group.svg",
  "brand/mg-group-white.svg",
  "brand/mg-group-mark.svg",
  "brand/al-shahiq.svg",
]) {
  const s = fs.readFileSync(path.join(root, file), "utf8");
  if (/<image|<text|<foreignObject/.test(s))
    throw Error("Logo is not all vector paths: " + file);
}
const manifest = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(file);
    else if (!["manifest.json", "revision.json"].includes(ent.name)) {
      const data = fs.readFileSync(file);
      manifest.push({
        path: path.relative(root, file).replaceAll("\\", "/"),
        bytes: data.length,
        sha256: crypto.createHash("sha256").update(data).digest("hex"),
      });
    }
  }
}
walk(root);
fs.writeFileSync(
  path.join(root, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(
  `PASS: ${ids.length} chapters, vector logos, ${manifest.length} exported files`,
);
