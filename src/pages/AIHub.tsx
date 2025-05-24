
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Camera, 
  MessageCircle, 
  Palette, 
  Heart, 
  Mic,
  Sparkles,
  ChefHat,
  Target,
  Lightbulb
} from 'lucide-react';
import VoiceAssistant from '@/components/VoiceAssistant';
import { FlavorRecommendationEngine, UserPreferences, EmotionAwareFoodEngine, EmotionState } from '@/utils/ai/flavorRecommendationEngine';
import { FoodImageRecognitionEngine } from '@/utils/ai/foodImageRecognition';
import { CulinaryChatbot } from '@/utils/ai/culinaryChatbot';
import { MultimodalSensoryPredictor, UserSensoryProfile } from '@/utils/ai/sensoryPredictor';
import { toast } from 'sonner';

const AIHub = () => {
  const [activeFeature, setActiveFeature] = useState('recommendations');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Initialize AI engines
  const userPreferences: UserPreferences = {
    favoriteIngredients: ['1', '2'], // strawberry, chocolate
    dislikedIngredients: [],
    dietaryRestrictions: [],
    preferredMoods: ['romantic', 'cozy'],
    spiceLevel: 'medium',
    sweetnessTolerance: 'high'
  };

  const userSensoryProfile: UserSensoryProfile = {
    tastePreferences: {
      sweet: 80,
      salty: 60,
      sour: 70,
      bitter: 40,
      umami: 65
    },
    smellSensitivity: {
      floral: 85,
      fruity: 90,
      spicy: 60,
      earthy: 50,
      woody: 55,
      herbal: 75,
      smoky: 45
    },
    texturePreferences: {
      crispy: 85,
      crunchy: 80,
      creamy: 90,
      smooth: 85,
      fizzy: 60,
      chewy: 50,
      tender: 80,
      juicy: 85
    },
    sensoryMemories: [],
    adaptationRate: 0.7
  };

  const recommendationEngine = new FlavorRecommendationEngine(userPreferences);
  const imageRecognition = new FoodImageRecognitionEngine();
  const chatbot = new CulinaryChatbot();
  const sensoryPredictor = new MultimodalSensoryPredictor(userSensoryProfile);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      toast.info('Analyzing your food image...');
      
      try {
        const results = await imageRecognition.recognizeFood(file);
        toast.success(`Identified: ${results[0]?.name || 'Unknown dish'}`);
      } catch (error) {
        toast.error('Failed to analyze image. Please try again.');
      }
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { type: 'user', content: chatInput, id: Date.now() };
    setChatMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await chatbot.processMessage(chatInput);
      const botMessage = { type: 'assistant', content: response.message, id: Date.now() + 1 };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error('Chatbot is temporarily unavailable');
    }
    
    setChatInput('');
  };

  const generateRecommendations = () => {
    const recommendations = recommendationEngine.generateRecommendations(3);
    toast.success(`Generated ${recommendations.length} personalized recommendations!`);
    return recommendations;
  };

  const getEmotionalRecommendations = () => {
    const emotionState: EmotionState = {
      mood: 'cozy',
      energy: 'medium',
      stress: 'low',
      social: 'intimate'
    };
    
    const recommendations = EmotionAwareFoodEngine.getEmotionalRecommendations(emotionState);
    toast.success('Generated mood-based recommendations!');
    return recommendations;
  };

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 font-heading">AI Culinary Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience the future of cooking with our advanced AI-powered features
        </p>
      </div>

      <Tabs value={activeFeature} onValueChange={setActiveFeature} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="recommendations" className="flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Image AI</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Chatbot</span>
          </TabsTrigger>
          <TabsTrigger value="sensory" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Sensory</span>
          </TabsTrigger>
          <TabsTrigger value="emotion" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Emotion</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-1">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Flavor Recommendation Engine
              </CardTitle>
              <CardDescription>
                Get personalized flavor combinations based on your preferences and ingredient profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Your Preferences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Romantic Moods</Badge>
                    <Badge variant="secondary">High Sweetness</Badge>
                    <Badge variant="secondary">Medium Spice</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Features
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Compatibility scoring</li>
                    <li>• Novelty detection</li>
                    <li>• Learning from feedback</li>
                  </ul>
                </div>
              </div>
              
              <Button onClick={generateRecommendations} className="w-full">
                Generate Smart Recommendations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Food Image Recognition
              </CardTitle>
              <CardDescription>
                Upload a food image to identify dishes and get recipes & nutrition info
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button variant="outline" className="mb-2">
                    Upload Food Image
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    AI will identify the dish and provide recipes & nutrition
                  </p>
                </label>
              </div>
              
              {imageFile && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium mb-2">Analyzing: {imageFile.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">🔍 Image Recognition</Badge>
                    <Badge variant="outline">📊 Nutrition Analysis</Badge>
                    <Badge variant="outline">👨‍🍳 Recipe Suggestions</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Culinary AI Chatbot
              </CardTitle>
              <CardDescription>
                Get cooking guidance, substitutions, and food-related answers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 border rounded-lg p-4 overflow-y-auto bg-muted/20">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <ChefHat className="h-12 w-12 mx-auto mb-4" />
                    <p>Ask me anything about cooking!</p>
                    <p className="text-xs mt-2">Try: "How do I substitute eggs?" or "What's the best way to cook chicken?"</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder="Ask about cooking, recipes, techniques..."
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button onClick={handleChatSubmit}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Multimodal Sensory Predictor
              </CardTitle>
              <CardDescription>
                Predict satisfaction by analyzing taste, smell, texture, and visual factors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">👅</div>
                  <div className="text-sm font-medium">Taste</div>
                  <div className="text-xs text-muted-foreground">Sweet, Salty, Sour</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">👃</div>
                  <div className="text-sm font-medium">Smell</div>
                  <div className="text-xs text-muted-foreground">Aromatic Profile</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">✋</div>
                  <div className="text-sm font-medium">Texture</div>
                  <div className="text-xs text-muted-foreground">Mouthfeel</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">👂</div>
                  <div className="text-sm font-medium">Sound</div>
                  <div className="text-xs text-muted-foreground">Auditory Cues</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-sm font-medium">Visual</div>
                  <div className="text-xs text-muted-foreground">Appearance</div>
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  AI Insights
                </h4>
                <p className="text-sm text-muted-foreground">
                  Our multimodal AI analyzes how different sensory elements work together to predict your satisfaction with a dish before you make it.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Emotion-Aware Food Engine
              </CardTitle>
              <CardDescription>
                Get food recommendations based on your current mood and emotional state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { emoji: '🥰', mood: 'Cozy', desc: 'Comfort foods' },
                  { emoji: '⚡', mood: 'Energizing', desc: 'Vibrant flavors' },
                  { emoji: '😌', mood: 'Calming', desc: 'Soothing dishes' },
                  { emoji: '💕', mood: 'Romantic', desc: 'Intimate dining' },
                  { emoji: '🌟', mood: 'Adventurous', desc: 'Bold combinations' },
                  { emoji: '🌊', mood: 'Refreshing', desc: 'Light & fresh' }
                ].map((item) => (
                  <div key={item.mood} className="text-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-sm font-medium">{item.mood}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
              
              <Button onClick={getEmotionalRecommendations} className="w-full">
                Get Mood-Based Recommendations
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <VoiceAssistant onCommand={(command) => toast.info(`Voice command: ${command}`)} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIHub;
