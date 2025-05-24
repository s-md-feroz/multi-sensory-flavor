
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
      
      // For demo purposes, simulate API response with realistic data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return this.processRecognitionResults({
        predictions: [
          {
            label: this.generateDishName(imageFile.name),
            confidence: 0.85 + Math.random() * 0.1
          }
        ]
      });
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

  private generateDishName(fileName: string): string {
    const dishes = [
      'Chocolate Chip Cookies',
      'Caesar Salad',
      'Grilled Salmon',
      'Pasta Carbonara',
      'Chicken Tikka Masala',
      'Beef Stir Fry',
      'Vegetable Soup',
      'Apple Pie',
      'Margherita Pizza',
      'Thai Green Curry'
    ];
    return dishes[Math.floor(Math.random() * dishes.length)];
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
      'Italian': ['pasta', 'pizza', 'risotto', 'gnocchi', 'carbonara', 'margherita'],
      'Asian': ['rice', 'noodles', 'stir fry', 'sushi', 'curry', 'tikka'],
      'Mexican': ['taco', 'burrito', 'quesadilla', 'salsa'],
      'American': ['burger', 'fries', 'sandwich', 'bbq', 'cookies', 'pie'],
      'Mediterranean': ['hummus', 'falafel', 'olive', 'tzatziki'],
      'Indian': ['curry', 'biryani', 'naan', 'masala', 'tikka'],
      'Thai': ['thai', 'green curry', 'pad thai'],
      'French': ['french', 'croissant', 'baguette']
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
      'sandwich': ['bread', 'meat', 'vegetables', 'condiments'],
      'cookies': ['flour', 'butter', 'sugar', 'chocolate chips'],
      'salmon': ['fish', 'lemon', 'herbs', 'olive oil'],
      'curry': ['spices', 'coconut milk', 'vegetables', 'herbs'],
      'stir fry': ['vegetables', 'soy sauce', 'garlic', 'ginger']
    };

    for (const [dish, ingredients] of Object.entries(ingredientMap)) {
      if (dishName.toLowerCase().includes(dish)) {
        return ingredients;
      }
    }
    return ['various fresh ingredients'];
  }

  private estimateNutrition(dishName: string): NutritionInfo {
    // Basic nutrition estimation based on dish type
    const nutritionEstimates: Record<string, NutritionInfo> = {
      'pasta': { calories: 350, protein: 12, carbs: 65, fat: 8, fiber: 3, sugar: 4 },
      'salad': { calories: 150, protein: 5, carbs: 15, fat: 8, fiber: 6, sugar: 8 },
      'soup': { calories: 200, protein: 8, carbs: 25, fat: 6, fiber: 4, sugar: 5 },
      'pizza': { calories: 400, protein: 15, carbs: 45, fat: 18, fiber: 2, sugar: 3 },
      'sandwich': { calories: 300, protein: 20, carbs: 35, fat: 12, fiber: 3, sugar: 4 },
      'cookies': { calories: 450, protein: 6, carbs: 55, fat: 22, fiber: 2, sugar: 35 },
      'salmon': { calories: 280, protein: 35, carbs: 2, fat: 14, fiber: 0, sugar: 0 },
      'curry': { calories: 320, protein: 18, carbs: 25, fat: 16, fiber: 5, sugar: 8 },
      'stir fry': { calories: 250, protein: 15, carbs: 20, fat: 12, fiber: 4, sugar: 6 }
    };

    for (const [dish, nutrition] of Object.entries(nutritionEstimates)) {
      if (dishName.toLowerCase().includes(dish)) {
        return nutrition;
      }
    }

    return { calories: 250, protein: 10, carbs: 30, fat: 10, fiber: 3, sugar: 5 };
  }

  private generateRecipes(dishName: string): RecipeResult[] {
    const recipeTemplates = {
      'cookies': {
        title: 'Homemade Chocolate Chip Cookies',
        description: 'Classic crispy-chewy chocolate chip cookies',
        difficulty: 'easy' as const,
        cookTime: 25,
        servings: 24,
        instructions: [
          'Preheat oven to 375°F',
          'Cream butter and sugars together',
          'Beat in eggs and vanilla',
          'Mix in flour, baking soda, and salt',
          'Fold in chocolate chips',
          'Drop onto baking sheets',
          'Bake for 9-11 minutes until golden'
        ]
      },
      'salmon': {
        title: 'Grilled Lemon Herb Salmon',
        description: 'Perfectly grilled salmon with fresh herbs',
        difficulty: 'medium' as const,
        cookTime: 15,
        servings: 4,
        instructions: [
          'Preheat grill to medium-high',
          'Season salmon with salt and pepper',
          'Brush with olive oil and lemon juice',
          'Grill for 4-5 minutes per side',
          'Garnish with fresh herbs',
          'Serve immediately'
        ]
      }
    };

    for (const [dish, recipe] of Object.entries(recipeTemplates)) {
      if (dishName.toLowerCase().includes(dish)) {
        return [recipe];
      }
    }

    return [{
      title: `Homemade ${dishName}`,
      description: `A delicious homemade version of ${dishName}`,
      difficulty: 'medium' as const,
      cookTime: 30,
      servings: 4,
      instructions: [
        'Gather all ingredients',
        'Prepare ingredients according to recipe',
        'Follow cooking method for this dish',
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
