import { Ingredient, MoodCategory } from './types';

export interface FlavorExperience {
  id: string;
  title: string;
  description: string;
  ingredients: string[]; // Ingredient IDs
  mood: MoodCategory;
  tags: string[];
  location?: string;
  date: string; // ISO date string
  imageUrl?: string;
  audioNotes?: string;
  rating?: number; // 1-5 star rating
}

// Sample data for flavor experiences
const sampleExperiences: FlavorExperience[] = [
  {
    id: '1',
    title: 'Summer Strawberry Sensation',
    description: 'Sweet strawberries with dark chocolate created a perfect balance of flavors that reminded me of childhood summers.',
    ingredients: ['1', '2'], // Strawberry and Dark Chocolate
    mood: 'romantic',
    tags: ['dessert', 'summer', 'sweet'],
    location: 'Home',
    date: '2025-04-20T14:00:00Z',
    rating: 5
  },
  {
    id: '2',
    title: 'Cozy Cinnamon Morning',
    description: 'The warm aroma of cinnamon and honey in my morning toast created a comforting atmosphere perfect for the rainy day.',
    ingredients: ['4', '7'], // Cinnamon and Honey
    mood: 'cozy',
    tags: ['breakfast', 'rainy day', 'warm'],
    location: 'Home',
    date: '2025-04-15T08:30:00Z',
    rating: 4
  },
  {
    id: '3',
    title: 'Energizing Citrus Explosion',
    description: 'The lime and basil combination created a refreshing and invigorating sensory experience that woke up my senses.',
    ingredients: ['5', '9'], // Lime and Basil
    mood: 'energizing',
    tags: ['drink', 'summer', 'refreshing'],
    location: 'Garden',
    date: '2025-04-10T12:00:00Z',
    rating: 5
  },
  {
    id: '4',
    title: 'Savory Adventure',
    description: 'The combination of mushroom and bacon created an umami-rich experience that was surprisingly complex.',
    ingredients: ['6', '10'], // Mushroom and Bacon
    mood: 'adventurous',
    tags: ['lunch', 'savory', 'rich'],
    location: 'Restaurant',
    date: '2025-03-28T19:00:00Z',
    rating: 4
  },
  {
    id: '5',
    title: 'Refreshing Ocean Breeze',
    description: 'The subtle saltiness of the sea salt combined with lime created a sensory memory of beach days.',
    ingredients: ['3', '5'], // Sea Salt and Lime
    mood: 'refreshing',
    tags: ['snack', 'vacation', 'beach'],
    location: 'Beach',
    date: '2025-03-15T16:00:00Z',
    rating: 5
  }
];

// Get all experiences
export const getAllExperiences = (): FlavorExperience[] => {
  return sampleExperiences;
};

// Get experiences by mood
export const getExperiencesByMood = (mood: MoodCategory): FlavorExperience[] => {
  return sampleExperiences.filter(exp => exp.mood === mood);
};

// Get experiences by ingredient
export const getExperiencesByIngredient = (ingredientId: string): FlavorExperience[] => {
  return sampleExperiences.filter(exp => exp.ingredients.includes(ingredientId));
};

// Get experiences by tag
export const getExperiencesByTag = (tag: string): FlavorExperience[] => {
  return sampleExperiences.filter(exp => exp.tags.includes(tag.toLowerCase()));
};

// Get experiences by location
export const getExperiencesByLocation = (location: string): FlavorExperience[] => {
  return sampleExperiences.filter(exp => 
    exp.location && exp.location.toLowerCase().includes(location.toLowerCase())
  );
};

// Get similar experiences based on ingredients and mood
export const getSimilarExperiences = (experienceId: string): FlavorExperience[] => {
  const targetExp = sampleExperiences.find(exp => exp.id === experienceId);
  if (!targetExp) return [];

  return sampleExperiences
    .filter(exp => exp.id !== experienceId)
    .sort((a, b) => {
      const aIngredientMatches = a.ingredients.filter(ing => 
        targetExp.ingredients.includes(ing)).length;
      const bIngredientMatches = b.ingredients.filter(ing => 
        targetExp.ingredients.includes(ing)).length;
      
      // Prioritize mood match, then ingredient matches
      const aMoodMatch = a.mood === targetExp.mood ? 10 : 0;
      const bMoodMatch = b.mood === targetExp.mood ? 10 : 0;
      
      return (bIngredientMatches + bMoodMatch) - (aIngredientMatches + aMoodMatch);
    })
    .slice(0, 3); // Return top 3 similar experiences
};

// Suggest dishes based on mood
export const suggestDishesByMood = (mood: MoodCategory): string[] => {
  const moodDishSuggestions: Record<MoodCategory, string[]> = {
    'cozy': [
      'Cinnamon Apple Oatmeal',
      'Honey Chamomile Tea with Toast',
      'Mushroom Risotto',
      'Chicken Noodle Soup'
    ],
    'adventurous': [
      'Spicy Mango Tacos',
      'Sichuan Hot Pot',
      'Curry Laksa Noodles',
      'Fermented Kimchi Bowl'
    ],
    'refreshing': [
      'Cucumber Mint Gazpacho',
      'Citrus Green Salad',
      'Watermelon Feta Bites',
      'Lemongrass Sorbet'
    ],
    'romantic': [
      'Chocolate Covered Strawberries',
      'Red Wine Poached Pears',
      'Truffle Pasta',
      'Rose Macarons'
    ],
    'energizing': [
      'Citrus Smoothie Bowl',
      'Ginger Turmeric Shot',
      'Berry Acai Bowl',
      'Avocado Toast with Chili Flakes'
    ],
    'calming': [
      'Lavender Shortbread',
      'Warm Milk with Honey',
      'Chamomile Poached Fruits',
      'Vanilla Bean Rice Pudding'
    ]
  };

  return moodDishSuggestions[mood] || [];
};

