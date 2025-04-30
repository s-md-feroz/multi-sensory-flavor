import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MoodCategory, generateMoodChallenge, Ingredient } from '@/utils/flavor';
import { Candy, Cherry, Cookie, CandyOff, Lollipop } from 'lucide-react';
import MoodSensoryChart from '@/components/MoodSensoryChart';

const moodCategories: { value: MoodCategory; label: string; icon: JSX.Element; description: string; colorClass: string }[] = [
  { value: 'cozy', label: 'Cozy', icon: <Cookie className="h-6 w-6" />, description: 'Warm, comforting flavors that feel like a hug', colorClass: 'bg-flavor-lavender text-flavor-purple' },
  { value: 'adventurous', label: 'Adventurous', icon: <CandyOff className="h-6 w-6" />, description: 'Bold, unexpected combinations that surprise the senses', colorClass: 'bg-flavor-orange text-white' },
  { value: 'refreshing', label: 'Refreshing', icon: <Cherry className="h-6 w-6" />, description: 'Bright, invigorating flavors that feel rejuvenating', colorClass: 'bg-flavor-mint text-black' },
  { value: 'romantic', label: 'Romantic', icon: <Candy className="h-6 w-6" />, description: 'Sensual, indulgent flavors that create intimate moments', colorClass: 'bg-flavor-pink text-black' },
  { value: 'energizing', label: 'Energizing', icon: <Lollipop className="h-6 w-6" />, description: 'Vibrant, stimulating combinations that boost your mood', colorClass: 'bg-flavor-yellow text-black' },
  { value: 'calming', label: 'Calming', icon: <Cookie className="h-6 w-6" />, description: 'Gentle, soothing flavors that help you unwind', colorClass: 'bg-flavor-blue text-black' },
];

interface ChallengeState {
  activeMood: MoodCategory;
  currentChallenge: {
    ingredients: Ingredient[];
    description: string;
  } | null;
  userSelections: Ingredient[];
  isComplete: boolean;
}

