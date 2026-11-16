import { useMemo, useState } from 'react';
import { ArrowRight, MapPin, Route, Sprout, Store } from 'lucide-react';
import { SoftReveal } from './MotionPrimitives';
import {
  buildDensityNodes,
  TRADE_CORRIDOR_LINKS,
  type DensityFilterMode,
  type NigeriaStateDensityNode,
} from '../utils/nigeriaDensityData';
import {
  NIGERIA_SVG_STATES,
  NIGERIA_SVG_VIEWBOX,
  type NigeriaSvgStatePath,
} from '../utils/nigeriaSvgPaths';
import type { StateRoleCounts } from '../utils/waitlist';

interface NigeriaDensityMapProps {
  isLoading?: boolean;
  liveByState: Record<string, StateRoleCounts>;
  onSelectStateAndScroll: (stateName: string) => void;
}

const FILTER_TABS: ReadonlyArray<{ id: DensityFilterMode; label: string }> = [
  { id: 'all', label: 'All Network' },
  { id: 'farmers', label: 'Farmers' },
  { id: 'buyers', label: 'Buyers' },
];

function getLabelCoords(node: NigeriaStateDensityNode): {
  lx: number;
  ly: number;
  anchor: 'start' | 'middle' | 'end';
} {
  const offset = node.radius + 8;
  switch (node.labelPlacement) {
    case 'top':
      return { lx: node.x, ly: node.y - offset - 3, anchor: 'middle' };
    case 'bottom':
      return { lx: node.x, ly: node.y + offset + 12, anchor: 'middle' };
    case 'left':
      return { lx: node.x - offset - 3, ly: node.y + 4, anchor: 'end' };
    case 'right':
    default:
      return { lx: node.x + offset + 3, ly: node.y + 4, anchor: 'start' };
  }
}

function buildCurvedPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * 0.14;
  const cy = my + dx * 0.14;
  return `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2},${y2}`;
}

function getInspectorWatermark(corridorRole?: string) {
  switch (corridorRole) {
    case 'Demand Hub':
      return Store;
    case 'Trade Corridor':
      return Route;
    case 'Supply Basin':
      return Sprout;
    default:
      return MapPin;
  }
}

