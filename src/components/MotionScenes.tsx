import type { CSSProperties } from 'react';

const polar = (radius: number, angle: number) => [radius * Math.cos(angle), radius * Math.sin(angle)];

function Wheel({ x = 170, y = 95, r = 62 }: { x?: number; y?: number; r?: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M -32 ${r + 17} L 0 0 L 32 ${r + 17}`} className="scene-structure" />
    <g className="loop-wheel">
      <circle r={r} /><circle r={r - 7} />
      {Array.from({ length: 12 }, (_, i) => {
        const [px, py] = polar(r, i * Math.PI / 6);
        return <g key={i}><path d={`M 0 0 L ${px} ${py}`} /><g transform={`translate(${px} ${py})`}><g className="loop-cabin"><rect x="-6" y="0" width="12" height="12" rx="3" /></g></g></g>;
      })}
    </g><circle r="6" className="scene-hub" />
  </g>;
}
function Gear({ x, y, r, reverse = false }: { x: number; y: number; r: number; reverse?: boolean }) {
  return <g transform={`translate(${x} ${y})`}><g className={reverse ? 'loop-gear reverse-gear' : 'loop-gear'}>
    <circle r={r} /><circle r={r * .55} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x="-3" y={-r - 5} width="6" height="10" rx="1" transform={`rotate(${i * 30})`} />)}
    {[0,120,240].map(angle => <path key={angle} d={`M 0 ${-r * .55} L 0 ${-r}`} transform={`rotate(${angle})`} />)}
  </g><circle r="4" className="scene-hub" /></g>;
}

export function ParkScene() {
  return <div className="park-motion-scene" aria-hidden="true"><svg viewBox="0 0 460 190" className="motion-scene">
    <path d="M 8 172 H 450 M 15 177 H 440" className="scene-ground" />
    <Wheel x={163} y={86} r={62} />
    <path d="M 256 159 C 260 66 301 63 313 129 S 350 178 375 98 S 410 83 442 148" className="scene-coaster" />
    <path d="M 257 165 V 133 M 287 165 V 84 M 319 165 V 147 M 352 165 V 149 M 386 165 V 81 M 420 165 V 109" className="scene-structure" />
    <g className="loop-coaster-car"><rect x="-8" y="-5" width="16" height="8" rx="3" /><circle cx="-5" cy="5" r="2"/><circle cx="5" cy="5" r="2"/></g>
    <path d="M 18 165 V 126 H 66 V 165 M 12 126 L 42 110 L 72 126 Z M 26 165 V 143 H 37 V 165 M 47 143 H 58 V 154 H 47 Z" />
    <circle cx="343" cy="32" r="13" className="loop-sun" /><path d="M 319 32 H 314 M 368 32 H 373 M 343 8 V 3 M 343 56 V 61" />
  </svg></div>;
}
export function DriveScene() {
  return <div className="drive-motion-scene" aria-hidden="true"><svg viewBox="0 0 600 100" className="motion-scene">
    <path d="M 10 78 H 590 M 45 73 V 23 H 144 V 73 M 37 23 H 151" className="scene-structure" />
    <Gear x={84} y={48} r={24}/><Gear x={131} y={48} r={17} reverse />
    <path d="M 157 48 H 263 M 359 48 H 470" className="scene-transmission" />
    <path d="M 277 17 H 343 V 71 H 277 Z M 284 23 H 335 M 284 30 H 335 M 284 37 H 335 M 284 58 H 335 M 284 65 H 335" />
    <path d="M 263 36 H 277 V 60 H 263 Z M 343 36 H 359 V 60 H 343 Z" />
    <Gear x={501} y={47} r={26}/><circle cx="501" cy="47" r="38" className="scene-orbit" />
    <circle cx="170" cy="48" r="4" className="loop-transmission" />
    <path d="M 552 22 V 69 M 545 22 H 561 M 545 69 H 561" className="scene-structure" />
  </svg></div>;
}
export function LifecycleScene() {
  return <div className="lifecycle-motion-scene" aria-hidden="true"><svg viewBox="0 0 600 80" className="motion-scene">
    <path d="M 53 40 H 548" className="scene-route" />
    {[60,220,380,540].map((x, i) => <g key={x} transform={`translate(${x} 40)`}>
      <circle r="25" className="scene-stage-bg" /><circle r="25" className="loop-stage scene-stage-ring" style={{ '--phase': `${-i * 3}s` } as CSSProperties} />
      {i === 0 ? <path d="M -11 -13 H 10 V 13 H -11 Z M -6 -7 H 5 M -6 0 H 5 M -6 7 H 1" />
        : i === 1 ? <><path d="M -13 12 H 13 M -8 12 V -12 H 11 M -13 -7 H 11 M 9 -7 V 3 H 3" /><circle cx="3" cy="6" r="3" /></>
        : i === 2 ? <path d="M -6 -12 L 13 0 L -6 12 Z" />
        : <><path d="M -12 12 L 4 -4 M -5 -12 L 1 -6 L 7 -12 M -5 -12 A 9 9 0 1 0 7 -12" /><circle cx="-10" cy="10" r="3" /></>}
    </g>)}
    <circle r="4" cy="40" cx="60" className="loop-lifecycle-signal" />
  </svg></div>;
}
export function NetworkScene() {
  return <svg viewBox="0 0 170 85" className="motion-scene network-motion-scene" aria-hidden="true">
    <path d="M 30 17 L 84 43 L 142 16 M 84 43 L 142 70 M 84 43 L 31 70" className="scene-route" />
    {[[30,17],[142,16],[142,70],[31,70]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="7"/><circle cx={x} cy={y} r="13" className="loop-stage" style={{'--phase':`${-i*3}s`} as CSSProperties}/></g>)}
    <circle cx="84" cy="43" r="18" className="scene-stage-bg"/><path d="M 74 49 V 37 L 80 43 L 86 37 V 49 M 96 39 H 91 V 48 H 97 V 44 H 94"/>
  </svg>;
}
export function ContactSignal() {
  return <svg viewBox="0 0 90 28" className="motion-scene contact-motion-scene" aria-hidden="true"><path d="M 8 14 H 80" className="scene-route"/><circle cx="8" cy="14" r="4"/><circle cx="80" cy="14" r="4"/><circle cx="8" cy="14" r="3" className="loop-contact-signal"/></svg>;
}
