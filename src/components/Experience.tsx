"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import ProgressiveImage from "./ProgressiveImage";
import NetworkPreferences from "./NetworkPreferences";
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
  Sun,
  X,
} from "lucide-react";
import register from "@/data/source-register.json";
import RideShowcase from "./RideShowcase";
import ProjectVisual, { VisualCaption, VisualInspector } from './ProjectVisual';
import PortfolioGlobe from './PortfolioGlobe';
import ChapterPhoto from './ChapterPhoto';
import { PortfolioChart, TeamChart, CountryChart } from './MotionCharts';
import { NetworkScene, ContactSignal } from './MotionScenes';
import useMotionVisibility from './useMotionVisibility';
import NationalFlags from './NationalFlags';
import { projectVisuals } from '@/data/project-visuals';
import { chapterCopy } from '@/data/presentation-copy';

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
  ["globe", "وجهاتنا", "Our destinations"],
  ["skazka", "سكازكا", "Skazka"],
  ["leo-tolstoy", "ليف تولستوي", "Leo Tolstoy"],
  ["vdnkh", "في دي إن خا", "VDNKH"],
  ["izmaylovo", "إزمايلوفو", "Izmaylovo"],
  ["ohta", "أوختا بارك", "Ohta Park"],
  ["minny-gorodok", "ميني غورودوك", "Minny Gorodok"],
  ["al-haffa", "سوق الحافة", "Al Haffa"],
  ["airport", "دوموديدوفو", "Domodedovo"],
  ["blagoveshchensk", "بلاغوفيشتشينسك", "Blagoveshchensk"],
  ["nizwa", "نزوى", "Nizwa"],
  ["riyam", "ريام", "Riyam"],
  ["partnership", "التعاون", "Partnership"],
  ["contact", "المكتب الرئيسي", "Head office"],
];
const caseCopy: Record<
  string,
  {
    name: PairText;
    place: PairText;
    role: PairText;
  }
