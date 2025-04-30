
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Ingredient, TasteCategory } from '@/utils/flavor';
import IngredientCard from './IngredientCard';

interface RecommendationsPanelProps {
  recommendations: Ingredient[];
  selectedIngredients: Ingredient[];
  handleSelectIngredient: (ingredient: Ingredient) => void;
  tasteCategoriesColors: Record<TasteCategory, string>;
}

const RecommendationsPanel = ({
  recommendations,
  selectedIngredients,
  handleSelectIngredient,
  tasteCategoriesColors
}: RecommendationsPanelProps) => {
  if (recommendations.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-heading font-bold text-xl mb-4">Suggested Pairings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
