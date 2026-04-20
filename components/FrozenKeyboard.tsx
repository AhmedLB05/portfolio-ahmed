"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  OrbitControls,
  Text,
  Text3D,
} from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useSeason } from "@/components/SeasonProvider";
import { useLanguage } from "@/components/LanguageProvider";
import * as THREE from "three";
import {
  siCss,
  siDocker,
  siGit,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siOdoo,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  siVuedotjs,
} from "simple-icons";

const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const subscribeMobile = () => () => {};
const getMobileSnapshot = () => mobileRegex.test(navigator.userAgent);
const getMobileServerSnapshot = () => false;
function useIsMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getMobileServerSnapshot
  );
}

// Per-section keyboard "states" — same idea as Naresh's animated-background-
// config.ts, but for our R3F keyboard. Values are tweened toward via lerp
// inside useFrame; the active section is detected via IntersectionObserver
// on elements carrying data-kb-section.
type KeyboardState = {
  yaw: number; // rotation.y
  pitch: number; // rotation.x
  roll: number; // rotation.z
  posX: number;
  posY: number;
  posZ: number;
  scale: number;
};

const SECTION_STATES: Record<string, KeyboardState> = {
  hero: {
    yaw: Math.PI * 0.15,
    pitch: Math.PI * 0.18,
    roll: Math.PI * 0.025,
    posX: 0,
    posY: 0,
    posZ: 0,
    scale: 1,
  },
  stack: {
    // Naresh's reference: keyboard lives in the lower-right, moderate
    // isometric tilt — enough yaw to show the left face but not so much
    // pitch that the base wall takes over the silhouette.
    yaw: Math.PI * 0.40,
    pitch: Math.PI * 0.14,
    roll: -Math.PI * -0.13,
    posX: -0.8,
    posY: -0.6,
    posZ: 0,
    scale: 1.3,
  },
  project1: {
    yaw: -Math.PI * 0.22,
    pitch: Math.PI * 0.16,
    roll: -Math.PI * 0.04,
    posX: -0.2,
    posY: 0.2,
    posZ: 0,
    scale: 0.85,
  },
  project2: {
    yaw: Math.PI * 0.28,
    pitch: Math.PI * 0.12,
    roll: Math.PI * 0.05,
    posX: 0.4,
    posY: 0.2,
    posZ: 0,
    scale: 0.85,
  },
  project3: {
    yaw: -Math.PI * 0.18,
    pitch: Math.PI * 0.2,
    roll: -Math.PI * 0.025,
    posX: -0.2,
    posY: 0.2,
    posZ: 0,
    scale: 0.85,
  },
  experience: {
    yaw: Math.PI * 0.3,
    pitch: Math.PI * 0.08,
    roll: 0,
    posX: 0.6,
    posY: 0.05,
    posZ: 0,
    scale: 0.95,
  },
  contact: {
    yaw: Math.PI * 0.4,
    pitch: -Math.PI * 0.05,
    roll: 0,
    posX: 0,
    posY: 0.6,
    posZ: -1,
    scale: 0.7,
  },
};

// Track which data-kb-section element is currently most prominent on-screen.
// Returns both a state value (for conditional rendering of overlays like
// the Tech Stack callout) and a ref (for hot path useFrame reads without
// re-render churn).
function useActiveSection(): [string, React.RefObject<string>] {
  const [section, setSection] = useState<string>("hero");
  const ref = useRef<string>("hero");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const visibility = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.intersectionRatio);
        }
        let bestRatio = 0;
        let bestSection = ref.current;
        for (const [el, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestSection =
              (el as HTMLElement).dataset.kbSection ?? bestSection;
          }
        }
        if (bestSection !== ref.current) {
          ref.current = bestSection;
          setSection(bestSection);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    const targets = document.querySelectorAll<HTMLElement>("[data-kb-section]");
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return [section, ref];
}

// Taglines are now resolved via the i18n dictionary (keyboard.taglines.<slug>),
// keyed by the simple-icons slug on each key. See lib/i18n.ts.

function makeRoundedRectShape(
  width: number,
  depth: number,
  cornerRadius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const w = width / 2;
  const d = depth / 2;
  const r = Math.min(cornerRadius, w, d);
  shape.moveTo(-w + r, -d);
  shape.lineTo(w - r, -d);
  shape.quadraticCurveTo(w, -d, w, -d + r);
  shape.lineTo(w, d - r);
  shape.quadraticCurveTo(w, d, w - r, d);
  shape.lineTo(-w + r, d);
  shape.quadraticCurveTo(-w, d, -w, d - r);
  shape.lineTo(-w, -d + r);
  shape.quadraticCurveTo(-w, -d, -w + r, -d);
  return shape;
}

