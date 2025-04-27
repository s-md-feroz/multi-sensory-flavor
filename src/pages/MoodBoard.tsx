
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Cookie, Candy, Lollipop, CandyOff, Cherry } from 'lucide-react';

// Types for the mood board
interface FlavorCombination {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  tastes: string[];
  smells: string[];
  textures: string[];
  notes: string;
  colorTheme: string;
}

// Sample data for the mood board
const sampleFlavorCombinations: FlavorCombination[] = [
  {
    id: '1',
    title: 'Sweet Citrus Symphony',
    description: 'A refreshing blend of sweet and sour with bright aromas',
    ingredients: ['Lime', 'Honey', 'Basil'],
    tastes: ['sweet', 'sour'],
    smells: ['fruity', 'herbal'],
    textures: ['smooth'],
    notes: 'Perfect for summer refreshments. Try adding a splash of sparkling water for extra texture.',
    colorTheme: 'bg-gradient-to-r from-flavor-yellow to-flavor-mint'
  },
  {
    id: '2',
    title: 'Umami Crunch',
    description: 'Rich savory flavors with satisfying texture contrast',
    ingredients: ['Mushroom', 'Potato Chips', 'Sea Salt'],
    tastes: ['umami', 'salty'],
    smells: ['earthy'],
    textures: ['crunchy', 'crispy'],
    notes: 'A surprising snack combination. The earthiness of mushrooms pairs unexpectedly well with the crispy salt of chips.',
    colorTheme: 'bg-gradient-to-r from-flavor-orange/60 to-flavor-peach'
  },
  {
    id: '3',
    title: 'Cozy Indulgence',
    description: 'Warm, comforting flavors with complex sweetness',
    ingredients: ['Dark Chocolate', 'Cinnamon', 'Honey'],
    tastes: ['sweet', 'bitter'],
    smells: ['woody', 'spicy'],
    textures: ['smooth', 'creamy'],
    notes: 'Perfect for cold winter evenings. Try this combination in hot chocolate or as a flavor base for cookies.',
    colorTheme: 'bg-gradient-to-r from-flavor-purple/70 to-flavor-lavender'
  }
];

