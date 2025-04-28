
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

// Sample ingredients database
export const ingredients: Ingredient[] = [
  {
    id: '1',
    name: 'Strawberry',
    description: 'Sweet and slightly tart with a juicy texture',
    image: '/strawberry.jpg',
    taste: ['sweet', 'sour'],
    smell: ['fruity', 'floral'],
    texture: ['smooth', 'tender'],
    sound: ['silent'],
    visual: ['vibrant', 'colorful'],
    moods: ['romantic', 'refreshing', 'energizing']
  },
  {
    id: '2',
    name: 'Dark Chocolate',
    description: 'Intensely rich with bitter notes and hints of sweetness',
    image: '/chocolate.jpg',
    taste: ['bitter', 'sweet'],
    smell: ['earthy', 'woody'],
    texture: ['smooth', 'creamy'],
    sound: ['snappy'],
    visual: ['monochromatic', 'glossy'],
    moods: ['cozy', 'romantic']
  },
  {
    id: '3',
    name: 'Sea Salt',
    description: 'Pure briny taste with mineral complexity',
    image: '/salt.jpg',
    taste: ['salty'],
    smell: [],
    texture: ['crispy'],
    sound: ['crunchy'],
    visual: ['monochromatic', 'matte'],
    moods: ['adventurous']
  },
  {
    id: '4',
    name: 'Cinnamon',
    description: 'Warm spice with sweet and woody notes',
    image: '/cinnamon.jpg',
    taste: ['sweet', 'bitter'],
    smell: ['spicy', 'woody'],
    texture: [],
    sound: [],
    visual: ['monochromatic'],
    moods: ['cozy', 'energizing']
  },
  {
    id: '5',
    name: 'Lime',
    description: 'Bright citrus with intense sourness and aromatic oils',
    image: '/lime.jpg',
    taste: ['sour'],
    smell: ['fruity', 'herbal'],
    texture: ['juicy'],
    sound: [],
    visual: ['vibrant', 'colorful'],
    moods: ['refreshing', 'energizing', 'adventurous']
  },
  {
    id: '6',
    name: 'Mushroom',
    description: 'Earthy with deep savory notes',
    image: '/mushroom.jpg',
    taste: ['umami'],
    smell: ['earthy'],
    texture: ['tender', 'chewy'],
    sound: [],
    visual: ['monochromatic'],
    moods: ['cozy', 'adventurous']
  },
  {
    id: '7',
    name: 'Honey',
    description: 'Floral sweetness with complex aromatics',
    image: '/honey.jpg',
    taste: ['sweet'],
    smell: ['floral', 'fruity'],
    texture: ['smooth'],
    sound: [],
    visual: ['glossy', 'vibrant'],
    moods: ['calming', 'cozy', 'romantic']
  },
  {
    id: '8',
    name: 'Potato Chips',
    description: 'Salty with a satisfying crunch',
    image: '/chips.jpg',
    taste: ['salty'],
    smell: ['earthy'],
    texture: ['crispy', 'crunchy'],
    sound: ['crunchy', 'snappy'],
    visual: ['patterned', 'colorful'],
    moods: ['energizing']
  },
  {
    id: '9',
    name: 'Basil',
    description: 'Aromatic herb with sweet and peppery notes',
    image: '/basil.jpg',
    taste: ['bitter'],
    smell: ['herbal', 'spicy'],
    texture: [],
    sound: [],
    visual: ['vibrant'],
    moods: ['refreshing', 'energizing']
  },
  {
    id: '10',
    name: 'Bacon',
    description: 'Savory, smoky and salty with a rich aroma',
    image: '/bacon.jpg',
    taste: ['salty', 'umami'],
    smell: ['smoky', 'woody'],
    texture: ['crispy', 'chewy'],
    sound: ['crunchy', 'sizzling'],
    visual: ['patterned'],
    moods: ['cozy', 'adventurous']
  }
];

