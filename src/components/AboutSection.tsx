import { ArrowRight, Sprout } from 'lucide-react';
import { AGRIMARKET_IMAGES } from '../data/assets';
import { ABOUT_PILLARS } from '../data/content';
import { SoftReveal, StaggerGrid, StaggerItem } from './MotionPrimitives';

interface AboutSectionProps {
  onReserveSpotClick: () => void;
}

export function AboutSection({ onReserveSpotClick }: AboutSectionProps) {
  return (
    <section id="about" className="scroll-mt-20 border-t border-white/5 bg-[#05130A] py-18 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: Startup narrative */}
          <SoftReveal className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#84E12B]">
              About AgriMarket
            </p>
            <h2 className="mt-2.5 font-display text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Bridging the Gap Between Farmers and Consumers
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#CFE0D3]">
              AgriMarket is an early-stage Nigerian agritech startup building direct digital trade
              corridors between local farms and everyday kitchens. By coordinating verified farm
              supply with pre-booked household and bulk demand, we reduce waste and keep prices fair
              for everyone.
            </p>

            <button
              type="button"
              onClick={onReserveSpotClick}
              className="group mt-7 inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#84E12B] px-5 py-2.5 text-sm font-bold text-[#05130A] whitespace-nowrap transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] cursor-pointer"
            >
              <span>Reserve Early Access</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </SoftReveal>

          {/* Right column: Curved Farmer Portrait + 3 Ivory Editorial Pillar Blocks */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-12">
              <SoftReveal delay={0.08} className="sm:col-span-6">
                <div className="relative h-full min-h-[280px] overflow-hidden rounded-tl-3xl rounded-tr-[3rem] rounded-br-3xl rounded-bl-[3rem] border border-[#84E12B]/20 bg-[#0B2414]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-[#0B2414] text-[#84E12B]/30"
                  >
                    <Sprout className="h-12 w-12" />
                  </div>
                  <img
                    src={AGRIMARKET_IMAGES.aboutFarmerCrops}
                    alt="Smiling Nigerian farmer in straw hat inspecting healthy green vegetable crops"
                    referrerPolicy="no-referrer"
                    className="relative z-10 h-68 w-full object-cover sm:h-full"
                  />
                </div>
              </SoftReveal>

              <StaggerGrid className="flex flex-col justify-between gap-3.5 sm:col-span-6">
                {ABOUT_PILLARS.map((pillar, idx) => (
                  <StaggerItem key={pillar.id} delay={idx * 0.09}>
                    <div className="group rounded-2xl border border-[#DCE5D7] bg-[#F5F7F2] p-5 text-[#071A0E] transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-display text-base font-bold leading-snug text-[#071A0E]">
                          {pillar.title}
                        </h3>
                        <span className="font-mono-nums text-xs font-semibold text-[#2E7D1E] tabular-nums">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#38523E]">
                        {pillar.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
