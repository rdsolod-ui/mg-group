export type VisualAsset = { src: string; alt: string; ar: string; en: string; kind: 'generated' | 'photo' | 'concept' | 'plan' };
const image = (slug: string) => `visuals/v2/${slug}.webp`;
const generated = (id: string, name: string): VisualAsset => ({
  src: image(id), alt: `${name} — illustrative aerial masterplan`, kind: 'generated',
  ar: 'تصوّر مولّد للمخطط العام؛ توزيع توضيحي، وليس مخططاً تنفيذياً.',
  en: 'Generated masterplan visualization. Interpretive layout, not an as-built plan.',
});
export const projectVisuals: Record<string, VisualAsset[]> = {
  skazka: [generated('skazka', 'Skazka Park')],
  'leo-tolstoy': [generated('leo-tolstoy', 'Leo Tolstoy Park')],
  vdnkh: [generated('vdnkh', 'VDNKH Attractions')],
  izmaylovo: [generated('izmaylovo', 'Kremlin Izmaylovo')],
  ohta: [generated('ohta', 'Ohta Park')],
  'minny-gorodok': [generated('minny-gorodok', 'Minny Gorodok Park')],
  airport: [{...generated('airport', 'Domodedovo indoor entertainment zone'), alt: 'Illustrative cutaway masterplan of the indoor family entertainment zone'}],
  'al-haffa': [
    {src: image('salalah-coast'), alt: 'Original drone photograph of the Salalah Eye wheel, Al Haffa coast and promenade', kind: 'photo', ar: 'صورة حقيقية من أرشيف المشروع — صلالة، أكتوبر ٢٠٢٦.', en: 'Original project photography — Salalah, October 2026.'},
    {src: image('salalah-dawn'), alt: 'Original dawn drone photograph of Salalah Eye', kind: 'photo', ar: 'صورة حقيقية من أرشيف المشروع — عند الفجر.', en: 'Original project photography — dawn.'},
    {src: image('salalah-palms'), alt: 'Original drone photograph of the wheel and Salalah palm groves', kind: 'photo', ar: 'صورة حقيقية من أرشيف المشروع — الساحل والنخيل.', en: 'Original project photography — coast and palms.'},
    {src: image('salalah-concept'), alt: 'Waterfront development concept from the Salalah Eye presentation', kind: 'concept', ar: 'تصوّر التطوير من عرض صلالة؛ لا يمثّل الحالة المنفّذة.', en: 'Development concept from the Salalah presentation; not the installed site.'},
    {src: image('salalah-plan'), alt: 'Selected Salalah development plan with 13 programme elements', kind: 'plan', ar: 'مخطط تطوير يضم ١٣ عنصراً، منها العجلة القائمة والخدمات؛ ليس ١٣ لعبة جديدة.', en: 'Development plan: 13 programme elements, including the existing wheel and amenities; not 13 new rides.'},
  ],
};
export const salalahProgramme = [
  ['العجلة القائمة', 'Existing Ferris wheel'], ['الأرجوحة الدوّارة', 'Chain carousel'],
  ['السيارات التصادمية', 'Bumper cars'], ['سفينة الفايكنج', 'Viking swing'],
  ['برج سامبا', 'Samba tower'], ['القوارب التصادمية', 'Bumper boats'],
  ['جيت ستار فايتر', 'Jet Star Fighter'], ['متاهة الأطفال', 'Children’s maze'],
  ['الألعاب الإلكترونية', 'Arcades'], ['نقاط الطعام', 'Food points'],
  ['ألعاب القفز الهوائية', 'Inflatable trampolines'], ['قطار العائلة', 'Family coaster'],
  ['ورش الأطفال', 'Children’s workshops'],
];
