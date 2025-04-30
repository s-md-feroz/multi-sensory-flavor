
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

// Function to parse speech input (placeholder for NLP feature)
export const parseSpeechInput = (speechText: string): {
  mood?: MoodCategory;
  ingredients: string[];
  notes: string;
} => {
  // This would integrate with an NLP service
  // For now, we'll do simple keyword matching as a placeholder
  const moodKeywords: Record<MoodCategory, string[]> = {
    'cozy': ['cozy', 'comfort', 'warm', 'homey'],
    'adventurous': ['adventurous', 'exciting', 'bold', 'unusual'],
    'refreshing': ['refreshing', 'cool', 'light', 'crisp'],
    'romantic': ['romantic', 'indulgent', 'rich', 'sensual'],
    'energizing': ['energizing', 'invigorating', 'bright', 'lively'],
    'calming': ['calming', 'soothing', 'relaxing', 'gentle']
  };
  
  // Simple detection of mood from text
  let detectedMood: MoodCategory | undefined;
  for (const [mood, keywords] of Object.entries(moodKeywords) as [MoodCategory, string[]][]) {
    if (keywords.some(keyword => speechText.toLowerCase().includes(keyword))) {
      detectedMood = mood;
      break;
    }
  }
  
  // Simple detection of ingredients (placeholder)
  const detectedIngredients: string[] = [];
  const lowerText = speechText.toLowerCase();
  
  // Just check for known ingredients from our database
  const ingredientNames = ['strawberry', 'chocolate', 'salt', 'cinnamon', 'lime', 
    'mushroom', 'honey', 'chips', 'basil', 'bacon'];
  
  ingredientNames.forEach((name, index) => {
    if (lowerText.includes(name)) {
      detectedIngredients.push((index + 1).toString()); // Map to our ingredient IDs
    }
  });
  
  return {
    mood: detectedMood,
    ingredients: detectedIngredients,
    notes: speechText
  };
};
