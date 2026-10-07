import source from './source-register.json';

const operatingIds = ['skazka', 'leo-tolstoy', 'vdnkh', 'izmaylovo', 'ohta'];
const names: Record<string, [string, string]> = {
  skazka: ['سكازكا', 'Skazka'], 'leo-tolstoy': ['ليف تولستوي', 'Leo Tolstoy'],
  vdnkh: ['في دي إن خا', 'VDNKH'], izmaylovo: ['إزمايلوفو', 'Izmaylovo'], ohta: ['أوختا', 'Ohta'],
};
export const operatingRides = operatingIds.map(id => {
  const project = source.projects.find(p => p.id === id)!;
  return { id, ar: names[id][0], en: names[id][1], value: project.metrics.attractions.value! };
});
export const rideTotal = operatingRides.reduce((sum, p) => sum + p.value, 0);
const team = source.ownerUpdate.engineeringTeam;
export const technicalTeam = [
  { id: 'engineers', ar: 'مهندسون', en: 'Engineers', value: team.engineers },
  { id: 'mechanics', ar: 'ميكانيكيون', en: 'Mechanics', value: team.mechanics },
];
export const projectCountries = [
  { id: 'russia', ar: 'روسيا', en: 'Russia', value: source.projects.filter(p => p.country === 'Russia').length },
  { id: 'oman', ar: 'عُمان', en: 'Oman', value: source.projects.filter(p => p.country === 'Oman').length },
];
export type ChartDatum = { id: string; ar: string; en: string; value: number };

export function ringSector(start: number, end: number, outer = 64, inner = 47) {
  const point = (r: number, turn: number) => [90 + r * Math.cos(turn * Math.PI * 2 - Math.PI / 2), 90 + r * Math.sin(turn * Math.PI * 2 - Math.PI / 2)].join(' ');
  const large = end - start > .5 ? 1 : 0;
  return `M ${point(outer, start)} A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)} L ${point(inner, end)} A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)} Z`;
}
