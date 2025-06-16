
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EMSDashboard from './EMSDashboard';
import CommandCenterDashboard from './CommandCenterDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const RoleDashboardProvider: React.FC = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Unable to load user profile</p>
        </CardContent>
      </Card>
    );
  }

  switch (profile.role) {
    case 'hospital':
      // Hospital dashboard is handled in HospitalPlatform
      return null;
    case 'command':
      return <CommandCenterDashboard />;
    default:
      return <EMSDashboard />;
  }
};

export default RoleDashboardProvider;
