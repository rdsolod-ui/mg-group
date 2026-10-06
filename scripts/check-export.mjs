import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root = "out";
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const ids = [
  "intro",
  "proof",
  "engineering",
  "ride-models",
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
for (const slug of ["wheel", "chain", "drop-tower", "condor", "typhoon", "lightning"]) {
  const data = fs.readFileSync(path.join(root, "rides", `${slug}.glb`));
  if (data.toString("utf8", 0, 4) !== "glTF" || data.readUInt32LE(4) !== 2 || data.readUInt32LE(8) !== data.length)
    throw Error(`Invalid GLB: ${slug}`);
  const gltf = JSON.parse(data.toString("utf8", 20, 20 + data.readUInt32LE(12)).trim());
  if (!gltf.meshes?.length || !gltf.images?.length) throw Error(`Missing geometry/textures: ${slug}`);
  if (!gltf.extensionsUsed?.includes("KHR_draco_mesh_compression")) throw Error(`Uncompressed model: ${slug}`);
  if (["wheel", "chain", "drop-tower", "condor"].includes(slug) && !gltf.animations?.length)
    throw Error(`Missing assembly animation: ${slug}`);
  if (gltf.buffers.some(buffer => buffer.uri) || gltf.images.some(image => image.uri)) throw Error(`External model dependency: ${slug}`);
  const poster = fs.readFileSync(path.join(root, "rides", `${slug}-poster.webp`));
  if (poster.toString("utf8", 8, 12) !== "WEBP") throw Error(`Invalid poster: ${slug}`);
  console.log(`PASS: ${slug}, ${(data.length / 1048576).toFixed(2)} MiB, ${gltf.meshes.length} meshes, ${gltf.animations?.length || 0} animation clips`);
}
for (const file of ["draco_decoder.wasm", "draco_wasm_wrapper.js", "LICENSE.txt"])
  if (!fs.statSync(path.join(root, "decoders/draco", file)).size) throw Error(`Missing decoder: ${file}`);
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
