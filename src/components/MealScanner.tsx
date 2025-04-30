
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Camera, ImageIcon, Scan, X } from 'lucide-react';
import { matchImageToExperience, FlavorExperience } from '@/utils/flavor/experiences';
import { ingredients } from '@/utils/flavor/ingredients';
import { Badge } from '@/components/ui/badge';

interface MealScannerProps {
  onMatch?: (experience: FlavorExperience) => void;
}

const MealScanner: React.FC<MealScannerProps> = ({ onMatch }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [matchedExperience, setMatchedExperience] = useState<FlavorExperience | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const activateCamera = async () => {
    try {
      // This is a placeholder - in a real implementation, we would use the Web Media API
      setIsCameraActive(true);
      toast.info("Camera activated! Position your meal in the frame.");
    } catch (error) {
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    // Cleanup camera stream
    if (isCameraActive && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    // In a real application, we would capture from video stream
    // Here we'll simulate by using a placeholder image URL
    const simulatedImageData = "data:image/jpeg;base64,/9j/example-base64-data";
    setCapturedImage(simulatedImageData);
    setIsCameraActive(false);
    toast.success("Image captured!");
  };
  
  const scanImage = () => {
    if (!capturedImage) return;
    
    toast.info("Analyzing image...");
    
    // Simulate an API call with a delay
    setTimeout(() => {
      const match = matchImageToExperience(capturedImage);
      setMatchedExperience(match);
      
      if (match && onMatch) {
        onMatch(match);
      }
      
      toast.success("Match found! This reminds you of a previous flavor experience.");
    }, 1500);
  };
  
  const resetScanner = () => {
    setCapturedImage(null);
    setMatchedExperience(null);
  };

  // Get ingredient names by ID
  const getIngredientName = (id: string): string => {
    const ingredient = ingredients.find(ing => ing.id === id);
    return ingredient ? ingredient.name : 'Unknown Ingredient';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Scan Your Meal</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Take a photo of your meal to find similar flavor experiences or discover new combinations.
        </p>
        
        <div className="aspect-video relative mb-4 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          {isCameraActive ? (
            <>
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button variant="default" className="shadow-lg" onClick={captureImage}>
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img 
                src="/placeholder.svg" // Using placeholder for demo
                alt="Captured meal" 
                className="w-full h-full object-cover"
              />
              <Button 
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-background/80"
                onClick={resetScanner}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="text-center p-4">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No image captured</p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="flex gap-2">
          {!isCameraActive && !capturedImage && (
            <Button 
              variant="default" 
              className="flex-1"
              onClick={activateCamera}
            >
              <Camera className="h-4 w-4 mr-2" /> Activate Camera
            </Button>
          )}
          
          {isCameraActive && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={stopCamera}
            >
              Cancel
            </Button>
          )}
          
          {capturedImage && !matchedExperience && (
            <Button 
              variant="default" 
              className="flex-1"
              onClick={scanImage}
            >
              <Scan className="h-4 w-4 mr-2" /> Analyze Image
            </Button>
          )}
        </div>
        
        {matchedExperience && (
          <div className="mt-4 bg-muted/20 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Match Found:</h3>
            <p className="text-sm mb-2">{matchedExperience.title}</p>
            <p className="text-xs text-muted-foreground mb-2">
              {matchedExperience.description}
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge>{matchedExperience.mood}</Badge>
              {matchedExperience.ingredients.map(id => (
                <Badge key={id} variant="outline" className="bg-primary/10">
                  {getIngredientName(id)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealScanner;
