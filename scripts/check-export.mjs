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
const visualRecords = JSON.parse(fs.readFileSync('src/data/visual-provenance.json', 'utf8'));
for (const record of visualRecords) {
  for (const variant of record.variants) {
    const bytes = fs.readFileSync(path.join(root, variant.path));
    if (bytes.length !== variant.bytes || crypto.createHash('sha256').update(bytes).digest('hex') !== variant.sha256)
      throw Error(`Visual asset mismatch: ${variant.path}`);
  }
}
if (html.includes('media/al-haffa/1.webp') || html.includes('media/skazka/1.webp')) throw Error('Legacy case imagery is still rendered');
if (!html.includes('Original project photography') || !html.includes('Generated masterplan visualization')) throw Error('Visual provenance captions missing');
const filmRoot=path.join(root,'films/salalah');
for (const resolution of [360,720,1080]) {
  const playlist=fs.readFileSync(path.join(filmRoot,`${resolution}p/index.m3u8`),'utf8');
  const durations=[...playlist.matchAll(/#EXTINF:([\d.]+)/g)].map(m=>Number(m[1]));
  if (Math.abs(durations.reduce((a,b)=>a+b,0)-24)>.05 || !playlist.includes('#EXT-X-ENDLIST')) throw Error('Incomplete Salalah film');
  for (const segment of playlist.split(/\r?\n/).filter(l=>l&&!l.startsWith('#'))) {
    if (!/^seg-\d+\.ts$/.test(segment) || !fs.statSync(path.join(filmRoot,`${resolution}p`,segment)).size) throw Error('Missing Salalah film segment');
  }
}
console.log(`PASS: ${visualRecords.length} classified visual assets and 24-second adaptive Salalah film`);
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
for (const slug of ["chain", "drop-tower", "condor", "lightning", "disco"]) {
  const dir = path.join(root, "ride-videos", slug);
  const master = fs.readFileSync(path.join(dir, "master.m3u8"), "utf8");
  const variants = master.split(/\r?\n/).filter(line => line && !line.startsWith("#"));
  if (!master.startsWith("#EXTM3U") || variants.length !== 3 || !master.includes("#EXT-X-INDEPENDENT-SEGMENTS"))
    throw Error(`Invalid adaptive master: ${slug}`);
  for (const variant of variants) {
    if (!/^(360|720|1080)p\/index\.m3u8$/.test(variant)) throw Error(`Unexpected video variant: ${variant}`);
    const playlist = fs.readFileSync(path.join(dir, variant), "utf8");
    const segments = playlist.split(/\r?\n/).filter(line => line && !line.startsWith("#"));
    if (!playlist.includes("#EXT-X-ENDLIST") || !segments.length) throw Error(`Incomplete video: ${slug}/${variant}`);
    for (const segment of segments) {
      if (!/^seg-\d+\.ts$/.test(segment)) throw Error(`Unexpected media path: ${segment}`);
      const file = path.join(dir, path.dirname(variant), segment);
      const bytes = fs.readFileSync(file);
      if (bytes.length < 188 || bytes[0] !== 0x47 || bytes.length % 188) throw Error(`Invalid transport stream: ${file}`);
    }
  }
  for (const file of ["fallback.mp4", "poster.webp"])
    if (fs.statSync(path.join(dir, file)).size < 1000) throw Error(`Missing media: ${slug}/${file}`);
  console.log(`PASS: ${slug}, adaptive 360p/720p/1080p, local segments and MP4 fallback`);
}
const phone = fs.readFileSync(path.join(root, "device/iphone-landscape.webp"));
if (phone.toString("utf8", 8, 12) !== "WEBP") throw Error("Missing Blender device frame");
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
