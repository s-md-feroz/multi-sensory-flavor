
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoodCategory } from '@/utils/flavor/types';
import { suggestDishesByMood } from '@/utils/flavor/experiences';
import { Cloud, Heart, Smile, Star, Zap, Coffee } from 'lucide-react';

interface MoodFlavorsProps {
  onSelectDish?: (dish: string) => void;
}

const MoodFlavors: React.FC<MoodFlavorsProps> = ({ onSelectDish }) => {
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

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
    const dishes = suggestDishesByMood(mood);
    setRecommendations(dishes);
  };

  const handleSelectDish = (dish: string) => {
    if (onSelectDish) {
      onSelectDish(dish);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">What's Your Mood Today?</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          Select a mood to get dish recommendations that match how you're feeling:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
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

        {recommendations.length > 0 && (
          <div className="mt-4 bg-muted/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Recommended Dishes:</h3>
            <ul className="space-y-2">
              {recommendations.map((dish, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{dish}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSelectDish(dish)}
                    className="text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    Try This
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodFlavors;
