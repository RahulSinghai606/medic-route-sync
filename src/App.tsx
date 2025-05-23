
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

// Protected route component with role checking
const ProtectedRoute = ({ 
  children,
  allowedRole
}: { 
  children: React.ReactNode,
  allowedRole?: string 
}) => {
  const { user, isLoading, profile } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and the user doesn't have it
  if (allowedRole && profile?.role !== allowedRole) {
    // Redirect hospital staff to hospital platform
    if (profile?.role === 'hospital') {
      return <Navigate to="/hospital-platform" />;
    }
    // Redirect paramedics to main dashboard
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile, isLoading } = useAuth();
  
  // Show loading screen while determining user role
  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={
        user ? (
          profile?.role === 'hospital' ? 
            <Navigate to="/hospital-platform" /> : 
            <Navigate to="/" />
        ) : <Login />
      } />
      
      <Route path="/signup" element={
        user ? (
          profile?.role === 'hospital' ? 
            <Navigate to="/hospital-platform" /> : 
            <Navigate to="/" />
        ) : <Signup />
      } />
      
      {/* Paramedic routes - Explicitly set role check */}
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
      
      {/* Hospital platform routes - completely separate from paramedic routes with explicit role check */}
      <Route path="/hospital-platform" element={
        <ProtectedRoute allowedRole="hospital">
          <HospitalPlatform />
        </ProtectedRoute>
      } />
      
      <Route path="/hospital-platform/*" element={
        <ProtectedRoute allowedRole="hospital">
          <HospitalPlatform />
        </ProtectedRoute>
      } />
      
      {/* Root redirect based on user role */}
      <Route path="/" element={
        !user ? <Navigate to="/login" /> : 
        profile?.role === 'hospital' ? <Navigate to="/hospital-platform" /> : 
        <Navigate to="/" />
      } />
      
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