const MoodBoard = () => {
  const [savedCombinations, setSavedCombinations] = useState<FlavorCombination[]>(sampleFlavorCombinations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCombination, setNewCombination] = useState<Partial<FlavorCombination>>({
    title: '',
    description: '',
    ingredients: [],
    tastes: [],
    smells: [],
    textures: [],
    notes: '',
    colorTheme: 'bg-gradient-to-r from-flavor-mint to-flavor-blue'
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to generate a random ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  // Filter combinations based on selected filter and search term
  const filteredCombinations = savedCombinations.filter(combo => {
    // Apply category filter if selected
    if (filterCategory === 'sweet' && !combo.tastes.includes('sweet')) return false;
    if (filterCategory === 'salty' && !combo.tastes.includes('salty')) return false;
    if (filterCategory === 'sour' && !combo.tastes.includes('sour')) return false;
    if (filterCategory === 'bitter' && !combo.tastes.includes('bitter')) return false;
    if (filterCategory === 'umami' && !combo.tastes.includes('umami')) return false;
    
    // Apply search term filter if present
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        combo.title.toLowerCase().includes(searchLower) ||
        combo.description.toLowerCase().includes(searchLower) ||
        combo.ingredients.some(ing => ing.toLowerCase().includes(searchLower)) ||
        combo.notes.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const handleAddIngredient = () => {
    if (!ingredientInput.trim()) return;
    
    setNewCombination(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ingredientInput.trim()]
    }));
    
    setIngredientInput('');
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setNewCombination(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(ing => ing !== ingredient) || []
    }));
  };

  const handleToggleTaste = (taste: string) => {
    setNewCombination(prev => {
      const tastes = prev.tastes || [];
      if (tastes.includes(taste)) {
        return { ...prev, tastes: tastes.filter(t => t !== taste) };
      } else {
        return { ...prev, tastes: [...tastes, taste] };
      }
    });
  };

  const handleToggleSmell = (smell: string) => {
    setNewCombination(prev => {
      const smells = prev.smells || [];
      if (smells.includes(smell)) {
        return { ...prev, smells: smells.filter(s => s !== smell) };
      } else {
        return { ...prev, smells: [...smells, smell] };
      }
    });
  };

  const handleToggleTexture = (texture: string) => {
    setNewCombination(prev => {
      const textures = prev.textures || [];
      if (textures.includes(texture)) {
        return { ...prev, textures: textures.filter(t => t !== texture) };
      } else {
        return { ...prev, textures: [...textures, texture] };
      }
    });
  };

  const handleSaveCombination = () => {
    if (!newCombination.title || !newCombination.ingredients?.length) {
      toast.error('Please add a title and at least one ingredient');
      return;
    }
    
    const combinationToSave: FlavorCombination = {
      id: generateId(),
      title: newCombination.title || 'New Flavor Combination',
      description: newCombination.description || '',
      ingredients: newCombination.ingredients || [],
      tastes: newCombination.tastes || [],
      smells: newCombination.smells || [],
      textures: newCombination.textures || [],
      notes: newCombination.notes || '',
      colorTheme: newCombination.colorTheme || 'bg-gradient-to-r from-flavor-mint to-flavor-blue'
    };
    
    setSavedCombinations([combinationToSave, ...savedCombinations]);
    setIsDialogOpen(false);
    toast.success('Flavor combination saved to your mood board!');
    
    // Reset form
    setNewCombination({
      title: '',
      description: '',
      ingredients: [],
      tastes: [],
      smells: [],
      textures: [],
      notes: '',
      colorTheme: 'bg-gradient-to-r from-flavor-mint to-flavor-blue'
    });
  };

  const handleDeleteCombination = (id: string) => {
    setSavedCombinations(savedCombinations.filter(combo => combo.id !== id));
    toast.success('Flavor combination removed');
  };

  return (
    <div className="animated-gradient min-h-screen">
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Flavor Mood Board</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Save and organize your favorite flavor combinations and sensory experiments
          </p>
        </div>
        
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium mr-2">Filter by:</span>
            {['sweet', 'salty', 'sour', 'bitter', 'umami'].map(category => (
              <Badge
                key={category}
                variant={filterCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilterCategory(filterCategory === category ? null : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <Input
              placeholder="Search combinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[200px]"
            />
            
            <Button className="whitespace-nowrap" onClick={() => setIsDialogOpen(true)}>
              New Combination
            </Button>
          </div>
        </div>
        
        {filteredCombinations.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <div className="mb-4 p-4 rounded-full bg-muted inline-flex mx-auto">
              <CandyOff className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-2">No combinations found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterCategory 
                ? "Try adjusting your filters or search term" 
                : "Start by creating your first flavor combination"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>Create New Combination</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCombinations.map(combination => (
              <Card 
                key={combination.id} 
                className={`overflow-hidden ${combination.colorTheme}`}
              >
                <CardHeader className="glass-effect">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-bold text-lg">{combination.title}</h3>
                      <p className="text-sm text-muted-foreground">{combination.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCombination(combination.id)}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Delete</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-white/80">
                  <div className="mb-4">
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-1">
                      <Cherry className="h-4 w-4" />
                      Ingredients:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {combination.ingredients.map((ingredient, idx) => (
                        <Badge key={idx} variant="secondary">{ingredient}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                    <div>
                      <span className="font-bold block mb-1 flex items-center gap-1">
                        <Candy className="h-3 w-3" />
                        Tastes:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {combination.tastes.length > 0 ? (
                          combination.tastes.map((taste, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{taste}</Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold block mb-1 flex items-center gap-1">
                        <Cookie className="h-3 w-3" />
                        Aromas:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {combination.smells.length > 0 ? (
                          combination.smells.map((smell, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{smell}</Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold block mb-1 flex items-center gap-1">
                        <Lollipop className="h-3 w-3" />
                        Textures:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {combination.textures.length > 0 ? (
                          combination.textures.map((texture, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{texture}</Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {combination.notes && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-bold mb-1">Notes:</h4>
                      <p className="text-sm text-muted-foreground">
                        {combination.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* New Combination Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Flavor Combination</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={newCombination.title || ''}
                onChange={(e) => setNewCombination({...newCombination, title: e.target.value})}
                placeholder="Give your flavor combination a name" 
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={newCombination.description || ''}
                onChange={(e) => setNewCombination({...newCombination, description: e.target.value})}
                placeholder="Briefly describe this flavor combination" 
              />
            </div>
            
            <div>
              <Label htmlFor="ingredients">Ingredients</Label>
              <div className="flex gap-2">
                <Input 
                  id="ingredients" 
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  placeholder="Add an ingredient" 
                />
                <Button type="button" onClick={handleAddIngredient} className="shrink-0">
                  Add
                </Button>
              </div>
              
              {newCombination.ingredients && newCombination.ingredients.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {newCombination.ingredients.map((ingredient, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {ingredient}
                      <button 
                        type="button" 
                        className="ml-1 rounded-full hover:bg-primary/20 p-1"
                        onClick={() => handleRemoveIngredient(ingredient)}
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
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="block mb-2 text-sm">Tastes</Label>
                <div className="flex flex-col gap-1">
                  {['sweet', 'salty', 'sour', 'bitter', 'umami'].map((taste) => (
                    <Badge 
                      key={taste}
                      variant={newCombination.tastes?.includes(taste) ? "default" : "outline"}
                      className="cursor-pointer justify-start mb-1"
                      onClick={() => handleToggleTaste(taste)}
                    >
                      {taste}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block mb-2 text-sm">Aromas</Label>
                <div className="flex flex-col gap-1">
                  {['floral', 'fruity', 'spicy', 'earthy', 'woody'].map((smell) => (
                    <Badge 
                      key={smell}
                      variant={newCombination.smells?.includes(smell) ? "default" : "outline"}
                      className="cursor-pointer justify-start mb-1"
                      onClick={() => handleToggleSmell(smell)}
                    >
                      {smell}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="block mb-2 text-sm">Textures</Label>
                <div className="flex flex-col gap-1">
                  {['crispy', 'creamy', 'crunchy', 'smooth', 'chewy'].map((texture) => (
                    <Badge 
                      key={texture}
                      variant={newCombination.textures?.includes(texture) ? "default" : "outline"}
                      className="cursor-pointer justify-start mb-1"
                      onClick={() => handleToggleTexture(texture)}
                    >
                      {texture}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={newCombination.notes || ''}
                onChange={(e) => setNewCombination({...newCombination, notes: e.target.value})}
                placeholder="Add any notes about this combination" 
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCombination}>
              Save Combination
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoodBoard;
