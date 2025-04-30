
import { MoodCategory, Ingredient } from './types';
import { ingredients } from './ingredients';

// Generate flavor profile description based on selected ingredients
export const generateFlavorProfileDescription = (selectedIds: string[]): string => {
  if (selectedIds.length === 0) {
    return "Select ingredients to create your flavor profile...";
  }
  
  const selectedIngredients = ingredients.filter(ing => selectedIds.includes(ing.id));
  
  // Extract dominant characteristics
  const tastes = new Set<string>();
  const smells = new Set<string>();
  const textures = new Set<string>();
  const sounds = new Set<string>();
  const visuals = new Set<string>();
  const moods = new Set<string>();
  
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
