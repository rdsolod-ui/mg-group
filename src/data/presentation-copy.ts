export type BilingualCopy = { ar: string; en: string };
type ChapterCopy = { heading: BilingualCopy; body: BilingualCopy };

// Editorial copy only. Counts, roles, dates and project stages stay in source-register.json.
export const chapterCopy: Record<string, ChapterCopy> = {
  intro: {
    heading: { ar: "نبني مدن الملاهي. وندير تشغيلها.", en: "We build parks. We keep them running." },
    body: {
      ar: "من الهندسة والتركيب إلى الإطلاق والتشغيل اليومي. خبرة عملية يدعمها ١٠ مهندسين و٥٤ ميكانيكياً.",
      en: "From engineering and installation to launch and daily operations. Hands-on expertise backed by 10 engineers and 54 mechanics.",
    },
  },
  proof: {
    heading: { ar: "الخبرة تُثبتها المشاريع.", en: "Expertise. Proven in operation." },
    body: {
      ar: "خمسة مشاريع تشغيلية. من الوجهات العائلية إلى معالم المدن.",
      en: "Five operating case studies. From family destinations to city landmarks.",
    },
  },
  engineering: {
    heading: { ar: "خلف كل تجربة، هندسة دقيقة.", en: "Precision behind every experience." },
    body: {
      ar: "الهندسة والتجميع والتركيب والتنسيق الفني: نربط أعمال الموقع بمتطلبات الإطلاق والتشغيل والصيانة.",
      en: "Engineering, assembly, installation and technical coordination: connecting work on site with the demands of launch, operation and maintenance.",
    },
  },
  "ride-models": {
    heading: { ar: "شاهدوا ما تُحرّكه الهندسة.", en: "See what engineering sets in motion." },
    body: { ar: "فيديوهات من المنتزه ونماذج تصميم قابلة للاستكشاف.", en: "Park films and design models to explore." },
  },
  specialists: {
    heading: { ar: "١٠ مهندسين. ٥٤ ميكانيكياً. فريق واحد.", en: "10 engineers. 54 mechanics. One team." },
    body: {
      ar: "من التركيب إلى الإطلاق، ومن الصيانة إلى التشغيل اليومي.",
      en: "From assembly to launch. From maintenance to daily operation.",
    },
  },
  lifecycle: {
    heading: { ar: "يوم الافتتاح هو البداية.", en: "Opening day is only the beginning." },
    body: {
      ar: "نخطط لما قبل الافتتاح وما بعده: التخطيط المالي واللوجستيات والتنسيق بشأن التصاريح وإدارة المشروع ونموذج التشغيل.",
      en: "Plan for what comes before opening—and what follows: financial planning, logistics, permit coordination, project management and the operating model.",
    },
  },
  geography: {
    heading: { ar: "من موسكو إلى صلالة.", en: "From Moscow to Salalah." },
    body: {
      ar: "ثمانية مشاريع. ستة مواقع. من روسيا إلى عُمان.",
      en: "Eight projects. Six locations. Russia to Oman.",
    },
  },
  skazka: {
    heading: { ar: "٦٠ لعبة. ١٫٥ مليون زيارة في ٢٠٢٤.", en: "60 rides. 1.5m visits in 2024." },
    body: {
      ar: "خبرة المالك والمشغّل على نطاق منتزه كامل، من الألعاب إلى تجربة الزائر.",
      en: "An owner-operator’s perspective on an entire park, from attractions to the visitor experience.",
    },
  },
  "leo-tolstoy": {
    heading: { ar: "٢٧ لعبة. تشغيل متكامل.", en: "27 rides. One coordinated operation." },
    body: {
      ar: "تشغيل منتزه في خيمكي يجمع إدارة الألعاب والخبرة الفنية وتجربة الزائر.",
      en: "Park operations in Khimki: rides, technical expertise and the visitor experience.",
    },
  },
  vdnkh: {
    heading: { ar: "٦ ألعاب. خبرة تشغيل في العاصمة.", en: "Six rides. Capital-city expertise." },
    body: {
      ar: "خبرة فنية لتشغيل الألعاب داخل وجهة حضرية في موسكو.",
      en: "Technical expertise for ride operations within a Moscow destination.",
    },
  },
  izmaylovo: {
    heading: { ar: "عجلة واحدة. أفق جديد للوجهة.", en: "One wheel. A new perspective." },
    body: {
      ar: "نملك ونشغّل عجلة مشاهدة تُكمل التجربة السياحية في كرملين إزمايلوفو.",
      en: "We own and operate an observation wheel within the Kremlin Izmaylovo visitor experience.",
    },
  },
  ohta: {
    heading: { ar: "لعبة واحدة. سبب جديد للزيارة.", en: "One ride. A reason to visit." },
    body: {
      ar: "ملكية وتشغيل لمشروع ترفيهي ضمن وجهة قائمة.",
      en: "Project ownership and operation within an established leisure destination.",
    },
  },
  "minny-gorodok": {
    heading: { ar: "٣٥ لعبة في رؤية تطوير أوسع.", en: "35 rides. A bigger development vision." },
    body: {
      ar: "استثمار وتشغيل ضمن برنامج تطوير في فلاديفوستوك. المشروع قيد الإنشاء وفق المصدر.",
      en: "An investment and operating role in Vladivostok’s development programme. Source status: under construction.",
    },
  },
  "al-haffa": {
    heading: { ar: "ساحل صلالة. منظور جديد للترفيه.", en: "Salalah’s coast. A new perspective." },
    body: {
      ar: "عجلة مشاهدة على ساحل صلالة، وبجوارها لعبتان: الرماية ورمي السهام على البالونات.",
      en: "One observation wheel on Salalah’s coast, with two adjacent arcade stalls: a shooting gallery and balloon darts.",
    },
  },
  airport: {
    heading: { ar: "لنجعل الانتظار جزءاً من التجربة.", en: "Make waiting part of the experience." },
    body: {
      ar: "عشرة أنشطة ترفيهية في برنامج دوموديدوفو. المشروع قيد الإنشاء وفق المحفظة المقدّمة.",
      en: "Ten entertainment activities in the Domodedovo programme. Listed under construction in the supplied portfolio.",
    },
  },
  partnership: {
    heading: { ar: "رؤيتكم. وخبرتنا على أرض الواقع.", en: "Your vision. Our hands-on expertise." },
    body: {
      ar: "منتزه جديد، أو لعبة إضافية، أو وجهة تحتاج إلى تطوير. نحدد نطاق الهندسة والتركيب والتشغيل انطلاقاً من موقعكم وأهدافكم.",
      en: "A new park, an added attraction or a destination to renew. Shape the engineering, installation and operating scope around your site and objectives.",
    },
  },
  contact: {
    heading: { ar: "مشروعكم القادم يبدأ بمحادثة.", en: "Your next park starts with a conversation." },
    body: {
      ar: "شاركوا موقع المشروع ومساحته وجمهوره ومرحلته الحالية. تواصلوا مع خالد في عُمان لمناقشة الخطوة التالية.",
      en: "Share your site, available area, audience and project stage. Speak with Khalid in Oman about the next step.",
    },
  },
};

export const rideHooks: Record<string, BilingualCopy> = {
  wheel: { ar: "الهندسة تمنحكم منظوراً جديداً.", en: "Engineering a new perspective." },
  chain: { ar: "هندسة ترفع مستوى التجربة.", en: "Engineering that lifts the experience." },
  "drop-tower": { ar: "التشويق يبدأ بالدقة.", en: "The thrill starts with precision." },
  condor: { ar: "حركة معقّدة. تجربة واحدة.", en: "Complex motion. One experience." },
  boomerang: { ar: "اندفاع إلى الأمام. وإثارة في العودة.", en: "Full speed ahead. Then back again." },
  lightning: { ar: "خلف كل منعطف، هندسة.", en: "Engineering behind every turn." },
  disco: { ar: "الدوران والحركة يصنعان التجربة.", en: "Spin and motion shape the experience." },
};
