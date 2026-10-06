"""MG Group landscape video device — deterministic native Blender product model.
This is an original illustrative modern iPhone-like shell, not an Apple CAD file.
The display is intentionally open geometry so browser video can sit behind it.
"""
from pathlib import Path
import bpy, math, json, sys
from mathutils import Vector

ROOT=Path(__file__).resolve().parent
MODE=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else 'preview'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.unit_settings.system='METRIC'
scene.unit_settings.scale_length=1.0

def mat(name,color,metal=0,rough=.3,coat=0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    for key,value in {'Base Color':(*color,1),'Metallic':metal,'Roughness':rough,'Coat Weight':coat,'Coat Roughness':.12,'IOR':1.47}.items():
        p.inputs[key].default_value=value
    return m

titanium=mat('Titanium — fine satin natural',(.40,.365,.31),1,.24)
n=titanium.node_tree.nodes; links=titanium.node_tree.links
tex=n.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value=1650; tex.inputs['Detail'].default_value=2
coord=n.new('ShaderNodeTexCoord'); mapping=n.new('ShaderNodeMapping'); mapping.inputs['Scale'].default_value=(1,120,1)
links.new(coord.outputs['Generated'],mapping.inputs['Vector']); links.new(mapping.outputs['Vector'],tex.inputs['Vector'])
ramp=n.new('ShaderNodeMapRange'); ramp.inputs['From Min'].default_value=0; ramp.inputs['From Max'].default_value=1; ramp.inputs['To Min'].default_value=.21; ramp.inputs['To Max'].default_value=.28
links.new(tex.outputs['Fac'],ramp.inputs['Value']); links.new(ramp.outputs['Result'],n['Principled BSDF'].inputs['Roughness'])
polished=mat('Diamond-cut chamfer',(.68,.62,.53),1,.105)
glass=mat('Obsidian ceramic glass border',(.004,.005,.006),0,.11,1)
gasket=mat('Display gasket',(.007,.008,.009),0,.7)
dark=mat('Speaker / sensor black',(.0015,.002,.0025),0,.3)
lens=mat('Sapphire camera lens',(.008,.018,.026),1,.075,.7)
ant=mat('Antenna polymer',(.15,.148,.14),0,.5)

def outline(w,h,r,n=48):
    pts=[]
    for cx,cy,start in [(w/2-r,h/2-r,0),(-w/2+r,h/2-r,90),(-w/2+r,-h/2+r,180),(w/2-r,-h/2+r,270)]:
        for j in range(n+1):
            a=math.radians(start+j*90/n)
            pts.append((cx+r*math.cos(a),cy+r*math.sin(a)))
    return pts

def loft(name,profile,materials,segment_mats=None,closed=True):
    verts=[]
    for w,h,r,z in profile:
        verts.extend([(x,y,z) for x,y in outline(w,h,r)])
    count=len(outline(*profile[0][:3])); faces=[]; mids=[]
    steps=len(profile) if closed else len(profile)-1
    for k in range(steps):
        for j in range(count):
            a=k*count+j; b=k*count+(j+1)%count; c=((k+1)%len(profile))*count+(j+1)%count; d=((k+1)%len(profile))*count+j
            faces.append((a,b,c,d)); mids.append(segment_mats[k] if segment_mats else 0)
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); scene.collection.objects.link(obj)
    for m in materials: mesh.materials.append(m)
    for p,mi in zip(mesh.polygons,mids): p.material_index=mi; p.use_smooth=True
    # Recalculate consistent normals in the isolated task scene.
    bpy.context.view_layer.objects.active=obj; obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT'); obj.select_set(False)
    return obj

