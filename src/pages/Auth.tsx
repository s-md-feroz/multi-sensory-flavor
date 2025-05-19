
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateIn(true);
  }, []);
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Successfully signed up! Please check your email for a confirmation link.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-16rem)] px-4">
      <Card 
        className={cn(
          "w-full max-w-md transition-all duration-500 ease-out transform", 
          animateIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95",
          "bg-gradient-to-br from-background to-card border border-border/50 shadow-lg"
        )}
      >
        <CardHeader className={cn(
          "text-center transition-opacity duration-700 delay-300",
          animateIn ? "opacity-100" : "opacity-0"
        )}>
          <CardTitle className="text-2xl font-bold">Welcome to Sensory Alchemy</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <Tabs 
          defaultValue="login" 
          className="w-full"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className={cn(
            "grid grid-cols-2 mb-4 mx-6 transition-all duration-500 delay-400",
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}>
            <TabsTrigger 
              value="login"
              className="relative transition-all duration-300 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-primary data-[state=active]:after:transform data-[state=active]:after:origin-center"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="relative transition-all duration-300 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-primary data-[state=active]:after:transform data-[state=active]:after:origin-center"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          <CardContent className={cn(
            "transition-all duration-500 delay-500", 
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <TabsContent value="login" className="transition-all duration-300 pt-1">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2 transition-all duration-300 hover:translate-y-[-2px]">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-300 border-border/50 focus:border-primary/70 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-2 transition-all duration-300 hover:translate-y-[-2px]">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 transition-all duration-300 border-border/50 focus:border-primary/70 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-md" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="transition-all duration-300 pt-1">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2 transition-all duration-300 hover:translate-y-[-2px]">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="transition-all duration-300 border-border/50 focus:border-primary/70 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-2 transition-all duration-300 hover:translate-y-[-2px]">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-all duration-300 border-border/50 focus:border-primary/70 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-2 transition-all duration-300 hover:translate-y-[-2px]">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10 transition-all duration-300 border-border/50 focus:border-primary/70 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-md" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
          <CardFooter className={cn(
            "flex flex-col space-y-4 transition-opacity duration-700 delay-600",
            animateIn ? "opacity-100" : "opacity-0"
          )}>
            <div className="text-sm text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
