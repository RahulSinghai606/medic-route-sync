
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
import { Hospital, Lock, AlertCircle, Mail, Loader2, User, Activity, Heart, Shield, Plus } from 'lucide-react';
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
      // Note: Don't set loading to false here as signIn will handle redirect
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
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Medical themed background */}
      <div className="absolute inset-0">
        {/* Subtle medical pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a8ff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Floating medical icons */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10 text-blue-500"
              style={{
                left: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 90 + 5}%`,
                fontSize: `${Math.random() * 20 + 15}px`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {i % 4 === 0 && <Plus />}
              {i % 4 === 1 && <Heart />}
              {i % 4 === 2 && <Activity />}
              {i % 4 === 3 && <Shield />}
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
            <p className="text-gray-600 text-lg font-medium mb-2">Emergency Response Platform</p>
            <p className="text-gray-500 text-sm">Connecting Healthcare Heroes</p>
          </div>

          {/* Medical Login Card */}
          <Card className="border-0 bg-white/90 backdrop-blur-md shadow-2xl">
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl flex items-center justify-center gap-3 text-gray-800">
                <Shield className="h-6 w-6 text-blue-600" />
                Secure Access Portal
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Sign in to access emergency response tools
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {loginError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Authentication Failed</p>
                    <p className="text-sm">{loginError}</p>
                  </div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-11 h-12 bg-white border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-500" 
                              type="email" 
                              placeholder="your.email@hospital.com" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
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
                          <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password
                          </FormLabel>
                          <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                            Forgot password?
                          </a>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input 
                              className="pl-11 h-12 bg-white border-gray-200 text-gray-800 focus:border-blue-500 focus:ring-blue-500" 
                              type="password" 
                              placeholder="••••••••••••" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Role Selection */}
                  <FormField
                    control={form.control}
                    name="userRole"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-gray-700 font-medium">I am a</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 gap-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 border border-gray-200 rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-all">
                              <FormControl>
                                <RadioGroupItem value="paramedic" className="border-blue-500 text-blue-500" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center cursor-pointer flex-1 text-gray-800">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Paramedic / EMS</div>
                                    <div className="text-xs text-gray-500">Emergency medical services</div>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 border border-gray-200 rounded-lg p-4 hover:bg-green-50 cursor-pointer transition-all">
                              <FormControl>
                                <RadioGroupItem value="hospital" className="border-green-500 text-green-500" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center cursor-pointer flex-1 text-gray-800">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-green-100 rounded-lg">
                                    <Hospital className="h-5 w-5 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Hospital Staff</div>
                                    <div className="text-xs text-gray-500">Hospital administration</div>
                                  </div>
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-500" />
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
                            className="border-blue-500 data-[state=checked]:bg-blue-500"
                          />
                        </FormControl>
                        <FormLabel className="text-gray-700 font-medium leading-none cursor-pointer">
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
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">Emergency Access</span>
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
              
              <p className="text-xs text-center text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Emergency access requires supervisor approval
              </p>
              
              <div className="w-full text-center pt-2">
                <p className="text-base text-gray-600">
                  Need an account?{" "}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
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
