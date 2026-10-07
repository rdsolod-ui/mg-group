// Reproducible delivery derivatives; original evidence images stay untouched.
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const digest = b => createHash('sha256').update(b).digest('hex');
await mkdir('public/optimized', { recursive: true });
const registry = {};
for (const dir of ['visuals/v2', 'visuals/chapters', 'visuals/skazka-summer']) {
  for (const file of await readdir(`public/${dir}`)) {
    if (!file.endsWith('.webp') || /-(640|960|thumb)\.webp$/.test(file) || file === 'earth-day.webp') continue;
    const source = `${dir}/${file}`, input = await readFile(`public/${source}`);
    const meta = await sharp(input).metadata();
    const preview = await sharp(input).resize(24).webp({ quality: 30 }).toBuffer();
    const entry = { sourceSha256: digest(input), width: meta.width, height: meta.height, preview: `data:image/webp;base64,${preview.toString('base64')}`, variants: [] };
    for (const width of [640, 960, Math.min(1920, meta.width)]) {
      for (const format of ['avif', 'webp']) {
        const buffer = await sharp(input).resize({ width, withoutEnlargement: true })[format]({ quality: format === 'avif' ? 48 : 73, effort: 5 }).toBuffer();
        const filename = `optimized/${path.parse(file).name}-${digest(buffer).slice(0, 12)}-${width}.${format}`;
        await writeFile(`public/${filename}`, buffer);
        entry.variants.push({ width, format, src: filename, bytes: buffer.length, sha256: digest(buffer) });
      }
    }
    registry[source] = entry;
  }
}
const flag = await sharp('public/flags/oman.jpg').resize(640).webp({ quality: 88 }).toBuffer();
const flagPath = `optimized/oman-${digest(flag).slice(0, 12)}.webp`;
await writeFile(`public/${flagPath}`, flag);
await writeFile('src/data/optimized-media.json', JSON.stringify(registry));
await writeFile('src/data/optimized-flag.json', JSON.stringify({ src: flagPath, sha256: digest(flag), bytes: flag.length }));
console.log(`${Object.keys(registry).length} images optimized; Oman flag ${flag.length} bytes`);
