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
import { Ambulance, Lock, AlertCircle, Mail, Loader2, Hospital, User, Clock, Truck, ChevronDown, Shield, Heart, Activity, Users, Rocket, Satellite, Zap, Globe } from 'lucide-react';
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
  paramedic: ['Senior Paramedic', 'Junior Paramedic', 'Emergency Medical Technician', 'First Responder', 'Ambulance Driver'],
  hospital: ['Emergency Doctor', 'Nurse', 'Receptionist', 'Administrator', 'Technician', 'Department Head']
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
      console.log('User role detected:', profile.role);
      redirectBasedOnRole(profile.role);
    }
  }, [user, profile, navigate]);

  const redirectBasedOnRole = (role: string) => {
    if (role === 'hospital') {
      console.log("Redirecting to hospital platform");
      navigate('/hospital-platform', { replace: true });
    } else {
      console.log("Redirecting to paramedic dashboard");
      navigate('/', { replace: true });
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

  const availableHospitals = selectedCity === 'mysuru' ? mysuruHospitals : mandyaHospitals;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Futuristic Animated Background */}
      <div className="absolute inset-0">
        {/* Space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Large rotating ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Futuristic Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              {/* Glowing ring around logo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 shadow-2xl mx-auto">
                <Rocket className="h-10 w-10 text-white" />
              </div>
              {/* Orbiting satellites */}
              <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2 animate-spin origin-bottom" style={{ transformOrigin: '50% 64px', animationDuration: '3s' }}>
                  <Satellite className="h-2 w-2" />
                </div>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full -translate-x-1/2 animate-spin origin-bottom" style={{ transformOrigin: '50% 64px', animationDuration: '4s', animationDirection: 'reverse' }}>
                  <Zap className="h-2 w-2" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 tracking-wider">
              TERO
            </h1>
            <p className="text-blue-300 text-xl font-light tracking-wide mb-2">Advanced Emergency Response</p>
            <p className="text-blue-400/80 text-sm flex items-center justify-center gap-2">
              <Globe className="h-4 w-4" />
              Next-Generation Medical Command Center
              <Activity className="h-4 w-4 animate-pulse" />
            </p>
          </div>

          {/* Futuristic Login Card */}
          <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-50 animate-pulse"></div>
            <div className="absolute inset-[1px] bg-black/80 rounded-xl"></div>
            
            <div className="relative z-10">
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl flex items-center justify-center gap-3 text-white">
                  <Shield className="h-6 w-6 text-blue-400" />
                  Mission Access Portal
                </CardTitle>
                <CardDescription className="text-blue-300/80 text-base">
                  Secure authentication for medical personnel
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {loginError && (
                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 rounded-xl text-red-300 border border-red-500/30 flex items-start gap-3 backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Authentication Failed</p>
                      <p className="text-sm opacity-90">{loginError}</p>
                    </div>
                  </div>
                )}
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Enhanced Login Fields */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-300 font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Command ID (Email)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400/60" />
                              <Input 
                                className="pl-11 h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-blue-400/50 focus:border-blue-400 focus:bg-white/10 transition-all backdrop-blur-sm" 
                                type="email" 
                                placeholder="your.command@tero.net" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-blue-300 font-medium flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Security Key
                            </FormLabel>
                            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                              Forgot key?
                            </a>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400/60" />
                              <Input 
                                className="pl-11 h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-blue-400/50 focus:border-blue-400 focus:bg-white/10 transition-all backdrop-blur-sm" 
                                type="password" 
                                placeholder="••••••••••••" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    {/* Enhanced Role Selection */}
                    <FormField
                      control={form.control}
                      name="userRole"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-blue-300 font-medium">Mission Role</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-4"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 border border-blue-500/30 rounded-xl p-4 hover:bg-blue-500/10 cursor-pointer transition-all hover:border-blue-400/50 backdrop-blur-sm">
                                <FormControl>
                                  <RadioGroupItem value="paramedic" className="border-blue-400 text-blue-400" />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center cursor-pointer flex-1 text-white">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                                      <Ambulance className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                      <div className="font-medium">Field Operative</div>
                                      <div className="text-xs text-blue-400/70">Emergency Response Unit</div>
                                    </div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 border border-purple-500/30 rounded-xl p-4 hover:bg-purple-500/10 cursor-pointer transition-all hover:border-purple-400/50 backdrop-blur-sm">
                                <FormControl>
                                  <RadioGroupItem value="hospital" className="border-purple-400 text-purple-400" />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center cursor-pointer flex-1 text-white">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
                                      <Hospital className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                      <div className="font-medium">Medical Station</div>
                                      <div className="text-xs text-purple-400/70">Hospital Command Center</div>
                                    </div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Professional Details Section */}
                    <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl hover:from-blue-500/20 hover:to-purple-500/20 transition-all border border-blue-500/20 backdrop-blur-sm">
                        <span className="font-medium text-blue-300 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Personnel Details
                        </span>
                        <ChevronDown className={`h-5 w-5 transition-transform text-blue-400 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-5 pt-5">
                        {/* Full Name */}
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-300 font-medium">Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-5 w-5 text-blue-400/60" />
                                  <Input 
                                    className="pl-11 h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-blue-400/50 focus:border-blue-400 backdrop-blur-sm" 
                                    placeholder="Dr. Mission Commander" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        {/* Specific Role */}
                        <FormField
                          control={form.control}
                          name="specificRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-300 font-medium">Specific Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-blue-400/50 focus:border-blue-400 backdrop-blur-sm">
                                    <SelectValue placeholder={`Select your ${watchedUserRole} role`} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-black/50 backdrop-blur-sm border border-blue-500/30 text-white">
                                  {specificRoles[watchedUserRole]?.map((role) => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        {/* City Selection */}
                        <div className="space-y-3">
                          <label className="text-blue-300 font-medium">Operation Zone</label>
                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              type="button"
                              variant={selectedCity === 'mysuru' ? 'default' : 'outline'}
                              className={`h-12 ${selectedCity === 'mysuru' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0' 
                                : 'bg-white/5 border-blue-500/30 text-blue-300 hover:bg-blue-500/10'
                              }`}
                              onClick={() => setSelectedCity('mysuru')}
                            >
                              Mysuru Sector
                            </Button>
                            <Button
                              type="button"
                              variant={selectedCity === 'mandya' ? 'default' : 'outline'}
                              className={`h-12 ${selectedCity === 'mandya' 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0' 
                                : 'bg-white/5 border-blue-500/30 text-blue-300 hover:bg-blue-500/10'
                              }`}
                              onClick={() => setSelectedCity('mandya')}
                            >
                              Mandya Sector
                            </Button>
                          </div>
                        </div>

                        {/* Hospital Affiliation */}
                        <FormField
                          control={form.control}
                          name="hospitalAffiliation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-blue-300 font-medium">Medical Station</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-blue-400/50 focus:border-blue-400 backdrop-blur-sm">
                                    <SelectValue placeholder={`Select station in ${selectedCity}`} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-black/50 backdrop-blur-sm border border-blue-500/30 text-white">
                                  {availableHospitals.map((hospital) => (
                                    <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
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
                                <FormLabel className="text-blue-300 font-medium">Unit Identifier</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Truck className="absolute left-3 top-3 h-5 w-5 text-blue-400/60" />
                                    <Input 
                                      className="pl-11 h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-blue-400/50 focus:border-blue-400 backdrop-blur-sm" 
                                      placeholder="UNIT-742" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-red-400" />
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
                              <FormLabel className="text-blue-300 font-medium">Operational Timeframe</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-12 bg-white/5 border-blue-500/30 text-white placeholder:text-blue-400/50 focus:border-blue-400 backdrop-blur-sm">
                                    <SelectValue placeholder="Select timeframe" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-black/50 backdrop-blur-sm border border-blue-500/30 text-white">
                                  {shiftTimes.map((shift) => (
                                    <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <FormField
                      control={form.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 bg-white/5 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                          <FormControl>
                            <Checkbox 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-blue-400 data-[state=checked]:bg-blue-500"
                            />
                          </FormControl>
                          <FormLabel className="text-blue-300 font-medium leading-none cursor-pointer flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Maintain session for 12 hours
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full h-14 text-base bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all shadow-lg border-0 font-semibold tracking-wide" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Authenticating Mission Control...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-5 w-5" />
                          Initialize Mission Access
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pb-8">
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-blue-500/30" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-black/80 px-4 text-blue-400/80 font-medium tracking-wider">Emergency Protocol</span>
                  </div>
                </div>
                
                <Button
                  onClick={handleEmergencyAccess}
                  className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all shadow-lg flex items-center gap-2 text-base border-0 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Initiating emergency protocol...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      Emergency Override Access
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-blue-400/60 flex items-center justify-center gap-1 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30 backdrop-blur-sm">
                  <AlertCircle className="h-3 w-3 text-yellow-400" />
                  Emergency access requires post-mission verification
                </p>
                
                <div className="w-full text-center pt-2">
                  <p className="text-base text-blue-300/80">
                    Need mission credentials?{" "}
                    <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      Request TERO Access
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

export default Login;
