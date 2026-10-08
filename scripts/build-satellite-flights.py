"""Bounded static Esri exports for the eleven owner-supplied portfolio locations.
Marketing presentation images; retain Esri attribution and provider rights.
Original exports stay outside the public repository. No runtime tile/API dependency.
"""
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urlencode
from datetime import datetime,timezone
import json,math,hashlib,sys

points=json.loads(Path('src/data/project-locations.json').read_text())
cache=Path(sys.argv[1]);cache.mkdir(parents=True,exist_ok=True)
service='https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
terms='https://doc.arcgis.com/en/arcgis-online/reference/static-maps.htm'
credits='Source: Esri, Vantor, Earthstar Geographics, and the GIS User Community'
records=[]
for key,p in points.items():
 for stage,ground_width in [('region',120000),('city',16000),('location',1600)]:
  lat,lon=p['lat'],p['lng'];radius=6378137
  cx=radius*math.radians(lon);cy=radius*math.log(math.tan(math.pi/4+math.radians(lat)/2))
  width=ground_width/math.cos(math.radians(lat));height=width*9/16
  bbox=[cx-width/2,cy-height/2,cx+width/2,cy+height/2]
  query=dict(bbox=','.join(str(x) for x in bbox),bboxSR=3857,imageSR=3857,size='2048,1152',format='jpg',transparent='false',f='image')
  url=service+'/export?'+urlencode(query)
  file=cache/f'{key}-{stage}.jpg'
  if not file.exists():
   with urlopen(Request(url,headers={'User-Agent':'MGGroupPresentation/1.0'}),timeout=60) as response:data=response.read()
   assert data.startswith(b'\xff\xd8'),f'Image unavailable: {key}/{stage}'
   file.write_bytes(data)
  data=file.read_bytes()
  assert len(data)>10000
  records.append(dict(id=key,stage=stage,center=[lon,lat],groundWidthMeters=ground_width,bbox3857=bbox,request=url,sourceSha256=hashlib.sha256(data).hexdigest()))
  print(key,stage,len(data),flush=True)
manifest=dict(provider='Esri World Imagery',attribution=credits,terms=terms,copyright='Map images © 2026 Esri and its licensors. All rights reserved.',retrievedAt=datetime.now(timezone.utc).isoformat(),acquisitionDate='Composite imagery; acquisition dates vary. Retrieval date is not acquisition date.',scope='Static geographic context for MG Group marketing presentation. Owner-supplied GPS is not a surveyed boundary. Images do not establish project completion.',frames=records)
(cache/'sources.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
