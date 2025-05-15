
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ambulance, Bell, BedDouble, Clock } from 'lucide-react';

const HospitalStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Ambulance className="mr-2 h-5 w-5 text-blue-600" />
            Incoming Cases
          </CardTitle>
          <CardDescription>Active ambulances en route</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">3</div>
          <div className="text-sm text-muted-foreground">ETA: 5-12 minutes</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <BedDouble className="mr-2 h-5 w-5 text-blue-600" />
            Available Beds
          </CardTitle>
          <CardDescription>Critical resources tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">21/50</div>
          <div className="text-sm text-amber-500 font-medium">ICU: Critical (1 remaining)</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-600" />
            Department Alerts
          </CardTitle>
          <CardDescription>Active notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">4</div>
          <div className="text-sm text-red-500 font-medium">1 critical alert requiring action</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalStats;
