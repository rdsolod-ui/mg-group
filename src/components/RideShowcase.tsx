"use client";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Pause, Play, RotateCcw } from "lucide-react";
const Viewer = dynamic(() => import("./RideViewer"), { ssr: false });
const rides = [
  { slug: "wheel", ar: "عجلة المشاهدة", en: "Observation wheel", detail: "Cabins remain upright", detailAr: "تبقى المقصورات في وضع رأسي" },
  { slug: "chain", ar: "الأراجيح الدوّارة", en: "Swing carousel", detail: "Suspended seats · rotating canopy", detailAr: "مقاعد معلّقة ومظلة دوّارة" },
  { slug: "drop-tower", ar: "برج السقوط", en: "Drop tower", detail: "Vertical carriage movement", detailAr: "حركة العربة الرأسية" },
  { slug: "condor", ar: "كوندور", en: "Condor", detail: "Rotating upper assembly", detailAr: "مجموعة علوية دوّارة" },
  { slug: "typhoon", ar: "تايفون", en: "Typhoon", detail: "Track & structure study", detailAr: "دراسة المسار والهيكل" },
  { slug: "lightning", ar: "مولنيا", en: "Lightning", detail: "Track & support structure", detailAr: "المسار وهيكل الدعامات" },
];
class ModelBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function RideShowcase({ paused, reduced }: { paused: boolean; reduced: boolean }) {
  const [index, setIndex] = useState(0), [near, setNear] = useState(false), [visible, setVisible] = useState(false), [ready, setReady] = useState(false), [error, setError] = useState(false), [localPause, setLocalPause] = useState(false), [reset, setReset] = useState(0);
  const stage = useRef<HTMLDivElement>(null), ride = rides[index];
  useEffect(() => { const io = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setNear(true); }, { threshold: .15 }); if (stage.current) io.observe(stage.current); return () => io.disconnect(); }, []);
  const onReady = useCallback(() => setReady(true), []), onError = useCallback(() => setError(true), []);
  const choose = (i: number) => { setIndex(i); setReady(false); setError(false); setReset(v => v + 1); };
  return <div className="ride-showcase">
    <div className="ride-title"><div><p lang="ar" dir="rtl">الهندسة، من كل زاوية.</p><h2>Engineering. From every angle.</h2></div><span className="ride-model-label">3D / {String(index + 1).padStart(2, "0")}</span></div>
    <div className="ride-layout">
      <div className="ride-stage" ref={stage} aria-label={`${ride.en} ${error ? "rendered preview" : "interactive 3D model"}`}>
        <img className={`ride-poster ${ready && !error ? "is-loaded" : ""}`} src={`/mg-group/rides/${ride.slug}-poster.webp`} alt={`${ride.en} — rendered from the supplied model in Blender`} loading="lazy" />
        {near && <ModelBoundary key={`${ride.slug}-${reset}`} onError={onError}><Viewer key={`${ride.slug}-${reset}`} slug={ride.slug} paused={paused || reduced || localPause || !visible} onReady={onReady} /></ModelBoundary>}
        {!ready && !error && near && <div className="ride-loading" role="status">جارٍ تحميل النموذج · Loading model</div>}
        {!error && <div className="ride-stage-footer"><span lang="ar" dir="rtl">اسحب للتدوير · مرّر للتكبير<span lang="en" dir="ltr">Drag to orbit · Scroll to zoom</span></span><div>
          <button aria-label={localPause ? "Play model animation" : "Pause model animation"} onClick={() => setLocalPause(v => !v)} disabled={reduced || paused}>{localPause || reduced || paused ? <Play size={18} /> : <Pause size={18} />}</button>
          <button aria-label="Reset model view" onClick={() => { setReset(v => v + 1); setReady(false); setError(false); }}><RotateCcw size={18} /></button>
        </div></div>}
      </div>
      <div className="ride-selector" aria-label="Choose an attraction">{rides.map((r, i) => <button key={r.slug} aria-pressed={i === index} onClick={() => choose(i)}><span className="ride-number">0{i + 1}</span><span lang="ar" dir="rtl">{r.ar}<span lang="en" dir="ltr">{r.en}</span></span><span className="ride-arrow" aria-hidden="true">↗</span></button>)}</div>
    </div>
    <div className="ride-caption"><span lang="ar" dir="rtl">{ride.detailAr}<span lang="en" dir="ltr">{ride.detail}</span></span><p lang="ar" dir="rtl">تصوّرات من نماذج التصميم. الحركة توضيحية.<span lang="en" dir="ltr">Visualisations from design models. Motion is illustrative.</span></p></div>
  </div>;
}
