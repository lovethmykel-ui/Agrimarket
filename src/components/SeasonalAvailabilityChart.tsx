import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { SoftReveal } from './MotionPrimitives';
import {
  CROSS_STATE_COMPARISONS,
  STATE_CORRIDORS,
  summarizeSeasonalSeries,
  type CrossStateCropId,
  type CropSeriesMeta,
  type NigerianCorridorId,
} from '../utils/seasonalData';

interface SeasonalAvailabilityChartProps {
  isLoading?: boolean;
  onSelectStateAndScroll: (stateName: string) => void;
}

const SKELETON_BAR_HEIGHTS = [42, 54, 48, 63, 76, 86, 92, 81, 68, 56, 70, 51];

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{
    name?: string;
    value?: number;
    color?: string;
  }>;
}

function SeasonalTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#84E12B]/35 bg-[#05130A]/95 px-3.5 py-2.5 shadow-xl backdrop-blur-md">
      <div className="text-xs font-semibold text-white">{label} Harvest Index</div>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-5 text-xs"
          >
            <span className="flex items-center gap-2 text-[#CFE0D3]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>
            </span>
            <span className="font-mono-nums font-bold text-white tabular-nums">
              {entry.value}/100
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATE_IDS: NigerianCorridorId[] = ['kaduna', 'benue', 'kebbi', 'oyo', 'plateau'];
const CROP_IDS: CrossStateCropId[] = ['tomatoes', 'maize', 'rice', 'yams'];

