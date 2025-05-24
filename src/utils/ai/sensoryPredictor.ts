
import { Ingredient, FlavorProfile, TasteCategory, SmellCategory, TextureCategory } from '@/utils/flavor/types';

export interface SensoryExperience {
  taste: SensoryDimension;
  smell: SensoryDimension;
  texture: SensoryDimension;
  sound: SensoryDimension;
  visual: SensoryDimension;
}

export interface SensoryDimension {
  intensity: number; // 0-100
  quality: string[];
  dominance: number; // 0-100
  harmony: number; // 0-100
}

export interface SatisfactionPrediction {
  overallSatisfaction: number; // 0-100
  sensoryBreakdown: SensoryExperience;
  confidenceScore: number;
  recommendations: string[];
  potentialIssues: string[];
  enhancementSuggestions: string[];
}

export interface UserSensoryProfile {
  tastePreferences: Record<TasteCategory, number>;
  smellSensitivity: Record<SmellCategory, number>;
  texturePreferences: Record<TextureCategory, number>;
  sensoryMemories: SensoryMemory[];
  adaptationRate: number; // How quickly user adapts to new flavors
}

export interface SensoryMemory {
  ingredients: string[];
  satisfaction: number;
  dominantSenses: string[];
  context: string; // mood, setting, etc.
}

export class MultimodalSensoryPredictor {
  private userProfile: UserSensoryProfile;
  
  constructor(userProfile: UserSensoryProfile) {
    this.userProfile = userProfile;
  }

  predictSatisfaction(ingredients: Ingredient[]): SatisfactionPrediction {
    // Analyze each sensory dimension
    const sensoryExperience = this.analyzeSensoryExperience(ingredients);
    
    // Calculate overall satisfaction based on user preferences
    const overallSatisfaction = this.calculateOverallSatisfaction(sensoryExperience, ingredients);
    
    // Generate recommendations and warnings
    const analysis = this.generateAnalysis(sensoryExperience, ingredients);
    
    return {
      overallSatisfaction,
      sensoryBreakdown: sensoryExperience,
      confidenceScore: this.calculateConfidence(ingredients),
      recommendations: analysis.recommendations,
      potentialIssues: analysis.issues,
      enhancementSuggestions: analysis.enhancements
    };
  }

  private analyzeSensoryExperience(ingredients: Ingredient[]): SensoryExperience {
    return {
      taste: this.analyzeTaste(ingredients),
      smell: this.analyzeSmell(ingredients),
      texture: this.analyzeTexture(ingredients),
      sound: this.analyzeSound(ingredients),
      visual: this.analyzeVisual(ingredients)
    };
  }

