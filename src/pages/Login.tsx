
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would authenticate the user here
    navigate('/');
  };

  const handleEmergencyAccess = () => {
    // In a real app, we would implement quick emergency access
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emergency mb-4">
            <Ambulance className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">EmergConnect</h1>
          <p className="text-gray-500">Ambulance-Side Web Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your work email" required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <a href="#" className="text-xs text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input id="password" type="password" placeholder="Your password" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me for 12 hours
                </label>
              </div>
              <Button type="submit" className="w-full medical-btn">
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              onClick={handleEmergencyAccess}
              className="mt-4 w-full emergency-btn flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Emergency Quick Access
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Emergency access requires post-event authentication
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
