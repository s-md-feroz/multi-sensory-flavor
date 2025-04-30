
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoodCategory } from '@/utils/flavor';
import { Candy, Lollipop, Cookie, CandyOff } from 'lucide-react';

// Floating animation components
const FloatingElement = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`animate-float ${className}`}>
    {children}
  </div>
);

const FloatingElementSlow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`animate-float-slow ${className}`}>
    {children}
  </div>
);

// Quiz component for "What's Your Flavor Mood Today?"
const FlavorMoodQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  
  const questions = [
    {
      question: "What are you in the mood for today?",
      options: [
        { text: "Something comforting", mood: 'cozy' as MoodCategory },
        { text: "Something exciting", mood: 'adventurous' as MoodCategory },
        { text: "Something soothing", mood: 'calming' as MoodCategory },
        { text: "Something invigorating", mood: 'energizing' as MoodCategory }
      ]
    },
    {
      question: "Pick your ideal weather:",
      options: [
        { text: "Rainy day", mood: 'cozy' as MoodCategory },
        { text: "Sunny and warm", mood: 'energizing' as MoodCategory },
        { text: "Cool breeze", mood: 'refreshing' as MoodCategory },
        { text: "Sunset glow", mood: 'romantic' as MoodCategory }
      ]
    },
    {
      question: "Choose your sensory preference:",
      options: [
        { text: "Rich aromas", mood: 'cozy' as MoodCategory },
        { text: "Bold textures", mood: 'adventurous' as MoodCategory },
        { text: "Vibrant visuals", mood: 'energizing' as MoodCategory },
        { text: "Delicate tastes", mood: 'romantic' as MoodCategory }
      ]
    }
  ];
  
  const handleSelectOption = (mood: MoodCategory) => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSelectedMood(mood);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedMood(null);
  };
  
  return (
    <Card className="glass-effect w-full max-w-md">
      <CardContent className="p-6">
        <h3 className="font-heading text-xl font-bold mb-4 text-center">
          What's Your Flavor Mood Today?
        </h3>
        
        {selectedMood ? (
          <div className="text-center">
            <div className="mb-4 p-4 rounded-full bg-flavor-lavender inline-flex">
              <CandyOff className="h-8 w-8 text-flavor-purple" />
            </div>
            <h4 className="text-lg font-bold mb-2">
              Your flavor mood is: <span className="text-flavor-purple">{selectedMood}</span>
            </h4>
            <p className="mb-4">
              {selectedMood === 'cozy' && "You're craving comfort and warmth! Try ingredients like cinnamon, honey, and vanilla."}
              {selectedMood === 'adventurous' && "You're looking for excitement! Experiment with chili, lime, and surprising textures."}
              {selectedMood === 'refreshing' && "You need a burst of freshness! Consider mint, citrus, and light, crisp textures."}
              {selectedMood === 'romantic' && "You're in the mood for indulgence! Explore chocolate, berries, and creamy textures."}
              {selectedMood === 'energizing' && "You need a pick-me-up! Try bright flavors like ginger, citrus, and crunchy textures."}
              {selectedMood === 'calming' && "You're seeking tranquility! Consider lavender, chamomile, and smooth, flowing textures."}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRestart} variant="outline">
                Start Over
              </Button>
              <Button asChild>
                <Link to={`/challenges?mood=${selectedMood}`}>
                  Try a {selectedMood} Challenge
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <h4 className="text-lg font-bold">{questions[currentQuestion].question}</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.mood)}
                  className="p-3 border rounded-lg hover:bg-primary/10 transition-colors"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Home = () => {
  return (
    <div className="animated-gradient">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center px-6 py-20 overflow-hidden">
        {/* Floating elements in background */}
        <FloatingElement className="absolute top-[15%] left-[10%]">
          <div className="bg-flavor-mint rounded-full w-16 h-16 opacity-60" />
        </FloatingElement>
        
        <FloatingElementSlow className="absolute bottom-[20%] left-[15%]">
          <div className="bg-flavor-lavender rounded-full w-24 h-24 opacity-60" />
        </FloatingElementSlow>
        
        <FloatingElement className="absolute top-[30%] right-[15%]">
          <div className="bg-flavor-peach rounded-full w-20 h-20 opacity-60" />
        </FloatingElement>
        
        <FloatingElementSlow className="absolute bottom-[30%] right-[10%]">
          <div className="bg-flavor-yellow rounded-full w-16 h-16 opacity-60" />
        </FloatingElementSlow>
        
        {/* Hero content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-heading font-bold mb-6 leading-tight">
              Taste Beyond Taste – Create Flavor with All Your Senses
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Explore a multisensory approach to flavor – where taste, smell, texture, sound, and visuals combine to create unforgettable culinary experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-flavor-purple hover:bg-flavor-purple/90">
                <Link to="/flavor-builder">
                  Start Creating Flavors
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/challenges">
                  Try a Flavor Challenge
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 rounded-full glass-effect flex items-center justify-center">
                <div className="animate-pulse-gentle">
                  <Lollipop className="w-32 h-32 text-flavor-orange" />
                </div>
              </div>
              
              <FloatingElementSlow className="absolute -top-5 -right-5">
                <div className="rounded-full bg-flavor-pink p-3">
                  <Candy className="h-6 w-6 text-white" />
                </div>
              </FloatingElementSlow>
              
              <FloatingElement className="absolute -bottom-5 -left-5">
                <div className="rounded-full bg-flavor-blue p-3">
                  <Cookie className="h-6 w-6 text-white" />
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            The Science of Multisensory Flavor
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Flavor isn't just taste – it's a complex interplay of all five senses that creates a complete experience
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Taste & Smell",
                icon: <div className="rounded-full bg-flavor-lavender p-4"><Candy className="h-8 w-8 text-flavor-purple" /></div>,
                description: "Your taste buds detect only five basic tastes, while your nose can distinguish thousands of aromas that create flavor complexity."
              },
              {
                title: "Texture & Sound",
                icon: <div className="rounded-full bg-flavor-mint p-4"><Cookie className="h-8 w-8 text-green-600" /></div>,
                description: "The crunch of a potato chip or the fizz of soda creates auditory and tactile sensations that enhance flavor perception."
              },
              {
                title: "Visual Cues",
                icon: <div className="rounded-full bg-flavor-peach p-4"><Lollipop className="h-8 w-8 text-flavor-orange" /></div>,
                description: "Color and presentation set expectations and influence how we experience taste – we eat first with our eyes."
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-heading font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Quiz Section */}
      <section className="px-6 py-16 bg-flavor-lavender/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Discover Your Flavor Profile
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take our quick quiz to find your flavor mood and get personalized recommendations
            </p>
          </div>
          
          <div className="flex justify-center">
            <FlavorMoodQuiz />
          </div>
        </div>
      </section>
      
      {/* Features Preview */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Tools to Enhance Your Sensory Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our suite of interactive features designed to revolutionize how you think about flavor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Flavor Builder",
                icon: <Candy className="h-10 w-10 text-flavor-purple" />,
                description: "Mix and match ingredients across different sensory categories to create unique flavor profiles",
                link: "/flavor-builder"
              },
              {
                title: "Mood Board",
                icon: <Cookie className="h-10 w-10 text-green-600" />,
                description: "Save and organize your favorite flavor combinations with notes, images, and sensory elements",
                link: "/mood-board"
              },
              {
                title: "Flavor Challenges",
                icon: <Lollipop className="h-10 w-10 text-flavor-orange" />,
                description: "Take on curated challenges to expand your flavor repertoire and sensory awareness",
                link: "/challenges"
              }
            ].map((feature, idx) => (
              <Card key={idx} className="overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4 inline-flex">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button asChild variant="outline">
                    <Link to={feature.link}>Explore {feature.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="px-6 py-16 bg-gradient-to-r from-flavor-purple/20 to-flavor-orange/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Weekly Flavor Experiments and Sensory Tips
          </h2>
          <p className="text-lg mb-6">
            Join our newsletter for the latest multisensory flavor discoveries, tips, and creative challenges
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-md border flex-grow"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
