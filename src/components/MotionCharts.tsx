'use client';
import { Component, useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { operatingRides, technicalTeam, projectCountries, ringSector, type ChartDatum } from '@/data/motion-data';
import { chartPalette, introDuration, type ChartMotion } from './chart-assembly';
import { useNetwork } from './NetworkPreferences';
import chartPosters from '@/data/chart-posters.json';

class ChartBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Bilingual({ ar, en }: { ar: string; en: string }) {
  return <span className="chart-language"><span lang="ar" dir="rtl">{ar}</span><span lang="en" dir="ltr">{en}</span></span>;
}

type Playback = { paused: boolean; reduced: boolean; active: boolean };
export function DataPie({ data, id, ar, en, unitAr, unitEn, paused, reduced, active }: Playback & {
  data: ChartDatum[]; id: string; ar: string; en: string; unitAr: string; unitEn: string;
}) {
  const title = useId();
  const ref = useRef<HTMLElement>(null);
  const posterImage = useRef<HTMLImageElement>(null);
  const connector = useRef<SVGPathElement>(null);
  const motion = useRef<ChartMotion>({ time: 0, selected: -1, revision: 0 });
  const [selected, setSelected] = useState(-1), [focus, setFocus] = useState(-1), [revision, setRevision] = useState(0);
  const [visible, setVisible] = useState(false), [ready, setReady] = useState(false), [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0), [localPause, setLocalPause] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [Scene, setScene] = useState<typeof import('./ChartAssemblyScene').default | null>(null);
  const network = useNetwork();
  const enabled = visible && active && !network.economy && !reduced && !error;
  const running = enabled && !paused && !localPause;
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setError(true); setReady(false); }, []);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .05 });
    observer.observe(el); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const image = posterImage.current; if (!image) return;
    // An SSR image can fail before React attaches onError, especially on a cold connection.
    const check = () => {
      if (image.complete && image.naturalWidth === 0) { image.style.visibility = 'hidden'; setPosterFailed(true); }
    };
    check(); image.addEventListener('error', check);
    return () => image.removeEventListener('error', check);
  }, [visible]);
  useEffect(() => {
    if (!enabled || Scene || !network.online) return;
    let current = true;
    import('./ChartAssemblyScene').then(module => { if (current) setScene(() => module.default); }, () => { if (current) onError(); });
    return () => { current = false; };
  }, [enabled, Scene, attempt, network.online, onError]);
  useEffect(() => {
    if (!enabled) { setReady(false); return; }
    if (ready) return;
    const timeout = setTimeout(onError, 15000); return () => clearTimeout(timeout);
  }, [enabled, ready, onError]);
  const choose = (index: number) => {
    const next = selected === index ? -1 : index;
    motion.current.selected = next;
    if (next < 0) motion.current.time = introDuration - .9;
    motion.current.revision++;
    setSelected(next); setFocus(next); setRevision(motion.current.revision);
  };
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const sectors = data.map(d => {
    const start = cumulative / total; cumulative += d.value;
    return { ...d, path: ringSector(start, cumulative / total, 70, 38) };
  });
  const shown = selected >= 0 ? selected : enabled ? focus : -1;
  const item = data[shown];
  const poster = chartPosters[id as keyof typeof chartPosters];
  return <figure ref={ref} className="data-chart assembly-chart" data-chart={id} data-chart-total={total} data-selected={selected >= 0} data-render={ready ? 'webgl' : 'static'}>
    <figcaption id={title}><Bilingual ar={ar} en={en} /><span className="assembly-edition" aria-hidden="true">MG / {id === 'operating-rides' ? '01' : id === 'technical-team' ? '02' : '03'}</span></figcaption>
    <div className="assembly-stage" role="group" aria-labelledby={title} aria-describedby={`${title}-description`}>
      <span id={`${title}-description`} className="sr-only">{data.map(d => `${d.ar} / ${d.en}: ${d.value} (${(d.value / total * 100).toFixed(1)}%)`).join('; ')}. Total: {total}.</span>
      <svg className="assembly-fallback" viewBox="0 0 180 180" aria-hidden="true" style={{ visibility: ready || (poster && !posterFailed) ? 'hidden' : 'visible' }}>
        <defs><linearGradient id={`${title}-metal`} x2=".5" y2="1"><stop stopColor="#fff" stopOpacity=".25"/><stop offset="1" stopColor="#071c2b" stopOpacity=".3"/></linearGradient></defs>
        <g transform="translate(0 27) scale(1 .7)">{sectors.map((d, i) => <path key={d.id} d={d.path} fill={chartPalette[i]} stroke="#0e293b" strokeWidth=".7"/>)}{sectors.map(d => <path key={d.id} d={d.path} fill={`url(#${title}-metal)`}/>)}</g>
      </svg>
      {poster && <picture className="assembly-poster" style={{ visibility: ready ? 'hidden' : 'visible' }} aria-hidden="true">
        <source media="(max-width:900px)" srcSet={`/mg-group/${poster.mobile.src}`} />
        <img ref={posterImage} src={`/mg-group/${poster.desktop.src}`} alt="" width={poster.desktop.width} height={poster.desktop.height} loading="lazy" decoding="async"
          onLoad={event => { event.currentTarget.style.visibility = 'visible'; setPosterFailed(false); }} onError={event => { event.currentTarget.style.visibility = 'hidden'; setPosterFailed(true); }} />
      </picture>}
      {enabled && Scene && <div className={`assembly-canvas ${ready ? 'is-ready' : ''}`} aria-hidden="true"><ChartBoundary key={attempt} onError={onError}><Scene data={data} running={running} reduced={reduced} motion={motion} onReady={onReady} onError={onError} onFocus={setFocus} connector={connector} selected={selected} revision={revision}/></ChartBoundary></div>}
      <svg className="assembly-connector" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true"><path ref={connector} fill="none" stroke={item ? chartPalette[shown] : '#d4a47c'} strokeWidth="1.4"/></svg>
      <div className="assembly-total"><strong dir="ltr">{total}</strong><Bilingual ar={unitAr} en={unitEn} /></div>
      <div className="assembly-focus" data-focus={item?.id || 'total'} style={{ '--focus-color': item ? chartPalette[shown] : '#df9762' } as CSSProperties}>
        {item ? <><strong dir="ltr">{item.value}<small>{(item.value / total * 100).toFixed(1)}%</small></strong><Bilingual ar={item.ar} en={item.en} /></> : <Bilingual ar="قوة التفاصيل. تكامل المنظومة." en="Every part. One capability." />}
      </div>
      <div className="assembly-controls" data-media-controls>
        <span className="assembly-status"><span lang="ar" dir="rtl">{selected >= 0 ? 'تفاصيل التكوين' : 'الصورة الكاملة'}</span><span lang="en">{selected >= 0 ? 'Component detail' : 'The complete picture'}</span></span>
        {error ? <button disabled={!network.online} onClick={() => { setError(false); setAttempt(v => v + 1); }} aria-label="Retry 3D chart"><Bilingual ar="إعادة المحاولة" en="Retry 3D" /></button> : !network.economy && !reduced && <button onClick={() => {
          if (selected >= 0) choose(selected); else setLocalPause(v => !v);
        }} aria-label={selected >= 0 ? 'Show all segments' : localPause ? 'Resume chart animation' : 'Pause chart animation'} aria-pressed={localPause}>
          <Bilingual ar={selected >= 0 ? 'عرض الكل' : localPause ? 'متابعة' : 'إيقاف مؤقت'} en={selected >= 0 ? 'Show all' : localPause ? 'Resume' : 'Pause'} />
        </button>}
      </div>
    </div>
    <ul className="assembly-legend" aria-label={`${en}: source values and calculated shares`}>
      {data.map((d, i) => <li key={d.id}><button className={`assembly-item chart-color-${i} ${shown === i ? 'is-active' : ''}`} type="button"
        data-value={d.value} data-sector={d.id} data-media-controls aria-pressed={selected === i}
        aria-label={`${d.ar} / ${d.en}, ${d.value}, ${(d.value / total * 100).toFixed(1)}%. ${selected === i ? 'Show all' : 'Highlight segment'}`} onClick={() => choose(i)}>
        <span className="assembly-swatch"/><Bilingual ar={d.ar} en={d.en} /><span className="assembly-value" dir="ltr"><b>{d.value}</b><small>{(d.value / total * 100).toFixed(1)}%</small></span>
      </button></li>)}
    </ul>
  </figure>;
}