body=loft('GEO-titanium-continuous-chassis',[
 (.1618,.0778,.0134,-.0041),(.1629,.0789,.01395,-.0036),
 (.1632,.0792,.0141,-.0030),(.1632,.0792,.0141,.0015),
 (.16285,.07885,.01392,.0025),(.1617,.0777,.01335,.00335),
 (.1567,.0722,.0112,.00335),(.1567,.0722,.0112,-.0041)
],[titanium,polished,gasket],[1,0,0,1,1,0,2,0])
border=loft('GEO-ceramic-glass-border',[
 (.16155,.07755,.0133,.00337),(.1613,.0773,.0132,.00365),
 (.16075,.07675,.01295,.00390),(.1567,.0722,.0112,.00390),
 (.1567,.0722,.0112,.00337)
],[glass,gasket],[0,0,0,1,1])
for polygon in border.data.polygons:
    if 392 <= polygon.index < 588:
        polygon.use_smooth=False
# A nearly invisible bright inner edge gives the glass physical thickness.
loft('GEO-display-inner-bevel',[(.15688,.07238,.01129,.00390),(.1567,.0722,.0112,.00386),(.1567,.0722,.0112,.00379),(.15688,.07238,.01129,.00379)],[glass])

def rounded_solid(name,w,h,d,r,location,material,edge=.00010):
    rings=[(w-2*edge,h-2*edge,max(.00001,r-edge),-d/2),(w,h,r,-d/2+edge),(w,h,r,d/2-edge),(w-2*edge,h-2*edge,max(.00001,r-edge),d/2)]
    obj=loft(name,rings,[material],closed=False)
    # close planar ends with ngon (outer contour is convex)
    count=len(outline(w,h,r)); me=obj.data
    vv=[tuple(v.co) for v in me.vertices]; ff=[tuple(p.vertices) for p in me.polygons]
    ff.extend([tuple(reversed(range(count))),tuple(range(3*count,4*count))])
    new=bpy.data.meshes.new(name+'-closed'); new.from_pydata(vv,[],ff); new.materials.append(material); new.update(); obj.data=new
    for p in new.polygons: p.use_smooth=len(p.vertices)==4
    obj.location=location
    return obj

# Landscape-left sensor island, with three optically distinct apertures.
rounded_solid('GEO-dynamic-island',.00515,.0185,.00028,.002575,(-.0735,0,.00404),dark,.00008)
def disc(name,x,y,z,r,material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64,ring_count=24,radius=1,location=(x,y,z))
    o=bpy.context.object; o.name=name; o.scale=(r,r,.000075); o.data.materials.append(material)
    for p in o.data.polygons:p.use_smooth=True
    return o
disc('GEO-camera-optical-ring',-.0735,-.0057,.004225,.00163,glass)
disc('GEO-camera-sapphire',-.0735,-.0057,.00425,.00116,lens)
disc('GEO-camera-inner-pupil',-.0735,-.0057,.00431,.00052,dark)
disc('GEO-infrared-sensor',-.0735,.00485,.00423,.0012,glass)
rounded_solid('GEO-earpiece-slot',.00043,.0115,.0001,.00021,(-.0791,0,.00398),dark,.00002)
# Fine earpiece mesh glints, not a featureless drawn line.
for j in range(34):
    rounded_solid('GEO-earpiece-mesh-%02d'%j,.00027,.00006,.00004,.000025,(-.0791,-.0053+j*.00032,.00405),titanium,.000008)

# Side controls catch narrow edge highlights in exact front orthographic view.
rounded_solid('GEO-volume-up',.0105,.0011,.0026,.00052,(-.027,.03965,-.0001),titanium,.00012)
rounded_solid('GEO-volume-down',.0105,.0011,.0026,.00052,(-.0128,.03965,-.0001),titanium,.00012)
rounded_solid('GEO-action-button',.0065,.0011,.0023,.00052,(-.046,.03965,-.0001),titanium,.00010)
rounded_solid('GEO-power-button',.018,.00105,.0026,.00050,(-.006,-.03965,-.0001),titanium,.00012)
rounded_solid('GEO-camera-control',.0145,.00105,.0026,.00050,(.040,-.03965,-.0001),titanium,.00012)

# Antenna breaks are dark inset polymer strips following the front lip.
for x in [-.0575,.0575]:
    for y in [-.03903,.03903]:
        rounded_solid('GEO-antenna-seam',.00062,.00078,.00010,.00016,(x,y,.00287),ant,.000025)

