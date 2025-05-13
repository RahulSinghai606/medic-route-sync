
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HospitalLayout from '@/components/Layout/HospitalLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ambulance, Bell, ClipboardList, Clock, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HospitalDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
      
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
              <ClipboardList className="mr-2 h-5 w-5 text-blue-600" />
              Pending Handoffs
            </CardTitle>
            <CardDescription>Cases awaiting hospital staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">7</div>
            <div className="text-sm text-muted-foreground">2 critical cases</div>
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
            <div className="text-sm text-muted-foreground">1 requiring action</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Case Feed</CardTitle>
              <CardDescription>Real-time updates from inbound ambulances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-3 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="font-medium">Case #{1000 + i}</span>
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Critical</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Male, 62y - Suspected cardiac event
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>ETA: {i * 4} minutes</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Prepare
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Hospital Resources</CardTitle>
              <CardDescription>Current availability status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Emergency Beds</span>
                <span className="text-sm font-medium">3/12 Available</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                <div className="bg-yellow-500 h-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">ICU Beds</span>
                <span className="text-sm font-medium">1/8 Available</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                <div className="bg-red-500 h-full" style={{ width: '87.5%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Operating Rooms</span>
                <span className="text-sm font-medium">2/4 Available</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '50%' }}></div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full">View All Resources</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for routes
const CasesDashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Case Dashboard</h1>
    <p>Hospital cases management interface would be displayed here.</p>
  </div>
);

const CaseHandoffs = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Case Handoffs</h1>
    <p>Interface for managing case handoffs from ambulances to hospital staff.</p>
  </div>
);

const Departments = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Hospital Departments</h1>
    <p>Department management and coordination interface would be displayed here.</p>
  </div>
);

const HospitalPlatform = () => {
  const { profile } = useAuth();

  return (
    <HospitalLayout>
      <Routes>
        <Route index element={<HospitalDashboard />} />
        <Route path="cases" element={<CasesDashboard />} />
        <Route path="handoffs" element={<CaseHandoffs />} />
        <Route path="departments" element={<Departments />} />
      </Routes>
    </HospitalLayout>
  );
};

export default HospitalPlatform;
