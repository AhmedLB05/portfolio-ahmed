// Capa i18n minimalista: diccionario plano con clave por punto.
// El portfolio de Ahmed está en inglés únicamente.
// El idioma por defecto y único es "en".
export type Lang = "es" | "en";

export const LANGUAGES: Lang[] = ["en"];
export const DEFAULT_LANG: Lang = "en";

type Leaf = Record<Lang, string>;
type Node = Leaf | { [key: string]: Node };

function isLeaf(node: Node): node is Leaf {
  return typeof (node as Leaf).es === "string";
}

export const DICT = {
  picker: {
    season: { es: "Season", en: "Season" },
    language: { es: "Language", en: "Language" },
  },
  seasons: {
    spring: { es: "Spring", en: "Spring" },
    summer: { es: "Summer", en: "Summer" },
    autumn: { es: "Autumn", en: "Autumn" },
    winter: { es: "Winter", en: "Winter" },
  },
  nav: {
    aria: { es: "Sections", en: "Sections" },
    home: { es: "Home", en: "Home" },
    stack: { es: "Stack", en: "Stack" },
    experience: { es: "Experience", en: "Experience" },
    project: { es: "Project", en: "Project" },
    contact: { es: "Contact", en: "Contact" },
  },
  header: {
    availability: {
      es: "Open to opportunities",
      en: "Open to opportunities",
    },
  },
  hero: {
    greeting: { es: "Hi, I am", en: "Hi, I am" },
    roleLine: {
      es: "FullStack Developer.",
      en: "FullStack Developer.",
    },
    tagline: {
      es: "Building scalable web & mobile apps from backend to frontend.",
      en: "Building scalable web & mobile apps from backend to frontend.",
    },
    cv: { es: "Download CV", en: "Download CV" },
    hire: { es: "Contact me", en: "Contact me" },
    scroll: { es: "Scroll to explore", en: "Scroll to explore" },
    keysHint: {
      es: "· hover over the keys",
      en: "· hover over the keys",
    },
  },
  stack: {
    title: { es: "Tech Stack", en: "Tech Stack" },
    hint: {
      es: "(hint: hover over a key)",
      en: "(hint: hover over a key)",
    },
    hintMobile: {
      es: "The tools I build with.",
      en: "The tools I build with.",
    },
  },
  experience: {
    title: { es: "Experience", en: "Experience" },
    subtitle: {
      es: "My professional journey.",
      en: "My professional journey.",
    },
  },
  projects: {
    kicker: { es: "project", en: "project" },
    viewMore: { es: "View more", en: "View more" },
    openSite: { es: "Visit site", en: "Visit site" },
    viewCode: { es: "View code", en: "View code" },
    close: { es: "Close", en: "Close" },
    stackLabel: { es: "Stack", en: "Stack" },
    overview: { es: "Overview", en: "Overview" },
  },
  contact: {
    kicker: { es: "contact", en: "contact" },
    title: { es: "Let's talk?", en: "Let's talk?" },
    body: {
      es: "If something you've seen interests you, I'm just one message away. Let's build something great together.",
      en: "If something you've seen interests you, I'm just one message away. Let's build something great together.",
    },
    copyEmail: { es: "Copy email", en: "Copy email" },
    openMail: { es: "Open mailto", en: "Open mailto" },
    github: { es: "GitHub", en: "GitHub" },
    linkedin: { es: "LinkedIn", en: "LinkedIn" },
    emailToast: { es: "Email copied", en: "Email copied" },
    footer: {
      es: "© 2026 Ahmed Lhaouchi Briki. All rights reserved.",
      en: "© 2026 Ahmed Lhaouchi Briki. All rights reserved.",
    },
  },
  keyboard: {
    taglines: {
      javascript: {
        es: "Where it all started. Still here, still in charge.",
        en: "Where it all started. Still here, still in charge.",
      },
      typescript: {
        es: "Same JS, with a seatbelt.",
        en: "Same JS, with a seatbelt.",
      },
      react: {
        es: "Components, components, components.",
        en: "Components, components, components.",
      },
      nextdotjs: {
        es: "React all grown up: routing, SSR, edge.",
        en: "React all grown up: routing, SSR, edge.",
      },
      angular: {
        es: "Component-based. Opinionated. Enterprise-ready.",
        en: "Component-based. Opinionated. Enterprise-ready.",
      },
      nodedotjs: {
        es: "JavaScript on the server.",
        en: "JavaScript on the server.",
      },
      nestjs: {
        es: "Node with structure. TypeScript all the way.",
        en: "Node with structure. TypeScript all the way.",
      },
      springboot: {
        es: "Java backend, production-hardened.",
        en: "Java backend, production-hardened.",
      },
      flutter: {
        es: "One codebase. Every screen.",
        en: "One codebase. Every screen.",
      },
      openjdk: {
        es: "Java's open engine. Production-hardened.",
        en: "Java's open engine. Production-hardened.",
      },
      postgresql: {
        es: "The boring database that always works.",
        en: "The boring database that always works.",
      },
      mysql: {
        es: "Relational, reliable, battle-tested.",
        en: "Relational, reliable, battle-tested.",
      },
      docker: {
        es: "Same on my machine, same in production.",
        en: "Same on my machine, same in production.",
      },
      kubernetes: {
        es: "Orchestration at cloud scale.",
        en: "Orchestration at cloud scale.",
      },
      git: {
        es: "History and a time machine for your code.",
        en: "History and a time machine for your code.",
      },
      graphql: {
        es: "Query exactly what you need.",
        en: "Query exactly what you need.",
      },
      redis: {
        es: "In-memory speed at scale.",
        en: "In-memory speed at scale.",
      },
      junit5: {
        es: "Battle-tested testing.",
        en: "Battle-tested testing.",
      },
    },
  },
} as const satisfies Record<string, Node>;

// Resuelve un path con puntos en el diccionario para el idioma dado.
export function translate(path: string, lang: Lang): string {
  const parts = path.split(".");
  let ref: Node = DICT as unknown as Node;
  for (const p of parts) {
    if (isLeaf(ref)) return path;
    ref = (ref as { [key: string]: Node })[p];
    if (ref === undefined) return path;
  }
  if (isLeaf(ref)) return ref[lang] ?? ref.en ?? path;
  return path;
}
