import {
  siJavascript,
  siTypescript,
  siReact,
  siNextdotjs,
  siAngular,
  siGraphql,
  siNodedotjs,
  siNestjs,
  siSpringboot,
  siFlutter,
  siOpenjdk,
  siRedis,
  siPostgresql,
  siMysql,
  siDocker,
  siKubernetes,
  siGit,
  siJunit5,
} from "simple-icons";

export type SkillIcon = {
  title: string;
  slug: string;
  path: string;
  hex: string;
};

// Grid 3x6 — una tecla por icono en el teclado 3D.
// Los taglines están en lib/i18n.ts bajo `keyboard.taglines.<slug>`.
export const SKILLS_GRID: readonly (readonly SkillIcon[])[] = [
  [siJavascript, siTypescript, siReact, siNextdotjs, siAngular, siGraphql],
  [siNodedotjs, siNestjs, siSpringboot, siFlutter, siOpenjdk, siRedis],
  [siPostgresql, siMysql, siDocker, siKubernetes, siGit, siJunit5],
] as const;

export const SKILLS_FLAT: readonly SkillIcon[] = SKILLS_GRID.flat();
