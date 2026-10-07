"use client";
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import registry from '@/data/optimized-media.json';
import { useNetwork } from './NetworkPreferences';
import MediaLoading from './MediaLoading';
const images: Record<string, (typeof registry)[keyof typeof registry]> = registry;
export default function ProgressiveImage({ src, alt, sizes = '(max-width: 900px) 92vw, 56vw', className = '', priority = false, full = false, interactive = true, onReady, onFailure }: { src: string; alt: string; sizes?: string; className?: string; priority?: boolean; full?: boolean; interactive?: boolean; onReady?:()=>void; onFailure?:()=>void }) {
  const key = src.replace(/^\/mg-group\//, ''), image = images[key];
  const network = useNetwork();
  const box = useRef<HTMLSpanElement>(null), img = useRef<HTMLImageElement>(null);
  const [near, setNear] = useState(priority || full);
  const [state, setState] = useState<'waiting' | 'loaded' | 'error'>('waiting');
  const [attempt, setAttempt] = useState(0);
  useEffect(()=>{if(state==='loaded')onReady?.();},[state,onReady]);
  useEffect(()=>{if(state==='error')onFailure?.();},[state,onFailure]);
  useEffect(() => {
    if (near || !box.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setNear(true); observer.disconnect(); } }, { rootMargin: network.economy ? '0px' : '100px' });
    observer.observe(box.current); return () => observer.disconnect();
  }, [near, network.economy]);
  useEffect(() => {
    if (!near || state !== 'waiting') return;
    if (img.current?.complete && img.current.naturalWidth > 24) { setState('loaded'); return; }
    const timer = setTimeout(() => setState('error'), 30000);
    return () => clearTimeout(timer);
  }, [near, state, attempt]);
  if (!image) return <img src={src} alt={alt} className={className} loading={priority ? 'eager' : 'lazy'} />;
  const active = near && state !== 'error';
  const variants = image.variants.filter(v => !network.economy || v.width === 640);
  const set = (format: string) => variants.filter(v => v.format === format).map(v => `/mg-group/${v.src} ${v.width}w`).join(', ');
  const fallback = variants.find(v => v.format === 'webp')!;
  const actual = full ? `/mg-group/${key}` : `/mg-group/${fallback.src}`;
  return <span ref={box} className={`progressive-media ${className}`} data-load-state={state} style={{ '--media-preview': `url("${image.preview}")`, '--media-ratio': `${image.width}/${image.height}` } as CSSProperties}>
    <picture key={`${key}-${attempt}`}>
      {!full && active && <source type="image/avif" srcSet={set('avif')} sizes={sizes}/>}
      <img ref={img} src={active ? actual : image.preview} srcSet={active && !full ? set('webp') : undefined} sizes={sizes} width={image.width} height={image.height} alt={alt} fetchPriority={priority ? 'high' : 'low'} decoding="async" onLoad={event => { if (active && event.currentTarget.naturalWidth > 24) setState('loaded'); }} onError={() => setState('error')}/>
    </picture>
    {near && state === 'waiting' && !priority && <MediaLoading/>}
    {state === 'error' && <span className="media-error" role="status"><span lang="ar" dir="rtl">تعذّر تحميل الصورة<small lang="en" dir="ltr">Image unavailable. Text remains available.</small></span>{interactive && <button type="button" onClick={() => { setState('waiting'); setAttempt(v => v + 1); }}>إعادة المحاولة / Retry</button>}</span>}
    <noscript><img src={`/mg-group/${fallback.src}`} alt={alt} width={image.width} height={image.height} loading={priority ? 'eager' : 'lazy'} /></noscript>
  </span>;
}
