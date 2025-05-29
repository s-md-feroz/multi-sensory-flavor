
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoodCategory } from '@/utils/flavor/types';
import { suggestDishesByMood } from '@/utils/flavor/experiences';
import { Cloud, Heart, Smile, Star, Zap, Coffee, ChefHat } from 'lucide-react';
import { toast } from 'sonner';

interface MoodFlavorsProps {
  onSelectDish?: (dish: string) => void;
}

const MoodFlavors: React.FC<MoodFlavorsProps> = ({ onSelectDish }) => {
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

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
    console.log('Mood selected:', mood);
    setSelectedMood(mood);
    const dishes = suggestDishesByMood(mood);
    console.log('Suggested dishes:', dishes);
    setRecommendations(dishes);
    setSelectedDishes([]); // Reset selected dishes when mood changes
  };

  const handleSelectDish = (dish: string) => {
    console.log('Dish selected:', dish);
    
    // Add to selected dishes if not already selected
    if (!selectedDishes.includes(dish)) {
      setSelectedDishes(prev => [...prev, dish]);
    }
    
    // Call parent callback if provided
    if (onSelectDish) {
      onSelectDish(dish);
    }
    
    // Show success toast
    toast.success(`Added "${dish}" to your flavor inspiration!`, {
      description: "This dish has been noted in your sensory journey.",
      duration: 3000,
    });
  };

  const handleRemoveDish = (dish: string) => {
    setSelectedDishes(prev => prev.filter(d => d !== dish));
    toast.info(`Removed "${dish}" from your selections`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <ChefHat size={20} />
          What's Your Mood Today?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Select a mood to get dish recommendations that match how you're feeling:
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {moods.map(mood => (
            <Badge
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              className={`cursor-pointer flex items-center gap-1 px-3 py-2 text-sm hover:bg-opacity-80 transition-all ${
                selectedMood === mood.value ? mood.color + ' text-white' : 'hover:bg-muted'
              }`}
              onClick={() => handleMoodSelect(mood.value)}
            >
              {mood.icon} {mood.label}
            </Badge>
          ))}
        </div>

        {selectedMood && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              Current mood: <span className="text-foreground capitalize">{selectedMood}</span>
            </p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <ChefHat size={16} />
                Recommended Dishes:
              </h3>
              <div className="space-y-3">
                {recommendations.map((dish, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md border">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{dish}</span>
                    </div>
                    <Button 
                      variant={selectedDishes.includes(dish) ? "default" : "outline"}
                      size="sm"
                      onClick={() => selectedDishes.includes(dish) ? handleRemoveDish(dish) : handleSelectDish(dish)}
                      className="min-w-[80px]"
                    >
                      {selectedDishes.includes(dish) ? "Added ✓" : "Try This"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {selectedDishes.length > 0 && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2 text-primary">Your Selected Inspirations:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDishes.map(dish => (
                    <Badge 
                      key={dish}
                      variant="secondary"
                      className="flex items-center gap-2 py-1 px-3"
                    >
                      {dish}
                      <button 
                        onClick={() => handleRemoveDish(dish)}
                        className="ml-1 rounded-full hover:bg-primary/20 p-1 transition-colors"
                        aria-label={`Remove ${dish}`}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  These dishes can inspire your next sensory experience!
                </p>
              </div>
            )}
          </div>
        )}

        {selectedMood && recommendations.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <ChefHat size={32} className="mx-auto mb-2 opacity-50" />
            <p>No recommendations available for this mood yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodFlavors;