// Get complementary ingredients based on a list of selected ingredient IDs
export const getComplementaryIngredients = (selectedIds: string[]): Ingredient[] => {
  if (selectedIds.length === 0) {
    return ingredients.slice(0, 4); // Return some default recommendations
  }

  const selectedIngredients = ingredients.filter(ing => selectedIds.includes(ing.id));
  
  // Create a map to track compatibility scores
  const compatibilityScores: Record<string, number> = {};
  
  // Ingredients not already selected
  const availableIngredients = ingredients.filter(ing => !selectedIds.includes(ing.id));
  
  // Score each available ingredient
  availableIngredients.forEach(candidate => {
    let score = 0;
    
    // Check taste complementarity (opposites often work well)
    selectedIngredients.forEach(selected => {
      // Reward combinations of certain tastes
      if (selected.taste.includes('sweet') && candidate.taste.includes('salty')) score += 3;
      if (selected.taste.includes('sweet') && candidate.taste.includes('sour')) score += 2;
      if (selected.taste.includes('umami') && candidate.taste.includes('salty')) score += 2;
      
      // Reward diversity in smell profiles
      const newSmells = candidate.smell.filter(smell => !selected.smell.includes(smell));
      score += newSmells.length;
      
      // Reward contrasting textures
      if (selected.texture.includes('creamy') && candidate.texture.includes('crunchy')) score += 3;
      if (selected.texture.includes('smooth') && candidate.texture.includes('crispy')) score += 2;
      
      // Check for shared mood categories (increases coherence)
      const sharedMoods = candidate.moods.filter(mood => selected.moods.includes(mood));
      score += sharedMoods.length;
    });
    
    compatibilityScores[candidate.id] = score;
  });
  
  // Sort by compatibility score and return top matches
  return availableIngredients
    .sort((a, b) => compatibilityScores[b.id] - compatibilityScores[a.id])
    .slice(0, 3);
};

// Generate flavor profile description based on selected ingredients
export const generateFlavorProfileDescription = (selectedIds: string[]): string => {
  if (selectedIds.length === 0) {
    return "Select ingredients to create your flavor profile...";
  }
  
  const selectedIngredients = ingredients.filter(ing => selectedIds.includes(ing.id));
  
  // Extract dominant characteristics
  const tastes = new Set<TasteCategory>();
  const smells = new Set<SmellCategory>();
  const textures = new Set<TextureCategory>();
  const sounds = new Set<SoundCategory>();
  const visuals = new Set<VisualCategory>();
  const moods = new Set<MoodCategory>();
  
  selectedIngredients.forEach(ing => {
    ing.taste.forEach(t => tastes.add(t));
    ing.smell.forEach(s => smells.add(s));
    ing.texture.forEach(t => textures.add(t));
    ing.sound.forEach(s => sounds.add(s));
    ing.visual.forEach(v => visuals.add(v));
    ing.moods.forEach(m => moods.add(m));
  });
  
  // Generate descriptive text
  const tasteDesc = Array.from(tastes).join(', ');
  const smellDesc = Array.from(smells).length > 0 
    ? `with ${Array.from(smells).join(' and ')} aromas` 
    : "";
  const textureDesc = Array.from(textures).length > 0 
    ? `The texture is ${Array.from(textures).join(' and ')}`
    : "";
  const soundDesc = Array.from(sounds).length > 0 
    ? `creating a ${Array.from(sounds).join(', ')} sensory experience`
    : "";
  const visualDesc = Array.from(visuals).length > 0 
    ? `Visually ${Array.from(visuals).join(' and ')}`
    : "";
  const moodDesc = Array.from(moods).length > 0 
    ? `Perfect for ${Array.from(moods).join(', ')} moments`
    : "";
  
  return `A ${tasteDesc} flavor profile ${smellDesc}. ${textureDesc} ${soundDesc}. ${visualDesc}. ${moodDesc}.`;
};

// Generate mood-based challenge suggestions
export const generateMoodChallenge = (mood: MoodCategory): { 
  ingredients: Ingredient[],
  description: string 
} => {
  // Filter ingredients that match the mood
  const moodIngredients = ingredients.filter(ing => ing.moods.includes(mood));
  
  // Select a random subset (2-3) of ingredients for the challenge
  const shuffled = [...moodIngredients].sort(() => 0.5 - Math.random());
  const selectedIngredients = shuffled.slice(0, Math.min(3, shuffled.length));
  
  // Generate challenge description based on mood
  let description = "";
  
  switch(mood) {
    case 'cozy':
      description = "Create a warm, comforting flavor that reminds you of home";
      break;
    case 'adventurous':
      description = "Design a bold, unexpected flavor combination that surprises the palate";
      break;
    case 'refreshing':
      description = "Develop a bright, invigorating flavor that feels like a cool breeze";
      break;
    case 'romantic':
      description = "Craft a sensual, indulgent flavor experience that evokes intimacy";
      break;
    case 'energizing':
      description = "Mix a vibrant, stimulating flavor that gives you a boost";
      break;
    case 'calming':
      description = "Blend a gentle, soothing flavor that helps you unwind";
      break;
  }
  
  return {
    ingredients: selectedIngredients,
    description
  };
};
