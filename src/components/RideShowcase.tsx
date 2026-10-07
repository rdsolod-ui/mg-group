"use client";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Box, Film, Pause, Play, RotateCcw, ExternalLink } from "lucide-react";
import AttractionVideo from "./AttractionVideo";
import { rides } from "@/data/ride-catalogue";
import { chapterCopy, rideHooks } from "@/data/presentation-copy";
import device from "../../public/device/iphone-landscape.json";
const phone = { ...device.playerSpec, src: `/mg-group${device.playerSpec.src}` };
const Viewer = dynamic(() => import("./RideViewer"), { ssr: false });

class ModelBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function RideShowcase({ paused, reduced }: { paused: boolean; reduced: boolean }) {
  const [index, setIndex] = useState(3);
  const [mode, setMode] = useState<"film" | "model">("film");
  const [near, setNear] = useState(false), [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false), [error, setError] = useState(false);
  const [localPause, setLocalPause] = useState(false), [reset, setReset] = useState(0);
  const stage = useRef<HTMLDivElement>(null), ride = rides[index];
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting); if (entry.isIntersecting) setNear(true);
    }, { threshold: .15 });
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);
  const onReady = useCallback(() => setReady(true), []), onError = useCallback(() => setError(true), []);
  const choose = (i: number) => {
    if (i === index) return;
    setIndex(i); setMode(rides[i].video ? "film" : "model");
    setReady(false); setError(false); setReset(v => v + 1);
  };
  const show = (next: "film" | "model") => { if (next === mode) return; setMode(next); setReady(false); setError(false); };
  return <div className="ride-showcase">
    <div className="ride-title">
      <div><p lang="ar" dir="rtl">{chapterCopy["ride-models"].heading.ar}</p><h2 lang="en" dir="ltr">{chapterCopy["ride-models"].heading.en}</h2></div>
      <span className="ride-model-label" lang="en">Skazka Park · Moscow</span>
    </div>
    <div className="ride-layout">
      <div className="ride-content">
        <div className="ride-view-heading">
          <div className="ride-hook">
            <p className="ride-identity"><span lang="ar" dir="rtl">{mode === "film" ? ride.parkNameAr : ride.ar}</span><span lang="en" dir="ltr">{mode === "film" ? ride.parkName : ride.en}</span></p>
            <h3 lang="ar" dir="rtl">{rideHooks[ride.slug].ar}</h3><span lang="en" dir="ltr">{rideHooks[ride.slug].en}</span>
          </div>
          <div className="ride-view-tabs" role="group" aria-label="Attraction view">
            {ride.video && <button aria-pressed={mode === "film"} onClick={() => show("film")}><Film size={16} /><span lang="ar">فيديو المنتزه<span lang="en">Park film</span></span></button>}
            {ride.model && <button aria-pressed={mode === "model"} onClick={() => show("model")}><Box size={16} /><span lang="ar">نموذج التصميم<span lang="en">Design model</span></span></button>}
          </div>
        </div>
        <div ref={stage} className={`ride-display ${mode === "film" ? "ride-film-stage" : ""}`}>
          {mode === "film" ? <div className="ride-video-mount"><AttractionVideo slug={ride.slug} title={ride.parkName || ride.en} highPlaylist={ride.highPlaylist} device={phone} paused={paused} visible={visible} /></div> :
          <div className="ride-stage" aria-label={`${ride.en} ${error ? "rendered preview" : "interactive 3D model"}`}>
            <img className={`ride-poster ${ready && !error ? "is-loaded" : ""}`} src={`/mg-group/rides/${ride.slug}-poster.webp`} alt={`${ride.en} — rendered from the supplied model in Blender`} loading="lazy" />
            {near && <ModelBoundary key={`${ride.slug}-${reset}`} onError={onError}><Viewer key={`${ride.slug}-${reset}`} slug={ride.slug} paused={paused || reduced || localPause || !visible} onReady={onReady} /></ModelBoundary>}
            {!ready && !error && near && <div className="ride-loading" role="status">جارٍ تحميل النموذج · Loading model</div>}
            {!error && <div className="ride-stage-footer"><span lang="ar" dir="rtl">اسحب للتدوير · مرّر للتكبير<span lang="en" dir="ltr">Drag to orbit · Scroll to zoom</span></span><div>
              <button aria-label={localPause ? "Play model animation" : "Pause model animation"} onClick={() => setLocalPause(v => !v)} disabled={reduced || paused}>{localPause || reduced || paused ? <Play size={18} /> : <Pause size={18} />}</button>
              <button aria-label="Reset model view" onClick={() => { setReset(v => v + 1); setReady(false); setError(false); }}><RotateCcw size={18} /></button>
            </div></div>}
          </div>}
        </div>
        {ride.facts.length > 0 && <div className="ride-specifications">
          <div className="ride-specification-source"><span lang="ar" dir="rtl">مواصفات {ride.parkNameAr} في سكازكا<span lang="en" dir="ltr">{ride.parkName} at Skazka</span></span><a href={ride.source} target="_blank" rel="noreferrer" aria-label={`Official ${ride.parkName} specifications`}><span lang="en">parkskazka.ru</span><ExternalLink size={12} /></a></div>
          <dl className="ride-facts" data-count={ride.facts.length}>{ride.facts.map(f => <div key={f.en}><dd dir="ltr" lang="en">{f.value}</dd><dt lang="ar" dir="rtl">{f.ar}<span lang="en" dir="ltr">{f.en}</span></dt></div>)}</dl>
        </div>}
      </div>
      <div className="ride-selector" aria-label="Choose an attraction">{rides.map((r, i) => <button key={r.slug} aria-pressed={i === index} onClick={() => choose(i)}><span lang="ar" dir="rtl">{r.ar}<span lang="en" dir="ltr">{r.en}</span></span><span className="ride-arrow" aria-hidden="true">{r.video ? <Film size={18} /> : <Box size={18} />}</span></button>)}</div>
    </div>
    <p className="ride-evidence-note" lang="ar" dir="rtl">{ride.noteAr}<span lang="en" dir="ltr">{ride.note}</span></p>
  </div>;
}
