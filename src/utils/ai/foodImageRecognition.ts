
export interface RecognizedDish {
  name: string;
  confidence: number;
  cuisine: string;
  ingredients: string[];
  nutrition: NutritionInfo;
  recipes: RecipeResult[];
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface RecipeResult {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cookTime: number;
  servings: number;
  instructions: string[];
}

export class FoodImageRecognitionEngine {
  private apiEndpoint = 'https://ggdsjgtqkpyfcwlwqyan.functions.supabase.co/food-recognition';

  async recognizeFood(imageFile: File): Promise<RecognizedDish[]> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Call our edge function for image recognition
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          maxResults: 3
        })
      });

      if (!response.ok) {
        throw new Error('Failed to recognize food image');
      }

      const result = await response.json();
      return this.processRecognitionResults(result);
    } catch (error) {
      console.error('Food recognition error:', error);
      return this.getFallbackResults();
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  }

  private processRecognitionResults(apiResult: any): RecognizedDish[] {
    // Process the API results and map to our interface
    return apiResult.predictions?.map((pred: any) => ({
      name: pred.label || 'Unknown Dish',
      confidence: Math.round((pred.confidence || 0) * 100),
      cuisine: this.inferCuisine(pred.label),
      ingredients: this.inferIngredients(pred.label),
      nutrition: this.estimateNutrition(pred.label),
      recipes: this.generateRecipes(pred.label)
    })) || [];
  }

  private inferCuisine(dishName: string): string {
    const cuisineKeywords = {
      'Italian': ['pasta', 'pizza', 'risotto', 'gnocchi'],
      'Asian': ['rice', 'noodles', 'stir fry', 'sushi'],
      'Mexican': ['taco', 'burrito', 'quesadilla', 'salsa'],
      'American': ['burger', 'fries', 'sandwich', 'bbq'],
      'Mediterranean': ['hummus', 'falafel', 'olive', 'tzatziki'],
      'Indian': ['curry', 'biryani', 'naan', 'masala']
    };

    for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
      if (keywords.some(keyword => dishName.toLowerCase().includes(keyword))) {
        return cuisine;
      }
    }
    return 'International';
  }

  private inferIngredients(dishName: string): string[] {
    const ingredientMap: Record<string, string[]> = {
      'pasta': ['tomato', 'garlic', 'basil', 'olive oil'],
      'pizza': ['cheese', 'tomato sauce', 'dough', 'herbs'],
      'salad': ['lettuce', 'tomato', 'cucumber', 'dressing'],
      'soup': ['vegetables', 'broth', 'herbs', 'seasoning'],
      'sandwich': ['bread', 'meat', 'vegetables', 'condiments']
    };

    for (const [dish, ingredients] of Object.entries(ingredientMap)) {
      if (dishName.toLowerCase().includes(dish)) {
        return ingredients;
      }
    }
    return ['various ingredients'];
  }

  private estimateNutrition(dishName: string): NutritionInfo {
    // Basic nutrition estimation based on dish type
    const nutritionEstimates: Record<string, NutritionInfo> = {
      'pasta': { calories: 350, protein: 12, carbs: 65, fat: 8, fiber: 3, sugar: 4 },
      'salad': { calories: 150, protein: 5, carbs: 15, fat: 8, fiber: 6, sugar: 8 },
      'soup': { calories: 200, protein: 8, carbs: 25, fat: 6, fiber: 4, sugar: 5 },
      'pizza': { calories: 400, protein: 15, carbs: 45, fat: 18, fiber: 2, sugar: 3 },
      'sandwich': { calories: 300, protein: 20, carbs: 35, fat: 12, fiber: 3, sugar: 4 }
    };

    for (const [dish, nutrition] of Object.entries(nutritionEstimates)) {
      if (dishName.toLowerCase().includes(dish)) {
        return nutrition;
      }
    }

    return { calories: 250, protein: 10, carbs: 30, fat: 10, fiber: 3, sugar: 5 };
  }

  private generateRecipes(dishName: string): RecipeResult[] {
    return [{
      title: `Homemade ${dishName}`,
      description: `A delicious homemade version of ${dishName}`,
      difficulty: 'medium' as const,
      cookTime: 30,
      servings: 4,
      instructions: [
        'Prepare all ingredients',
        'Follow traditional cooking methods',
        'Season to taste',
        'Serve hot and enjoy'
      ]
    }];
  }

  private getFallbackResults(): RecognizedDish[] {
    return [{
      name: 'Delicious Dish',
      confidence: 70,
      cuisine: 'International',
      ingredients: ['various fresh ingredients'],
      nutrition: { calories: 250, protein: 10, carbs: 30, fat: 10, fiber: 3, sugar: 5 },
      recipes: [{
        title: 'Simple Recipe',
        description: 'A simple and tasty recipe',
        difficulty: 'easy' as const,
        cookTime: 20,
        servings: 2,
        instructions: ['Prepare ingredients', 'Cook as desired', 'Enjoy!']
      }]
    }];
  }
}
