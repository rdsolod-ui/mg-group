export type RideFact = { value: string; ar: string; en: string };
export type RideCard = {
  slug: string; ar: string; en: string; model: boolean; video: boolean;
  parkName?: string; parkNameAr?: string; source?: string; highPlaylist?: string;
  note: string; noteAr: string; facts: RideFact[];
};

// Park specifications describe the operating installation, not the supplied design model.
// Source-page snapshots and media provenance: docs/ride-video-sources.json.
export const rides: RideCard[] = [
  {
    slug:"boomerang",ar:"بوميرانغ",en:"Boomerang",model:true,video:true,
    parkName:"Boomerang",parkNameAr:"بوميرانغ",highPlaylist:"1080p/index.m3u8",
    source:"https://parkskazka.ru/attraktsiony/ekstremalnye/bumerang",
    note:"Film and figures: Boomerang at Skazka. The supplied WFC-20A design model is available for structural inspection; it is not an as-built survey.",
    noteAr:"الفيديو والأرقام لبوميرانغ في سكازكا. نموذج WFC-20A المرفق متاح لاستكشاف الهيكل؛ ولا يمثل توثيقاً مساحياً للمنشأة المنفذة.",
    facts:[{value:"37 m",ar:"الارتفاع",en:"Height"},{value:"85.3 km/h",ar:"السرعة",en:"Speed"},{value:"360°",ar:"حلقة كاملة",en:"Vertical loop"},{value:"130 cm",ar:"الحد الأدنى للطول",en:"Minimum rider height"}],
  },
  {
    slug: "wheel", ar: "عجلة المشاهدة", en: "Observation wheel", model: true, video: false,
    parkName: "Observation wheel", parkNameAr: "عجلة المشاهدة",
    source: "https://parkskazka.ru/attraktsiony/semeynye/koleso-obozreniya",
    note: "Park installation: 24 cabins. Design model: 30 cabins. The source page currently has no video.",
    noteAr: "العجلة في المنتزه: 24 مقصورة. نموذج التصميم: 30 مقصورة. لا يتوفر فيديو في صفحة المصدر حالياً.",
    facts: [{value:"55 m",ar:"الارتفاع",en:"Height"},{value:"6",ar:"ركاب لكل مقصورة",en:"Passengers per cabin"},{value:"14 min",ar:"مدة الدورة",en:"Ride duration"}],
  },
  {
    slug:"chain",ar:"الأراجيح الدوّارة",en:"Swing carousel",model:true,video:true,
    parkName:"Sky carousel",parkNameAr:"الأرجوحة السماوية",
    source:"https://parkskazka.ru/attraktsiony/ekstremalnye/nebesnaya-karusel",
    note:"Film and figures: Sky carousel at Skazka. The design model shows another swing-carousel configuration.",
    noteAr:"الفيديو والأرقام للأرجوحة السماوية في سكازكا. يعرض نموذج التصميم تكويناً آخر للأراجيح الدوّارة.",
    facts:[{value:"40 m",ar:"الارتفاع",en:"Height"},{value:"≤ 7 min",ar:"مدة الجولة",en:"Ride duration"},{value:"130 cm",ar:"الحد الأدنى للطول",en:"Minimum rider height"}],
  },
  {
    slug:"drop-tower",ar:"برج السقوط",en:"Drop tower",model:true,video:true,
    parkName:"Zvezdopad",parkNameAr:"زفيزدوباد",
    source:"https://parkskazka.ru/attraktsiony/ekstremalnye/zvezdopad",
    note:"Film and figures: Zvezdopad at Skazka. The design model illustrates the drop-tower ride family.",
    noteAr:"الفيديو والأرقام لزفيزدوباد في سكازكا. نموذج التصميم يوضّح فئة أبراج السقوط.",
    facts:[{value:"40 m",ar:"الارتفاع",en:"Height"},{value:"≤ 2.5 min",ar:"مدة الجولة",en:"Ride duration"},{value:"105 cm",ar:"الحد الأدنى للطول",en:"Minimum rider height"}],
  },
  {
    slug:"condor",ar:"كوندور",en:"Condor",model:true,video:true,
    parkName:"Smerch",parkNameAr:"سميرتش",
    source:"https://parkskazka.ru/attraktsiony/ekstremalnye/smerch",
    note:"Smerch at Skazka. The design model illustrates the Condor mechanism; its motion is illustrative.",
    noteAr:"سميرتش في سكازكا. نموذج التصميم يوضّح آلية كوندور، والحركة فيه توضيحية.",
    facts:[{value:"34 m",ar:"الارتفاع",en:"Height"},{value:"≤ 3 min",ar:"مدة الجولة",en:"Ride duration"},{value:"140 cm",ar:"الحد الأدنى للطول",en:"Minimum rider height"}],
  },
  {
    slug:"lightning",ar:"مولنيا",en:"Lightning",model:true,video:true,
    parkName:"Lightning",parkNameAr:"مولنيا",highPlaylist:"1080p/index.m3u8",
    source:"https://parkskazka.ru/attraktsiony/ekstremalnye/molniya",
    note:"Lightning at Skazka. Explore the supplied track and support structure in the design view.",
    noteAr:"مولنيا في سكازكا. استكشف نموذج المسار والدعامات في عرض التصميم.",
    facts:[{value:"27 m",ar:"الارتفاع",en:"Height"},{value:"≤ 65 km/h",ar:"السرعة",en:"Speed"},{value:"120 cm",ar:"الحد الأدنى للطول",en:"Minimum rider height"}],
  },
  {
    slug:"disco",ar:"ديسكو كوستر",en:"Disco Coaster",model:false,video:true,
    parkName:"Galaktika",parkNameAr:"غالاكتِيكا",
    source:"https://parkskazka.ru/attraktsiony/ekstremalnye/galaktika",
    note:"Galaktika at Skazka. The supplied placement file contains the surroundings; the ride model is not available.",
    noteAr:"غالاكتِيكا في سكازكا. الملف المرفق يتضمن الموقع المحيط؛ نموذج اللعبة نفسها غير متوفر.",
    facts:[{value:"> 15 m",ar:"الارتفاع",en:"Height"},{value:"100 m",ar:"طول المسار",en:"Track length"},{value:"13.5 m/s",ar:"السرعة",en:"Speed"},{value:"≤ 10 rpm",ar:"سرعة الدوران",en:"Rotation speed"}],
  },
];
