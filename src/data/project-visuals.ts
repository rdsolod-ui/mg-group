export type VisualAsset = { src: string; alt: string; ar: string; en: string; kind: 'generated' | 'photo' | 'concept' | 'plan' };
const image = (slug: string) => `visuals/v2/${slug}.webp`;
const generated = (id: string, name: string): VisualAsset => ({
  src: image(id), alt: `${name} — illustrative aerial masterplan`, kind: 'generated',
  ar: 'تصوّر مولّد للمخطط العام؛ توزيع توضيحي، وليس مخططاً تنفيذياً.',
  en: 'Generated masterplan visualization. Interpretive layout, not an as-built plan.',
});
export const projectVisuals: Record<string, VisualAsset[]> = {
  blagoveshchensk: [{...generated('blagoveshchensk', 'Blagoveshchensk planned observation wheel'), ar:'تصور مولّد لعجلة مخططة. لم تُبنَ بعد؛ التصميم وتوزيع الموقع توضيحيان.', en:'Generated concept of a planned wheel. Not yet built; design and site layout are illustrative.'}],
  skazka: [generated('skazka', 'Skazka Park')],
  'leo-tolstoy': [generated('leo-tolstoy', 'Leo Tolstoy Park')],
  vdnkh: [generated('vdnkh', 'VDNKH Attractions')],
  izmaylovo: [generated('izmaylovo', 'Kremlin Izmaylovo')],
  ohta: [generated('ohta', 'Ohta Park')],
  'minny-gorodok': [generated('minny-gorodok', 'Minny Gorodok Park')],
  airport: [{...generated('airport', 'Domodedovo indoor entertainment zone'), alt: 'Photorealistic illustrative airport play zone with children playing and parents supervising'}],
  'al-haffa': [
    {src: image('salalah-coast'), alt: 'Close original drone frame of Salalah Eye showing the full wheel, hub and cabins', kind: 'photo', ar: 'صورة حقيقية من أرشيف المشروع — صلالة، سبتمبر ٢٠٢٦.', en: 'Original project photography — Salalah, September 2026.'},
    {src: image('salalah-dawn'), alt: 'Original dawn drone photograph of Salalah Eye', kind: 'photo', ar: 'صورة حقيقية من أرشيف المشروع — عند الفجر.', en: 'Original project photography — dawn.'},
    {src: image('salalah-palms'), alt: 'Original drone photograph of the wheel and Salalah palm groves', kind: 'photo', ar: 'صورة حقيقية من أرشيف المشروع — الساحل والنخيل.', en: 'Original project photography — coast and palms.'},
    {src: image('salalah-creative'), alt: 'Salalah Eye sunset creative based on original project photography', kind: 'generated', ar: 'تصوّر إبداعي مولّد اعتماداً على صورة حقيقية للمشروع؛ الإضاءة معالجة فنياً.', en: 'Generated creative based on an original project photograph; lighting is an artistic interpretation.'},
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