const Challenges = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get mood parameter from URL if it exists
  const queryParams = new URLSearchParams(location.search);
  const moodParam = queryParams.get('mood') as MoodCategory | null;
  
  // Default to 'cozy' if no valid mood is specified
  const defaultMood: MoodCategory = 
    moodParam && moodCategories.some(m => m.value === moodParam) ? moodParam : 'cozy';
  
  const [state, setState] = useState<ChallengeState>({
    activeMood: defaultMood,
    currentChallenge: null,
    userSelections: [],
    isComplete: false
  });
  
  // Generate a new challenge when the active mood changes
  useEffect(() => {
    if (state.activeMood) {
      const newChallenge = generateMoodChallenge(state.activeMood);
      setState(prev => ({
        ...prev,
        currentChallenge: newChallenge,
        userSelections: [],
        isComplete: false
      }));
      
      // Update URL to reflect current mood
      if (location.search !== `?mood=${state.activeMood}`) {
        navigate(`/challenges?mood=${state.activeMood}`, { replace: true });
      }
    }
  }, [state.activeMood]);
  
  const handleSelectMood = (mood: MoodCategory) => {
    setState(prev => ({
      ...prev,
      activeMood: mood
    }));
  };
  
  const handleToggleIngredient = (ingredient: Ingredient) => {
    setState(prev => {
      const isSelected = prev.userSelections.some(sel => sel.id === ingredient.id);
      
      if (isSelected) {
        return {
          ...prev,
          userSelections: prev.userSelections.filter(sel => sel.id !== ingredient.id)
        };
      } else {
        return {
          ...prev,
          userSelections: [...prev.userSelections, ingredient]
        };
      }
    });
  };
  
  const handleCompleteChallenge = () => {
    // In a real app, we might save this to a user profile or achievements
    setState(prev => ({
      ...prev,
      isComplete: true
    }));
    toast.success(`${state.activeMood} challenge completed!`);
  };
  
  const handleNewChallenge = () => {
    const newChallenge = generateMoodChallenge(state.activeMood);
    setState(prev => ({
      ...prev,
      currentChallenge: newChallenge,
      userSelections: [],
      isComplete: false
    }));
    toast('New challenge generated!');
  };
  
  // Find color class for active mood
  const activeMoodColor = moodCategories.find(m => m.value === state.activeMood)?.colorClass || '';
  
  return (
    <div className="animated-gradient min-h-screen">
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Flavor Challenges</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test your sensory creativity with mood-based flavor challenges
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mood Selection Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Select Your Mood</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {moodCategories.map(mood => (
                  <div
                    key={mood.value}
                    className={`p-4 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                      state.activeMood === mood.value
                        ? 'bg-primary text-white ring-2 ring-primary/20'
                        : 'bg-muted/40 hover:bg-muted'
                    }`}
                    onClick={() => handleSelectMood(mood.value)}
                  >
                    <div className={`rounded-full p-2 ${state.activeMood === mood.value ? 'bg-white/20' : 'bg-primary/10'}`}>
                      {mood.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold">{mood.label}</h3>
                      <p className={`text-sm ${state.activeMood === mood.value ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {mood.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              
              {/* Add the Mood Sensory Chart here */}
              <CardContent className="pt-0">
                <h3 className="font-heading font-medium mb-2">Sensory Profile</h3>
                <MoodSensoryChart moodCategory={state.activeMood} />
              </CardContent>
            </Card>
          </div>
          
          {/* Challenge Panel */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className={`${activeMoodColor}`}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {moodCategories.find(m => m.value === state.activeMood)?.icon}
                    {state.activeMood.charAt(0).toUpperCase() + state.activeMood.slice(1)} Challenge
                  </CardTitle>
                  
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleNewChallenge}
                  >
                    New Challenge
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {state.currentChallenge ? (
                  <div>
                    <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-heading font-bold mb-2">Your Challenge</h3>
                      <p>{state.currentChallenge.description}</p>
                    </div>
                    
                    {state.isComplete ? (
                      <div className="text-center py-6">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 inline-flex">
                          <Candy className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-heading font-bold mb-2">
                          Challenge Complete!
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          You've successfully created a {state.activeMood} flavor combination.
                        </p>
                        <Button onClick={handleNewChallenge}>Try Another Challenge</Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-heading font-bold mb-3">Suggested Ingredients</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                          {state.currentChallenge.ingredients.map(ingredient => (
                            <Card 
                              key={ingredient.id}
                              className={`cursor-pointer transition-all ${
                                state.userSelections.some(sel => sel.id === ingredient.id)
                                  ? 'ring-2 ring-primary ring-offset-2'
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => handleToggleIngredient(ingredient)}
                            >
                              <CardContent className="p-4 text-center">
                                <div className="mb-2 rounded-full bg-primary/10 p-2 inline-flex">
                                  <Candy className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-medium">{ingredient.name}</h4>
                                <div className="mt-2 flex flex-wrap gap-1 justify-center">
                                  {ingredient.taste.slice(0, 1).map(taste => (
                                    <Badge key={taste} variant="outline" className="text-xs">
                                      {taste}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        
                        <div className="border-t pt-4">
                          <h3 className="font-heading font-bold mb-3">Your Selections</h3>
                          {state.userSelections.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {state.userSelections.map(ingredient => (
                                <Badge 
                                  key={ingredient.id}
                                  className="flex items-center gap-1 py-1 px-3"
                                >
                                  {ingredient.name}
                                  <button 
                                    onClick={() => handleToggleIngredient(ingredient)}
                                    className="ml-1 rounded-full hover:bg-primary/20 p-1"
                                  >
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      width="10" 
                                      height="10" 
                                      viewBox="0 0 24 24" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      strokeWidth="2" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground mb-4">
                              Select ingredients from above to create your combination
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <span>Loading challenge...</span>
                  </div>
                )}
              </CardContent>
              
              {!state.isComplete && state.currentChallenge && (
                <CardFooter className="flex justify-between border-t p-6">
                  <Button variant="outline" onClick={handleNewChallenge}>
                    Skip Challenge
                  </Button>
                  <Button 
                    onClick={handleCompleteChallenge}
                    disabled={state.userSelections.length === 0}
                  >
                    Complete Challenge
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {/* Additional Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Tips for {state.activeMood} Flavors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm">
                  {state.activeMood === 'cozy' && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Use warm spices like cinnamon, nutmeg, and cloves</li>
                      <li>Consider soft textures and creamy mouthfeel</li>
                      <li>Aim for familiar aromas that evoke nostalgia</li>
                      <li>Moderate sweetness often feels more comforting than intense sweetness</li>
                    </ul>
                  )}
                  {state.activeMood === 'adventurous' && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Combine contrasting flavors like sweet and spicy</li>
                      <li>Experiment with unexpected texture combinations</li>
                      <li>Try ingredients from different cultures and cuisines</li>
                      <li>Include surprise elements like popping candies or temperature contrasts</li>
                    </ul>
                  )}
                  {state.activeMood === 'refreshing' && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Incorporate citrus notes and bright acidity</li>
                      <li>Consider herbs like mint, basil, or cilantro</li>
                      <li>Use light textures that don't feel heavy</li>
                      <li>Add effervescence or crispness to enhance the refreshing quality</li>
                    </ul>
                  )}
                  {state.activeMood === 'romantic' && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Use sensual ingredients like chocolate, berries, and vanilla</li>
                      <li>Consider silky, melting textures</li>
                      <li>Incorporate subtle floral notes</li>
                      <li>Balance richness with brightness to create complexity</li>
                    </ul>
                  )}
                  {state.activeMood === 'energizing' && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Include bright, bold flavors that wake up the palate</li>
                      <li>Add zippy elements like ginger or citrus zest</li>
                      <li>Consider textural interest like crunch or pop</li>
                      <li>Use vibrant colors to enhance the energizing effect</li>
                    </ul>
                  )}
                  {state.activeMood === 'calming' && (
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Incorporate gentle herbal notes like lavender or chamomile</li>
                      <li>Use smooth, flowing textures rather than disruptive ones</li>
                      <li>Consider subtle sweetness rather than intense sugar</li>
                      <li>Create balanced flavor profiles without jarring contrasts</li>
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
