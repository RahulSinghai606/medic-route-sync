
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
import { Ambulance, Lock, AlertCircle, Mail, Loader2, Hospital, User, IdCard, Clock, Truck, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  remember: z.boolean().default(false),
  userRole: z.enum(['paramedic', 'hospital'], {
    required_error: "Please select your role",
  }),
  // Extended profile fields
  fullName: z.string().min(2, { message: 'Full name is required (minimum 2 characters)' }),
  specificRole: z.string().min(1, { message: 'Please specify your role' }),
  hospitalAffiliation: z.string().min(1, { message: 'Hospital affiliation is required' }),
  vehicleId: z.string().optional(),
  shiftTime: z.string().min(1, { message: 'Please select your shift time' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const mysuruHospitals = [
  'JSS Hospital Mysuru',
  'Apollo BGS Hospitals Mysuru',
  'Columbia Asia Hospital Mysuru',
  'Vikram Hospital Mysuru',
  'Care Hospital Mysuru',
  'Basappa Memorial Hospital',
  'KR Hospital',
  'Other'
];

const mandyaHospitals = [
  'Mandya Institute of Medical Sciences',
  'District Hospital Mandya',
  'Adichunchanagiri Hospital',
  'Sri Siddhartha Medical College Hospital',
  'Private Nursing Homes Mandya',
  'Other'
];

const specificRoles = {
  paramedic: ['Senior Paramedic', 'Junior Paramedic', 'Emergency Medical Technician', 'First Responder'],
  hospital: ['Emergency Doctor', 'Nurse', 'Receptionist', 'Administrator', 'Technician']
};

const shiftTimes = [
  '06:00 - 14:00 (Morning)',
  '14:00 - 22:00 (Evening)', 
  '22:00 - 06:00 (Night)',
  '24 Hours On-Call',
  'Flexible Schedule'
];

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<'mysuru' | 'mandya'>('mysuru');
  const { toast } = useToast();
  
  useEffect(() => {
    if (user && profile) {
      redirectBasedOnRole(profile.role);
    }
  }, [user, profile, navigate]);

  const redirectBasedOnRole = (role: string) => {
    if (role === 'hospital') {
      navigate('/hospital-platform');
      console.log("Redirecting to hospital platform");
    } else {
      navigate('/');
      console.log("Redirecting to paramedic dashboard");
    }
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
      userRole: 'paramedic',
      fullName: '',
      specificRole: '',
      hospitalAffiliation: '',
      vehicleId: '',
      shiftTime: '',
    },
  });

  const watchedUserRole = form.watch('userRole');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log(`Logging in with role: ${data.userRole}`);
      const { error } = await signIn(data.email, data.password, data.userRole);
      
      if (error) {
        console.error("Login error:", error);
        setLoginError(error.message || "Failed to sign in. Please check your credentials.");
      } else {
        // Store additional profile data in Supabase
        await updateUserProfile(data);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.fullName}! You are logged in as ${data.specificRole}`,
        });
        
        redirectBasedOnRole(data.userRole);
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: LoginFormValues) => {
    // This would update the user profile with additional details
    // Implementation would depend on your Supabase schema
    console.log('Updating profile with:', {
      fullName: data.fullName,
      specificRole: data.specificRole,
      hospitalAffiliation: data.hospitalAffiliation,
      vehicleId: data.vehicleId,
      shiftTime: data.shiftTime,
      city: selectedCity
    });
  };

  const handleEmergencyAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  const availableHospitals = selectedCity === 'mysuru' ? mysuruHospitals : mandyaHospitals;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-medical/10 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-medical to-emergency mb-4 shadow-lg">
            <Ambulance className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-medical to-emergency bg-clip-text text-transparent">TERO</h1>
          <p className="text-lg text-muted-foreground font-medium">Triage and Emergency Routing Optimization</p>
          <p className="text-sm text-muted-foreground mt-1">Medical Services Platform for Karnataka</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-300 mb-6 flex items-start gap-3 border border-red-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Login Error</p>
                  <p className="text-sm">{loginError}</p>
                </div>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Basic Login Fields */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-11 h-12 text-base" type="email" placeholder="your.email@hospital.com" {...field} />
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
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-base font-medium">Password</FormLabel>
                        <a href="#" className="text-sm text-medical hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-11 h-12 text-base" type="password" placeholder="••••••••" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="userRole"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">Select your role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="paramedic" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center cursor-pointer">
                              <Ambulance className="mr-2 h-5 w-5 text-medical" />
                              Paramedic
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="hospital" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center cursor-pointer">
                              <Hospital className="mr-2 h-5 w-5 text-medical" />
                              Hospital Staff
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Collapsible Professional Details Section */}
                <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="font-medium text-base">Professional Details</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-5 pt-5">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                              <Input className="pl-11 h-12 text-base" placeholder="Dr. Rajesh Kumar" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Specific Role */}
                    <FormField
                      control={form.control}
                      name="specificRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Specific Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder={`Select your ${watchedUserRole} role`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specificRoles[watchedUserRole]?.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* City Selection */}
                    <div className="space-y-3">
                      <label className="text-base font-medium">Working Location</label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={selectedCity === 'mysuru' ? 'default' : 'outline'}
                          className="h-12"
                          onClick={() => setSelectedCity('mysuru')}
                        >
                          Mysuru
                        </Button>
                        <Button
                          type="button"
                          variant={selectedCity === 'mandya' ? 'default' : 'outline'}
                          className="h-12"
                          onClick={() => setSelectedCity('mandya')}
                        >
                          Mandya
                        </Button>
                      </div>
                    </div>

                    {/* Hospital Affiliation */}
                    <FormField
                      control={form.control}
                      name="hospitalAffiliation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Hospital Affiliation</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder={`Select hospital in ${selectedCity}`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableHospitals.map((hospital) => (
                                <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Vehicle ID - Only for Paramedics */}
                    {watchedUserRole === 'paramedic' && (
                      <FormField
                        control={form.control}
                        name="vehicleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">Vehicle ID</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Truck className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input className="pl-11 h-12 text-base" placeholder="AMB-001" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Shift Time */}
                    <FormField
                      control={form.control}
                      name="shiftTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Shift Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Select your shift" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {shiftTimes.map((shift) => (
                                <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>
                
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-base font-medium leading-none cursor-pointer">
                        Remember me for 12 hours
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full h-12 text-base medical-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In to TERO"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-background px-3 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button
              onClick={handleEmergencyAccess}
              className="w-full h-12 emergency-btn flex items-center gap-2 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Emergency Quick Access
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Emergency access requires post-event authentication
            </p>
            <div className="w-full text-center">
              <p className="text-base text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-medical hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
