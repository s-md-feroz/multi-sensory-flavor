
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodFlavors from '@/components/MoodFlavors';
import FlavorTimeline from '@/components/FlavorTimeline';
import SpeechInput from '@/components/SpeechInput';
import MealScanner from '@/components/MealScanner';
import { FlavorExperience } from '@/utils/flavor/experiences';
import { Mic, Calendar, Heart, Camera, Share2, Globe, Music, Languages } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Define translations for different languages
const translations = {
  "English": {
    title: "Your Sensory Journal",
    description: "Capture, organize, and revisit your multisensory flavor experiences",
    timeline: "Timeline",
    mood: "Mood Flavors",
    speech: "Voice Log",
    scan: "Scan Meal",
    share: "Share",
    audioCues: "Audio Cues",
    languageOptions: "Language Options",
    languageDescription: "Log your sensory experiences in multiple languages"
  },
  "हिन्दी": {
    title: "आपकी संवेदी डायरी",
    description: "अपने बहुसंवेदी स्वाद अनुभवों को कैप्चर करें, व्यवस्थित करें और फिर से देखें",
    timeline: "टाइमलाइन",
    mood: "मूड फ्लेवर्स",
    speech: "वॉइस लॉग",
    scan: "भोजन स्कैन करें",
    share: "साझा करें",
    audioCues: "ऑडियो संकेत",
    languageOptions: "भाषा विकल्प",
    languageDescription: "कई भाषाओं में अपने संवेदी अनुभवों को लॉग करें"
  },
  "Español": {
    title: "Tu Diario Sensorial",
    description: "Captura, organiza y revive tus experiencias de sabor multisensoriales",
    timeline: "Cronología",
    mood: "Sabores de Humor",
    speech: "Registro de Voz",
    scan: "Escanear Comida",
    share: "Compartir",
    audioCues: "Señales de Audio",
    languageOptions: "Opciones de Idioma",
    languageDescription: "Registra tus experiencias sensoriales en varios idiomas"
  },
  "Français": {
    title: "Votre Journal Sensoriel",
    description: "Capturez, organisez et revisitez vos expériences gustatives multisensorielles",
    timeline: "Chronologie",
    mood: "Saveurs d'Humeur",
    speech: "Journal Vocal",
    scan: "Scanner le Repas",
    share: "Partager",
    audioCues: "Repères Audio",
    languageOptions: "Options de Langue",
    languageDescription: "Enregistrez vos expériences sensorielles dans plusieurs langues"
  },
  "日本語": {
    title: "あなたの感覚ジャーナル",
    description: "多感覚の味わい体験を記録し、整理し、再訪します",
    timeline: "タイムライン",
    mood: "ムードフレーバー",
    speech: "ボイスログ",
    scan: "食事をスキャン",
    share: "共有",
    audioCues: "オーディオキュー",
    languageOptions: "言語オプション",
    languageDescription: "複数の言語であなたの感覚体験を記録する"
  }
};

const SensoryJournal = () => {
  const [selectedExperience, setSelectedExperience] = useState<FlavorExperience | null>(null);
  const [selectedTab, setSelectedTab] = useState("timeline");
  const [currentLanguage, setCurrentLanguage] = useState("English");

  // Get translations for the current language
  const t = translations[currentLanguage as keyof typeof translations] || translations.English;

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

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    toast.info(`Switched to ${language}`);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2 font-heading text-center">{t.title}</h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-center mb-8">
        {t.description}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <TabsList className="grid grid-cols-4 md:w-[600px] mb-6">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {t.timeline}
              </TabsTrigger>
              <TabsTrigger value="mood" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> {t.mood}
              </TabsTrigger>
              <TabsTrigger value="speech" className="flex items-center gap-2">
                <Mic className="h-4 w-4" /> {t.speech}
              </TabsTrigger>
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> {t.scan}
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
                    <Share2 size={16} /> {t.share}
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      // This would trigger audio cues in a real implementation
                      toast.info("Playing audio cues to enhance memory recall...");
                    }}
                  >
                    <Music size={16} /> {t.audioCues}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          <MoodFlavors />
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-3">{t.languageOptions}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t.languageDescription}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={currentLanguage === "English" ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => handleLanguageChange("English")}
                >
                  <Languages size={16} /> English
                </Button>
                <Button 
                  variant={currentLanguage === "Español" ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => handleLanguageChange("Español")}
                >
                  <Languages size={16} /> Español
                </Button>
                <Button 
                  variant={currentLanguage === "Français" ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => handleLanguageChange("Français")}
                >
                  <Languages size={16} /> Français
                </Button>
                <Button 
                  variant={currentLanguage === "日本語" ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => handleLanguageChange("日本語")}
                >
                  <Languages size={16} /> 日本語
                </Button>
                <Button 
                  variant={currentLanguage === "हिन्दी" ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => handleLanguageChange("हिन्दी")}
                >
                  <Languages size={16} /> हिन्दी
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
