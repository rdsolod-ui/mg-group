'use client';
import {useState} from 'react';
import {Expand} from 'lucide-react';
import ParkFlight from './ParkFlight';
import SkazkaSlider from './SkazkaSlider';
import AttractionVideo from './AttractionVideo';
import {VisualImage,VisualCaption} from './ProjectVisual';
import {projectVisuals} from '@/data/project-visuals';
const tabs=[['map','الخريطة','Map'],['photos','الصور','Photographs'],['video','الفيديو','Video']];
const videos=[['boomerang','Boomerang'],['chain','Sky carousel'],['drop-tower','Drop tower'],['condor','Condor'],['lightning','Lightning'],['disco','Galaxy']];
export default function ParkMedia({id,onExpand,paused,active,reduced}:{id:string;onExpand:(index?:number)=>void;paused:boolean;active:boolean;reduced:boolean}){
 const [mode,setMode]=useState('map'),[index,setIndex]=useState(0),[video,setVideo]=useState('boomerang');
 const assets=projectVisuals[id],visual=assets[index];
 return <div className="visual case-visual standardized-media" data-project-media={id}>
  <div className="project-media-tabs" role="tablist" aria-label={`${id} media`} data-media-controls onKeyDown={event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();event.stopPropagation();const current=tabs.findIndex(t=>t[0]===mode);
   const next=event.key==='Home'?0:event.key==='End'?2:(current+(event.key==='ArrowRight'?1:2))%3;
   setMode(tabs[next][0]);(event.currentTarget.children[next] as HTMLButtonElement).focus();
  }}>{tabs.map(([key,ar,en])=><button key={key} id={`${id}-tab-${key}`} type="button" role="tab" aria-selected={mode===key} aria-controls={`${id}-media-panel`} tabIndex={mode===key?0:-1} onClick={()=>setMode(key)}><span lang="ar" dir="rtl">{ar}</span><small lang="en">{en}</small></button>)}</div>
  <div id={`${id}-media-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mode}`} tabIndex={0} className="project-media-panel" data-media-mode={mode}>
   {mode==='map'?<ParkFlight id={id} active={active} paused={paused} reduced={reduced}/>:mode==='photos'?
    id==='skazka'?<SkazkaSlider active={active} paused={paused} reduced={reduced} onExpand={onExpand}/>:<>
     <button className="masterplan-image-button unified-photo" onClick={()=>onExpand(index)} aria-label={`Expand ${visual.alt}`}><VisualImage visual={visual}/><span className="image-expand"><Expand size={20}/></span></button>
     {assets.length>1&&<div className="project-photo-thumbs" data-media-controls>{assets.map((asset,i)=><button key={asset.src} aria-label={asset.alt} aria-pressed={index===i} onClick={()=>setIndex(i)}><img src={`/mg-group/${asset.src}`} alt="" loading="lazy"/><small>{i+1}</small></button>)}</div>}
     <p className="visual-source-note"><VisualCaption visual={visual}/></p>
    </>:id==='al-haffa'?<AttractionVideo slug="salalah" title="Salalah Eye" paused={paused||!active} visible={active} mediaBase="/mg-group/films/salalah" framed={false}/>:id==='skazka'?<>
     <AttractionVideo key={video} slug={video} title={videos.find(v=>v[0]===video)![1]} paused={paused||!active} visible={active} framed={false}/>
     <div className="project-video-select" data-media-controls>{videos.map(([slug,title])=><button key={slug} aria-pressed={video===slug} onClick={()=>setVideo(slug)}>{title}</button>)}</div>
    </>:<div className="project-video-empty"><span lang="ar" dir="rtl">لم يُضَف فيديو لهذا المشروع بعد</span><small lang="en">Video for this project has not been added yet.</small></div>}
  </div>
 </div>;
}
