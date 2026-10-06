"use client";
import { useEffect, useRef, useState } from 'react';
import { Expand, Minus, Plus } from 'lucide-react';
import AttractionVideo from './AttractionVideo';
import { projectVisuals, salalahProgramme, type VisualAsset } from '@/data/project-visuals';

export function VisualCaption({ visual }: { visual: VisualAsset }) {
  return <span className="pair"><span lang="ar" dir="rtl">{visual.ar}</span><span className="en" lang="en" dir="ltr">{visual.en}</span></span>;
}
export function VisualImage({ visual, className = '', full = false }: { visual: VisualAsset; className?: string; full?: boolean }) {
  return <img className={className} src={`/mg-group/${visual.src}`} srcSet={full ? undefined : [640,960].map(w => `/mg-group/${visual.src.replace('.webp', `-${w}.webp`)} ${w}w`).join(', ') + `, /mg-group/${visual.src} ${visual.kind === 'plan' ? 3300 : visual.kind === 'photo' ? 2400 : 1672}w`} sizes="(max-width: 900px) 92vw, 56vw" alt={visual.alt} loading="lazy" />;
}
export function VisualInspector({ visual }: { visual: VisualAsset }) {
  const [zoom, setZoom] = useState(1);
  return <>
    <div className="visual-zoom-controls" data-media-controls>
      <button onClick={() => setZoom(v => Math.max(1, v - .5))} disabled={zoom === 1} aria-label="Zoom out"><Minus size={18}/></button>
      <button onClick={() => setZoom(1)} aria-label="Reset image zoom">{Math.round(zoom*100)}%</button>
      <button onClick={() => setZoom(v => Math.min(3, v + .5))} disabled={zoom === 3} aria-label="Zoom in"><Plus size={18}/></button>
      <span lang="ar" dir="rtl">كبّر لاستكشاف التفاصيل <small lang="en" dir="ltr">Zoom to explore details</small></span>
    </div>
    <div className={`visual-inspector ${zoom > 1 ? 'is-zoomed' : ''}`} tabIndex={0} aria-label="Masterplan detail viewer, scroll to explore when zoomed">
      <div style={{ width: `${zoom*100}%` }}><VisualImage visual={visual} full /></div>
    </div>
    {visual.kind === 'plan' && <ol className="programme-key">{salalahProgramme.map(([ar,en])=><li key={en}><span lang="ar" dir="rtl">{ar}</span><small lang="en">{en}</small></li>)}</ol>}
  </>;
}

export default function ProjectVisual({ id, onExpand, paused }: { id: string; onExpand: (index?: number) => void; paused: boolean }) {
  const [mode, setMode] = useState('photo');
  const ref=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});observer.observe(node);return()=>observer.disconnect();},[]);
  const salalah=id==='al-haffa';
  const index=mode==='concept'?3:mode==='plan'?4:0;
  const visual=projectVisuals[id][index];
  return <div ref={ref} className={`visual case-visual masterplan-visual ${salalah?'salalah-visual':''}`}>
    {salalah && <div className="project-media-tabs" data-media-controls aria-label="Salalah project media">
      {[['photo','صور الموقع','Site photos'],['film','الفيلم','Site film'],['concept','تصوّر التطوير','Development'],['plan','المخطط','Programme plan']].map(([key,ar,en])=><button key={key} aria-pressed={mode===key} onClick={()=>setMode(key)}><span lang="ar" dir="rtl">{ar}</span><small lang="en">{en}</small></button>)}
    </div>}
    {salalah && mode==='film' ? <div className="site-film">
      <AttractionVideo slug="salalah" title="Salalah Eye" paused={paused} visible={visible} mediaBase="/mg-group/films/salalah" framed={false} />
      <p className="visual-source-note"><span lang="ar" dir="rtl">لقطات درون حقيقية من أرشيف المشروع — سبتمبر وأكتوبر ٢٠٢٦.</span><span lang="en">Original project drone footage — September–October 2026.</span></p>
    </div> : <>
      <figure><button className="masterplan-image-button" onClick={()=>onExpand(index)} aria-label={`Explore ${id} images and masterplan`}><VisualImage visual={visual}/><span className="image-expand"><Expand size={20}/></span></button><figcaption><VisualCaption visual={visual}/></figcaption></figure>
      <button className="gallery-open" onClick={()=>onExpand(index)}><span className="pair"><span lang="ar" dir="rtl">استكشف الصور والتفاصيل</span><span className="en" lang="en">Explore images & details</span></span><Expand size={17}/></button>
    </>}
  </div>;
}