export const PortfolioChart = (props: Playback) => <DataPie {...props} id="operating-rides" data={operatingRides} ar="توزيع الألعاب في خمسة مشاريع تشغيلية" en="Rides across five operating cases" unitAr="لعبة" unitEn="rides" />;
export const TeamChart = (props: Playback) => <DataPie {...props} id="technical-team" data={technicalTeam} ar="تكوين الفريق الفني" en="Technical team composition" unitAr="متخصصاً" unitEn="specialists" />;
export const CountryChart = (props: Playback) => <DataPie {...props} id="project-countries" data={projectCountries} ar="المشاريع حسب الدولة" en="Projects by country" unitAr="مشاريع" unitEn="projects" />;

export function ProjectCapacity({ id, value, activities = false, construction = false }: { id: string; value: number; activities?: boolean; construction?: boolean }) {
  const total = operatingRides.reduce((s, p) => s + p.value, 0);
  const share = !construction ? `${(value / total * 100).toFixed(1)}%` : String(value);
  return <div className={`project-capacity ${construction ? 'source-programme' : ''}`} data-project-capacity={id}>
    <div className="capacity-heading"><Bilingual
      ar={construction ? (activities ? 'أنشطة مذكورة في المصدر' : 'ألعاب مذكورة في المصدر') : `حصة من إجمالي ${total} لعبة`}
      en={construction ? (activities ? 'Activities in the source programme' : 'Rides in the source programme') : `Share of the ${total}-ride operating portfolio`} />
      <strong dir="ltr">{share}</strong></div>
    {construction ? <div className="programme-points" aria-hidden="true">{[0,1,2,3].map(i => <span key={i} className="loop-stage" style={{ '--phase': `${-i * 3}s` } as CSSProperties} />)}</div>
      : <div className="capacity-track" role="img" aria-label={`${value} of ${total} rides, ${share}`}><span style={{ width: `${value / total * 100}%` }}><i className="loop-bar-light" /></span></div>}
  </div>;
}