  private analyzeTaste(ingredients: Ingredient[]): SensoryDimension {
    const tasteMap = new Map<string, number>();
    
    ingredients.forEach(ing => {
      ing.taste.forEach(taste => {
        tasteMap.set(taste, (tasteMap.get(taste) || 0) + 1);
      });
    });

    const dominantTaste = [...tasteMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const intensity = this.calculateIntensity(tasteMap, ingredients.length);
    const harmony = this.calculateTasteHarmony(ingredients);

    return {
      intensity,
      quality: [...tasteMap.keys()],
      dominance: dominantTaste ? (dominantTaste[1] / ingredients.length) * 100 : 0,
      harmony
    };
  }

  private analyzeSmell(ingredients: Ingredient[]): SensoryDimension {
    const smellMap = new Map<string, number>();
    
    ingredients.forEach(ing => {
      ing.smell.forEach(smell => {
        smellMap.set(smell, (smellMap.get(smell) || 0) + 1);
      });
    });

    const dominantSmell = [...smellMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const intensity = this.calculateIntensity(smellMap, ingredients.length);
    const harmony = this.calculateSmellHarmony(ingredients);

    return {
      intensity,
      quality: [...smellMap.keys()],
      dominance: dominantSmell ? (dominantSmell[1] / ingredients.length) * 100 : 0,
      harmony
    };
  }

  private analyzeTexture(ingredients: Ingredient[]): SensoryDimension {
    const textureMap = new Map<string, number>();
    
    ingredients.forEach(ing => {
      ing.texture.forEach(texture => {
        textureMap.set(texture, (textureMap.get(texture) || 0) + 1);
      });
    });

    const dominantTexture = [...textureMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const intensity = this.calculateTextureIntensity(textureMap);
    const harmony = this.calculateTextureHarmony(ingredients);

    return {
      intensity,
      quality: [...textureMap.keys()],
      dominance: dominantTexture ? (dominantTexture[1] / ingredients.length) * 100 : 0,
      harmony
    };
  }

  private analyzeSound(ingredients: Ingredient[]): SensoryDimension {
    const soundMap = new Map<string, number>();
    
    ingredients.forEach(ing => {
      ing.sound.forEach(sound => {
        soundMap.set(sound, (soundMap.get(sound) || 0) + 1);
      });
    });

    const dominantSound = [...soundMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const intensity = this.calculateSoundIntensity(soundMap);

    return {
      intensity,
      quality: [...soundMap.keys()],
      dominance: dominantSound ? (dominantSound[1] / ingredients.length) * 100 : 0,
      harmony: 75 // Sound harmony is less critical
    };
  }

  private analyzeVisual(ingredients: Ingredient[]): SensoryDimension {
    const visualMap = new Map<string, number>();
    
    ingredients.forEach(ing => {
      ing.visual.forEach(visual => {
        visualMap.set(visual, (visualMap.get(visual) || 0) + 1);
      });
    });

    const dominantVisual = [...visualMap.entries()].sort((a, b) => b[1] - a[1])[0];
    const intensity = this.calculateVisualIntensity(visualMap);
    const harmony = this.calculateVisualHarmony(ingredients);

    return {
      intensity,
      quality: [...visualMap.keys()],
      dominance: dominantVisual ? (dominantVisual[1] / ingredients.length) * 100 : 0,
      harmony
    };
  }

  private calculateIntensity(elementMap: Map<string, number>, totalIngredients: number): number {
    const totalElements = [...elementMap.values()].reduce((a, b) => a + b, 0);
    return Math.min(100, (totalElements / totalIngredients) * 50);
  }

  private calculateTasteHarmony(ingredients: Ingredient[]): number {
    // Sweet + salty = high harmony
    // Sweet + sour = medium harmony
    // All bitter = low harmony
    
    const tastes = new Set(ingredients.flatMap(ing => ing.taste));
    
    if (tastes.has('sweet') && tastes.has('salty')) return 90;
    if (tastes.has('sweet') && tastes.has('sour')) return 80;
    if (tastes.has('umami') && tastes.has('salty')) return 85;
    if (tastes.size > 3) return 60; // Too many competing tastes
    if (tastes.size === 1) return 70; // Monotonous but not bad
    
    return 75;
  }

  private calculateSmellHarmony(ingredients: Ingredient[]): number {
    const smells = new Set(ingredients.flatMap(ing => ing.smell));
    
    // Complementary smell combinations
    if (smells.has('floral') && smells.has('fruity')) return 85;
    if (smells.has('earthy') && smells.has('woody')) return 80;
    if (smells.has('spicy') && smells.has('herbal')) return 82;
    
    return Math.max(50, 90 - (smells.size * 5)); // Penalize too many smells
  }

  private calculateTextureHarmony(ingredients: Ingredient[]): number {
    const textures = new Set(ingredients.flatMap(ing => ing.texture));
    
    // Contrasting textures create interest
    if (textures.has('creamy') && textures.has('crunchy')) return 90;
    if (textures.has('smooth') && textures.has('crispy')) return 88;
    if (textures.has('tender') && textures.has('chewy')) return 75;
    
    return textures.size > 1 ? 80 : 60; // Variety is good
  }

  private calculateTextureIntensity(textureMap: Map<string, number>): number {
    const intensityWeights = {
      'crunchy': 90,
      'crispy': 85,
      'fizzy': 95,
      'chewy': 70,
      'smooth': 30,
      'creamy': 40,
      'tender': 50,
      'juicy': 60
    };

    let totalIntensity = 0;
    let count = 0;

    textureMap.forEach((freq, texture) => {
      const weight = intensityWeights[texture] || 50;
      totalIntensity += weight * freq;
      count += freq;
    });

    return count > 0 ? totalIntensity / count : 50;
  }

  private calculateSoundIntensity(soundMap: Map<string, number>): number {
    const intensityWeights = {
      'crunchy': 90,
      'fizzy': 85,
      'snappy': 80,
      'sizzling': 95,
      'creamy': 20,
      'silent': 0
    };

    let totalIntensity = 0;
    let count = 0;

    soundMap.forEach((freq, sound) => {
      const weight = intensityWeights[sound] || 50;
      totalIntensity += weight * freq;
      count += freq;
    });

    return count > 0 ? totalIntensity / count : 25;
  }

  private calculateVisualIntensity(visualMap: Map<string, number>): number {
    const intensityWeights = {
      'vibrant': 90,
      'colorful': 85,
      'patterned': 70,
      'glossy': 60,
      'monochromatic': 40,
      'matte': 45
    };

    let totalIntensity = 0;
    let count = 0;

    visualMap.forEach((freq, visual) => {
      const weight = intensityWeights[visual] || 50;
      totalIntensity += weight * freq;
      count += freq;
    });

    return count > 0 ? totalIntensity / count : 50;
  }

  private calculateVisualHarmony(ingredients: Ingredient[]): number {
    const visuals = new Set(ingredients.flatMap(ing => ing.visual));
    
    if (visuals.has('vibrant') && visuals.has('colorful')) return 85;
    if (visuals.has('glossy') && visuals.has('vibrant')) return 80;
    if (visuals.size === 1 && visuals.has('monochromatic')) return 70;
    
    return Math.max(60, 85 - (visuals.size * 3));
  }

  private calculateOverallSatisfaction(experience: SensoryExperience, ingredients: Ingredient[]): number {
    // Weight each sensory dimension based on user preferences
    const weights = {
      taste: 0.35,
      smell: 0.25,
      texture: 0.20,
      visual: 0.10,
      sound: 0.10
    };

    // Calculate satisfaction for each dimension
    const tasteSatisfaction = this.calculateTasteSatisfaction(ingredients);
    const smellSatisfaction = this.calculateSmellSatisfaction(ingredients);
    const textureSatisfaction = this.calculateTextureSatisfaction(ingredients);
    const visualSatisfaction = experience.visual.harmony;
    const soundSatisfaction = experience.sound.intensity > 0 ? 75 : 50;

    const weightedSatisfaction = 
      tasteSatisfaction * weights.taste +
      smellSatisfaction * weights.smell +
      textureSatisfaction * weights.texture +
      visualSatisfaction * weights.visual +
      soundSatisfaction * weights.sound;

    // Apply harmony bonus
    const harmonyBonus = (experience.taste.harmony + experience.smell.harmony + experience.texture.harmony) / 3;
    
    return Math.min(100, weightedSatisfaction + (harmonyBonus - 75) * 0.2);
  }

  private calculateTasteSatisfaction(ingredients: Ingredient[]): number {
    let satisfaction = 0;
    let count = 0;

    ingredients.forEach(ing => {
      ing.taste.forEach(taste => {
        const preference = this.userProfile.tastePreferences[taste] || 50;
        satisfaction += preference;
        count++;
      });
    });

    return count > 0 ? satisfaction / count : 50;
  }

  private calculateSmellSatisfaction(ingredients: Ingredient[]): number {
    let satisfaction = 0;
    let count = 0;

    ingredients.forEach(ing => {
      ing.smell.forEach(smell => {
        const sensitivity = this.userProfile.smellSensitivity[smell] || 50;
        satisfaction += sensitivity;
        count++;
      });
    });

    return count > 0 ? satisfaction / count : 50;
  }

  private calculateTextureSatisfaction(ingredients: Ingredient[]): number {
    let satisfaction = 0;
    let count = 0;

    ingredients.forEach(ing => {
      ing.texture.forEach(texture => {
        const preference = this.userProfile.texturePreferences[texture] || 50;
        satisfaction += preference;
        count++;
      });
    });

    return count > 0 ? satisfaction / count : 50;
  }

  private calculateConfidence(ingredients: Ingredient[]): number {
    // Base confidence on amount of data and user history
    const baseConfidence = Math.min(90, ingredients.length * 15);
    
    // Boost confidence if we have similar experiences
    const similarExperiences = this.userProfile.sensoryMemories.filter(memory =>
      memory.ingredients.some(memIng => 
        ingredients.some(ing => ing.id === memIng)
      )
    );

    const experienceBonus = Math.min(20, similarExperiences.length * 5);
    
    return Math.min(95, baseConfidence + experienceBonus);
  }

  private generateAnalysis(experience: SensoryExperience, ingredients: Ingredient[]): {
    recommendations: string[];
    issues: string[];
    enhancements: string[];
  } {
    const recommendations: string[] = [];
    const issues: string[] = [];
    const enhancements: string[] = [];

    // Analyze taste harmony
    if (experience.taste.harmony < 60) {
      issues.push("Competing flavors may overwhelm the palate");
      enhancements.push("Consider reducing the number of strong flavors or adding a unifying element");
    } else if (experience.taste.harmony > 85) {
      recommendations.push("Excellent flavor balance detected");
    }

    // Analyze texture variety
    if (experience.texture.quality.length < 2) {
      enhancements.push("Add textural contrast with crunchy or creamy elements");
    } else if (experience.texture.harmony > 85) {
      recommendations.push("Great textural contrast enhances the eating experience");
    }

    // Analyze visual appeal
    if (experience.visual.intensity < 50) {
      enhancements.push("Consider adding colorful garnishes or ingredients for visual appeal");
    }

    // Analyze smell complexity
    if (experience.smell.quality.length === 0) {
      enhancements.push("Add aromatic herbs or spices to enhance the smell profile");
    } else if (experience.smell.harmony > 80) {
      recommendations.push("Aromatic combination creates an inviting smell experience");
    }

    return { recommendations, issues, enhancements };
  }

  // Update user profile based on feedback
  updateUserProfile(ingredients: Ingredient[], satisfaction: number, dominantSenses: string[]): void {
    const memory: SensoryMemory = {
      ingredients: ingredients.map(ing => ing.id),
      satisfaction,
      dominantSenses,
      context: 'general'
    };

    this.userProfile.sensoryMemories.push(memory);

    // Update preferences based on satisfaction
    if (satisfaction > 75) {
      ingredients.forEach(ing => {
        ing.taste.forEach(taste => {
          this.userProfile.tastePreferences[taste] = Math.min(100, 
            (this.userProfile.tastePreferences[taste] || 50) + 5
          );
        });
      });
    } else if (satisfaction < 40) {
      ingredients.forEach(ing => {
        ing.taste.forEach(taste => {
          this.userProfile.tastePreferences[taste] = Math.max(0, 
            (this.userProfile.tastePreferences[taste] || 50) - 5
          );
        });
      });
    }
  }
}
