
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Ingredient, TasteCategory } from '@/utils/flavor';
import { Candy, Sparkles } from 'lucide-react';

interface IngredientCardProps { 
  ingredient: Ingredient; 
  isSelected: boolean; 
  onSelect: (ingredient: Ingredient) => void;
  tasteCategoriesColors?: Record<TasteCategory, string>;
  highlight?: boolean; // New prop to highlight AI-suggested ingredients
}

const IngredientCard = ({ 
  ingredient, 
  isSelected, 
  onSelect,
  tasteCategoriesColors,
  highlight = false
}: IngredientCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]' 
          : highlight 
            ? 'ring-1 ring-primary/30 hover:shadow-md hover:ring-primary/50' 
            : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(ingredient)}
    >
      <CardContent className="p-4 flex flex-col items-center">
        {highlight && !isSelected && (
          <div className="absolute -top-2 -right-2">
            <Sparkles size={16} className="text-primary" />
          </div>
        )}
        <div className={`w-20 h-20 rounded-full ${highlight && !isSelected ? 'bg-primary/30' : 'bg-primary/20'} flex items-center justify-center mb-3`}>
          <Candy className={`h-10 w-10 ${highlight && !isSelected ? 'text-primary' : 'text-primary'}`} />
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
