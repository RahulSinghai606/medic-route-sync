
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Lock, Hospital, AlertCircle, Building2, Loader2, Shield, Heart, Activity, Plus, Stethoscope } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ThemeToggle from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  role: z.enum(['paramedic', 'hospital'], { 
    required_error: 'Please select your role' 
  }),
  hospitalName: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine(
  data => data.role !== 'hospital' || (data.hospitalName && data.hospitalName.length > 0), 
  {
    message: 'Hospital/Organization name is required',
    path: ['hospitalName'],
  }
);

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user && profile) {
      redirectBasedOnRole(profile.role);
    }
  }, [user, profile, navigate]);

  const redirectBasedOnRole = (role: string) => {
    if (role === 'hospital') {
      navigate('/hospital-platform');
    } else {
      navigate('/');
    }
  };

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'paramedic',
      hospitalName: '',
    },
  });

  const selectedRole = form.watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setSignupError(null);
    
    try {
      let fullName = data.fullName;
      
      if (data.role === 'hospital' && data.hospitalName) {
        fullName = `${data.fullName} (${data.hospitalName})`;
      }
      
      const { error } = await signUp(data.email, data.password, fullName, data.role);
      if (!error) {
        toast({
          title: "Registration successful",
          description: "Please login with your new credentials",
        });
        navigate('/login');
      } else {
        setSignupError(error.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setSignupError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Medical background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a8ff' fill-opacity='0.4'%3E%3Cpath d='M30 28h4v4h-4z M26 28h4v4h-4z M30 24h4v4h-4z M30 32h4v4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Floating medical icons */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-5 dark:opacity-10 text-blue-500 dark:text-blue-400"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                fontSize: `${Math.random() * 15 + 10}px`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {i % 5 === 0 && <Plus />}
              {i % 5 === 1 && <Heart />}
              {i % 5 === 2 && <Activity />}
              {i % 5 === 3 && <Shield />}
              {i % 5 === 4 && <Stethoscope />}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Medical Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-green-600 to-teal-600 shadow-xl mx-auto">
                <Plus className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
              TERO
            </h1>
            <p className="text-muted-foreground text-lg font-medium mb-2">Emergency Response Platform</p>
            <p className="text-muted-foreground/70 text-sm">Join the Healthcare Network</p>
          </div>

          <Card className="border-0 bg-background/80 dark:bg-background/90 backdrop-blur-md shadow-2xl">
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Create Your Account
              </CardTitle>
              <CardDescription className="text-base">
                Join TERO to access emergency response tools
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {signupError && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-700 dark:text-red-400 flex items-start gap-3 mb-6">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Registration Error</p>
                    <p className="text-sm">{signupError}</p>
                  </div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Role Selection */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="font-medium">I am registering as</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-all">
                              <FormControl>
                                <RadioGroupItem value="paramedic" className="border-blue-500 text-blue-500" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center cursor-pointer flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Paramedic / EMS Staff</div>
                                    <div className="text-xs text-muted-foreground">Emergency medical services</div>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                            
                            <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer transition-all">
                              <FormControl>
                                <RadioGroupItem value="hospital" className="border-green-500 text-green-500" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center cursor-pointer flex-1">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                                    <Hospital className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Hospital Staff</div>
                                    <div className="text-xs text-muted-foreground">Hospital administration</div>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input 
                              className="pl-11 h-12 focus:border-primary focus:ring-primary" 
                              placeholder="Enter your full name" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hospital Name (conditionally shown) */}
                  {selectedRole === 'hospital' && (
                    <FormField
                      control={form.control}
                      name="hospitalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Hospital/Organization Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                              <Input 
                                className="pl-11 h-12 focus:border-primary focus:ring-primary" 
                                placeholder="e.g., Apollo Hospital, City Medical Center"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input 
                              className="pl-11 h-12 focus:border-primary focus:ring-primary" 
                              type="email" 
                              placeholder="your.email@hospital.com" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input 
                              className="pl-11 h-12 focus:border-primary focus:ring-primary" 
                              type="password" 
                              placeholder="••••••••••••" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input 
                              className="pl-11 h-12 focus:border-primary focus:ring-primary" 
                              type="password" 
                              placeholder="••••••••••••" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all shadow-lg font-semibold" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-center pb-8">
              <p className="text-base">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
