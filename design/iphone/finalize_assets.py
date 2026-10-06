"""Convert the verified Blender RGBA render without modifying its geometry or pixels."""
from pathlib import Path
from PIL import Image, ImageDraw
import json, hashlib, shutil
ROOT=Path(__file__).resolve().parent
PUBLIC=ROOT.parents[1]/'public/device'
PUBLIC.mkdir(parents=True,exist_ok=True)
im=Image.open(ROOT/'iphone-landscape.png').convert('RGBA')
assert im.size==(2400,1240)
spec=json.loads((ROOT/'iphone-landscape.json').read_text())
s=spec['screen']
spec['playerSpec']={'src':'/device/iphone-landscape.webp','aspectRatio':spec['width']/spec['height'],'screen':{'left':s['left']*100,'top':s['top']*100,'width':s['width']*100,'height':s['height']*100,'radius':f"{s['cornerRadiusX']*100:.10f}% / {s['cornerRadiusY']*100:.10f}%"}}
im.save(PUBLIC/'iphone-landscape.webp',format='WEBP',lossless=True,quality=100,method=6,exact=True)
loaded=Image.open(PUBLIC/'iphone-landscape.webp').convert('RGBA')
assert loaded.size==im.size
assert loaded.getchannel('A').tobytes()==im.getchannel('A').tobytes()
assert loaded.tobytes()==im.tobytes(), 'Lossless conversion must preserve RGBA pixels'
samples={'outside_top_left':(0,0),'outside_bottom_right':(2399,1239),'display_center':(1200,620),'display_left_clear':(500,620),'display_right_clear':(1950,620),'upper_glass_bezel':(1200,104),'camera_island':(186,620)}
alpha={name:im.getpixel(point)[3] for name,point in samples.items()}
for name in ['outside_top_left','outside_bottom_right','display_center','display_left_clear','display_right_clear']:assert alpha[name]==0,(name,alpha[name])
assert alpha['upper_glass_bezel']>250,alpha
assert alpha['camera_island']>250,alpha
spec['alphaVerified']=True
(ROOT/'iphone-landscape.json').write_text(json.dumps(spec,indent=2),encoding='utf-8')
shutil.copy2(ROOT/'iphone-landscape.json',PUBLIC/'iphone-landscape.json')
qa=Image.new('RGBA',im.size,(16,20,25,255)); draw=ImageDraw.Draw(qa)
cell=56
for y in range(0,im.height,cell):
 for x in range(0,im.width,cell):
  if (x//cell+y//cell)%2:draw.rectangle((x,y,x+cell,y+cell),fill=(26,31,38,255))
qa=Image.alpha_composite(qa,im);qa.save(ROOT/'alpha-registration-proof.png')
receipt={'status':'PASS','image':{'width':im.width,'height':im.height,'mode':'RGBA'},'sampleAlpha':alpha,'losslessRGBAEquality':True,'publicFiles':[]}
for path in [PUBLIC/'iphone-landscape.webp',PUBLIC/'iphone-landscape.json']:
 receipt['publicFiles'].append({'file':str(path),'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(ROOT/'qa-receipt.json').write_text(json.dumps(receipt,indent=2),encoding='utf-8')
print(json.dumps({'playerSpec':spec['playerSpec'],'qa':receipt},indent=2))
