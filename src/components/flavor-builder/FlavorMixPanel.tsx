
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ingredient } from '@/utils/flavor';
import { Candy, Lollipop } from 'lucide-react';
import FlavorProfileChart from '@/components/FlavorProfileChart';

interface FlavorMixPanelProps {
  selectedIngredients: Ingredient[];
  flavorProfile: string;
  handleSelectIngredient: (ingredient: Ingredient) => void;
  handleClearSelection: () => void;
  handleSaveFlavorCombination: () => void;
}

const FlavorMixPanel = ({
  selectedIngredients,
  flavorProfile,
  handleSelectIngredient,
  handleClearSelection,
  handleSaveFlavorCombination
}: FlavorMixPanelProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading font-bold text-xl">Your Flavor Mix</h2>
          <Button variant="outline" size="sm" onClick={handleClearSelection}>
            Clear All
          </Button>
        </div>
        
        <div className="mb-6">
          {selectedIngredients.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {selectedIngredients.map(ingredient => (
                  <Card key={ingredient.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleSelectIngredient(ingredient)}>
                    <CardContent className="p-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                        <Candy className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium text-sm">{ingredient.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <FlavorProfileChart ingredients={selectedIngredients} />
            </>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <Lollipop className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Select ingredients to start your flavor mix</p>
            </div>
          )}
        </div>
        
        {selectedIngredients.length > 0 && (
          <>
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <h3 className="font-heading font-bold mb-2">Flavor Profile</h3>
              <p>{flavorProfile}</p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleClearSelection}>
                Start Over
              </Button>
              <Button onClick={handleSaveFlavorCombination}>
                Save Combination
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FlavorMixPanel;
