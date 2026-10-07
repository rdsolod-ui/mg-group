'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { skazkaSlides as slides } from '@/data/skazka-slides';
import ProgressiveImage from './ProgressiveImage';
import ParkFlight from './ParkFlight';
import { ProjectCapacity } from './MotionCharts';
import { useNetwork } from './NetworkPreferences';

export default function SkazkaSlider({active,paused,reduced,onExpand}:{active:boolean;paused:boolean;reduced:boolean;onExpand:(index?:number)=>void}) {
  const [index,setIndex]=useState(0),[shown,setShown]=useState(0),[ready,setReady]=useState(-1);
  const [visible,setVisible]=useState(false),[hover,setHover]=useState(false),[focus,setFocus]=useState(false);
  const [failed,setFailed]=useState<number|null>(null),[attempts,setAttempts]=useState<Record<number,number>>({});
  const root=useRef<HTMLDivElement>(null),touch=useRef<{x:number;y:number}|null>(null);
  const network=useNetwork();
  const choose=useCallback((next:number)=>{setIndex((next+slides.length)%slides.length);setReady(-1);setFailed(null);},[]);
  useEffect(()=>{const node=root.current;if(!node)return;const io=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.25});io.observe(node);return()=>io.disconnect();},[]);
  useEffect(()=>{if(ready!==index||index===shown)return;const timer=setTimeout(()=>setShown(index),reduced?0:850);return()=>clearTimeout(timer);},[ready,index,shown,reduced]);
  const running=active&&visible&&!paused&&!reduced&&!network.economy&&network.online&&!hover&&!focus&&index===shown&&ready===index;
  useEffect(()=>{if(!running)return;const timer=setTimeout(()=>choose(index+1),7500);return()=>clearTimeout(timer);},[running,index,choose]);
  const next=Array.from({length:4},(_,i)=>(index+i+1)%slides.length);
  const displayed=ready===index?index:shown;
  return <div ref={root} className="visual case-visual skazka-slider" role="region" aria-roledescription="carousel" aria-label="Skazka Park summer attraction gallery" data-slide={index} data-shown={shown} data-slider-running={running} data-slider-state={!active?'inactive':!visible?'offscreen':paused?'suspended':reduced?'reduced-motion':network.economy?'save-data':!network.online?'offline':hover?'hover':focus?'focus':index!==shown||ready!==index?'loading':'running'} data-media-controls
    onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    onFocusCapture={()=>setFocus(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setFocus(false);}}
    onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();event.stopPropagation();choose(index+(event.key==='ArrowRight'?1:-1));}}}>
    <div className="skazka-slider-grid">
      <div className="skazka-next" aria-label="Next four photographs">
        {next.map((n,slot)=><button key={slot} type="button" data-preview={n} onClick={()=>choose(n)} aria-label={`Show ${slides[n].en} photograph`}><img src={`/mg-group/${slides[n].thumb}`} width={240} height={160} alt="" loading="lazy" decoding="async"/><span lang="ar" dir="rtl">{slides[n].ar}<small lang="en" dir="ltr">{slides[n].en}</small></span></button>)}
      </div>
      <div className="skazka-feature">
        <ParkFlight id="skazka" active={active} paused={paused} reduced={reduced}>
          <button type="button" className="skazka-slide-image" onClick={()=>onExpand(displayed)} aria-label={`Expand ${slides[displayed].en} summer photograph`}
            onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}}
            onTouchEnd={e=>{if(!touch.current)return;const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;touch.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){e.preventDefault();choose(index+(dx<0?1:-1));}}}>
            {[...new Set([shown,index])].map(n=><span key={`${slides[n].id}-${attempts[n]||0}`} className={`skazka-frame ${n===shown||ready===n?'is-visible':''}`} style={{zIndex:n===index?1:0}} aria-hidden={n!==displayed}>
              <ProgressiveImage src={`/mg-group/${slides[n].visual.src}`} alt={slides[n].visual.alt} sizes="(max-width: 600px) 74vw, (max-width:900px) 78vw, 45vw" interactive={false} onReady={()=>{if(n===index)setReady(n);}} onFailure={()=>{if(n===index)setFailed(n);}}/>
            </span>)}
            <span className="image-expand"><Expand size={19}/></span>
          </button>
        </ParkFlight>
        {failed===index&&<div className="skazka-load-error" role="status"><span lang="ar" dir="rtl">تعذّر تحميل الصورة التالية<small lang="en" dir="ltr">The next photograph could not load.</small></span><button type="button" onClick={()=>{setFailed(null);setAttempts(a=>({...a,[index]:(a[index]||0)+1}));}}>إعادة المحاولة / Retry</button></div>}
        <div className="skazka-slide-footer">
          <div className="skazka-slide-name"><span lang="ar" dir="rtl">{slides[displayed].ar}</span><span lang="en">{slides[displayed].en}</span></div>
          <div className="skazka-slide-navigation"><span dir="ltr" aria-label={`Photograph ${displayed+1} of ${slides.length}`}>{String(displayed+1).padStart(2,'0')}<small> / {String(slides.length).padStart(2,'0')}</small></span><button type="button" onClick={()=>choose(index-1)} aria-label="Previous Skazka photograph"><ArrowLeft size={19}/></button><button type="button" onClick={()=>choose(index+1)} aria-label="Next Skazka photograph"><ArrowRight size={19}/></button></div>
        </div>
      </div>
    </div>
    <p className="skazka-slide-caption"><span lang="ar" dir="rtl">{slides[displayed].visual.ar}</span><span lang="en">{slides[displayed].visual.en}</span></p>
    <ProjectCapacity id="skazka" value={60} construction={false}/>
  </div>;
}
