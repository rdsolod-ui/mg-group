import json, math, urllib.request, urllib.parse, time
from pathlib import Path
locations=json.loads(Path('src/data/project-locations.json').read_text())
out=Path('public/maps');out.mkdir(exist_ok=True)
for key,p in locations.items():
 target=out/(key+'.json')
 if target.exists():continue
 dy=.006; dx=dy/math.cos(math.radians(p['lat']))
 bbox=f"{p['lat']-dy},{p['lng']-dx},{p['lat']+dy},{p['lng']+dx}"
 query=f'[out:json][timeout:30];way[~"^(highway|building|leisure|natural|waterway|landuse)$"~"."]({bbox});out tags geom;'
 request=urllib.request.Request('https://overpass-api.de/api/interpreter',data=urllib.parse.urlencode({'data':query}).encode(),headers={'User-Agent':'MGGroupMapBuild/1.0'})
 try:
  with urllib.request.urlopen(request,timeout=50) as r:data=json.load(r)
  features=[{'id':e['id'],'tags':e.get('tags',{}),'points':[[v['lon'],v['lat']] for v in e['geometry']]} for e in data['elements'] if len(e.get('geometry',[]))>1]
  if not features:raise ValueError('No features')
  target.write_text(json.dumps({'license':'ODbL-1.0','attribution':'OpenStreetMap contributors','date':'2026-10-08','center':[p['lng'],p['lat']],'features':features},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
  print(key,len(features),target.stat().st_size,flush=True)
 except Exception as e:
  print(key,type(e).__name__,str(e),flush=True)
  if getattr(e,'code',None)==429:break
