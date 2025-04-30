
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoodCategory, 
  generateMoodChallenge,
  Ingredient 
} from '@/utils/flavor';
import { Heart, Star, Smile, Zap, Coffee, Cloud } from 'lucide-react';

interface MoodBasedRecommendationsProps {
  onSelectIngredients: (ingredients: Ingredient[]) => void;
}

const MoodBasedRecommendations = ({ onSelectIngredients }: MoodBasedRecommendationsProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  const [recommendation, setRecommendation] = useState<{
    ingredients: Ingredient[];
    description: string;
  } | null>(null);

  const moods: { 
    value: MoodCategory; 
    label: string; 
    icon: React.ReactNode;
    color: string;
  }[] = [
    { value: 'cozy', label: 'Cozy', icon: <Coffee size={16} />, color: 'bg-flavor-orange' },
    { value: 'adventurous', label: 'Adventurous', icon: <Star size={16} />, color: 'bg-flavor-blue' },
    { value: 'refreshing', label: 'Refreshing', icon: <Cloud size={16} />, color: 'bg-flavor-lavender' },
    { value: 'romantic', label: 'Romantic', icon: <Heart size={16} />, color: 'bg-flavor-pink' },
    { value: 'energizing', label: 'Energizing', icon: <Zap size={16} />, color: 'bg-flavor-yellow' },
    { value: 'calming', label: 'Calming', icon: <Smile size={16} />, color: 'bg-flavor-blue' },
  ];

  const handleMoodSelect = (mood: MoodCategory) => {
    setSelectedMood(mood);
    const result = generateMoodChallenge(mood);
    setRecommendation(result);
  };

  const handleUseRecommendation = () => {
    if (recommendation) {
      onSelectIngredients(recommendation.ingredients);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Mood-Based Flavor Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3">
            How are you feeling today? Select a mood to get flavor suggestions:
          </p>
          <div className="flex flex-wrap gap-2">
            {moods.map(mood => (
              <Badge
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                className={`cursor-pointer flex items-center gap-1 ${selectedMood === mood.value ? mood.color : ''}`}
                onClick={() => handleMoodSelect(mood.value)}
              >
                {mood.icon} {mood.label}
              </Badge>
            ))}
          </div>
        </div>

        {recommendation && (
          <div className="mt-4 bg-muted/20 p-3 rounded-md">
            <h3 className="font-medium mb-2">Flavor Challenge:</h3>
            <p className="text-sm mb-3">{recommendation.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {recommendation.ingredients.map(ing => (
                <Badge key={ing.id} variant="secondary">
                  {ing.name}
                </Badge>
              ))}
            </div>
            
            <Button 
              size="sm" 
              onClick={handleUseRecommendation}
            >
              Use These Ingredients
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodBasedRecommendations;
