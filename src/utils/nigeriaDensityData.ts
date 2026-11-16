import {
  NIGERIA_SVG_HEIGHT,
  NIGERIA_SVG_STATES,
  NIGERIA_SVG_WIDTH,
} from './nigeriaSvgPaths';
import type { StateRoleCounts } from './waitlist';

export type DensityFilterMode = 'all' | 'farmers' | 'buyers';

export type LabelPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface NigeriaStateBaseNode {
  svgId: string;
  stateName: string;
  shortLabel: string;
  zone:
    | 'North West'
    | 'North East'
    | 'North Central'
    | 'South West'
    | 'South East'
    | 'South South';
  corridorRole: 'Supply Basin' | 'Demand Hub' | 'Trade Corridor';
  x: number;
  y: number;
  labelPlacement: LabelPlacement;
  baseFarmers: number;
  baseBuyers: number;
  staples: string[];
  insight: string;
}

export interface NigeriaStateDensityNode extends NigeriaStateBaseNode {
  farmers: number;
  buyers: number;
  partners: number;
  liveWaitlistCount: number;
  total: number;
  farmerShare: number;
  radius: number;
}

export interface TradeCorridorLink {
  from: string;
  to: string;
}

export const MAP_BOUNDS = {
  width: NIGERIA_SVG_WIDTH,
  height: NIGERIA_SVG_HEIGHT,
};

const SVG_STATE_LOOKUP = new Map(
  NIGERIA_SVG_STATES.map((state) => [state.stateName, state])
);

