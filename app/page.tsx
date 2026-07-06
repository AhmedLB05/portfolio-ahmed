"use client";

import { useState } from "react";
import FrozenKeyboard from "@/components/FrozenKeyboard";
import SmoothScroll from "@/components/smooth-scroll";
import Reveal from "@/components/Reveal";
import SectionNav from "@/components/SectionNav";
import CopyEmail from "@/components/CopyEmail";
import SeasonPicker from "@/components/SeasonPicker";
import ProjectModal, {
  type ProjectDetail,
} from "@/components/ProjectModal";
import { useLanguage } from "@/components/LanguageProvider";
import { useIsMobile } from "@/lib/useIsMobile";
import { SKILLS_FLAT } from "@/lib/skills";
import type { Lang } from "@/lib/i18n";

// Email de contacto de Ahmed
const EMAIL = "ahmedlhabri26@gmail.com";

// Tipo para contenido localizado (se mantiene para compatibilidad con la plantilla,
// aunque el portfolio es solo en inglés el campo es necesario en ambas claves)
type Localised = { es: string; en: string };

type Project = ProjectDetail & {
  align: "left" | "right";
  section: "project1" | "project2" | "project3" | "project4";
};

// ─────────────────────────────────────────────
// PROYECTOS — Edita este array para añadir tus proyectos reales.
// Cada entrada soporta: name, stack, desc, details, url, github, media, highlights, badge, align, section
// ─────────────────────────────────────────────
const projects: Project[] = [
  {
    num: "01",
    name: {
      es: "Hospital Kiosk Survey System",
      en: "Hospital Kiosk Survey System",
    },
    stack: ["NestJS", "TypeScript", "Docker", "LDAP", "MySQL"],
    desc: {
      es: "Sistema backend de microservicios para terminales kiosco hospitalarios de encuestas.",
      en: "Backend microservices system for hospital patient-satisfaction kiosk terminals.",
    },
    details: {
      es: "Sistema de microservicios con NestJS y TypeScript desplegado en producción real en entorno sanitario. Logramos cero incidencias en las primeras 4 semanas. Integración con autenticación LDAP y gestión de API Keys. Migraciones de base de datos ejecutadas simultáneamente en MySQL, PostgreSQL y MariaDB sin pérdida de datos.",
      en: "Backend microservices system built with NestJS & TypeScript for hospital patient-satisfaction kiosk terminals. Deployed to a real healthcare production environment achieving zero incidents in the first four weeks. Integrated LDAP authentication and API Key inter-service security, and ran versioned database migrations simultaneously across MySQL, PostgreSQL and MariaDB.",
    },
    highlights: ["nestjs", "typescript", "docker", "mysql", "redis"],
    badge: { es: "Internship · Quantion", en: "Internship · Quantion" },
    align: "left",
    section: "project1",
  },
  {
    num: "02",
    name: {
      es: "Ultimate FIFA App",
      en: "Ultimate FIFA App",
    },
    stack: ["Flutter", "Dart", "Spring Boot", "AWS", "Docker"],
    desc: {
      es: "App móvil end-to-end con backend en AWS y cliente cross-platform en Flutter.",
      en: "Full-stack mobile app with AWS backend and cross-platform Flutter client.",
    },
    details: {
      es: "Aplicación móvil full-stack diseñada y desplegada en solitario, logrando <200 ms de latencia media en producción. El backend es una API REST en Java Spring Boot con Hibernate/JPA. El cliente cross-platform está construido en Flutter. La infraestructura en AWS utiliza orquestación con Docker, DynamoDB como capa NoSQL, y auto-scaling para manejar carga real.",
      en: "Full-stack mobile application designed and deployed solo end-to-end, achieving <200 ms average API latency in production. Java Spring Boot with Hibernate/JPA powers the REST API backend. Flutter delivers the cross-platform client with Provider for state management. The AWS infrastructure uses Docker orchestration, DynamoDB as the NoSQL layer and auto-scaling to handle real load conditions.",
    },
    github: "https://github.com/AhmedLB05/Ultimate-Fifa-App",
    highlights: ["springboot", "flutter", "kubernetes", "docker", "openjdk"],
    badge: { es: "Personal Project", en: "Personal Project" },
    align: "right",
    section: "project2",
  },
  {
    num: "03",
    name: {
      es: "CrossFit REST API",
      en: "CrossFit REST API",
    },
    stack: ["Node.js", "Express", "JavaScript", "REST API"],
    desc: {
      es: "API REST para gestión de ejercicios de CrossFit con filtros completos y CRUD.",
      en: "REST API for CrossFit exercises management with advanced filtering and CRUD.",
    },
    details: {
      es: "Backend API RESTful para la gestión de rutinas y ejercicios de CrossFit. Implementa operaciones CRUD completas (crear, leer, actualizar, borrar) y capacidades avanzadas de filtrado para recuperar rutinas y ejercicios específicos. Arquitectura basada en controladores y rutas con Node.js y Express.",
      en: "RESTful API backend for managing CrossFit routines and exercises. Implements complete CRUD operations (create, read, update, delete) and advanced filtering capabilities to retrieve specific routines and exercises. Built using a robust controller-router architecture with Node.js and Express.",
    },
    github: "https://github.com/AhmedLB05/CrossFit_API_Backend-Mejoras",
    highlights: ["nodedotjs", "javascript", "graphql"],
    align: "left",
    section: "project3",
  },
  {
    num: "04",
    name: {
      es: "Audio Guide Web App",
      en: "Audio Guide Web App",
    },
    stack: ["Flutter Web", "Dart", "Firebase", "Web Admin"],
    desc: {
      es: "Panel de administración web para un sistema de audioguías de museo.",
      en: "Web administration panel for a museum audio guide system.",
    },
    details: {
      es: "Proyecto Final de Grado (TFG) — Panel de administración web construido para gestionar un sistema de audioguías. Desarrollado utilizando Flutter para web, permitiendo a los administradores gestionar el contenido del museo, subir pistas de audio, organizar rutas y dar soporte a múltiples idiomas. Desplegado dinámicamente usando Vercel.",
      en: "Final Degree Project (TFG) — A web administration panel built to manage an audio guide system. Developed using Flutter for the web, it allows administrators to manage museum content, upload audio tracks, organize routes, and support multiple languages seamlessly. Dynamically deployed using Vercel.",
    },
    github: "https://github.com/AhmedLB05/WEB-AUDIOGUIA-AHMED",
    url: "https://web-audioguia.vercel.app",
    highlights: ["flutter"],
    badge: { es: "Final Degree Project", en: "Final Degree Project" },
    align: "right",
    section: "project4",
  },
];

