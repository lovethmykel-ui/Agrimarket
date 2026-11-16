import { AGRIMARKET_IMAGES } from './assets';
import type { ProduceCategoryId } from '../utils/waitlist';

export interface ProduceCategoryInfo {
  id: ProduceCategoryId;
  name: string;
  image: string;
  imageAlt: string;
  tagline: string;
  sourceRegions: string;
  sampleItems: string[];
}

export const PRODUCE_CATALOG: ProduceCategoryInfo[] = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    image: AGRIMARKET_IMAGES.categories.vegetables,
    imageAlt: 'Fresh ripe red tomatoes, bell peppers, cucumbers, and leafy greens in a wooden farm crate',
    tagline: 'Vine-ripened tomatoes, peppers, onions, and crisp leafy greens harvested to order.',
    sourceRegions: 'Kaduna · Kano · Plateau · Oyo',
    sampleItems: ['Roma Tomatoes', 'Tatase & Scotch Bonnet', 'Crisp Leafy Greens', 'Red Onions'],
  },
  {
    id: 'fruits',
    name: 'Fruits',
    image: AGRIMARKET_IMAGES.categories.fruits,
    imageAlt: 'Fresh tropical mangoes, bananas, oranges, and pineapples in a woven farm basket',
    tagline: 'Orchard-picked mangoes, citrus, pineapples, and plantains without cold-room aging.',
    sourceRegions: 'Benue · Ogun · Cross River · Ondo',
    sampleItems: ['Benue Sweet Oranges', 'Golden Mangoes', 'Bunch Plantains', 'Sugar Pineapples'],
  },
  {
    id: 'grains',
    name: 'Grains',
    image: AGRIMARKET_IMAGES.categories.grains,
    imageAlt: 'Woven burlap sacks filled with golden maize corn, parboiled rice, millet, and sorghum',
    tagline: 'Cleaned, moisture-checked local rice, maize, millet, sorghum, and dry beans in bulk or bags.',
    sourceRegions: 'Kebbi · Niger · Nasarawa · Taraba',
    sampleItems: ['Stone-Free Local Rice', 'Yellow & White Maize', 'Pearl Millet', 'Brown Honey Beans'],
  },
  {
    id: 'livestock',
    name: 'Livestock',
    image: AGRIMARKET_IMAGES.categories.livestock,
    imageAlt: 'Healthy brown and white cattle grazing on lush green pasture',
    tagline: 'Vet-inspected cattle, goats, and rams sourced transparently from partner ranches.',
    sourceRegions: 'Sokoto · Katsina · Adamawa · Bauchi',
    sampleItems: ['Vet-Verified Cattle', 'West African Dwarf Goats', 'Ram & Sheep Lots', 'Traceable Ranching'],
  },
  {
    id: 'poultry',
    name: 'Poultry',
    image: AGRIMARKET_IMAGES.categories.poultry,
    imageAlt: 'Healthy free-range brown chickens in a sunny green farmyard',
    tagline: 'Farm-raised broilers, layers, and fresh crates of table eggs from audited hatcheries.',
    sourceRegions: 'Ogun · Oyo · Osun · Kwara',
    sampleItems: ['Fresh Table Eggs', 'Live & Dressed Broilers', 'Day-Old Chicks', 'Guinea Fowl'],
  },
  {
    id: 'fish',
    name: 'Fish',
    image: AGRIMARKET_IMAGES.categories.fish,
    imageAlt: 'Freshly caught tilapia and catfish arranged cleanly on crushed ice',
    tagline: 'Chilled pond-harvested catfish, tilapia, and hygienically smoked fish ready for dispatch.',
    sourceRegions: 'Lagos · Delta · Rivers · Bayelsa',
    sampleItems: ['Live & Dressed Catfish', 'Fresh Tilapia', 'Kiln-Smoked Catfish', 'Crayfish & Prawns'],
  },
];

export const ABOUT_PILLARS = [
  {
    id: 'support-farmers',
    title: 'Support Local Farmers',
    description:
      'Farmers set fair farm-gate prices and gain direct access to households, restaurants, and bulk buyers.',
  },
  {
    id: 'better-prices',
    title: 'Get Better Prices',
    description:
      'Cutting out layered middlemen lowers food costs for families while keeping more value on the farm.',
  },
  {
    id: 'food-security',
    title: 'Build a Food Secure Nigeria',
    description:
      'Coordinated cold-chain dispatch and pre-harvest demand matching reduce post-harvest spoilage.',
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Join the Waitlist',
    description: 'Reserve early access as a buyer, local farmer, or logistics partner in your state.',
  },
  {
    step: '02',
    title: 'Early Cohort Invite',
    description: 'Get onboarded first when our Q1 2027 regional pilot corridors open for harvest.',
  },
  {
    step: '03',
    title: 'Order & Escrow Pay',
    description: 'Buy directly from verified growers with protected escrow released on delivery.',
  },
  {
    step: '04',
    title: 'Farm-to-Door Dispatch',
    description: 'Track fresh produce from regional aggregation hubs straight to your kitchen or store.',
  },
] as const;
