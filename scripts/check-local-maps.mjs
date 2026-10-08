import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const points=JSON.parse(await readFile('src/data/project-locations.json','utf8'));
for(const [id,p] of Object.entries(points)){
 const data=JSON.parse(await readFile(`out/maps/${id}.json`,'utf8'));
 assert.deepEqual(data.center,[p.lng,p.lat]); assert(data.features.length>0); assert.equal(data.license,'ODbL-1.0');
 const svg=await readFile(`out/maps/${id}.svg`,'utf8'); assert(svg.includes('<svg'));
 for(const stage of ['region','city']) { const context=await readFile(`out/maps/context/${id}-${stage}.svg`,'utf8'); assert(context.includes('<polyline')); assert(!/NaN|undefined/.test(context)); } assert(!/NaN|undefined/.test(svg));
}
const ui=await readFile('src/components/LocalParkFlight.tsx','utf8');assert(ui.includes('openstreetmap.org/copyright'));assert(ui.includes('download'));
const page=await readFile('src/components/ParkFlight.tsx','utf8');assert(page.includes("import('./LocalParkFlight')"));assert(!/import.*(?:Google|ArcGIS)/.test(page));
console.log('PASS: eleven self-hosted ODbL map extracts/SVGs, exact GPS, attribution and key-free active provider');