// Function to match image to experience (placeholder for image recognition feature)
export const matchImageToExperience = (imageData: string): FlavorExperience | null => {
  // This would integrate with an image recognition API
  // For now, return a random experience as a placeholder
  const randomIndex = Math.floor(Math.random() * sampleExperiences.length);
  return sampleExperiences[randomIndex];
};

// Function to parse speech input with enhanced NLP capabilities
export const parseSpeechInput = (speechText: string): {
  mood?: MoodCategory;
  ingredients: string[];
  notes: string;
} => {
  // Enhanced mood detection with synonym expansion and fuzzy matching
  const moodKeywords: Record<MoodCategory, string[]> = {
    'cozy': ['cozy', 'comfort', 'comfortable', 'warm', 'homey', 'snug', 'relaxing', 'hygge', 'cosy', 'familiar'],
    'adventurous': ['adventurous', 'exciting', 'bold', 'unusual', 'daring', 'novel', 'exotic', 'unexpected', 'surprising', 'unique'],
    'refreshing': ['refreshing', 'cool', 'light', 'crisp', 'fresh', 'bright', 'revitalizing', 'invigorating', 'rejuvenating', 'clean'],
    'romantic': ['romantic', 'indulgent', 'rich', 'sensual', 'velvety', 'decadent', 'luxurious', 'dreamy', 'intimate', 'passionate'],
    'energizing': ['energizing', 'invigorating', 'bright', 'lively', 'zesty', 'zingy', 'stimulating', 'vibrant', 'punchy', 'dynamic'],
    'calming': ['calming', 'soothing', 'relaxing', 'gentle', 'mild', 'serene', 'peaceful', 'mellow', 'tranquil', 'subtle']
  };
  
  // Enhanced mood detection algorithm with context awareness
  const lowerText = speechText.toLowerCase();
  const words = lowerText.split(/\W+/); // Split by non-word characters
  
  // Calculate mood scores based on word frequency and importance
  const moodScores: Record<MoodCategory, number> = {
    'cozy': 0,
    'adventurous': 0,
    'refreshing': 0,
    'romantic': 0,
    'energizing': 0,
    'calming': 0
  };
  
  // Score calculation based on keyword presence
  for (const [mood, keywords] of Object.entries(moodKeywords) as [MoodCategory, string[]][]) {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        // Give higher score for exact matches
        moodScores[mood] += lowerText.split(keyword).length - 1;
      }
      
      // Check for partial matches in words
      words.forEach(word => {
        if (word.length > 3 && keyword.includes(word)) {
          moodScores[mood] += 0.5;
        }
      });
    });
  }

  // Context modifiers - adjust scores based on context
  if (lowerText.includes('hot day') || lowerText.includes('summer')) {
    moodScores['refreshing'] += 1;
    moodScores['energizing'] += 0.5;
  }
  
  if (lowerText.includes('winter') || lowerText.includes('cold')) {
    moodScores['cozy'] += 1;
  }
  
  if (lowerText.includes('dinner') && lowerText.includes('special')) {
    moodScores['romantic'] += 1;
  }
  
  // Determine highest scoring mood
  let detectedMood: MoodCategory | undefined;
  let highestScore = 0;
  
  Object.entries(moodScores).forEach(([mood, score]) => {
    if (score > highestScore) {
      highestScore = score;
      detectedMood = mood as MoodCategory;
    }
  });
  
  // Only assign mood if the score is significant
  if (highestScore < 0.5) {
    detectedMood = undefined;
  }
  
  // Enhanced ingredient detection with fuzzy matching and context awareness
  const detectedIngredients: string[] = [];
  
  // Extended list of ingredients with variations
  const ingredientVariations: Record<string, string[]> = {
    '1': ['strawberry', 'strawberries', 'sweet berry'],
    '2': ['chocolate', 'chocolatey', 'cocoa', 'cacao'],
    '3': ['salt', 'salty', 'sea salt', 'saline'],
    '4': ['cinnamon', 'cinnamony', 'spiced', 'cassia'],
    '5': ['lime', 'limes', 'lime juice', 'citrus'],
    '6': ['mushroom', 'mushrooms', 'fungi', 'umami'],
    '7': ['honey', 'honeyed', 'sweet', 'nectar'],
    '8': ['chips', 'crisps', 'potato chips', 'fried'],
    '9': ['basil', 'fresh herbs', 'herb', 'aromatic'],
    '10': ['bacon', 'smoky', 'pork', 'pancetta']
  };
  
  // Check for ingredient mentions
  for (const [id, variations] of Object.entries(ingredientVariations)) {
    for (const variation of variations) {
      if (lowerText.includes(variation)) {
        detectedIngredients.push(id);
        break;
      }
    }
  }
  
  // Detect compound ingredient descriptions (like "dark chocolate" or "sea salt")
  if (lowerText.includes('dark chocolate') || lowerText.includes('bitter chocolate')) {
    detectedIngredients.push('2'); // Dark chocolate
  }
  
  if (lowerText.includes('sea salt') || lowerText.includes('flaky salt')) {
    detectedIngredients.push('3'); // Sea salt
  }
  
  // Remove duplicates
  const uniqueIngredients = [...new Set(detectedIngredients)];
  
  return {
    mood: detectedMood,
    ingredients: uniqueIngredients,
    notes: speechText
  };
};
