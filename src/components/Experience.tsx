"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  Expand,
  List,
  Minimize2,
  Moon,
  Pause,
  Play,
  Sun,
  X,
} from "lucide-react";
import register from "@/data/source-register.json";
import RideShowcase from "./RideShowcase";
import ProjectVisual, { VisualCaption, VisualInspector } from './ProjectVisual';
import PortfolioGlobe from './PortfolioGlobe';
import { projectVisuals } from '@/data/project-visuals';

const base = "/mg-group";
const asset = (p: string) => `${base}/${p}`;
type Project = (typeof register.projects)[number];
type PairText = { ar: string; en: string };
const pair = (ar: string, en: string): PairText => ({ ar, en });
const chapters = [
  ["intro", "مجموعة إم جي", "MG Group"],
  ["proof", "الخبرة بالأرقام", "Scale"],
  ["engineering", "الهندسة والتركيب", "Engineering"],
  ["ride-models", "الألعاب على أرض الواقع", "Attractions in action"],
  ["specialists", "الفريق الفني", "Specialists"],
  ["lifecycle", "دورة المشروع", "Lifecycle"],
  ["geography", "الجغرافيا", "Geography"],
  ["skazka", "سكازكا", "Skazka"],
  ["leo-tolstoy", "ليف تولستوي", "Leo Tolstoy"],
  ["vdnkh", "في دي إن خا", "VDNKH"],
  ["izmaylovo", "إزمايلوفو", "Izmaylovo"],
  ["ohta", "أوختا بارك", "Ohta Park"],
  ["minny-gorodok", "ميني غورودوك", "Minny Gorodok"],
  ["al-haffa", "سوق الحافة", "Al Haffa"],
  ["airport", "دوموديدوفو", "Domodedovo"],
  ["partnership", "التعاون", "Partnership"],
  ["contact", "المكتب الرئيسي", "Head office"],
];
const caseCopy: Record<
  string,
  {
    name: PairText;
    place: PairText;
    claim: PairText;
    role: PairText;
  }
