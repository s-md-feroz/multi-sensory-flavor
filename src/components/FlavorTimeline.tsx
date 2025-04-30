
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  Heart, 
  Star 
} from 'lucide-react';
import { 
  FlavorExperience, 
  getAllExperiences,
  getExperiencesByMood,
  getExperiencesByTag,
  getExperiencesByLocation
} from '@/utils/flavor/experiences';
import { MoodCategory } from '@/utils/flavor/types';
import { ingredients } from '@/utils/flavor/ingredients';

interface FlavorTimelineProps {
  onSelectExperience?: (experience: FlavorExperience) => void;
}

const FlavorTimeline: React.FC<FlavorTimelineProps> = ({ onSelectExperience }) => {
  const [experiences, setExperiences] = useState<FlavorExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<FlavorExperience[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    // Load all experiences initially
    const allExperiences = getAllExperiences();
    setExperiences(allExperiences);
    setFilteredExperiences(allExperiences);
  }, []);

  // Apply filters
  const applyFilters = () => {
    let result = [...experiences];

    if (selectedMood) {
      result = getExperiencesByMood(selectedMood);
    }

    if (selectedTag) {
      const tagFiltered = getExperiencesByTag(selectedTag);
      result = result.filter(exp => tagFiltered.some(t => t.id === exp.id));
    }

    if (selectedLocation) {
      const locationFiltered = getExperiencesByLocation(selectedLocation);
      result = result.filter(exp => locationFiltered.some(l => l.id === exp.id));
    }

    setFilteredExperiences(result);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedMood, selectedTag, selectedLocation, experiences]);

  const handleSelectExperience = (experience: FlavorExperience) => {
    if (onSelectExperience) {
      onSelectExperience(experience);
    }
  };

  // Get unique tags and locations for filters
  const allTags = Array.from(new Set(experiences.flatMap(exp => exp.tags)));
  const allLocations = Array.from(new Set(experiences.map(exp => exp.location).filter(Boolean) as string[]));

  // Get ingredient names by ID
  const getIngredientName = (id: string): string => {
    const ingredient = ingredients.find(ing => ing.id === id);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Flavor Memories Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-medium mb-1">Filter by Mood:</h3>
              <div className="flex flex-wrap gap-1">
                {(['cozy', 'adventurous', 'refreshing', 'romantic', 'energizing', 'calming'] as MoodCategory[]).map(mood => (
                  <Badge
                    key={mood}
                    variant={selectedMood === mood ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                  >
                    {mood}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Filter by Tag:</h3>
              <div className="flex flex-wrap gap-1">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" /> {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Filter by Location:</h3>
              <div className="flex flex-wrap gap-1">
                {allLocations.map(location => (
                  <Badge
                    key={location}
                    variant={selectedLocation === location ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
                  >
                    <MapPin className="h-3 w-3 mr-1" /> {location}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                setSelectedMood(null);
                setSelectedTag(null);
                setSelectedLocation(null);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map(experience => (
            <Card 
              key={experience.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSelectExperience(experience)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{experience.title}</h3>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatDate(experience.date)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {experience.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">
                    <Heart className="h-3 w-3 mr-1 text-rose-500" />
                    {experience.mood}
                  </Badge>
                  {experience.location && (
                    <Badge variant="secondary">
                      <MapPin className="h-3 w-3 mr-1" />
                      {experience.location}
                    </Badge>
                  )}
                  {experience.rating && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1 text-amber-500" />
                      {experience.rating}/5
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {experience.ingredients.map(ingId => (
                    <Badge key={ingId} variant="outline" className="bg-primary/10">
                      {getIngredientName(ingId)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>No flavor experiences found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlavorTimeline;