def aim(obj,point):obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
def area(name,loc,power,sx,sy,color,target=(0,0,0)):
    d=bpy.data.lights.new(name,'AREA'); d.energy=power; d.shape='RECTANGLE'; d.size=sx; d.size_y=sy; d.color=color
    o=bpy.data.objects.new(name,d); scene.collection.objects.link(o); o.location=loc; aim(o,target)
area('LGT-long-softbox-upper',(-.035,.12,.16),1.4,.22,.035,(1,.965,.91))
area('LGT-cool-strip-bottom',(.02,-.095,.10),.65,.24,.018,(.84,.91,1))
area('LGT-left-edge',(-.17,.025,.055),.8,.025,.15,(1,.97,.91))
area('LGT-right-edge',(.14,-.02,.085),1.0,.018,.17,(1,1,1))
area('LGT-front-soft-reflection',(.01,.005,.28),.04,.18,.11,(1,1,1))
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value=(.32,.35,.4,1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=.08

cd=bpy.data.cameras.new('CAM-orthographic-web-registration'); camera=bpy.data.objects.new(cd.name,cd); scene.collection.objects.link(camera)
camera.location=(0,0,.5); camera.rotation_euler=(0,0,0); cd.type='ORTHO'; cd.ortho_scale=.174; cd.clip_start=.001; cd.clip_end=10; scene.camera=camera
# Blender camera looks along local -Z; neutral rotation gives exact front registration.
scene.render.engine='CYCLES'; scene.cycles.device='CPU'; scene.cycles.samples=256
scene.cycles.use_adaptive_sampling=True; scene.cycles.adaptive_threshold=.009; scene.cycles.adaptive_min_samples=32
scene.cycles.use_denoising=True; scene.cycles.denoiser='OPENIMAGEDENOISE'; scene.cycles.max_bounces=10
scene.render.resolution_x=2400; scene.render.resolution_y=1240; scene.render.resolution_percentage=100
scene.render.film_transparent=True; scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGBA'; scene.render.image_settings.color_depth='16'
scene.view_settings.view_transform='AgX'; scene.view_settings.look='AgX - Medium High Contrast'; scene.view_settings.exposure=0
scene.render.threads_mode='FIXED'; scene.render.threads=6
scene['design_note']='Original iPhone-like presentation shell. Display deliberately open for native HTML video. Not manufacturing CAD.'
scene['screen_width_m']=.1567; scene['screen_height_m']=.0722; scene['screen_radius_m']=.0112
scene['web_orthographic_width_m']=.174
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'iphone-landscape.blend'))
if MODE=='preview':
    scene.cycles.samples=48; scene.cycles.adaptive_threshold=.025; scene.render.resolution_percentage=50
scene.render.filepath=str(ROOT/('iphone-preview.png' if MODE=='preview' else 'iphone-landscape.png'))
bpy.ops.render.render(write_still=True)
width=2400; height=1240; cam_width=.174; cam_height=cam_width*height/width
spec={'schemaVersion':1,'asset':'iphone-landscape.webp','width':width,'height':height,'projection':'orthographic-front','screen':{'left':(cam_width-.1567)/2/cam_width,'top':(cam_height-.0722)/2/cam_height,'width':.1567/cam_width,'height':.0722/cam_height,'cornerRadiusX':.0112/.1567,'cornerRadiusY':.0112/.0722},'screenPixels':{'left':(cam_width-.1567)/2/cam_width*width,'top':(cam_height-.0722)/2/cam_height*height,'width':.1567/cam_width*width,'height':.0722/cam_height*height,'cornerRadius':.0112/cam_width*width},'videoFit':'contain','island':'landscape-left; rendered in alpha foreground; video must remain below frame','blenderVersion':bpy.app.version_string,'engine':'CYCLES','samples':256,'adaptiveThreshold':.009,'denoise':'OPENIMAGEDENOISE','transparentDisplay':True,'modelStatus':'Original illustrative modern iPhone-like shell, not official product CAD'}
(ROOT/'iphone-landscape.json').write_text(json.dumps(spec,indent=2),encoding='utf-8')
print('PHONE_RENDER_COMPLETE',MODE,scene.render.filepath)
