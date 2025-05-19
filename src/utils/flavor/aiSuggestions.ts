
import { Ingredient } from './types';
import { ingredients as allIngredients } from './ingredients';

// This function analyzes the current ingredient selection and returns AI-powered suggestions
export const getAISuggestions = (
  selectedIngredients: Ingredient[]
): { 
  suggestions: Ingredient[]; 
  reasoning: string;
} => {
  // If no ingredients are selected, return some default suggestions
  if (selectedIngredients.length === 0) {
    const defaultSuggestions = allIngredients.slice(0, 3);
    return {
      suggestions: defaultSuggestions,
      reasoning: "Start with these popular base ingredients to build your flavor profile."
    };
  }

  // Extract key flavor characteristics
  const selectedTastes = new Set<string>();
  const selectedTextures = new Set<string>();
  const selectedSmells = new Set<string>();
  
  selectedIngredients.forEach(ing => {
    ing.taste.forEach(t => selectedTastes.add(t));
    ing.texture.forEach(t => selectedTextures.add(t));
    ing.smell.forEach(s => selectedSmells.add(s));
  });

  // Create a scoring system for AI suggestions
  const scoredSuggestions = allIngredients
    .filter(ing => !selectedIngredients.some(selected => selected.id === ing.id))
    .map(ing => {
      let score = 0;
      let reasonPoints: string[] = [];

      // Balance taste profile
      if (selectedTastes.has('sweet') && ing.taste.includes('salty')) {
        score += 5;
        reasonPoints.push("balances sweetness with saltiness");
      }
      
      if (selectedTastes.has('sweet') && ing.taste.includes('sour')) {
        score += 4;
        reasonPoints.push("adds tartness to complement sweetness");
      }
      
      if (selectedTastes.has('salty') && ing.taste.includes('umami')) {
        score += 4;
        reasonPoints.push("enhances savory depth");
      }
      
      // Create texture contrasts
      if (selectedTextures.has('creamy') && ing.texture.includes('crunchy')) {
        score += 3;
        reasonPoints.push("adds crunch to creamy textures");
      }
      
      if (selectedTextures.has('smooth') && ing.texture.includes('crispy')) {
        score += 3;
        reasonPoints.push("creates textural contrast");
      }
      
      // Complement aromatic profiles
      const newAromas = ing.smell.filter(smell => !selectedSmells.has(smell));
      if (newAromas.length > 0) {
        score += newAromas.length * 2;
        reasonPoints.push(`introduces ${newAromas.join(", ")} aromas`);
      }

      return {
        ingredient: ing,
        score,
        reasonPoints
      };
    });

  // Sort by score and take top suggestions
  const topSuggestions = scoredSuggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Generate reasoning explanation based on why these ingredients were suggested
  const reasoning = topSuggestions.length > 0 
    ? `AI suggests these ingredients because they ${topSuggestions.map(s => s.reasonPoints[0] || "complement your selection").join(", and ")}. This creates a balanced flavor profile.`
    : "These ingredients will help create a more balanced and complex flavor profile.";

  return {
    suggestions: topSuggestions.map(s => s.ingredient),
    reasoning
  };
};
