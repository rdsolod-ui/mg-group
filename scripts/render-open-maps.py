from pathlib import Path
import json,math,html
for f in Path('public/maps').glob('*.json'):
 data=json.loads(f.read_text(encoding='utf-8'));lon,lat=data['center']; paths=[]
 def layer(e):
  t=e['tags']
  return 3 if 'highway' in t else 2 if 'building' in t else 1 if 'waterway' in t else 0
 for e in sorted(data['features'],key=layer):
  t=e['tags']; pts=[((x-lon)*111320*math.cos(math.radians(lat)),(lat-y)*111320) for x,y in e['points']]
  if min(x for x,y in pts)>850 or max(x for x,y in pts)<-850 or min(y for x,y in pts)>600 or max(y for x,y in pts)<-600:continue
  points=' '.join(f'{600+x*.72:.1f},{400+y*.72:.1f}' for x,y in pts)
  closed=e['points'][0]==e['points'][-1]
  fill='#153b3d' if closed else 'none'; stroke='#24504e'; width=1
  if t.get('natural')=='water' or 'waterway' in t:fill='#0a253f' if closed else 'none';stroke='#266084';width=2
  if 'building' in t:fill='#355566';stroke='#78949c';width=.65
  if 'highway' in t:
   fill='none'; major=t['highway'] in ['motorway','trunk','primary','secondary','tertiary'];stroke='#d4b285' if major else '#709199';width=3.5 if major else 1
  tag='polygon' if closed and 'highway' not in t else 'polyline'
  paths.append(f'<{tag} points="{points}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linejoin="round"/>')
 svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><title>OpenStreetMap site plan</title><rect width="1200" height="800" fill="#102e3c"/>'+''.join(paths)+'</svg>'
 f.with_suffix('.svg').write_text(svg,encoding='utf-8')
 print(f.stem,len(paths),len(svg))
