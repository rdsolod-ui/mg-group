import json,math,urllib.request,urllib.parse,html
from pathlib import Path
points=json.loads(Path('src/data/project-locations.json').read_text())
root=Path('public/maps/context');root.mkdir(exist_ok=True)
for key,p in points.items():
 group='moscow' if key in ['skazka','leo-tolstoy','vdnkh','izmaylovo','airport'] else key
 cache=root/(group+'.json')
 if not cache.exists():
  lat,lng=(55.7,37.6) if group=='moscow' else (p['lat'],p['lng'])
  dy=.65;dx=dy/math.cos(math.radians(lat));bbox=f'{lat-dy},{lng-dx},{lat+dy},{lng+dx}'
  q=f'[out:json][timeout:40];(way[highway~"^(motorway|trunk|primary|secondary)$"]({bbox});way[waterway=river]({bbox});way[natural=coastline]({bbox});node[place~"^(city|town)$"]({bbox}););out tags geom;'
  req=urllib.request.Request('https://overpass.kumi.systems/api/interpreter' if group=='nizwa' else 'https://overpass-api.de/api/interpreter',data=urllib.parse.urlencode({'data':q}).encode(),headers={'User-Agent':'MGGroupMapBuild/1.0'})
  try:
   with urllib.request.urlopen(req,timeout=65) as r: data=json.load(r)
   assert data['elements']
   data.update(license='ODbL-1.0',attribution='OpenStreetMap contributors',date='2026-10-08')
   cache.write_text(json.dumps(data,separators=(',',':')),encoding='utf-8')
  except Exception as e: print(group,type(e).__name__,getattr(e,'code',''),flush=True);continue
 data=json.loads(cache.read_text())
 for stage,extent in [('region',55000),('city',8500)]:
  extent=12000 if key=='nizwa' and stage=='region' else 4500 if key=='nizwa' else extent
  scale=600/extent; paths=[];labels=[]
  def xy(lon,lat):return (600+(lon-p['lng'])*111320*math.cos(math.radians(p['lat']))*scale,400+(p['lat']-lat)*111320*scale)
  for e in data['elements']:
   t=e.get('tags',{})
   if e['type']=='node':
    x,y=xy(e['lon'],e['lat']);name=t.get('name:en',t.get('name',''))
    if 40<x<1160 and 40<y<760:labels.append(f'<text x="{x:.1f}" y="{y:.1f}" fill="#d5e3e9" font-family="sans-serif" font-size="14">{html.escape(name)}</text>')
    continue
   pts=[xy(v['lon'],v['lat']) for v in e.get('geometry',[])]
   if not pts or min(x for x,y in pts)>1200 or max(x for x,y in pts)<0 or min(y for x,y in pts)>800 or max(y for x,y in pts)<0:continue
   simplified=[pts[0]]
   for point in pts[1:-1]:
    if math.dist(point,simplified[-1])>1.5:simplified.append(point)
   simplified.append(pts[-1]);pts=simplified
   if len(pts)==2 and math.dist(*pts)<.8:continue
   color='#527c93' if 'waterway' in t or 'natural' in t else '#d4b285'
   paths.append('<polyline points="'+' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)+f'" fill="none" stroke="{color}" stroke-width="{1 if stage=="region" else 1.8}"/>')
  assert paths,(key,stage)
  svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#102e3c"/>'+''.join(paths+labels)+'</svg>'
  (root/f'{key}-{stage}.svg').write_text(svg,encoding='utf-8')
 print(key,'ready',flush=True)
