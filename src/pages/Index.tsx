
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MoodBasedRecommendations from '@/components/MoodBasedRecommendations';
import FlavorProfileChart from '@/components/FlavorProfileChart';
import { Ingredient } from '@/utils/flavor';
import { Badge } from "@/components/ui/badge";
import { Lollipop, Search } from 'lucide-react';

const Index = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

  const handleSelectIngredients = (ingredients: Ingredient[]) => {
    setSelectedIngredients(ingredients);
  };

  return (
    <div className="container py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 font-heading">Sensory Flavor Alchemy</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Discover the science of taste and create unique flavor experiences based on your mood and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <MoodBasedRecommendations onSelectIngredients={handleSelectIngredients} />
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Flavor Profile</h2>
            
            {selectedIngredients.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedIngredients.map(ing => (
                    <Badge key={ing.id} className="bg-primary/20 text-primary-foreground">
                      {ing.name}
                    </Badge>
                  ))}
                </div>
                <FlavorProfileChart ingredients={selectedIngredients} />
              </>
            ) : (
              <div className="text-center p-8 bg-muted/20 rounded-lg">
                <Lollipop className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a mood to generate a flavor profile
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Ready to dive deeper?</h2>
        <div className="flex gap-4">
          <Button variant="default" asChild>
            <Link to="/flavor-builder">
              <Lollipop className="mr-2 h-4 w-4" />
              Build Your Flavor
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/mood-board">
              <Search className="mr-2 h-4 w-4" />
              Explore Flavor Profiles
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
