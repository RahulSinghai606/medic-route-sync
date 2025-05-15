
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, User, Mail, Lock, Hospital, AlertCircle, Building2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ThemeToggle from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
  role: z.enum(['paramedic', 'hospital'], { 
    required_error: 'Please select your role' 
  }),
  hospitalName: z.string().optional(),
  department: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine(
  data => data.role !== 'hospital' || (data.hospitalName && data.hospitalName.length > 0), 
  {
    message: 'Hospital name is required for hospital staff',
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
    // Redirect based on role if user is already logged in
    if (user && profile) {
      redirectBasedOnRole(profile.role);
    }
  }, [user, profile, navigate]);

  const redirectBasedOnRole = (role: string) => {
    console.log(`Redirecting based on role: ${role}`);
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
      department: '',
    },
  });

  const selectedRole = form.watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setSignupError(null);
    
    try {
      console.log(`Signing up with role: ${data.role}`);
      let fullName = data.fullName;
      
      // For hospital users, combine hospital name with department
      if (data.role === 'hospital' && data.hospitalName) {
        fullName = data.hospitalName;
        if (data.department) {
          fullName += ` - ${data.department}`;
        }
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emergency mb-4">
            <Ambulance className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">TERO</h1>
          <p className="text-muted-foreground">Triage and Emergency Routing Optimization</p>
          <p className="text-xs text-muted-foreground mt-1">Medical Services Platform</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Enter your information to sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signupError && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300 mb-4 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Registration Error</p>
                  <p className="text-sm">{signupError}</p>
                </div>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>I am registering as</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="paramedic" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Ambulance className="h-4 w-4 mr-2 text-emergency" />
                              Paramedic Staff
                            </FormLabel>
                          </FormItem>
                          
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="hospital" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center">
                              <Hospital className="h-4 w-4 mr-2 text-blue-600" />
                              Hospital Staff
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedRole === 'hospital' && (
                  <>
                    <FormField
                      control={form.control}
                      name="hospitalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hospital Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-10" 
                                placeholder="e.g., General Hospital, City Medical Center"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hospital className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-10" 
                                placeholder="e.g., Emergency Department, ICU"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{selectedRole === 'hospital' ? 'Admin Full Name' : 'Full Name'}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            className="pl-10" 
                            placeholder={selectedRole === 'hospital' ? "Hospital administrator name" : "Your full name"} 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="email" placeholder="name@example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="password" placeholder="******" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" type="password" placeholder="******" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full medical-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-medical hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
