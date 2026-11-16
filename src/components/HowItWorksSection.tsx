import { CreditCard, MailCheck, Truck, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { HOW_IT_WORKS_STEPS } from '../data/content';
import { SoftReveal, StaggerGrid, StaggerItem } from './MotionPrimitives';

const STEP_WATERMARKS = {
  '01': UserPlus,
  '02': MailCheck,
  '03': CreditCard,
  '04': Truck,
} as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-white/5 bg-gradient-to-b from-[#05130A] to-[#081C10] py-18 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SoftReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#84E12B]">
            Platform Roadmap
          </p>
          <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It <span className="text-[#84E12B]">Works</span>
          </h2>
          <p className="mt-3 text-base text-[#CFE0D3]">
            From pre-launch registration today to escrow-protected, direct harvest delivery across
            Nigeria.
          </p>
        </SoftReveal>

        <div className="relative mt-12">
          {/* Animated horizontal milestone track on desktop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-6 right-[12%] left-[12%] hidden h-[1px] bg-white/10 lg:block"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 'some' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: '0% 50%' }}
              className="h-full w-full bg-gradient-to-r from-[#84E12B] via-[#84E12B]/70 to-[#84E12B]/30"
            />
          </div>

          <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((item, idx) => {
              const WatermarkIcon = STEP_WATERMARKS[item.step];

              return (
                <StaggerItem key={item.step} delay={idx * 0.08}>
                  <div className="editorial-surface group relative flex h-full flex-col overflow-hidden rounded-2xl border editorial-hairline p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#84E12B]/50">
                    <WatermarkIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-3 -bottom-3 h-24 w-24 text-[#84E12B]/[0.06] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-mono-nums relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#84E12B]/50 bg-[#081F11] text-xs font-bold text-[#84E12B] shadow-[0_0_20px_-4px_rgba(132,225,43,0.4)] tabular-nums">
                        {item.step}
                      </span>
                      <span className="text-[11px] font-medium text-[#7EA689]">
                        Phase {item.step}
                      </span>
                    </div>

                    <h3 className="relative z-10 mt-5 font-display text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="relative z-10 mt-2 text-sm leading-relaxed text-[#BED4C3]">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}
