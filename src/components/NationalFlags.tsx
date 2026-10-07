import type { CSSProperties } from 'react';
import optimizedFlag from '@/data/optimized-flag.json';

const countries = [
  { id: 'russia', ar: 'روسيا', en: 'Russia', file: 'russia.svg', ratio: 1.5 },
  { id: 'oman', ar: 'عُمان', en: 'Oman', file: '../' + optimizedFlag.src, ratio: 2000 / 1143 },
];
const strips = 32;

/** Each strip samples the same unmirrored flag. The hoist stays fixed. */
export default function NationalFlags({ compact = false }: { compact?: boolean }) {
  return <div className={`national-flags${compact ? ' flags-compact' : ''}`} aria-label="Russia and Oman">
    {countries.map(country => <figure className="national-flag" key={country.id} data-country={country.id}>
      <div className="flag-pole" aria-hidden="true" />
      <div className="flag-cloth" role="img" aria-label={`${country.en} national flag`} style={{ '--flag-ratio': country.ratio, '--flag-image': `url('/mg-group/flags/${country.file}')` } as CSSProperties}>
        <img className="flag-static" src={`/mg-group/flags/${country.file}`} alt="" width={country.id === 'russia' ? 150 : 2000} height={country.id === 'russia' ? 100 : 1143} />
        <div className="flag-waves" aria-hidden="true">
          {Array.from({ length: strips }, (_, i) => <span key={i} className="flag-strip loop-flag-cloth" style={{
            left: `${i / strips * 100}%`, '--flag-offset': -i / strips,
            '--flag-lift': `${Math.pow(i / (strips - 1), 1.3) * 6}%`,
            '--flag-tilt': `${i / (strips - 1) * 12}deg`,
            '--phase': `${-i / strips * 6.8 - (country.id === 'oman' ? 1.2 : 0)}s`,
          } as CSSProperties}><i className="loop-flag-shade" /></span>)}
        </div>
      </div>
      <figcaption><span lang="ar" dir="rtl">{country.ar}</span><span lang="en" dir="ltr">{country.en}</span></figcaption>
    </figure>)}
  </div>;
}
