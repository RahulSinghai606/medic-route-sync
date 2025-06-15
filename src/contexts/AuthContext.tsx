
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user && event === 'SIGNED_IN') {
          setTimeout(async () => {
            await fetchProfile(currentSession.user.id);
            setIsLoading(false);
          }, 100);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
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
        },
      });
      
      if (error) {
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
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      } else {
        console.log('Login successful, user:', data.user?.id);
        
        if (data.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          let userRole = profileData?.role || data.user.user_metadata?.role || role;
          
          if (role && role !== userRole) {
            const { error: updateError } = await supabase
              .from('profiles')
              .upsert({ 
                id: data.user.id, 
                role: role,
                full_name: profileData?.full_name || data.user.user_metadata?.full_name || data.user.email
              });
              
            if (!updateError) {
              userRole = role;
            }
          }
          
          console.log('Final user role for redirect:', userRole);
          
          setTimeout(() => {
            if (userRole === 'hospital') {
              console.log('Redirecting to hospital platform');
              window.location.href = '/hospital-platform';
            } else {
              console.log('Redirecting to paramedic dashboard');
              window.location.href = '/';
            }
          }, 500);
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back to TERO!",
        });
      }
      
      return { error };
    } catch (error: any) {
      setIsLoading(false);
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
