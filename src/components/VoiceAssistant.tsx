
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceCommand {
  command: string;
  response: string;
  action?: () => void;
}

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      synthesisRef.current = speechSynthesis;
      
      // Configure speech recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice recognition error. Please try again.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      toast.error('Voice commands are not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
      toast.info('Listening for your command...');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthesisRef.current && text) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Speech synthesis error');
      };

      setIsSpeaking(true);
      synthesisRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    setLastCommand(command);
    
    // Define cooking-related voice commands
    const commands: VoiceCommand[] = [
      {
        command: 'set timer',
        response: 'Timer set! I\'ll let you know when time is up.',
        action: () => setTimer(lowerCommand)
      },
      {
        command: 'how long',
        response: 'Cooking times vary by ingredient. For most vegetables, 5-7 minutes. For proteins, use a thermometer for safety.',
        action: () => provideCookingTime(lowerCommand)
      },
      {
        command: 'what temperature',
        response: 'For food safety, chicken should reach 165°F, beef 145°F for medium-rare, and fish 145°F.',
        action: () => provideTemperature(lowerCommand)
      },
      {
        command: 'help',
        response: 'I can help you with cooking times, temperatures, techniques, and ingredient substitutions. Just ask!',
      },
      {
        command: 'substitute',
        response: 'Tell me what ingredient you need to substitute, and I\'ll suggest alternatives.',
        action: () => handleSubstitution(lowerCommand)
      },
      {
        command: 'technique',
        response: 'I can guide you through various cooking techniques. What would you like to learn?',
        action: () => handleTechnique(lowerCommand)
      },
      {
        command: 'recipe',
        response: 'I can suggest recipes based on your ingredients. What do you have available?',
        action: () => handleRecipe(lowerCommand)
      },
      {
        command: 'next step',
        response: 'Moving to the next step in your recipe. Keep going, you\'re doing great!',
        action: () => handleNextStep()
      }
    ];

    // Find matching command
    const matchedCommand = commands.find(cmd => 
      lowerCommand.includes(cmd.command) || 
      cmd.command.split(' ').every(word => lowerCommand.includes(word))
    );

    if (matchedCommand) {
      speak(matchedCommand.response);
      if (matchedCommand.action) {
        matchedCommand.action();
      }
    } else {
      // Fallback response
      const fallbackResponse = `I heard "${command}". I can help with cooking times, temperatures, techniques, and recipes. What would you like to know?`;
      speak(fallbackResponse);
    }

    // Callback to parent component
    if (onCommand) {
      onCommand(command);
    }
  };

  const setTimer = (command: string) => {
    const timeMatch = command.match(/(\d+)\s*(minute|second|hour)/i);
    if (timeMatch) {
      const duration = parseInt(timeMatch[1]);
      const unit = timeMatch[2].toLowerCase();
      
      let milliseconds = 0;
      switch (unit) {
        case 'second':
          milliseconds = duration * 1000;
          break;
        case 'minute':
          milliseconds = duration * 60 * 1000;
          break;
        case 'hour':
          milliseconds = duration * 60 * 60 * 1000;
          break;
      }
      
      setTimeout(() => {
        speak(`Time's up! Your ${duration} ${unit} timer has finished.`);
        toast.success(`Timer finished: ${duration} ${unit}(s)`);
      }, milliseconds);
      
      toast.success(`Timer set for ${duration} ${unit}(s)`);
    }
  };

  const provideCookingTime = (command: string) => {
    const ingredients = ['chicken', 'beef', 'fish', 'vegetables', 'pasta', 'rice'];
    const mentioned = ingredients.find(ing => command.includes(ing));
    
    if (mentioned) {
      const times = {
        chicken: '20-25 minutes for breast, 30-35 for thighs',
        beef: '3-4 minutes per side for medium-rare steak',
        fish: '10 minutes per inch of thickness',
        vegetables: '5-7 minutes for most vegetables',
        pasta: 'Check package instructions, usually 8-12 minutes',
        rice: '18-20 minutes for white rice, 45 minutes for brown rice'
      };
      
      speak(`For ${mentioned}: ${times[mentioned]}`);
    }
  };

  const provideTemperature = (command: string) => {
    const proteins = ['chicken', 'beef', 'pork', 'fish'];
    const mentioned = proteins.find(protein => command.includes(protein));
    
    if (mentioned) {
      const temps = {
        chicken: '165°F internal temperature',
        beef: '145°F for medium-rare, 160°F for medium',
        pork: '145°F internal temperature',
        fish: '145°F internal temperature'
      };
      
      speak(`${mentioned} should reach ${temps[mentioned]}`);
    }
  };

  const handleSubstitution = (command: string) => {
    // This would integrate with your ingredient substitution system
    speak('What ingredient would you like to substitute?');
  };

  const handleTechnique = (command: string) => {
    // This would provide cooking technique guidance
    speak('I can guide you through sautéing, roasting, grilling, or braising. Which technique interests you?');
  };

  const handleRecipe = (command: string) => {
    // This would integrate with your recipe system
    speak('I can suggest recipes based on your available ingredients. What do you have in your kitchen?');
  };

  const handleNextStep = () => {
    // This would progress through recipe steps
    speak('Great job! Continue with the next step in your recipe.');
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicOff className="h-5 w-5" />
            Voice Assistant Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Voice commands are not supported in this browser. Please use a modern browser with speech recognition support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Kitchen Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : () => speak('Hello! I\'m your kitchen assistant.')}
            variant={isSpeaking ? "secondary" : "outline"}
            className="flex items-center gap-2"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? 'Stop Speaking' : 'Test Voice'}
          </Button>
        </div>

        {isListening && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Listening...</p>
            <Badge variant="secondary" className="animate-pulse">
              🎤 Voice Active
            </Badge>
          </div>
        )}

        {transcript && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">You said:</p>
            <p className="font-medium">{transcript}</p>
          </div>
        )}

        {lastCommand && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 mb-1">Last Command:</p>
            <p className="font-medium text-green-800">{lastCommand}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Voice Commands:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>"Set timer for 10 minutes"</li>
            <li>"How long to cook chicken?"</li>
            <li>"What temperature for beef?"</li>
            <li>"Help with substitutions"</li>
            <li>"Show me cooking techniques"</li>
            <li>"Suggest a recipe"</li>
            <li>"Next step"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;
