
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
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          try {
            await fetchProfile(currentSession.user.id);
          } catch (error) {
            console.error('Error fetching profile during auth state change:', error);
          }
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          try {
            await fetchProfile(currentSession.user.id);
          } catch (error) {
            console.error('Error fetching profile during initialization:', error);
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

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
        // Try to get role from user metadata as fallback
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.user_metadata?.role) {
          const profileData = {
            id: userId,
            role: user.user.user_metadata.role,
            full_name: user.user.user_metadata.full_name || user.user.email,
          };
          setProfile(profileData);
          console.log('Using metadata profile:', profileData);
        }
      } else {
        console.log('Profile data retrieved:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'paramedic') => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
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
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: fullName,
              role: role,
            });
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }
        
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
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      setIsLoading(true);
      
      console.log('Attempting sign in for:', email, 'with role:', role);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        console.error('Login error details:', error);
        
        let errorMessage = "Please check your credentials and try again.";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please check your email and click the confirmation link before signing in.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many login attempts. Please wait a moment and try again.";
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
        return { error };
      } else {
        console.log('Login successful, user:', data.user?.id);
        
        if (data.user) {
          // Fetch or create profile
          let { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError || !profileData) {
            console.log('Creating new profile for user:', data.user.id);
            // Create profile if it doesn't exist
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({ 
                id: data.user.id, 
                role: role || data.user.user_metadata?.role || 'paramedic',
                full_name: data.user.user_metadata?.full_name || data.user.email
              })
              .select()
              .single();
              
            if (insertError) {
              console.error('Error creating profile:', insertError);
            } else {
              profileData = newProfile;
            }
          } else if (role && role !== profileData.role) {
            // Update role if specified and different
            console.log('Updating user role to:', role);
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .update({ role: role })
              .eq('id', data.user.id)
              .select()
              .single();
            profileData = updatedProfile;
          }
          
          setProfile(profileData);
          
          toast({
            title: "Login successful",
            description: `Welcome back to TERO!`,
          });
          
          // Force page refresh to ensure clean state
          setTimeout(() => {
            if (profileData?.role === 'hospital') {
              window.location.href = '/hospital-platform';
            } else {
              window.location.href = '/';
            }
          }, 100);
        }
      }
      
      return { error };
    } catch (error: any) {
      setIsLoading(false);
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
    cleanupAuthState();
    await supabase.auth.signOut({ scope: 'global' });
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
      console.log('Updating profile with data:', data);
      
      if (!user?.id) {
        console.error('Cannot update profile: No user ID available');
        return { error: new Error('No user ID available') };
      }
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ ...data, id: user.id })
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
