import { ArrowRight, Quote, Sprout, Tractor } from 'lucide-react';
import { AGRIMARKET_IMAGES } from '../data/assets';
import { SoftReveal } from './MotionPrimitives';

interface FarmerSpotlightSectionProps {
  onApplyAsFarmerClick: () => void;
}

export function FarmerSpotlightSection({ onApplyAsFarmerClick }: FarmerSpotlightSectionProps) {
  return (
    <section className="bg-[#081C10] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SoftReveal>
          <div className="editorial-surface overflow-hidden rounded-3xl border editorial-hairline">
            <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
              {/* Left column: Farmer portrait */}
              <div className="group relative min-h-[280px] overflow-hidden bg-[#081A0E] lg:col-span-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center text-[#84E12B]/30"
                >
                  <Sprout className="h-12 w-12" />
                </div>
                <img
                  src={AGRIMARKET_IMAGES.spotlightFarmerTomatoes}
                  alt="Experienced Nigerian farmer in a straw hat holding a wooden crate of freshly harvested red tomatoes"
                  referrerPolicy="no-referrer"
                  className="relative z-10 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Center column: Pilot farmer onboarding story */}
              <div className="relative flex flex-col justify-center overflow-hidden p-7 sm:p-9 lg:col-span-4">
                <Tractor
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 text-[#84E12B]/[0.05]"
                />
                <p className="relative z-10 text-xs font-semibold tracking-[0.14em] uppercase text-[#84E12B]">
                  Farmer Pilot Program
                </p>
                <h2 className="mt-2 font-display text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Built With Local Growers
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#CFE0D3] sm:text-base">
                  Before our public launch, we are onboarding farming cooperatives across Kaduna,
                  Benue, Ogun, and Oyo states to test direct demand scheduling and instant escrow
                  settlements.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={onApplyAsFarmerClick}
                    className="group inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#84E12B] px-5 py-2.5 text-sm font-bold text-[#05130A] whitespace-nowrap transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] cursor-pointer"
                  >
                    <span>Register Your Farm</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              {/* Right column: Pilot cooperative advisor quote */}
              <div className="flex flex-col justify-center border-t border-white/10 p-7 sm:p-9 lg:col-span-4 lg:border-t-0 lg:border-l lg:border-white/10">
                <Quote className="h-7 w-7 text-[#84E12B]/75" aria-hidden="true" />
                <blockquote className="mt-3 text-lg font-medium italic leading-relaxed text-white">
                  &ldquo;Direct digital orders before harvest mean less tomato spoilage on the farm
                  and fair, predictable income for our cooperative members.&rdquo;
                </blockquote>
                <div className="mt-6 border-t border-white/10 pt-4 text-sm">
                  <div className="font-semibold text-white">Alhaji Ibrahim Danladi</div>
                  <div className="text-xs text-[#9DBBA5]">
                    Pilot Cooperative Lead · Kaduna State
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SoftReveal>
      </div>
    </section>
  );
}
