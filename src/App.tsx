
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

// Simple loading component
const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-blue-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ 
  children,
  allowedRole
}: { 
  children: React.ReactNode,
  allowedRole?: string 
}) => {
  const { user, isLoading, profile } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based redirection
  if (allowedRole && profile?.role !== allowedRole) {
    if (profile?.role === 'hospital') {
      return <Navigate to="/hospital-platform" replace />;
    }
    if (profile?.role === 'paramedic') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      {/* Auth routes */}
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
      
      {/* Paramedic routes */}
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
      
      {/* Hospital platform routes */}
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