export function NigeriaDensityMap({
  isLoading = false,
  liveByState,
  onSelectStateAndScroll,
}: NigeriaDensityMapProps) {
  const [filterMode, setFilterMode] = useState<DensityFilterMode>('all');
  const [selectedState, setSelectedState] = useState<string>('Kaduna');
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const { nodes, ranked, totalFarmers, totalBuyers } = useMemo(
    () => buildDensityNodes(liveByState, filterMode),
    [liveByState, filterMode]
  );

  const nodeMap = useMemo(() => {
    const map = new Map<string, NigeriaStateDensityNode>();
    for (const node of nodes) {
      map.set(node.stateName, node);
    }
    return map;
  }, [nodes]);

  const svgStateMap = useMemo(() => {
    const map = new Map<string, NigeriaSvgStatePath>();
    for (const st of NIGERIA_SVG_STATES) {
      map.set(st.stateName, st);
    }
    return map;
  }, []);

  const maxFarmers = useMemo(
    () => Math.max(1, ...nodes.map((n) => n.farmers)),
    [nodes]
  );
  const maxBuyers = useMemo(
    () => Math.max(1, ...nodes.map((n) => n.buyers)),
    [nodes]
  );

  const activeFocusName = hoveredState ?? selectedState;
  const activeNode = nodeMap.get(selectedState);
  const fallbackStateMeta = svgStateMap.get(selectedState);
  const fallbackLiveCounts = liveByState[selectedState] ?? {
    buyers: 0,
    farmers: 0,
    partners: 0,
    total: 0,
  };

  const handleFilterChange = (nextMode: DensityFilterMode) => {
    setFilterMode(nextMode);
    if (nextMode === 'buyers' && selectedState === 'Kaduna') {
      setSelectedState('Lagos');
    } else if (nextMode === 'farmers' && selectedState === 'Lagos') {
      setSelectedState('Kaduna');
    }
  };

  const ActiveWatermarkIcon = getInspectorWatermark(activeNode?.corridorRole);

  return (
    <section
      id="network-map"
      className="scroll-mt-20 border-t border-white/5 bg-[#05130A] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SoftReveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#84E12B]">
              Regional Footprint
            </p>
            <h2 className="mt-2 font-display text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Where Farmers &amp; Buyers Are Queuing
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#CFE0D3]">
              Explore pre-launch cooperative farmer onboardings and registered buyer demand across
              Nigeria&rsquo;s 36 states &amp; FCT, updated live as new waitlist members register.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Map density filter"
            className="inline-flex self-start rounded-xl border border-white/10 bg-[#081C10] p-1 lg:self-auto"
          >
            {FILTER_TABS.map((tab) => {
              const active = filterMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleFilterChange(tab.id)}
                  className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#84E12B] text-[#05130A]'
                      : 'text-[#CFE0D3] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </SoftReveal>

        <SoftReveal delay={0.08}>
          <div
            data-testid="nigeria-density-card"
            className="editorial-surface mt-8 rounded-3xl border editorial-hairline p-5 sm:p-8"
          >
            {isLoading ? (
              <div
                data-testid="nigeria-map-skeleton"
                role="status"
                aria-busy="true"
                aria-label="Loading Nigeria regional density map"
                className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"
              >
                {/* Left Map Skeleton */}
                <div className="lg:col-span-7">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#05130A]/90 p-3 sm:p-5">
                    <div className="relative aspect-[745/600] w-full overflow-hidden rounded-xl">
                      <svg
                        viewBox={NIGERIA_SVG_VIEWBOX}
                        aria-hidden="true"
                        className="h-auto w-full opacity-55"
                      >
                        <g>
                          {NIGERIA_SVG_STATES.map((stateGeo) => (
                            <path
                              key={stateGeo.id}
                              d={stateGeo.d}
                              fill="#0A2213"
                              stroke="rgba(132, 225, 43, 0.14)"
                              strokeWidth={0.85}
                              strokeLinejoin="round"
                            />
                          ))}
                        </g>
                      </svg>
                      <div className="skeleton-shimmer pointer-events-none absolute inset-0 rounded-xl opacity-70" />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="skeleton-shimmer h-3.5 w-28 rounded-full" />
                      <div className="skeleton-shimmer h-3.5 w-28 rounded-full" />
                      <div className="skeleton-shimmer h-3.5 w-24 rounded-full" />
                    </div>
                    <div className="skeleton-shimmer h-3.5 w-36 rounded-full" />
                  </div>
                </div>

                {/* Right Inspector + Ranking Skeleton */}
                <div className="flex flex-col gap-5 lg:col-span-5">
                  <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10 pb-5">
                    <div className="space-y-2 pr-4">
                      <div className="skeleton-shimmer h-3.5 w-24 rounded" />
                      <div className="skeleton-shimmer h-7 w-20 rounded-lg" />
                    </div>
                    <div className="space-y-2 pl-5">
                      <div className="skeleton-shimmer h-3.5 w-24 rounded" />
                      <div className="skeleton-shimmer h-7 w-20 rounded-lg" />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#05130A]/80 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="skeleton-shimmer h-3.5 w-36 rounded" />
                      <div className="skeleton-shimmer h-3.5 w-24 rounded" />
                    </div>
                    <div className="skeleton-shimmer mt-2.5 h-7 w-32 rounded-lg" />
                    <div className="mt-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="skeleton-shimmer h-3 w-28 rounded" />
                          <div className="skeleton-shimmer h-3 w-8 rounded" />
                        </div>
                        <div className="skeleton-shimmer h-2 w-full rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="skeleton-shimmer h-3 w-28 rounded" />
                          <div className="skeleton-shimmer h-3 w-8 rounded" />
                        </div>
                        <div className="skeleton-shimmer h-2 w-4/5 rounded-full" />
                      </div>
                    </div>
                    <div className="mt-5 space-y-2">
                      <div className="skeleton-shimmer h-3.5 w-48 rounded" />
                      <div className="skeleton-shimmer h-3.5 w-full rounded" />
                      <div className="skeleton-shimmer h-3.5 w-5/6 rounded" />
                    </div>
                    <div className="skeleton-shimmer mt-5 h-[44px] w-full rounded-xl" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="skeleton-shimmer h-3.5 w-36 rounded" />
                      <div className="skeleton-shimmer h-3 w-28 rounded" />
                    </div>
                    <div className="mt-2 divide-y divide-white/10 border-t border-white/10">
                      {[0, 1, 2, 3, 4].map((idx) => (
                        <div
                          key={idx}
                          className="flex min-h-[40px] items-center justify-between px-2 py-2"
                        >
                          <div className="skeleton-shimmer h-4 w-32 rounded" />
                          <div className="skeleton-shimmer h-3.5 w-20 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                {/* Left column: Accurate 37-State Nigeria SVG Map + Simple SVG Markers */}
                <div className="lg:col-span-7">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#05130A]/90 p-3 sm:p-5">
                    <svg
                      viewBox={NIGERIA_SVG_VIEWBOX}
                      role="img"
                      aria-label="Interactive map of Nigeria showing all 36 states and FCT with registered farmer and buyer density markers"
                      data-testid="nigeria-density-svg"
                      className="h-auto w-full select-none"
                    >
                      <defs>
                        <radialGradient id="nigeriaMapGlow" cx="48%" cy="48%" r="58%">
                          <stop offset="0%" stopColor="#1A4D2A" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#05130A" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      <rect
                        x="0"
                        y="0"
                        width="745"
                        height="600"
                        fill="url(#nigeriaMapGlow)"
                      />

                      {/* All 37 Accurate Nigerian State Polygons */}
                      <g>
                        {NIGERIA_SVG_STATES.map((stateGeo) => {
                          const isSelected = stateGeo.stateName === selectedState;
                          const isHovered = stateGeo.stateName === hoveredState;
                          const hubNode = nodeMap.get(stateGeo.stateName);

                          let fill = '#0A2213';
                          if (isSelected) {
                            fill = '#184A29';
                          } else if (isHovered) {
                            fill = '#123920';
                          } else if (hubNode) {
                            fill =
                              filterMode === 'buyers'
                                ? hubNode.buyers >= 80
                                  ? '#17381F'
                                  : '#0C2816'
                                : hubNode.farmers >= 100
                                  ? '#11341D'
                                  : '#0C2816';
                          }

                          return (
                            <path
                              key={stateGeo.id}
                              id={stateGeo.id}
                              d={stateGeo.d}
                              fill={fill}
                              stroke={
                                isSelected
                                  ? '#84E12B'
                                  : isHovered
                                    ? 'rgba(132, 225, 43, 0.7)'
                                    : 'rgba(132, 225, 43, 0.28)'
                              }
                              strokeWidth={isSelected ? 1.7 : isHovered ? 1.3 : 0.85}
                              strokeLinejoin="round"
                              onClick={() => setSelectedState(stateGeo.stateName)}
                              onMouseEnter={() => setHoveredState(stateGeo.stateName)}
                              onMouseLeave={() => setHoveredState(null)}
                              className="cursor-pointer transition-colors duration-150"
                            >
                              <title>{stateGeo.stateName}</title>
                            </path>
                          );
                        })}
                      </g>

                      {/* Trade Corridor Links */}
                      <g fill="none" pointerEvents="none">
                        {TRADE_CORRIDOR_LINKS.map((link) => {
                          const fromNode = nodeMap.get(link.from);
                          const toNode = nodeMap.get(link.to);
                          if (!fromNode || !toNode) return null;

                          const isHighlighted =
                            link.from === activeFocusName || link.to === activeFocusName;
                          const pathD = buildCurvedPath(
                            fromNode.x,
                            fromNode.y,
                            toNode.x,
                            toNode.y
                          );

                          return (
                            <path
                              key={`${link.from}-${link.to}`}
                              d={pathD}
                              stroke={
                                isHighlighted
                                  ? 'rgba(132, 225, 43, 0.7)'
                                  : 'rgba(168, 194, 175, 0.16)'
                              }
                              strokeWidth={isHighlighted ? 1.8 : 1}
                              strokeDasharray={isHighlighted ? '5 3' : '2 4'}
                            />
                          );
                        })}
                      </g>

                      {/* Simple SVG Markers for Pilot Density States */}
                      {nodes.map((node) => {
                        const isSelected = node.stateName === selectedState;
                        const isHovered = node.stateName === hoveredState;
                        const isActive = isSelected || isHovered;
                        const r = node.radius;
                        const ringRadius = r;
                        const circumference = 2 * Math.PI * ringRadius;
                        const farmerArc = node.farmerShare * circumference;
                        const buyerArc = Math.max(0, circumference - farmerArc);
                        const { lx, ly, anchor } = getLabelCoords(node);

                        const singleModeColor =
                          filterMode === 'farmers' ? '#84E12B' : '#F4C44E';

                        return (
                          <g
                            key={node.stateName}
                            role="button"
                            tabIndex={0}
                            aria-label={`${node.stateName}: ${node.farmers} registered farmers, ${node.buyers} registered buyers`}
                            aria-pressed={isSelected}
                            data-testid={`map-marker-${node.stateName}`}
                            onClick={() => setSelectedState(node.stateName)}
                            onMouseEnter={() => setHoveredState(node.stateName)}
                            onMouseLeave={() => setHoveredState(null)}
                            onFocus={() => setHoveredState(node.stateName)}
                            onBlur={() => setHoveredState(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedState(node.stateName);
                              }
                            }}
                            className="cursor-pointer outline-none"
                          >
                            {/* Accessible tap/click target */}
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={Math.max(22, r + 7)}
                              fill="transparent"
                            />

                            {/* Density halo */}
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={r + (isActive ? 7.5 : 5)}
                              fill={
                                filterMode === 'buyers'
                                  ? '#F4C44E'
                                  : filterMode === 'farmers'
                                    ? '#84E12B'
                                    : node.farmerShare >= 0.5
                                      ? '#84E12B'
                                      : '#F4C44E'
                              }
                              fillOpacity={isActive ? 0.28 : 0.14}
                            />

                            {/* Selected outline ring */}
                            {isSelected && (
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r={r + 8.5}
                                fill="none"
                                stroke="#FFFFFF"
                                strokeOpacity={0.85}
                                strokeWidth={1.4}
                                strokeDasharray="3.5 3"
                              />
                            )}

                            {/* Simple SVG Marker Core */}
                            {filterMode === 'all' ? (
                              <>
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={ringRadius}
                                  fill="#05130A"
                                />
                                {/* Buyer arc */}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={ringRadius}
                                  fill="none"
                                  stroke="#F4C44E"
                                  strokeWidth={3.6}
                                  strokeDasharray={`${buyerArc} ${circumference}`}
                                  strokeDashoffset={-farmerArc}
                                  transform={`rotate(-90 ${node.x} ${node.y})`}
                                />
                                {/* Farmer arc */}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={ringRadius}
                                  fill="none"
                                  stroke="#84E12B"
                                  strokeWidth={3.6}
                                  strokeDasharray={`${farmerArc} ${circumference}`}
                                  transform={`rotate(-90 ${node.x} ${node.y})`}
                                />
                                {/* Inner marker dot */}
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={Math.max(3.2, r * 0.34)}
                                  fill={node.farmerShare >= 0.5 ? '#84E12B' : '#F4C44E'}
                                />
                              </>
                            ) : (
                              <>
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={r}
                                  fill={singleModeColor}
                                  fillOpacity={isActive ? 0.96 : 0.85}
                                  stroke="#05130A"
                                  strokeWidth={2.2}
                                />
                                <circle
                                  cx={node.x}
                                  cy={node.y}
                                  r={Math.max(2.8, r * 0.28)}
                                  fill="#05130A"
                                />
                              </>
                            )}

                            {/* State Label with subtle dark halo for crisp legibility */}
                            <text
                              x={lx}
                              y={ly}
                              textAnchor={anchor}
                              fontSize={isActive ? '13' : '11.5'}
                              fontWeight={isActive ? '700' : '600'}
                              fill={isActive ? '#FFFFFF' : '#E2EDE4'}
                              stroke="#05130A"
                              strokeWidth="3.5"
                              paintOrder="stroke"
                            >
                              {node.shortLabel}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Map Legend & Scale Key */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#A8C2AF]">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full bg-[#84E12B]"
                        />
                        <span>Registered Farmers</span>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full bg-[#F4C44E]"
                        />
                        <span>Registered Buyers</span>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block w-4 border-t border-dashed border-[#84E12B]/70"
                        />
                        <span>Trade Corridor</span>
                      </span>
                    </div>
                    <span>Click any state or marker to inspect</span>
                  </div>
                </div>

                {/* Right column: Selected State Breakdown + Top States Ranking */}
                <div className="flex flex-col gap-5 lg:col-span-5">
                  {/* Network Totals Strip */}
                  <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10 pb-5">
                    <div className="pr-4">
                      <div className="text-xs text-[#9DBBA5]">Mapped Farmers</div>
                      <div
                        data-testid="map-total-farmers"
                        className="font-mono-nums mt-1 text-2xl font-bold text-[#84E12B] tabular-nums"
                      >
                        {totalFarmers.toLocaleString()}
                      </div>
                    </div>
                    <div className="pl-5">
                      <div className="text-xs text-[#9DBBA5]">Mapped Buyers</div>
                      <div
                        data-testid="map-total-buyers"
                        className="font-mono-nums mt-1 text-2xl font-bold text-[#F4C44E] tabular-nums"
                      >
                        {totalBuyers.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Selected State Inspector */}
                  {activeNode ? (
                    <div
                      data-testid="map-state-inspector"
                      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#05130A]/80 p-5"
                    >
                      <ActiveWatermarkIcon
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute -right-4 -bottom-4 h-28 w-28 text-[#84E12B]/[0.06]"
                      />
                      <div className="relative z-10">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-xs font-medium text-[#9DBBA5]">
                            <span>{activeNode.zone}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="text-[#84E12B]">{activeNode.corridorRole}</span>
                          </p>
                          <span className="font-mono-nums text-xs text-[#A8C2AF] tabular-nums">
                            {activeNode.liveWaitlistCount} live web{' '}
                            {activeNode.liveWaitlistCount === 1 ? 'signup' : 'signups'}
                          </span>
                        </div>

                        <h3 className="mt-1.5 font-display text-2xl font-bold text-white">
                          {activeNode.stateName}
                        </h3>

                        {/* Farmer vs Buyer Density Bars */}
                        <div className="mt-4 space-y-3.5">
                          <div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-[#E5F0E7]">
                                Registered Farmers
                              </span>
                              <span
                                data-testid="inspector-farmers-count"
                                className="font-mono-nums font-bold text-[#84E12B] tabular-nums"
                              >
                                {activeNode.farmers}
                              </span>
                            </div>
                            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-[#84E12B] transition-all duration-300"
                                style={{
                                  width: `${Math.max(
                                    6,
                                    Math.round((activeNode.farmers / maxFarmers) * 100)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-[#E5F0E7]">
                                Registered Buyers
                              </span>
                              <span
                                data-testid="inspector-buyers-count"
                                className="font-mono-nums font-bold text-[#F4C44E] tabular-nums"
                              >
                                {activeNode.buyers}
                              </span>
                            </div>
                            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-[#F4C44E] transition-all duration-300"
                                style={{
                                  width: `${Math.max(
                                    6,
                                    Math.round((activeNode.buyers / maxBuyers) * 100)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-xs text-[#9DBBA5]">
                          <span className="font-semibold text-white">Key staples: </span>
                          {activeNode.staples.join(' · ')}
                        </p>

                        <p className="mt-2.5 text-sm leading-relaxed text-[#CFE0D3]">
                          {activeNode.insight}
                        </p>

                        <button
                          type="button"
                          onClick={() => onSelectStateAndScroll(activeNode.stateName)}
                          className="group mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#84E12B] px-5 py-2.5 text-xs font-bold text-[#05130A] whitespace-nowrap transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] cursor-pointer"
                        >
                          <span>Join {activeNode.stateName} Waitlist</span>
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  ) : (
                    fallbackStateMeta && (
                      <div
                        data-testid="map-state-inspector"
                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#05130A]/80 p-5"
                      >
                        <MapPin
                          aria-hidden="true"
                          className="pointer-events-none select-none absolute -right-4 -bottom-4 h-28 w-28 text-[#84E12B]/[0.06]"
                        />
                        <div className="relative z-10">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="text-xs font-medium text-[#9DBBA5]">
                              Nationwide Expansion · Phase 2 Rollout
                            </p>
                            <span className="font-mono-nums text-xs text-[#A8C2AF] tabular-nums">
                              {fallbackLiveCounts.total} live web{' '}
                              {fallbackLiveCounts.total === 1 ? 'signup' : 'signups'}
                            </span>
                          </div>

                          <h3 className="mt-1.5 font-display text-2xl font-bold text-white">
                            {fallbackStateMeta.stateName}
                          </h3>

                          <div className="mt-4 grid grid-cols-2 divide-x divide-white/10 rounded-xl border border-white/10 bg-[#081C10]/60 py-3">
                            <div className="px-4">
                              <div className="text-xs text-[#9DBBA5]">Live Farmers</div>
                              <div className="font-mono-nums mt-0.5 text-lg font-bold text-[#84E12B] tabular-nums">
                                {fallbackLiveCounts.farmers}
                              </div>
                            </div>
                            <div className="px-4">
                              <div className="text-xs text-[#9DBBA5]">Live Buyers</div>
                              <div className="font-mono-nums mt-0.5 text-lg font-bold text-[#F4C44E] tabular-nums">
                                {fallbackLiveCounts.buyers}
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-relaxed text-[#CFE0D3]">
                            Early waitlist registrations in {fallbackStateMeta.stateName} help
                            prioritize which regional aggregation hubs and cold-chain corridors
                            launch next.
                          </p>

                          <button
                            type="button"
                            onClick={() => onSelectStateAndScroll(fallbackStateMeta.stateName)}
                            className="group mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#84E12B] px-5 py-2.5 text-xs font-bold text-[#05130A] whitespace-nowrap transition-all duration-150 hover:bg-[#97F043] hover:-translate-y-[1px] cursor-pointer"
                          >
                            <span>Join {fallbackStateMeta.stateName} Waitlist</span>
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  {/* Top States Quick-Select List */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#9DBBA5]">
                      <span className="font-semibold text-white">
                        {filterMode === 'farmers'
                          ? 'Top Farmer Basins'
                          : filterMode === 'buyers'
                            ? 'Top Buyer Hubs'
                            : 'Highest Network Density'}
                      </span>
                      <span>Click any state to inspect</span>
                    </div>

                    <div className="mt-2 divide-y divide-white/10 border-t border-white/10">
                      {ranked.slice(0, 5).map((item, idx) => {
                        const active = item.stateName === selectedState;
                        return (
                          <button
                            key={item.stateName}
                            type="button"
                            onClick={() => setSelectedState(item.stateName)}
                            className={`flex min-h-[40px] w-full items-center justify-between gap-3 px-2 py-2 text-left transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#163F24]/55 text-white'
                                : 'text-[#CFE0D3] hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="font-mono-nums text-xs font-semibold text-[#84E12B] tabular-nums">
                                0{idx + 1}
                              </span>
                              <span className="truncate text-sm font-medium">
                                {item.stateName}
                              </span>
                            </div>
                            <span className="font-mono-nums shrink-0 text-xs tabular-nums">
                              <span className="text-[#84E12B]">{item.farmers}F</span>
                              <span className="text-[#6D8F76]"> · </span>
                              <span className="text-[#F4C44E]">{item.buyers}B</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
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
