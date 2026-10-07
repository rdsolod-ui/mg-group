import ProgressiveImage from "./ProgressiveImage";
const scenes = {
  proof: 'Visitors enjoying a landscaped amusement park at golden hour',
  specialists: 'Technical specialists inspecting a ride gearbox in a workshop',
  lifecycle: 'Engineers reviewing plans beside an observation wheel before launch',
  partnership: 'An international project team discussing a physical park model',
  contact: 'An illuminated waterfront amusement destination at blue hour',
};

export default function ChapterPhoto({ scene }: { scene: keyof typeof scenes }) {
  const path = `/mg-group/visuals/chapters/${scene}`;
  return (
    <figure className={`chapter-photograph photograph-${scene}`} data-generated-photo={scene}>
      <ProgressiveImage src={`${path}.webp`} sizes="(max-width: 900px) 92vw, 47vw" alt={`Generated illustrative photograph: ${scenes[scene]}. Fictional scene.`} />
      <figcaption><span lang="ar" dir="rtl">صورة توضيحية مولّدة</span><span lang="en" dir="ltr">Generated illustration</span></figcaption>
    </figure>
  );
}
