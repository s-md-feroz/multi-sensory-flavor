
import React from 'react';
import { Ingredient } from '@/utils/flavor';
import { CandyOff } from 'lucide-react';
import IngredientCard from './IngredientCard';

interface IngredientListProps {
  filteredIngredients: Ingredient[];
  selectedIngredients: Ingredient[];
  handleSelectIngredient: (ingredient: Ingredient) => void;
  tasteCategoriesColors: Record<string, string>;
}

const IngredientList = ({ 
  filteredIngredients, 
  selectedIngredients, 
  handleSelectIngredient,
  tasteCategoriesColors
}: IngredientListProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {filteredIngredients.length > 0 ? (
        filteredIngredients.map(ingredient => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            isSelected={selectedIngredients.some(ing => ing.id === ingredient.id)}
            onSelect={handleSelectIngredient}
            tasteCategoriesColors={tasteCategoriesColors}
          />
        ))
      ) : (
        <div className="col-span-3 text-center py-6 text-muted-foreground">
          <CandyOff className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No ingredients match your filters</p>
        </div>
      )}
    </div>
  );
};

export default IngredientList;
