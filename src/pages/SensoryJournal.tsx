
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodFlavors from '@/components/MoodFlavors';
import FlavorTimeline from '@/components/FlavorTimeline';
import SpeechInput from '@/components/SpeechInput';
import MealScanner from '@/components/MealScanner';
import { FlavorExperience } from '@/utils/flavor/experiences';
import { Mic, Calendar, Heart, Camera, Share2, Globe, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const SensoryJournal = () => {
  const [selectedExperience, setSelectedExperience] = useState<FlavorExperience | null>(null);
  const [selectedTab, setSelectedTab] = useState("timeline");

  const handleExperienceSelect = (experience: FlavorExperience) => {
    setSelectedExperience(experience);
  };

  const handleShareExperience = () => {
    if (!selectedExperience) return;
    // In a real app, this would open a share dialog or generate a link
    toast.success("Generated a shareable link to your flavor experience!");
  };

  const handleSaveSpeechInput = (data: {
    notes: string;
    ingredients: string[];
    mood?: string;
  }) => {
    // In a real app, this would save to a database
    toast.success("Your flavor experience has been saved to your journal!");
    setSelectedTab("timeline");
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2 font-heading text-center">Your Sensory Journal</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-center mb-8">
        Capture, organize, and revisit your multisensory flavor experiences
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <TabsList className="grid grid-cols-4 md:w-[600px] mb-6">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Timeline
              </TabsTrigger>
              <TabsTrigger value="mood" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Mood Flavors
              </TabsTrigger>
              <TabsTrigger value="speech" className="flex items-center gap-2">
                <Mic className="h-4 w-4" /> Voice Log
              </TabsTrigger>
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Scan Meal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <FlavorTimeline onSelectExperience={handleExperienceSelect} />
            </TabsContent>

            <TabsContent value="mood">
              <MoodFlavors />
            </TabsContent>

            <TabsContent value="speech">
              <SpeechInput onSave={handleSaveSpeechInput} />
            </TabsContent>

            <TabsContent value="scan">
              <MealScanner onMatch={handleExperienceSelect} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {selectedExperience ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-2">{selectedExperience.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedExperience.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="default">{selectedExperience.mood}</Badge>
                  {selectedExperience.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleShareExperience}
                  >
                    <Share2 size={16} /> Share
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      // This would trigger audio cues in a real implementation
                      toast.info("Playing audio cues to enhance memory recall...");
                    }}
                  >
                    <Music size={16} /> Audio Cues
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          <MoodFlavors />
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-3">Language Options</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Log your sensory experiences in multiple languages
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => toast.info("Switched to English")}
                >
                  <Globe size={16} /> English
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => toast.info("Switched to Spanish")}
                >
                  <Globe size={16} /> Español
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => toast.info("Switched to French")}
                >
                  <Globe size={16} /> Français
                </Button>
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => toast.info("Switched to Japanese")}
                >
                  <Globe size={16} /> 日本語
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SensoryJournal;
