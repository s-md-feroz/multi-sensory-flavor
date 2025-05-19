
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import IngredientCard from './IngredientCard';
import { Ingredient } from '@/utils/flavor';
import FlavorProfileChart from '@/components/FlavorProfileChart';
import { getAISuggestions } from '@/utils/flavor/aiSuggestions';

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
  const [aiSuggestions, setAiSuggestions] = useState<{
    suggestions: Ingredient[];
    reasoning: string;
  }>({ suggestions: [], reasoning: '' });
  
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  // Generate AI suggestions when selected ingredients change
  useEffect(() => {
    const suggestions = getAISuggestions(selectedIngredients);
    setAiSuggestions(suggestions);
  }, [selectedIngredients]);

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
            
            {/* AI Suggestion Button */}
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                className="w-full flex items-center justify-center gap-2 border-dashed border-primary/50 bg-muted/50 hover:bg-primary/10"
              >
                <Sparkles size={16} className="text-primary" />
                {showAiSuggestions ? t('hideAiSuggestions') : t('showAiSuggestions')}
              </Button>
            </div>
            
            {/* AI Suggestions Panel */}
            {showAiSuggestions && (
              <div className="bg-primary/5 p-4 rounded-lg mb-6 border border-primary/20">
                <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-primary" />
                  {t('aiSuggestions')}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-3">{aiSuggestions.reasoning}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {aiSuggestions.suggestions.map(ingredient => (
                    <IngredientCard
                      key={ingredient.id}
                      ingredient={ingredient}
                      isSelected={selectedIngredients.some(ing => ing.id === ingredient.id)}
                      onSelect={handleSelectIngredient}
                      highlight={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
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
