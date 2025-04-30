
// Types for our flavor system
export type TasteCategory = 'sweet' | 'salty' | 'sour' | 'bitter' | 'umami';
export type SmellCategory = 'floral' | 'fruity' | 'spicy' | 'earthy' | 'woody' | 'herbal' | 'smoky';
export type TextureCategory = 'crispy' | 'crunchy' | 'creamy' | 'smooth' | 'fizzy' | 'chewy' | 'tender' | 'juicy';
export type SoundCategory = 'crunchy' | 'fizzy' | 'snappy' | 'sizzling' | 'creamy' | 'silent';
export type VisualCategory = 'vibrant' | 'colorful' | 'monochromatic' | 'patterned' | 'glossy' | 'matte';

export type MoodCategory = 'cozy' | 'adventurous' | 'refreshing' | 'romantic' | 'energizing' | 'calming';

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  image: string;
  taste: TasteCategory[];
  smell: SmellCategory[];
  texture: TextureCategory[];
  sound: SoundCategory[];
  visual: VisualCategory[];
  moods: MoodCategory[];
}

export interface FlavorProfile {
  taste: Record<TasteCategory, number>;
  smell: Record<SmellCategory, number>;
  texture: Record<TextureCategory, number>;
  sound: Record<SoundCategory, number>;
  visual: Record<VisualCategory, number>;
}
