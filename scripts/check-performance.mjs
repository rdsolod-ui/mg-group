import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const registry = JSON.parse(await readFile('src/data/optimized-media.json', 'utf8'));
let count = 0;
for (const [source, entry] of Object.entries(registry)) {
  assert.equal(sha(await readFile(`public/${source}`)), entry.sourceSha256, `Stale derivative: ${source}`);
  assert.equal(entry.variants.length, 6);
  for (const variant of entry.variants) {
    const bytes = await readFile(`out/${variant.src}`), meta = await sharp(bytes).metadata();
    assert.equal(sha(bytes), variant.sha256, variant.src);
    assert.equal(bytes.length, variant.bytes);
    assert.equal(meta.width, variant.width);
    assert(variant.src.includes(variant.sha256.slice(0, 12)), 'Immutable filename must match content');
    assert(Math.abs(meta.width / meta.height - entry.width / entry.height) < .01, 'Preserve aspect ratio');
    count++;
  }
}
const hero = registry['visuals/v2/skazka.webp'].variants.find(v => v.width === 960 && v.format === 'avif');
assert(hero.bytes < 120000, '960px hero exceeds 120 KB delivery budget');
const flag = JSON.parse(await readFile('src/data/optimized-flag.json', 'utf8'));
assert.equal(sha(await readFile(`out/${flag.src}`)), flag.sha256);
assert(flag.bytes < 10000, 'Compact flag exceeds 10 KB');
for (const [slug, bytes] of Object.entries(JSON.parse(await readFile('src/data/model-sizes.json', 'utf8')))) {
  assert.equal((await stat(`out/rides/${slug}.glb`)).size, bytes, 'Model download label must match real bytes');
}
const font = (await readdir('out/optimized')).find(name => name.endsWith('.woff2'));
assert(font && (await stat(`out/optimized/${font}`)).size < 120000);
assert(font.includes(sha(await readFile(`out/optimized/${font}`)).slice(0, 12)));
console.log(`PASS: ${count} aspect-preserving image derivatives, source hashes, hero budget, flag, subset font and six exact model sizes`);