const RAW_STATE_NODES: Omit<NigeriaStateBaseNode, 'svgId' | 'x' | 'y'>[] = [
  {
    stateName: 'Kaduna',
    shortLabel: 'Kaduna',
    zone: 'North West',
    corridorRole: 'Supply Basin',
    labelPlacement: 'left',
    baseFarmers: 184,
    baseBuyers: 42,
    staples: ['Roma Tomatoes', 'White Maize', 'Fresh Ginger'],
    insight:
      'High cooperative farmer concentration feeds dry-season tomatoes and grain north-to-south.',
  },
  {
    stateName: 'Kano',
    shortLabel: 'Kano',
    zone: 'North West',
    corridorRole: 'Supply Basin',
    labelPlacement: 'top',
    baseFarmers: 162,
    baseBuyers: 68,
    staples: ['Red Onions', 'Tatase Peppers', 'Sorghum'],
    insight:
      'Dense northern grain and vegetable aggregation corridor linking rural growers with wholesale buyers.',
  },
  {
    stateName: 'Lagos',
    shortLabel: 'Lagos',
    zone: 'South West',
    corridorRole: 'Demand Hub',
    labelPlacement: 'bottom',
    baseFarmers: 18,
    baseBuyers: 214,
    staples: ['Fresh Vegetables', 'Poultry', 'Parboiled Rice'],
    insight:
      'Highest concentration of household, restaurant, and bulk retail buyers awaiting direct farm-gate crates.',
  },
  {
    stateName: 'FCT (Abuja)',
    shortLabel: 'Abuja',
    zone: 'North Central',
    corridorRole: 'Demand Hub',
    labelPlacement: 'left',
    baseFarmers: 26,
    baseBuyers: 146,
    staples: ['Tomatoes', 'Yam Tubers', 'Fresh Poultry'],
    insight:
      'Strong central consumer and hospitality demand anchored directly adjacent to Nasarawa and Kaduna farms.',
  },
  {
    stateName: 'Benue',
    shortLabel: 'Benue',
    zone: 'North Central',
    corridorRole: 'Supply Basin',
    labelPlacement: 'right',
    baseFarmers: 152,
    baseBuyers: 29,
    staples: ['White Yam', 'Sweet Oranges', 'Soybeans'],
    insight:
      'Dense cooperative orchard and tuber supply ready for scheduled inter-state cold-chain dispatch.',
  },
  {
    stateName: 'Oyo',
    shortLabel: 'Oyo',
    zone: 'South West',
    corridorRole: 'Trade Corridor',
    labelPlacement: 'right',
    baseFarmers: 92,
    baseBuyers: 84,
    staples: ['Yellow Maize', 'Cassava', 'Plantain'],
    insight:
      'Balanced producer-and-buyer corridor acting as the southwestern aggregation gateway into Lagos.',
  },
  {
    stateName: 'Plateau',
    shortLabel: 'Plateau',
    zone: 'North Central',
    corridorRole: 'Supply Basin',
    labelPlacement: 'right',
    baseFarmers: 118,
    baseBuyers: 31,
    staples: ['Irish Potatoes', 'Cabbage', 'Carrots'],
    insight:
      'Cool highland vegetable growers supplying off-season temperate greens across southern cities.',
  },
  {
    stateName: 'Kebbi',
    shortLabel: 'Kebbi',
    zone: 'North West',
    corridorRole: 'Supply Basin',
    labelPlacement: 'left',
    baseFarmers: 104,
    baseBuyers: 21,
    staples: ['Parboiled Rice', 'Onions', 'Millet'],
    insight:
      'Irrigated paddy rice clusters matching directly with urban grocery distributors without broker layers.',
  },
  {
    stateName: 'Ogun',
    shortLabel: 'Ogun',
    zone: 'South West',
    corridorRole: 'Trade Corridor',
    labelPlacement: 'right',
    baseFarmers: 76,
    baseBuyers: 64,
    staples: ['Broiler Poultry', 'Catfish', 'Leafy Greens'],
    insight:
      'Peri-urban livestock, hatchery, and aquaculture supply supporting fast-turnaround Lagos deliveries.',
  },
  {
    stateName: 'Rivers',
    shortLabel: 'Rivers',
    zone: 'South South',
    corridorRole: 'Demand Hub',
    labelPlacement: 'bottom',
    baseFarmers: 24,
    baseBuyers: 108,
    staples: ['Fresh Catfish', 'Plantain', 'Northern Tomatoes'],
    insight:
      'Coastal demand center pairing local aquaculture growers with northern vegetable and grain corridors.',
  },
  {
    stateName: 'Enugu',
    shortLabel: 'Enugu',
    zone: 'South East',
    corridorRole: 'Trade Corridor',
    labelPlacement: 'top',
    baseFarmers: 48,
    baseBuyers: 82,
    staples: ['Palm Oil', 'Yams', 'Vegetables'],
    insight:
      'Eastern regional hub receiving Benue tubers and northern grains for wholesale market distribution.',
  },
  {
    stateName: 'Edo',
    shortLabel: 'Edo',
    zone: 'South South',
    corridorRole: 'Trade Corridor',
    labelPlacement: 'top',
    baseFarmers: 58,
    baseBuyers: 52,
    staples: ['Plantain', 'Pineapple', 'Cassava'],
    insight:
      'Mid-west transit junction balancing orchard fruit harvests with commercial food buyer demand.',
  },
  {
    stateName: 'Nasarawa',
    shortLabel: 'Nasarawa',
    zone: 'North Central',
    corridorRole: 'Supply Basin',
    labelPlacement: 'right',
    baseFarmers: 84,
    baseBuyers: 26,
    staples: ['Sesame', 'Yam Tubers', 'Maize'],
    insight:
      'Immediate supply neighbor to Abuja providing short-haul daily fresh produce deliveries.',
  },
  {
    stateName: 'Sokoto',
    shortLabel: 'Sokoto',
    zone: 'North West',
    corridorRole: 'Supply Basin',
    labelPlacement: 'right',
    baseFarmers: 74,
    baseBuyers: 18,
    staples: ['Red Onions', 'Garlic', 'Cattle'],
    insight:
      'Dry-belt onion and livestock cooperatives queued for pre-booked inter-state freight.',
  },
  {
    stateName: 'Cross River',
    shortLabel: 'Cross River',
    zone: 'South South',
    corridorRole: 'Supply Basin',
    labelPlacement: 'right',
    baseFarmers: 64,
    baseBuyers: 34,
    staples: ['Plantain', 'Bananas', 'Cocoa'],
    insight:
      'Tropical southern fruit corridor extending year-round plantain and pineapple availability.',
  },
  {
    stateName: 'Borno',
    shortLabel: 'Borno',
    zone: 'North East',
    corridorRole: 'Supply Basin',
    labelPlacement: 'left',
    baseFarmers: 62,
    baseBuyers: 19,
    staples: ['Cowpea', 'Millet', 'Livestock'],
    insight:
      'North-eastern dry legume and livestock producer network onboarding for national grain corridors.',
  },
];

