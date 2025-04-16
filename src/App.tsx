
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Workouts from "@/pages/Workouts";
import Goals from "@/pages/Goals";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen relative">
          <Navbar />
          <Sidebar />
          <div className="pl-0 md:pl-64 pt-16">
            <main className="container py-6 max-w-7xl">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/profile" element={<Profile />} />
                {/* Add these routes later as needed */}
                <Route path="/workouts/add" element={<Navigate to="/workouts" />} />
                <Route path="/workouts/:id" element={<Navigate to="/workouts" />} />
                <Route path="/goals/add" element={<Navigate to="/goals" />} />
                <Route path="/goals/:id" element={<Navigate to="/goals" />} />
                <Route path="/history" element={<Navigate to="/" />} />
                <Route path="/progress" element={<Navigate to="/" />} />
                <Route path="/settings" element={<Navigate to="/profile" />} />
                {/* Catch-all route for 404s */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
