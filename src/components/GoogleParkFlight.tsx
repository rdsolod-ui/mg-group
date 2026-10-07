'use client';
import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps, type Camera, type MapElement } from './google-maps-flight';
export type FlightLocation = { lat: number; lng: number; range: number; ar: string; en: string };
export default function GoogleParkFlight({ location, running, onReady, onArrive, onError }: {
  location: FlightLocation; running: boolean; onReady: () => void; onArrive: () => void; onError: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<MapElement | null>(null);
  const [ready, setReady] = useState(false);
  const callbacks = useRef({ onReady, onArrive, onError }); callbacks.current = { onReady, onArrive, onError };
  const timing = useRef({ remaining: 9000, started: 0, arrived: false });
  const commands = useRef(Promise.resolve());
  useEffect(() => {
    let disposed = false, el: MapElement | undefined, announced = false;
    const timeout = setTimeout(() => callbacks.current.onError(), 20000);
    loadGoogleMaps().then(({ Map3DElement }) => {
      if (disposed || !host.current) return;
      el = new Map3DElement({ center: { lat: 15, lng: location.lng - 35, altitude: 0 }, range: 24000000,
        tilt: 0, heading: 0, mode: 'SATELLITE', gestureHandling: 'COOPERATIVE', defaultUIHidden: true });
      const current = el;
      current.setAttribute('aria-label', `Google Maps satellite flight to ${location.en}`);
      current.style.cssText = 'display:block;width:100%;height:100%';
      current.addEventListener('gmp-error', () => { if (!disposed) callbacks.current.onError(); });
      current.addEventListener('gmp-steadychange', event => {
        if (!disposed && !announced && (event as Event & { isSteady: boolean }).isSteady) {
          announced = true; clearTimeout(timeout); setReady(true); callbacks.current.onReady();
        }
      });
      current.addEventListener('gmp-animationend', () => {
        // stopCameraAnimation can also end a flight; only reveal the creative at the destination.
        if (disposed || timing.current.arrived || current.range > location.range * 1.02) return;
        if (Math.abs(current.center.lat - location.lat) > .00001 || Math.abs(current.center.lng - location.lng) > .00001) return;
        timing.current.arrived = true; callbacks.current.onArrive();
      });
      map.current = current; host.current.append(current);
    }).catch(() => { if (!disposed) callbacks.current.onError(); });
    return () => {
      disposed = true; clearTimeout(timeout);
      map.current = null;
      if (el) { try { el.stopCameraAnimation(); } catch {} el.remove(); }
    };
  }, [location]);
  useEffect(() => {
    const el = map.current; if (!ready || !el || timing.current.arrived) return;
    let cancelled = false;
    commands.current = commands.current.then(async () => {
      if (cancelled || map.current !== el) return;
      if (!running) {
        if (timing.current.started) timing.current.remaining = Math.max(100, timing.current.remaining - (performance.now() - timing.current.started));
        timing.current.started = 0; await el.stopCameraAnimation();
        return;
      }
      const endCamera: Camera = { center: { lat: location.lat, lng: location.lng, altitude: 0 }, altitudeMode: 'RELATIVE_TO_GROUND', range: location.range, tilt: 42, heading: 15 };
      timing.current.started = performance.now();
      await el.flyCameraTo({ endCamera, durationMillis: timing.current.remaining });
    }).catch(() => { if (map.current === el) callbacks.current.onError(); });
    return () => { cancelled = true; };
  }, [running, ready, location]);
  return <div ref={host} className="park-flight-google" data-provider="google-maps" data-ready={ready} />;
}
