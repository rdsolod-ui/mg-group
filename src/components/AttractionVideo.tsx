"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Maximize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type Hls from "hls.js";
import type { LoadPolicy } from "hls.js";
import styles from "./AttractionVideo.module.css";

export type AttractionDevice = {
  src: string;
  aspectRatio: number;
  /** Percentages of the complete rendered frame, including its transparent margins. */
  screen: { left: number; top: number; width: number; height: number; radius: number | string };
};

export type AttractionVideoProps = {
  slug: string;
  title: string;
  paused: boolean;
  visible: boolean;
  device?: AttractionDevice;
  /** Highest existing variant, relative to this attraction's media directory. */
  highPlaylist?: string;
};

type Quality = "auto" | "economy" | "high";
type Engine = "none" | "native" | "hls" | "mp4";
type Status = "idle" | "loading" | "buffering" | "playing" | "paused" | "ended" | "error";
type SafariVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type Connection = { saveData?: boolean; effectiveType?: string };

const defaultDevice: AttractionDevice = {
  src: "/mg-group/device/iphone-landscape.webp",
  aspectRatio: 2400 / 1240,
  screen: { left: 4.9712643678, top: 9.8442714127, width: 90.0574712644, height: 80.3114571746, radius: "7.1474154435% / 15.5124653740%" },
};

const loadPolicy: LoadPolicy = {
  default: {
    maxTimeToFirstByteMs: 10000,
    maxLoadTimeMs: 25000,
    timeoutRetry: { maxNumRetry: 1, retryDelayMs: 1200, maxRetryDelayMs: 1200 },
    errorRetry: { maxNumRetry: 1, retryDelayMs: 1200, maxRetryDelayMs: 1200 },
  },
};

