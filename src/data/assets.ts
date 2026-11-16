import heroFarmerBasket from '../assets/images/hero_farmer_basket_1794787568015.jpg';
import aboutFarmerCrops from '../assets/images/about_farmer_crops_1794787568590.jpg';
import spotlightFarmerTomatoes from '../assets/images/spotlight_farmer_tomatoes_1794787568716.jpg';
import bannerTractorField from '../assets/images/banner_tractor_field_1794787568758.jpg';
import catVegetables from '../assets/images/cat_vegetables_1794787570208.jpg';
import catFruits from '../assets/images/cat_fruits_1794787569428.jpg';
import catGrains from '../assets/images/cat_grains_1794787569929.jpg';
import catLivestock from '../assets/images/cat_livestock_1794787570422.jpg';
import catPoultry from '../assets/images/cat_poultry_1794787570729.jpg';
import catFish from '../assets/images/cat_fish_1794787571632.jpg';

export const AGRIMARKET_IMAGES = {
  heroFarmerBasket,
  aboutFarmerCrops,
  spotlightFarmerTomatoes,
  bannerTractorField,
  categories: {
    vegetables: catVegetables,
    fruits: catFruits,
    grains: catGrains,
    livestock: catLivestock,
    poultry: catPoultry,
    fish: catFish,
  },
} as const;
