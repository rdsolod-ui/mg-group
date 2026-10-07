"use client";
import { useEffect, useRef, useState } from "react";
import RideModel from "./RideModel";
import { Box, Film, ExternalLink } from "lucide-react";
import AttractionVideo from "./AttractionVideo";
import { rides } from "@/data/ride-catalogue";
import { chapterCopy, rideHooks } from "@/data/presentation-copy";
import device from "../../public/device/iphone-landscape.json";
const phone = { ...device.playerSpec, src: `/mg-group${device.playerSpec.src}` };
export default function RideShowcase({ paused, reduced }: { paused: boolean; reduced: boolean }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"film" | "model">("film");
  const [visible, setVisible] = useState(false);
  const stage = useRef<HTMLDivElement>(null), ride = rides[index];
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: .15 });
    if (stage.current) io.observe(stage.current);
    return () => io.disconnect();
  }, []);
  const choose = (i: number) => {
    if (i === index) return;
    setIndex(i); setMode(rides[i].video ? "film" : "model");
  };
  const show = (next: "film" | "model") => { if (next === mode) return; setMode(next); };
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
          <RideModel key={ride.slug} slug={ride.slug} title={ride.en} paused={paused || reduced} visible={visible} />}
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
