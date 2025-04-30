
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Ingredient, TasteCategory } from '@/utils/flavor';
import { Candy } from 'lucide-react';

interface IngredientCardProps { 
  ingredient: Ingredient; 
  isSelected: boolean; 
  onSelect: (ingredient: Ingredient) => void;
  tasteCategoriesColors?: Record<TasteCategory, string>;
}

const IngredientCard = ({ 
  ingredient, 
  isSelected, 
  onSelect,
  tasteCategoriesColors 
}: IngredientCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]' 
          : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(ingredient)}
    >
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
          <Candy className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-heading font-bold text-center">{ingredient.name}</h3>
        <div className="mt-2 flex flex-wrap gap-1 justify-center">
          {ingredient.taste.slice(0, 2).map(taste => (
            <Badge 
              key={taste} 
              variant="outline" 
              className={`${
                tasteCategoriesColors?.[taste] || ''
              } text-xs`}
            >
              {taste}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          {ingredient.description.length > 60
            ? `${ingredient.description.substring(0, 60)}...`
            : ingredient.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;
