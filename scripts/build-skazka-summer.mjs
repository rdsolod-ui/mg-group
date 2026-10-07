// Run with the production task folder and the imagegen output folder as arguments.
import sharp from 'sharp';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const [task,generated]=process.argv.slice(2);
if(!task||!generated)throw new Error('Expected task directory and generation directory');
const hash=b=>createHash('sha256').update(b).digest('hex');
const items=[
 ['wheel','koleso-obozreniya','exec-b3f5d1a2-5d48-43ae-b266-3e81bf7be0de.png'],
 ['boomerang','bumerang','exec-4973bc80-6f7f-4c63-a332-f8a13214bfae.png'],
 ['lightning','molniya','exec-48362f08-c13a-4bf8-857a-19255bb2440e.png'],
 ['sky-carousel','nebesnaya-karusel','exec-7bc01c37-bd23-4383-b904-93a721b304b1.png'],
 ['galaxy','galaktika','exec-482d8cf8-04d3-4a85-9056-45d284e91676.png'],
 ['kraken','kraken','exec-c2378ff7-179e-409a-88ce-ac2492596e1c.png'],
];
const sources=JSON.parse(await readFile(path.join(task,'source-register.json'),'utf8'));
const registry=JSON.parse(await readFile('src/data/optimized-media.json','utf8'));
const provenance=JSON.parse(await readFile('src/data/visual-provenance.json','utf8')).filter(p=>!p.id.startsWith('skazka-summer-'));
await mkdir(path.join(task,'renders'),{recursive:true});
await mkdir('public/visuals/skazka-summer',{recursive:true});
const register=[];
for(const [id,sourceId,file] of items){
 const input=await readFile(path.join(generated,file));
 await copyFile(path.join(generated,file),path.join(task,'renders',id+'.png'));
 const original=sources.find(s=>s.id===sourceId);
 const p={id:'skazka-summer-'+id,kind:'ai_edited_photograph',sourceFile:file,sourceSHA256:hash(input),description:'AI-enhanced official park photography. Summer weather, vegetation and visitors edited; not documentary evidence of attendance.',variants:[]};
 for(const thumb of [false,true]){
  const buffer=await sharp(input).resize(thumb?240:1536).webp({quality:thumb?68:90,effort:5}).toBuffer();
  const src=`visuals/skazka-summer/${id}${thumb?'-thumb':''}.webp`,meta=await sharp(buffer).metadata();
  await writeFile('public/'+src,buffer);
  p.variants.push({path:src,width:meta.width,height:meta.height,bytes:buffer.length,sha256:hash(buffer)});
  if(thumb)continue;
  const preview=await sharp(buffer).resize(24).webp({quality:30}).toBuffer();
  const entry={sourceSha256:hash(buffer),width:meta.width,height:meta.height,preview:'data:image/webp;base64,'+preview.toString('base64'),variants:[]};
  for(const width of [640,960,1536])for(const format of ['avif','webp']){
   const bytes=await sharp(buffer).resize(width)[format]({quality:format==='avif'?48:73,effort:5}).toBuffer();
   const variant=`optimized/${id}-${hash(bytes).slice(0,12)}-${width}.${format}`;
   await writeFile('public/'+variant,bytes);
   entry.variants.push({width,format,src:variant,bytes:bytes.length,sha256:hash(bytes)});
  }
  registry[src]=entry;
 }
 provenance.push(p);
 register.push({id,sourcePage:original.page,sourceUrl:original.sourceUrl,sourceSha256:original.sourceSha256,generationFile:file,generationSha256:hash(input),published:p.variants});
 console.log(id,p.variants.map(v=>`${v.width}px ${v.bytes} bytes`).join(', '));
}
await writeFile('src/data/optimized-media.json',JSON.stringify(registry));
await writeFile('src/data/visual-provenance.json',JSON.stringify(provenance,null,2)+'\n');
await writeFile('docs/skazka-summer-sources.json',JSON.stringify(register,null,2)+'\n');
