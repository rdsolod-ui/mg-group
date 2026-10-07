import type { VisualAsset } from './project-visuals';
export const skazkaSlides = [
  { id:'wheel', ar:'عجلة المشاهدة', en:'Observation wheel' },
  { id:'boomerang', ar:'بوميرانغ', en:'Boomerang' },
  { id:'lightning', ar:'مولنيا', en:'Lightning' },
  { id:'sky-carousel', ar:'الأرجوحة السماوية', en:'Sky carousel' },
  { id:'galaxy', ar:'غالاكتيكا', en:'Galaxy' },
  { id:'kraken', ar:'كراكن', en:'Kraken' },
].map(item=>({...item,thumb:`visuals/skazka-summer/${item.id}-thumb.webp`,visual:{
  src:`visuals/skazka-summer/${item.id}.webp`,kind:'generated',
  alt:`${item.en} at Skazka Park — summer creative based on an official park photograph`,
  ar:'معالجة إبداعية بالذكاء الاصطناعي لصور المنتزه الأصلية؛ أجواء الصيف والزوار معدّلة.',
  en:'AI-enhanced official park photography. Summer atmosphere and visitors edited.',
} satisfies VisualAsset}));