function createExtrudedBox(
  width: number,
  depth: number,
  height: number,
  cornerRadius: number,
  bevelSize: number,
  topScale = 1
): THREE.BufferGeometry {
  const shape = makeRoundedRectShape(width, depth, cornerRadius);
  const extrudeDepth = Math.max(0.001, height - 2 * bevelSize);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeDepth,
    bevelEnabled: bevelSize > 0,
    bevelThickness: bevelSize,
    bevelSize: bevelSize,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 12,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -height / 2 + bevelSize, 0);

  if (topScale !== 1) {
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + height / 2) / height;
      const factor = THREE.MathUtils.lerp(1, topScale, t);
      pos.setX(i, pos.getX(i) * factor);
      pos.setZ(i, pos.getZ(i) * factor);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  return geometry;
}

// Render a simple-icons SVG path into a square CanvasTexture.
function makeIconTexture(
  svgPath: string,
  color: string,
  size = 256
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const iconTargetSize = Math.round(size * 0.62);
  const scale = iconTargetSize / 24;
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(svgPath));
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

const FRAME_TARGET: [number, number, number] = [-1.0, 0, 0];

type SkillIcon = { title: string; slug: string; path: string; hex: string };

const SKILLS: readonly (readonly SkillIcon[])[] = [
  [siJavascript, siTypescript, siHtml5, siCss, siTailwindcss],
  [siPython, siReact, siNextdotjs, siVuedotjs, siNodedotjs],
  [siPhp, siOdoo, siPostgresql, siDocker, siGit],
] as const;

const COLS = 5;
const ROWS = 3;
const KEYCAP_SIZE = 0.4;
const KEYCAP_HEIGHT = 0.28;
const KEYCAP_TOP_SCALE = 0.78;
const COL_SPACING = 0.42;
const ROW_SPACING = 0.42;
const BASE_WIDTH = 2.4;
const BASE_DEPTH = 1.4;
const BASE_HEIGHT = 0.26;
const ICON_PLANE_SIZE = KEYCAP_SIZE * KEYCAP_TOP_SCALE * 0.78;
const PRESS_DEPTH = 0.15;

// Mechanical keyboard "tock" synthesized on the fly. Mixes a short bandpass-
// filtered noise burst (the click) with a fast low-frequency thump. One
// AudioContext per tab, lazily created on first play.
// Browsers block audio until a real user gesture (click/keydown) — pointerover
// does not count in Chrome. A one-shot unlock listener resumes the context on
// the first real interaction so every subsequent hover plays immediately.
let audioCtx: AudioContext | null = null;
let audioUnlockInstalled = false;
function installAudioUnlock() {
  if (audioUnlockInstalled || typeof window === "undefined") return;
  audioUnlockInstalled = true;
  const unlock = () => {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: false });
  window.addEventListener("keydown", unlock, { once: false });
  window.addEventListener("touchstart", unlock, { once: false });
}
// Two pre-decoded samples (press / release) — pick one at random on each
// hover for variety. Fetched + decoded once on first play; subsequent hovers
// just spawn a fresh BufferSource (cheap, can overlap).
const KEY_SOUND_URLS = [
  "/sounds/switch_press.mp3",
  "/sounds/switch_release.mp3",
] as const;
const keySoundBuffers: (AudioBuffer | null)[] = [null, null];
let keySoundsLoading: Promise<void> | null = null;
function loadKeySounds(ctx: AudioContext): Promise<void> {
  if (keySoundsLoading) return keySoundsLoading;
  keySoundsLoading = Promise.all(
    KEY_SOUND_URLS.map((url, i) =>
      fetch(url)
        .then((r) => r.arrayBuffer())
        .then((buf) => ctx.decodeAudioData(buf))
        .then((decoded) => {
          keySoundBuffers[i] = decoded;
        })
        .catch(() => {
          /* keep null; playKeyClick will pick the other sample */
        })
    )
  ).then(() => undefined);
  return keySoundsLoading;
}

