import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const source=process.argv[2];if(!source)throw new Error('Supply the original export folder');
const manifest=JSON.parse(await readFile(path.join(source,'sources.json'),'utf8'));
const output='public/maps/satellite';await mkdir(output,{recursive:true});
for(const frame of manifest.frames){
 frame.files=[];
 for(const width of [640,1280]){
  const file=`${frame.id}-${frame.stage}-${width}.webp`;
  const bytes=await sharp(path.join(source,`${frame.id}-${frame.stage}.jpg`)).resize(width,width*9/16).webp({quality:width===640?70:86}).toBuffer();
  await writeFile(path.join(output,file),bytes);
  frame.files.push({path:file,width,height:width*9/16,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 }
}
await writeFile(path.join(output,'sources.json'),JSON.stringify(manifest,null,2));
await writeFile(path.join(output,'credits.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MG Group · Satellite imagery credits</title><style>body{font:17px/1.6 system-ui;max-width:760px;margin:50px auto;padding:24px;background:#102d40;color:#eef5f7}a{color:#ffbb84}</style><h1>Satellite imagery credits</h1><p>${manifest.attribution}</p><p>${manifest.copyright}</p><p>Map images are the intellectual property of Esri and its licensors and are used in this corporate presentation under the <a href="${manifest.terms}">static-map terms</a>. They are not licensed as open data or offered for unrestricted redistribution.</p><p>${manifest.acquisitionDate}</p><p>${manifest.scope}</p><p>Planet: NASA/GSFC, Reto Stöckli, Blue Marble imagery.</p><p><a href="sources.json">Source metadata and image hashes</a></p><p><a href="../../">Return to MG Group</a></p></html>`);
console.log('Optimized',manifest.frames.length,'satellite frames in two resolutions');
