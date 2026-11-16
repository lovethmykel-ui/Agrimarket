import type { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const EDITORIAL_EASE = [0.16, 1, 0.3, 1] as const;

export function ScrollProgressTrack() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-gradient-to-r from-[#5AB824] via-[#84E12B] to-[#C8FA7A]"
    />
  );
}

interface HeroEntranceProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function HeroEntrance({ children, delay = 0, className = '' }: HeroEntranceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.65, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SoftRevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  className?: string;
}

export function SoftReveal({
  children,
  delay = 0,
  y = 22,
  blur = 10,
  className = '',
}: SoftRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.65, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGrid({
  children,
  className = '',
}: StaggerGridProps) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(9px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 'some' }}
      transition={{ duration: 0.6, delay, ease: EDITORIAL_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
