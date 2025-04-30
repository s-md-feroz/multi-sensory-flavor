
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Sun, Moon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface NavLink {
  path: string;
  label: string;
}

// Update the nav links array to include the SensoryJournal page
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/flavor-builder', label: 'Flavor Builder' },
  { path: '/mood-board', label: 'Mood Board' },
  { path: '/challenges', label: 'Challenges' },
  { path: '/sensory-journal', label: 'Sensory Journal' }
];

const Navbar: React.FC = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="bg-background border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" className="text-lg font-bold">
        Sensory Alchemy
      </Link>

      <div className="hidden sm:flex items-center gap-4">
        {navLinks.map((link: NavLink) => (
          <Link key={link.path} to={link.path} className="text-sm hover:underline">
            {link.label}
          </Link>
        ))}
        <Toggle 
          pressed={theme === "dark"} 
          onPressedChange={toggleTheme}
          aria-label="Toggle theme"
          className="p-2"
        >
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Toggle>
      </div>

      <Sheet>
        <SheetTrigger className="sm:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Explore the Sensory Alchemy
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            {navLinks.map((link: NavLink) => (
              <Link key={link.path} to={link.path} className="text-sm hover:underline">
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-sm">Theme:</span>
              <Toggle 
                pressed={theme === "dark"} 
                onPressedChange={toggleTheme}
                aria-label="Toggle theme"
                className="p-2"
              >
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Toggle>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
