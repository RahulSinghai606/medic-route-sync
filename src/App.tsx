
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from './contexts/LanguageContext';

// Layouts
import AppLayout from "./components/Layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Assessment from "./pages/Assessment";
import Hospitals from "./pages/Hospitals";
import Cases from "./pages/Cases";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import DisasterMode from "./components/DisasterManagement/DisasterMode";
import HospitalPlatform from "./pages/HospitalPlatform";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/disaster" element={<DisasterMode />} />
        <Route path="/hospital-platform" element={<HospitalPlatform />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ThemeProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SidebarProvider>
                  <AppRoutes />
                </SidebarProvider>
              </BrowserRouter>
            </ThemeProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
