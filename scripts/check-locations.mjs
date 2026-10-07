import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const locations = JSON.parse(await readFile('src/data/project-locations.json', 'utf8'));
const source = JSON.parse(await readFile('src/data/source-register.json', 'utf8'));
const expected = [
  ['skazka',55.77149167507881,37.43412735237241],
  ['leo-tolstoy',55.893357043936994,37.45923248637098],
  ['vdnkh',55.82675421281442,37.62643620586514],
  ['izmaylovo',55.7946795763556,37.74847414233548],
  ['ohta',60.12729734811739,30.44686841004293],
  ['minny-gorodok',43.12176756665061,131.94065326536736],
  ['al-haffa',17.000459845300245,54.104987453823455],
  ['airport',55.41437426053603,37.90019188081303],
  ['blagoveshchensk',50.25663240061146,127.53443384787141],
];
const html = await readFile('out/index.html', 'utf8');
assert.equal(source.projects.length,9);
assert.equal(Object.keys(locations).length,9);
for(const [id,lat,lng] of expected) {
  assert.deepEqual([locations[id].lat,locations[id].lng],[lat,lng]);
  const p=source.projects.find(p=>p.id===id);
  assert.deepEqual([p.ownerCoordinates.lat,p.ownerCoordinates.lng],[lat,lng]);
  assert(html.includes(`query=${lat}%2C${lng}`),`Exact Google Maps link missing: ${id}`);
}
const planned=source.projects.find(p=>p.id==='blagoveshchensk');
assert.equal(planned.stageInSource,'planned');
assert.equal(planned.metrics.attractions.value,1);
for(const key of ['investment','visitation','staff'])assert.equal(planned.metrics[key].value,null,'Unknown is not zero');
const operating=source.projects.filter(p=>['skazka','leo-tolstoy','vdnkh','izmaylovo','ohta'].includes(p.id));
assert.equal(operating.reduce((sum,p)=>sum+p.metrics.attractions.value,0),95,'Planned wheel is excluded from operating rides');
assert(html.includes('Not yet built'));
console.log('PASS: nine exact owner GPS points and public links; planned wheel separated from 95 operating rides');
