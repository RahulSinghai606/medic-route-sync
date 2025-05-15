
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Activity, Bell } from 'lucide-react';

const RecentNotifications: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
        <CardDescription>Updates from departments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 p-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">ICU Bed Shortage</p>
            <p className="text-xs">Only 1 ICU bed available. Please prioritize cases.</p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70">10 minutes ago</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-md">
          <Activity className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Cardiac Team Alert</p>
            <p className="text-xs text-muted-foreground">Cardiac catheterization lab prepped for incoming MI case.</p>
            <p className="text-xs text-muted-foreground">25 minutes ago</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-2 rounded-md">
          <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Shift Change Reminder</p>
            <p className="text-xs text-muted-foreground">ED shift change at 19:00. Please complete handoffs.</p>
            <p className="text-xs text-muted-foreground">1 hour ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNotifications;
