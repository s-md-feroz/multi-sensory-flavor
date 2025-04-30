import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Save } from 'lucide-react';
import { parseSpeechInput } from '@/utils/flavor/experiences';
import { toast } from 'sonner';
import { ingredients } from '@/utils/flavor/ingredients';
import { Badge } from '@/components/ui/badge';

interface SpeechInputProps {
  onSave?: (data: {
    notes: string;
    ingredients: string[];
    mood?: string;
  }) => void;
}

const SpeechInput: React.FC<SpeechInputProps> = ({ onSave }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedData, setParsedData] = useState<{
    mood?: string;
    ingredients: string[];
    notes: string;
  } | null>(null);

  const startListening = () => {
    // This is a placeholder - in a real implementation, we would use the Web Speech API
    setIsListening(true);
    toast.info("Listening to your flavor description...");
    
    // Simulate speech recognition after a delay
    setTimeout(() => {
      stopListening();
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    // Simulate received transcript
    const simulatedTranscript = "I had a refreshing lime drink with basil that was so energizing on a hot day";
    setTranscript(simulatedTranscript);
    
    // Parse the transcript
    const parsed = parseSpeechInput(simulatedTranscript);
    setParsedData(parsed);
    
    toast.success("Speech captured successfully!");
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    // Parse when user stops typing
    clearTimeout((window as any).parseTimeout);
    (window as any).parseTimeout = setTimeout(() => {
      const parsed = parseSpeechInput(e.target.value);
      setParsedData(parsed);
    }, 1000);
  };

  const handleSave = () => {
    if (parsedData && onSave) {
      onSave(parsedData);
      toast.success("Flavor experience saved!");
      setTranscript('');
      setParsedData(null);
    }
  };

  // Get ingredient names by ID
  const getIngredientName = (id: string): string => {
    const ingredient = ingredients.find(ing => ing.id === id);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Voice Your Flavor Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Describe your flavor experience by voice or text. Our system will analyze your description to
          identify ingredients, mood, and context.
        </p>
        
        <div className="mb-4">
          <Button 
            variant={isListening ? "destructive" : "default"}
            onClick={isListening ? stopListening : startListening}
            className="w-full flex items-center justify-center gap-2"
          >
            {isListening ? (
              <>
                <MicOff size={16} /> Stop Recording
              </>
            ) : (
              <>
                <Mic size={16} /> Start Recording
              </>
            )}
          </Button>
        </div>
        
        <div className="mb-4">
          <Textarea
            placeholder="Or type your flavor experience here..."
            value={transcript}
            onChange={handleManualInput}
            className="h-24"
          />
        </div>

        {parsedData && (
          <div className="bg-muted/20 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium mb-2">Detected Elements:</h3>
            
            {parsedData.mood && (
              <div className="mb-2">
                <span className="text-sm font-medium">Mood:</span> 
                <Badge className="ml-2">{parsedData.mood}</Badge>
              </div>
            )}
            
            {parsedData.ingredients.length > 0 && (
              <div className="mb-2">
                <span className="text-sm font-medium">Ingredients:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {parsedData.ingredients.map(id => (
                    <Badge key={id} variant="outline" className="bg-primary/10">
                      {getIngredientName(id)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-3">
              <Button onClick={handleSave} className="w-full flex items-center justify-center gap-2">
                <Save size={16} /> Save Experience
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Tip: Be descriptive about the flavors, how they made you feel, and the context in which you experienced them.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeechInput;
