
import { Ingredient, FlavorProfile, MoodCategory } from '@/utils/flavor/types';
import { ingredients } from '@/utils/flavor/ingredients';

export interface UserPreferences {
  favoriteIngredients: string[];
  dislikedIngredients: string[];
  dietaryRestrictions: string[];
  preferredMoods: MoodCategory[];
  spiceLevel: 'mild' | 'medium' | 'hot';
  sweetnessTolerance: 'low' | 'medium' | 'high';
}

export interface FlavorRecommendation {
  ingredients: Ingredient[];
  compatibility: number;
  reasoning: string;
  novelty: number;
  confidence: number;
}

export class FlavorRecommendationEngine {
  private userPreferences: UserPreferences;
  
  constructor(preferences: UserPreferences) {
    this.userPreferences = preferences;
  }

  // Generate personalized flavor recommendations
  generateRecommendations(count: number = 5): FlavorRecommendation[] {
    const availableIngredients = ingredients.filter(ing => 
      !this.userPreferences.dislikedIngredients.includes(ing.id)
    );

    const recommendations: FlavorRecommendation[] = [];
    
    // Generate combinations based on user preferences
    for (let i = 0; i < count; i++) {
      const combination = this.generateSmartCombination(availableIngredients);
      if (combination) {
        recommendations.push(combination);
      }
    }

    return recommendations.sort((a, b) => b.compatibility - a.compatibility);
  }

  private generateSmartCombination(availableIngredients: Ingredient[]): FlavorRecommendation | null {
    // Start with a base ingredient from user favorites
    const favoriteIngredients = availableIngredients.filter(ing => 
      this.userPreferences.favoriteIngredients.includes(ing.id)
    );

    const baseIngredient = favoriteIngredients.length > 0 
      ? favoriteIngredients[Math.floor(Math.random() * favoriteIngredients.length)]
      : availableIngredients[Math.floor(Math.random() * availableIngredients.length)];

    // Find complementary ingredients
    const complementary = this.findComplementaryIngredients(baseIngredient, availableIngredients);
    
    const selectedIngredients = [baseIngredient, ...complementary.slice(0, 2)];
    const compatibility = this.calculateCompatibility(selectedIngredients);
    const novelty = this.calculateNovelty(selectedIngredients);
    const reasoning = this.generateReasoning(selectedIngredients, compatibility);

    return {
      ingredients: selectedIngredients,
      compatibility,
      reasoning,
      novelty,
      confidence: (compatibility + novelty) / 2
    };
  }

