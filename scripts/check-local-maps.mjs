import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const points=JSON.parse(await readFile('src/data/project-locations.json','utf8'));
const satellite=JSON.parse(await readFile('out/maps/satellite/sources.json','utf8'));
assert.equal(satellite.frames.length,33);
assert.equal(satellite.provider,'Esri World Imagery');
assert(satellite.attribution.includes('Esri'));
for(const [id,p] of Object.entries(points)){
 const data=JSON.parse(await readFile(`out/maps/${id}.json`,'utf8'));
 assert.deepEqual(data.center,[p.lng,p.lat]); assert(data.features.length>0); assert.equal(data.license,'ODbL-1.0');
 const svg=await readFile(`out/maps/${id}.svg`,'utf8'); assert(svg.includes('<svg'));
 for(const size of [640,1280]) {
  let bytes=(await stat(`out/maps/flight/${id}-planet.webp`)).size;
  for(const stage of ['region','city','location']) {
   const frame=satellite.frames.find(f=>f.id===id&&f.stage===stage);assert(frame);
   assert.deepEqual(frame.center,[p.lng,p.lat]);
   const [a,b,c,d]=frame.bbox3857;assert(Math.abs((c-a)/(d-b)-16/9)<1e-6);
   const x=6378137*p.lng*Math.PI/180,y=6378137*Math.log(Math.tan(Math.PI/4+p.lat*Math.PI/360));
   assert(Math.abs((a+c)/2-x)<1e-5&&Math.abs((b+d)/2-y)<1e-5);
   const file=frame.files.find(f=>f.width===size);assert(file);
   const data=await readFile(`out/maps/satellite/${file.path}`);
   assert.equal(createHash('sha256').update(data).digest('hex'),file.sha256);
   assert.equal(data.length,file.bytes);bytes+=data.length;
  }
  assert(bytes<(size===640?350000:1200000),`${id}: flight download budget exceeded (${bytes})`);
 }
 for(const stage of ['region','city']) { const context=await readFile(`out/maps/context/${id}-${stage}.svg`,'utf8'); assert(context.includes('<polyline')); assert(!/NaN|undefined/.test(context)); } assert(!/NaN|undefined/.test(svg));
}
const ui=await readFile('src/components/LocalParkFlight.tsx','utf8');assert(ui.includes('Esri, Vantor'));assert(ui.includes('/maps/satellite/credits.html'));
const page=await readFile('src/components/ParkFlight.tsx','utf8');assert(page.includes("import('./LocalParkFlight')"));assert(!/import.*(?:Google|ArcGIS)/.test(page));
console.log('PASS: eleven GPS-centred satellite flights, 33 source frames/66 verified derivatives, download budgets, provider credits; ODbL source maps preserved');
