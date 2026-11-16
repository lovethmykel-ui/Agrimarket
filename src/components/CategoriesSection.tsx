import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Sprout } from 'lucide-react';
import { PRODUCE_CATALOG } from '../data/content';
import { SoftReveal, StaggerGrid, StaggerItem } from './MotionPrimitives';
import type { ProduceCategoryId } from '../utils/waitlist';

interface CategoriesSectionProps {
  selectedCategories: ProduceCategoryId[];
  onToggleWaitlistCategory: (categoryId: ProduceCategoryId) => void;
  onJumpToWaitlistWithCategory: (categoryId: ProduceCategoryId) => void;
}

export function CategoriesSection({
  selectedCategories,
  onToggleWaitlistCategory,
  onJumpToWaitlistWithCategory,
}: CategoriesSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<ProduceCategoryId>('vegetables');

  const activeCategory =
    PRODUCE_CATALOG.find((item) => item.id === activeCategoryId) ?? PRODUCE_CATALOG[0];
  const isSelectedForWaitlist = selectedCategories.includes(activeCategory.id);

  return (
    <section id="categories" className="scroll-mt-20 border-t border-white/5 bg-[#081C10] py-18 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SoftReveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#84E12B]">
              Launch Catalog
            </p>
            <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Launching by <span className="text-[#84E12B]">Category</span>
            </h2>
            <p className="mt-2 text-base text-[#CFE0D3]">
              Explore regional sourcing corridors and include your staple categories on the
              waitlist.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onJumpToWaitlistWithCategory(activeCategory.id)}
            className="inline-flex min-h-[42px] items-center gap-2 self-start rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-[#DFF2DF] whitespace-nowrap transition-colors hover:border-[#84E12B]/60 hover:text-white cursor-pointer sm:self-auto"
          >
            <span>Request Early Supply</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </SoftReveal>

        {/* 6 Produce Category Photo Cards */}
        <StaggerGrid className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PRODUCE_CATALOG.map((category, idx) => {
            const isActive = category.id === activeCategoryId;
            const isWaitlistChecked = selectedCategories.includes(category.id);

            return (
              <StaggerItem key={category.id} delay={idx * 0.05}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`group relative aspect-[4/4.6] w-full overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84E12B] cursor-pointer ${
                    isActive
                      ? 'border-[#84E12B] shadow-[0_14px_34px_-12px_rgba(132,225,43,0.45)]'
                      : 'border-white/10 hover:border-[#84E12B]/50'
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-[#0B2414] text-[#84E12B]/30"
                  >
                    <Sprout className="h-8 w-8" />
                  </div>

                  <img
                    src={category.image}
                    alt={category.imageAlt}
                    referrerPolicy="no-referrer"
                    className="relative z-10 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-20 bg-gradient-to-t from-[#041008]/95 via-[#041008]/35 to-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 z-30 p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold text-white sm:text-base">
                        {category.name}
                      </span>
                      {isWaitlistChecked && (
                        <span
                          aria-label={`${category.name} selected for waitlist`}
                          className="text-[11px] font-semibold text-[#9FE855]"
                        >
                          Added
                        </span>
                      )}
                    </div>
                    <div
                      aria-hidden="true"
                      className={`mt-2 h-[2px] rounded-full transition-all duration-200 ${
                        isActive ? 'w-full bg-[#84E12B]' : 'w-6 bg-white/25 group-hover:w-10'
                      }`}
                    />
                  </div>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Interactive Category Sourcing Detail Strip with soft motion blur transition */}
        <div
          data-testid="category-preview-panel"
          className="editorial-surface mt-6 rounded-2xl border editorial-hairline p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 8, filter: 'blur(7px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(7px)' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#9FE855]">
                  <span>{activeCategory.name} Sourcing</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#CFE0D3]">{activeCategory.sourceRegions}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#E4EFE6] sm:text-base">
                  {activeCategory.tagline}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#A9C4B0]">
                  <span className="font-semibold text-white">Launch staples:</span>
                  {activeCategory.sampleItems.map((item, idx) => (
                    <span key={item} className="inline-flex items-center gap-3">
                      <span>{item}</span>
                      {idx < activeCategory.sampleItems.length - 1 && (
                        <span aria-hidden="true" className="text-[#4F7D5B]">
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleWaitlistCategory(activeCategory.id)}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelectedForWaitlist
                      ? 'border-[#84E12B] bg-[#163F24] text-[#9FE855]'
                      : 'border-white/20 bg-[#071A0E] text-white hover:border-[#84E12B]/60'
                  }`}
                >
                  {isSelectedForWaitlist ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>Added to Preferences</span>
                    </>
                  ) : (
                    <span>Select {activeCategory.name}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onJumpToWaitlistWithCategory(activeCategory.id)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#84E12B] px-5 py-2.5 text-sm font-bold text-[#05130A] whitespace-nowrap transition-colors hover:bg-[#97F043] cursor-pointer"
                >
                  <span>Join Waitlist</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
