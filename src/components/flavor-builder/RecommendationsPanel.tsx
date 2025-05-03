
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IngredientCard from './IngredientCard'; // Fixed import
import { Ingredient } from '@/utils/flavor';

interface RecommendationsPanelProps {
  recommendations: Ingredient[];
  selectedIngredients: Ingredient[];
  handleSelectIngredient: (ingredient: Ingredient) => void;
  tasteCategoriesColors: Record<string, string>;
  t: (key: string) => string;
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  selectedIngredients,
  handleSelectIngredient,
  tasteCategoriesColors,
  t
}) => {
  if (recommendations.length === 0 || selectedIngredients.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-heading font-bold text-lg mb-4">{t('recommendedCombinations')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommendations.map(ingredient => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              isSelected={selectedIngredients.some(ing => ing.id === ingredient.id)}
              onSelect={handleSelectIngredient}
              tasteCategoriesColors={tasteCategoriesColors}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;
