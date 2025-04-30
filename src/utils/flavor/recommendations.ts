
import { Ingredient } from './types';
import { ingredients } from './ingredients';

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
