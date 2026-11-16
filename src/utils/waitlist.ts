export type WaitlistRole = 'buyer' | 'farmer' | 'partner';

export type ProduceCategoryId =
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'livestock'
  | 'poultry'
  | 'fish';

export interface WaitlistEntry {
  id: string;
  position: number;
  fullName: string;
  email: string;
  phone?: string;
  role: WaitlistRole;
  state: string;
  categories: ProduceCategoryId[];
  farmOrBusinessName?: string;
  createdAt: string;
}

export interface WaitlistInput {
  fullName: string;
  email: string;
  phone?: string;
  role: WaitlistRole;
  state: string;
  categories: ProduceCategoryId[];
  farmOrBusinessName?: string;
}

export interface WaitlistValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof WaitlistInput, string>>;
  normalized?: WaitlistInput;
}

export interface StateRoleCounts {
  buyers: number;
  farmers: number;
  partners: number;
  total: number;
}

export interface WaitlistStats {
  totalCount: number;
  byRole: Record<WaitlistRole, number>;
  byState: Record<string, StateRoleCounts>;
  topStates: Array<{ state: string; count: number }>;
  recentMembers: Array<{
    firstName: string;
    role: WaitlistRole;
    state: string;
    position: number;
  }>;
}

export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT (Abuja)',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
] as const;

export const WAITLIST_ROLE_META: Record<
  WaitlistRole,
  {
    label: string;
    shortLabel: string;
    description: string;
    ctaLabel: string;
    orgPlaceholder: string;
  }
> = {
  buyer: {
    label: 'Household & Bulk Buyer',
    shortLabel: 'Buyer',
    description: 'Shop farm-fresh produce directly from verified Nigerian growers at fair prices.',
    ctaLabel: 'Reserve Buyer Access',
    orgPlaceholder: 'Optional: Restaurant, supermarket, or household name',
  },
  farmer: {
    label: 'Farmer & Cooperative',
    shortLabel: 'Farmer',
    description: 'List your harvest, reach nationwide buyers, and receive guaranteed escrow payouts.',
    ctaLabel: 'Join Farmer Pilot',
    orgPlaceholder: 'Optional: Farm or cooperative name (e.g. Zaria Growers Co-op)',
  },
  partner: {
    label: 'Logistics & Cold-Chain',
    shortLabel: 'Agro-Partner',
    description: 'Partner with AgriMarket for produce aggregation, cold storage, and inter-state delivery.',
    ctaLabel: 'Apply as Partner',
    orgPlaceholder: 'Optional: Logistics or warehouse company name',
  },
};

export const VALID_CATEGORY_IDS: ProduceCategoryId[] = [
  'vegetables',
  'fruits',
  'grains',
  'livestock',
  'poultry',
  'fish',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return normalized.length <= 254 && EMAIL_REGEX.test(normalized);
}

export function isValidNigerianOrIntlPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  if (!cleaned) return true;
  if (!/^\+?\d{7,15}$/.test(cleaned)) {
    return false;
  }
  return true;
}

export function validateWaitlistInput(input: Partial<WaitlistInput>): WaitlistValidationResult {
  const errors: Partial<Record<keyof WaitlistInput, string>> = {};

  const fullName = (input.fullName ?? '').trim();
  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Name must be 100 characters or fewer.';
  }

  const rawEmail = input.email ?? '';
  const email = normalizeEmail(rawEmail);
  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const phone = (input.phone ?? '').trim();
  if (phone && !isValidNigerianOrIntlPhone(phone)) {
    errors.phone = 'Enter a valid phone number (e.g. 0803 123 4567 or +234 803 123 4567).';
  }

  const role: WaitlistRole =
    input.role === 'buyer' || input.role === 'farmer' || input.role === 'partner'
      ? input.role
      : 'buyer';

  const state = (input.state ?? '').trim();
  if (!state) {
    errors.state = 'Please select your state in Nigeria.';
  }

  const rawCategories = Array.isArray(input.categories) ? input.categories : [];
  const categories = Array.from(
    new Set(rawCategories.filter((c): c is ProduceCategoryId => VALID_CATEGORY_IDS.includes(c)))
  );

  const farmOrBusinessName = (input.farmOrBusinessName ?? '').trim().slice(0, 120);

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    normalized: {
      fullName,
      email,
      phone: phone || undefined,
      role,
      state,
      categories: categories.length > 0 ? categories : ['vegetables'],
      farmOrBusinessName: farmOrBusinessName || undefined,
    },
  };
}

export function validateQuickEmail(email: string): {
  valid: boolean;
  error?: string;
  normalized?: string;
} {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { valid: false, error: 'Enter your email address to subscribe.' };
  }
  if (!isValidEmail(normalized)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true, normalized };
}

export function formatQueueNumber(position: number): string {
  const safe = Math.max(1, Math.floor(position));
  return `#${String(safe).padStart(4, '0')}`;
}

export function extractFirstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] || 'Member';
  return first.slice(0, 24);
}

export function computeWaitlistStats(
  entries: WaitlistEntry[],
  newsletterCount = 0
): WaitlistStats {
  const byRole: Record<WaitlistRole, number> = {
    buyer: 0,
    farmer: 0,
    partner: 0,
  };
  const stateMap = new Map<string, number>();
  const byState: Record<string, StateRoleCounts> = {};

  for (const entry of entries) {
    byRole[entry.role] = (byRole[entry.role] || 0) + 1;
    stateMap.set(entry.state, (stateMap.get(entry.state) || 0) + 1);

    if (!byState[entry.state]) {
      byState[entry.state] = { buyers: 0, farmers: 0, partners: 0, total: 0 };
    }
    if (entry.role === 'buyer') byState[entry.state].buyers += 1;
    else if (entry.role === 'farmer') byState[entry.state].farmers += 1;
    else byState[entry.state].partners += 1;
    byState[entry.state].total += 1;
  }

  const topStates = Array.from(stateMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentMembers = [...entries]
    .sort((a, b) => b.position - a.position)
    .slice(0, 4)
    .map((entry) => ({
      firstName: extractFirstName(entry.fullName),
      role: entry.role,
      state: entry.state,
      position: entry.position,
    }));

  return {
    totalCount: entries.length + Math.max(0, newsletterCount),
    byRole,
    byState,
    topStates,
    recentMembers,
  };
}
