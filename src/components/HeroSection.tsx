import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
import { AGRIMARKET_IMAGES } from '../data/assets';
import { HeroEntrance } from './MotionPrimitives';
import type { WaitlistRole } from '../utils/waitlist';

interface HeroSectionProps {
  totalWaitlistCount: number;
  onSelectRoleAndScroll: (role: WaitlistRole) => void;
}

const HERO_BENEFITS = [
  'Fresh Harvest Direct from Farms',
  'Verified Nigerian Growers',
  'Transparent Farm-Gate Prices',
  'Cold-Chain & Inter-State Delivery',
];

export function HeroSection({ totalWaitlistCount, onSelectRoleAndScroll }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const ambientY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="scroll-mt-20 relative overflow-hidden bg-gradient-to-b from-[#081F11] via-[#05130A] to-[#05130A] pt-10 pb-14 sm:pt-16 sm:pb-18"
    >
      {/* Ambient sunlit emerald atmospheric glow with subtle scroll parallax */}
      <motion.div
        aria-hidden="true"
        style={{ y: ambientY }}
        className="pointer-events-none absolute -top-28 right-0 h-[560px] w-[560px] rounded-full bg-[#46A832]/20 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 -left-32 h-[380px] w-[380px] rounded-full bg-[#1F6327]/15 blur-[96px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: Proposition & Primary CTA */}
          <div className="lg:col-span-6">
            <HeroEntrance delay={0.02}>
              <p className="mb-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#9FE855]">
                Pre-Launch Cohort · Q1 2027 Pilot Corridors
              </p>
            </HeroEntrance>

            <HeroEntrance delay={0.08}>
              <h1 className="font-display text-balance text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[56px]">
                Nigeria&apos;s Digital{' '}
                <span className="bg-gradient-to-r from-[#84E12B] to-[#C2FA7A] bg-clip-text text-transparent">
                  Farmer Market
                </span>
              </h1>
            </HeroEntrance>

            <HeroEntrance delay={0.14}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#CFE0D3] sm:text-lg">
                Buy fresh, support local farmers, and grow together. We are building a direct
                farm-to-buyer marketplace across Nigeria — reserve early access before our pilot
                harvest opens.
              </p>
            </HeroEntrance>

            <HeroEntrance delay={0.2}>
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {HERO_BENEFITS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-[#E5F0E7]"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#84E12B]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </HeroEntrance>

            <HeroEntrance delay={0.26}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onSelectRoleAndScroll('buyer')}
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#84E12B] px-6 py-3 text-sm font-bold text-[#05130A] whitespace-nowrap shrink-0 shadow-[0_10px_30px_-8px_rgba(132,225,43,0.5)] transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05130A] cursor-pointer"
                >
                  <span>Join the Waitlist</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectRoleAndScroll('farmer')}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white whitespace-nowrap shrink-0 backdrop-blur-sm transition-colors duration-150 hover:border-[#84E12B]/70 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] cursor-pointer"
                >
                  <span>Apply as a Farmer</span>
                </button>
              </div>
            </HeroEntrance>
          </div>

          {/* Right column: Sculpted Editorial Hero Portrait */}
          <div className="lg:col-span-6">
            <HeroEntrance delay={0.14}>
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="relative aspect-[4/3.6] overflow-hidden rounded-tl-[4.5rem] rounded-tr-[1.75rem] rounded-br-[4.5rem] rounded-bl-[1.75rem] border border-[#84E12B]/25 bg-[#0A2213] shadow-[0_28px_70px_-20px_rgba(0,0,0,0.8)]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F331B] to-[#071A0E] text-[#84E12B]/40"
                  >
                    <Sprout className="h-16 w-16" />
                  </div>

                  <motion.img
                    style={{ scale: portraitScale }}
                    src={AGRIMARKET_IMAGES.heroFarmerBasket}
                    alt="Smiling Nigerian female farmer holding a woven basket overflowing with fresh tomatoes, bell peppers, and leafy greens"
                    referrerPolicy="no-referrer"
                    className="relative z-10 h-full w-full object-cover object-top"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#05130A]/85 via-[#05130A]/15 to-transparent"
                  />

                  {/* Integrated bottom editorial caption plaque (replaces generic corner pill) */}
                  <div className="absolute inset-x-5 bottom-5 z-30 flex items-end justify-between gap-4 border-t border-white/15 pt-3.5 text-white">
                    <div>
                      <div className="text-xs font-semibold text-[#9FE855]">
                        Direct Grower Network
                      </div>
                      <div className="mt-0.5 text-xs text-[#DFECE2]">
                        Kaduna · Benue · Ogun · Oyo Corridors
                      </div>
                    </div>
                    <div className="text-right font-mono-nums text-xs text-[#CFE0D3] tabular-nums">
                      Building Now
                    </div>
                  </div>
                </div>
              </div>
            </HeroEntrance>
          </div>
        </div>

        {/* Hairline-divided Editorial Metric Ledger (replaces generic icon boxes) */}
        <HeroEntrance delay={0.3}>
          <div className="editorial-surface mt-12 grid grid-cols-2 divide-y divide-white/10 rounded-2xl border editorial-hairline sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
            <div className="px-6 py-5">
              <div className="text-xs font-medium text-[#A8C2AF]">Early Waitlist Signups</div>
              <div
                data-testid="hero-waitlist-count"
                className="font-mono-nums mt-1.5 text-2xl font-bold text-white sm:text-3xl tabular-nums"
              >
                {totalWaitlistCount}
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="text-xs font-medium text-[#A8C2AF]">Target Footprint</div>
              <div className="font-mono-nums mt-1.5 text-2xl font-bold text-white sm:text-3xl tabular-nums">
                36 + FCT
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="text-xs font-medium text-[#A8C2AF]">Hidden Broker Markup</div>
              <div className="font-mono-nums mt-1.5 text-2xl font-bold text-[#84E12B] sm:text-3xl tabular-nums">
                0%
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="text-xs font-medium text-[#A8C2AF]">Pilot Launch Window</div>
              <div className="font-mono-nums mt-1.5 text-2xl font-bold text-white sm:text-3xl tabular-nums">
                Q1 2027
              </div>
            </div>
          </div>
        </HeroEntrance>
      </div>
    </section>
  );
}
