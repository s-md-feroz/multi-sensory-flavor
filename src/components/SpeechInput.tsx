
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Save, AlertTriangle } from 'lucide-react';
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
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Check if browser supports the Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      console.error('Speech recognition not supported in this browser.');
    }
  }, []);

  const startListening = () => {
    if (!speechSupported) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.info("Listening to your flavor description...");
    };

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      
      if (result.isFinal) {
        const finalTranscript = result[0].transcript;
        setTranscript(prevTranscript => prevTranscript + ' ' + finalTranscript);
        
        // Enhanced analysis with the parseSpeechInput function
        const parsed = parseSpeechInput(finalTranscript);
        setParsedData(prev => ({
          mood: parsed.mood || prev?.mood,
          ingredients: [...(prev?.ingredients || []), ...parsed.ingredients],
          notes: (prev?.notes || '') + ' ' + parsed.notes
        }));
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error("Microphone access was denied. Please allow access to use voice input.");
      } else {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        setIsListening(false);
        toast.success("Speech capture complete!");
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
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
          Describe your flavor experience by voice or text. Our AI system will analyze your description to
          identify ingredients, mood, and context.
        </p>
        
        <div className="mb-4">
          {!speechSupported ? (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-md border border-destructive/30 mb-4">
              <AlertTriangle size={16} className="text-destructive" />
              <p className="text-sm text-destructive">
                Speech recognition is not supported in your browser. Please use text input instead.
              </p>
            </div>
          ) : (
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
          )}
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
            <h3 className="text-sm font-medium mb-2">AI-Detected Elements:</h3>
            
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
