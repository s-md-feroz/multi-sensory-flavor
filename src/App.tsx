
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import FlavorBuilder from "./pages/FlavorBuilder";
import MoodBoard from "./pages/MoodBoard";
import Challenges from "./pages/Challenges";
import SensoryJournal from "./pages/SensoryJournal";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class">
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/flavor-builder" element={
                    <RequireAuth>
                      <FlavorBuilder />
                    </RequireAuth>
                  } />
                  <Route path="/mood-board" element={
                    <RequireAuth>
                      <MoodBoard />
                    </RequireAuth>
                  } />
                  <Route path="/challenges" element={
                    <RequireAuth>
                      <Challenges />
                    </RequireAuth>
                  } />
                  <Route path="/sensory-journal" element={
                    <RequireAuth>
                      <SensoryJournal />
                    </RequireAuth>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
