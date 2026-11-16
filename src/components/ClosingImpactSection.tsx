import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AGRIMARKET_IMAGES } from '../data/assets';
import { SoftReveal } from './MotionPrimitives';

interface ClosingImpactSectionProps {
  onJoinWaitlistClick: () => void;
}

const IMPACT_GOALS = [
  {
    value: '36 States',
    label: 'Nationwide Rollout Plan',
  },
  {
    value: 'Direct',
    label: 'Farm-Gate Sourcing',
  },
  {
    value: 'Cold-Chain',
    label: 'Scheduled Hub Delivery',
  },
  {
    value: '100%',
    label: 'Escrow-Protected Trades',
  },
] as const;

export function ClosingImpactSection({ onJoinWaitlistClick }: ClosingImpactSectionProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'end start'],
  });
  const tractorScale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);

  return (
    <section className="bg-[#05130A] pb-18 pt-4 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hairline-divided 4-column target vision ledger */}
        <SoftReveal>
          <div className="grid grid-cols-2 divide-y divide-white/10 border-y border-white/10 py-6 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
            {IMPACT_GOALS.map((goal) => (
              <div key={goal.label} className="px-4 py-4 text-center">
                <div className="font-display text-xl font-bold text-white sm:text-2xl">
                  {goal.value}
                </div>
                <div className="mt-1 text-xs text-[#A8C2AF]">{goal.label}</div>
              </div>
            ))}
          </div>
        </SoftReveal>

        {/* Tractor Green-Field Closing Banner with subtle scroll parallax */}
        <SoftReveal delay={0.08}>
          <div
            ref={bannerRef}
            className="relative mt-12 overflow-hidden rounded-3xl border border-[#84E12B]/25 bg-[#0B2213] shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)]"
          >
            <motion.img
              style={{ scale: tractorScale }}
              src={AGRIMARKET_IMAGES.bannerTractorField}
              alt="Green agricultural tractor driving along lush crop rows in sunny Nigerian farmland"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#05130A]/95 via-[#05130A]/70 to-[#05130A]/15"
            />

            <div className="relative z-10 flex flex-col items-start justify-between gap-6 p-8 sm:p-12 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2 className="font-display text-balance text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  Together, we can build a food secure Nigeria.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#DFECE2] sm:text-base">
                  Join the AgriMarket waitlist today and be first in line when direct farm-to-buyer
                  trading opens in your state.
                </p>
              </div>

              <button
                type="button"
                onClick={onJoinWaitlistClick}
                className="group inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-xl bg-[#84E12B] px-6 py-3 text-sm font-bold text-[#05130A] whitespace-nowrap shadow-[0_10px_28px_-8px_rgba(132,225,43,0.5)] transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] cursor-pointer"
              >
                <span>Join the Waitlist</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </SoftReveal>
      </div>
    </section>
  );
}
