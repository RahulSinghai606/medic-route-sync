
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Users, Activity, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

const CommandCenterDashboard: React.FC = () => {
  const cityWideStats = {
    totalHospitals: 12,
    activeCases: 23,
    averageResponse: '7.2min',
    systemLoad: 78
  };

  const hospitalStatus = [
    { name: 'City General', beds: { total: 150, available: 23 }, status: 'Normal', load: 85 },
    { name: 'Metro Hospital', beds: { total: 200, available: 8 }, status: 'High Load', load: 96 },
    { name: 'Regional Medical', beds: { total: 300, available: 45 }, status: 'Normal', load: 70 },
    { name: 'University Hospital', beds: { total: 180, available: 12 }, status: 'Moderate', load: 89 }
  ];

  const resourceAllocation = [
    { resource: 'ICU Beds', total: 120, available: 23, utilization: 81 },
    { resource: 'Ventilators', total: 85, available: 12, utilization: 86 },
    { resource: 'OR Rooms', total: 45, available: 8, utilization: 82 },
    { resource: 'Ambulances', total: 25, available: 4, utilization: 84 }
  ];

  return (
    <div className="space-y-6">
      {/* Command Center Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emergency Command Center</h1>
          <p className="text-muted-foreground">Multi-hospital overview and resource allocation</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Activity className="h-4 w-4 mr-1" />
            System Operational
          </Badge>
          <Button variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alert Center
          </Button>
        </div>
      </div>

      {/* City-wide Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hospitals</p>
                <p className="text-2xl font-bold">{cityWideStats.totalHospitals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Cases</p>
                <p className="text-2xl font-bold">{cityWideStats.activeCases}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{cityWideStats.averageResponse}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">System Load</p>
                <p className="text-2xl font-bold">{cityWideStats.systemLoad}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hospitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hospitals">Hospital Status</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          <TabsTrigger value="analytics">Real-time Analytics</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="hospitals" className="space-y-4">
          <div className="grid gap-4">
            {hospitalStatus.map((hospital, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{hospital.name}</h3>
                        <Badge variant={
                          hospital.status === 'Normal' ? 'default' :
                          hospital.status === 'High Load' ? 'destructive' : 'secondary'
                        }>
                          {hospital.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Total Beds: {hospital.beds.total}</span>
                        <span>Available: {hospital.beds.available}</span>
                        <span>Load: {hospital.load}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          hospital.load > 90 ? 'bg-red-500' :
                          hospital.load > 80 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${hospital.load}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4">
            {resourceAllocation.map((resource, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{resource.resource}</h3>
                    <Badge variant="outline">{resource.utilization}% Utilized</Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
                    <span>Total: {resource.total}</span>
                    <span>Available: {resource.available}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        resource.utilization > 90 ? 'bg-red-500' :
                        resource.utilization > 80 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${resource.utilization}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced analytics and predictive modeling coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">High Load Alert</p>
                    <p className="text-sm text-red-600">Metro Hospital at 96% capacity</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800">Resource Warning</p>
                    <p className="text-sm text-amber-600">ICU beds running low city-wide</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommandCenterDashboard;