  private findComplementaryIngredients(base: Ingredient, available: Ingredient[]): Ingredient[] {
    return available
      .filter(ing => ing.id !== base.id)
      .map(ing => ({
        ingredient: ing,
        score: this.calculateCompatibilityScore(base, ing)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.ingredient);
  }

  private calculateCompatibilityScore(ing1: Ingredient, ing2: Ingredient): number {
    let score = 0;

    // Taste complementarity
    if (ing1.taste.includes('sweet') && ing2.taste.includes('salty')) score += 3;
    if (ing1.taste.includes('sweet') && ing2.taste.includes('sour')) score += 2;
    if (ing1.taste.includes('umami') && ing2.taste.includes('salty')) score += 2;

    // Texture contrast
    if (ing1.texture.includes('creamy') && ing2.texture.includes('crunchy')) score += 3;
    if (ing1.texture.includes('smooth') && ing2.texture.includes('crispy')) score += 2;

    // Mood compatibility
    const sharedMoods = ing1.moods.filter(mood => ing2.moods.includes(mood));
    score += sharedMoods.length;

    // User preference boost
    if (this.userPreferences.favoriteIngredients.includes(ing2.id)) score += 2;

    return score;
  }

  private calculateCompatibility(ingredients: Ingredient[]): number {
    let totalScore = 0;
    let comparisons = 0;

    for (let i = 0; i < ingredients.length; i++) {
      for (let j = i + 1; j < ingredients.length; j++) {
        totalScore += this.calculateCompatibilityScore(ingredients[i], ingredients[j]);
        comparisons++;
      }
    }

    return comparisons > 0 ? (totalScore / comparisons) * 10 : 50;
  }

  private calculateNovelty(ingredients: Ingredient[]): number {
    const commonCombinations = [
      ['sweet', 'salty'],
      ['chocolate', 'vanilla'],
      ['tomato', 'basil']
    ];

    let noveltyScore = 80; // Base novelty score

    // Reduce novelty for common combinations
    for (const combination of commonCombinations) {
      const hasAllElements = combination.every(element => 
        ingredients.some(ing => 
          ing.name.toLowerCase().includes(element) || 
          ing.taste.some(taste => taste === element)
        )
      );
      
      if (hasAllElements) {
        noveltyScore -= 20;
      }
    }

    return Math.max(0, Math.min(100, noveltyScore));
  }

  private generateReasoning(ingredients: Ingredient[], compatibility: number): string {
    const reasons = [];
    
    if (compatibility > 70) {
      reasons.push("Excellent flavor harmony with complementary taste profiles");
    } else if (compatibility > 50) {
      reasons.push("Good balance between familiar and adventurous flavors");
    } else {
      reasons.push("Bold and experimental combination for adventurous palates");
    }

    const textures = new Set(ingredients.flatMap(ing => ing.texture));
    if (textures.size > 2) {
      reasons.push("diverse textural elements create interesting mouthfeel");
    }

    const moods = new Set(ingredients.flatMap(ing => ing.moods));
    if (moods.size > 0) {
      reasons.push(`perfect for ${Array.from(moods).slice(0, 2).join(' and ')} moments`);
    }

    return reasons.join(", ");
  }

  // Update user preferences based on feedback
  updatePreferences(liked: string[], disliked: string[]): void {
    // Add liked ingredients to favorites
    liked.forEach(id => {
      if (!this.userPreferences.favoriteIngredients.includes(id)) {
        this.userPreferences.favoriteIngredients.push(id);
      }
    });

    // Add disliked ingredients to dislikes
    disliked.forEach(id => {
      if (!this.userPreferences.dislikedIngredients.includes(id)) {
        this.userPreferences.dislikedIngredients.push(id);
      }
    });
  }
}

// Emotion-aware recommendation system
export interface EmotionState {
  mood: MoodCategory;
  energy: 'low' | 'medium' | 'high';
  stress: 'low' | 'medium' | 'high';
  social: 'alone' | 'intimate' | 'social';
}

export class EmotionAwareFoodEngine {
  static getEmotionalRecommendations(emotion: EmotionState): FlavorRecommendation[] {
    const moodMappings = {
      cozy: {
        flavors: ['sweet', 'umami'],
        textures: ['creamy', 'smooth'],
        ingredients: ['chocolate', 'honey', 'mushroom']
      },
      energizing: {
        flavors: ['sour', 'spicy'],
        textures: ['crunchy', 'fizzy'],
        ingredients: ['lime', 'cinnamon', 'chips']
      },
      calming: {
        flavors: ['sweet', 'floral'],
        textures: ['smooth', 'soft'],
        ingredients: ['honey', 'basil', 'strawberry']
      },
      romantic: {
        flavors: ['sweet', 'rich'],
        textures: ['smooth', 'creamy'],
        ingredients: ['chocolate', 'strawberry', 'honey']
      },
      adventurous: {
        flavors: ['umami', 'spicy'],
        textures: ['crispy', 'chewy'],
        ingredients: ['mushroom', 'bacon', 'lime']
      },
      refreshing: {
        flavors: ['sour', 'fresh'],
        textures: ['juicy', 'crisp'],
        ingredients: ['lime', 'basil', 'strawberry']
      }
    };

    const mapping = moodMappings[emotion.mood];
    const recommendedIngredients = ingredients.filter(ing =>
      mapping.ingredients.some(name => ing.name.toLowerCase().includes(name.toLowerCase())) ||
      mapping.flavors.some(flavor => ing.taste.includes(flavor as any)) ||
      mapping.textures.some(texture => ing.texture.includes(texture as any))
    );

    return [{
      ingredients: recommendedIngredients.slice(0, 3),
      compatibility: 85,
      reasoning: `Perfect for your ${emotion.mood} mood with ${emotion.energy} energy`,
      novelty: 60,
      confidence: 80
    }];
  }
}
