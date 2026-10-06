'use client';
import { useId, useState, type CSSProperties } from 'react';
import { operatingRides, technicalTeam, projectCountries, ringSector, type ChartDatum } from '@/data/motion-data';

function Bilingual({ ar, en }: { ar: string; en: string }) {
  return <span className="chart-language"><span lang="ar" dir="rtl">{ar}</span><span lang="en" dir="ltr">{en}</span></span>;
}

export function DataPie({ data, id, ar, en, unitAr, unitEn, bars = false }: {
  data: ChartDatum[]; id: string; ar: string; en: string; unitAr: string; unitEn: string; bars?: boolean;
}) {
  const title = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  return <figure className={`data-chart ${bars ? 'chart-with-bars' : ''}`} data-chart={id}>
    <figcaption id={title}><Bilingual ar={ar} en={en} /></figcaption>
    <div className="chart-body">
      <div className="pie-graphic">
        <svg viewBox="0 0 180 180" role="img" aria-labelledby={title} data-chart-total={total}>
          <desc>{data.map(d => `${d.en}: ${d.value} (${(d.value / total * 100).toFixed(1)}%)`).join('; ')}. Total {total}. Fixed source values.</desc>
          <circle cx="90" cy="90" r="74" className="pie-guide" />
          {data.map((d, i) => {
            const start = cumulative / total; cumulative += d.value;
            return <path key={d.id} d={ringSector(start, cumulative / total)} data-value={d.value}
              className={`pie-segment loop-segment chart-color-${i} ${selected === d.id ? 'is-selected' : ''} ${selected && selected !== d.id ? 'is-muted' : ''}`}
              style={{ '--phase': `${-i * 2.4}s` } as CSSProperties} />;
          })}
          <g className="loop-orbit"><circle cx="90" cy="16" r="3" className="pie-tracer" /></g>
        </svg>
        <div className="pie-center"><strong dir="ltr">{total}</strong><Bilingual ar={unitAr} en={unitEn} /></div>
      </div>
      <ul className="chart-legend" aria-label={`${en}: source values and calculated shares`}>
        {data.map((d, i) => <li key={d.id}>
          <button type="button" className={`chart-item chart-color-${i} ${selected === d.id ? 'is-selected' : ''}`}
            aria-pressed={selected === d.id} aria-label={`${d.en}, ${d.value}, ${(d.value / total * 100).toFixed(1)} percent. Highlight segment`}
            onClick={() => setSelected(selected === d.id ? null : d.id)} data-media-controls>
            <span className="chart-key" /><Bilingual ar={d.ar} en={d.en} />
            <span className="chart-number" dir="ltr"><b>{d.value}</b><small>{(d.value / total * 100).toFixed(1)}%</small></span>
            {bars && <span className="chart-bar-track"><span className="chart-bar-fill" style={{ width: `${d.value / total * 100}%` }}><i className="loop-bar-light" style={{ '--phase': `${-i * 1.7}s` } as CSSProperties} /></span></span>}
          </button>
        </li>)}
      </ul>
    </div>
  </figure>;
}

export const PortfolioChart = () => <DataPie id="operating-rides" data={operatingRides} ar="توزيع الألعاب في خمسة مشاريع تشغيلية" en="Rides across five operating cases" unitAr="لعبة" unitEn="rides" bars />;
export const TeamChart = () => <DataPie id="technical-team" data={technicalTeam} ar="تكوين الفريق الفني" en="Technical team composition" unitAr="متخصصاً" unitEn="specialists" />;
export const CountryChart = () => <DataPie id="project-countries" data={projectCountries} ar="المشاريع حسب الدولة" en="Projects by country" unitAr="مشاريع" unitEn="projects" />;

export function ProjectCapacity({ id, value, activities = false, construction = false }: { id: string; value: number; activities?: boolean; construction?: boolean }) {
  const total = operatingRides.reduce((s, p) => s + p.value, 0);
  const share = !construction ? `${(value / total * 100).toFixed(1)}%` : String(value);
  return <div className={`project-capacity ${construction ? 'source-programme' : ''}`} data-project-capacity={id}>
    <div className="capacity-heading"><Bilingual
      ar={construction ? (activities ? 'أنشطة مذكورة في المصدر' : 'ألعاب مذكورة في المصدر') : 'حصة من إجمالي ٩٧ لعبة'}
      en={construction ? (activities ? 'Activities in the source programme' : 'Rides in the source programme') : 'Share of the 97-ride operating portfolio'} />
      <strong dir="ltr">{share}</strong></div>
    {construction ? <div className="programme-points" aria-hidden="true">{[0,1,2,3].map(i => <span key={i} className="loop-stage" style={{ '--phase': `${-i * 3}s` } as CSSProperties} />)}</div>
      : <div className="capacity-track" role="img" aria-label={`${value} of ${total} rides, ${share}`}><span style={{ width: `${value / total * 100}%` }}><i className="loop-bar-light" /></span></div>}
  </div>;
}
