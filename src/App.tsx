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

// Protected route component with enhanced role checking
const ProtectedRoute = ({ 
  children,
  allowedRole
}: { 
  children: React.ReactNode,
  allowedRole?: string 
}) => {
  const { user, isLoading, profile } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-medical/10 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-medical mx-auto"></div>
          <div>
            <p className="text-medical font-bold text-xl">TERO</p>
            <p className="text-muted-foreground">Emergency Response Platform</p>
          </div>
          <div className="animate-pulse">
            <p className="text-sm text-muted-foreground">Initializing secure connection...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Enhanced role checking with better error handling
  if (allowedRole && profile?.role !== allowedRole) {
    console.log(`User role: ${profile?.role}, Required role: ${allowedRole}`);
    
    // Redirect hospital staff to hospital platform
    if (profile?.role === 'hospital') {
      return <Navigate to="/hospital-platform" replace />;
    }
    // Redirect paramedics to main dashboard
    if (profile?.role === 'paramedic') {
      return <Navigate to="/" replace />;
    }
    // If no valid role, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user, profile, isLoading } = useAuth();
  
  // Show enhanced loading screen while determining user role
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-medical/10 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical mx-auto mb-4"></div>
          <p className="text-medical font-medium">Loading TERO...</p>
          <p className="text-sm text-muted-foreground mt-2">Authenticating user access</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Auth routes with enhanced redirection */}
      <Route path="/login" element={
        user ? (
          profile?.role === 'hospital' ? 
            <Navigate to="/hospital-platform" replace /> : 
            <Navigate to="/" replace />
        ) : <Login />
      } />
      
      <Route path="/signup" element={
        user ? (
          profile?.role === 'hospital' ? 
            <Navigate to="/hospital-platform" replace /> : 
            <Navigate to="/" replace />
        ) : <Signup />
      } />
      
      {/* Paramedic routes with proper role protection */}
      <Route element={
        <ProtectedRoute allowedRole="paramedic">
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/disaster" element={<DisasterMode />} />
      </Route>
      
      {/* Hospital platform routes with enhanced protection */}
      <Route path="/hospital-platform/*" element={
        <ProtectedRoute allowedRole="hospital">
          <HospitalPlatform />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SidebarProvider>
                  <AppContent />
                </SidebarProvider>
              </BrowserRouter>
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
