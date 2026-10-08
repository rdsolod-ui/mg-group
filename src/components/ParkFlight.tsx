'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { LocateFixed } from 'lucide-react';
import locations from '@/data/project-locations.json';
const mapsConfigured = true;
import { useNetwork } from './NetworkPreferences';
import MediaLoading from './MediaLoading';
export default function ParkFlight({ id, active, paused, reduced, children }: { id: string; active: boolean; paused: boolean; reduced: boolean; children: ReactNode }) {
  const location = locations[id as keyof typeof locations];
  const network = useNetwork();
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'flight' | 'arrival' | 'creative' | 'error'>('idle');
  const [fade, setFade] = useState(0);
  const elapsed = useRef(0);
  const flightElapsed = useRef(0);
  const [Scene, setScene] = useState<typeof import('./LocalParkFlight').default | null>(null);
  const eligible = mapsConfigured && !network.economy && !reduced && network.online;
  const mounted = active && near && eligible && ['loading', 'flight', 'arrival'].includes(phase);
  const playing = mounted && !paused;
  const onReady = useCallback(() => setPhase(p => p === 'loading' ? 'flight' : p), []);
  const onArrive = useCallback(() => { elapsed.current = 0; setPhase('arrival'); }, []);
  const onError = useCallback(() => setPhase('error'), []);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { threshold: .3 });
    observer.observe(root.current); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!active && phase !== 'idle') { elapsed.current = 0; flightElapsed.current = 0; setFade(0); setPhase('idle'); return; }
    if (active && near && eligible && phase === 'idle') setPhase('loading');
    if ((!near || !eligible) && ['loading', 'flight', 'arrival'].includes(phase)) { setPhase('creative'); setFade(1); }
  }, [active, near, eligible, phase]);
  useEffect(() => {
    if (!mounted || Scene) return;
    let current = true;
    import('./LocalParkFlight').then(module => { if (current) setScene(() => module.default); }, () => { if (current) onError(); });
    return () => { current = false; };
  }, [mounted, Scene, onError]);
  useEffect(() => {
    if (phase !== 'loading') return;
    const timeout = setTimeout(onError, 22000);
    return () => clearTimeout(timeout);
  }, [phase, onError]);
  useEffect(() => {
    if (phase !== 'flight' || !playing) return;
    // Bounded recovery if the SDK never reports arrival; pause does not consume this budget.
    let frame = 0, previous = performance.now();
    const tick = (now: number) => {
      flightElapsed.current += Math.max(0, now - previous); previous = now;
      if (flightElapsed.current >= 24000) onError(); else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [phase, playing, onError]);
  useEffect(() => {
    if (phase !== 'arrival' || !playing) return;
    let frame = 0, previous = performance.now();
    const tick = (now: number) => {
      elapsed.current += Math.max(0, now - previous); previous = now;
      // Hold the precise point for 0.9 s, then crossfade for 1.4 s.
      const progress = Math.max(0, Math.min(1, (elapsed.current - 900) / 1400));
      setFade(progress * progress * (3 - 2 * progress));
      if (progress >= 1) setPhase('creative'); else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [phase, playing]);
  if (!location) return children;
  const showMap = mounted;
  return <div className="park-flight" ref={root} data-flight={id} data-flight-eligible={eligible} data-flight-economy={network.economy} data-flight-online={network.online} data-flight-phase={phase} data-flight-configured={mapsConfigured} data-flight-motion={active && near && !paused && !reduced ? "running" : "static"} data-lat={location.lat} data-lng={location.lng}>
    <div className="park-flight-stage" style={{ '--flight-fade': showMap && phase !== 'loading' ? fade : 1 } as CSSProperties}>
      <div className="park-flight-creative" inert={showMap && fade < 1}>{children}</div>
      {mounted && Scene && <div className="park-flight-map" style={{ opacity: 1 - fade }} data-media-controls>
        <Scene id={id} location={location} running={playing && phase === 'flight'} onReady={onReady} onArrive={onArrive} onError={onError} />
      </div>}
      {mounted && phase === 'loading' && <div className="park-flight-loading"><MediaLoading ar="من العالم إلى الموقع" en="From the world to this location" /></div>}
      {showMap && <div className="park-flight-heading" aria-hidden="true"><span lang="ar" dir="rtl">{phase === 'arrival' ? location.ar : 'من العالم إلى هذا الموقع'}</span><span lang="en">{phase === 'arrival' ? location.en : 'From the world to this destination'}</span></div>}
      {showMap && phase === 'arrival' && <span className="park-flight-pin" aria-hidden="true" style={{ opacity: 1 - fade }}><LocateFixed size={32}/></span>}
    </div>
    <div className="park-flight-tools" data-media-controls>
      <a href={`https://www.google.com/maps/search/?api=1&query=${location.lat}%2C${location.lng}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${location.en} exact GPS location in Google Maps`}><LocateFixed size={15}/><span dir="ltr">{location.lat.toFixed(5)}° N · {location.lng.toFixed(5)}° E</span></a>

    </div>
  </div>;
}
