
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Ingredient, 
  ingredients as allIngredients, 
  TasteCategory, 
  SmellCategory, 
  TextureCategory,
  getComplementaryIngredients,
  generateFlavorProfileDescription
} from '@/utils/flavorEngine';
import { Cookie, CandyOff, Lollipop, Candy } from 'lucide-react';

// Sensory category configuration
const tasteCategories: { value: TasteCategory; label: string; color: string }[] = [
  { value: 'sweet', label: 'Sweet', color: 'bg-flavor-pink text-black' },
  { value: 'salty', label: 'Salty', color: 'bg-flavor-blue text-black' },
  { value: 'sour', label: 'Sour', color: 'bg-flavor-yellow text-black' },
  { value: 'bitter', label: 'Bitter', color: 'bg-flavor-lavender text-black' },
  { value: 'umami', label: 'Umami', color: 'bg-flavor-orange text-black' },
];

const smellCategories: { value: SmellCategory; label: string }[] = [
  { value: 'floral', label: 'Floral' },
  { value: 'fruity', label: 'Fruity' },
  { value: 'spicy', label: 'Spicy' },
  { value: 'earthy', label: 'Earthy' },
  { value: 'woody', label: 'Woody' },
  { value: 'herbal', label: 'Herbal' },
  { value: 'smoky', label: 'Smoky' },
];

const textureCategories: { value: TextureCategory; label: string }[] = [
  { value: 'crispy', label: 'Crispy' },
  { value: 'crunchy', label: 'Crunchy' },
  { value: 'creamy', label: 'Creamy' },
  { value: 'smooth', label: 'Smooth' },
  { value: 'fizzy', label: 'Fizzy' },
  { value: 'chewy', label: 'Chewy' },
  { value: 'tender', label: 'Tender' },
];

// Component for each ingredient card
const IngredientCard = ({ 
  ingredient, 
  isSelected, 
  onSelect 
}: { 
  ingredient: Ingredient; 
  isSelected: boolean; 
  onSelect: (ingredient: Ingredient) => void;
}) => {
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
                tasteCategories.find(t => t.value === taste)?.color || ''
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

const FlavorBuilder = () => {
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
  
  // Update filtered ingredients based on selected filters
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
  
  // Update recommendations when selected ingredients change
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      const selectedIds = selectedIngredients.map(ing => ing.id);
      const complementary = getComplementaryIngredients(selectedIds);
      setRecommendations(complementary);
      
      // Generate flavor profile description
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
        // Remove ingredient
        return prev.filter(ing => ing.id !== ingredient.id);
      } else {
        // Add ingredient (max 5)
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
    
    // In a real app, this would save to a database or localStorage
    // For now, just show a success toast
    toast.success("Flavor combination saved to your mood board!");
  };
  
  return (
    <div className="min-h-screen animated-gradient">
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Flavor Builder</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create unique flavor combinations using the science of multisensory design
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sensory Selection Panel */}
          <div>
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="taste" className="flex gap-1 items-center">
                      <Candy className="h-4 w-4" />
                      <span>Taste</span>
                    </TabsTrigger>
                    <TabsTrigger value="smell" className="flex gap-1 items-center">
                      <Cookie className="h-4 w-4" />
                      <span>Smell</span>
                    </TabsTrigger>
                    <TabsTrigger value="texture" className="flex gap-1 items-center">
                      <Lollipop className="h-4 w-4" />
                      <span>Texture</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="taste">
                    <h3 className="font-heading font-bold mb-3">Select Taste Profiles</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tasteCategories.map(category => (
                        <Badge
                          key={category.value}
                          variant={selectedFilters.taste.includes(category.value) ? "default" : "outline"}
                          className={`cursor-pointer ${selectedFilters.taste.includes(category.value) ? category.color : ''}`}
                          onClick={() => handleToggleFilter('taste', category.value)}
                        >
                          {category.label}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="smell">
                    <h3 className="font-heading font-bold mb-3">Select Aroma Profiles</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {smellCategories.map(category => (
                        <Badge
                          key={category.value}
                          variant={selectedFilters.smell.includes(category.value) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleToggleFilter('smell', category.value)}
                        >
                          {category.label}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="texture">
                    <h3 className="font-heading font-bold mb-3">Select Texture Profiles</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {textureCategories.map(category => (
                        <Badge
                          key={category.value}
                          variant={selectedFilters.texture.includes(category.value) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleToggleFilter('texture', category.value)}
                        >
                          {category.label}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6">
                  <h3 className="font-heading font-bold mb-3">Filtered Ingredients</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredIngredients.length > 0 ? (
                      filteredIngredients.map(ingredient => (
                        <IngredientCard
                          key={ingredient.id}
                          ingredient={ingredient}
                          isSelected={selectedIngredients.some(ing => ing.id === ingredient.id)}
                          onSelect={handleSelectIngredient}
                        />
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-6 text-muted-foreground">
                        <CandyOff className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No ingredients match your filters</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Flavor Mixing Panel */}
          <div className="lg:col-span-2">
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
            
            {/* Recommendations */}
            {recommendations.length > 0 && (
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
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlavorBuilder;
