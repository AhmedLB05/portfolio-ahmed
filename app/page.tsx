"use client";

import FrozenKeyboard from "@/components/FrozenKeyboard";
import SmoothScroll from "@/components/smooth-scroll";
import Reveal from "@/components/Reveal";
import SectionNav from "@/components/SectionNav";
import CopyEmail from "@/components/CopyEmail";
import SeasonPicker from "@/components/SeasonPicker";
import LanguagePicker from "@/components/LanguagePicker";
import { useLanguage } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/i18n";

const EMAIL = "josemariaalberobelamendia@gmail.com";

// Localised content lives in `{ es, en }` objects inside these arrays so the
// page can be a straightforward array.map() at render time. Tech names stay
// as plain strings (they're brand names, not localised).
type Localised = { es: string; en: string };

const projects: Array<{
  num: string;
  name: Localised;
  stack: string[];
  desc: Localised;
  badge?: Localised;
  align: "left" | "right";
  section: "project1" | "project2" | "project3";
}> = [
  {
    num: "01",
    name: {
      es: "Contestador IA de Reseñas Google",
      en: "AI Responder for Google Reviews",
    },
    stack: ["Python", "OpenAI API", "Google Business API"],
    desc: {
      es: "Sistema automatizado que genera respuestas personalizadas a reseñas de Google My Business usando IA, manteniendo el tono de marca.",
      en: "Automated system that generates personalised replies to Google My Business reviews using AI, keeping the brand tone consistent.",
    },
    align: "left",
    section: "project1",
  },
  {
    num: "02",
    name: {
      es: "Control de Temperaturas APPCC",
      en: "HACCP Temperature Control",
    },
    stack: ["Next.js", "React", "PostgreSQL", "Docker"],
    desc: {
      es: "App para restaurantes que digitaliza el registro de temperaturas de frigoríficos y genera informes automáticos para inspecciones sanitarias.",
      en: "App for restaurants that digitises fridge temperature logs and auto-generates reports for food safety inspections.",
    },
    badge: { es: "En desarrollo", en: "In progress" },
    align: "right",
    section: "project2",
  },
  {
    num: "03",
    name: {
      es: "Gestor de Finanzas Personales",
      en: "Personal Finance Tracker",
    },
    stack: ["React", "Node.js", "PostgreSQL"],
    desc: {
      es: "Dashboard para seguimiento de ingresos, gastos y objetivos de ahorro con visualizaciones gráficas e informes mensuales.",
      en: "Dashboard for tracking income, expenses and savings goals with visual charts and monthly reports.",
    },
    align: "left",
    section: "project3",
  },
];

const experiences: Array<{
  role: Localised;
  company: string;
  period: Localised;
  location: Localised;
  summary: Localised;
  bullets: Localised[];
  stack: string[];
}> = [
  {
    role: { es: "Tech Lead", en: "Tech Lead" },
    company: "Activalink",
    period: { es: "2023 — Presente", en: "2023 — Present" },
    location: { es: "Alcoy, España", en: "Alcoy, Spain" },
    summary: {
      es: "Activalink implementa y adapta ERPs para pymes y grandes empresas. Desarrollo módulos y personalizaciones custom sobre Odoo, integraciones a medida y proyectos de implantación llave en mano. Lidero un equipo de 3 desarrolladores: nuestro trabajo se mide en tiempo ahorrado y errores evitados.",
      en: "Activalink implements and customises ERPs for SMBs and large companies. I build custom modules and personalisations on top of Odoo, bespoke integrations, and end-to-end implementation projects. I lead a team of 3 developers: our work is measured in time saved and errors avoided.",
    },
    bullets: [
      {
        es: "OCR de facturas en Odoo — de 4 h/día a 30 min (−87 %).",
        en: "Invoice OCR in Odoo — from 4 h/day down to 30 min (−87 %).",
      },
      {
        es: "Logística con mapa interactivo — −60 % errores de seguimiento.",
        en: "Interactive logistics map — −60 % tracking errors.",
      },
      {
        es: "Conciliación automática — cierre contable de 3 días a medio día.",
        en: "Automated reconciliation — monthly close from 3 days to half a day.",
      },
      {
        es: "Dashboards financieros — detección temprana de facturas sin emitir.",
        en: "Financial dashboards — early detection of uninvoiced orders.",
      },
    ],
    stack: ["Odoo", "Python", "PostgreSQL", "Next.js", "TypeScript", "Docker"],
  },
];

function pick<T>(loc: { es: T; en: T }, lang: Lang): T {
  return loc[lang];
}

