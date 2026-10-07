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
    heading: { ar: "٩٧ لعبة. والخبرة تتحدث.", en: "97 rides. The experience speaks." },
    body: {
      ar: "٩٧ لعبة في خمسة مشاريع تشغيلية ضمن محفظة من ثمانية مشاريع.",
      en: "97 rides across five operating case studies. Part of an eight-project portfolio.",
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
      ar: "٦٤ متخصصاً فنياً يربطون التصميم بأعمال الموقع، والتركيب بالإطلاق، والصيانة بالتشغيل اليومي.",
      en: "64 technical specialists connecting design to site work, installation to launch, and maintenance to daily operations.",
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
      ar: "ثمانية مشاريع في ستة مواقع. محفظة تربط خبرة المنتزهات في روسيا بمشاريع المجموعة في عُمان.",
      en: "Eight projects across six locations. A portfolio connecting Russian park experience with the group’s projects in Oman.",
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
    heading: { ar: "٣ ألعاب تُكمل تجربة الوجهة.", en: "Three rides. One destination experience." },
    body: {
      ar: "المجموعة مالك ومشغّل لمشروع يربط الألعاب بالتجربة السياحية.",
      en: "The group’s owner-operator role brings attractions into the tourism experience.",
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
      ar: "دور المالك والمشغّل في مشروع على ساحل صلالة. استكشفوا صور الموقع الأصلية ورؤية التطوير.",
      en: "An owner-operator project on Salalah’s coast. Explore original site photography and the development vision.",
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
  typhoon: { ar: "اكتشفوا الهندسة خلف المسار.", en: "Explore the engineering behind the track." },
  lightning: { ar: "خلف كل منعطف، هندسة.", en: "Engineering behind every turn." },
  disco: { ar: "الدوران والحركة يصنعان التجربة.", en: "Spin and motion shape the experience." },
};
