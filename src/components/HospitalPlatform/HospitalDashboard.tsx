
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import HospitalStats from './HospitalStats';
import CaseFeed from './CaseFeed';
import DepartmentStatus from './DepartmentStatus';
import RecentNotifications from './RecentNotifications';

const HospitalDashboard: React.FC = () => {
  const { profile } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
          <p className="text-muted-foreground">Live monitoring and case management</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex gap-1 items-center px-3 py-1">
            <Clock className="h-3 w-3" />
            <span>Updated: Just now</span>
          </Badge>
        </div>
      </div>
      
      <HospitalStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CaseFeed />
        </div>

        <div className="space-y-6">
          <DepartmentStatus />
          <RecentNotifications />
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
