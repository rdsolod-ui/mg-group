import assert from 'node:assert/strict';
import fs from 'node:fs';
import {distanceKm,globePoint,routePoint,moscowHub} from '../src/components/globe-geometry.ts';
const close=(a,b,t=.01)=>assert(Math.abs(a-b)<t,`${a} != ${b}`);
close(distanceKm({lat:0,lng:0},{lat:0,lng:90}),10007.557221);
close(distanceKm({lat:51.5074,lng:-.1278},{lat:40.7128,lng:-74.006}),5570.23,.1);
close(distanceKm(moscowHub,moscowHub),0);
const locations=JSON.parse(fs.readFileSync('src/data/project-locations.json','utf8'));
const expected={skazka:2,'leo-tolstoy':15,vdnkh:15,izmaylovo:22,ohta:635,'minny-gorodok':6429,'al-haffa':4537,airport:50,blagoveshchensk:5625,nizwa:4007,riyam:3972};
for(const[id,p]of Object.entries(locations)){
 assert.equal(Math.round(distanceKm(moscowHub,p)),expected[id]);close(distanceKm(moscowHub,p),distanceKm(p,moscowHub));
 for(const t of [0,.25,.5,.75,1])assert(Math.hypot(...routePoint(moscowHub,p,t))>=1.0089);
 const endpoint=routePoint(moscowHub,p,1),target=globePoint(p,1.009);endpoint.forEach((v,i)=>close(v,target[i],1e-8));
}
const html=fs.readFileSync('out/index.html','utf8');
assert(html.includes('id="globe"'));assert.equal((html.match(/data-route="/g)||[]).length,11);
assert(!/aria-label="(?:Pause motion|Resume motion|Pause chart animation|Play model animation|Pause model animation|Replay map flight)"/.test(html));
console.log('PASS: known great-circle distances, eleven Moscow routes, endpoints above Earth and automatic animation controls');
