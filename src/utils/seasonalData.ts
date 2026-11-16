export type NigerianCorridorId = 'kaduna' | 'benue' | 'kebbi' | 'oyo' | 'plateau';
export type CrossStateCropId = 'tomatoes' | 'maize' | 'rice' | 'yams';

export interface CropSeriesMeta {
  key: string;
  label: string;
  color: string;
}

export interface MonthlyCropPoint {
  month: string;
  [cropKey: string]: string | number;
}

export interface StateCorridorProfile {
  id: NigerianCorridorId;
  stateName: string;
  waitlistStateValue: string;
  corridorTagline: string;
  platformValue: string;
  crops: [CropSeriesMeta, CropSeriesMeta, CropSeriesMeta];
  monthly: MonthlyCropPoint[];
}

export interface CrossStateComparisonProfile {
  id: CrossStateCropId;
  label: string;
  unitNote: string;
  insight: string;
  states: [CropSeriesMeta, CropSeriesMeta, CropSeriesMeta];
  monthly: MonthlyCropPoint[];
}

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const STATE_CORRIDORS: Record<NigerianCorridorId, StateCorridorProfile> = {
  kaduna: {
    id: 'kaduna',
    stateName: 'Kaduna',
    waitlistStateValue: 'Kaduna',
    corridorTagline: 'Dry-season irrigated tomatoes & rain-fed northern grains',
    platformValue:
      'AgriMarket pre-books irrigated Q1 tomato surpluses before gluts spoil on the farm and routes autumn maize directly to southern buyers.',
    crops: [
      { key: 'tomatoes', label: 'Roma Tomatoes', color: '#84E12B' },
      { key: 'maize', label: 'White Maize', color: '#F4C44E' },
      { key: 'ginger', label: 'Fresh Ginger', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', tomatoes: 88, maize: 54, ginger: 72 },
      { month: 'Feb', tomatoes: 95, maize: 46, ginger: 64 },
      { month: 'Mar', tomatoes: 92, maize: 38, ginger: 48 },
      { month: 'Apr', tomatoes: 78, maize: 30, ginger: 36 },
      { month: 'May', tomatoes: 52, maize: 24, ginger: 28 },
      { month: 'Jun', tomatoes: 34, maize: 22, ginger: 25 },
      { month: 'Jul', tomatoes: 28, maize: 32, ginger: 30 },
      { month: 'Aug', tomatoes: 30, maize: 58, ginger: 42 },
      { month: 'Sep', tomatoes: 45, maize: 86, ginger: 68 },
      { month: 'Oct', tomatoes: 62, maize: 96, ginger: 88 },
      { month: 'Nov', tomatoes: 74, maize: 90, ginger: 94 },
      { month: 'Dec', tomatoes: 84, maize: 72, ginger: 86 },
    ],
  },
  benue: {
    id: 'benue',
    stateName: 'Benue',
    waitlistStateValue: 'Benue',
    corridorTagline: 'Food basket yam tubers, sweet citrus & tropical mangoes',
    platformValue:
      'Coordinated cold-chain pickup turns Benue’s steep citrus and mango peaks into scheduled deliveries for Lagos and Abuja retailers.',
    crops: [
      { key: 'yams', label: 'White Yam', color: '#84E12B' },
      { key: 'oranges', label: 'Sweet Oranges', color: '#F4C44E' },
      { key: 'mangoes', label: 'Julie Mangoes', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', yams: 76, oranges: 86, mangoes: 28 },
      { month: 'Feb', yams: 64, oranges: 74, mangoes: 58 },
      { month: 'Mar', yams: 50, oranges: 52, mangoes: 90 },
      { month: 'Apr', yams: 38, oranges: 36, mangoes: 96 },
      { month: 'May', yams: 28, oranges: 24, mangoes: 78 },
      { month: 'Jun', yams: 34, oranges: 22, mangoes: 42 },
      { month: 'Jul', yams: 62, oranges: 30, mangoes: 18 },
      { month: 'Aug', yams: 84, oranges: 44, mangoes: 14 },
      { month: 'Sep', yams: 94, oranges: 68, mangoes: 12 },
      { month: 'Oct', yams: 96, oranges: 88, mangoes: 15 },
      { month: 'Nov', yams: 90, oranges: 94, mangoes: 18 },
      { month: 'Dec', yams: 82, oranges: 92, mangoes: 22 },
    ],
  },
  kebbi: {
    id: 'kebbi',
    stateName: 'Kebbi',
    waitlistStateValue: 'Kebbi',
    corridorTagline: 'Dual-cycle parboiled rice, red onions & Sahelian millet',
    platformValue:
      'Combining Kebbi’s dry-season Fadama rice harvest with November main-season milling keeps stone-free local rice priced steadily all year.',
    crops: [
      { key: 'rice', label: 'Parboiled Rice', color: '#84E12B' },
      { key: 'onions', label: 'Red Onions', color: '#F4C44E' },
      { key: 'millet', label: 'Pearl Millet', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', rice: 78, onions: 68, millet: 74 },
      { month: 'Feb', rice: 70, onions: 88, millet: 64 },
      { month: 'Mar', rice: 74, onions: 95, millet: 50 },
      { month: 'Apr', rice: 86, onions: 90, millet: 38 },
      { month: 'May', rice: 82, onions: 66, millet: 28 },
      { month: 'Jun', rice: 58, onions: 44, millet: 24 },
      { month: 'Jul', rice: 44, onions: 32, millet: 30 },
      { month: 'Aug', rice: 38, onions: 28, millet: 54 },
      { month: 'Sep', rice: 52, onions: 34, millet: 84 },
      { month: 'Oct', rice: 74, onions: 42, millet: 96 },
      { month: 'Nov', rice: 94, onions: 52, millet: 92 },
      { month: 'Dec', rice: 90, onions: 60, millet: 82 },
    ],
  },
  oyo: {
    id: 'oyo',
    stateName: 'Oyo',
    waitlistStateValue: 'Oyo',
    corridorTagline: 'Early southern maize, plantains & year-round cassava',
    platformValue:
      'Oyo’s June–August early harvest supplies fresh maize and plantains across Lagos and Ogun right when northern grain stocks tighten.',
    crops: [
      { key: 'plantains', label: 'Plantains', color: '#84E12B' },
      { key: 'maize', label: 'Yellow Maize', color: '#F4C44E' },
      { key: 'cassava', label: 'Cassava Tubers', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', plantains: 76, maize: 46, cassava: 84 },
      { month: 'Feb', plantains: 68, maize: 38, cassava: 80 },
      { month: 'Mar', plantains: 60, maize: 34, cassava: 76 },
      { month: 'Apr', plantains: 54, maize: 42, cassava: 74 },
      { month: 'May', plantains: 58, maize: 64, cassava: 78 },
      { month: 'Jun', plantains: 66, maize: 88, cassava: 82 },
      { month: 'Jul', plantains: 74, maize: 94, cassava: 84 },
      { month: 'Aug', plantains: 82, maize: 86, cassava: 86 },
      { month: 'Sep', plantains: 90, maize: 72, cassava: 88 },
      { month: 'Oct', plantains: 94, maize: 64, cassava: 90 },
      { month: 'Nov', plantains: 90, maize: 58, cassava: 88 },
      { month: 'Dec', plantains: 84, maize: 52, cassava: 86 },
    ],
  },
  plateau: {
    id: 'plateau',
    stateName: 'Plateau',
    waitlistStateValue: 'Plateau',
    corridorTagline: 'Cool highland tomatoes, Irish potatoes & crisp vegetables',
    platformValue:
      'Plateau’s cool Jos altitude peaks in July–October — filling Nigeria’s rainy-season tomato and pepper gap when lowland farms pause.',
    crops: [
      { key: 'tomatoes', label: 'Highland Tomatoes', color: '#84E12B' },
      { key: 'potatoes', label: 'Irish Potatoes', color: '#F4C44E' },
      { key: 'peppers', label: 'Bell Peppers', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', tomatoes: 46, potatoes: 54, peppers: 52 },
      { month: 'Feb', tomatoes: 38, potatoes: 44, peppers: 44 },
      { month: 'Mar', tomatoes: 34, potatoes: 36, peppers: 38 },
      { month: 'Apr', tomatoes: 42, potatoes: 42, peppers: 46 },
      { month: 'May', tomatoes: 58, potatoes: 62, peppers: 58 },
      { month: 'Jun', tomatoes: 74, potatoes: 84, peppers: 72 },
      { month: 'Jul', tomatoes: 88, potatoes: 94, peppers: 84 },
      { month: 'Aug', tomatoes: 95, potatoes: 96, peppers: 90 },
      { month: 'Sep', tomatoes: 92, potatoes: 90, peppers: 92 },
      { month: 'Oct', tomatoes: 82, potatoes: 78, peppers: 84 },
      { month: 'Nov', tomatoes: 66, potatoes: 68, peppers: 70 },
      { month: 'Dec', tomatoes: 54, potatoes: 60, peppers: 60 },
    ],
  },
};

export const CROSS_STATE_COMPARISONS: Record<CrossStateCropId, CrossStateComparisonProfile> = {
  tomatoes: {
    id: 'tomatoes',
    label: 'Tomatoes',
    unitNote: 'Supply Availability Index (0–100)',
    insight:
      'Kaduna irrigated farms peak Jan–Apr (95), while Plateau highland farms peak Jul–Oct (95). Linking both corridors eliminates the mid-year tomato scarcity spike.',
    states: [
      { key: 'kaduna', label: 'Kaduna State', color: '#84E12B' },
      { key: 'plateau', label: 'Plateau State', color: '#F4C44E' },
      { key: 'oyo', label: 'Oyo State', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', kaduna: 88, plateau: 46, oyo: 38 },
      { month: 'Feb', kaduna: 95, plateau: 38, oyo: 34 },
      { month: 'Mar', kaduna: 92, plateau: 34, oyo: 32 },
      { month: 'Apr', kaduna: 78, plateau: 42, oyo: 44 },
      { month: 'May', kaduna: 52, plateau: 58, oyo: 64 },
      { month: 'Jun', kaduna: 34, plateau: 74, oyo: 78 },
      { month: 'Jul', kaduna: 28, plateau: 88, oyo: 72 },
      { month: 'Aug', kaduna: 30, plateau: 95, oyo: 58 },
      { month: 'Sep', kaduna: 45, plateau: 92, oyo: 62 },
      { month: 'Oct', kaduna: 62, plateau: 82, oyo: 68 },
      { month: 'Nov', kaduna: 74, plateau: 66, oyo: 56 },
      { month: 'Dec', kaduna: 84, plateau: 54, oyo: 44 },
    ],
  },
  maize: {
    id: 'maize',
    label: 'Maize',
    unitNote: 'Supply Availability Index (0–100)',
    insight:
      'Early southern maize from Oyo peaks Jun–Jul (94) before northern harvests in Kaduna and Benue surge Sep–Nov (96), stabilizing livestock feed and household costs.',
    states: [
      { key: 'oyo', label: 'Oyo State', color: '#84E12B' },
      { key: 'kaduna', label: 'Kaduna State', color: '#F4C44E' },
      { key: 'benue', label: 'Benue State', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', oyo: 46, kaduna: 54, benue: 50 },
      { month: 'Feb', oyo: 38, kaduna: 46, benue: 42 },
      { month: 'Mar', oyo: 34, kaduna: 38, benue: 36 },
      { month: 'Apr', oyo: 42, kaduna: 30, benue: 34 },
      { month: 'May', oyo: 64, kaduna: 24, benue: 42 },
      { month: 'Jun', oyo: 88, kaduna: 22, benue: 58 },
      { month: 'Jul', oyo: 94, kaduna: 32, benue: 74 },
      { month: 'Aug', oyo: 86, kaduna: 58, benue: 86 },
      { month: 'Sep', oyo: 72, kaduna: 86, benue: 92 },
      { month: 'Oct', oyo: 64, kaduna: 96, benue: 90 },
      { month: 'Nov', oyo: 58, kaduna: 90, benue: 78 },
      { month: 'Dec', oyo: 52, kaduna: 72, benue: 64 },
    ],
  },
  rice: {
    id: 'rice',
    label: 'Rice',
    unitNote: 'Supply Availability Index (0–100)',
    insight:
      'Dual-season irrigation in Kebbi paired with Benue and Niger lowland mills keeps local rice availability above 70 points across 8 months of the year.',
    states: [
      { key: 'kebbi', label: 'Kebbi State', color: '#84E12B' },
      { key: 'benue', label: 'Benue State', color: '#F4C44E' },
      { key: 'kaduna', label: 'Kaduna State', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', kebbi: 78, benue: 74, kaduna: 68 },
      { month: 'Feb', kebbi: 70, benue: 64, kaduna: 58 },
      { month: 'Mar', kebbi: 74, benue: 52, kaduna: 48 },
      { month: 'Apr', kebbi: 86, benue: 44, kaduna: 42 },
      { month: 'May', kebbi: 82, benue: 38, kaduna: 36 },
      { month: 'Jun', kebbi: 58, benue: 34, kaduna: 30 },
      { month: 'Jul', kebbi: 44, benue: 36, kaduna: 28 },
      { month: 'Aug', kebbi: 38, benue: 46, kaduna: 34 },
      { month: 'Sep', kebbi: 52, benue: 68, kaduna: 54 },
      { month: 'Oct', kebbi: 74, benue: 88, kaduna: 78 },
      { month: 'Nov', kebbi: 94, benue: 92, kaduna: 88 },
      { month: 'Dec', kebbi: 90, benue: 86, kaduna: 82 },
    ],
  },
  yams: {
    id: 'yams',
    label: 'Yam Tubers',
    unitNote: 'Supply Availability Index (0–100)',
    insight:
      'New-yam harvests begin in Oyo and Delta corridors in June–July before Benue’s peak bulk yam supply arrives Aug–Dec.',
    states: [
      { key: 'benue', label: 'Benue State', color: '#84E12B' },
      { key: 'oyo', label: 'Oyo State', color: '#F4C44E' },
      { key: 'kaduna', label: 'Kaduna State', color: '#38BDF8' },
    ],
    monthly: [
      { month: 'Jan', benue: 76, oyo: 66, kaduna: 58 },
      { month: 'Feb', benue: 64, oyo: 54, kaduna: 46 },
      { month: 'Mar', benue: 50, oyo: 44, kaduna: 36 },
      { month: 'Apr', benue: 38, oyo: 36, kaduna: 28 },
      { month: 'May', benue: 28, oyo: 40, kaduna: 24 },
      { month: 'Jun', benue: 34, oyo: 62, kaduna: 26 },
      { month: 'Jul', benue: 62, oyo: 82, kaduna: 44 },
      { month: 'Aug', benue: 84, oyo: 90, kaduna: 68 },
      { month: 'Sep', benue: 94, oyo: 92, kaduna: 84 },
      { month: 'Oct', benue: 96, oyo: 88, kaduna: 90 },
      { month: 'Nov', benue: 90, oyo: 80, kaduna: 82 },
      { month: 'Dec', benue: 82, oyo: 74, kaduna: 70 },
    ],
  },
};

export interface SeasonalSummary {
  peakMonth: string;
  peakScore: number;
  leanMonth: string;
  leanScore: number;
  combinedContinuityMonths: number;
}

export function summarizeSeasonalSeries(
  monthly: MonthlyCropPoint[],
  seriesKeys: string[]
): SeasonalSummary {
  if (monthly.length === 0 || seriesKeys.length === 0) {
    return {
      peakMonth: 'N/A',
      peakScore: 0,
      leanMonth: 'N/A',
      leanScore: 0,
      combinedContinuityMonths: 0,
    };
  }

  let peakMonth = monthly[0].month;
  let peakScore = -1;
  let leanMonth = monthly[0].month;
  let leanScore = Number.POSITIVE_INFINITY;
  let combinedContinuityMonths = 0;

  for (const point of monthly) {
    let maxInMonth = 0;
    for (const key of seriesKeys) {
      const val = Number(point[key] ?? 0);
      if (val > maxInMonth) maxInMonth = val;
    }

    const primaryVal = Number(point[seriesKeys[0]] ?? 0);
    if (primaryVal > peakScore) {
      peakScore = primaryVal;
      peakMonth = point.month;
    }
    if (primaryVal < leanScore) {
      leanScore = primaryVal;
      leanMonth = point.month;
    }
    if (maxInMonth >= 60) {
      combinedContinuityMonths += 1;
    }
  }

  return {
    peakMonth,
    peakScore: Math.max(0, peakScore),
    leanMonth,
    leanScore: Number.isFinite(leanScore) ? leanScore : 0,
    combinedContinuityMonths,
  };
}
