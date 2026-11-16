import confetti, { type Options as ConfettiOptions, type Shape } from 'canvas-confetti';
import type { WaitlistRole } from './waitlist';

export interface CelebrationOrigin {
  centerX: number;
  centerY: number;
  leftCannonX: number;
  rightCannonX: number;
  cannonY: number;
}

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ViewportLike {
  width: number;
  height: number;
}

export interface ConfettiBurstStep {
  id: 'center-ignition' | 'left-cannon' | 'right-cannon' | 'golden-canopy';
  delayMs: number;
  particleCount: number;
  angle: number;
  spread: number;
  startVelocity: number;
  decay: number;
  gravity: number;
  drift: number;
  ticks: number;
  scalar: number;
  origin: { x: number; y: number };
  colors: string[];
  includeCustomShapes: boolean;
}

export const HARVEST_LEAF_SVG_PATH =
  'M12 2C7 4 3.5 9.5 4.5 16c6.5 1 12-2.5 14-7.5C19.5 5.5 16.5 2 12 2Z';

export const GRAIN_KERNEL_SVG_PATH =
  'M10 1.5C14.5 5.5 16 11 10 19.5C4 11 5.5 5.5 10 1.5Z';

export const DIAMOND_SPARK_SVG_PATH =
  'M10 1L12.6 7.4L19 10L12.6 12.6L10 19L7.4 12.6L1 10L7.4 7.4Z';

const ROLE_PALETTES: Record<WaitlistRole, string[]> = {
  farmer: ['#84E12B', '#9FE855', '#F4C44E', '#34D399', '#F5F7F2', '#B7F36B'],
  buyer: ['#84E12B', '#F4C44E', '#9FE855', '#F5F7F2', '#52E06E', '#FDE68A'],
  partner: ['#84E12B', '#38BDF8', '#F4C44E', '#9FE855', '#F5F7F2', '#34D399'],
};

const CANOPY_ACCENT_COLORS = ['#F4C44E', '#FDE68A', '#9FE855', '#F5F7F2'];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getRoleCelebrationPalette(role: WaitlistRole): string[] {
  return [...(ROLE_PALETTES[role] ?? ROLE_PALETTES.buyer)];
}

export function computeConfettiOrigin(
  cardRect?: RectLike | null,
  viewport?: ViewportLike | null
): CelebrationOrigin {
  const fallback: CelebrationOrigin = {
    centerX: 0.62,
    centerY: 0.48,
    leftCannonX: 0.42,
    rightCannonX: 0.82,
    cannonY: 0.56,
  };

  if (
    !cardRect ||
    !viewport ||
    viewport.width <= 0 ||
    viewport.height <= 0 ||
    cardRect.width <= 0 ||
    cardRect.height <= 0
  ) {
    return fallback;
  }

  const rawCenterX = (cardRect.left + cardRect.width / 2) / viewport.width;
  const rawCenterY = (cardRect.top + cardRect.height * 0.42) / viewport.height;

  const centerX = clamp(rawCenterX, 0.18, 0.82);
  const centerY = clamp(rawCenterY, 0.24, 0.78);

  const halfSpan = clamp((cardRect.width / viewport.width) * 0.42, 0.14, 0.26);
  const leftCannonX = clamp(centerX - halfSpan, 0.08, 0.48);
  const rightCannonX = clamp(centerX + halfSpan, 0.52, 0.92);
  const cannonY = clamp(centerY + 0.04, 0.28, 0.82);

  return {
    centerX: Number(centerX.toFixed(4)),
    centerY: Number(centerY.toFixed(4)),
    leftCannonX: Number(leftCannonX.toFixed(4)),
    rightCannonX: Number(rightCannonX.toFixed(4)),
    cannonY: Number(cannonY.toFixed(4)),
  };
}

