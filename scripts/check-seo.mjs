// Validate the exported crawler response, not React metadata configuration alone.
import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";
import sharp from "sharp";
import { createHash } from "node:crypto";
const root = process.argv[2] || "out";
const origin = "https://marketing.parkskazka.ru";
const canonical = `${origin}/mg-group/`;
const html = await readFile(`${root}/index.html`, "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
assert(head, "Metadata must be present in the initial static HTML head");
const decode = (s) => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'");
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
const metas = [...head.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]));
const links = [...head.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]));
const get = (key) => metas.filter((m) => (m.name || m.property) === key).map((m) => m.content);
for (const key of ["description", "application-name", "author", "creator", "publisher", "referrer", "robots", "googlebot", "og:title", "og:description", "og:url", "og:site_name", "og:locale", "og:type", "twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"])
  assert.equal(get(key).length, 1, `Exactly one ${key}`);
assert.equal(get("og:type")[0], "website");
assert.equal(get("og:url")[0], canonical);
assert.equal(get("twitter:card")[0], "summary_large_image");
assert(get("robots")[0].includes("max-image-preview:large"));
assert(!get("robots")[0].includes("noindex"));
assert.equal(links.filter((l) => l.rel === "canonical").length, 1);
assert.equal(links.find((l) => l.rel === "canonical").href, canonical);
assert(html.includes('<html lang="ar" dir="rtl"'));
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.equal(links.filter((l) => l.hreflang).length, 0, "No fictional language routes for one bilingual URL");
assert.equal(get("og:image").length, 2);
assert.equal(get("og:image:alt").length, 2);
for (const key of ["og:image", "og:image:secure_url", "twitter:image"])
  for (const url of get(key)) assert(url.startsWith(`${canonical}social/`) && !url.includes("?"), key);
for (const [name, height] of [["og", 630], ["card", 600], ["square", 1200]]) {
  const file = `${root}/social/mg-group-${name}-v2.jpg`;
  const meta = await sharp(file).metadata();
  assert.equal(meta.width, 1200); assert.equal(meta.height, height); assert.equal(meta.format, "jpeg");
  assert((await stat(file)).size < 350_000, `Preview byte budget: ${name}`);
}
const provenance = JSON.parse(await readFile("src/data/social-provenance.json", "utf8"));
assert.equal(provenance.classification, "generated-concept");
for (const variant of provenance.variants) {
  const bytes = await readFile(`${root}/${variant.path}`);
  assert.equal(bytes.length, variant.bytes);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), variant.sha256);
}
const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(graph["@context"], "https://schema.org");
const nodes = graph["@graph"];
const ids = nodes.map((n) => n["@id"]);
assert.equal(new Set(ids).size, nodes.length);
const walk = (node) => {
  if (!node || typeof node !== "object") return;
  if (Object.keys(node).length === 1 && node["@id"]) assert(ids.includes(node["@id"]), `Unresolved graph reference ${node["@id"]}`);
  for (const value of Object.values(node)) if (Array.isArray(value)) value.forEach(walk); else walk(value);
};
walk(graph);
const organization = nodes.find((n) => n["@type"] === "Organization");
assert.equal(organization.address.streetAddress, "Осенняя улица, 23");
assert.equal(organization.contactPoint.telephone, "+96896100010");
assert(!("numberOfEmployees" in organization), "Technical team is not confirmed company headcount");
assert.equal(nodes.filter((n) => n["@type"] === "Service").length, 4);
for (const service of nodes.filter((n) => n["@type"] === "Service")) assert(html.includes(`id="${service.url.split("#")[1]}"`));
for (const fragment of ["proof", "ride-models", "globe", "contact"]) assert(html.includes(`href="#${fragment}"`));
assert(!/aggregateRating|reviewCount|foundingDate/.test(JSON.stringify(graph)), "No unsupported structured claims");
const manifestLink = links.find((l) => l.rel === "manifest");
assert.equal(manifestLink.href, "/mg-group/site.webmanifest");
const manifest = JSON.parse(await readFile(`${root}/site.webmanifest`, "utf8"));
for (const key of ["id", "start_url", "scope"]) assert.equal(manifest[key], "/mg-group/");
for (const icon of manifest.icons) {
  const size = Number(icon.sizes.split("x")[0]);
  const meta = await sharp(`${root}/${icon.src.replace("/mg-group/", "")}`).metadata();
  assert.equal(meta.width, size); assert.equal(meta.height, size);
  assert.equal(meta.hasAlpha, false, "App icons must be opaque");
}
assert(manifest.icons.some((i) => i.purpose === "maskable" && i.sizes === "512x512"));
for (const link of links.filter((l) => ["icon", "apple-touch-icon", "mask-icon"].includes(l.rel))) {
  assert(link.href.startsWith("/mg-group/"));
  assert((await stat(`${root}/${link.href.replace("/mg-group/", "")}`)).size > 0);
}
for (const size of [16, 32, 48, 96]) {
  const meta = await sharp(`${root}/icons/favicon-${size}.png`).metadata(); assert.equal(meta.width, size); assert.equal(meta.height, size);
}
for (const size of [152, 167, 180]) assert(links.some((l) => l.rel === "apple-touch-icon" && l.sizes === `${size}x${size}`));
const ico = await readFile(`${root}/favicon.ico`);
assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 5);
for (let i = 0; i < 5; i++) {
  const entry = 6 + i * 16; const size = ico.readUInt32LE(entry + 8); const offset = ico.readUInt32LE(entry + 12);
  const meta = await sharp(ico.subarray(offset, offset + size)).metadata(); assert.equal(meta.width, ico[entry]); assert.equal(meta.height, ico[entry + 1]);
}
const sitemap = await readFile(`${root}/sitemap.xml`, "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, 1); assert(sitemap.includes(`<loc>${canonical}</loc>`));
assert(!sitemap.includes("#"));
const notFound = await readFile(`${root}/404.html`, "utf8");
assert(/name="robots" content="noindex"/.test(notFound));
console.log("PASS: static SEO metadata, 3 previews, JSON-LD graph, canonical sitemap, crawler links and complete icon/manifest kit");
