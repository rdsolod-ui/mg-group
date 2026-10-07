"use client";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import sizes from '@/data/model-sizes.json';
import MediaLoading from './MediaLoading';
import { useNetwork } from './NetworkPreferences';
class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function RideModel({ slug, title, paused, visible }: { slug: string; title: string; paused: boolean; visible: boolean }) {
  const network = useNetwork();
  const [state, setState] = useState<'idle' | 'loading' | 'preparing' | 'ready' | 'error'>('idle');
  const [progress, setProgress] = useState<number>();
  const [url, setUrl] = useState(''), [reset, setReset] = useState(0), [localPause, setLocalPause] = useState(false);
  const [Viewer, setViewer] = useState<typeof import('./RideViewer').default | null>(null);
  const controller = useRef<AbortController | null>(null), objectUrl = useRef('');
  const cancel = useCallback(() => { controller.current?.abort(); controller.current = null; setUrl(''); setState('idle'); }, []);
  const onReady = useCallback(() => setState('ready'), []);
  const onError = useCallback(() => setState('error'), []);
  useEffect(() => {
    if (!url) return;
    let current = true;
    // A fresh import on retry lets the browser recover a failed code-chunk request.
    void import('./RideViewer').then(module => { if (current) setViewer(() => module.default); }, () => { if (current) onError(); });
    return () => { current = false; };
  }, [url, onError]);
  useEffect(() => () => { controller.current?.abort(); if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);
  useEffect(() => { if (!visible || !network.online) { if (controller.current) cancel(); } }, [visible, network.online, cancel]);
  useEffect(() => { if (state !== 'preparing') return; const timer = setTimeout(() => { setUrl(''); setState('error'); }, 30000); return () => clearTimeout(timer); }, [state]);
  async function load() {
    controller.current?.abort();
    const request = new AbortController(); controller.current = request;
    if (objectUrl.current) { URL.revokeObjectURL(objectUrl.current); objectUrl.current = ''; }
    setUrl(''); setProgress(undefined); setState('loading'); setReset(v => v + 1);
    let stalled = false;
    let timer = setTimeout(() => { stalled = true; request.abort(); }, 20000);
    try {
      const response = await fetch(`/mg-group/rides/${slug}.glb`, { signal: request.signal });
      if (!response.ok || !response.body) throw new Error('Model unavailable');
      const total = Number(response.headers.get('Content-Length'));
      const chunks: ArrayBuffer[] = [], reader = response.body.getReader();
      let received = 0, lastUpdate = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        clearTimeout(timer); timer = setTimeout(() => { stalled = true; request.abort(); }, 20000);
        chunks.push(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer); received += value.byteLength;
        if (total > 0 && performance.now() - lastUpdate > 150) { setProgress(Math.min(100, received / total * 100)); lastUpdate = performance.now(); }
      }
      if (request.signal.aborted || controller.current !== request) return;
      objectUrl.current = URL.createObjectURL(new Blob(chunks, { type: 'model/gltf-binary' }));
      setUrl(objectUrl.current); setProgress(100); setState('preparing');
    } catch {
      if (controller.current === request) setState(stalled || !request.signal.aborted ? 'error' : 'idle');
    } finally { clearTimeout(timer); if (controller.current === request) controller.current = null; }
  }
  const bytes = (sizes as Record<string, number>)[slug];
  return <div className="ride-stage" data-model-state={state} aria-label={`${title} interactive 3D model`}>
    <img className={`ride-poster ${state === 'ready' ? 'is-loaded' : ''}`} src={`/mg-group/rides/${slug}-poster.webp`} alt={`${title} — rendered from the supplied model in Blender`} loading="lazy" />
    {url && Viewer && state !== 'error' && <Boundary key={reset} onError={onError}><Viewer slug={slug} url={url} paused={paused || localPause || !visible} onReady={onReady}/></Boundary>}
    {state !== 'ready' && <div className="model-load-panel">
      {state === 'loading' || state === 'preparing' ? <MediaLoading ar={state === 'loading' ? 'جارٍ تنزيل النموذج' : 'جارٍ تجهيز المشهد'} en={state === 'loading' ? 'Downloading model' : 'Preparing 3D scene'} progress={state === 'loading' ? progress : undefined} onCancel={cancel}/> :
      <button className="media-load-button" disabled={!network.online} onClick={() => void load()}><span lang="ar" dir="rtl">{!network.online ? 'أعد الاتصال لتحميل النموذج' : state === 'error' ? 'إعادة تحميل النموذج' : 'تحميل النموذج التفاعلي'}</span><span lang="en">{!network.online ? 'Reconnect to load 3D' : state === 'error' ? 'Retry 3D model' : 'Load interactive 3D'}</span><small dir="ltr">{(bytes / 1000000).toFixed(1)} MB · {network.economy ? 'Preview uses less data' : 'Drag to explore'}</small></button>}
    </div>}
    {state === 'ready' && <div className="ride-stage-footer"><span lang="ar" dir="rtl">اسحب للتدوير · مرّر للتكبير<span lang="en" dir="ltr">Drag to orbit · Scroll to zoom</span></span><div><button aria-label={localPause ? 'Play model animation' : 'Pause model animation'} disabled={paused} onClick={() => setLocalPause(v => !v)}>{localPause || paused ? <Play size={18}/> : <Pause size={18}/>}</button><button aria-label="Reset model view" onClick={() => { setReset(v => v + 1); setState('preparing'); }}><RotateCcw size={18}/></button></div></div>}
  </div>;
}
