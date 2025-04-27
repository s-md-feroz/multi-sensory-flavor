
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CandyOff, Cherry, Lollipop, Cookie } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Home", path: "/", icon: <Cherry className="h-5 w-5" /> },
    { name: "Flavor Builder", path: "/flavor-builder", icon: <Lollipop className="h-5 w-5" /> },
    { name: "Mood Board", path: "/mood-board", icon: <Cookie className="h-5 w-5" /> },
    { name: "Challenges", path: "/challenges", icon: <CandyOff className="h-5 w-5" /> },
  ];

  return (
    <nav className="py-4 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-flavor-purple text-white p-2 rounded-full">
            <Lollipop className="h-6 w-6" />
          </div>
          <span className="text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-flavor-purple to-flavor-orange">
            SensoryFlavor
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link to={item.path} key={item.name}>
              <Button 
                variant={location.pathname === item.path ? "default" : "ghost"} 
                className="flex gap-2 items-center"
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-lg z-20">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link 
                to={item.path} 
                key={item.name}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button 
                  variant={location.pathname === item.path ? "default" : "ghost"} 
                  className="w-full justify-start gap-2"
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