> = {
  skazka: {
    name: pair("منتزه سكازكا", "Skazka Park"),
    place: pair("موسكو، روسيا", "Moscow, Russia"),
    claim: pair(
      "خبرة متكاملة، على نطاق منتزه كامل.",
      "Full-cycle experience. At the scale of a complete park.",
    ),
    role: pair("مالك ومشغّل", "Owner & operator"),
  },
  "leo-tolstoy": {
    name: pair("منتزه ليف تولستوي", "Leo Tolstoy Park"),
    place: pair("خيمكي، روسيا", "Khimki, Russia"),
    claim: pair(
      "تشغيل الوجهة، وإدارة تجربة الزائر.",
      "Operating the destination. Managing the visitor experience.",
    ),
    role: pair("مشغّل", "Operator"),
  },
  vdnkh: {
    name: pair("ألعاب في دي إن خا", "VDNKH Attractions"),
    place: pair("موسكو، روسيا", "Moscow, Russia"),
    claim: pair(
      "تشغيل فني داخل وجهة حضرية كبيرة.",
      "Technical operations within a major urban destination.",
    ),
    role: pair("مشغّل الألعاب", "Ride operator"),
  },
  izmaylovo: {
    name: pair("كرملين إزمايلوفو", "Kremlin Izmaylovo"),
    place: pair("موسكو، روسيا", "Moscow, Russia"),
    claim: pair(
      "الألعاب كجزء من التجربة السياحية.",
      "Attractions as part of the tourism experience.",
    ),
    role: pair("مالك ومشغّل للمشروع", "Project owner & operator"),
  },
  ohta: {
    name: pair("أوختا بارك", "Ohta Park"),
    place: pair("سانت بطرسبرغ، روسيا", "Saint Petersburg, Russia"),
    claim: pair(
      "وجهة ترفيهية تتكامل مع محيطها.",
      "An attraction integrated into its destination.",
    ),
    role: pair("مالك ومشغّل للمشروع", "Project owner & operator"),
  },
  "minny-gorodok": {
    name: pair("منتزه ميني غورودوك", "Minny Gorodok Park"),
    place: pair("فلاديفوستوك، روسيا", "Vladivostok, Russia"),
    claim: pair("مشروع تطوير واسع النطاق.", "Development at a larger scale."),
    role: pair("مستثمر ومشغّل", "Investor & operator"),
  },
  "al-haffa": {
    name: pair("سوق الحافة", "Al Haffa Market"),
    place: pair("صلالة، سلطنة عُمان", "Salalah, Sultanate of Oman"),
    claim: pair(
      "خبرة المجموعة في سلطنة عُمان.",
      "The group’s experience in Oman.",
    ),
    role: pair("مالك ومشغّل", "Owner & operator"),
  },
  airport: {
    name: pair("منطقة الترفيه في المطار", "Airport Entertainment Zone"),
    place: pair("دوموديدوفو، روسيا", "Domodedovo, Russia"),
    claim: pair(
      "الترفيه خارج حدود المنتزه التقليدي.",
      "Entertainment beyond the traditional park.",
    ),
    role: pair("مالك ومشغّل", "Owner & operator"),
  },
};
function Pair({
  value,
  className = "",
}: {
  value: PairText;
  className?: string;
}) {
  return (
    <span className={`pair ${className}`}>
      <span lang="ar" dir="rtl">
        {value.ar}
      </span>
      <span lang="en" dir="ltr" className="en">
        {value.en}
      </span>
    </span>
  );
}
function Heading({
  ar,
  en,
  h1 = false,
}: {
  ar: string;
  en: string;
  h1?: boolean;
}) {
  const Tag = h1 ? "h1" : "h2";
  return (
    <>
      <Tag lang="ar" dir="rtl">
        {ar}
      </Tag>
      <p className="english-title" lang="en" dir="ltr">
        {en}
      </p>
    </>
  );
}
function Metric({
  value,
  ar,
  en,
  detail,
}: {
  value: string;
  ar: string;
  en: string;
  detail?: string;
}) {
  return (
    <div className="metric">
      <strong dir="ltr">{value}</strong>
      <Pair value={pair(ar, en)} />
      {detail && (
        <small lang="en" dir="ltr">
          {detail}
        </small>
      )}
    </div>
  );
}
function CaseStudy({
  project,
  onGallery,
  paused,
}: {
  project: Project;
  onGallery: (p: Project, image?: number) => void;
  paused: boolean;
}) {
  const c = caseCopy[project.id];
  const construction = project.stageInSource === "under_construction";
  return (
    <>
      <ProjectVisual id={project.id} paused={paused} onExpand={(index) => onGallery(project, index)} />
      <div className="copy case-copy">
        <p className="location">
          <Pair value={c.place} />
        </p>
        <Heading ar={c.name.ar} en={c.name.en} />
        <Pair value={c.claim} className="body-copy" />
        <div className="case-metrics">
          <Metric
            value={String(project.metrics.attractions.value)}
            ar={project.id === "airport" ? "أنشطة" : "ألعاب"}
            en={project.id === "airport" ? "Activities" : "Rides"}
          />
          <Metric
            value={`$${project.metrics.investment.value}m`}
            ar="استثمارات معلنة"
            en="Reported investment"
          />
          {!construction && (
            <Metric
              value={
                project.metrics.visitation.value >= 1000000
                  ? "1.5m"
                  : `${project.metrics.visitation.value / 1000}k`
              }
              ar="زيارات"
              en="Visits"
              detail={
                project.metrics.visitation.period
                  ? "2024"
                  : "Period not specified in source"
              }
            />
          )}
        </div>
        <div className="case-role">
          <Pair value={c.role} />
          <span dir="ltr">{project.openingYearInSource}</span>
        </div>
        {construction ? (
          <p className="stage-note">
            <Pair
              value={pair(
                "الحالة في المصدر: قيد الإنشاء. سنة الافتتاح المذكورة لا تؤكد افتتاح المشروع.",
                "Source status: under construction. The listed opening year does not confirm completion.",
              )}
            />
            {project.id === "minny-gorodok" && (
              <Pair
                value={pair(
                  "نسبة الجاهزية المذكورة: ٩٠٪؛ تاريخ القياس غير مذكور.",
                  "Reported readiness: 90%; measurement date not specified.",
                )}
              />
            )}
          </p>
        ) : (
          <p className="source-note">
            <Pair
              value={pair(
                "بيانات المحفظة المقدّمة؛ الأرقام ليست تحديثاً آنياً.",
                "Supplied portfolio data; figures are not a live update.",
              )}
            />
          </p>
        )}
      </div>
    </>
  );
}
export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [present, setPresent] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notes, setNotes] = useState(false);
  const [gallery, setGallery] = useState<Project | null>(null);
  const [image, setImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const menuDialog = useRef<HTMLDialogElement>(null),
    notesDialog = useRef<HTMLDialogElement>(null),
    galleryDialog = useRef<HTMLDialogElement>(null);
  const go = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(chapters.length - 1, i));
      setMenu(false);
      if (present) {
        setActive(n);
        history.replaceState(null, "", `#${chapters[n][0]}`);
      } else
        document
          .getElementById(chapters[n][0])
          ?.scrollIntoView({
            behavior: reduced ? "instant" : "smooth",
            block: "start",
          });
    },
    [present, reduced],
  );
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    try {
      const t = localStorage.getItem("mg-group-theme");
      if (t === "light" || t === "dark") setTheme(t);
    } catch {}
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("mg-group-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    if (present) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const n = chapters.findIndex((c) => c[0] === visible[0].target.id);
          if (n >= 0) setActive(n);
        }
      },
      { rootMargin: "-20% 0px -25% 0px", threshold: [0, 0.2, 0.5, 0.8] },
    );
    root.current
      ?.querySelectorAll("main>.chapter")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [present]);
  useEffect(() => {
    if (!present || paused || reduced || menu || notes || gallery) return;
    const copy = document.querySelector(".chapter.is-active .copy");
    if (copy) {
      const animation = gsap.fromTo(
        copy,
        { opacity: 0.45 },
        { opacity: 1, duration: 0.45 },
      );
      return () => {
        animation.kill();
        gsap.set(copy, { clearProps: "opacity" });
      };
    }
  }, [active, present, paused, reduced, menu, notes, gallery]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.isComposing ||
        (e.target as HTMLElement)?.closest(
          "input,textarea,select,[contenteditable=true],[data-media-controls]",
        )
      )
        return;
      if (menu || notes || gallery) return;
      if (["ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(active + 1);
      }
      if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(active - 1);
      }
      if (e.key === "Escape") setPresent(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [go, active, menu, notes, gallery]);
  useEffect(() => {
    const sync = (el: HTMLDialogElement | null, open: boolean) => {
      if (open && !el?.open) el?.showModal();
      if (!open && el?.open) el.close();
    };
    sync(menuDialog.current, menu);
    sync(notesDialog.current, notes);
    sync(galleryDialog.current, !!gallery);
  }, [menu, notes, gallery]);
  useEffect(() => {
    const f = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", f);
    return () => document.removeEventListener("fullscreenchange", f);
  }, []);
  const togglePresent = () => {
    setPresent(!present);
    if (!present) window.scrollTo({ top: 0, behavior: "instant" });
    else
      requestAnimationFrame(() =>
        document
          .getElementById(chapters[active][0])
          ?.scrollIntoView({ behavior: "instant" }),
      );
  };
  const enterGallery = (p: Project, image = 0) => {
    setImage(image);
    setGallery(p);
  };
  const section = (id: string, children: React.ReactNode, className = "") => {
    const i = chapters.findIndex((c) => c[0] === id);
    return (
      <section
        key={id}
        id={id}
        className={`chapter ${className} ${active === i ? "is-active" : ""}`}
        aria-label={chapters[i][2]}
        style={present && active !== i ? { display: "none" } : undefined}
      >
        {children}
      </section>
    );
  };
  return (
    <div
      ref={root}
      className={`experience ${present ? "is-present" : ""} ${paused || reduced ? "motion-paused" : ""}`}
      data-chapters={chapters.length}
    >
      <a className="skip" href="#intro">
        انتقل إلى المحتوى · Skip to content
      </a>
      <header className="header" dir="ltr">
        <a
          className="brand"
          href="#intro"
          onClick={(e) => {
            e.preventDefault();
            go(0);
          }}
          aria-label="MG Group home"
        >
          <img
            src={asset(
              theme === "dark"
                ? "brand/mg-group-white.svg"
                : "brand/mg-group.svg",
            )}
            alt="MG Group"
          />
        </a>
        <nav aria-label="Main navigation">
          {[1, 3, 7, 16].map((i) => (
            <button key={i} onClick={() => go(i)}>
              <Pair
                value={pair(
                  chapters[i][1],
                  i === 7 ? "Projects" : chapters[i][2],
                )}
              />
            </button>
          ))}
        </nav>
        <div className="header-tools">
          <button
            className="icon-button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Switch colour theme"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <button
            className="icon-button"
            onClick={() => setMenu(true)}
            aria-label="Open chapter menu"
          >
            <List />
          </button>
        </div>
      </header>
      <main id="content">
        {section(
          "intro",
          <>
            <div className="hero-photo">
              <img
                src={asset("visuals/v2/skazka.webp")}
                srcSet={`${asset('visuals/v2/skazka-640.webp')} 640w, ${asset('visuals/v2/skazka-960.webp')} 960w, ${asset('visuals/v2/skazka.webp')} 1672w`}
                sizes="(max-width: 900px) 100vw, 60vw"
                alt="Skazka Park — generated aerial masterplan visualization"
                fetchPriority="high"
              />
              <div className="hero-line">
                <span>Russia</span>
                <span>Oman</span>
              </div>
              <span className="hero-visual-credit"><span lang="ar" dir="rtl">تصوّر للمخطط العام</span><span lang="en">Illustrative masterplan</span></span>
            </div>
            <div className="copy hero-copy">
              <p className="hero-brand" lang="en" dir="ltr">
                MG Group
              </p>
              <Heading
                h1
                ar="من الهندسة إلى التجربة."
                en="From engineering to experience."
              />
              <Pair
                className="body-copy"
                value={pair(
                  "نطوّر ونركّب ونطلق ونشغّل الوجهات الترفيهية. خبرة المنتزه، من الهيكل إلى تجربة الزائر.",
                  "We develop, install, launch and operate amusement destinations. Park expertise, from the structure to the visitor experience.",
                )}
              />
              <div className="hero-bottom">
                <button className="primary-button" onClick={() => go(2)}>
                  <Pair value={pair("اكتشف خبرتنا", "Explore our expertise")} />
                  <ChevronDown />
                </button>
                <span className="hero-eight" dir="ltr">
                  <b>8</b>
                  <Pair
                    value={pair("مشاريع في المحفظة", "Portfolio projects")}
                  />
                </span>
              </div>
            </div>
          </>,
          "intro",
        )}
        {section(
          "proof",
          <>
            <div className="proof-wall visual">
              <div className="proof-big">
                <strong>97</strong>
                <Pair
                  value={pair(
                    "لعبة في خمسة مشاريع تشغيلية",
                    "Rides across five operating case studies",
                  )}
                />
              </div>
              <div className="proof-small">
                <Metric value="8" ar="مشاريع" en="Projects" />
                <Metric value="2" ar="بلدان" en="Countries" />
              </div>
            </div>
            <div className="copy">
              <Heading
                ar="خبرة تُرى في الأرقام."
                en="Experience you can measure."
              />
              <Pair
                className="body-copy"
                value={pair(
                  "نطاق العمل يجمع المنتزهات المتكاملة والمواقع الحضرية والوجهات السياحية ومناطق الترفيه.",
                  "The portfolio spans complete parks, urban attractions, tourism destinations and entertainment zones.",
                )}
              />
              <div className="single-proof">
                <strong dir="ltr">1.5m</strong>
                <Pair
                  value={pair(
                    "زيارة لمنتزه سكازكا في عام ٢٠٢٤",
                    "Visits to Skazka Park in 2024",
                  )}
                />
              </div>
              <p className="source-note">
                <Pair
                  value={pair(
                    "المصدر: العرض التعريفي. إجمالي ٩٧ يستثني المشاريع الثلاثة المصنّفة قيد الإنشاء، ولا يشمل أنشطة المطار.",
                    "Source: corporate presentation. The 97-ride total excludes three projects labelled under construction and airport activities.",
                  )}
                />
              </p>
            </div>
          </>,
          "proof",
        )}
        {section(
          "engineering",
          <>
            <div className="visual technical-visual">
              <img className="engineering-render" src={asset('visuals/v2/engineering.webp')} srcSet={`${asset('visuals/v2/engineering-640.webp')} 640w, ${asset('visuals/v2/engineering-960.webp')} 960w, ${asset('visuals/v2/engineering.webp')} 1672w`} sizes="(max-width: 900px) 92vw, 55vw" alt="Illustrative wheel drive assembly showing mechanical components, structure and maintenance access" loading="lazy" />
              <p className="drawing-caption">
                <Pair
                  value={pair(
                    "تصوّر هندسي توضيحي؛ ليس مخططاً تصنيعياً.",
                    "Generated engineering illustration; not a fabrication drawing.",
                  )}
                />
              </p>
            </div>
            <div className="copy">
              <Heading
                ar="الهندسة التي تجعل التجربة ممكنة."
                en="Engineering makes the experience possible."
              />
              <Pair
                className="body-copy"
                value={pair(
                  "الخبرة لا تتوقف عند تطوير الموقع. تشمل تركيب الألعاب، وتنسيق الأعمال الفنية، والإطلاق، ثم التشغيل والصيانة.",
                  "Expertise extends beyond site development: ride installation, technical coordination, launch, then operation and maintenance.",
                )}
              />
              <div className="capability-list">
                {[
                  pair(
                    "الهندسة والتنسيق الفني",
                    "Engineering & technical coordination",
                  ),
                  pair("التركيب والتجميع", "Installation & assembly"),
                  pair(
                    "الإطلاق والتشغيل الفني",
                    "Launch & technical operation",
                  ),
                  pair(
                    "الصيانة وتطوير الأداء",
                    "Maintenance & performance development",
                  ),
                ].map((v) => (
                  <div key={v.en}>
                    <Check size={20} />
                    <Pair value={v} />
                  </div>
                ))}
              </div>
            </div>
          </>,
        )}
        {section("ride-models", <RideShowcase paused={paused || menu || notes || !!gallery} reduced={reduced} />, "ride-models-chapter")}
        {section(
          "specialists",
          <>
            <div className="visual specialists-board">
              <div className="team-total">
                <strong dir="ltr">64</strong>
                <Pair value={pair("متخصصاً فنياً", "Technical specialists")} />
              </div>
              <div className="team-type">
                <Pair value={pair("مهندسون", "Engineers")} />
                <strong dir="ltr">10</strong>
              </div>
              <div className="team-type">
                <Pair value={pair("ميكانيكيون", "Mechanics")} />
                <strong dir="ltr">54</strong>
              </div>
            </div>
            <div className="copy">
              <Heading
                ar="المعرفة في أيدي المتخصصين."
                en="Expertise in specialist hands."
              />
              <Pair
                className="body-copy"
                value={pair(
                  "عشرة مهندسين وأربعة وخمسون ميكانيكياً. فريق يربط التصميم بالتركيب والإطلاق والتشغيل اليومي.",
                  "Ten engineers. Fifty-four mechanics. A team connecting design with installation, launch and day-to-day operation.",
                )}
              />
              <div className="specialists-evidence">
                <Metric value="60" ar="لعبة في سكازكا" en="Rides at Skazka" />
                <Metric
                  value="27"
                  ar="لعبة في ليف تولستوي"
                  en="Rides at Leo Tolstoy"
                />
              </div>
              <p className="source-note">
                <Pair
                  value={pair(
                    "أعداد الفريق وفق البيانات المقدّمة في ٦ أكتوبر ٢٠٢٦.",
                    "Team figures supplied on 6 October 2026.",
                  )}
                />
              </p>
            </div>
          </>,
        )}
        {section(
          "lifecycle",
          <>
            <div className="visual lifecycle-lines">
              {[
                pair("استراتيجية وتصميم", "Strategy & design"),
                pair("هندسة وتركيب", "Engineering & installation"),
                pair("إطلاق", "Launch"),
                pair("تشغيل وصيانة", "Operation & maintenance"),
              ].map((v, i) => (
                <article key={v.en}>
                  <span dir="ltr">0{i + 1}</span>
                  <Pair value={v} />
                </article>
              ))}
            </div>
            <div className="copy">
              <Heading
                ar="دورة كاملة. مسؤوليات مترابطة."
                en="One lifecycle. Connected expertise."
              />
              <Pair
                className="body-copy"
                value={pair(
                  "التخطيط المالي، وإدارة المشروع، واللوجستيات، والتنسيق بشأن التصاريح، وبناء نموذج التشغيل.",
                  "Financial planning, project management, logistics, permit coordination and the operating model.",
                )}
              />
              <Pair
                className="body-copy"
                value={pair(
                  "إطار العمل يتكيّف مع المشروع ودور المجموعة: مالك، أو مستثمر، أو مشغّل.",
                  "The scope adapts to the project and the group’s role: owner, investor or operator.",
                )}
              />
              <button className="text-button" onClick={() => go(7)}>
                <Pair
                  value={pair("الدليل في مشاريعنا", "See the project evidence")}
                />
                <ArrowLeft size={20} />
              </button>
            </div>
          </>,
        )}
        {section(
          "geography",
          <>
            <div className="visual">
              <PortfolioGlobe go={go} />
            </div>
            <div className="copy">
              <Heading
                ar="خبرة من روسيا إلى عُمان."
                en="Experience from Russia to Oman."
              />
              <Pair
                className="body-copy"
                value={pair(
                  "موسكو وخيمكي وسانت بطرسبرغ وفلاديفوستوك ودوموديدوفو وصلالة. مواقع مختلفة، وخبرة تربط الهندسة بالتشغيل.",
                  "Moscow, Khimki, Saint Petersburg, Vladivostok, Domodedovo and Salalah. Different settings. Engineering connected with operations.",
                )}
              />
              <div className="geography-metrics">
                <Metric value="8" ar="مشاريع" en="Projects" />
                <Metric
                  value="6"
                  ar="مواقع في المحفظة"
                  en="Portfolio locations"
                />
              </div>
              <p className="source-note">
                <Pair
                  value={pair(
                    "الجغرافيا وفق المحفظة المقدّمة.",
                    "Geography as listed in the supplied portfolio.",
                  )}
                />
              </p>
            </div>
          </>,
        )}
        {[
          "skazka",
          "leo-tolstoy",
          "vdnkh",
          "izmaylovo",
          "ohta",
          "minny-gorodok",
          "al-haffa",
          "airport",
        ].map((id) =>
          section(
            id,
            <CaseStudy
              project={register.projects.find((p) => p.id === id)!}
              onGallery={enterGallery}
              paused={paused || menu || notes || !!gallery}
            />,
            "case-study",
          ),
        )}
        {section(
          "partnership",
          <>
            <div className="visual partnership-board">
              {[
                pair("منتزه جديد", "A new park"),
                pair("تطوير وجهة قائمة", "An existing destination"),
                pair("تركيب وتشغيل الألعاب", "Ride installation & operations"),
              ].map((v) => (
                <article key={v.en}>
                  <Pair value={v} />
                </article>
              ))}
              <div className="group-member">
                <img src={asset("brand/al-shahiq.svg")} alt="AL-SHAHIQ" />
                <Pair
                  value={pair(
                    "شركة ضمن مجموعة إم جي",
                    "A company within MG Group",
                  )}
                />
              </div>
            </div>
            <div className="copy">
              <Heading
                ar="خبرة تتكيّف مع مشروعكم."
                en="Expertise shaped around your project."
              />
              <Pair
                className="body-copy"
                value={pair(
                  "نبدأ من الموقع والهدف ودور الشريك. ثم نحدد نطاق التطوير والهندسة والتركيب والتشغيل المناسب.",
                  "Start with the site, the objective and the partner’s role. Define the right scope for development, engineering, installation and operation.",
                )}
              />
              <div className="capability-list">
                {[
                  pair(
                    "مشروع متكامل من الفكرة إلى التشغيل",
                    "A complete project from concept to operation",
                  ),
                  pair(
                    "تجديد وتطوير مساحة قائمة",
                    "Renewal of an existing space",
                  ),
                  pair(
                    "دعم هندسي وفني وتشغيلي",
                    "Engineering, technical & operational expertise",
                  ),
                ].map((v) => (
                  <div key={v.en}>
                    <Check size={19} />
                    <Pair value={v} />
                  </div>
                ))}
              </div>
              <button className="text-button" onClick={() => go(16)}>
                <Pair value={pair("لنبدأ من موقعكم", "Start with your site")} />
                <ArrowLeft size={20} />
              </button>
            </div>
          </>,
        )}
        {section(
          "contact",
          <>
            <div className="visual business-card">
              <div className="card-heading">
                <img src={asset("brand/mg-group.svg")} alt="MG Group" />
                <span lang="en">Oman</span>
              </div>
              <div className="qr-wrap">
                <a
                  href="https://wa.me/96896100010"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Khalid WhatsApp"
                >
                  <img
                    src={asset("brand/khalid-whatsapp.svg")}
                    alt="WhatsApp QR code for Khalid: +968 9610 0010"
                  />
                </a>
                <div className="card-person">
                  <strong lang="ar">خالد</strong>
                  <strong lang="en" dir="ltr">
                    Khalid
                  </strong>
                  <Pair
                    value={pair("جهة الاتصال في عُمان", "Contact in Oman")}
                  />
                  <a
                    dir="ltr"
                    href="https://wa.me/96896100010"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +968 9610 0010
                  </a>
                </div>
              </div>
              <p className="qr-caption">
                <Pair
                  value={pair(
                    "امسح الرمز للتواصل عبر واتساب",
                    "Scan to open WhatsApp",
                  )}
                />
              </p>
              <div className="card-links">
                <a href={asset("khalid.vcf")} download>
                  <Pair value={pair("حفظ جهة الاتصال", "Save contact")} />
                  <Download size={15} />
                </a>
              </div>
            </div>
            <div className="copy">
              <Heading ar="لنبدأ من موقعكم." en="Let’s start with your site." />
              <Pair
                className="body-copy"
                value={pair(
                  "الموقع، والمساحة، والجمهور المستهدف، والمرحلة الحالية: أساس محادثة عملية حول مشروعكم.",
                  "Location, area, audience and current stage: the starting point for a practical project discussion.",
                )}
              />
              <address>
                <Pair value={pair("المكتب الرئيسي", "Head office")} />
                <p lang="ar" dir="rtl">
                  روسيا، موسكو، شارع أوسينيايا، ٢٣
                </p>
                <p lang="en" dir="ltr">
                  Russia, Moscow, 23 Osennyaya Street
                </p>
              </address>
              <a
                className="primary-button"
                href="https://wa.me/96896100010"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Pair
                  value={pair(
                    "تواصل مع خالد في عُمان",
                    "Contact Khalid in Oman",
                  )}
                />
                <ArrowLeft size={18} />
              </a>
              <a
                className="text-button"
                href={asset("project-brief.txt")}
                download
              >
                <Pair
                  value={pair(
                    "تحميل نموذج بيانات المشروع",
                    "Download a project brief",
                  )}
                />
                <Download size={17} />
              </a>
            </div>
          </>,
          "contact",
        )}
      </main>
      <div className="dock" dir="ltr">
        <div className="chapter-count">
          <strong>{String(active + 1).padStart(2, "0")}</strong>
          <span> / {chapters.length}</span>
        </div>
        <Pair value={pair(chapters[active][1], chapters[active][2])} />
        <div className="dock-progress">
          <span
            style={{ width: `${((active + 1) / chapters.length) * 100}%` }}
          />
        </div>
        <div className="dock-controls">
          <button
            className="icon-button"
            aria-label="Previous chapter"
            disabled={active === 0}
            onClick={() => go(active - 1)}
          >
            <ArrowLeft />
          </button>
          <button
            className="icon-button"
            aria-label="Next chapter"
            disabled={active === chapters.length - 1}
            onClick={() => go(active + 1)}
          >
            <ArrowRight />
          </button>
          <button
            className="present-button"
            onClick={togglePresent}
            aria-pressed={present}
          >
            {present ? "Exit" : "Present"}
          </button>
          <button
            className="icon-button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Resume motion" : "Pause motion"}
            aria-pressed={paused}
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <button
            className="icon-button fullscreen"
            aria-label="Toggle fullscreen"
            onClick={() => {
              if (document.fullscreenElement)
                document.exitFullscreen().catch(() => {});
              else document.documentElement.requestFullscreen().catch(() => {});
            }}
          >
            {fullscreen ? <Minimize2 size={18} /> : <Expand size={18} />}
          </button>
          <button className="notes-button" onClick={() => setNotes(true)}>
            Notes
          </button>
        </div>
      </div>
      <dialog
        ref={menuDialog}
        className="dialog menu-dialog"
        onCancel={() => setMenu(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenu(false);
        }}
      >
        <button
          className="dialog-close"
          onClick={() => setMenu(false)}
          aria-label="Close chapter menu"
        >
          <X />
        </button>
        <Heading ar="فصول العرض" en="Presentation chapters" />
        <div className="chapter-menu">
          {chapters.map((c, i) => (
            <button key={c[0]} onClick={() => go(i)}>
              <span dir="ltr">{String(i + 1).padStart(2, "0")}</span>
              <Pair value={pair(c[1], c[2])} />
            </button>
          ))}
        </div>
      </dialog>
      <dialog
        ref={notesDialog}
        className="dialog"
        onCancel={() => setNotes(false)}
      >
        <button
          className="dialog-close"
          onClick={() => setNotes(false)}
          aria-label="Close portfolio notes"
        >
          <X />
        </button>
        <Heading ar="ملاحظات المحفظة" en="Portfolio notes" />
        <Pair
          className="body-copy"
          value={pair(
            "المصدر: العرض التعريفي MG GROUP CORP، المكوّن من عشر صفحات، المقدّم من مالك المشروع. لم يُذكر تاريخ تحديثه.",
            "Source: the owner-supplied, ten-page MG GROUP CORP presentation. Its update date is not specified.",
          )}
        />
        <Pair
          className="body-copy"
          value={pair(
            "أدوار المجموعة والاستثمارات وعدد الألعاب وفق المصدر. لا تعني الاستثمارات المعلنة قيمة الشركة أو أن المجموعة موّلتها بالكامل.",
            "Group roles, investments and ride counts follow the source. Reported investments are not a business valuation or proof of funding solely by MG Group.",
          )}
        />
        <Pair
          className="body-copy"
          value={pair(
            "زيارة سكازكا تخص عام ٢٠٢٤. فترات الزيارات الأخرى غير مذكورة. المشاريع الثلاثة قيد الإنشاء تُعرض بهذه الصفة حتى تحديث حالتها.",
            "Skazka visitation refers to 2024. Other visitation periods are unspecified. The three construction-stage projects retain that label until their status is updated.",
          )}
        />
        <Pair
          className="body-copy"
          value={pair(
            "أعداد الفريق قدّمها مالك المشروع في ٦ أكتوبر ٢٠٢٦: ١٠ مهندسين و٥٤ ميكانيكياً، أي ٦٤ متخصصاً فنياً.",
            "Team figures supplied by the project owner on 6 October 2026: 10 engineers and 54 mechanics, 64 technical specialists in total.",
          )}
        />
      </dialog>
      <dialog
        ref={galleryDialog}
        className="dialog gallery-dialog"
        onCancel={() => setGallery(null)}
      >
        <button
          className="dialog-close"
          onClick={() => setGallery(null)}
          aria-label="Close gallery"
        >
          <X />
        </button>
        {gallery && (
          <>
            <h2 lang="en" dir="ltr">
              {caseCopy[gallery.id].name.en}
            </h2>
            <VisualInspector key={`${gallery.id}-${image}`} visual={projectVisuals[gallery.id][image]} />
            <div className="gallery-thumbs">
              {projectVisuals[gallery.id].map((m, i) => (
                <button
                  key={m.src}
                  onClick={() => setImage(i)}
                  aria-label={`View image ${i + 1}: ${m.alt}`}
                  aria-pressed={image === i}
                >
                  <img src={asset(m.src.replace('.webp', '-640.webp'))} alt="" />
                </button>
              ))}
            </div>
            <VisualCaption visual={projectVisuals[gallery.id][image]} />
          </>
        )}
      </dialog>
    </div>
  );
}