> = {
  skazka: {
    name: pair("منتزه سكازكا", "Skazka Park"),
    place: pair("موسكو، روسيا", "Moscow, Russia"),
    role: pair("مالك ومشغّل", "Owner & operator"),
  },
  "leo-tolstoy": {
    name: pair("منتزه ليف تولستوي", "Leo Tolstoy Park"),
    place: pair("خيمكي، روسيا", "Khimki, Russia"),
    role: pair("مشغّل", "Operator"),
  },
  vdnkh: {
    name: pair("ألعاب في دي إن خا", "VDNKH Attractions"),
    place: pair("موسكو، روسيا", "Moscow, Russia"),
    role: pair("مشغّل الألعاب", "Ride operator"),
  },
  izmaylovo: {
    name: pair("كرملين إزمايلوفو", "Kremlin Izmaylovo"),
    place: pair("موسكو، روسيا", "Moscow, Russia"),
    role: pair("مالك ومشغّل للمشروع", "Project owner & operator"),
  },
  ohta: {
    name: pair("أوختا بارك", "Ohta Park"),
    place: pair("سانت بطرسبرغ، روسيا", "Saint Petersburg, Russia"),
    role: pair("مالك ومشغّل للمشروع", "Project owner & operator"),
  },
  "minny-gorodok": {
    name: pair("منتزه ميني غورودوك", "Minny Gorodok Park"),
    place: pair("فلاديفوستوك، روسيا", "Vladivostok, Russia"),
    role: pair("مستثمر ومشغّل", "Investor & operator"),
  },
  "al-haffa": {
    name: pair("سوق الحافة", "Al Haffa Market"),
    place: pair("صلالة، سلطنة عُمان", "Salalah, Sultanate of Oman"),
    role: pair("مالك ومشغّل", "Owner & operator"),
  },
  airport: {
    name: pair("منطقة الترفيه في المطار", "Airport Entertainment Zone"),
    place: pair("دوموديدوفو، روسيا", "Domodedovo, Russia"),
    role: pair("مالك ومشغّل", "Owner & operator"),
  },
  blagoveshchensk: {
    name: pair("عجلة بلاغوفيشتشينسك", "Blagoveshchensk observation wheel"),
    place: pair("بلاغوفيشتشينسك، روسيا", "Blagoveshchensk, Russia"),
    role: pair("مشروع مخطط", "Planned project"),
  },
  nizwa: {
    name: pair("عجلة نزوى", "Nizwa observation wheel"),
    place: pair("نزوى، سلطنة عُمان", "Nizwa, Sultanate of Oman"),
    role: pair("مشروع مخطط", "Planned project"),
  },
  riyam: {
    name: pair("منتزه ريام الترفيهي", "Riyam amusement park"),
    place: pair("مسقط، سلطنة عُمان", "Muscat, Sultanate of Oman"),
    role: pair("مشروع مخطط", "Planned project"),
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
  active,
  reduced,
}: {
  project: Project;
  onGallery: (p: Project, image?: number) => void;
  paused: boolean;
  active: boolean;
  reduced: boolean;
}) {
  const c = caseCopy[project.id];
  const construction = project.stageInSource === "under_construction";
  const planned = project.stageInSource === "planned";
  return (
    <>
      <ProjectVisual id={project.id} paused={paused} active={active} reduced={reduced} onExpand={(index) => onGallery(project, index)} />
      <div className="copy case-copy">
        <p className="location case-identity">
          <Pair value={c.name} />
          <Pair value={c.place} className="case-place" />
        </p>
        <Heading {...chapterCopy[project.id].heading} />
        <Pair value={chapterCopy[project.id].body} className="body-copy" />
        <div className="case-metrics">
          <Metric
            value={String(planned && 'plannedWheelCount' in project ? project.plannedWheelCount : project.metrics.attractions.value)}
            ar={planned ? "عجلة مخططة" : project.id === "airport" ? "أنشطة" : ['al-haffa','izmaylovo'].includes(project.id) ? "عجلة مشاهدة" : "ألعاب"}
            en={planned ? "Planned wheel" : project.id === "airport" ? "Activities" : ['al-haffa','izmaylovo'].includes(project.id) ? "Observation wheel" : "Rides"}
          />
          {project.id === 'al-haffa' && <Metric value="2" ar="نقطتا ألعاب" en="Arcade stalls" detail="Shooting gallery · Balloon darts" />}
          {project.metrics.investment.value != null && <Metric
            value={`$${project.metrics.investment.value}m`}
            ar="استثمارات معلنة"
            en="Reported investment"
          />}
          {!construction && !planned && project.metrics.visitation.value != null && (
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
        {planned ? <p className="stage-note"><Pair value={pair("مشروع مخطط، لم يُبنَ بعد. تصور توضيحي؛ الأبعاد والميزانية وموعد الافتتاح لم تُحدّد.", "Planned, not yet built. Illustrative concept; dimensions, budget and opening date are not specified.")} /></p> : construction ? (
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
  const [reduced, setReduced] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notes, setNotes] = useState(false);
  const [gallery, setGallery] = useState<Project | null>(null);
  const [image, setImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const foreground = useMotionVisibility(root, present);
  const mediaPaused = !foreground || menu || notes || !!gallery;
  const motionBlocked = mediaPaused || reduced;
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
      localStorage.removeItem('mg-group-motion');
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
    if (motionBlocked) return;
    const elements = root.current?.querySelectorAll('.chapter.is-active > .visual, .chapter.is-active > .copy');
    if (!elements?.length) return;
    const animations = [...elements].map((element, i) => element.animate(
      [{ opacity: .55, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 650, delay: i * 80, easing: 'cubic-bezier(.22,1,.36,1)' },
    ));
    return () => animations.forEach(animation => animation.cancel());
  }, [active, present, motionBlocked]);
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
        <div className="chapter-atmosphere" aria-hidden="true"><span className="loop-ambient-orbit" /><span className="loop-ambient-glow" /></div>
        {children}
      </section>
    );
  };
  return (
    <div
      ref={root}
      className={`experience ${present ? "is-present" : ""} ${motionBlocked ? "motion-paused" : ""}`}
      data-chapters={chapters.length}
      data-motion={motionBlocked ? 'paused' : 'running'}
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
          {[1, 3, 7, chapters.length - 1].map((i) => (
            <a key={i} href={`#${chapters[i][0]}`} onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault(); go(i);
            }}>
              <Pair
                value={pair(
                  chapters[i][1],
                  i === 7 ? "Projects" : chapters[i][2],
                )}
              />
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <a className="header-pdf" href={asset('downloads/MG-Group-Presentation.pdf')} download="MG-Group-Presentation.pdf" aria-label="تنزيل العرض بصيغة PDF / Download presentation PDF" title="تنزيل PDF / Download PDF">
            <Download size={17} aria-hidden="true"/><span><span lang="ar" dir="rtl">تنزيل PDF</span><small lang="en">Download PDF</small></span>
          </a>
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
              <ProgressiveImage src={asset("visuals/v2/skazka.webp")} sizes="(max-width: 900px) 100vw, 60vw" alt="Skazka Park — generated aerial masterplan visualization" priority />
              <div className="hero-line">
                <NationalFlags compact />
              </div>
              <span className="hero-visual-credit"><span lang="ar" dir="rtl">تصوّر للمخطط العام</span><span lang="en">Illustrative masterplan</span></span>
            </div>
            <div className="copy hero-copy">
              <p className="hero-brand" lang="en" dir="ltr">
                MG Group
              </p>
              <Heading h1 {...chapterCopy.intro.heading} />
              <Pair className="body-copy" value={chapterCopy.intro.body} />
              <div className="hero-bottom">
                <button className="primary-button" onClick={() => go(2)}>
                  <Pair value={pair("شاهدوا خبرتنا الهندسية", "See our engineering expertise")} />
                  <ChevronDown />
                </button>
                <span className="hero-eight" dir="ltr">
                  <b>{register.projects.length}</b>
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
            <div className="visual portfolio-chart-stage">
              <PortfolioChart paused={motionBlocked} reduced={reduced} active={active === 1} />
            </div>
            <div className="copy">
              <Heading {...chapterCopy.proof.heading} />
              <Pair className="body-copy" value={chapterCopy.proof.body} />
              <div className="proof-small proof-context"><Metric value={String(register.projects.length)} ar="مشاريع" en="Projects" /><Metric value="2" ar="بلدان" en="Countries" /></div>
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
                    "البيانات: العرض التعريفي وتحديث المالك في ٧ أكتوبر ٢٠٢٦. لا يشمل الإجمالي المشاريع قيد الإنشاء والمخططة وأنشطة المطار.",
                    "Corporate presentation and owner update, 7 October 2026. Ride total excludes construction-stage and planned projects, and airport activities.",
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
              <ProgressiveImage className="engineering-render" src={asset('visuals/v2/engineering.webp')} sizes="(max-width: 900px) 92vw, 55vw" alt="Actual Skazka observation wheel: central axle, maintenance platform, A-frame supports and radial bracing" />
              <p className="drawing-caption">
                <Pair
                  value={pair(
                    "عجلة المشاهدة في سكازكا — صورة حقيقية من الموقع الرسمي للمنتزه.",
                    "Skazka observation wheel — actual photograph from parkskazka.ru.",
                  )}
                />
              </p>
            </div>
            <div className="copy">
              <Heading {...chapterCopy.engineering.heading} />
              <Pair className="body-copy" value={chapterCopy.engineering.body} />
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
        {section("ride-models", <RideShowcase paused={mediaPaused} reduced={reduced} />, "ride-models-chapter")}
        {section(
          "specialists",
          <>
            <div className="visual assembly-chart-stage">
              <TeamChart paused={motionBlocked} reduced={reduced} active={active === 4} />
            </div>
            <div className="copy">
              <Heading {...chapterCopy.specialists.heading} />
              <Pair className="body-copy" value={chapterCopy.specialists.body} />
              <div className="assembly-context-photo"><ChapterPhoto scene="specialists" /></div>
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
            <div className="visual lifecycle-lines photo-board">
              <ChapterPhoto scene="lifecycle" />
              {[
                pair("استراتيجية وتصميم", "Strategy & design"),
                pair("هندسة وتركيب", "Engineering & installation"),
                pair("إطلاق", "Launch"),
                pair("تشغيل وصيانة", "Operation & maintenance"),
              ].map((v, i) => (
                <article key={v.en} className="loop-step">
                  <span dir="ltr">0{i + 1}</span>
                  <Pair value={v} />
                </article>
              ))}
            </div>
            <div className="copy">
              <Heading {...chapterCopy.lifecycle.heading} />
              <Pair className="body-copy" value={chapterCopy.lifecycle.body} />
              <Pair
                className="body-copy"
                value={pair(
                  "إطار العمل يتكيّف مع المشروع ودور المجموعة: مالك، أو مستثمر، أو مشغّل.",
                  "The scope adapts to the project and the group’s role: owner, investor or operator.",
                )}
              />
              <button className="text-button" onClick={() => go(7)}>
                <Pair
                  value={pair("اكتشفوا المشاريع وراء الأرقام", "See the projects behind the numbers")}
                />
                <ArrowLeft size={20} />
              </button>
            </div>
          </>,
        )}
        {section(
          "geography",
          <>
            <div className="visual assembly-chart-stage">
              <CountryChart paused={motionBlocked} reduced={reduced} active={active === 6} />
            </div>
            <div className="copy">
              <Heading {...chapterCopy.geography.heading} />
              <Pair className="body-copy" value={chapterCopy.geography.body} />
              <div className="assembly-geography-context"><NationalFlags /></div>
              <button className="text-button" onClick={() => go(7)}><Pair value={pair("استكشفوا الوجهات على الكرة الأرضية", "Explore every destination on the globe")} /><ArrowRight size={20}/></button>
              <p className="source-note">
                <Pair
                  value={pair(
                    "١١ مشروعاً، بما فيها المشاريع المخططة في بلاغوفيشتشينسك ونزوى وريام. الإحداثيات مقدّمة من المالك.",
                    "11 projects, including planned Blagoveshchensk, Nizwa and Riyam. GPS points supplied by the owner.",
                  )}
                />
              </p>
            </div>
          </>,
        )}
        {section("globe", <PortfolioGlobe go={(id) => go(chapters.findIndex(c => c[0] === id))} paused={mediaPaused} reduced={reduced} active={active === 7} />, "globe-chapter")}
        {[
          "skazka",
          "leo-tolstoy",
          "vdnkh",
          "izmaylovo",
          "ohta",
          "minny-gorodok",
          "al-haffa",
          "airport",
          "blagoveshchensk",
          "nizwa",
          "riyam",
        ].map((id) =>
          section(
            id,
            <CaseStudy
              project={register.projects.find((p) => p.id === id)!}
              onGallery={enterGallery}
              paused={mediaPaused}
              active={chapters[active][0] === id}
              reduced={reduced}
            />,
            "case-study",
          ),
        )}
        {section(
          "partnership",
          <>
            <div className="visual partnership-board photo-board">
              <ChapterPhoto scene="partnership" />
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
                <img src={asset("brand/al-shahiq.svg")} alt="AL-SHAHIQ" loading="lazy" />
                <NetworkScene />
                <Pair
                  value={pair(
                    "شركة ضمن مجموعة إم جي",
                    "A company within MG Group",
                  )}
                />
              </div>
            </div>
            <div className="copy">
              <Heading {...chapterCopy.partnership.heading} />
              <Pair className="body-copy" value={chapterCopy.partnership.body} />
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
              <button className="text-button" onClick={() => go(chapters.length - 1)}>
                <Pair value={pair("ناقشوا مشروعكم معنا", "Discuss your project")} />
                <ArrowLeft size={20} />
              </button>
            </div>
          </>,
        )}
        {section(
          "contact",
          <>
            <div className="visual contact-photo-card">
              <ChapterPhoto scene="contact" />
              <div className="business-card">
              <div className="card-heading">
                <img src={asset("brand/mg-group.svg")} alt="MG Group" loading="lazy" />
                <ContactSignal />
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
                    loading="lazy"
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
            </div>
            <div className="copy">
              <Heading {...chapterCopy.contact.heading} />
              <Pair className="body-copy" value={chapterCopy.contact.body} />
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
                    "ناقشوا مشروعكم مع خالد",
                    "Discuss your project with Khalid",
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
                    "جهّزوا بيانات مشروعكم",
                    "Prepare your project brief",
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
        <Heading ar="اكتشفوا خبرتنا، فصلاً بفصل." en="Explore the expertise. Chapter by chapter." />
        <NetworkPreferences />
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
        <Heading ar="الأرقام ومصادرها." en="The evidence behind the numbers." />
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
            "زيارة سكازكا تخص عام ٢٠٢٤. فترات الزيارات الأخرى غير مذكورة. المشاريع الثلاثة قيد الإنشاء تُعرض بهذه الصفة حتى تحديث حالتها. بلاغوفيشتشينسك ونزوى وريام مشاريع مخططة وفق المالك؛ لا تدخل في إجمالي الألعاب التشغيلية.",
            "Skazka visitation refers to 2024. Other visitation periods are unspecified. The three construction-stage projects retain that label until their status is updated. Blagoveshchensk, Nizwa and Riyam are owner-confirmed planned projects, excluded from the operating total.",
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
            <p className="gallery-project-name"><Pair value={caseCopy[gallery.id].name} /></p>
            <Heading ar="استكشفوا تفاصيل المشروع." en="Explore the project in detail." />
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