// ─────────────────────────────────────────────
// EXPERIENCIA LABORAL
// ─────────────────────────────────────────────
const experiences: Array<{
  role: Localised;
  badge?: Localised;
  company: string;
  period: Localised;
  location: Localised;
  summary: Localised;
  bullets: Localised[];
  stack: string[];
}> = [
  {
    role: { es: "Backend & Full Stack Developer", en: "Backend & Full Stack Developer" },
    badge: { es: "Internship", en: "Internship" },
    company: "Quantion",
    period: { es: "Mar 2026 — Jun 2026", en: "Mar 2026 — Jun 2026" },
    location: { es: "Spain", en: "Spain" },
    summary: {
      es: "Worked in a real production environment within the healthcare sector. Built and refactored backend services under a microservices architecture, improving performance and reliability for hospital-grade software deployed across multiple database environments simultaneously.",
      en: "Worked in a real production environment within the healthcare sector. Built and refactored backend services under a microservices architecture, improving performance and reliability for hospital-grade software deployed across multiple database environments simultaneously.",
    },
    bullets: [
      {
        es: "Reduced server response processing time by ~30% by refactoring NestJS + TypeScript services into a microservices architecture with decoupled endpoints and in-memory caching.",
        en: "Reduced server response processing time by ~30% by refactoring NestJS + TypeScript services into a microservices architecture with decoupled endpoints and in-memory caching.",
      },
      {
        es: "Delivered a survey system for hospital kiosks with 0 incidents in the first 4 weeks of production, integrating LDAP authentication, API Key management, and CI/CD via Docker.",
        en: "Delivered a survey system for hospital kiosks with 0 incidents in the first 4 weeks of production, integrating LDAP authentication, API Key management, and CI/CD via Docker.",
      },
      {
        es: "Ensured data integrity across 3+ simultaneous environments (MySQL, PostgreSQL, MariaDB) by applying versioned migrations and regression testing with JUnit 5, eliminating data loss between staging and production.",
        en: "Ensured data integrity across 3+ simultaneous environments (MySQL, PostgreSQL, MariaDB) by applying versioned migrations and regression testing with JUnit 5, eliminating data loss between staging and production.",
      },
    ],
    stack: ["NestJS", "TypeScript", "MySQL", "PostgreSQL", "MariaDB", "Docker", "JUnit 5", "LDAP"],
  },
  {
    role: { es: "Full Stack Developer", en: "Full Stack Developer" },
    badge: { es: "Personal Project", en: "Personal Project" },
    company: "Independent · Mobile App",
    period: { es: "Jan 2026 — Mar 2026", en: "Jan 2026 — Mar 2026" },
    location: { es: "Remote", en: "Remote" },
    summary: {
      es: "Designed and deployed a full end-to-end mobile application in production, taking sole responsibility for backend architecture, cloud infrastructure, CI/CD, and mobile client development using a modern Java + Flutter stack on AWS.",
      en: "Designed and deployed a full end-to-end mobile application in production, taking sole responsibility for backend architecture, cloud infrastructure, CI/CD, and mobile client development using a modern Java + Flutter stack on AWS.",
    },
    bullets: [
      {
        es: "Deployed a full end-to-end mobile app in production with <200 ms average API latency, using Java Spring Boot + Hibernate/JPA on the backend and Flutter on the client, orchestrated on AWS with Docker.",
        en: "Deployed a full end-to-end mobile app in production with <200 ms average API latency, using Java Spring Boot + Hibernate/JPA on the backend and Flutter on the client, orchestrated on AWS with Docker.",
      },
      {
        es: "Achieved >99% uptime during the testing period using DynamoDB as the NoSQL layer and configuring auto-scaling on AWS, simulating real load conditions with automated tests.",
        en: "Achieved >99% uptime during the testing period using DynamoDB as the NoSQL layer and configuring auto-scaling on AWS, simulating real load conditions with automated tests.",
      },
      {
        es: "Reduced deployment cycle to a single command by designing a CI/CD pipeline with Docker and automated build scripts, applying DevOps principles from the first iteration.",
        en: "Reduced deployment cycle to a single command by designing a CI/CD pipeline with Docker and automated build scripts, applying DevOps principles from the first iteration.",
      },
    ],
    stack: ["Java", "Spring Boot", "Flutter", "Dart", "AWS", "DynamoDB", "Docker", "PostgreSQL"],
  },
];

