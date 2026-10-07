import type { ChartDatum } from '@/data/motion-data';

export const chartPalette = ['#df9762', '#59a9b6', '#a7b894', '#a599c4', '#d67764'];
export const focusDuration = 3.6;
export const introDuration = 3.2;
export const smooth = (v: number) => { const t = Math.max(0, Math.min(1, v)); return t * t * (3 - 2 * t); };
export function chartSectors(data: ChartDatum[]) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let value = 0;
  return data.map((item, index) => {
    const start = value / total * Math.PI * 2 + Math.PI / 2;
    value += item.value;
    const end = value / total * Math.PI * 2 + Math.PI / 2;
    return { ...item, start, end, mid: (start + end) / 2, color: chartPalette[index % chartPalette.length] };
  });
}
export function chartPhase(time: number, count: number) {
  const cycle = introDuration + count * focusDuration + 2;
  const t = time % cycle;
  const focus = t < introDuration || t >= introDuration + count * focusDuration ? -1 : Math.floor((t - introDuration) / focusDuration);
  const local = focus < 0 ? 0 : (t - introDuration) % focusDuration;
  const assembly = t < 1.7 ? 1 - smooth(t / 1.7) : smooth((t - introDuration - count * focusDuration) / 2);
  return { t, focus, lift: focus < 0 ? 0 : smooth(local / .65) * (1 - smooth((local - 2.8) / .8)), assembly };
}
export type ChartMotion = { time: number; selected: number; revision: number };
