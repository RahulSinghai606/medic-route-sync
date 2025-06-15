
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Ambulance, Bell, BedDouble, Clock, Users, Activity, AlertTriangle, Heart } from 'lucide-react';

const HospitalStats = () => {
  // Mock real-time data that would come from hospital systems
  const bedAvailability = {
    icu: { available: 1, total: 8, critical: true },
    emergency: { available: 4, total: 12, critical: false },
    general: { available: 23, total: 45, critical: false },
    surgery: { available: 2, total: 6, critical: false }
  };

  const incomingCases = [
    { id: 1, eta: 3, severity: 'critical', type: 'Cardiac Arrest' },
    { id: 2, eta: 7, severity: 'high', type: 'Motor Vehicle Accident' },
    { id: 3, eta: 12, severity: 'medium', type: 'Respiratory Distress' }
  ];

  const departmentAlerts = [
    { dept: 'ICU', message: 'Only 1 bed remaining', severity: 'critical' },
    { dept: 'Emergency', message: 'High patient volume', severity: 'warning' },
    { dept: 'Surgery', message: 'Room 3 equipment check needed', severity: 'info' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical Patients</p>
                <p className="text-2xl font-bold text-red-700">12</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Incoming Ambulances</p>
                <p className="text-2xl font-bold text-blue-700">3</p>
              </div>
              <Ambulance className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Available Beds</p>
                <p className="text-2xl font-bold text-green-700">30</p>
              </div>
              <BedDouble className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-700">4</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bed Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-blue-600" />
              Bed Availability
            </CardTitle>
            <CardDescription>Real-time bed status by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(bedAvailability).map(([dept, data]) => (
              <div key={dept} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize flex items-center gap-2">
                    {dept.toUpperCase()}
                    {data.critical && (
                      <Badge variant="destructive" className="text-xs">Critical</Badge>
                    )}
                  </span>
                  <span className="text-sm font-bold">
                    {data.available}/{data.total}
                  </span>
                </div>
                <Progress 
                  value={(data.available / data.total) * 100} 
                  className={`h-2 ${data.critical ? 'bg-red-100' : 'bg-green-100'}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Incoming Cases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-blue-600" />
              Incoming Cases
            </CardTitle>
            <CardDescription>Ambulances en route to hospital</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {incomingCases.map((case_item) => (
              <div key={case_item.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{case_item.type}</p>
                    <p className="text-xs text-gray-500">ETA: {case_item.eta} minutes</p>
                  </div>
                  <Badge 
                    variant={case_item.severity === 'critical' ? 'destructive' : 
                             case_item.severity === 'high' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {case_item.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Department Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Department Alerts
            </CardTitle>
            <CardDescription>Active notifications requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {departmentAlerts.map((alert, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{alert.dept}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {alert.severity === 'critical' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    {alert.severity === 'warning' && (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    {alert.severity === 'info' && (
                      <Activity className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalStats;
