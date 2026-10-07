import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { chartSectors, chartPhase, focusDuration, introDuration } from '../src/components/chart-assembly.ts';
const source = JSON.parse(await readFile('src/data/source-register.json', 'utf8'));
const values = [
  ['skazka', 'leo-tolstoy', 'vdnkh', 'izmaylovo', 'ohta'].map(id => source.projects.find(p => p.id === id).metrics.attractions.value),
  [source.ownerUpdate.engineeringTeam.engineers, source.ownerUpdate.engineeringTeam.mechanics],
  ['Russia', 'Oman'].map(country => source.projects.filter(p => p.country === country).length),
];
for (const [index, data] of values.entries()) {
  const sectors = chartSectors(data.map((value, i) => ({ id: String(i), value, ar: '', en: '' })));
  const total = data.reduce((a, b) => a + b, 0);
  assert.equal(total, [95, 64, 9][index], 'Approved source total');
  assert(Math.abs(sectors.at(-1).end - sectors[0].start - 2 * Math.PI) < 1e-12);
  for (let i = 0; i < data.length; i++) {
    assert(Math.abs((sectors[i].end - sectors[i].start) / (2 * Math.PI) - data[i] / total) < 1e-12, 'Small slices retain true angle');
    if (i) assert.equal(sectors[i].start, sectors[i - 1].end, 'No overlap or omitted share');
  }
  const cycle = introDuration + data.length * focusDuration + 2;
  const seen = new Set();
  for (let t = 0; t < cycle * 2; t += .017) {
    const p = chartPhase(t, data.length);
    assert(p.lift >= 0 && p.lift <= 1 && p.assembly >= 0 && p.assembly <= 1);
    if (p.focus >= 0) seen.add(p.focus);
  }
  assert.equal(seen.size, data.length, 'Every category appears in the loop');
  const before = chartPhase(cycle - 1e-5, data.length), after = chartPhase(cycle + 1e-5, data.length);
  assert(Math.abs(before.assembly - after.assembly) < 1e-6 && before.lift === after.lift, 'No loop-seam jump');
}
console.log('PASS: 95/64/9 source totals, exact sector proportions, all focus phases and continuous loop seams');
const posters = JSON.parse(await readFile('src/data/chart-posters.json', 'utf8'));
assert.equal(Object.keys(posters).length, 3);
for (const variants of Object.values(posters)) for (const poster of Object.values(variants)) {
  const bytes = await readFile('out/' + poster.src), hash = createHash('sha256').update(bytes).digest('hex');
  const meta = await sharp(bytes).metadata();
  assert.equal(hash, poster.sha256); assert(poster.src.includes(hash.slice(0,12)));
  assert.equal(bytes.length, poster.bytes); assert(bytes.length < 40000);
  assert(meta.hasAlpha && meta.width === poster.width && meta.height === poster.height);
}
console.log('PASS: six transparent chart posters, content hashes and <40 KB per-image budget');