function pick<T>(loc: { es: T; en: T }, lang: Lang): T {
  return loc[lang];
}

// Animación de entrada del nombre en el hero: cada palabra sube por separado
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
  const isMobile = useIsMobile();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <SmoothScroll>
      <div className="relative">
        {/* Desktop: escena 3D fija detrás del contenido.
            En móvil el canvas vive dentro del hero y hace scroll con él. */}
        {!isMobile && (
          <div className="fixed inset-0 z-0">
            <FrozenKeyboard />
          </div>
        )}

        {/* Header */}
        <header className="fixed top-0 inset-x-0 z-50 px-6 sm:px-10 md:px-14 py-5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <span
              data-cursor="hover"
              className="text-sm font-semibold tracking-tight text-ice-100 whitespace-nowrap"
            >
              Ahmed Lhaouchi
            </span>
            <span className="hidden md:inline-flex">
              <span className="status-pill">{t("header.availability")}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <SeasonPicker />
            <span className="hidden md:inline-flex">
              <a
                href="https://github.com/AhmedLB05"
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
            </span>
            {/* El selector de idioma está oculto: portfolio solo en inglés */}
          </div>
        </header>

        <SectionNav />

        <main className="relative z-10 pointer-events-none">
          {/* Hero */}
          <section
            data-kb-section="hero"
            className="min-h-screen flex flex-col justify-center p-6 sm:p-10 md:p-14"
          >
            {/* Teclado 3D solo en móvil (dentro del hero, hace scroll) */}
            {isMobile && (
              <div className="w-full h-[34vh] mt-12 -mb-4 pointer-events-auto">
                <FrozenKeyboard mobile />
              </div>
            )}
            <div className="mt-2 md:mt-20">
              <p
                className="text-[11px] uppercase tracking-[0.3em] text-ice-300 mb-5 fade-in-up"
                style={{ ["--d" as string]: "0ms" }}
              >
                {t("hero.greeting")}
              </p>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-bold tracking-[-0.03em] text-ice-50 leading-[0.92] whitespace-nowrap">
                <HeroWord text="Ahmed" delay={120} />
                <br />
                <HeroWord text="Lhaouchi Briki" delay={260} className="text-ice-400" />
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
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
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
                <button
                  type="button"
                  data-cursor="hover"
                  data-magnetic
                  className="frost-btn"
                  onClick={() =>
                    document
                      .querySelector<HTMLElement>(
                        '[data-kb-section="contact"]'
                      )
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  {t("hero.hire")}
                </button>
                {/* En móvil los iconos de redes van a su propia fila */}
                <div className="basis-full h-0 md:hidden" aria-hidden />
                <a
                  href="https://www.linkedin.com/in/ahmedlb/"
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
                  href="https://github.com/AhmedLB05"
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
              </div>
            </div>

            {/* Indicador de scroll animado */}
            <div
              className="mt-10 md:mt-auto flex items-center gap-3 fade-in-up"
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

          {/* Tech Stack */}
          <section
            data-kb-section="stack"
            className="relative md:min-h-[200vh] p-6 sm:p-10 md:p-14"
          >
            <div className="relative md:h-[150vh]">
              <div className="md:sticky md:top-28 text-center">
                <Reveal>
                  <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-[-0.03em] text-ice-50 leading-[0.95]">
                    {t("stack.title")}
                  </h2>
                </Reveal>
                <Reveal delay={120}>
                  <p className="mt-3 text-sm sm:text-base text-ice-400">
                    <span className="hidden md:inline">{t("stack.hint")}</span>
                    <span className="md:hidden">{t("stack.hintMobile")}</span>
                  </p>
                </Reveal>
              </div>

              {/* Grid de skills en móvil (sustituto del teclado hover) */}
              {isMobile && (
                <div className="md:hidden mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pointer-events-auto">
                  {SKILLS_FLAT.map((s) => (
                    <div
                      key={s.slug}
                      className="flex items-start gap-3 rounded-xl bg-ink-1/70 backdrop-blur-sm border border-ink-3 p-4"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill={`#${s.hex}`}
                        className="flex-none mt-0.5"
                        aria-hidden
                      >
                        <path d={s.path} />
                      </svg>
                      <div>
                        <p className="text-ice-50 font-medium text-sm">
                          {s.title}
                        </p>
                        <p className="text-ice-400 text-xs mt-0.5 leading-snug">
                          {t(`keyboard.taglines.${s.slug}`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Experience */}
          <section
            data-kb-section="experience"
            className="relative p-6 sm:p-10 md:p-14 pb-24"
          >
            <div className="sticky top-24 sm:top-28 text-center mb-12 sm:mb-16 z-0">
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

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
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
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-mono text-xs text-ice-100 px-3 py-1 rounded-full border border-ice-700/70 bg-ink-2/60 whitespace-nowrap">
                        {pick(exp.period, lang)}
                      </span>
                      {exp.badge && (
                        <span className="text-[10px] uppercase tracking-widest text-ice-300 border border-ice-700 rounded-full px-2 py-0.5">
                          {pick(exp.badge, lang)}
                        </span>
                      )}
                    </div>
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
              data-kb-highlights={(p.highlights ?? []).join(",")}
              className="relative py-20 md:min-h-screen flex items-center p-6 sm:p-10 md:p-14 overflow-hidden"
            >
              <span
                aria-hidden
                className={`watermark hidden md:block top-1/2 -translate-y-1/2 ${
                  p.align === "left" ? "right-[-2vw]" : "left-[-2vw]"
                }`}
              >
                {p.num}
              </span>

              <div
                className={
                  p.align === "left"
                    ? "max-w-xl relative"
                    : "max-w-xl relative md:ml-auto md:text-right md:mr-16 lg:mr-24"
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
                        ? "flex flex-wrap gap-1.5 md:justify-end pointer-events-auto mb-5"
                        : "flex flex-wrap gap-1.5 pointer-events-auto mb-5"
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
                <Reveal delay={320}>
                  <div
                    className={
                      p.align === "right"
                        ? "flex md:justify-end pointer-events-auto"
                        : "flex pointer-events-auto"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setActiveProject(p)}
                      data-cursor="hover"
                      data-magnetic
                      className="frost-btn"
                    >
                      {t("projects.viewMore")}
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </Reveal>
              </div>
            </section>
          ))}

          {/* Contact */}
          <section
            data-kb-section="contact"
            className="relative py-24 md:min-h-screen flex flex-col justify-center p-6 sm:p-10 md:p-14 overflow-hidden"
          >
            <div className="max-w-xl relative">
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
                <div className="flex flex-wrap gap-3 pointer-events-auto">
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
                    href="https://github.com/AhmedLB05"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="frost-btn"
                  >
                    {t("contact.github")}
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ahmedlb/"
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

        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      </div>
    </SmoothScroll>
  );
}