export const NIGERIA_STATE_NODES: NigeriaStateBaseNode[] = RAW_STATE_NODES.map((node) => {
  const svgMeta = SVG_STATE_LOOKUP.get(node.stateName);
  if (!svgMeta) {
    throw new Error(`Missing SVG state path metadata for ${node.stateName}`);
  }
  return {
    ...node,
    svgId: svgMeta.id,
    x: svgMeta.cx,
    y: svgMeta.cy,
  };
});

export const TRADE_CORRIDOR_LINKS: ReadonlyArray<TradeCorridorLink> = [
  { from: 'Kaduna', to: 'Lagos' },
  { from: 'Kaduna', to: 'FCT (Abuja)' },
  { from: 'Kano', to: 'Lagos' },
  { from: 'Kebbi', to: 'FCT (Abuja)' },
  { from: 'Benue', to: 'Enugu' },
  { from: 'Benue', to: 'Lagos' },
  { from: 'Plateau', to: 'Rivers' },
  { from: 'Nasarawa', to: 'FCT (Abuja)' },
  { from: 'Oyo', to: 'Lagos' },
  { from: 'Ogun', to: 'Lagos' },
  { from: 'Cross River', to: 'Rivers' },
  { from: 'Edo', to: 'Lagos' },
];

export function buildDensityNodes(
  liveByState: Record<string, StateRoleCounts> = {},
  filterMode: DensityFilterMode = 'all'
): {
  nodes: NigeriaStateDensityNode[];
  ranked: NigeriaStateDensityNode[];
  totalFarmers: number;
  totalBuyers: number;
  totalLiveWaitlist: number;
} {
  let maxMetric = 1;

  const preliminary = NIGERIA_STATE_NODES.map((base) => {
    const live = liveByState[base.stateName] ?? {
      buyers: 0,
      farmers: 0,
      partners: 0,
      total: 0,
    };
    const farmers = base.baseFarmers + live.farmers;
    const buyers = base.baseBuyers + live.buyers;
    const total = farmers + buyers + live.partners;
    const metric =
      filterMode === 'farmers' ? farmers : filterMode === 'buyers' ? buyers : total;
    if (metric > maxMetric) {
      maxMetric = metric;
    }

    return {
      ...base,
      farmers,
      buyers,
      partners: live.partners,
      liveWaitlistCount: live.total,
      total,
      farmerShare: total > 0 ? farmers / total : 0.5,
      metric,
    };
  });

  const nodes: NigeriaStateDensityNode[] = preliminary.map(({ metric, ...rest }) => {
    const ratio = Math.sqrt(Math.max(0, metric) / maxMetric);
    const radius = Math.round((7.5 + ratio * 13.5) * 10) / 10;
    return {
      ...rest,
      radius,
    };
  });

  const ranked = [...nodes].sort((a, b) => {
    if (filterMode === 'farmers') return b.farmers - a.farmers;
    if (filterMode === 'buyers') return b.buyers - a.buyers;
    return b.total - a.total;
  });

  const totalFarmers = nodes.reduce((acc, item) => acc + item.farmers, 0);
  const totalBuyers = nodes.reduce((acc, item) => acc + item.buyers, 0);
  const totalLiveWaitlist = nodes.reduce((acc, item) => acc + item.liveWaitlistCount, 0);

  return {
    nodes,
    ranked,
    totalFarmers,
    totalBuyers,
    totalLiveWaitlist,
  };
}