function timeLabel(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

/** A slug change creates an isolated playback session and releases the old source. */
export default function AttractionVideo(props: AttractionVideoProps) {
  return <VideoSession key={props.slug} {...props} />;
}

function VideoSession({ slug, title, paused, visible, device = defaultDevice, highPlaylist = "1080p/index.m3u8" }: AttractionVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const engineRef = useRef<Engine>("none");
  const wantedRef = useRef(false);
  const allowedRef = useRef(false);
  const qualityRef = useRef<Quality>("auto");
  const resumeAtRef = useRef(0);
  const nativeSuspendedRef = useRef(false);
  const changingSourceRef = useRef(false);
  const fallbackUsedRef = useRef(false);
  const playRef = useRef<() => void>(() => {});
  const attachRef = useRef<() => void>(() => {});
  const fallbackRef = useRef<() => void>(() => {});
  const applyQualityRef = useRef<() => void>(() => {});
  const [activated, setActivated] = useState(false);
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(true);
  const [quality, setQuality] = useState<Quality>("auto");
  const [engine, setEngine] = useState<Engine>("none");
  const [clock, setClock] = useState({ time: 0, duration: 0 });
  const [buffered, setBuffered] = useState<Array<[number, number]>>([]);
  const [resolution, setResolution] = useState("");
  const [tabVisible, setTabVisible] = useState(true);
  const [playBlocked, setPlayBlocked] = useState(false);
  const id = useId();
  const base = `/mg-group/ride-videos/${slug}`;
  const allowed = visible && tabVisible && !paused;
  allowedRef.current = allowed;

  const readProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setClock({ time: video.currentTime, duration: video.duration });
      const ranges: Array<[number, number]> = [];
      for (let i = 0; i < video.buffered.length; i++) ranges.push([video.buffered.start(i), video.buffered.end(i)]);
      setBuffered(ranges);
    }
    if (video.videoWidth && video.videoHeight) setResolution(`${video.videoWidth} × ${video.videoHeight}`);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (allowed || !activated) return;
    const video = videoRef.current;
    wantedRef.current = false;
    if (!video) return;
    resumeAtRef.current = video.currentTime || resumeAtRef.current;
    video.pause();
    hlsRef.current?.stopLoad();
    // Native HLS/MP4 have no stopLoad API. Clearing src aborts pending requests.
    if (engineRef.current === "native" || engineRef.current === "mp4") {
      nativeSuspendedRef.current = true;
      changingSourceRef.current = true;
      video.removeAttribute("src");
      video.load();
      setBuffered([]);
    }
    setStatus(current => current === "error" || current === "ended" ? current : "paused");
  }, [allowed, activated]);

  useEffect(() => {
    if (!activated) return;
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    let mediaRecoveryUsed = false;
    fallbackUsedRef.current = false;
    nativeSuspendedRef.current = false;

    const play = () => {
      if (disposed || !wantedRef.current || !allowedRef.current) return;
      setPlayBlocked(false);
      void video.play().catch(error => {
        if (disposed || error?.name === "AbortError" || !wantedRef.current) return;
        wantedRef.current = false;
        hlsRef.current?.stopLoad();
        setStatus("paused");
        setPlayBlocked(true);
      });
    };
    playRef.current = play;

    const attachNative = () => {
      if (disposed || !allowedRef.current || !wantedRef.current) return;
      const source = engineRef.current === "mp4"
        ? `${base}/fallback.mp4`
        : `${base}/${qualityRef.current === "economy" ? "360p/index.m3u8" : qualityRef.current === "high" ? highPlaylist : "master.m3u8"}`;
      nativeSuspendedRef.current = false;
      changingSourceRef.current = true;
      setStatus("loading");
      video.src = source;
      video.load();
      play();
    };
    attachRef.current = attachNative;

    const fallback = () => {
      if (disposed) return;
      if (fallbackUsedRef.current) {
        wantedRef.current = false;
        video.pause();
        video.removeAttribute("src");
        video.load();
        setStatus("error");
        return;
      }
      fallbackUsedRef.current = true;
      resumeAtRef.current = video.currentTime || resumeAtRef.current;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      engineRef.current = "mp4";
      setEngine("mp4");
      setBuffered([]);
      nativeSuspendedRef.current = true;
      attachNative();
    };
    fallbackRef.current = fallback;

    const applyQuality = () => {
      const hls = hlsRef.current;
      if (hls?.levels.length) {
        const byBandwidth = hls.levels.map((level, index) => ({ index, bitrate: level.bitrate })).sort((a, b) => a.bitrate - b.bitrate);
        hls.capLevelToPlayerSize = qualityRef.current === "auto";
        hls.nextLevel = qualityRef.current === "auto" ? -1 : qualityRef.current === "economy" ? byBandwidth[0].index : byBandwidth[byBandwidth.length - 1].index;
      } else if (engineRef.current === "native") {
        resumeAtRef.current = video.currentTime || resumeAtRef.current;
        nativeSuspendedRef.current = true;
        if (wantedRef.current) attachNative();
        else {
          video.removeAttribute("src");
          video.load();
          setBuffered([]);
        }
      }
    };
    applyQualityRef.current = applyQuality;

    const initialize = async () => {
      setStatus("loading");
      // Safari's platform decoder handles its native adaptive stream.
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        engineRef.current = "native";
        setEngine("native");
        attachNative();
        return;
      }
      try {
        const HlsClass = (await import("hls.js")).default;
        if (disposed) return;
        if (!allowedRef.current || !wantedRef.current) {
          engineRef.current = "none";
          setStatus("paused");
          return;
        }
        if (!HlsClass.isSupported()) { fallback(); return; }
        const connection = (navigator as Navigator & { connection?: Connection }).connection;
        const slow = connection?.saveData || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || "");
        const hls = new HlsClass({
          autoStartLoad: false,
          startLevel: 0,
          abrEwmaDefaultEstimate: slow ? 350000 : 700000,
          capLevelToPlayerSize: true,
          maxBufferLength: 20,
          maxMaxBufferLength: 32,
          maxBufferSize: 24 * 1024 * 1024,
          backBufferLength: 8,
          lowLatencyMode: false,
          manifestLoadPolicy: loadPolicy,
          playlistLoadPolicy: loadPolicy,
          fragLoadPolicy: loadPolicy,
        });
        hlsRef.current = hls;
        engineRef.current = "hls";
        setEngine("hls");
        hls.on(HlsClass.Events.MANIFEST_PARSED, () => {
          if (disposed || !allowedRef.current || !wantedRef.current) { hls.stopLoad(); return; }
          applyQuality();
          hls.startLoad(resumeAtRef.current || -1);
          play();
        });
        hls.on(HlsClass.Events.LEVEL_SWITCHED, readProgress);
        hls.on(HlsClass.Events.FRAG_BUFFERED, readProgress);
        hls.on(HlsClass.Events.ERROR, (_event, data) => {
          if (disposed || !data.fatal) return;
          if (data.type === HlsClass.ErrorTypes.MEDIA_ERROR && !mediaRecoveryUsed) {
            mediaRecoveryUsed = true;
            hls.recoverMediaError();
            if (!allowedRef.current || !wantedRef.current) hls.stopLoad();
          } else fallback();
        });
        hls.loadSource(`${base}/master.m3u8`);
        hls.attachMedia(video);
      } catch { fallback(); }
    };
    void initialize();
    return () => {
      disposed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      engineRef.current = "none";
      video.pause();
      video.removeAttribute("src");
      video.load();
      playRef.current = () => {};
      attachRef.current = () => {};
      fallbackRef.current = () => {};
      applyQualityRef.current = () => {};
    };
  }, [activated, base, highPlaylist, retry, readProgress]);

  const start = () => {
    if (!allowedRef.current) return;
    wantedRef.current = true;
    setPlayBlocked(false);
    if (!activated) { setActivated(true); return; }
    if (status === "error" || engineRef.current === "none") {
      setStatus("loading");
      setRetry(value => value + 1);
      return;
    }
    if (status === "ended" && videoRef.current) {
      resumeAtRef.current = 0;
      videoRef.current.currentTime = 0;
    }
    if (nativeSuspendedRef.current) attachRef.current();
    else { hlsRef.current?.startLoad(-1); playRef.current(); }
  };

  const stop = () => {
    wantedRef.current = false;
    videoRef.current?.pause();
    hlsRef.current?.stopLoad();
    setStatus("paused");
  };

  const selectQuality = (value: Quality) => {
    qualityRef.current = value;
    setQuality(value);
    applyQualityRef.current();
  };

  const loadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    changingSourceRef.current = false;
    if (resumeAtRef.current > 0 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(resumeAtRef.current, Math.max(0, video.duration - .1));
      resumeAtRef.current = 0;
    }
    readProgress();
  };

  const fullscreen = async () => {
    const container = containerRef.current;
    const video = videoRef.current as SafariVideo | null;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (container?.requestFullscreen) await container.requestFullscreen();
      else video?.webkitEnterFullscreen?.();
    } catch { /* The browser may disallow fullscreen; playback remains available. */ }
  };

  const active = status === "playing" || status === "buffering" || status === "loading";
  const waiting = status === "loading" || status === "buffering";
  const screenStyle: CSSProperties = {
    left: `${device.screen.left}%`, top: `${device.screen.top}%`,
    width: `${device.screen.width}%`, height: `${device.screen.height}%`,
    borderRadius: typeof device.screen.radius === "string" ? device.screen.radius : `${device.screen.radius}% / ${device.screen.radius * device.screen.width * device.aspectRatio / device.screen.height}%`,
  };
  const elapsedPercent = clock.duration ? 100 * clock.time / clock.duration : 0;
  const bufferedAhead = buffered.find(([from, to]) => from <= clock.time && to >= clock.time);
  const secondsAhead = bufferedAhead ? Math.max(0, Math.floor(bufferedAhead[1] - clock.time)) : 0;

  return <div className={styles.player} ref={containerRef} data-media-controls data-attraction-video={slug} data-engine={engine} data-status={status}>
    <div className={styles.device} style={{ aspectRatio: device.aspectRatio }}>
      <div className={styles.screen} style={screenStyle}>
        <video
          ref={videoRef} className={styles.video} preload="none" playsInline muted={muted}
          poster={`${base}/poster.webp`} aria-label={`${title} — attraction video`}
          onLoadedMetadata={loadedMetadata} onDurationChange={readProgress} onTimeUpdate={readProgress}
          onProgress={readProgress} onResize={readProgress}
          onPlay={() => {
            if (allowedRef.current) { wantedRef.current = true; hlsRef.current?.startLoad(-1); }
            else videoRef.current?.pause();
          }}
          onWaiting={() => { if (wantedRef.current && allowedRef.current) setStatus("buffering"); }}
          onPlaying={() => { if (!allowedRef.current || !wantedRef.current) videoRef.current?.pause(); else setStatus("playing"); }}
          onPause={() => {
            if (!changingSourceRef.current && !videoRef.current?.ended) {
              wantedRef.current = false;
              hlsRef.current?.stopLoad();
              setStatus(current => current === "error" || current === "ended" ? current : "paused");
            }
          }}
          onVolumeChange={() => { if (videoRef.current) setMuted(videoRef.current.muted); }}
          onEnded={() => { wantedRef.current = false; hlsRef.current?.stopLoad(); setStatus("ended"); }}
          onError={() => { if (engineRef.current === "native" || engineRef.current === "mp4") fallbackRef.current(); }}
        />
        {!active && <button className={styles.playOverlay} onClick={start} disabled={!allowed} aria-label={status === "error" ? `Retry ${title} video` : `Play ${title} video`}>
          <span className={styles.playDisc}>{status === "ended" || status === "error" ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />}</span>
          <span lang="ar" dir="rtl">{status === "error" ? "إعادة المحاولة" : status === "ended" ? "إعادة المشاهدة" : "شاهد الفيديو"}<small lang="en" dir="ltr">{status === "error" ? "Retry video" : status === "ended" ? "Watch again" : "Watch the ride"}</small></span>
        </button>}
        {waiting && <div className={styles.waiting} role="status"><span className={styles.spinner} aria-hidden="true" /><span lang="ar" dir="rtl">جارٍ تحميل الفيديو<small lang="en" dir="ltr">Buffering video</small></span></div>}
      </div>
      <img className={styles.frame} src={device.src} alt="" aria-hidden="true" loading="lazy" draggable="false" />
    </div>

    <div className={styles.controls}>
      <div className={styles.transport} dir="ltr">
        <button type="button" className={styles.iconButton} onClick={active ? stop : start} disabled={!allowed} aria-label={active ? "إيقاف مؤقت / Pause video" : "تشغيل / Play video"}>{active ? <Pause size={18} /> : <Play size={18} />}</button>
        <button type="button" className={styles.iconButton} onClick={() => setMuted(value => !value)} aria-label={muted ? "تشغيل الصوت / Unmute video" : "كتم الصوت / Mute video"} aria-pressed={!muted}>{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        <output className={styles.time} aria-label="Playback time">{timeLabel(clock.time)} / {timeLabel(clock.duration)}</output>
        <div className={styles.seek}>
          <div className={styles.seekTrack} aria-hidden="true">
            {buffered.map(([from, to], index) => <span className={styles.bufferRange} key={index} style={{ left: `${clock.duration ? from / clock.duration * 100 : 0}%`, width: `${clock.duration ? (to - from) / clock.duration * 100 : 0}%` }} />)}
            <span className={styles.elapsed} style={{ width: `${elapsedPercent}%` }} />
          </div>
          <input type="range" min="0" max={clock.duration || 1} step="0.1" value={clock.time} disabled={!clock.duration || !activated || !allowed}
            aria-label="موضع الفيديو / Video position" aria-valuetext={`${timeLabel(clock.time)} of ${timeLabel(clock.duration)}`}
            onChange={event => {
              const time = Number(event.target.value);
              resumeAtRef.current = time;
              if (videoRef.current && !nativeSuspendedRef.current) { videoRef.current.currentTime = time; resumeAtRef.current = 0; }
              setClock(value => ({ ...value, time }));
              if (wantedRef.current) hlsRef.current?.startLoad(time);
            }} />
        </div>
        <button type="button" className={styles.iconButton} onClick={fullscreen} aria-label="ملء الشاشة / Fullscreen video"><Maximize size={18} /></button>
      </div>
      <div className={styles.settings}>
        <label htmlFor={`${id}-quality`} className={styles.qualityLabel}><span lang="ar" dir="rtl">جودة الفيديو</span><span lang="en">Video quality</span></label>
        <select id={`${id}-quality`} className={styles.qualitySelect} value={engine === "mp4" ? "fallback" : quality} disabled={engine === "mp4"} onChange={event => selectQuality(event.target.value as Quality)} aria-label="جودة الفيديو / Video quality" title="Auto quality adapts to your connection">
          {engine === "mp4" && <option value="fallback">ثابتة / Fixed</option>}
          <option value="auto">تلقائي / Auto</option>
          <option value="economy">اقتصادي / Economy</option>
          <option value="high">عالية / High</option>
        </select>
        <span className={styles.streamInfo} lang="en" dir="ltr">{resolution}{resolution && secondsAhead > 0 ? ` · ${secondsAhead}s buffered` : ""}</span>
      </div>
    </div>
    <div className={styles.notice} aria-live="polite" aria-atomic="true">
      {status === "error" ? <p lang="ar" dir="rtl">تعذّر تحميل الفيديو. تحقق من اتصالك وحاول مجدداً.<span lang="en" dir="ltr">Video could not load. Check your connection and retry.</span></p>
        : paused ? <p lang="ar" dir="rtl">أوقف العرض مؤقتاً تشغيل الفيديو.<span lang="en" dir="ltr">Presentation pause is on.</span></p>
        : playBlocked ? <p lang="ar" dir="rtl">اضغط تشغيل للمتابعة.<span lang="en" dir="ltr">Press play to continue.</span></p>
        : engine === "mp4" ? <p lang="ar" dir="rtl">تشغيل النسخة البديلة بجودة ثابتة.<span lang="en" dir="ltr">Fallback video · fixed quality.</span></p>
        : null}
    </div>
  </div>;
}
