
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-slate-200 py-6 px-6 bg-white/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-heading font-bold text-lg mb-2">SensoryFlavor</h3>
            <p className="text-muted-foreground mb-4">Taste Beyond Taste – Create Flavor with All Your Senses.</p>
            <div className="flex items-center gap-4">
              {/* Social icons would go here */}
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-2">Links</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/flavor-builder" className="text-muted-foreground hover:text-primary transition-colors">Flavor Builder</Link></li>
              <li><Link to="/mood-board" className="text-muted-foreground hover:text-primary transition-colors">Mood Board</Link></li>
              <li><Link to="/challenges" className="text-muted-foreground hover:text-primary transition-colors">Challenges</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-2">Newsletter</h4>
            <p className="text-muted-foreground mb-2 text-sm">Weekly Flavor Experiments and Sensory Tips</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md border bg-background flex-grow text-sm"
              />
              <button type="submit" className="bg-primary text-white px-3 py-2 rounded-md text-sm">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
