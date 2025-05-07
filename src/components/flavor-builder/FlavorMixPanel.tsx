
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IngredientCard from './IngredientCard'; // Fixed import
import { Ingredient } from '@/utils/flavor';
import FlavorProfileChart from '@/components/FlavorProfileChart';

interface FlavorMixPanelProps {
  selectedIngredients: Ingredient[];
  flavorProfile: string;
  handleSelectIngredient: (ingredient: Ingredient) => void;
  handleClearSelection: () => void;
  handleSaveFlavorCombination: () => void;
  t: (key: string) => string;
}

const FlavorMixPanel: React.FC<FlavorMixPanelProps> = ({
  selectedIngredients,
  flavorProfile,
  handleSelectIngredient,
  handleClearSelection,
  handleSaveFlavorCombination,
  t
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-bold text-lg">{t('selectedIngredients')}</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearSelection}
              disabled={selectedIngredients.length === 0}
            >
              {t('clearAll')}
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleSaveFlavorCombination}
              disabled={selectedIngredients.length === 0}
            >
              {t('saveFlavorCombination')}
            </Button>
          </div>
        </div>
        
        {selectedIngredients.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {selectedIngredients.map(ingredient => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  isSelected={true}
                  onSelect={handleSelectIngredient}
                />
              ))}
            </div>
            
            {/* Add the FlavorProfileChart component here */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">{t('flavorProfile')}</h4>
              <FlavorProfileChart ingredients={selectedIngredients} />
            </div>
            
            {flavorProfile && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{t('flavorDescription')}:</h4>
                <p className="text-sm">{flavorProfile}</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground">Select ingredients to create your flavor combination</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlavorMixPanel;