function playKeyClick(seed = 0) {
  if (typeof window === "undefined") return;
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      audioCtx = new Ctor();
      installAudioUnlock();
    }
    const ctx = audioCtx;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
      return;
    }
    const trigger = () => {
      const available = keySoundBuffers.filter(
        (b): b is AudioBuffer => b !== null
      );
      if (available.length === 0) return;
      const buffer =
        available[Math.floor(Math.random() * available.length)];
      // Per-key playback rate detune (±4%) keeps repeated presses lively.
      const detune =
        1 + (((seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 0.08;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.playbackRate.value = detune;
      const gain = ctx.createGain();
      gain.gain.value = 0.7;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    };
    if (keySoundBuffers.some((b) => b !== null)) {
      trigger();
    } else {
      loadKeySounds(ctx).then(trigger);
    }
  } catch {
    // Audio failure must never break the 3D scene.
  }
}

function Keycap({
  geometry,
  position,
  isMobile,
  icon,
  onHoverChange,
  hovered,
}: {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  isMobile: boolean;
  icon: SkillIcon;
  onHoverChange: (hovered: boolean) => void;
  hovered: boolean;
}) {
  const pressRef = useRef<THREE.Group>(null);
  const pressY = useRef(0);

  const iconTexture = useMemo(
    () => makeIconTexture(icon.path, `#${icon.hex}`),
    [icon.path, icon.hex]
  );

  useEffect(() => {
    return () => iconTexture.dispose();
  }, [iconTexture]);

  useFrame(() => {
    if (!pressRef.current) return;
    const target = hovered ? -PRESS_DEPTH : 0;
    pressY.current = THREE.MathUtils.lerp(pressY.current, target, 0.18);
    pressRef.current.position.y = pressY.current;
  });

  const handleOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHoverChange(true);
    },
    [onHoverChange]
  );
  const handleOut = useCallback(() => onHoverChange(false), [onHoverChange]);

  const iconY = KEYCAP_HEIGHT / 2 + 0.0015;

  return (
    <group position={position}>
      <group ref={pressRef}>
        <mesh
          geometry={geometry}
          onPointerOver={handleOver}
          onPointerOut={handleOut}
        >
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0}
            roughness={0.32}
            clearcoat={isMobile ? 0 : 0.5}
            clearcoatRoughness={0.18}
            metalness={0}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh
          position={[0, iconY, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <planeGeometry args={[ICON_PLANE_SIZE, ICON_PLANE_SIZE]} />
          <meshBasicMaterial
            map={iconTexture}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Keyboard() {
  const ref = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();
  const { palette } = useSeason();
  const { t } = useLanguage();
  const [activeSection, activeSectionRef] = useActiveSection();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  // Mutable holders for the smoothed target — kept off React state so
  // useFrame can read them every tick without triggering re-renders.
  const current = useRef<KeyboardState>({ ...SECTION_STATES.hero });

  // Drive global cursor + click SFX from the single Keyboard instance.
  useEffect(() => {
    document.body.style.cursor = hoveredKey ? "pointer" : "auto";
    if (hoveredKey) {
      const [row, col] = hoveredKey.split("-").map(Number);
      playKeyClick(row * COLS + col);
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hoveredKey]);

  useEffect(() => {
    if (ref.current) ref.current.rotation.order = "YXZ";
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const target =
      SECTION_STATES[activeSectionRef.current] ?? SECTION_STATES.hero;
    // Frame-rate-independent lerp: ~0.06 per 16ms tick = a satisfying ease.
    const k = 1 - Math.pow(0.001, delta);
    const c = current.current;
    c.yaw = THREE.MathUtils.lerp(c.yaw, target.yaw, k);
    c.pitch = THREE.MathUtils.lerp(c.pitch, target.pitch, k);
    c.roll = THREE.MathUtils.lerp(c.roll, target.roll, k);
    c.posX = THREE.MathUtils.lerp(c.posX, target.posX, k);
    c.posY = THREE.MathUtils.lerp(c.posY, target.posY, k);
    c.posZ = THREE.MathUtils.lerp(c.posZ, target.posZ, k);
    c.scale = THREE.MathUtils.lerp(c.scale, target.scale, k);

    // Idle motion layered on top. Hero gets a wide cinematic yoyo so the
    // keyboard "shows itself"; other sections keep a quiet breathing.
    const isHero = activeSectionRef.current === "hero";
    const yawSwing = isHero ? 0.5 : 0.025;
    const pitchSwing = isHero ? 0.07 : 0.0;
    const rollSwing = isHero ? 0.05 : 0.0;
    const period = isHero ? 9 : 20; // seconds per full cycle
    const w = (Math.PI * 2) / period;
    ref.current.rotation.y = c.yaw + Math.sin(t * w) * yawSwing;
    ref.current.rotation.x = c.pitch + Math.sin(t * w * 0.6) * pitchSwing;
    ref.current.rotation.z = c.roll + Math.sin(t * w * 0.8) * rollSwing;
    ref.current.position.x = c.posX;
    ref.current.position.y = c.posY + Math.sin(t * 0.6) * 0.04;
    ref.current.position.z = c.posZ;
    ref.current.scale.setScalar(c.scale);
  });

  const keycapGeom = useMemo(
    () =>
      createExtrudedBox(
        KEYCAP_SIZE,
        KEYCAP_SIZE,
        KEYCAP_HEIGHT,
        0.05,
        0.012,
        KEYCAP_TOP_SCALE
      ),
    []
  );
  const baseGeom = useMemo(
    () => createExtrudedBox(BASE_WIDTH, BASE_DEPTH, BASE_HEIGHT, 0.12, 0.02, 1),
    []
  );

  useEffect(() => {
    return () => {
      keycapGeom.dispose();
      baseGeom.dispose();
    };
  }, [keycapGeom, baseGeom]);

  const hoveredIcon = useMemo(() => {
    if (!hoveredKey) return null;
    const [r, c] = hoveredKey.split("-").map(Number);
    return SKILLS[r]?.[c] ?? null;
  }, [hoveredKey]);

  const keycapY = BASE_HEIGHT / 2 + KEYCAP_HEIGHT / 2 + 0.005;
  const keycaps = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = (col - (COLS - 1) / 2) * COL_SPACING;
      const z = (row - (ROWS - 1) / 2) * ROW_SPACING;
      const id = `${row}-${col}`;
      const icon = SKILLS[row][col];
      keycaps.push(
        <Keycap
          key={id}
          geometry={keycapGeom}
          position={[x, keycapY, z]}
          isMobile={isMobile}
          icon={icon}
          hovered={hoveredKey === id}
          onHoverChange={(h) =>
            setHoveredKey((prev) => (h ? id : prev === id ? null : prev))
          }
        />
      );
    }
  }

  return (
    <>
      <group ref={ref}>
        <mesh geometry={baseGeom}>
          {/* Solid matte plastic — color prop controls the tone directly.
              No transmission/clearcoat so the white environment doesn't
              wash it out to grey. */}
          <meshStandardMaterial
            color={palette.keyboardBase}
            roughness={0.6}
            metalness={0}
          />
        </mesh>
        {keycaps}
      </group>
      {/* Callout lives OUTSIDE the animated keyboard group so the keyboard's
          yaw/pitch/scale don't warp the text. Placed in world space, to the
          left of the tilted keyboard, with its own matching isometric yaw +
          a small roll so the baseline rises left-to-right like Naresh's. */}
      {activeSection === "stack" && hoveredIcon && (
        <Suspense fallback={null}>
          <group
            //position={[-2.6, -0.5, 0.9]}
            position={[-2.3,0,1.3]}
            //rotation={[-0.8, Math.PI * -0.1  , Math.PI * 4.33]}
            rotation={[-1,0.2,1]}
          >
            {/* No <Center>: Text3D renders with its first letter anchored
                at the group's origin (X=0) and baseline at Y=0. So the first
                letter stays fixed regardless of how long the title is. */}
            <Text3D
              key={hoveredIcon.slug}
              font="/fonts/space_grotesk_bold.typeface.json"
              size={0.25}
              height={0.1}
              curveSegments={12}
              bevelEnabled={false}
            >
              {hoveredIcon.title}
              {/* Naresh-style: pure white, no emissive. All the shading
                  comes from the directional light hitting the faces — the
                  top face catches it, side walls fall into shadow, giving
                  real 3D depth instead of a flat uniform glow. */}
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.55}
                metalness={0}
              />
            </Text3D>
            <Text
              position={[0, -0.05, 0]}
              fontSize={0.12}
              color="#a6c5e4"
              anchorX="left"
              anchorY="top"
              maxWidth={2.2}
              lineHeight={1.25}
              overflowWrap="break-word"
            >
              {t(`keyboard.taglines.${hoveredIcon.slug}`)}
            </Text>
          </group>
        </Suspense>
      )}
    </>
  );
}

