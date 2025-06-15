
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
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Add a small delay to prevent potential race conditions
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        console.log('Profile data retrieved:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Enhanced signUp function that properly sets the user role
  const signUp = async (email: string, password: string, fullName: string, role: string = 'paramedic') => {
    try {
      // Clean up auth state to prevent any lingering tokens
      cleanupAuthState();
      
      // Try to sign out any existing session globally
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      console.log(`Signing up with role: ${role}`);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create a profile record with the specified role immediately after signup
        // This ensures the role is stored in the database
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: userData.user.id,
              full_name: fullName,
              role: role,
            });
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
            toast({
              title: "Profile creation failed",
              description: "Your account was created but profile setup failed.",
              variant: "destructive",
            });
          }
        }
        
        toast({
          title: "Registration successful",
          description: "Please check your email to confirm your account",
        });
      }
      
      return { error };
    } catch (error: any) {
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
      // Clean up auth state to prevent any lingering tokens
      cleanupAuthState();
      
      // Try to sign out any existing session globally
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      } else {
        // If role is provided during login, ensure the user profile has this role
        if (role) {
          await updateProfile({ role });
        }
        
        // Force fetch the updated profile
        const { data: user } = await supabase.auth.getUser();
        if (user) {
          await fetchProfile(user.user.id);
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back to TERO!",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const signOut = async () => {
    // Clean up auth state from localStorage for a more reliable logout
    cleanupAuthState();
    
    // Perform the actual signout
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear state
    setUser(null);
    setSession(null);
    setProfile(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Force page reload for a clean state
    window.location.href = '/login';
  };

  const updateProfile = async (data: any) => {
    try {
      console.log('Updating profile with data:', data);
      
      if (!user?.id) {
        console.error('Cannot update profile: No user ID available');
        return { error: new Error('No user ID available') };
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (!error) {
        console.log('Profile updated successfully');
        setProfile(prevProfile => ({ ...prevProfile, ...data }));
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      } else {
        console.error('Error updating profile:', error);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
      }

      return { error };
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