export function buildHarvestCelebrationPlan(
  role: WaitlistRole,
  origin: CelebrationOrigin,
  viewportWidth = 1440
): ConfettiBurstStep[] {
  const palette = getRoleCelebrationPalette(role);
  const isCompactViewport = viewportWidth > 0 && viewportWidth < 640;
  const canopyOriginY = Number(
    clamp(origin.centerY - (isCompactViewport ? 0.08 : 0.14), 0.16, 0.68).toFixed(4)
  );
  const primaryVelocity = isCompactViewport ? 36 : 46;
  const cannonVelocity = isCompactViewport ? 42 : 54;

  return [
    {
      id: 'center-ignition',
      delayMs: 0,
      particleCount: isCompactViewport ? 52 : 64,
      angle: 90,
      spread: isCompactViewport ? 64 : 74,
      startVelocity: primaryVelocity,
      decay: 0.91,
      gravity: 0.92,
      drift: 0,
      ticks: 240,
      scalar: isCompactViewport ? 0.95 : 1.05,
      origin: { x: origin.centerX, y: origin.centerY },
      colors: palette,
      includeCustomShapes: true,
    },
    {
      id: 'left-cannon',
      delayMs: 140,
      particleCount: isCompactViewport ? 30 : 38,
      angle: isCompactViewport ? 66 : 58,
      spread: isCompactViewport ? 44 : 52,
      startVelocity: cannonVelocity,
      decay: 0.9,
      gravity: 0.88,
      drift: 0.08,
      ticks: 260,
      scalar: isCompactViewport ? 0.9 : 1,
      origin: { x: origin.leftCannonX, y: origin.cannonY },
      colors: palette,
      includeCustomShapes: true,
    },
    {
      id: 'right-cannon',
      delayMs: 210,
      particleCount: isCompactViewport ? 30 : 38,
      angle: isCompactViewport ? 114 : 122,
      spread: isCompactViewport ? 44 : 52,
      startVelocity: cannonVelocity,
      decay: 0.9,
      gravity: 0.88,
      drift: -0.08,
      ticks: 260,
      scalar: isCompactViewport ? 0.9 : 1,
      origin: { x: origin.rightCannonX, y: origin.cannonY },
      colors: palette,
      includeCustomShapes: true,
    },
    {
      id: 'golden-canopy',
      delayMs: 430,
      particleCount: isCompactViewport ? 28 : 36,
      angle: 90,
      spread: isCompactViewport ? 94 : 118,
      startVelocity: isCompactViewport ? 22 : 26,
      decay: 0.93,
      gravity: 0.52,
      drift: 0.2,
      ticks: 300,
      scalar: 0.78,
      origin: { x: origin.centerX, y: canopyOriginY },
      colors: CANOPY_ACCENT_COLORS,
      includeCustomShapes: true,
    },
  ];
}

function buildHarvestShapes(): Shape[] {
  const baseShapes: Shape[] = ['square', 'circle'];
  if (typeof confetti.shapeFromPath !== 'function') {
    return baseShapes;
  }

  const paths = [HARVEST_LEAF_SVG_PATH, GRAIN_KERNEL_SVG_PATH, DIAMOND_SPARK_SVG_PATH];
  const customShapes: Shape[] = [];
  for (const path of paths) {
    try {
      customShapes.push(confetti.shapeFromPath({ path }));
    } catch {
      // Gracefully skip SVG path shapes if Path2D is unavailable
    }
  }

  return customShapes.length > 0 ? [...baseShapes, ...customShapes] : baseShapes;
}

export interface LaunchHarvestCelebrationParams {
  canvas: HTMLCanvasElement;
  role: WaitlistRole;
  anchorElement?: HTMLElement | null;
}

export function launchHarvestCelebration({
  canvas,
  role,
  anchorElement,
}: LaunchHarvestCelebrationParams): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  const origin = computeConfettiOrigin(
    anchorElement?.getBoundingClientRect() ?? null,
    { width: window.innerWidth, height: window.innerHeight }
  );
  const plan = buildHarvestCelebrationPlan(role, origin, window.innerWidth);
  const harvestShapes = buildHarvestShapes();

  const fire = confetti.create(canvas, {
    resize: true,
    useWorker: false,
  });

  const timerIds: number[] = [];

  for (const step of plan) {
    const triggerBurst = () => {
      const options: ConfettiOptions = {
        particleCount: step.particleCount,
        angle: step.angle,
        spread: step.spread,
        startVelocity: step.startVelocity,
        decay: step.decay,
        gravity: step.gravity,
        drift: step.drift,
        ticks: step.ticks,
        scalar: step.scalar,
        origin: step.origin,
        colors: step.colors,
        shapes: step.includeCustomShapes ? harvestShapes : ['square', 'circle'],
        disableForReducedMotion: true,
      };
      fire(options);
    };

    if (step.delayMs <= 0) {
      triggerBurst();
    } else {
      const id = window.setTimeout(triggerBurst, step.delayMs);
      timerIds.push(id);
    }
  }

  return () => {
    for (const id of timerIds) {
      window.clearTimeout(id);
    }
    try {
      fire.reset();
    } catch {
      // Ignore cleanup errors if canvas has unmounted
    }
  };
}
