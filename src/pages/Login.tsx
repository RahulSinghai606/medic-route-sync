
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, Lock, AlertCircle, Mail, Loader2, Activity, Heart, Shield, Plus, Stethoscope, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  remember: z.boolean().default(false),
  userRole: z.enum(['paramedic', 'hospital'], {
    required_error: "Please select your role",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user && profile) {
      console.log('User role detected on login page:', profile.role);
      redirectBasedOnRole(profile.role);
    }
  }, [user, profile, navigate]);

  const redirectBasedOnRole = (role: string) => {
    console.log('Redirecting based on role:', role);
    if (role === 'hospital') {
      console.log("Redirecting to hospital platform");
      window.location.href = '/hospital-platform';
    } else {
      console.log("Redirecting to paramedic dashboard");
      window.location.href = '/';
    }
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
      userRole: 'paramedic',
    },
  });

  const watchedUserRole = form.watch('userRole');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log(`Attempting login with role: ${data.userRole}`);
      const { error } = await signIn(data.email, data.password, data.userRole);
      
      if (error) {
        console.error("Login error:", error);
        setLoginError(error.message || "Failed to sign in. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setLoginError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmergencyAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Medical themed background */}
      <div className="absolute inset-0">
        {/* Subtle medical pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a8ff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Floating medical icons */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-5 dark:opacity-10 text-blue-500 dark:text-blue-400"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                fontSize: `${Math.random() * 20 + 15}px`,
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

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
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
            <p className="text-muted-foreground/70 text-sm">Connecting Healthcare Heroes</p>
          </div>

          {/* Medical Login Card */}
          <Card className="border-0 bg-background/80 dark:bg-background/90 backdrop-blur-md shadow-2xl">
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Secure Access Portal
              </CardTitle>
              <CardDescription className="text-base">
                Sign in to access emergency response tools
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {loginError && (
                <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-4 rounded-lg text-red-700 dark:text-red-400 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Authentication Failed</p>
                    <p className="text-sm">{loginError}</p>
                    <p className="text-xs mt-2 opacity-80">
                      If you just created an account, please check your email for a confirmation link.
                    </p>
                  </div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Role Selection */}
                  <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="font-medium">I am signing in as</FormLabel>
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
                                    <div className="font-medium">Paramedic / EMS</div>
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

                  {/* Email Field */}
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
                  
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="font-medium flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password
                          </FormLabel>
                          <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                            Forgot password?
                          </a>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input 
                              className="pl-11 pr-11 h-12 focus:border-primary focus:ring-primary" 
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-primary data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                        <FormLabel className="font-medium leading-none cursor-pointer">
                          Keep me signed in
                        </FormLabel>
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pb-8">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-background px-4 text-muted-foreground font-medium">Emergency Access</span>
                </div>
              </div>
              
              <Button
                onClick={handleEmergencyAccess}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all shadow-lg flex items-center gap-2 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Initiating emergency access...
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    Emergency Override
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Emergency access requires supervisor approval
              </p>
              
              <div className="w-full text-center pt-2">
                <p className="text-base">
                  Need an account?{" "}
                  <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Request Access
                  </Link>
                </p>
              </div>
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

export default Login;
