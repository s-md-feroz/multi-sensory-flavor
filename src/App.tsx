
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import FlavorBuilder from "./pages/FlavorBuilder";
import MoodBoard from "./pages/MoodBoard";
import Challenges from "./pages/Challenges";
import SensoryJournal from "./pages/SensoryJournal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flavor-builder" element={<FlavorBuilder />} />
            <Route path="/mood-board" element={<MoodBoard />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/sensory-journal" element={<SensoryJournal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
