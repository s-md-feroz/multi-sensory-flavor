
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Ingredient, 
  ingredients as allIngredients, 
  TasteCategory, 
  SmellCategory, 
  TextureCategory,
  getComplementaryIngredients,
  generateFlavorProfileDescription
} from '@/utils/flavor';

// Import refactored components
import FilterPanel from '@/components/flavor-builder/FilterPanel';
import IngredientList from '@/components/flavor-builder/IngredientList';
import FlavorMixPanel from '@/components/flavor-builder/FlavorMixPanel';
import RecommendationsPanel from '@/components/flavor-builder/RecommendationsPanel';
import { 
  tasteCategories, 
  smellCategories, 
  textureCategories,
  tasteCategoriesColorMap
} from '@/components/flavor-builder/constants';

const FlavorBuilder = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('taste');
  const [selectedFilters, setSelectedFilters] = useState<{
    taste: TasteCategory[];
    smell: SmellCategory[];
    texture: TextureCategory[];
  }>({
    taste: [],
    smell: [],
    texture: []
  });
  
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(allIngredients);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [recommendations, setRecommendations] = useState<Ingredient[]>([]);
  const [flavorProfile, setFlavorProfile] = useState<string>("");
  
  useEffect(() => {
    let results = [...allIngredients];
    
    if (selectedFilters.taste.length > 0) {
      results = results.filter(ing => 
        ing.taste.some(taste => selectedFilters.taste.includes(taste))
      );
    }
    
    if (selectedFilters.smell.length > 0) {
      results = results.filter(ing => 
        ing.smell.some(smell => selectedFilters.smell.includes(smell))
      );
    }
    
    if (selectedFilters.texture.length > 0) {
      results = results.filter(ing => 
        ing.texture.some(texture => selectedFilters.texture.includes(texture))
      );
    }
    
    setFilteredIngredients(results);
  }, [selectedFilters]);
  
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      const selectedIds = selectedIngredients.map(ing => ing.id);
      const complementary = getComplementaryIngredients(selectedIds);
      setRecommendations(complementary);
      
      const profileDesc = generateFlavorProfileDescription(selectedIds);
      setFlavorProfile(profileDesc);
    } else {
      setRecommendations([]);
      setFlavorProfile("");
    }
  }, [selectedIngredients]);
  
  const handleToggleFilter = (category: 'taste' | 'smell' | 'texture', value: any) => {
    setSelectedFilters(prev => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);
      
      if (index >= 0) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      return { ...prev, [category]: currentFilters };
    });
  };
  
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients(prev => {
      const index = prev.findIndex(ing => ing.id === ingredient.id);
      
      if (index >= 0) {
        return prev.filter(ing => ing.id !== ingredient.id);
      } else {
        if (prev.length >= 5) {
          toast.error("Maximum 5 ingredients allowed. Remove some before adding more.");
          return prev;
        }
        return [...prev, ingredient];
      }
    });
  };
  
  const handleClearSelection = () => {
    setSelectedIngredients([]);
    setSelectedFilters({
      taste: [],
      smell: [],
      texture: []
    });
  };
  
  const handleSaveFlavorCombination = () => {
    if (selectedIngredients.length === 0) {
      toast.error("Add some ingredients first!");
      return;
    }
    
    toast.success("Flavor combination saved to your mood board!");
  };
  
  return (
    <div className="min-h-screen animated-gradient">
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{t('flavorBuilderTitle')}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('flavorBuilderDescription')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <Card>
              <CardContent className="p-6">
                <FilterPanel
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  selectedFilters={selectedFilters}
                  handleToggleFilter={handleToggleFilter}
                  tasteCategories={tasteCategories}
                  smellCategories={smellCategories}
                  textureCategories={textureCategories}
                />
                
                <div className="mt-6">
                  <h3 className="font-heading font-bold mb-3">{t('filteredIngredients')}</h3>
                  <IngredientList
                    filteredIngredients={filteredIngredients}
                    selectedIngredients={selectedIngredients}
                    handleSelectIngredient={handleSelectIngredient}
                    tasteCategoriesColors={tasteCategoriesColorMap}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <FlavorMixPanel
              selectedIngredients={selectedIngredients}
              flavorProfile={flavorProfile}
              handleSelectIngredient={handleSelectIngredient}
              handleClearSelection={handleClearSelection}
              handleSaveFlavorCombination={handleSaveFlavorCombination}
              t={t}
            />
            
            <RecommendationsPanel
              recommendations={recommendations}
              selectedIngredients={selectedIngredients}
              handleSelectIngredient={handleSelectIngredient}
              tasteCategoriesColors={tasteCategoriesColorMap}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlavorBuilder;
