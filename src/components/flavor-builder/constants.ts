
import { TasteCategory, SmellCategory, TextureCategory } from '@/utils/flavor';

export const tasteCategories: { value: TasteCategory; label: string; color: string }[] = [
  { value: 'sweet', label: 'Sweet', color: 'bg-flavor-pink text-black' },
  { value: 'salty', label: 'Salty', color: 'bg-flavor-blue text-black' },
  { value: 'sour', label: 'Sour', color: 'bg-flavor-yellow text-black' },
  { value: 'bitter', label: 'Bitter', color: 'bg-flavor-lavender text-black' },
  { value: 'umami', label: 'Umami', color: 'bg-flavor-orange text-black' },
];

export const smellCategories: { value: SmellCategory; label: string }[] = [
  { value: 'floral', label: 'Floral' },
  { value: 'fruity', label: 'Fruity' },
  { value: 'spicy', label: 'Spicy' },
  { value: 'earthy', label: 'Earthy' },
  { value: 'woody', label: 'Woody' },
  { value: 'herbal', label: 'Herbal' },
  { value: 'smoky', label: 'Smoky' },
];

export const textureCategories: { value: TextureCategory; label: string }[] = [
  { value: 'crispy', label: 'Crispy' },
  { value: 'crunchy', label: 'Crunchy' },
  { value: 'creamy', label: 'Creamy' },
  { value: 'smooth', label: 'Smooth' },
  { value: 'fizzy', label: 'Fizzy' },
  { value: 'chewy', label: 'Chewy' },
  { value: 'tender', label: 'Tender' },
];

export const tasteCategoriesColorMap = tasteCategories.reduce((acc, category) => {
  acc[category.value] = category.color;
  return acc;
}, {} as Record<TasteCategory, string>);