export default function FrozenKeyboard() {
  return (
    <Canvas
      camera={{ position: [1.5, 3.6, 11], fov: 22 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      {/* Canvas is transparent so the FrozenBackground (snow + aurora) shows
          through behind/around the keyboard. */}

      {/* Local environment map built from Lightformer quads — no external
          HDR fetch, so the scene works offline. Gives the glass keycaps
          soft icy highlights without relying on drei's CDN. */}
      <Environment resolution={128} environmentIntensity={0.25}>
        <Lightformer
          intensity={1.1}
          color="#ffffff"
          position={[0, 6, -4]}
          rotation={[0, 0, 0]}
          scale={[12, 6, 1]}
        />
        <Lightformer
          intensity={0.7}
          color="#ffffff"
          position={[-6, 2, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          intensity={0.5}
          color="#ffffff"
          position={[6, 3, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          intensity={0.35}
          color="#ffffff"
          position={[0, -4, 3]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 8, 1]}
        />
      </Environment>
      {/* Naresh-style lighting: low ambient + strong single directional from
          upper-left gives crisp top-bright / sides-shadowed contrast. The
          hemisphere adds a subtle sky-ground gradient so the darkest faces
          still read as "the lower faces" instead of pitch-black. */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[-5, 8, 3]} intensity={2.2} />
      <hemisphereLight
        intensity={0.25}
        color="#eaf2fb"
        groundColor="#0a1428"
      />

      <Keyboard />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 5}
        target={FRAME_TARGET}
      />
    </Canvas>
  );
}