export function SeasonalAvailabilityChart({
  isLoading = false,
  onSelectStateAndScroll,
}: SeasonalAvailabilityChartProps) {
  const [viewMode, setViewMode] = useState<'state' | 'corridor'>('state');
  const [selectedStateId, setSelectedStateId] = useState<NigerianCorridorId>('kaduna');
  const [selectedCropId, setSelectedCropId] = useState<CrossStateCropId>('tomatoes');

  const activeState = STATE_CORRIDORS[selectedStateId];
  const activeComparison = CROSS_STATE_COMPARISONS[selectedCropId];

  const chartData =
    viewMode === 'state' ? activeState.monthly : activeComparison.monthly;
  const activeSeries: [CropSeriesMeta, CropSeriesMeta, CropSeriesMeta] =
    viewMode === 'state' ? activeState.crops : activeComparison.states;

  const summary = summarizeSeasonalSeries(
    chartData,
    activeSeries.map((item) => item.key)
  );

  return (
    <section
      id="seasonal-supply"
      className="scroll-mt-20 border-t border-white/5 bg-[#081C10] py-18 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SoftReveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#84E12B]">
              Seasonal Supply Intelligence
            </p>
            <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Direct State Corridors Matter
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#CFE0D3]">
              Nigerian harvests shift across climate zones every month. Visualizing regional
              availability shows how AgriMarket links surplus farms to buyers before seasonal
              scarcity drives prices up.
            </p>
          </div>

          {/* Mode Toggle: By Nigerian State vs Cross-State Corridor */}
          <div
            role="tablist"
            aria-label="Seasonal chart mode"
            className="inline-flex self-start rounded-xl border border-white/10 bg-[#05130A] p-1 lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'state'}
              onClick={() => setViewMode('state')}
              className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewMode === 'state'
                  ? 'bg-[#84E12B] text-[#05130A]'
                  : 'text-[#CFE0D3] hover:text-white'
              }`}
            >
              By Nigerian State
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'corridor'}
              onClick={() => setViewMode('corridor')}
              className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                viewMode === 'corridor'
                  ? 'bg-[#84E12B] text-[#05130A]'
                  : 'text-[#CFE0D3] hover:text-white'
              }`}
            >
              Cross-State Corridor
            </button>
          </div>
        </SoftReveal>

        <SoftReveal delay={0.08}>
          <div
            data-testid="seasonal-chart-card"
            className="editorial-surface relative mt-8 overflow-hidden rounded-3xl border editorial-hairline p-6 sm:p-8"
          >
            <BarChart3
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-6 -bottom-6 h-40 w-40 text-[#84E12B]/[0.045]"
            />

            {isLoading ? (
              <div
                data-testid="seasonal-chart-skeleton"
                role="status"
                aria-busy="true"
                aria-label="Loading seasonal crop availability chart"
                className="relative z-10"
              >
                <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {[72, 68, 66, 56, 74].map((w, idx) => (
                      <div
                        key={idx}
                        className="skeleton-shimmer h-[38px] rounded-xl border border-white/5"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {[88, 76, 82].map((w, idx) => (
                      <div
                        key={idx}
                        className="skeleton-shimmer h-4 rounded-full"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                  <div className="skeleton-shimmer h-5 w-64 rounded-lg" />
                  <div className="skeleton-shimmer h-4 w-48 rounded-lg" />
                </div>

                <div className="relative mt-5 flex h-[320px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/10 bg-[#05130A]/55 px-4 pb-6 pt-8 sm:px-6">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 top-8 bottom-12 flex flex-col justify-between sm:inset-x-6"
                  >
                    {[0, 1, 2, 3].map((row) => (
                      <div key={row} className="w-full border-t border-dashed border-white/[0.06]" />
                    ))}
                  </div>
                  <div className="relative z-10 grid h-52 grid-cols-12 items-end gap-2 sm:gap-3.5">
                    {SKELETON_BAR_HEIGHTS.map((pct, idx) => (
                      <div key={idx} className="flex h-full flex-col items-center justify-end gap-2">
                        <div
                          className="skeleton-shimmer w-full rounded-t-lg border border-white/5"
                          style={{ height: `${pct}%` }}
                        />
                        <div className="skeleton-shimmer h-2.5 w-6 rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-6 border-t border-white/10 pt-6 lg:grid-cols-12">
                  <div className="grid grid-cols-3 divide-x divide-white/10 lg:col-span-5">
                    <div className="space-y-2 pr-3">
                      <div className="skeleton-shimmer h-3 w-20 rounded" />
                      <div className="skeleton-shimmer h-6 w-24 rounded-lg" />
                    </div>
                    <div className="space-y-2 px-4">
                      <div className="skeleton-shimmer h-3 w-22 rounded" />
                      <div className="skeleton-shimmer h-6 w-20 rounded-lg" />
                    </div>
                    <div className="space-y-2 pl-4">
                      <div className="skeleton-shimmer h-3 w-24 rounded" />
                      <div className="skeleton-shimmer h-6 w-20 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2 lg:col-span-4">
                    <div className="skeleton-shimmer h-3.5 w-full rounded" />
                    <div className="skeleton-shimmer h-3.5 w-4/5 rounded" />
                  </div>
                  <div className="flex lg:col-span-3 lg:justify-end">
                    <div className="skeleton-shimmer h-[44px] w-44 rounded-xl border border-white/5" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10">
                {/* Filter Controls + Legend Header */}
                <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {viewMode === 'state'
                      ? STATE_IDS.map((id) => {
                          const profile = STATE_CORRIDORS[id];
                          const active = id === selectedStateId;
                          return (
                            <button
                              key={id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setSelectedStateId(id)}
                              className={`min-h-[38px] rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                active
                                  ? 'border-[#84E12B] bg-[#163F24] text-[#9FE855]'
                                  : 'border-white/15 bg-[#05130A] text-[#CFE0D3] hover:border-[#84E12B]/50 hover:text-white'
                              }`}
                            >
                              {profile.stateName}
                            </button>
                          );
                        })
                      : CROP_IDS.map((id) => {
                          const comp = CROSS_STATE_COMPARISONS[id];
                          const active = id === selectedCropId;
                          return (
                            <button
                              key={id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setSelectedCropId(id)}
                              className={`min-h-[38px] rounded-xl border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                active
                                  ? 'border-[#84E12B] bg-[#163F24] text-[#9FE855]'
                                  : 'border-white/15 bg-[#05130A] text-[#CFE0D3] hover:border-[#84E12B]/50 hover:text-white'
                              }`}
                            >
                              {comp.label}
                            </button>
                          );
                        })}
                  </div>

                  {/* Custom single-line legend matching series colors */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {activeSeries.map((series) => (
                      <span key={series.key} className="inline-flex items-center gap-2 text-[#E5F0E7]">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: series.color }}
                        />
                        <span className="font-medium whitespace-nowrap">{series.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Subtitle for selected view */}
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-white">
                    {viewMode === 'state'
                      ? `${activeState.stateName} State — ${activeState.corridorTagline}`
                      : `${activeComparison.label} — Cross-State Harvest Continuity`}
                  </p>
                  <span className="text-xs text-[#9DBBA5]">
                    Monthly Regional Supply Availability (0–100 Index)
                  </span>
                </div>

                {/* Recharts AreaChart with explicit height container */}
                <div className="mt-5 h-[320px] w-full" data-testid="recharts-seasonal-container">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
                    >
                      <defs>
                        {activeSeries.map((series) => (
                          <linearGradient
                            key={series.key}
                            id={`grad-${viewMode}-${series.key}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="5%" stopColor={series.color} stopOpacity={0.34} />
                            <stop offset="95%" stopColor={series.color} stopOpacity={0.02} />
                          </linearGradient>
                        ))}
                      </defs>

                      <CartesianGrid
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="4 4"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        stroke="#89A991"
                        tick={{ fill: '#A8C2AF', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                        tickLine={false}
                      />

                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        stroke="#89A991"
                        tick={{ fill: '#A8C2AF', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip content={<SeasonalTooltip />} />

                      {activeSeries.map((series) => (
                        <Area
                          key={series.key}
                          type="monotone"
                          dataKey={series.key}
                          name={series.label}
                          stroke={series.color}
                          strokeWidth={2.4}
                          fillOpacity={1}
                          fill={`url(#grad-${viewMode}-${series.key})`}
                          activeDot={{ r: 5, strokeWidth: 0, fill: series.color }}
                          animationDuration={450}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Hairline-divided Insight Ledger + Waitlist CTA */}
            <div className="mt-6 grid grid-cols-1 items-center gap-6 border-t border-white/10 pt-6 lg:grid-cols-12">
              <div className="grid grid-cols-3 divide-x divide-white/10 lg:col-span-5">
                <div className="pr-3">
                  <div className="text-[11px] font-medium text-[#9DBBA5]">Primary Peak</div>
                  <div className="font-mono-nums mt-1 text-lg font-bold text-[#84E12B] tabular-nums">
                    {summary.peakMonth} · {summary.peakScore}
                  </div>
                </div>
                <div className="px-4">
                  <div className="text-[11px] font-medium text-[#9DBBA5]">Off-Season Low</div>
                  <div className="font-mono-nums mt-1 text-lg font-bold text-white tabular-nums">
                    {summary.leanMonth} · {summary.leanScore}
                  </div>
                </div>
                <div className="pl-4">
                  <div className="text-[11px] font-medium text-[#9DBBA5]">High-Supply Span</div>
                  <div className="font-mono-nums mt-1 text-lg font-bold text-white tabular-nums">
                    {summary.combinedContinuityMonths}/12 mo
                  </div>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[#CFE0D3] sm:text-sm lg:col-span-4">
                {viewMode === 'state' ? activeState.platformValue : activeComparison.insight}
              </p>

              <div className="flex lg:col-span-3 lg:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    onSelectStateAndScroll(
                      viewMode === 'state'
                        ? activeState.waitlistStateValue
                        : activeComparison.states[0].label.replace(' State', '')
                    )
                  }
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#84E12B] px-4 py-2.5 text-xs font-bold text-[#05130A] whitespace-nowrap transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] cursor-pointer"
                >
                  <span>
                    Join{' '}
                    {viewMode === 'state'
                      ? activeState.stateName
                      : activeComparison.states[0].label.replace(' State', '')}{' '}
                    Waitlist
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
              </div>
            )}
          </div>
        </SoftReveal>
      </div>
    </section>
  );
}
