
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider: Starting initialization');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id || 'No user');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Create a basic profile if user exists
          setProfile({
            id: currentSession.user.id,
            role: currentSession.user.user_metadata?.role || 'paramedic',
            full_name: currentSession.user.user_metadata?.full_name || currentSession.user.email,
            ambulance_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session:', initialSession?.user?.id || 'No session');
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          setProfile({
            id: initialSession.user.id,
            role: initialSession.user.user_metadata?.role || 'paramedic',
            full_name: initialSession.user.user_metadata?.full_name || initialSession.user.email,
            ambulance_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string = 'paramedic') => {
    try {
      console.log(`Signing up with role: ${role}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error("Signup error:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration successful",
          description: data?.user?.email_confirmed_at ? 
            "You can now sign in with your credentials" : 
            "Please check your email to confirm your account",
        });
      }
      
      return { error };
    } catch (error: any) {
      console.error("Signup exception:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string, role?: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
        return { error };
      } else {
        console.log('Login successful, user:', data.user?.id);
        toast({
          title: "Login successful",
          description: `Welcome back to TERO!`,
        });
        
        // Redirect based on role
        setTimeout(() => {
          const userRole = data.user?.user_metadata?.role || role || 'paramedic';
          if (userRole === 'hospital') {
            window.location.href = '/hospital-platform';
          } else {
            window.location.href = '/';
          }
        }, 100);
      }
      
      return { error };
    } catch (error: any) {
      console.error('Login exception:', error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    window.location.href = '/login';
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user?.id) {
        return { error: new Error('No user ID available') };
      }
      
      // Just update local state for now
      setProfile(prevProfile => ({ ...prevProfile, ...data }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Exception updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
