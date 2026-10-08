"use client";
import { useState } from 'react';
import { Expand, Minus, Plus } from 'lucide-react';
import ProgressiveImage from "./ProgressiveImage";
import { salalahProgramme, type VisualAsset } from '@/data/project-visuals';

export function VisualCaption({ visual }: { visual: VisualAsset }) {
  return <span className="pair"><span lang="ar" dir="rtl">{visual.ar}</span><span className="en" lang="en" dir="ltr">{visual.en}</span></span>;
}
export function VisualImage({ visual, className = '', full = false, interactive = false }: { visual: VisualAsset; className?: string; full?: boolean; interactive?: boolean }) {
  return <ProgressiveImage key={`${visual.src}-${full}`} className={className} src={`/mg-group/${visual.src}`} sizes="(max-width: 900px) 92vw, 56vw" alt={visual.alt} full={full} interactive={interactive} />;
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
      <div style={{ width: `${zoom*100}%` }}><VisualImage visual={visual} full={zoom > 1} interactive /></div>
    </div>
    {visual.kind === 'plan' && <ol className="programme-key">{salalahProgramme.map(([ar,en])=><li key={en}><span lang="ar" dir="rtl">{ar}</span><small lang="en">{en}</small></li>)}</ol>}
  </>;
}

export { default } from './ParkMedia';