// Hero name split per word so each can rise independently. Whitespace
// preserved as its own span so the line wraps naturally if needed.
function HeroWord({
  text,
  delay,
  className = "",
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  return (
    <span className={`hero-word ${className}`}>
      <span style={{ animationDelay: `${delay}ms` }}>{text}</span>
    </span>
  );
}

export default function Home() {
  const { t, lang } = useLanguage();

  return (
    <SmoothScroll>
      <div className="relative">
        {/* Persistent 3D scene — fullscreen behind content; events must reach it. */}
        <div className="fixed inset-0 z-0">
          <FrozenKeyboard />
        </div>

        {/* Header */}
        <header className="fixed top-0 inset-x-0 z-50 px-6 sm:px-10 md:px-14 py-5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <span
              data-cursor="hover"
              className="text-sm font-semibold tracking-tight text-ice-100"
            >
              Txema Albero
            </span>
            <span className="status-pill hidden sm:inline-flex">
              {t("header.availability")}
            </span>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <SeasonPicker />
            <a
              href="https://github.com/Txemalon/3d-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="frost-btn !py-1.5 !px-3 !text-xs"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>GitHub</span>
            </a>
            <LanguagePicker />
          </div>
        </header>

        <SectionNav />

        <main className="relative z-10 pointer-events-none">
          {/* Hero */}
          <section
            data-kb-section="hero"
            className="min-h-screen flex flex-col justify-center p-6 sm:p-10 md:p-14"
          >
            <div className="mt-20">
              <p
                className="text-[11px] uppercase tracking-[0.3em] text-ice-300 mb-5 fade-in-up"
                style={{ ["--d" as string]: "0ms" }}
              >
                {t("hero.greeting")}
              </p>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-bold tracking-[-0.03em] text-ice-50 leading-[0.92] whitespace-nowrap">
                <HeroWord text="Txema" delay={120} />
                <br />
                <HeroWord text="Albero" delay={260} className="text-ice-400" />
              </h1>
              <p
                className="mt-8 text-base sm:text-lg md:text-xl text-ice-200 max-w-xl leading-relaxed fade-in-up"
                style={{ ["--d" as string]: "520ms" }}
              >
                {t("hero.roleLine")}
                <br />
                {t("hero.tagline")}
              </p>

              {/* CTAs */}
              <div
                className="mt-10 flex flex-wrap items-center gap-3 pointer-events-auto fade-in-up"
                style={{ ["--d" as string]: "700ms" }}
              >
                <a
                  href="#"
                  data-cursor="hover"
                  data-magnetic
                  className="frost-btn frost-btn--primary"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
                    <path d="M14 3v5h5" />
                  </svg>
                  {t("hero.cv")}
                </a>
                <a
                  href={`mailto:${EMAIL}?subject=Hire%20me`}
                  data-cursor="hover"
                  data-magnetic
                  className="frost-btn"
                >
                  {t("hero.hire")}
                </a>
                <a
                  href="https://github.com/Txemalon"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  data-magnetic
                  className="frost-icon"
                  aria-label="GitHub"
                >
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/txemalon"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  data-magnetic
                  className="frost-icon"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.59c0-1.57-.03-3.6-2.19-3.6-2.19 0-2.53 1.71-2.53 3.48V22H7.62V8z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/Txemalon"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  data-magnetic
                  className="frost-icon"
                  aria-label="X / Twitter"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
                    <path d="M17.18 3H20.5l-7.36 8.41L21.75 21h-6.62l-5.18-6.78L4.04 21H.7l7.86-8.97L0 3h6.78l4.69 6.21L17.18 3zm-1.16 16.13h1.84L6.06 4.79H4.09l11.93 14.34z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Animated scroll indicator at bottom */}
            <div
              className="mt-auto flex items-center gap-3 fade-in-up"
              style={{ ["--d" as string]: "900ms" }}
            >
              <span className="scroll-indicator">
                <span>{t("hero.scroll")}</span>
                <span className="scroll-indicator__rail" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-ice-400 hidden sm:inline">
                {t("hero.keysHint")}
              </span>
            </div>
          </section>

          {/* Stack */}
          <section
            data-kb-section="stack"
            className="relative min-h-[200vh] p-6 sm:p-10 md:p-14"
          >
            <div className="relative h-[150vh]">
              <div className="sticky top-24 sm:top-28 text-center">
                <Reveal>
                  <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[-0.03em] text-ice-50 leading-[0.95]">
                    {t("stack.title")}
                  </h2>
                </Reveal>
                <Reveal delay={120}>
                  <p className="mt-3 text-sm sm:text-base text-ice-400">
                    {t("stack.hint")}
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section
            data-kb-section="experience"
            className="relative p-6 sm:p-10 md:p-14 pb-32 min-h-[140vh]"
          >
            <div className="sticky top-24 sm:top-28 text-center mb-12 sm:mb-16 z-10">
              <Reveal>
                <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[-0.03em] text-ice-50 leading-[0.95]">
                  {t("experience.title")}
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-3 text-sm sm:text-base text-ice-300">
                  {t("experience.subtitle")}
                </p>
              </Reveal>
            </div>

            <div className="max-w-3xl mx-auto space-y-6 relative">
              {experiences.map((exp, idx) => (
                <Reveal
                  key={`${exp.company}-${idx}`}
                  delay={idx * 120}
                  as="article"
                  className="relative rounded-2xl bg-ink-1/75 backdrop-blur-md border border-ink-3 p-6 sm:p-8 md:p-10 pointer-events-auto shadow-[0_8px_40px_-20px_rgba(0,0,0,0.6)]"
                >
                  <header className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-ice-50 tracking-tight">
                        {pick(exp.role, lang)}
                      </h3>
                      <p className="text-ice-400 font-medium mt-1">
                        {exp.company}
                        <span className="text-ice-500/80 font-normal">
                          {" · "}
                          {pick(exp.location, lang)}
                        </span>
                      </p>
                    </div>
                    <span className="font-mono text-xs text-ice-100 px-3 py-1 rounded-full border border-ice-700/70 bg-ink-2/60 whitespace-nowrap">
                      {pick(exp.period, lang)}
                    </span>
                  </header>

                  <p className="text-ice-200 leading-relaxed mb-5">
                    {pick(exp.summary, lang)}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {exp.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-ice-100 leading-relaxed"
                      >
                        <span className="mt-[0.65em] flex-none w-1.5 h-1.5 rounded-full bg-ice-400" />
                        <span>{pick(b, lang)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.stack.map((s) => (
                      <span
                        key={s}
                        data-cursor="hover"
                        className="frost-chip"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Projects */}
          {projects.map((p) => (
            <section
              key={p.num}
              data-kb-section={p.section}
              className="relative min-h-screen flex items-center p-6 sm:p-10 md:p-14 overflow-hidden"
            >
              <span
                aria-hidden
                className={`watermark top-1/2 -translate-y-1/2 ${
                  p.align === "left" ? "right-[-2vw]" : "left-[-2vw]"
                }`}
              >
                {p.num}
              </span>

              <div
                className={
                  p.align === "left"
                    ? "max-w-xl relative"
                    : "max-w-xl ml-auto text-right relative"
                }
              >
                <Reveal>
                  <p className="font-mono text-sm text-ice-400 mb-3">
                    {p.num} · {t("projects.kicker")}
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-ice-50 leading-[1.05] mb-4">
                    {pick(p.name, lang)}
                  </h2>
                </Reveal>
                {p.badge ? (
                  <Reveal delay={140}>
                    <span className="inline-block text-[10px] uppercase tracking-widest text-ice-300 border border-ice-700 rounded-full px-2 py-0.5 mb-4">
                      {pick(p.badge, lang)}
                    </span>
                  </Reveal>
                ) : null}
                <Reveal delay={180}>
                  <p className="text-base sm:text-lg text-ice-200 leading-relaxed mb-6">
                    {pick(p.desc, lang)}
                  </p>
                </Reveal>
                <Reveal delay={260}>
                  <div
                    className={
                      p.align === "right"
                        ? "flex flex-wrap gap-1.5 justify-end pointer-events-auto"
                        : "flex flex-wrap gap-1.5 pointer-events-auto"
                    }
                  >
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        data-cursor="hover"
                        className="frost-chip"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>
          ))}

          {/* Contact */}
          <section
            data-kb-section="contact"
            className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 overflow-hidden"
          >
            <span aria-hidden className="watermark top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-60">
              05
            </span>
            <div className="text-center max-w-2xl relative">
              <Reveal>
                <p className="font-mono text-sm text-ice-400 mb-3">
                  {t("contact.kicker")}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-ice-50 mb-6">
                  {t("contact.title")}
                </h2>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-ice-200 mb-10">{t("contact.body")}</p>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap gap-3 justify-center pointer-events-auto">
                  <CopyEmail
                    email={EMAIL}
                    className="frost-btn frost-btn--primary"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                    {t("contact.copyEmail")}
                  </CopyEmail>
                  <a
                    href={`mailto:${EMAIL}`}
                    data-cursor="hover"
                    className="frost-btn"
                  >
                    {t("contact.openMail")}
                  </a>
                  <a
                    href="https://github.com/Txemalon"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="frost-btn"
                  >
                    {t("contact.github")}
                  </a>
                  <a
                    href="https://linkedin.com/in/txemalon"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="frost-btn"
                  >
                    {t("contact.linkedin")}
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={320}>
              <p className="mt-14 text-[11px] uppercase tracking-[0.25em] text-ice-400">
                {t("contact.footer")}
              </p>
            </Reveal>
          </section>
        </main>
      </div>
    </SmoothScroll>
  );
}
